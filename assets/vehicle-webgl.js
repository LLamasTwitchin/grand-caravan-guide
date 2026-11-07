/* Local, approximate educational vehicle viewer. Three.js and OrbitControls are bundled beside index.html. */
(function(){
  const canvas=document.getElementById('van-canvas'),fallbackCanvas=document.getElementById('fallback-canvas'),wrap=document.getElementById('scene-wrap');
  const profile=window.activeVehicleProfile,ui=window.vehicleGuideUi,warning=document.getElementById('scene-render-warning');
  let disposeWebGL=()=>{};
  const showFallback=()=>{disposeWebGL();delete window.vehicleWebGLApi;if(canvas)canvas.style.display='none';if(fallbackCanvas)fallbackCanvas.style.display='block';if(warning)warning.style.display='block';const list=document.getElementById('component-fallback'),toggle=document.getElementById('orbit-toggle');if(list)list.style.display='flex';if(toggle)toggle.setAttribute('aria-pressed','false');const tag=document.getElementById('scene-tag');if(tag)tag.textContent='CANVAS FALLBACK / APPROXIMATE MODEL';setTimeout(()=>window.dispatchEvent(new Event('resize')),0);};
  window.addEventListener('error',function(e){if(e.filename&&e.filename.indexOf('vehicle-webgl.js')!==-1){showFallback();setTimeout(()=>window.dispatchEvent(new Event('resize')),0);}});
  if(!canvas||!profile||!window.THREE||!THREE.OrbitControls||!ui){showFallback();return;}
  let renderer;
  try{renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});}catch(err){showFallback();return;}
  try{
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.6));
    renderer.setSize(wrap.clientWidth,wrap.clientHeight,false);
    renderer.outputEncoding=THREE.sRGBEncoding;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=.82;
    renderer.shadowMap.enabled=true;
    renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  }catch(err){showFallback();return;}

  const scene=new THREE.Scene();
  scene.background=new THREE.Color('#182124');
  const camera=new THREE.PerspectiveCamera(36,1,.1,100);
  const controls=new THREE.OrbitControls(camera,canvas);
  controls.enableDamping=true;controls.dampingFactor=.075;controls.enablePan=true;
  controls.minDistance=4.2;controls.maxDistance=13;controls.minPolarAngle=.12;controls.maxPolarAngle=1.52;
  controls.autoRotate=false;controls.autoRotateSpeed=1.0;

  scene.add(new THREE.HemisphereLight('#e3eeee','#202526',.72));
  const key=new THREE.DirectionalLight('#fff2df',1.0);key.position.set(-4,7,-5);key.castShadow=true;key.shadow.mapSize.set(2048,2048);key.shadow.camera.left=-5;key.shadow.camera.right=5;key.shadow.camera.top=5;key.shadow.camera.bottom=-5;key.shadow.bias=-.00035;scene.add(key);
  const fill=new THREE.DirectionalLight('#91c6c5',.45);fill.position.set(5,3,4);scene.add(fill);
  const rim=new THREE.PointLight('#ff9a5f',.22,12);rim.position.set(0,3,-3);scene.add(rim);
  // Small procedural studio environment gives paint and metal readable reflections without remote assets.
  const envCanvas=document.createElement('canvas');envCanvas.width=512;envCanvas.height=256;const envCtx=envCanvas.getContext('2d');
  const envGrad=envCtx.createLinearGradient(0,0,0,256);envGrad.addColorStop(0,'#78878c');envGrad.addColorStop(.48,'#414d51');envGrad.addColorStop(1,'#111719');envCtx.fillStyle=envGrad;envCtx.fillRect(0,0,512,256);
  envCtx.fillStyle='#879491';envCtx.fillRect(55,38,72,118);envCtx.fillRect(192,26,42,145);envCtx.fillRect(380,49,88,102);envCtx.fillStyle='#8a503d';envCtx.fillRect(275,71,20,95);envCtx.fillStyle='#293538';envCtx.fillRect(0,188,512,68);
  const envMap=new THREE.CanvasTexture(envCanvas);envMap.mapping=THREE.EquirectangularReflectionMapping;envMap.encoding=THREE.sRGBEncoding;scene.environment=envMap;

  const mat=(color,roughness=.55,metalness=.05,extra={})=>new THREE.MeshStandardMaterial({color,roughness,metalness,...extra});
  const palette=profile.model.palette||{};
  const paint=new THREE.MeshPhysicalMaterial({color:palette.body||'#641116',roughness:.34,metalness:.14,clearcoat:.38,clearcoatRoughness:.32}),dark=mat('#1c2325',.72,.08),glass=mat('#244252',.14,.26,{transparent:true,opacity:.86,depthWrite:false}),sideWindowGlass=mat('#182328',.3,.08),rubber=mat('#101416',.8,.01),alloy=mat('#858e8b',.32,.62),wheelFinish=mat(palette.wheel||'#858e8b',.32,.62),trim=mat('#272e30',.48,.24),bright=mat('#b2bab5',.3,.68),lamp=mat('#f7e3ae',.2,.12,{emissive:'#9b7140',emissiveIntensity:.28}),red=mat('#a8413a',.24,.12,{emissive:'#39100f',emissiveIntensity:.28}),bayBase=mat('#202a2c',.84,.12),bayEngine=mat('#53635e',.76,.12),bayBattery=mat('#a78d47',.48,.22),bayTipm=mat('#b75435',.5,.12),bayAbs=mat('#76646a',.65,.12),bayRear=mat('#4e8177',.62,.12),bayAlt=mat('#787c9b',.42,.35);
  // Calibrate wheelbase and track against published 2012 body dimensions.
  const root=new THREE.Group();root.scale.set(1.16,.73,1);scene.add(root);
  const modelLength=4.4,dimensionScale=modelLength/5.151;
  const axleFront=-modelLength/2+.961*dimensionScale;
  const axleRear=axleFront+3.078*dimensionScale;
  const trackFront=(1.666*dimensionScale/2)/root.scale.x;
  const trackRear=(1.647*dimensionScale/2)/root.scale.x;
  // 17-inch reference wheel/tire proportions; the VIN-specific option is not confirmed.
  const tireRadius=((17*25.4+2*225*.65)/2000)*dimensionScale;
  const wheelCenterY=(tireRadius+.075)/root.scale.y;
  const bodyGroup=new THREE.Group(),bayGroup=new THREE.Group(),markerGroup=new THREE.Group(),wireframeGroup=new THREE.Group();root.add(bodyGroup,bayGroup,markerGroup);scene.add(wireframeGroup);
  const wheelGroups=[];let wireframeOn=false,xrayOn=false;
  const meshesByPart={};
  function groupFor(id){if(!meshesByPart[id]){meshesByPart[id]=new THREE.Group();meshesByPart[id].userData.componentId=id;bayGroup.add(meshesByPart[id]);}return meshesByPart[id];}
  function box(parent,size,position,material,id=null,bevel=.025){
    const geo=new THREE.BoxGeometry(size[0],size[1],size[2]);
    const mesh=new THREE.Mesh(geo,material);mesh.position.set(position[0],position[1],position[2]);mesh.castShadow=true;mesh.receiveShadow=true;
    if(id){mesh.material=material.clone();mesh.userData.componentId=id;mesh.userData.baseEmissive=mesh.material.emissiveIntensity||0;groupFor(id).add(mesh);}else parent.add(mesh);
    return mesh;
  }
  function line(parent,points,material){const geo=new THREE.BufferGeometry().setFromPoints(points.map(p=>new THREE.Vector3(...p)));const obj=new THREE.Line(geo,material);parent.add(obj);return obj;}
  function panel(parent,points,material){const vertices=points.flat(),indices=[];for(let i=1;i<points.length-1;i++)indices.push(0,i,i+1);const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geo.setIndex(indices);geo.computeVertexNormals();const mesh=new THREE.Mesh(geo,material);mesh.material.side=THREE.DoubleSide;mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
  function roundedBlock(parent,w,h,d,pos,material,r=.045){const s=new THREE.Shape();s.moveTo(-w/2+r,-h/2);s.lineTo(w/2-r,-h/2);s.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);s.lineTo(w/2,h/2-r);s.quadraticCurveTo(w/2,h/2,w/2-r,h/2);s.lineTo(-w/2+r,h/2);s.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);s.lineTo(-w/2,-h/2+r);s.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);const g=new THREE.ExtrudeGeometry(s,{depth:d,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.025,bevelThickness:.022});const m=new THREE.Mesh(g,material);m.position.set(pos[0],pos[1],pos[2]-d/2);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}

  // Photo-matched side silhouette with open wheel arches, taller cabin, and long rear overhang.
  const archY=wheelCenterY,archRadiusZ=tireRadius+.055,archRadiusY=(tireRadius+.032)/root.scale.y,archBottom=.27;
  const sideShape=new THREE.Shape();
  sideShape.moveTo(-2.2,archBottom);sideShape.lineTo(-2.2,.68);sideShape.quadraticCurveTo(-2.18,.82,-2.04,.9);sideShape.lineTo(-1.68,1.04);sideShape.lineTo(-1.39,1.67);sideShape.quadraticCurveTo(-1.22,1.91,-.91,1.92);sideShape.lineTo(.86,1.92);sideShape.quadraticCurveTo(1.1,1.92,1.32,1.72);sideShape.lineTo(1.99,1.45);sideShape.quadraticCurveTo(2.19,1.35,2.2,1.1);sideShape.lineTo(2.2,archBottom);
  function addOpenArch(shape,centerZ){const start=-Math.asin((archY-archBottom)/archRadiusY),end=Math.PI-start,steps=32;for(let i=0;i<=steps;i++){const a=start+(end-start)*i/steps;shape.lineTo(centerZ+archRadiusZ*Math.cos(a),archY+archRadiusY*Math.sin(a));}}
  addOpenArch(sideShape,axleRear);
  sideShape.lineTo(axleFront+archRadiusZ*Math.cos(Math.asin((archY-archBottom)/archRadiusY)),archBottom);
  addOpenArch(sideShape,axleFront);sideShape.closePath();
  // Real openings in the side shell align with glass panes and the interior seating.
  const sideWindowCuts=[[[ -1.39,1.51],[-1.08,1.77],[-.49,1.77],[-.49,1.49],[-.98,1.42],[-1.31,1.42]],[[-.4,1.76],[.48,1.76],[.48,1.5],[-.4,1.5]],[[.57,1.72],[1.37,1.66],[1.36,1.44],[.57,1.49]]];
  for(const pts of sideWindowCuts){const hole=new THREE.Path();hole.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)hole.lineTo(pts[i][0],pts[i][1]);hole.closePath();sideShape.holes.push(hole);}
  const shellGeometry=new THREE.ExtrudeGeometry(sideShape,{depth:1.48,bevelEnabled:true,bevelSegments:5,steps:1,bevelSize:.038,bevelThickness:.035});
  const shellPositions=shellGeometry.attributes.position;
  for(let i=0;i<shellPositions.count;i++){
    const y=shellPositions.getY(i),depth=shellPositions.getZ(i),taper=y<.5?.94:y<1.42?1:THREE.MathUtils.lerp(1,.93,THREE.MathUtils.clamp((y-1.42)/.5,0,1));
    shellPositions.setZ(i,.74+(depth-.74)*taper);
  }
  shellPositions.needsUpdate=true;shellGeometry.computeVertexNormals();
  const shell=new THREE.Mesh(shellGeometry,paint);
  shell.rotation.y=-Math.PI/2;shell.position.x=.74;shell.castShadow=true;shell.receiveShadow=true;bodyGroup.add(shell);
  roundedBlock(bodyGroup,1.42,.14,3.96,[0,.48,.02],dark,.08);
  // Hood, roof crown, glazing, bumpers, and fascia.
  roundedBlock(bodyGroup,1.43,.16,.93,[0,1.19,-1.62],paint,.09);
  roundedBlock(bodyGroup,1.27,.13,1.78,[0,1.89,.03],paint,.16);
  roundedBlock(bodyGroup,1.55,.22,.2,[0,.56,-2.13],dark,.055);roundedBlock(bodyGroup,1.55,.22,.2,[0,.59,2.08],dark,.055);
  // Subtle hood crown lines lead into the windshield cowl.
  for(const side of [-1,1])line(bodyGroup,[[side*.52,1.29,-2.02],[side*.49,1.31,-1.77],[side*.43,1.32,-1.48]],new THREE.LineBasicMaterial({color:'#8c252b',transparent:true,opacity:.48}));
  // Windshield planes follow the sloped A-pillars rather than sitting as a rectangular slab.
  const frontWind=[[ -.57,1.72,-1.38],[.57,1.72,-1.38],[.53,1.28,-1.79],[-.53,1.28,-1.79]];
  panel(bodyGroup,frontWind,glass);line(bodyGroup,[...frontWind,frontWind[0]],new THREE.LineBasicMaterial({color:'#bcc8c6',transparent:true,opacity:.78}));
  const rearWind=[[-.53,1.63,1.39],[.53,1.63,1.39],[.55,1.22,1.77],[-.55,1.22,1.77]];
  panel(bodyGroup,rearWind,glass);line(bodyGroup,[...rearWind,rearWind[0]],new THREE.LineBasicMaterial({color:'#bcc8c6',transparent:true,opacity:.7}));
  // Side glazing is divided into driver, sliding-door, and rear-quarter panes with rubber surrounds.
  for(const side of [-1,1]){
    const xAt=(y)=>{const taper=y<.5?.94:y<1.42?1:THREE.MathUtils.lerp(1,.93,THREE.MathUtils.clamp((y-1.42)/.5,0,1));return side*(.74*taper+.05);};
    const panes=[[[1.51,-1.39],[1.77,-1.08],[1.77,-.49],[1.49,-.49],[1.42,-.98],[1.42,-1.31]],[[1.76,-.4],[1.76,.48],[1.5,.48],[1.5,-.4]],[[1.72,.57],[1.66,1.37],[1.44,1.36],[1.49,.57]]];
    for(const pane of panes){const pts=pane.map(([y,z])=>[xAt(y),y,z]);panel(bodyGroup,pts,sideWindowGlass);line(bodyGroup,[...pts,pts[0]],new THREE.LineBasicMaterial({color:'#829095',transparent:true,opacity:.7}));}
    const x=side*.76;
    // A-, B-, and C-pillars frame the three side-glass sections.
    line(bodyGroup,[[side*.75,1.25,-1.8],[side*.75,1.52,-1.53],[side*.75,1.76,-1.16]],new THREE.LineBasicMaterial({color:'#272e30',transparent:true,opacity:.95}));
    box(bodyGroup,[.045,.34,.075],[side*.78,1.62,-.44],dark);
    box(bodyGroup,[.045,.31,.075],[side*.78,1.6,.525],dark);
    box(bodyGroup,[.045,.34,.08],[side*.73,1.54,1.43],dark);
    roundedBlock(bodyGroup,.22,.15,.28,[side*.87,1.43,-1.4],dark,.055);
    panel(bodyGroup,[[side*.988,1.42,-1.51],[side*.988,1.42,-1.3],[side*.988,1.47,-1.32],[side*.988,1.47,-1.5]],glass);
    box(bodyGroup,[.018,.018,.13],[side*.89,1.39,-1.39],lamp);
    line(bodyGroup,[[side*.76,1.43,-1.48],[side*.86,1.43,-1.4]],new THREE.LineBasicMaterial({color:'#a7b8b4'}));
    // Door divisions, sliding rail and discrete handles.
    const seam=new THREE.LineBasicMaterial({color:'#263234',transparent:true,opacity:.92});
    line(bodyGroup,[[x,.29,-.16],[x,1.47,-.16]],seam);line(bodyGroup,[[x,.29,1.00],[x,1.45,1.00]],seam);
    line(bodyGroup,[[x,1.49,-.18],[x,1.49,1.0]],new THREE.LineBasicMaterial({color:'#bac7c2',transparent:true,opacity:.7}));
    roundedBlock(bodyGroup,.035,.045,.19,[side*.79,1.27,-.02],alloy,.018);roundedBlock(bodyGroup,.035,.045,.19,[side*.79,1.27,.77],alloy,.018);
    box(bodyGroup,[.03,.13,.06],[side*.77,.96,-1.8],lamp);box(bodyGroup,[.03,.14,.07],[side*.77,.91,1.88],red);
    // Sliding-door guide rail, lower body molding, rocker trim, and subtle shoulder crease.
    line(bodyGroup,[[side*.8,1.48,-.22],[side*.8,1.48,.98]],new THREE.LineBasicMaterial({color:'#d0d2cb',transparent:true,opacity:.6}));
    line(bodyGroup,[[side*.8,.9,-.21],[side*.8,.9,1.0]],new THREE.LineBasicMaterial({color:'#d9c6a3',transparent:true,opacity:.42}));
    box(bodyGroup,[.035,.12,2.2],[side*.75,.28,.35],dark);
    line(bodyGroup,[[side*.56,1.98,-.83],[side*.56,1.98,.94]],new THREE.LineBasicMaterial({color:'#ced3cf',transparent:true,opacity:.6}));
  }
  // The fuel-filler door sits on the vehicle's left rear quarter.
  const fillerDoor=new THREE.Mesh(new THREE.TorusGeometry(.095,.008,6,32),new THREE.MeshStandardMaterial({color:'#6c171b',roughness:.5}));fillerDoor.rotation.y=Math.PI/2;fillerDoor.position.set(-.735,1.08,1.62);bodyGroup.add(fillerDoor);
  // Crosshair grille, Dodge badge, layered headlamp lenses, fog lamps, and rear lamp stacks.
  roundedBlock(bodyGroup,.72,.34,.08,[0,.96,-2.22],bright,.065);roundedBlock(bodyGroup,.62,.25,.085,[0,.96,-2.265],dark,.035);
  box(bodyGroup,[.05,.25,.1],[0,.96,-2.31],bright);box(bodyGroup,[.62,.045,.1],[0,.96,-2.315],bright);
  for(let i=0;i<5;i++)box(bodyGroup,[.48,.012,.055],[0,.875+i*.043,-2.32],trim);
  roundedBlock(bodyGroup,.2,.09,.025,[0,.96,-2.34],red,.025);
  for(const side of [-1,1]){
    roundedBlock(bodyGroup,.37,.17,.075,[side*.53,1.01,-2.19],lamp,.055);
    box(bodyGroup,[.22,.018,.085],[side*.53,.98,-2.235],bright);
    roundedBlock(bodyGroup,.14,.09,.06,[side*.53,.70,-2.17],lamp,.035);
    roundedBlock(bodyGroup,.35,.34,.08,[side*.55,.96,2.16],red,.08);
    box(bodyGroup,[.23,.035,.09],[side*.55,1.03,2.205],lamp);
    box(bodyGroup,[.22,.035,.09],[side*.55,.89,2.205],red);
  }
  roundedBlock(bodyGroup,1.5,.32,.12,[0,.76,-2.15],paint,.07);
  roundedBlock(bodyGroup,.92,.13,.07,[0,.57,-2.23],dark,.035);
  for(let i=0;i<3;i++)box(bodyGroup,[.78,.012,.035],[0,.53+i*.035,-2.27],trim);
  // Tailgate seams, handle, rear plate pocket, and wiper.
  line(bodyGroup,[[-.68,.61,2.13],[.68,.61,2.13]],new THREE.LineBasicMaterial({color:'#273033'}));
  roundedBlock(bodyGroup,.23,.05,.035,[0,1.22,2.18],bright,.02);roundedBlock(bodyGroup,.46,.19,.045,[0,.78,2.18],dark,.03);
  box(bodyGroup,[.045,.025,.03],[0,1.65,1.91],dark);
  // Roof rails and antenna.
  for(const side of [-1,1]){line(bodyGroup,[[side*.48,2.01,-.74],[side*.48,2.01,.94]],new THREE.LineBasicMaterial({color:'#99a5a2'}));for(const z of [-.63,.83])box(bodyGroup,[.19,.045,.07],[side*.48,1.99,z],trim);}
  line(bodyGroup,[[.39,2.01,1.1],[.48,2.15,1.38]],new THREE.LineBasicMaterial({color:'#252c2e'}));
  // Twin windshield wipers rest along the lower glass edge.
  for(const side of [-1,1])line(bodyGroup,[[side*.06,1.25,-1.78],[side*.46,1.30,-1.63]],new THREE.LineBasicMaterial({color:'#161c1e'}));

  // A restrained cabin silhouette visible through the glass: dashboard, three rows, and steering wheel.
  const cabin=new THREE.Group();bodyGroup.add(cabin);
  const upholstery=mat(palette.interior||'#30383a',.88,.02),seatInsert=mat(palette.interior||'#30383a',.92,.01);seatInsert.color.multiplyScalar(1.16);
  roundedBlock(cabin,1.07,.18,.27,[0,1.02,-1.38],dark,.06);roundedBlock(cabin,.34,.11,.08,[0,1.08,-1.45],trim,.025);
  const steering=new THREE.Mesh(new THREE.TorusGeometry(.13,.016,10,32),trim);steering.position.set(-.35,1.04,-1.12);steering.rotation.z=-.16;cabin.add(steering);
  line(cabin,[[-.35,1.04,-1.12],[-.35,.87,-1.29]],new THREE.LineBasicMaterial({color:'#343a3b'}));
  roundedBlock(cabin,.24,.24,.39,[0,.78,-.91],dark,.05);
  // 2/2/3 seating matches the published 2012 accommodation layout.
  const seatRows=[{z:-.88,xs:[-.34,.34]},{z:-.02,xs:[-.34,.34]},{z:.85,xs:[-.46,0,.46]}];
  for(const row of seatRows)for(const x of row.xs){
    roundedBlock(cabin,.34,.13,.39,[x,.68,row.z],upholstery,.055);
    roundedBlock(cabin,.34,.43,.16,[x,.94,row.z+.14],upholstery,.06);
    roundedBlock(cabin,.22,.13,.12,[x,1.22,row.z+.17],seatInsert,.045);
    roundedBlock(cabin,.25,.018,.26,[x,.75,row.z],seatInsert,.035);
  }

  // Dimensional 17-inch tires, correctly spaced axles/tracks, and split-spoke alloy faces.
  for(const axle of [{name:'front',z:axleFront,track:trackFront},{name:'rear',z:axleRear,track:trackRear}])for(const side of [-1,1]){
    const archPoints=[];const start=-Math.asin((archY-archBottom)/archRadiusY),end=Math.PI-start;
    for(let i=0;i<=40;i++){const a=start+(end-start)*i/40;archPoints.push(new THREE.Vector3(side*.742,archY+archRadiusY*Math.sin(a),axle.z+archRadiusZ*Math.cos(a)));}
    const archCurve=new THREE.CatmullRomCurve3(archPoints);const archTrim=new THREE.Mesh(new THREE.TubeGeometry(archCurve,48,.018,6,false),dark);bodyGroup.add(archTrim);
    const wheel=new THREE.Group();wheel.position.set(side*axle.track,wheelCenterY,axle.z);wheel.scale.y=1/root.scale.y;wheel.userData.side=side;wheel.userData.axle=axle.name;wheel.userData.z=axle.z;wheel.userData.track=axle.track;root.add(wheel);wheelGroups.push(wheel);
    const tireWidth=225/1000*dimensionScale/root.scale.x;
    const tire=new THREE.Mesh(new THREE.CylinderGeometry(tireRadius,tireRadius,tireWidth,48,1,false),rubber);tire.rotation.z=Math.PI/2;tire.castShadow=true;tire.receiveShadow=true;wheel.add(tire);
    const sidewall=new THREE.Mesh(new THREE.TorusGeometry(tireRadius*.82,.014,10,56),trim);sidewall.rotation.y=Math.PI/2;sidewall.position.x=side*.5*tireWidth;wheel.add(sidewall);
    const rotorRadius=.184,rotor=new THREE.Mesh(new THREE.CylinderGeometry(rotorRadius,rotorRadius,.035,48),alloy);rotor.rotation.z=Math.PI/2;rotor.position.x=side*.44*tireWidth;wheel.add(rotor);
    const hub=new THREE.Mesh(new THREE.CylinderGeometry(.176,.176,.055,48),wheelFinish);hub.rotation.z=Math.PI/2;hub.position.x=side*.50*tireWidth;wheel.add(hub);
    // Ten split spokes echo the five paired spokes visible in the supplied photographs.
    for(let i=0;i<10;i++){const a=i*Math.PI*2/10,spoke=new THREE.Mesh(new THREE.BoxGeometry(.035,.18,.055),wheelFinish);spoke.position.set(side*.53*tireWidth,Math.cos(a)*.105,Math.sin(a)*.105);spoke.rotation.x=-a;wheel.add(spoke);if(i%2===0){const lug=new THREE.Mesh(new THREE.CylinderGeometry(.018,.018,.07,12),dark);lug.rotation.z=Math.PI/2;lug.position.set(side*.56*tireWidth,Math.cos(a)*.145,Math.sin(a)*.145);wheel.add(lug);}}
    const cap=new THREE.Mesh(new THREE.CylinderGeometry(.062,.062,.075,28),trim);cap.rotation.z=Math.PI/2;cap.position.x=side*.55*tireWidth;wheel.add(cap);
    const caliper=new THREE.Mesh(new THREE.BoxGeometry(.035,.11,.09),red);caliper.position.set(side*.34*tireWidth,.06,.14);wheel.add(caliper);
    for(const dx of [-.045,0,.045]){const groove=new THREE.Mesh(new THREE.TorusGeometry(tireRadius-.008,.005,6,48),dark);groove.rotation.y=Math.PI/2;groove.position.x=dx;wheel.add(groove);}
    for(let i=0;i<36;i++){const a=i*Math.PI*2/36,tread=new THREE.Mesh(new THREE.BoxGeometry(tireWidth*.78,.014,.035),dark);tread.position.set(0,(tireRadius-.002)*Math.sin(a),(tireRadius-.002)*Math.cos(a));tread.rotation.x=-a;wheel.add(tread);}
  }

  // Simplified underbody massing; forms are selectable but are not factory CAD or service locations.
  const underbodyGroup=new THREE.Group();root.add(underbodyGroup);
  const undertray=mat('#2b3031',.9,.12),underFrame=mat('#555d5e',.76,.26),exhaustMetal=mat('#8a908f',.44,.62),tankMat=mat('#33393a',.82,.08),springMat=mat('#a2aaa8',.42,.55);
  function underPart(id){if(!meshesByPart[id]){meshesByPart[id]=new THREE.Group();meshesByPart[id].userData.componentId=id;underbodyGroup.add(meshesByPart[id]);}return meshesByPart[id];}
  function underMat(id,material){const group=underPart(id);group.userData.materials||={};const key=material.uuid;return group.userData.materials[key]||(group.userData.materials[key]=material.clone());}
  function underTube(parent,points,radius,material){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,36,radius,8,false),material);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
  roundedBlock(underbodyGroup,.42,.045,1.5,[-.39,.29,-.02],undertray,.06);roundedBlock(underbodyGroup,.42,.045,1.5,[.39,.29,-.02],undertray,.06);
  const tank=underPart('fuelTank');roundedBlock(tank,.94,.12,.96,[0,.38,.48],underMat('fuelTank',tankMat),.1);
  const transaxle=underPart('transaxle');roundedBlock(transaxle,.6,.28,.62,[0,.34,axleFront+.12],underMat('transaxle',underFrame),.08);
  for(const side of [-1,1])underTube(transaxle,[[side*.2,.31,axleFront],[side*.42,.31,axleFront-.03],[side*.66,.34,axleFront]],.035,underMat('transaxle',exhaustMetal));
  roundedBlock(underbodyGroup,1.06,.09,.13,[0,.34,axleFront+.08],underFrame,.035);
  const exhaust=underPart('exhaust');
  underTube(exhaust,[[0,.30,-1.35],[.1,.27,-1.08],[.14,.26,-.7],[.11,.26,-.25],[.08,.26,.25],[.1,.26,.82],[.13,.26,1.25],[.17,.26,1.72]],.035,underMat('exhaust',exhaustMetal));
  const catalytic=new THREE.Mesh(new THREE.CylinderGeometry(.13,.15,.28,24),underMat('exhaust',exhaustMetal));catalytic.rotation.x=Math.PI/2;catalytic.position.set(.1,.28,-.97);exhaust.add(catalytic);
  roundedBlock(exhaust,.48,.14,.56,[-.08,.27,1.47],underMat('exhaust',exhaustMetal),.08);underTube(exhaust,[[.16,.26,1.67],[.25,.26,1.9],[.42,.27,2.12]],.035,underMat('exhaust',exhaustMetal));
  roundedBlock(underPart('frontSuspension'),1.06,.09,.13,[0,.34,axleFront+.08],underMat('frontSuspension',underFrame),.035);
  roundedBlock(underPart('rearSuspension'),1.22,.09,.12,[0,.30,axleRear],underMat('rearSuspension',underFrame),.04);
  for(const side of [-1,1]){
    const front=underPart('frontSuspension'),rear=underPart('rearSuspension');
    underTube(rear,[[side*.58,.37,axleRear-.46],[side*.66,.29,axleRear-.22],[side*.66,.29,axleRear]],.045,underMat('rearSuspension',underFrame));
    underTube(front,[[side*.52,.34,axleFront-.12],[side*.62,.31,axleFront],[side*.48,.30,axleFront+.24]],.038,underMat('frontSuspension',underFrame));
    underTube(front,[[side*.46,.26,axleFront-.12],[side*.63,.7,axleFront]],.036,underMat('frontSuspension',underFrame));
    underTube(front,[[side*.62,.31,axleFront],[side*.46,.32,axleFront+.22],[0,.32,axleFront+.29]],.023,underMat('frontSuspension',springMat));
    const shock=new THREE.Mesh(new THREE.CylinderGeometry(.03,.035,.34,12),underMat('rearSuspension',underFrame));shock.position.set(side*.61,.43,axleRear-.08);shock.rotation.z=side*.15;rear.add(shock);
    const coilPoints=[];for(let i=0;i<=40;i++){const t=i/40,a=t*Math.PI*8;coilPoints.push(new THREE.Vector3(side*.58+.055*Math.cos(a),.29+t*.23,axleRear-.15+.055*Math.sin(a)));}
    rear.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(coilPoints),96,.009,6,false),underMat('rearSuspension',springMat)));
  }
  underTube(underPart('rearSuspension'),[[-.64,.34,axleRear-.3],[0,.34,axleRear-.22],[.64,.34,axleRear-.3]],.035,underMat('rearSuspension',underFrame));
  underTube(underPart('rearSuspension'),[[-.54,.40,axleRear-.14],[0,.40,axleRear-.04],[.54,.40,axleRear-.14]],.021,underMat('rearSuspension',springMat));

  // Under-hood blocks attach to approximate profile anchors. No wires/connectors or exact routing.
  // Structural bay rails, strut towers, firewall and radiator support give the components a believable frame.
  roundedBlock(bayGroup,1.48,.11,2.0,[0,.25,-1.27],bayBase,.055);
  for(const side of [-1,1]){
    roundedBlock(bayGroup,.11,.19,1.78,[side*.65,.36,-1.28],trim,.035);
    const tower=new THREE.Mesh(new THREE.CylinderGeometry(.22,.24,.12,32),bayBase);tower.position.set(side*.53,.43,-.82);bayGroup.add(tower);
    box(bayGroup,[.18,.24,.12],[side*.55,.5,-.3],bayBase);
  }
  roundedBlock(bayGroup,1.35,.37,.13,[0,.49,-.27],bayBase,.04);
  roundedBlock(bayGroup,1.45,.16,.15,[0,.32,-2.05],trim,.035);
  const components=profile.data.components||{};
  const anchor=(id)=>{const p=(components[id]&&components[id].pos)||[0,0,0];return new THREE.Vector3(p[0],p[2],p[1]);};
  function bayBox(id,size,material,offset=[0,0,0]){const p=anchor(id);const g=groupFor(id);box(g,size,[p.x+offset[0],p.y+offset[1],p.z+offset[2]],material,id);return g;}
  bayBox('engine',[.86,.48,.94],bayEngine,[0,0,0]);bayBox('engine',[.56,.15,.51],trim,[0,.29,0]);
  const eng=anchor('engine');for(let i=0;i<3;i++){box(groupFor('engine'),[.1,.055,.34],[eng.x-.19+i*.19,eng.y+.38,eng.z],alloy);}
  bayBox('battery',[.34,.27,.43],bayBattery);bayBox('tipm',[.37,.26,.4],bayTipm);
  const bp=anchor('battery'),tp=anchor('tipm');for(const dx of [-.11,.11]){const terminal=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,.05,12),bright);terminal.position.set(bp.x+dx,bp.y+.15,bp.z-.11);groupFor('battery').add(terminal);}
  for(let i=0;i<3;i++)box(groupFor('tipm'),[.26,.022,.025],[tp.x,tp.y+.15+i*.025,tp.z-.12],dark);
  bayBox('radiator',[1.08,.12,.16],trim,[0,-.20,-.37]);
  const fan=new THREE.Mesh(new THREE.CylinderGeometry(.30,.30,.08,40),mat('#263638',.48,.25));fan.rotation.z=Math.PI/2;const rp=anchor('radiator');fan.position.set(rp.x,rp.y-.06,rp.z-.31);groupFor('radiator').add(fan);
  for(let i=0;i<7;i++){const blade=new THREE.Mesh(new THREE.BoxGeometry(.045,.07,.26),trim);blade.position.set(rp.x+.06,rp.y-.06+Math.cos(i*Math.PI*2/7)*.14,rp.z-.31+Math.sin(i*Math.PI*2/7)*.14);blade.rotation.x=i*Math.PI*2/7;groupFor('radiator').add(blade);}
  bayBox('alternator',[.29,.27,.30],bayAlt);
  bayBox('abs',[.31,.26,.31],bayAbs);
  bayBox('rear',[.44,.34,.44],bayRear,[0,0,0]);
  bayBox('harness',[.18,.18,.9],trim,[-.52,-.18,-.10]);
  // Approximate selectable anchors: visual teaching markers, never connector symbols.
  const anchorMeshes={};
  for(const id of Object.keys(components)){
    const point=anchor(id),g=new THREE.Group();g.position.copy(point);g.userData.componentId=id;root.add(g);anchorMeshes[id]=g;
    const color=components[id].color||'#e78a50';
    const dot=new THREE.Mesh(new THREE.SphereGeometry(.075,16,12),new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:.27,transparent:true,opacity:.84}));g.add(dot);
    const ring=new THREE.Mesh(new THREE.TorusGeometry(.12,.012,6,22),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.67}));ring.rotation.x=Math.PI/2;g.add(ring);
    const hit=new THREE.Mesh(new THREE.SphereGeometry(.19,8,6),new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));hit.userData.componentId=id;g.add(hit);
  }

  // Service-bay floor, radial light pool and two restrained guide grids.
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(18,18),mat('#151b1d',.9,.04));floor.rotation.x=-Math.PI/2;floor.position.y=.07;floor.receiveShadow=true;scene.add(floor);
  const grid=new THREE.GridHelper(14,28,'#425052','#2e393b');grid.position.y=.075;grid.material.transparent=true;grid.material.opacity=.28;scene.add(grid);
  const shadow=new THREE.Mesh(new THREE.CircleGeometry(1.75,48),new THREE.MeshBasicMaterial({color:'#090d0e',transparent:true,opacity:.42}));shadow.rotation.x=-Math.PI/2;shadow.position.y=.078;shadow.scale.set(1.2,1.9,1);scene.add(shadow);

  const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();let selected=ui.getSelected(),pathLine=null,pathDashes=[],sceneMode=ui.getSceneMode(),lastWidth=0,lastHeight=0,animationFrame=0,webglFailed=false;const hiddenComponents=new Set(),reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const views=profile.model.cameraViews||{};
  const originals={exterior:{position:new THREE.Vector3(...(views.exterior?.position||[4.5,2.8,-5.4])),target:new THREE.Vector3(...(views.exterior?.target||[0,.82,0]))},underhood:{position:new THREE.Vector3(...(views.underhood?.position||[1.45,2.7,-3.85])),target:new THREE.Vector3(...(views.underhood?.target||[0,.72,-1.2]))},underside:{position:new THREE.Vector3(...(views.underside?.position||[.35,-3.55,.85])),target:new THREE.Vector3(...(views.underside?.target||[0,.34,.2]))},exploded:{position:new THREE.Vector3(6.15,3.7,-7.05),target:new THREE.Vector3(0,.62,0)}};
  function setGhostMaterials(visible){bodyGroup.traverse(o=>{if(!o.isMesh)return;if(visible){if(!o.userData.wireOriginalMaterial)o.userData.wireOriginalMaterial=o.material;if(!o.userData.wireGhostMaterial){o.userData.wireGhostMaterial=o.material.clone();o.userData.wireGhostMaterial.transparent=true;o.userData.wireGhostMaterial.opacity=o.material===glass?.12:o.material===paint?.32:.22;o.userData.wireGhostMaterial.depthWrite=false;}o.material=o.userData.wireGhostMaterial;}else if(o.userData.wireOriginalMaterial){o.material=o.userData.wireOriginalMaterial;}});}
  function refreshWireframe(){while(wireframeGroup.children.length){const o=wireframeGroup.children[0];wireframeGroup.remove(o);if(o.geometry)o.geometry.dispose();if(o.material)o.material.dispose();}wireframeGroup.visible=wireframeOn&&sceneMode!=='underhood';setGhostMaterials(wireframeGroup.visible&&sceneMode!=='underside');if(!wireframeGroup.visible)return;const edgeMat=new THREE.LineBasicMaterial({color:'#20292b',transparent:true,opacity:.94,depthTest:true});root.updateMatrixWorld(true);const targets=sceneMode==='underside'?[underbodyGroup]:[bodyGroup,cabin];for(const group of targets)group.traverse(o=>{if(o.isMesh&&o.geometry){o.updateWorldMatrix(true,false);const edges=new THREE.EdgesGeometry(o.geometry,34);const lines=new THREE.LineSegments(edges,edgeMat);lines.matrixAutoUpdate=false;lines.matrix.copy(o.matrixWorld);lines.matrixWorldNeedsUpdate=true;lines.renderOrder=5;wireframeGroup.add(lines);}});}
  function applyScene(name){sceneMode=name;const exploded=name==='exploded',underside=name==='underside',underParts=new Set(['fuelTank','transaxle','exhaust','frontSuspension','rearSuspension']);bodyGroup.position.set(0,exploded?.62:0,0);cabin.position.set(0,exploded?-1.15:0,exploded?.22:0);bayGroup.position.set(0,exploded?-.92:0,exploded?-.32:0);bayGroup.visible=name==='underhood'||exploded;bodyGroup.visible=name!=='underhood'&&!underside;cabin.visible=name!=='underhood'&&!underside;underbodyGroup.visible=underside;wheelGroups.forEach(w=>{const s=w.userData.side;w.position.set(s*(exploded?w.userData.track+.36:w.userData.track),exploded?.08:wheelCenterY,w.userData.z);});Object.entries(anchorMeshes).forEach(([id,g])=>{const p=anchor(id);const bay=['battery','tipm','engine','radiator','alternator','abs','rear'].includes(id);g.position.set(p.x,p.y+(exploded?(bay?-.92:.62):0),p.z+(exploded&&bay?-.32:0));g.visible=(underside?underParts.has(id):!underParts.has(id))&&!hiddenComponents.has(id)});floor.visible=!underside;grid.visible=!underside;shadow.visible=!underside;controls.minPolarAngle=underside?1.62:name==='underhood'?.12:.25;controls.maxPolarAngle=underside?3.02:name==='underhood'?1.38:1.48;controls.target.copy(originals[name].target);camera.position.copy(originals[name].position);controls.update();refreshWireframe();if(xrayOn)setXray(true);syncZoomSlider();updatePinPositions();}
  function resize(){const w=wrap.clientWidth,h=wrap.clientHeight;if(!w||!h)return;if(w!==lastWidth||h!==lastHeight){lastWidth=w;lastHeight=h;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);updatePinPositions();}}
  function updatePinPositions(){const buttons=document.querySelectorAll('.component-pin');buttons.forEach(b=>{const id=Object.keys(components).find(k=>components[k].label===b.textContent);if(!id)return;const pin=anchorMeshes[id]||{position:anchor(id)},pos=pin.position.clone().project(camera);const w=wrap.clientWidth,h=wrap.clientHeight;const inFrame=!hiddenComponents.has(id)&&pos.z>-1&&pos.z<1&&Math.abs(pos.x)<1.08&&Math.abs(pos.y)<1.08;b.style.visibility=inFrame?'visible':'hidden';b.style.left=`${(pos.x*.5+.5)*w}px`;b.style.top=`${(-pos.y*.5+.5)*h}px`;b.style.transform='translate(-50%,-50%)';b.setAttribute('aria-pressed',String(id===selected));});}
  function project(id,w,h){const p=(anchorMeshes[id]?.position||anchor(id)).clone().project(camera);return{x:(p.x*.5+.5)*w,y:(-p.y*.5+.5)*h};}
  function setSelection(id){selected=id;Object.entries(meshesByPart).forEach(([key,g])=>g.traverse(o=>{if(!o.isMesh||!o.material||!('emissive' in o.material))return;if(!o.userData.baseEmissiveColor)o.userData.baseEmissiveColor=o.material.emissive.clone();const base=o.userData.baseEmissive||0;if(key===id){o.material.emissive.set('#ff9a3c');o.material.emissiveIntensity=.72;}else{o.material.emissive.copy(o.userData.baseEmissiveColor);o.material.emissiveIntensity=base;}}));Object.entries(anchorMeshes).forEach(([key,g])=>{g.scale.setScalar(key===id?1.7:1);});if(ui.getShowPath())setPath(true);updatePinPositions();}
  function addRoute(group,curve,halo,coreColor,radius){
    const haloMesh=new THREE.Mesh(new THREE.TubeGeometry(curve,90,radius+.045,8,false),new THREE.MeshBasicMaterial({color:halo,transparent:true,opacity:.72,depthTest:false,depthWrite:false,toneMapped:false}));haloMesh.renderOrder=18;group.add(haloMesh);
    const casing=new THREE.Mesh(new THREE.TubeGeometry(curve,90,radius+.012,8,false),new THREE.MeshBasicMaterial({color:'#071014',depthTest:false,depthWrite:false,toneMapped:false}));casing.renderOrder=19;group.add(casing);
    const core=new THREE.Mesh(new THREE.TubeGeometry(curve,90,radius*.7,8,false),new THREE.MeshBasicMaterial({color:coreColor,depthTest:false,depthWrite:false,toneMapped:false}));core.renderOrder=20;group.add(core);
    const dashes=new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(110)),new THREE.LineDashedMaterial({color:'#ffffff',dashSize:.09,gapSize:.07,depthTest:false,depthWrite:false,toneMapped:false}));dashes.computeLineDistances();dashes.renderOrder=21;group.add(dashes);pathDashes.push(dashes);
  }
  function routeMarker(group,position,color,radius){const marker=new THREE.Mesh(new THREE.SphereGeometry(radius,16,12),new THREE.MeshBasicMaterial({color,depthTest:false,depthWrite:false,toneMapped:false}));marker.position.copy(position);marker.renderOrder=22;group.add(marker);}
  function setPath(show){
    pathDashes=[];
    if(pathLine){scene.remove(pathLine);pathLine.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material.dispose();}});pathLine=null;}
    if(!show){if(anchorMeshes[selected])anchorMeshes[selected].scale.setScalar(1.7);return;}
    // Amber supply and blue simplified return are drawn above the shell so they stay readable. The return end is near the battery for teaching only. It is not a ground-stud location.
    const dest=anchor(selected),a=anchor('battery'),b=anchor('tipm');
    const lift=(v,y)=>new THREE.Vector3(v.x,v.y+y,v.z);
    const group=new THREE.Group();
    const supply=new THREE.CatmullRomCurve3([a,lift(a,.55),b,lift(b,.55),lift(dest,.48),dest]);
    addRoute(group,supply,'#ffb000','#ffe08a',.05);
    routeMarker(group,a,'#ffd36a',.09);routeMarker(group,b,'#ff8a1e',.08);routeMarker(group,dest,'#fff6df',.09);
    if(selected!=='battery'){
      const ground=new THREE.Vector3(a.x-.22,Math.min(a.y,dest.y)-.02,a.z+.2);
      const back=new THREE.CatmullRomCurve3([dest,lift(dest,.22),new THREE.Vector3(dest.x,ground.y+.28,dest.z),ground]);
      addRoute(group,back,'#33c7ff','#e9f8ff',.038);
      routeMarker(group,ground,'#7ad7ff',.07);
    }
    pathLine=group;scene.add(pathLine);
  }
  const ZOOM_MIN=65,ZOOM_MAX=145,DISTANCE_MIN=controls.minDistance,DISTANCE_MAX=controls.maxDistance;
  function syncZoomSlider(){const input=document.getElementById('zoom-range');if(!input)return;const t=(DISTANCE_MAX-controls.getDistance())/(DISTANCE_MAX-DISTANCE_MIN);input.value=String(Math.round(ZOOM_MIN+THREE.MathUtils.clamp(t,0,1)*(ZOOM_MAX-ZOOM_MIN)));}
  function resetView(name=sceneMode){applyScene(name);syncZoomSlider();}
  function rotate(direction){const offset=camera.position.clone().sub(controls.target);offset.applyAxisAngle(new THREE.Vector3(0,1,0),direction==='left'?.22:-.22);camera.position.copy(controls.target).add(offset);controls.update();updatePinPositions();}
  function setZoom(value){const t=THREE.MathUtils.clamp((Number(value)-ZOOM_MIN)/(ZOOM_MAX-ZOOM_MIN),0,1);const wanted=DISTANCE_MAX-t*(DISTANCE_MAX-DISTANCE_MIN);const dir=camera.position.clone().sub(controls.target).normalize();camera.position.copy(controls.target).add(dir.multiplyScalar(wanted));controls.update();syncZoomSlider();updatePinPositions();}
  function setAutoOrbit(value){const toggle=document.getElementById('orbit-toggle'),note=document.getElementById('motion-note');if(reducedMotion.matches){controls.autoRotate=false;if(toggle){toggle.setAttribute('aria-pressed','false');toggle.disabled=true;toggle.title='Disabled because reduced motion is enabled.';}if(note)note.textContent='Auto orbit disabled: reduced-motion preference is on.';return false;}controls.autoRotate=Boolean(value);if(toggle){toggle.disabled=false;toggle.title='Slowly rotate the model automatically.';}if(note)note.textContent='';return controls.autoRotate;}
  function setComponentVisible(id,visible){if(meshesByPart[id])meshesByPart[id].visible=Boolean(visible);if(anchorMeshes[id])anchorMeshes[id].visible=Boolean(visible);if(visible)hiddenComponents.delete(id);else hiddenComponents.add(id);updatePinPositions();}
  function restoreAll(){[...hiddenComponents].forEach(id=>setComponentVisible(id,true));}
  function setAppearance(value={}){if(value.body){paint.color.set(value.body);palette.body=value.body;}if(value.wheel){wheelFinish.color.set(value.wheel);palette.wheel=value.wheel;}if(value.interior){upholstery.color.set(value.interior);seatInsert.color.set(value.interior).multiplyScalar(1.16);palette.interior=value.interior;}bodyGroup.traverse(o=>{if(o.userData.wireOriginalMaterial===paint&&o.userData.wireGhostMaterial)o.userData.wireGhostMaterial.color.copy(paint.color)});return{body:palette.body,wheel:palette.wheel,interior:palette.interior};}
  function rememberXray(m){if(!m||!('opacity' in m)||m.userData.xrayBaseOpacity!=null)return;m.userData.xrayBaseOpacity=m.opacity;m.userData.xrayBaseTransparent=!!m.transparent;m.userData.xrayBaseDepth=m.depthWrite!==false;}
  function restoreXray(m){if(!m||m.userData.xrayBaseOpacity==null)return;m.opacity=m.userData.xrayBaseOpacity;m.transparent=m.userData.xrayBaseTransparent;m.depthWrite=m.userData.xrayBaseDepth;m.needsUpdate=true;}
  function setXray(value){
    xrayOn=Boolean(value);
    [bodyGroup,cabin].forEach(group=>group.traverse(o=>{
      if(!o.isMesh)return;
      [o.material,o.userData.wireOriginalMaterial,o.userData.wireGhostMaterial].forEach(entry=>{
        const list=Array.isArray(entry)?entry:[entry];
        list.forEach(m=>{
          if(!m||!('opacity' in m))return;
          rememberXray(m);
          const active=entry===o.material||(Array.isArray(o.material)&&o.material.indexOf(m)>=0);
          if(xrayOn&&active){m.transparent=true;m.opacity=.16;m.depthWrite=false;m.needsUpdate=true;}
          else if(!xrayOn)restoreXray(m);
        });
      });
    }));
    return xrayOn;
  }
  function setWireframe(value){wireframeOn=Boolean(value);refreshWireframe();if(xrayOn)setXray(true);return wireframeOn;}
  function onPick(event){if(event.button!==0)return;const rect=canvas.getBoundingClientRect();pointer.x=((event.clientX-rect.left)/rect.width)*2-1;pointer.y=-((event.clientY-rect.top)/rect.height)*2+1;raycaster.setFromCamera(pointer,camera);const candidates=[...Object.values(meshesByPart),...Object.values(anchorMeshes)];const hits=raycaster.intersectObjects(candidates,true);const hit=hits.find(h=>{let o=h.object;while(o){if(o.userData&&o.userData.componentId)return true;o=o.parent;}return false;});if(hit){let o=hit.object;while(o&&!(o.userData&&o.userData.componentId))o=o.parent;if(o&&o.userData.componentId)ui.selectPart(o.userData.componentId);}}
  canvas.addEventListener('click',onPick);
  controls.addEventListener('change',()=>{updatePinPositions();syncZoomSlider()});
  window.addEventListener('resize',resize);
  canvas.addEventListener('webglcontextlost',function(e){e.preventDefault();showFallback();});
  disposeWebGL=()=>{if(webglFailed)return;webglFailed=true;if(animationFrame)cancelAnimationFrame(animationFrame);canvas.removeEventListener('click',onPick);controls.dispose();renderer.dispose();};
  function updateMotionPreference(){if(reducedMotion.matches)setAutoOrbit(false);else{const toggle=document.getElementById('orbit-toggle'),note=document.getElementById('motion-note');if(toggle){toggle.disabled=false;toggle.title='Slowly rotate the model automatically.';}if(note)note.textContent='';}}
  reducedMotion.addEventListener?reducedMotion.addEventListener('change',updateMotionPreference):reducedMotion.addListener(updateMotionPreference);
  canvas.style.display='block';fallbackCanvas.style.display='none';if(warning)warning.style.display='none';
  applyScene(sceneMode);setSelection(selected);resize();updateMotionPreference();
  function frame(){if(webglFailed)return;animationFrame=requestAnimationFrame(frame);resize();controls.update();if(pathDashes.length&&!reducedMotion.matches){const shift=performance.now()*0.001;pathDashes.forEach((line,i)=>{if(line.material)line.material.dashOffset=-(shift*(i?.22:.42));});if(anchorMeshes[selected])anchorMeshes[selected].scale.setScalar(1.7*(1+Math.sin(performance.now()/170)*.07));}renderer.render(scene,camera);updatePinPositions();}
  frame();
  window.vehicleWebGLApi={setScene:applyScene,resetView,rotate,setZoom,setAutoOrbit,setSelection,setPath,setComponentVisible,restoreAll,setWireframe,setXray,setAppearance,project};
})();
