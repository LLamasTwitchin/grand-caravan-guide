/* Functional training diagrams for the active vehicle profile.
   These are not OEM wiring diagrams. A profile with no entry hides the section. */
(function(){
  const library={
    'dodge-grand-caravan-2012':{
      diagrams:[
        {
          id:'power',
          tab:'Power distribution',
          kicker:'Battery → TIPM → protected load',
          summary:'The 2012 Owner Guide places the Totally Integrated Power Module in the engine compartment near the battery. Cartridge cavities are labeled J. Mini-fuse cavities are labeled M. Those letters are cover codes, not a left-to-right map.',
          limit:'Functional training diagram. Not an OEM wiring diagram. It omits relays, connectors, wire colors, and splice locations. The cover label wins if it disagrees with this page.',
          chain:[
            {id:'battery',title:'Battery',sub:'12 V source',confidence:'owner-guide',text:'The battery is the source for this teaching chain. This diagram does not show cable gauge, terminal torque, or the physical ground studs.'},
            {id:'tipm',title:'TIPM',sub:'Near the battery',confidence:'owner-guide',text:'Owner guide: the module is in the engine compartment near the battery, and the cover label identifies the circuits. Latch the cover fully after a visual check so water stays out.'},
            {id:'j13',title:'J13 · 60 A',sub:'IOD main · screenshot #7',confidence:'owner-guide',fuse:{n:7,cavity:'J13'},text:'Cavity J13 is the 60 A ignition-off-draw main cartridge in the owner-guide table. Screenshot index #7 is only the lookup number for that row. Ignition-off draw also has smaller listed feeds. This box does not mean J13 powers every circuit.'},
            {id:'load',title:'Protected load',sub:'One circuit at a time',confidence:'training',text:'Each fuse protects the circuit named for its cavity. A shared symptom can still be a supply, ground, module, or connection. Opening the matching fuse is not proof that the fuse failed.'}
          ],
          branches:[
            {title:'Return',nodes:[
              {id:'return',title:'Return path',sub:'Training only',confidence:'training',text:'Current has to return to the source. This page does not locate body grounds or show their wire colors. A poor connection can affect more than one function.'}
            ]}
          ]
        },
        {
          id:'start',
          tab:'Starting / charging',
          kicker:'High-current feed is not the control fuse',
          summary:'Starter solenoid feed and powertrain control are separate rows in the owner-guide table. Charging is shown as a loop back to the battery because this crosswalk does not assign an alternator fuse.',
          limit:'Functional training diagram. Not an OEM wiring diagram. Do not use it to jump the starter or probe the high-current circuit.',
          chain:[
            {id:'battery',title:'Battery',sub:'Source',confidence:'training',text:'A no-crank case can be a weak battery or a poor connection even when a fuse looks intact. Compare that with the simulated no-crank lesson; it is not a measurement from a van.'},
            {id:'j17',title:'J17 · 40 A',sub:'Starter solenoid · screenshot #2',confidence:'owner-guide',fuse:{n:2,cavity:'J17'},text:'Cavity J17 is the 40 A starter-solenoid cartridge. Screenshot index #2 is the lookup number, not the number molded on the cover.'},
            {id:'starter',title:'Starter',sub:'Approximate on the model',confidence:'training',text:'The model marks a starter area for teaching. It is not a factory location, removal procedure, or test-point diagram.'}
          ],
          branches:[
            {title:'Separate control reference',nodes:[
              {id:'j18',title:'J18 · 20 A',sub:'PCM transmission range · #1',confidence:'owner-guide',fuse:{n:1,cavity:'J18'},text:'Cavity J18 is the 20 A powertrain-control-module transmission-range feed, screenshot index #1. It is not in series with J17 in this diagram. A control fuse and the solenoid fuse answer different questions.'}
            ]},
            {title:'Charging loop · no fuse assigned here',nodes:[
              {id:'alt',title:'Alternator',sub:'Recharge path · unassigned',confidence:'training',text:'The alternator returns energy to the battery in this teaching loop. This guide does not list a dedicated alternator fuse, so none is drawn. Low system voltage is a test result to interpret, not proof of a failed alternator.'}
            ]}
          ]
        },
        {
          id:'cooling',
          tab:'Cooling',
          kicker:'J12 and J19 are both named · #12 is neither',
          summary:'The owner guide names two different radiator-fan cavities. This drawing does not decide whether they feed the same motor, a relay, or different loads. Screenshot #12 is the rear-window defogger.',
          limit:'Functional training diagram. Not an OEM wiring diagram. If the temperature warning is on, stop safely. Do not open a hot cooling-system cap. The cover label wins.',
          chain:[
            {id:'battery',title:'Battery',sub:'Source',confidence:'training',text:'Cooling fans are high-current loads. This chain only shows which cavities the owner guide names.'},
            {id:'tipm',title:'TIPM',sub:'Cover label',confidence:'owner-guide',text:'Use the label on the TIPM cover. Index numbers from the screenshot list are a lookup aid only.'}
          ],
          branches:[
            {title:'Cavity J12 · no screenshot index',nodes:[
              {id:'j12',title:'J12 · 30 A',sub:'Rear blower and radiator-fan motor',confidence:'owner-guide',warn:true,fuse:{manualOnly:true,cavity:'J12'},text:'The owner guide lists cavity J12, 30 A, for the rear HVAC blower and the radiator-fan motor. It has no screenshot index. It is not screenshot #12.'}
            ]},
            {title:'Cavity J19 · a different cartridge',nodes:[
              {id:'j19',title:'J19 · 60 A',sub:'Radiator fan · screenshot #14',confidence:'owner-guide',fuse:{n:14,cavity:'J19'},text:'Cavity J19 is a separate 60 A radiator-fan cartridge. Screenshot index #14 matches this row in the crosswalk. Do not treat J12 and J19 as the same fuse.'}
            ]},
            {title:'Not on this cooling path',nodes:[
              {id:'num12',title:'Screenshot #12',sub:'40 A defogger · cavity J14',confidence:'owner-guide',warn:true,fuse:{n:12,cavity:'J14'},text:'Screenshot #12 is the 40 A rear window defogger. In this crosswalk that row is cavity J14. Pulling #12 does not inspect J12.'}
            ]}
          ]
        },
        {
          id:'hvac',
          tab:'HVAC',
          kicker:'Front blower, rear blower, and control are separate',
          summary:'No airflow is a different complaint from air that blows but is not hot or cold. The rear-blower cavity is the same J12 row that also names the radiator-fan motor.',
          limit:'Functional training diagram. Not an OEM wiring diagram. It does not show blend doors, heater hoses, or refrigerant plumbing.',
          chain:[
            {id:'j15',title:'J15 · 40 A',sub:'Front blower · screenshot #16',confidence:'owner-guide',fuse:{n:16,cavity:'J15'},text:'Cavity J15 is the 40 A front-blower cartridge, screenshot index #16. A blower fuse does not explain temperature by itself.'},
            {id:'m11',title:'M11 · 10 A',sub:'Climate control · screenshot #39',confidence:'owner-guide',fuse:{n:39,cavity:'M11'},text:'Cavity M11 is the 10 A climate-control mini-fuse, screenshot index #39. It is a control feed in the table, not the front-blower cartridge.'}
          ],
          branches:[
            {title:'Rear blower shares a listed cavity with the fan motor',nodes:[
              {id:'j12',title:'J12 · 30 A',sub:'Rear HVAC blower · no index',confidence:'owner-guide',warn:true,fuse:{manualOnly:true,cavity:'J12'},text:'Rear airflow uses the J12 description, which also names the radiator-fan motor. There is no screenshot number for J12. Screenshot #12 remains the defogger at J14.'}
            ]}
          ]
        },
        {
          id:'lighting',
          tab:'Lighting',
          kicker:'Only cavities this crosswalk actually names',
          summary:'Park, tail, brake, fog, and horn rows are in the owner-guide table. A single headlamp-bulb feed is not given its own row here, so this diagram does not invent one.',
          limit:'Functional training diagram. Not an OEM wiring diagram. A failed lamp can be a bulb, socket, or ground while its fuse is intact. Headlamp wash is not the headlamp bulb.',
          chain:[
            {id:'m17',title:'M17 · 15 A',sub:'Left tail / park / license · #33',confidence:'owner-guide',fuse:{n:33,cavity:'M17'},text:'Cavity M17, screenshot #33, lists the left tail, license, park, and running lamps.'},
            {id:'m18',title:'M18 · 15 A',sub:'Right tail / park · #31',confidence:'owner-guide',fuse:{n:31,cavity:'M18'},text:'Cavity M18, screenshot #31, lists the right tail, park, and running lamps. Left and right are separate rows.'},
            {id:'m1',title:'M1 · 15 A',sub:'Center brake / brake switch · #49',confidence:'owner-guide',fuse:{n:49,cavity:'M1'},text:'Cavity M1, screenshot #49, lists the rear center brake lamp and brake switch. It is not a tail-lamp fuse.'}
          ],
          branches:[
            {title:'Horn · two listed legs',nodes:[
              {id:'m22',title:'M22 · 10 A',sub:'Horn · screenshot #28',confidence:'owner-guide',fuse:{n:28,cavity:'M22'},text:'Cavity M22 is one 10 A horn fuse, screenshot #28. The table does not say which horn or relay pin this is.'},
              {id:'m23',title:'M23 · 10 A',sub:'Horn · screenshot #32',confidence:'owner-guide',fuse:{n:32,cavity:'M23'},text:'Cavity M23 is the other 10 A horn fuse, screenshot #32. Two horn fuses do not prove which one opened.'}
            ]},
            {title:'If equipped · do not treat as the headlamps',nodes:[
              {id:'m2',title:'M2 · 20 A',sub:'Fog / trailer / IBS · #50',confidence:'owner-guide',fuse:{n:50,cavity:'M2'},text:'Cavity M2, screenshot #50, lists trailer lighting, front fog lamps, and the intelligent battery sensor. A fog-lamp complaint still has to match what is installed.'},
              {id:'j10',title:'J10 · 30 A',sub:'Headlamp wash · #10',confidence:'owner-guide',fuse:{n:10,cavity:'J10'},text:'Cavity J10, screenshot #10, lists headlamp wash and the manifold tuning valve, if equipped. It is not a headlamp bulb fuse. This guide does not assign low-beam or high-beam bulbs to a cavity.'}
            ]}
          ]
        }
      ]
    }
  };

  const profileId=document.body.dataset.vehicleProfile||'dodge-grand-caravan-2012';
  const pack=library[profileId];
  const root=document.querySelector('#system-diagrams');
  if(!root)return;
  if(!pack){root.hidden=true;return;}
  window.vehicleDiagramLibrary=library;

  const tabs=root.querySelector('#diagram-tabs');
  const stage=root.querySelector('#diagram-stage');
  const detail=root.querySelector('#diagram-detail');
  const printRoot=root.querySelector('#diagram-print');
  let diagramIndex=0;
  let selectedNode=null;

  function confidenceLabel(kind){
    if(kind==='owner-guide')return 'Owner guide';
    if(kind==='possible')return 'Possible';
    return 'Training model';
  }

  function openFuse(ref){
    const api=window.vehicleFuseApi;
    const search=document.querySelector('#search');
    const filter=document.querySelector('#group-filter');
    if(filter)filter.value='all';
    if(!api||!search||!ref){
      document.querySelector('#fuses')?.scrollIntoView({behavior:'smooth',block:'start'});
      return;
    }
    search.value=ref.cavity;
    api.renderFuses();
    api.selectFuse(ref.manualOnly?ref.cavity:ref.n);
    document.querySelector('#fuses')?.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function showDetail(node){
    selectedNode=node.id;
    detail.replaceChildren();
    const badge=document.createElement('span');
    badge.className='confidence'+(node.confidence==='owner-guide'?'':' '+(node.confidence==='possible'?'possible':'training'));
    badge.textContent=confidenceLabel(node.confidence);
    const title=document.createElement('h3');
    title.textContent=node.title;
    const text=document.createElement('p');
    text.textContent=node.text;
    detail.append(badge,title,text);
    if(node.fuse){
      const button=document.createElement('button');
      button.type='button';
      button.textContent=node.fuse.manualOnly?'Show cavity '+node.fuse.cavity+' in fuse lookup':'Show screenshot #'+node.fuse.n+' · '+node.fuse.cavity+' in fuse lookup';
      button.addEventListener('click',()=>openFuse(node.fuse));
      detail.append(button);
    }
    stage.querySelectorAll('button[data-node]').forEach(button=>{
      button.setAttribute('aria-pressed',String(button.dataset.node===node.id));
    });
  }

  function nodeButton(node){
    const button=document.createElement('button');
    button.type='button';
    button.dataset.node=node.id;
    button.setAttribute('aria-pressed','false');
    if(node.warn)button.classList.add('warn');
    const strong=document.createElement('strong');
    strong.textContent=node.title;
    const small=document.createElement('small');
    small.textContent=node.sub;
    button.append(strong,small);
    button.addEventListener('click',()=>showDetail(node));
    return button;
  }

  function renderDiagram(index){
    diagramIndex=index;
    const diagram=pack.diagrams[index];
    tabs.querySelectorAll('[role=tab]').forEach((tab,i)=>{
      const on=i===index;
      tab.setAttribute('aria-selected',String(on));
      tab.tabIndex=on?0:-1;
    });
    stage.replaceChildren();
    const kicker=document.createElement('p');
    kicker.className='recall-meta';
    kicker.textContent=diagram.kicker;
    const summary=document.createElement('p');
    summary.textContent=diagram.summary;
    const chain=document.createElement('div');
    chain.className='diagram-chain';
    chain.setAttribute('role','list');
    diagram.chain.forEach(node=>chain.append(nodeButton(node)));
    stage.append(kicker,summary,chain);
    (diagram.branches||[]).forEach(branch=>{
      const block=document.createElement('div');
      block.className='diagram-branch';
      const heading=document.createElement('h3');
      heading.textContent=branch.title;
      const row=document.createElement('div');
      row.className='diagram-chain';
      branch.nodes.forEach(node=>row.append(nodeButton(node)));
      block.append(heading,row);
      stage.append(block);
    });
    const limit=document.createElement('p');
    limit.className='diagram-limit';
    limit.textContent=diagram.limit;
    stage.append(limit);
    showDetail(diagram.chain[0]);
  }

  pack.diagrams.forEach((diagram,index)=>{
    const tab=document.createElement('button');
    tab.type='button';
    tab.setAttribute('role','tab');
    tab.id='diagram-tab-'+diagram.id;
    tab.setAttribute('aria-controls','diagram-stage');
    tab.textContent=diagram.tab;
    tab.addEventListener('click',()=>renderDiagram(index));
    tab.addEventListener('keydown',event=>{
      if(event.key!=='ArrowRight'&&event.key!=='ArrowLeft')return;
      event.preventDefault();
      const next=(index+(event.key==='ArrowRight'?1:-1)+pack.diagrams.length)%pack.diagrams.length;
      renderDiagram(next);
      tabs.querySelectorAll('[role=tab]')[next].focus();
    });
    tabs.append(tab);
    const printed=document.createElement('article');
    printed.className='diagram-print-block';
    const h=document.createElement('h3');
    h.textContent=diagram.tab;
    const p=document.createElement('p');
    p.textContent=diagram.summary+' '+diagram.limit;
    const list=document.createElement('ul');
    const nodes=diagram.chain.concat(...(diagram.branches||[]).map(branch=>branch.nodes));
    nodes.forEach(node=>{
      const item=document.createElement('li');
      item.textContent=node.title+' — '+node.sub+'. '+node.text;
      list.append(item);
    });
    printed.append(h,p,list);
    printRoot.append(printed);
  });
  tabs.setAttribute('role','tablist');
  tabs.setAttribute('aria-label','System diagrams');
  renderDiagram(0);
})();
