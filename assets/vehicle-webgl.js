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
    renderer.shadowMap.enabled=true;
    renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  }catch(err){showFallback();return;}

  const scene=new THREE.Scene();
  scene.background=new THREE.Color('#182124');
  const camera=new THREE.PerspectiveCamera(36,1,.1,100);
  const controls=new THREE.OrbitControls(camera,canvas);
  controls.enableDamping=true;controls.dampingFactor=.075;controls.enablePan=true;
  controls.minDistance=4.2;controls.maxDistance=11;controls.minPolarAngle=.12;controls.maxPolarAngle=1.52;
  controls.autoRotate=false;controls.autoRotateSpeed=1.0;

  scene.add(new THREE.HemisphereLight('#e1f2f0','#273033',2.0));
  const key=new THREE.DirectionalLight('#fff0d6',3.0);key.position.set(-4,7,-5);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-5;key.shadow.camera.right=5;key.shadow.camera.top=5;key.shadow.camera.bottom=-5;key.shadow.bias=-.0005;scene.add(key);
  const fill=new THREE.DirectionalLight('#77b9bb',1.15);fill.position.set(5,3,4);scene.add(fill);
  const rim=new THREE.PointLight('#ff9a5f',.65,12);rim.position.set(0,3,-3);scene.add(rim);

  const mat=(color,roughness=.55,metalness=.05,extra={})=>new THREE.MeshStandardMaterial({color,roughness,metalness,...extra});
  const palette=profile.model.palette||{};
  const paint=mat(palette.body||'#4f8882',.3,.34),dark=mat('#273134',.76,.16),glass=mat('#233b45',.2,.4,{transparent:true,opacity:.9}),rubber=mat('#101416',.82,.02),alloy=mat('#a8b3ad',.34,.68),trim=mat('#455052',.45,.42),lamp=mat('#f3d58e',.25,.25,{emissive:'#5e461e',emissiveIntensity:.45}),red=mat('#a8413a',.3,.12,{emissive:'#39100f',emissiveIntensity:.35}),bayBase=mat('#202a2c',.84,.12),bayEngine=mat('#53635e',.76,.12),bayBattery=mat('#a78d47',.48,.22),bayTipm=mat('#b75435',.5,.12),bayAbs=mat('#76646a',.65,.12),bayRear=mat('#4e8177',.62,.12),bayAlt=mat('#787c9b',.42,.35);
  const root=new THREE.Group();scene.add(root);
  const bodyGroup=new THREE.Group(),bayGroup=new THREE.Group(),markerGroup=new THREE.Group();root.add(bodyGroup,bayGroup,markerGroup);
  const meshesByPart={};
  function groupFor(id){if(!meshesByPart[id]){meshesByPart[id]=new THREE.Group();meshesByPart[id].userData.componentId=id;bayGroup.add(meshesByPart[id]);}return meshesByPart[id];}
  function box(parent,size,position,material,id=null,bevel=.025){
    const geo=new THREE.BoxGeometry(size[0],size[1],size[2]);
    const mesh=new THREE.Mesh(geo,material);mesh.position.set(position[0],position[1],position[2]);mesh.castShadow=true;mesh.receiveShadow=true;
    if(id){mesh.material=material.clone();mesh.userData.componentId=id;mesh.userData.baseEmissive=mesh.material.emissiveIntensity||0;groupFor(id).add(mesh);}else parent.add(mesh);
    return mesh;
  }
  function line(parent,points,material){const geo=new THREE.BufferGeometry().setFromPoints(points.map(p=>new THREE.Vector3(...p)));const obj=new THREE.Line(geo,material);parent.add(obj);return obj;}

  // Long, tall side profile: an abstract minivan shape, not a factory body scan.
  const sideShape=new THREE.Shape();sideShape.moveTo(-2.18,.43);sideShape.lineTo(-2.2,.76);sideShape.lineTo(-2.02,1.02);sideShape.lineTo(-1.64,1.19);sideShape.lineTo(-1.32,1.69);sideShape.quadraticCurveTo(-1.15,1.89,-.9,1.9);sideShape.lineTo(.88,1.9);sideShape.quadraticCurveTo(1.12,1.9,1.32,1.7);sideShape.lineTo(1.94,1.46);sideShape.quadraticCurveTo(2.14,1.35,2.14,1.1);sideShape.lineTo(2.12,.43);sideShape.closePath();
  const shell=new THREE.Mesh(new THREE.ExtrudeGeometry(sideShape,{depth:1.48,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.035,bevelThickness:.035}),paint);
  shell.rotation.y=-Math.PI/2;shell.position.x=.74;shell.castShadow=true;shell.receiveShadow=true;bodyGroup.add(shell);
  box(bodyGroup,[1.42,.14,3.96],[0,.48,0],dark);
  // Hood, roof crown, bumpers, windshield and rear glass.
  box(bodyGroup,[1.42,.14,.88],[0,1.2,-1.62],paint);
  box(bodyGroup,[1.18,.11,1.72],[0,1.91,.03],paint);
  box(bodyGroup,[1.48,.22,.17],[0,.57,-2.14],dark);box(bodyGroup,[1.48,.22,.17],[0,.61,2.10],dark);
  box(bodyGroup,[1.14,.45,.08],[0,1.52,-1.36],glass);box(bodyGroup,[1.14,.34,.08],[0,1.51,1.54],glass);
  // Side glazing is divided into front, sliding-door, and rear-quarter panes.
  for(const side of [-1,1]){
    const x=side*.755;
    box(bodyGroup,[.035,.36,.67],[x,1.65,-.88],glass);
    box(bodyGroup,[.035,.38,.84],[x,1.65,.02],glass);
    box(bodyGroup,[.035,.33,.62],[x,1.58,1.03],glass);
    // Mirror housing and mount.
    box(bodyGroup,[.20,.12,.24],[side*.86,1.43,-1.40],trim);
    line(bodyGroup,[[side*.76,1.43,-1.48],[side*.86,1.43,-1.40]],new THREE.LineBasicMaterial({color:'#a7b8b4'}));
    // Door divisions, sliding rail and discrete handles.
    const seam=new THREE.LineBasicMaterial({color:'#263234',transparent:true,opacity:.92});
    line(bodyGroup,[[x,.57,-.16],[x,1.47,-.16]],seam);line(bodyGroup,[[x,.57,1.00],[x,1.45,1.00]],seam);
    line(bodyGroup,[[x,1.49,-.18],[x,1.49,1.0]],new THREE.LineBasicMaterial({color:'#bac7c2',transparent:true,opacity:.7}));
    box(bodyGroup,[.04,.035,.17],[side*.78,1.28,-.02],alloy);box(bodyGroup,[.04,.035,.17],[side*.78,1.28,.77],alloy);
    box(bodyGroup,[.03,.13,.06],[side*.77,.96,-1.8],lamp);box(bodyGroup,[.03,.14,.07],[side*.77,.91,1.88],red);
    line(bodyGroup,[[side*.51,1.98,-.78],[side*.51,1.98,1.0]],new THREE.LineBasicMaterial({color:'#c0c8c2',transparent:true,opacity:.8}));
  }
  // Front/rear fascia. Grille bars and lights are stylized, with no trim claims.
  box(bodyGroup,[.64,.25,.065],[0,.91,-2.23],dark);
  for(let i=0;i<4;i++)box(bodyGroup,[.52,.018,.074],[0,.82+i*.055,-2.24],trim);
  box(bodyGroup,[.35,.16,.07],[-.53,.97,-2.22],lamp);box(bodyGroup,[.35,.16,.07],[.53,.97,-2.22],lamp);
  box(bodyGroup,[.34,.20,.07],[-.53,.94,2.17],red);box(bodyGroup,[.34,.20,.07],[.53,.94,2.17],red);
  line(bodyGroup,[[-.58,1.26,1.9],[.58,1.26,1.9]],new THREE.LineBasicMaterial({color:'#263134'}));

  // Generic cabin massing, intentionally abstract and not a trim-specific interior.
  const cabin=new THREE.Group();bodyGroup.add(cabin);
  for(const z of [-.78,.10,.92])for(const x of [-.34,.34]){
    box(cabin,[.38,.42,.42],[x,.94,z],mat('#38474a',.86,.04));
    box(cabin,[.40,.11,.36],[x,1.2,z+.03],mat('#566565',.84,.03));
  }

  // Real 3D tires, sidewalls, alloy hubs, and modest tread blocks.
  for(const side of [-1,1])for(const z of [-1.37,1.48]){
    const wheel=new THREE.Group();wheel.position.set(side*.77,.42,z);root.add(wheel);
    const tire=new THREE.Mesh(new THREE.CylinderGeometry(.43,.43,.25,32,1,false),rubber);tire.rotation.z=Math.PI/2;tire.castShadow=true;tire.receiveShadow=true;wheel.add(tire);
    const torus=new THREE.Mesh(new THREE.TorusGeometry(.31,.018,8,32),trim);torus.rotation.y=Math.PI/2;torus.position.x=side*.135;wheel.add(torus);
    const hub=new THREE.Mesh(new THREE.CylinderGeometry(.22,.22,.27,28),alloy);hub.rotation.z=Math.PI/2;wheel.add(hub);
    const cap=new THREE.Mesh(new THREE.CylinderGeometry(.075,.075,.28,20),trim);cap.rotation.z=Math.PI/2;wheel.add(cap);
    for(let i=0;i<5;i++){const a=i*Math.PI*2/5,lug=new THREE.Mesh(new THREE.SphereGeometry(.025,8,6),dark);lug.position.set(side*.15,Math.cos(a)*.145,Math.sin(a)*.145);wheel.add(lug);}
    for(let i=0;i<20;i++){const a=i*Math.PI*2/20;const tread=new THREE.Mesh(new THREE.BoxGeometry(.27,.025,.045),trim);tread.position.set(0,Math.cos(a)*.421,Math.sin(a)*.421);tread.rotation.x=-a;wheel.add(tread);}
  }

  // Under-hood blocks attach to approximate profile anchors. No wires/connectors or exact routing.
  box(bayGroup,[1.28,.16,1.35],[0,.25,-1.5],bayBase);
  const components=profile.data.components||{};
  const anchor=(id)=>{const p=(components[id]&&components[id].pos)||[0,0,0];return new THREE.Vector3(p[0],p[2],p[1]);};
  function bayBox(id,size,material,offset=[0,0,0]){const p=anchor(id);const g=groupFor(id);box(g,size,[p.x+offset[0],p.y+offset[1],p.z+offset[2]],material,id);return g;}
  bayBox('engine',[.82,.48,.92],bayEngine,[0,0,0]);bayBox('engine',[.45,.27,.4],trim,[.26,.26,.22]);
  bayBox('battery',[.32,.26,.42],bayBattery);bayBox('tipm',[.35,.25,.38],bayTipm);
  bayBox('radiator',[1.08,.12,.16],trim,[0,-.20,-.37]);
  const fan=new THREE.Mesh(new THREE.CylinderGeometry(.30,.30,.08,32),mat('#376764',.48,.25));fan.rotation.z=Math.PI/2;const rp=anchor('radiator');fan.position.set(rp.x,rp.y-.06,rp.z-.31);groupFor('radiator').add(fan);
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
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(18,18),mat('#1a2224',.9,.04));floor.rotation.x=-Math.PI/2;floor.position.y=.07;floor.receiveShadow=true;scene.add(floor);
  const grid=new THREE.GridHelper(14,28,'#425052','#2e393b');grid.position.y=.075;grid.material.transparent=true;grid.material.opacity=.28;scene.add(grid);
  const shadow=new THREE.Mesh(new THREE.CircleGeometry(1.75,48),new THREE.MeshBasicMaterial({color:'#090d0e',transparent:true,opacity:.42}));shadow.rotation.x=-Math.PI/2;shadow.position.y=.078;shadow.scale.set(1.2,1.9,1);scene.add(shadow);

  const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();let selected=ui.getSelected(),pathLine=null,sceneMode=ui.getSceneMode(),lastWidth=0,lastHeight=0,animationFrame=0,webglFailed=false;const hiddenComponents=new Set(),reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const views=profile.model.cameraViews||{};
  const originals={exterior:{position:new THREE.Vector3(...(views.exterior?.position||[4.5,2.8,-5.4])),target:new THREE.Vector3(...(views.exterior?.target||[0,.82,0]))},underhood:{position:new THREE.Vector3(...(views.underhood?.position||[2,5.1,-2.55])),target:new THREE.Vector3(...(views.underhood?.target||[0,.65,-1.2]))}};
  function applyScene(name){sceneMode=name;bodyGroup.visible=name==='exterior';cabin.visible=name==='exterior';bayGroup.visible=name==='underhood';floor.visible=true;grid.visible=true;controls.minPolarAngle=name==='underhood'?.12:.25;controls.maxPolarAngle=name==='underhood'?1.38:1.48;controls.target.copy(originals[name].target);camera.position.copy(originals[name].position);controls.update();syncZoomSlider();updatePinPositions();}
  function resize(){const w=wrap.clientWidth,h=wrap.clientHeight;if(!w||!h)return;if(w!==lastWidth||h!==lastHeight){lastWidth=w;lastHeight=h;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);updatePinPositions();}}
  function updatePinPositions(){const buttons=document.querySelectorAll('.component-pin');buttons.forEach(b=>{const id=Object.keys(components).find(k=>components[k].label===b.textContent);if(!id)return;const pos=anchor(id).project(camera);const w=wrap.clientWidth,h=wrap.clientHeight;const inFrame=!hiddenComponents.has(id)&&pos.z>-1&&pos.z<1&&Math.abs(pos.x)<1.08&&Math.abs(pos.y)<1.08;b.style.visibility=inFrame?'visible':'hidden';b.style.left=`${(pos.x*.5+.5)*w}px`;b.style.top=`${(-pos.y*.5+.5)*h}px`;b.style.transform='translate(-50%,-50%)';b.setAttribute('aria-pressed',String(id===selected));});}
  function project(id,w,h){const p=anchor(id).project(camera);return{x:(p.x*.5+.5)*w,y:(-p.y*.5+.5)*h};}
  function setSelection(id){selected=id;Object.entries(meshesByPart).forEach(([key,g])=>g.traverse(o=>{if(o.isMesh&&o.material&&'emissive' in o.material){const base=o.userData.baseEmissive||0;o.material.emissiveIntensity=key===id?Math.max(.42,base):base;}}));Object.entries(anchorMeshes).forEach(([key,g])=>{g.scale.setScalar(key===id?1.45:1);});if(ui.getShowPath())setPath(true);updatePinPositions();}
  function setPath(show){if(pathLine){scene.remove(pathLine);pathLine=null;}if(!show)return;const dest=anchor(selected),a=anchor('battery'),b=anchor('tipm'),mid1=new THREE.Vector3(a.x,a.y+.24,a.z),mid2=new THREE.Vector3(b.x,b.y+.24,b.z),end=new THREE.Vector3(dest.x,dest.y+.24,dest.z);const geo=new THREE.BufferGeometry().setFromPoints([a,mid1,b,mid2,end]);const material=new THREE.LineDashedMaterial({color:'#74d8ba',dashSize:.14,gapSize:.08,transparent:true,opacity:.9});pathLine=new THREE.Line(geo,material);pathLine.computeLineDistances();scene.add(pathLine);}
  const ZOOM_MIN=65,ZOOM_MAX=145,DISTANCE_MIN=controls.minDistance,DISTANCE_MAX=controls.maxDistance;
  function syncZoomSlider(){const input=document.getElementById('zoom-range');if(!input)return;const t=(DISTANCE_MAX-controls.getDistance())/(DISTANCE_MAX-DISTANCE_MIN);input.value=String(Math.round(ZOOM_MIN+THREE.MathUtils.clamp(t,0,1)*(ZOOM_MAX-ZOOM_MIN)));}
  function resetView(name=sceneMode){applyScene(name);syncZoomSlider();}
  function rotate(direction){const offset=camera.position.clone().sub(controls.target);offset.applyAxisAngle(new THREE.Vector3(0,1,0),direction==='left'?.22:-.22);camera.position.copy(controls.target).add(offset);controls.update();updatePinPositions();}
  function setZoom(value){const t=THREE.MathUtils.clamp((Number(value)-ZOOM_MIN)/(ZOOM_MAX-ZOOM_MIN),0,1);const wanted=DISTANCE_MAX-t*(DISTANCE_MAX-DISTANCE_MIN);const dir=camera.position.clone().sub(controls.target).normalize();camera.position.copy(controls.target).add(dir.multiplyScalar(wanted));controls.update();syncZoomSlider();updatePinPositions();}
  function setAutoOrbit(value){const toggle=document.getElementById('orbit-toggle'),note=document.getElementById('motion-note');if(reducedMotion.matches){controls.autoRotate=false;if(toggle){toggle.setAttribute('aria-pressed','false');toggle.disabled=true;toggle.title='Disabled because reduced motion is enabled.';}if(note)note.textContent='Auto orbit disabled: reduced-motion preference is on.';return false;}controls.autoRotate=Boolean(value);if(toggle){toggle.disabled=false;toggle.title='Slowly rotate the model automatically.';}if(note)note.textContent='';return controls.autoRotate;}
  function setComponentVisible(id,visible){if(meshesByPart[id])meshesByPart[id].visible=Boolean(visible);if(anchorMeshes[id])anchorMeshes[id].visible=Boolean(visible);if(visible)hiddenComponents.delete(id);else hiddenComponents.add(id);updatePinPositions();}
  function restoreAll(){[...hiddenComponents].forEach(id=>setComponentVisible(id,true));}
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
  function frame(){if(webglFailed)return;animationFrame=requestAnimationFrame(frame);resize();controls.update();renderer.render(scene,camera);updatePinPositions();}
  frame();
  window.vehicleWebGLApi={setScene:applyScene,resetView,rotate,setZoom,setAutoOrbit,setSelection,setPath,setComponentVisible,restoreAll,project};
})();

