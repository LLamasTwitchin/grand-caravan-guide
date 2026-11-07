/* Training layer for the active profile: walkthroughs, a local quiz,
   component roles, on-this-browser progress, display tools, and share links.
   Readings and scores are practice. Nothing here is sent to a server. */
(function(){
  const profileId=document.body&&document.body.dataset.vehicleProfile;
  if(profileId!=='dodge-grand-caravan-2012')return;

  const KEY='gc-guide-lab-v21';
  const emptyState=()=>({favorites:[],bookmarks:[],walk:{},quizBest:null,name:'',notes:'',contrast:false,typeScale:100});
  function load(){
    try{
      const parsed=JSON.parse(localStorage.getItem(KEY)||'null');
      return parsed&&typeof parsed==='object'?Object.assign(emptyState(),parsed):emptyState();
    }catch(e){return emptyState();}
  }
  function save(state){
    try{localStorage.setItem(KEY,JSON.stringify(state));}catch(e){}
  }
  let state=load();

  function el(id){return document.getElementById(id);}
  function clear(node){while(node&&node.firstChild)node.removeChild(node.firstChild);}
  function add(parent,tag,text,attrs){
    const node=document.createElement(tag);
    if(text!=null)node.textContent=text;
    if(attrs)Object.keys(attrs).forEach(key=>{
      if(key==='class')node.className=attrs[key];
      else if(key==='pressed')node.setAttribute('aria-pressed',String(attrs[key]));
      else node.setAttribute(key,attrs[key]);
    });
    parent.appendChild(node);
    return node;
  }

  const walks=[
    {
      id:'no-crank',
      title:'Diagnosing a no-crank condition',
      blurb:'Walk the complaint from what still works, to the battery you can see, to the two different starter-related fuses. Stop before any high-current test.',
      start:'pattern',
      print:[
        'Record whether the cabin lights stay bright, dim, or die, and whether you hear a click, rapid clicks, or silence.',
        'A dim cluster or rapid clicking is a reason to have the battery and its connections tested. It is not a reason to replace the starter.',
        'Look at the battery terminals only if you can do that without loosening a cable. Heavy corrosion or a loose terminal is a stop point.',
        'Confirm the shifter is fully in Park and the van is secured. Neutral is a comparison only when the van cannot roll.',
        'Ignition off. Use the cover label. J17 is the 40 A starter-solenoid cartridge, screenshot index #2. J18 is the 20 A PCM transmission-range feed, screenshot index #1. They are different rows. This guide does not name a starter-relay cavity.',
        'An intact fuse does not prove the starter, the control circuit, or the return path. If the correct fuse opens again, stop. The owner guide says the circuit has a problem.',
        'The next separation — battery capacity, cable voltage drop, and the control signal — belongs to a technician. Do not bridge the solenoid.'
      ],
      steps:{
        pattern:{
          title:'What still has power?',
          teach:'A starter that does not turn is a pattern, not a failed part. Write down the lights and the sound before you open the fuse cover.',
          choices:[
            {label:'Cabin lights are dim, or the cluster resets',next:'source',note:'That pattern can be a weak source or a poor connection. It does not prove the battery is bad, and it does not prove the starter is good.'},
            {label:'Cabin lights stay bright',next:'sound',note:'Bright lights only say the cabin still has some supply. They do not measure whether the battery can crank.'},
            {label:'Nothing electrical works',next:'source',note:'Several dead systems point at the source or a main feed before any single fuse.'}
          ]
        },
        source:{
          title:'Look, do not unbolt',
          teach:'The owner guide treats a discharged battery as a jump-start procedure, not as a reason to pull the starter apart. This step is visual only.',
          choices:[
            {label:'Terminals look tight and clean',next:'sound',note:'Clean terminals can still hide a weak battery. The next note is the sound, then a proper battery test if the crank is weak.'},
            {label:'Heavy corrosion or a loose terminal is visible',next:'stop-source',note:'Stop cranking. A loose or corroded connection can mimic a dead starter. Have the battery and cables tested before any parts decision.'},
            {label:'You cannot see the terminals safely',next:'sound',note:'Leave the cables alone. Guessing at a hidden terminal is not a test.'}
          ]
        },
        sound:{
          title:'What do you hear when you try to start?',
          teach:'The sound changes the question. It still does not name the failed part.',
          choices:[
            {label:'One click',next:'park',note:'One click can be control or the solenoid. Record it. Do not treat it as proof either one failed.'},
            {label:'Rapid clicking',next:'stop-source',note:'Rapid clicking is the usual weak-source pattern in this lesson. Test the battery and connections before replacing a starter.'},
            {label:'Silence',next:'park',note:'Silence can be a switch, an interlock, a control feed, or a high-current path. The fuse check comes after Park is confirmed.'},
            {label:'The engine turns slowly',next:'stop-source',note:'Slow cranking is a source or connection question first. Keep the crank attempts short.'}
          ]
        },
        park:{
          title:'Is the shifter fully in Park, and is the van secured?',
          teach:'The shift interlock can keep the starter silent. Compare Neutral only if the van cannot roll.',
          choices:[
            {label:'It is in Park and it cannot roll',next:'fuses',note:'Park is confirmed. The fuse check is next, with the ignition off.'},
            {label:'It cranks only in Neutral',next:'done-interlock',note:'That points at the shift interlock as a possibility. It is not a failed starter. Stop this walk and have that checked.'}
          ]
        },
        fuses:{
          title:'Two different fuses, ignition off',
          teach:'Use the cover label, not the screenshot index, to find the cavity. J17 is the 40 A starter solenoid, screenshot #2. J18 is the 20 A PCM transmission-range feed, screenshot #1. This page does not list a starter-relay cavity, so it will not invent one.',
          choices:[
            {label:'Both look intact',next:'not-fuse',note:'An intact fuse does not prove power reaches the starter or that the control signal is present.'},
            {label:'J17 looks open',next:'opened',note:'Replace only the same 40 A rating, once, with the ignition off. Then stop if it opens again.'},
            {label:'You are not sure which cavity is which',next:'cover',note:'Stop and read the cover. Screenshot #2 is a lookup number, not the number molded in the box.'}
          ]
        },
        cover:{
          title:'The cover wins',
          teach:'If the label on the van and this page disagree, follow the cover and the service information. Do not pull a cavity because a picture index looked familiar.',
          choices:[
            {label:'The cover is readable, continue the lesson',next:'not-fuse',note:'The lesson can continue as teaching. The physical label is the one that identifies the fuse.'}
          ]
        },
        opened:{
          title:'It was open. Now what?',
          teach:'The 2012 Owner Guide says a fuse that opens again means the circuit has a problem that must be corrected. A larger fuse, foil, or a wire removes that protection.',
          choices:[
            {label:'The same-rated fuse opened again',next:'stop-fuse',note:'Stop. Replacing it again will not find the cause.'},
            {label:'The second look showed it intact',next:'not-fuse',note:'Then the open fuse was not confirmed. Go back to the pattern instead of condemning the starter.'}
          ]
        },
        'not-fuse':{
          title:'The fuse did not answer it',
          teach:'J17 and J18 answer different questions, and neither one proves a part failed. J19, J12, and screenshot #12 are not starter fuses: #12 is the 40 A rear defogger at cavity J14 in this crosswalk.',
          choices:[
            {label:'Leave the high-current test to a technician',next:'tech',note:'Battery capacity, voltage drop on the cables, and the control signal are the next separation. This lab does not give those probe points.'}
          ]
        },
        tech:{
          title:'Where this walk stops',
          teach:'Do not bridge the starter solenoid and do not probe the high-current cable from this page. A scan tool does not replace a battery test.',
          choices:[{label:'Finish the walk',next:'done',note:'You followed source, interlock, then the two listed fuses, and you stopped before a high-current test.'}]
        },
        'stop-source':{title:'Stop on the source',teach:'Have the battery and the connections tested. Do not replace the starter or the TIPM from this pattern.',terminal:true},
        'stop-fuse':{title:'Stop on a fuse that reopens',teach:'The circuit has a problem. Diagnosis of the cause comes before another fuse.',terminal:true},
        'done-interlock':{title:'Shift interlock is the open question',teach:'A van that cranks only in Neutral needs that circuit checked. It is not evidence the starter failed.',terminal:true},
        done:{title:'Walk complete',teach:'You separated a weak source, a secured Park position, and two different fuse rows. None of those steps proved a part failed.',terminal:true}
      }
    },
    {
      id:'rear-blower',
      title:'Diagnosing a rear blower that does not run',
      blurb:'Separate the front blower, the rear controls, engine temperature, and three fuse rows that are easy to mix.',
      start:'front',
      print:[
        'If the front blower is also dead, start with that complaint. J15 is the 40 A front blower, screenshot #16. M11 is the 10 A climate-control feed, screenshot #39. The small fuse is not the motor current.',
        'If the front blower works, confirm the rear control is actually on.',
        'If the temperature warning is on, stop. Do not open a hot cooling-system cap.',
        'The owner guide lists cavity J12, 30 A, for the rear HVAC blower and the radiator-fan motor. J12 has no screenshot index.',
        'Screenshot #12 is the 40 A rear window defogger. In this crosswalk that row is cavity J14. Pulling #12 does not inspect J12.',
        'J19 is a separate 60 A radiator-fan cartridge, screenshot #14. This page does not draw J12 and J19 as the same fuse.',
        'An open J12 does not prove the blower motor failed. A motor can fail while the fuse is intact. If the correct fuse opens again, stop.'
      ],
      steps:{
        front:{
          title:'Does the front blower move air?',
          teach:'No airflow is a different complaint from air that blows at the wrong temperature. The rear motor is not the first question if the front is dead too.',
          choices:[
            {label:'Front blower is also dead',next:'front-fuses',note:'Use the front-blower rows before blaming the rear motor.'},
            {label:'Front blower works, rear does not',next:'rear-on',note:'The feeds are different rows. A working front blower does not clear the rear circuit.'}
          ]
        },
        'front-fuses':{
          title:'Front airflow uses different cavities',
          teach:'J15 is the 40 A front blower, screenshot #16. M11 is the 10 A climate control, screenshot #39. M11 is a control feed in the table, not the blower cartridge.',
          choices:[
            {label:'Front is dead at every speed',next:'stop-front',note:'That is the front circuit and the controls, not J12. Stop this rear-blower walk and use the front-blower guide.'},
            {label:'Front actually works; the rear does not',next:'rear-on',note:'Then the rear walk continues.'}
          ]
        },
        'rear-on':{
          title:'Is the rear control on?',
          teach:'Confirm the rear switch and the requested speed before opening the cover. A control that is off is not a failed motor.',
          choices:[
            {label:'Rear control is on and there is still no air',next:'temp',note:'The next question is engine temperature, because J12 also names the radiator-fan motor.'},
            {label:'Air moves, but it is not hot or cold',next:'stop-temp-air',note:'That is a temperature complaint, not a blower-motor complaint. This walk does not cover blend doors or the refrigerant.'}
          ]
        },
        temp:{
          title:'Is the engine temperature normal?',
          teach:'The owner guide says if the temperature warning comes on, pull over safely, turn the A/C off, and idle in Neutral. If it does not return to normal, turn the engine off and get help. Never open a hot cooling-system cap.',
          choices:[
            {label:'Temperature is normal',next:'which-fuse',note:'You can look up the fuse rows. The cooling system is not cleared forever by one glance at the gauge.'},
            {label:'The temperature warning is on',next:'stop-heat',note:'Stop the diagnosis and deal with the temperature. Do not sit and pull fuses.'}
          ]
        },
        'which-fuse':{
          title:'Which row is the rear blower?',
          teach:'J12, 30 A, rear HVAC blower and radiator-fan motor, no screenshot index. Screenshot #12 is the defogger at J14. J19, screenshot #14, is the 60 A radiator fan. Three different rows.',
          choices:[
            {label:'I was about to pull screenshot #12',next:'not-twelve',note:'That is the defogger path in this crosswalk. It does not inspect J12.'},
            {label:'The cover shows J12',next:'meaning',note:'Read the rating on the cover before you pull it. Ignition off.'},
            {label:'The cover shows J19',next:'meaning',note:'J19 is the radiator-fan cartridge in the table. It is not the same label as J12.'}
          ]
        },
        'not-twelve':{
          title:'Screenshot #12 is the defogger',
          teach:'Index #12 and cavity J12 share digits and nothing else. #12 is 40 A, rear window defogger, cavity J14 in this crosswalk.',
          choices:[{label:'Go back to the cover labels',next:'which-fuse',note:'Use J12, J19, and J14 as three labels.'}]
        },
        meaning:{
          title:'What an open fuse would mean',
          teach:'An open J12 is not proof the blower motor failed. A shared listing is not proof the blower caused a cooling fault. A fuse that opens again means the circuit has a problem.',
          choices:[{label:'Finish without condemning the motor',next:'done',note:'The walk separated front airflow, rear control, temperature, and the three fuse rows.'}]
        },
        'stop-front':{title:'Use the front-blower guide',teach:'J15 and M11 are the front rows. J12 is not the explanation for a dead front blower.',terminal:true},
        'stop-temp-air':{title:'Wrong complaint for this walk',teach:'Air that moves but is the wrong temperature is not a rear-blower fuse complaint.',terminal:true},
        'stop-heat':{title:'Temperature warning',teach:'Stop safely and follow the owner guide. Do not open the hot cooling-system cap.',terminal:true},
        done:{title:'Walk complete',teach:'You kept J12, J19, and screenshot #12 apart, and you did not treat a fuse as a failed blower.',terminal:true}
      }
    },
    {
      id:'reopen',
      title:'A fuse that opens again',
      blurb:'The owner guide already gives the rule. This walk is the order: stop, record, remove the extra load, and do not upsize the fuse.',
      start:'stop',
      print:[
        'Stop installing fuses. A second opening is the warning, not a request for a larger amp number.',
        'Write down the cavity on the cover, the rating printed there, and what was turned on.',
        'The screenshot index only helps you read the circuit name. It does not identify the metal cavity by itself.',
        'If the circuit is an outlet, unplug the device. The device can be the overload.',
        'Use only the same type and rating. Foil, wire, or a higher rating removes the protection.',
        'The 2012 Owner Guide says the circuit has a problem that must be corrected.',
        'The next step is diagnosis of the cause. Another fuse is not that step.'
      ],
      steps:{
        stop:{
          title:'Stop replacing it',
          teach:'The fuse opened to protect the wiring. Installing another one without changing anything asks it to open again.',
          choices:[
            {label:'Nothing is plugged in or newly installed',next:'record',note:'Record the cavity and what was on. The cause can still be in the wiring or the load.'},
            {label:'Something was plugged into an outlet',next:'unplug',note:'The accessory is the first thing to remove, if you can do that without opening a harness.'}
          ]
        },
        unplug:{
          title:'Remove the added load',
          teach:'Unplug the device. Do not stick metal in the socket to “test” it. One outlet can fail while another outlet, on another fuse, still works.',
          choices:[{label:'The device is unplugged',next:'record',note:'Leave it unplugged. The fuse rating does not change because the device was expensive.'}]
        },
        record:{
          title:'Write the cover, not the memory',
          teach:'Record the molded cavity, the rating on the cover, and the function that was on. Screenshot #57 is M6, the 20 A power outlet #1 row, only as a lookup example. Your cover decides which cavity you actually pulled.',
          choices:[
            {label:'The rating on the cover matches the fuse that opened',next:'rule',note:'Same rating is the only replacement the owner guide allows, and only after the cause is corrected.'},
            {label:'The fuse in your hand is a higher rating than the cover',next:'stop-wrong',note:'That fuse does not belong there. Do not put it back.'}
          ]
        },
        rule:{
          title:'The owner-guide rule',
          teach:'If a same-rated fuse continues to blow, the circuit has a problem that must be corrected. Bridging it can overheat the wiring.',
          choices:[{label:'Leave the circuit open until it is diagnosed',next:'done',note:'An open fuse is safer than a bypass. The van may be missing that function until the cause is found.'}]
        },
        'stop-wrong':{title:'Wrong rating',teach:'Do not reinstall a larger fuse. Put the circuit back only with the rating the cover specifies, after the cause is known.',terminal:true},
        done:{title:'Walk complete',teach:'You stopped the replacement cycle, separated the accessory from the circuit, and kept the cover rating.',terminal:true}
      }
    }
  ];

  const questions=[
    {id:'rear',prompt:'The rear blower does not run. Which row is the rear HVAC blower in this guide?',choices:['Cavity J12, 30 A, rear HVAC blower and radiator-fan motor, no screenshot index','Screenshot #12, the 40 A rear defogger','Cavity J15, the 40 A front blower','Cavity M11, the 10 A climate control'],answer:0,why:'J12 is the rear-blower row and it has no screenshot number. Screenshot #12 is the defogger at cavity J14 in this crosswalk. J15 and M11 are front HVAC rows.'},
    {id:'twelve',prompt:'What is screenshot index #12?',choices:['40 A rear window defogger, cavity J14 in this crosswalk','The same fuse as cavity J12','40 A starter solenoid','60 A radiator fan'],answer:0,why:'The digits match and the fuses do not. #12 is the defogger. J12 is a different 30 A cavity with no screenshot index.'},
    {id:'dim',prompt:'No crank, and the cabin lights dim when you try. What is the first owner-level question?',choices:['Battery condition and the connections you can see','Replace the starter','Replace the TIPM','Pull screenshot #12'],answer:0,why:'A dim cluster points at the source or a connection. It does not prove the battery, the starter, or the TIPM failed. Screenshot #12 is the defogger.'},
    {id:'j17',prompt:'How do J17 and J18 differ?',choices:['J17 is the 40 A starter solenoid, screenshot #2. J18 is the 20 A PCM transmission-range feed, screenshot #1. This page does not put them in series.','They are two names for the same fuse','J18 is the high-current starter cable','J17 is a relay pin number'],answer:0,why:'They are different rows and different ratings. This guide does not assign a starter-relay pin or cavity.'},
    {id:'again',prompt:'A same-rated fuse opens again. What does the 2012 Owner Guide say?',choices:['The circuit has a problem that must be corrected','Install the next amp size up','Bridge it with foil so you can get home','Replace the TIPM'],answer:0,why:'The fuse is the protection. A larger fuse or a bridge removes that protection. The opening is not proof of which part failed.'},
    {id:'hvac',prompt:'Which statement matches the front HVAC rows?',choices:['J15, 40 A, screenshot #16, is the front blower. M11, 10 A, screenshot #39, is climate control.','M11 carries the blower-motor current','J12 is the front blower','Screenshot #16 is cavity J12'],answer:0,why:'The cartridge and the control fuse are different sizes on purpose. M11 is not the motor current in this table.'},
    {id:'wash',prompt:'What is cavity J10?',choices:['30 A headlamp wash and manifold tuning valve, if equipped. Not a headlamp-bulb fuse.','The low-beam bulb fuse','The horn','The rear blower'],answer:0,why:'This guide does not assign a headlamp bulb to a cavity. Headlamp wash is a different load.'},
    {id:'horn',prompt:'How many horn fuses does the table list?',choices:['Two 10 A fuses: M22 screenshot #28 and M23 screenshot #32. The table does not say which horn each one feeds.','One horn fuse, screenshot #12','M22 only','J17'],answer:0,why:'Two listed legs do not tell you which one opened, and neither one is the defogger or the starter.'},
    {id:'limp',prompt:'What does the 2012 Owner Guide say about Transmission Limp Home Mode?',choices:['It can stay in third gear. Park, Reverse, and Neutral still operate. The MIL may come on. Third gear alone does not prove a part failed.','It means the TIPM has failed','It locks the shifter in Park','It is the same thing as Electronic Range Select'],answer:0,why:'The guide describes a protective gear limit and a parked reset. ERS can also hold the top gear on purpose, including 3, and that is a driver choice.'},
    {id:'code',prompt:'A scanner shows P0420. What is justified?',choices:['The catalyst monitor reported a result. The code does not prove the converter failed.','Replace the converter','Replace the TIPM','The rear blower fuse is open'],answer:0,why:'A code directs a test. Upstream misfire, fuel control, and exhaust leaks are still open questions. This quiz is not a repair order.'},
    {id:'blue',prompt:'What is the blue line on the 3D model?',choices:['A simplified return toward the battery area, for teaching. Not a ground-stud location and not an OEM wire color.','The factory ground cable','A CAN bus','The headlamp circuit'],answer:0,why:'Amber is the simplified supply through the TIPM. Blue is the simplified return. Both are training paths.'},
    {id:'score',prompt:'What does a high score on this quiz prove?',choices:['That you can answer these practice questions on this browser. It is not a license or a repair credential.','That you can diagnose a 2012 Grand Caravan without service information','That your van needs a TIPM','That the fuse cover is wrong'],answer:0,why:'The score stays on this browser. The cover label and the service information still outrank the page.'}
  ];

  const components=[
    {id:'tipm',title:'TIPM',kicker:'Distribution, not a diagnosis',principle:'The 2012 Owner Guide places the Totally Integrated Power Module in the engine compartment near the battery. The cover names the circuits. Latch the cover fully after a look so water stays out.',fails:['A fuse that opens again means the circuit has a problem. The module is not convicted by that sentence.','Water in a cover that was left unlatched is a reason to stop and have it checked. This card does not say that happened.','Replacing the module is a decision after tests. A handful of dead features does not prove it.'],terminals:[{name:'Protected supply',does:'A J cartridge or an M mini-fuse feeds the circuit named on the cover. The cavity code is the label. It is not a connector pin number.'},{name:'Control feed',does:'Some rows feed a module or a control. The table rating is a clue to the size of that feed. This card does not number relay pins.'},{name:'Return',does:'The loads still need a path back to the source. This card does not locate the stud.'}],fuse:'J13'},
    {id:'starter',title:'Starter',kicker:'High current and a separate control question',principle:'The solenoid is what the J17 row names: a 40 A cartridge, screenshot #2. The motor current on a real van is a high-current path. This model only marks a teaching area. It is not a location diagram or a test-point drawing.',fails:['A single click, silence, or a slow crank can each have more than one cause. The sound is a note, not a parts order.','An intact J17 does not prove the solenoid, the motor, or the cables.','A weak battery can mimic all of those. Test the source first when the lights dim.'],terminals:[{name:'High-current supply',does:'The cable from the battery area does the heavy work during cranking. Do not bridge it and do not probe it from this page.'},{name:'Solenoid feed',does:'J17 is the listed 40 A protection for the starter solenoid. It is not J18, and it is not a pin number.'},{name:'Control',does:'Something has to request cranking: the shifter position and a control feed. J18 is the 20 A PCM transmission-range row, screenshot #1. This page does not call J18 the starter relay and does not invent a relay cavity.'},{name:'Return',does:'The starter case returns current through its mounting. A painted or loose mount can matter. This model does not show that fastener.'}],fuse:'J17'},
    {id:'blower',title:'Blower motor',kicker:'Front, rear, and control are three rows',principle:'A blower is a motor load. No air is a different complaint from air at the wrong temperature. The front motor, the rear motor, and the climate control do not share one fuse in this table.',fails:['A motor can fail while its fuse is intact: brushes, a seized wheel, or a connector. The intact fuse did not prove the motor failed either.','An open fuse can be the motor, the wiring, or water in the housing. The open fuse does not pick which.','Rear and cooling share a sentence in the owner guide at J12. That sentence is not a wiring diagram of how they are connected.'],terminals:[{name:'Motor supply',does:'Front: J15, 40 A, screenshot #16. Rear: J12, 30 A, no screenshot index. Those are the high-current rows in the table.'},{name:'Control',does:'M11, 10 A, screenshot #39, is climate control. A control circuit is the small current that asks for a speed. It is not the motor current.'},{name:'Return',does:'The motor still needs a return. This card does not show where that wire lands.'}],fuse:'J12'},
    {id:'battery',title:'Battery',kicker:'Source, separate from every fuse',principle:'The battery is the source for the teaching chain. State of charge, capacity, and the tightness of the terminals are different questions. A fuse cannot answer them.',fails:['A van that cranks slowly, clicks fast, or resets the cluster can have a weak battery or a bad connection.','A battery that measures fine at rest can still fall on its face under cranking load. This page does not give the load-test numbers.','Jump-starting has a procedure in the owner guide. Improvised cable routes are outside this lab.'],terminals:[{name:'Positive post',does:'The supply leaves here toward the TIPM and the high-current cables. This is not a cavity code.'},{name:'Negative post',does:'The return arrives here. Cleaning it is not the same as finding every body ground.'},{name:'Sensor, if equipped',does:'M2 lists an intelligent battery sensor along with fog and trailer lamps. That row does not mean every van has the sensor.'}],fuse:'M2'},
    {id:'alternator',title:'Alternator',kicker:'Charging loop, no fuse assigned here',principle:'The alternator puts energy back into the battery after a start. This guide does not list a dedicated alternator fuse, so the diagrams do not draw one. Low system voltage is a result to interpret, not proof the alternator failed.',fails:['A slipping belt, a bad connection, the battery itself, or the alternator can all leave the system low.','A battery warning lamp needs the owner-guide response. It does not order a part.','Do not disconnect the battery to “test” charging while the engine runs.'],terminals:[{name:'Output',does:'The charging current returns toward the battery. The path on the model is a teaching loop.'},{name:'Sense or control',does:'Many alternators have a small circuit that excites or monitors the field. This card does not assign that wire to a cavity.'},{name:'Case return',does:'The mount can be part of the return. This model does not show the bolt.'}],fuse:null}
  ];

  let walkId=walks[0].id;
  let stepId=walks[0].start;
  let walkHistory=[];
  let lastSection='walkthroughs';

  function currentWalk(){return walks.find(w=>w.id===walkId)||walks[0];}
  function showWalk(id,requested){
    const walk=walks.find(w=>w.id===id)||walks[0];
    if(id!==walkId)walkHistory=[];
    walkId=walk.id;
    stepId=requested||state.walk[walk.id]||walk.start;
    if(!walk.steps[stepId])stepId=walk.start;
    state.walk[walk.id]=stepId;
    save(state);
    const root=el('walk-app');
    if(!root)return;
    clear(root);
    const tabs=add(root,'div','',{class:'lab-tabs','role':'tablist','aria-label':'Walkthroughs'});
    walks.forEach(item=>{
      const b=add(tabs,'button',item.title,{type:'button',pressed:item.id===walk.id});
      b.addEventListener('click',()=>showWalk(item.id,state.walk[item.id]||item.start));
    });
    add(root,'p',walk.blurb,{class:'lab-note'});
    const step=walk.steps[stepId];
    add(root,'p','Step: '+step.title,{class:'lab-kicker'});
    add(root,'h3',step.title);
    add(root,'p',step.teach);
    if(!step.terminal&&step.choices){
      const box=add(root,'div','',{class:'lab-choices'});
      step.choices.forEach(choice=>{
        const b=add(box,'button',choice.label,{type:'button'});
        b.addEventListener('click',()=>{
          walkHistory.push(stepId);
          showWalk(walk.id,choice.next);
          const live=el('walk-note');
          if(live)live.textContent=choice.note;
        });
      });
    }
    const note=add(root,'p','',{id:'walk-note',class:'lab-note','aria-live':'polite'});
    note.textContent=step.terminal?'This branch stops here. Use Back to try another observation.':'Choose the observation that matches the van. The note says what that choice does not prove.';
    const row=add(root,'div','',{class:'lab-row'});
    const back=add(row,'button','Back',{type:'button'});
    back.addEventListener('click',()=>{
      const prev=walkHistory.pop();
      showWalk(walk.id,prev||walk.start);
    });
    const restart=add(row,'button','Restart this walk',{type:'button'});
    restart.addEventListener('click',()=>{walkHistory=[];showWalk(walk.id,walk.start);});
    const mark=add(row,'button',state.bookmarks.indexOf(walk.id)>=0?'Bookmarked on this browser':'Bookmark this walk',{type:'button'});
    mark.addEventListener('click',()=>{
      const i=state.bookmarks.indexOf(walk.id);
      if(i>=0)state.bookmarks.splice(i,1);else state.bookmarks.push(walk.id);
      save(state);
      showWalk(walk.id,stepId);
    });
    const share=add(row,'button','Copy link to this walk',{type:'button'});
    share.addEventListener('click',()=>copyHash('walk-'+walk.id));
    const print=el('walk-print');
    if(print){
      clear(print);
      walks.forEach(item=>{
        const article=add(print,'article','',{class:'print-guide'});
        add(article,'h3',item.title);
        add(article,'p',item.blurb);
        const list=add(article,'ol');
        item.print.forEach(line=>add(list,'li',line));
      });
    }
    }
  let quizIndex=0;
  let quizPicks=[];
  let quizDone=false;
  function renderQuiz(){
    const root=el('quiz-app');
    if(!root)return;
    clear(root);
    add(root,'p','Twelve questions. The score is stored on this browser as a self-check. It is not a professional certificate, license, or proof you can repair a vehicle.',{class:'lab-note'});
    if(state.quizBest)add(root,'p','Best on this browser: '+state.quizBest.correct+' / '+state.quizBest.total+' on '+state.quizBest.when+'.',{class:'lab-kicker'});
    if(!quizDone){
      const q=questions[quizIndex];
      add(root,'p','Question '+(quizIndex+1)+' of '+questions.length,{class:'lab-kicker'});
      add(root,'h3',q.prompt);
      const box=add(root,'div','',{class:'lab-choices','role':'group','aria-label':'Answers'});
      q.choices.forEach((choice,index)=>{
        const b=add(box,'button',choice,{type:'button',pressed:quizPicks[quizIndex]===index});
        b.addEventListener('click',()=>{quizPicks[quizIndex]=index;renderQuiz();});
      });
      const row=add(root,'div','',{class:'lab-row'});
      const prev=add(row,'button','Previous',{type:'button'});
      prev.disabled=quizIndex===0;
      prev.addEventListener('click',()=>{quizIndex-=1;renderQuiz();});
      const next=add(row,'button',quizIndex===questions.length-1?'Score this attempt':'Next',{type:'button'});
      next.addEventListener('click',()=>{
        if(quizPicks[quizIndex]==null){
          const live=el('quiz-live');
          if(live)live.textContent='Choose an answer before leaving this question.';
          return;
        }
        if(quizIndex===questions.length-1){quizDone=true;scoreQuiz();}
        else {quizIndex+=1;renderQuiz();}
      });
      add(root,'p','',{id:'quiz-live','aria-live':'polite',class:'lab-note'});
      return;
    }
    scoreQuiz();
  }
  function scoreQuiz(){
    const root=el('quiz-app');
    const correct=questions.filter((q,i)=>quizPicks[i]===q.answer).length;
    const when=new Date().toISOString().slice(0,10);
    if(!state.quizBest||correct>state.quizBest.correct){
      state.quizBest={correct,total:questions.length,when};
      save(state);
    }
    clear(root);
    add(root,'h3','Practice score: '+correct+' / '+questions.length);
    add(root,'p','This card is a self-check of the 2012 Grand Caravan electrical lab on this browser. It is not a professional certificate, not a license, and not a credential for employment or for repairing a vehicle. The name, if you type one, stays in this browser and is not sent.');
    const nameLabel=add(root,'label','Name on the practice card (optional)');
    nameLabel.className='lab-name';
    const input=document.createElement('input');
    input.type='text';
    input.maxLength=40;
    input.autocomplete='off';
    input.value=state.name||'';
    input.setAttribute('aria-label','Optional name stored only in this browser');
    input.addEventListener('input',()=>{state.name=input.value.slice(0,40);save(state);paintCard(correct);});
    nameLabel.appendChild(input);
    const card=add(root,'div','',{id:'quiz-card',class:'score-card'});
    paintCard(correct);
    const missed=add(root,'div','',{class:'quiz-review'});
    questions.forEach((q,i)=>{
      const block=add(missed,'p');
      block.textContent=(quizPicks[i]===q.answer?'Right. ':'Review. ')+q.why;
    });
    const row=add(root,'div','',{class:'lab-row'});
    const again=add(row,'button','Try again',{type:'button'});
    again.addEventListener('click',()=>{quizIndex=0;quizPicks=[];quizDone=false;renderQuiz();});
    const share=add(row,'button','Copy result link',{type:'button'});
    share.addEventListener('click',()=>copyHash('quiz-score-'+correct+'-'+questions.length));
    const printBtn=add(row,'button','Print practice card',{type:'button'});
    printBtn.addEventListener('click',()=>window.print());
    function localPaint(){paintCard(correct);}
    localPaint();
  }
  function paintCard(correct){
    const card=el('quiz-card');
    const print=el('quiz-print');
    const name=(state.name||'').trim();
    const line=(name?name+', ':'')+correct+' / '+questions.length+' on this browser.';
    const disclaimer='Practice score only. Not a professional certificate, license, or repair credential. Nothing was submitted.';
    if(card){clear(card);add(card,'p',line);add(card,'p',disclaimer);}
    if(print){clear(print);const article=add(print,'article','',{class:'print-guide'});add(article,'h3','Practice score');add(article,'p',line);add(article,'p',disclaimer);questions.forEach(q=>{add(article,'p',q.prompt+' '+q.why);});}
  }

  function renderComponents(){
    const root=el('component-app');
    if(!root)return;
    clear(root);
    add(root,'p','Functional roles for learning. They are not connector pin numbers, wire colors, or an OEM pinout. The tool does not publish a factory schematic.',{class:'lab-note'});
    components.forEach(part=>{
      const card=add(root,'article','',{class:'component-card',id:'component-'+part.id});
      add(card,'p',part.kicker,{class:'lab-kicker'});
      add(card,'h3',part.title);
      add(card,'p',part.principle);
      const fails=add(card,'div','',{class:'claim possible'});
      add(fails,'h4','Possible failure modes · not a diagnosis');
      const ul=add(fails,'ul');
      part.fails.forEach(item=>add(ul,'li',item));
      add(card,'h4','What each role does');
      part.terminals.forEach(pin=>{
        const row=add(card,'p');
        const strong=add(row,'strong',pin.name+'. ');
        strong.insertAdjacentText?null:null;
        row.appendChild(document.createTextNode(pin.does));
      });
      if(part.fuse){
        const b=add(card,'button','Show '+part.fuse+' in fuse lookup',{type:'button'});
        b.addEventListener('click',()=>{
          const api=window.vehicleFuseApi;
          if(!api)return;
          api.selectFuse(part.fuse==='J12'||part.fuse==='J13'||part.fuse==='J17'||part.fuse==='M2'?part.fuse:part.fuse);
          const search=el('search');
          if(search){search.value=part.fuse;api.renderFuses();}
          el('fuses').scrollIntoView({behavior:'smooth',block:'start'});
        });
      }
    });
  }

  function renderVersion(){
    const root=el('version-app');
    if(!root)return;
    clear(root);
    add(root,'p','v2.1 · 7 November 2026',{class:'lab-kicker'});
    add(root,'h3','What changed');
    const list=add(root,'ul');
    [
      'v2.1 — Walkthroughs, a local practice quiz, simulated what-if faults, component roles, x-ray view, path animation, fuse filters, on-this-browser progress, contrast and type size, read-aloud, copy-link, and an installable offline cache.',
      'v2.0 — System diagrams, the NHTSA recall snapshot, and separate screenshot-index and J/M cavity labels.',
      'v1 — The original lab: procedural model, four simulated cases, the fuse crosswalk, and symptom guides.'
    ].forEach(item=>add(list,'li',item));
    add(root,'h3','Not in this version');
    const absent=add(root,'ul');
    [
      'No augmented-reality overlay. There is no tracked model of a real engine bay, so a camera overlay would be a guess.',
      'No public case-study uploads and no discussion board. Photos are not accepted here. Notes below stay in this browser.',
      'No OEM pinout, wire colors, or connector numbers. Terminal labels are functional roles only.',
      'Manufacturer communications are a separate NHTSA file from recalls. Only rows this page verified are listed under Communications. A bulletin is not proof a van has the condition.'
    ].forEach(item=>add(absent,'li',item));
    add(root,'p','Keyboard focus is the same as the rest of the page: Tab moves, Enter activates, and the diagram and quiz choices are buttons. High contrast, type size, and read-aloud are included. This page has not had a formal accessibility audit.',{class:'lab-note'});
    const issues=add(root,'p');
    issues.appendChild(document.createTextNode('Questions about the guide can go to '));
    const a=add(issues,'a','the repository issues',{href:'https://github.com/LLamasTwitchin/grand-caravan-guide/issues',target:'_blank',rel:'noopener'});
    issues.appendChild(document.createTextNode('. That is GitHub, not a forum hosted by this page.'));
    add(root,'h3','Notes on this browser');
    const area=document.createElement('textarea');
    area.rows=4;
    area.maxLength=2000;
    area.value=state.notes||'';
    area.setAttribute('aria-label','Private notes saved only in this browser');
    area.addEventListener('input',()=>{state.notes=area.value.slice(0,2000);save(state);});
    root.appendChild(area);
    add(root,'p','Saved on this browser only. Not submitted. Close the browser’s site data and the notes are gone.',{class:'lab-note'});
  }

  function renderComms(){
    const root=el('mfr-comms');
    if(!root)return;
    clear(root);
    const pack=window.vehicleMfrComms;
    const kicker=add(root,'div','',{class:'section-kicker'});
    add(kicker,'span','Manufacturer communications');
    add(kicker,'span','Not recalls');
    const heading=add(root,'h2','Communications checked for this van');
    heading.id='comms-title';
    if(!pack||!pack.records||!pack.records.length){
      add(root,'p','No verified manufacturer-communication rows were loaded. Recalls stay in the section above. This page does not invent bulletin numbers.');
      return;
    }
    add(root,'p',pack.intro);
    pack.records.forEach(row=>{
      const card=add(root,'article','',{class:'recall-card'});
      add(card,'p',row.meta,{class:'recall-meta'});
      add(card,'h3',row.title);
      add(card,'p',row.summary);
      add(card,'p',row.limit,{class:'lab-note'});
      if(row.guide){
        const b=add(card,'button','Open the related symptom guide',{type:'button'});
        b.addEventListener('click',()=>{
          const api=window.vehicleFuseApi;
          if(api&&api.openGuide&&api.openGuide(row.guide)){
            el('troubleshooting').scrollIntoView({behavior:'smooth',block:'start'});
          }
        });
      }
    });
    if(pack.source){
      const p=add(root,'p','',{class:'recall-note'});
      p.appendChild(document.createTextNode('Source: '));
      add(p,'a',pack.sourceLabel||pack.source,{href:pack.source,target:'_blank',rel:'noopener'});
      p.appendChild(document.createTextNode(' Retrieved '+pack.retrieved+'. The bulletin PDF is not copied onto this site.'));
    }
  }

  function copyHash(hash){
    const url=location.origin+location.pathname+(location.pathname.endsWith('/')?'':'')+'#'+hash;
    const note=el('a11y-note');
    const done=(ok)=>{if(note)note.textContent=ok?'Link copied.':'Copy failed. The address is '+url;};
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(url).then(()=>done(true)).catch(()=>done(false));
    }else done(false);
    if(history.replaceState)history.replaceState(null,'','#'+hash);
  }

  function applyDisplay(){
    document.documentElement.classList.toggle('contrast',!!state.contrast);
    const scale=Math.max(100,Math.min(145,Number(state.typeScale)||100));
    state.typeScale=scale;
    document.documentElement.style.zoom=String(scale/100);
    const contrast=el('contrast-toggle');
    if(contrast)contrast.setAttribute('aria-pressed',String(!!state.contrast));
    const range=el('font-scale');
    if(range){range.value=String(scale);range.setAttribute('aria-valuenow',String(scale));range.setAttribute('aria-valuetext',scale+' percent');}
    const fuseBtn=el('save-fuse');
    if(fuseBtn)fuseBtn.textContent=fuseIsSaved()?'Saved on this browser':'Save selected fuse on this browser';
  }
  function fuseIsSaved(){
    const api=window.vehicleFuseApi;
    if(!api||!api.getSelected)return false;
    return state.favorites.indexOf(String(api.getSelected()))>=0;
  }
  function wireDisplay(){
    const contrast=el('contrast-toggle');
    if(contrast)contrast.addEventListener('click',()=>{state.contrast=!state.contrast;save(state);applyDisplay();});
    const range=el('font-scale');
    if(range)range.addEventListener('input',()=>{state.typeScale=Number(range.value);save(state);applyDisplay();window.dispatchEvent(new Event('resize'));});
    const read=el('read-aloud');
    if(read)read.addEventListener('click',()=>{
      const note=el('a11y-note');
      if(!window.speechSynthesis){if(note)note.textContent='This browser has no read-aloud.';return;}
      if(speechSynthesis.speaking){speechSynthesis.cancel();if(note)note.textContent='Read-aloud stopped.';return;}
      const target=el(lastSection)||el('guide-content');
      const text=(target&&target.innerText||'').replace(/\s+/g,' ').trim().slice(0,3500);
      if(!text){if(note)note.textContent='Nothing in that section to read.';return;}
      const utter=new SpeechSynthesisUtterance(text);
      utter.rate=1;
      speechSynthesis.speak(utter);
      if(note)note.textContent='Reading the '+lastSection.replace(/-/g,' ')+' section.';
    });
    const copy=el('copy-section-link');
    if(copy)copy.addEventListener('click',()=>{
      const api=window.vehicleFuseApi;
      if(lastSection==='fuses'&&api&&api.getSelected){
        const id=api.getSelected();
        copyHash('fuse-'+(id==null?'':id));
        return;
      }
      if(lastSection==='walkthroughs'){copyHash('walk-'+walkId);return;}
      copyHash(lastSection||'simulator');
    });
    const saveFuse=el('save-fuse');
    if(saveFuse)saveFuse.addEventListener('click',()=>{
      const api=window.vehicleFuseApi;
      if(!api||!api.getSelected)return;
      const key=String(api.getSelected());
      const i=state.favorites.indexOf(key);
      if(i>=0)state.favorites.splice(i,1);else state.favorites.push(key);
      save(state);
      applyDisplay();
      if(api.renderFuses)api.renderFuses();
    });
    document.querySelectorAll('.tab').forEach(tab=>{
      tab.addEventListener('click',()=>{lastSection=tab.dataset.scroll||lastSection;});
    });
  }

  function openHash(){
    const hash=decodeURIComponent((location.hash||'').replace(/^#/,''));
    if(!hash)return;
    if(hash.indexOf('fuse-')===0){
      const id=hash.slice(5);
      const api=window.vehicleFuseApi;
      if(api){
        const key=id.toUpperCase()==='J12'? 'J12':Number(id);
        if(el('search'))el('search').value=id;
        api.selectFuse(key);
      }
      lastSection='fuses';
      const node=el('fuses');
      if(node)node.scrollIntoView({behavior:'smooth',block:'start'});
      return;
    }
    if(hash.indexOf('walk-')===0){
      const id=hash.slice(5);
      if(walks.some(w=>w.id===id))showWalk(id);
      lastSection='walkthroughs';
      const node=el('walkthroughs');
      if(node)node.scrollIntoView({behavior:'smooth',block:'start'});
      return;
    }
    if(hash.indexOf('guide-')===0){
      const title=hash.slice(6).replace(/-/g,' ');
      const api=window.vehicleFuseApi;
      if(api&&api.openGuide)api.openGuide(title);
      lastSection='troubleshooting';
      const node=el('troubleshooting');
      if(node)node.scrollIntoView({behavior:'smooth',block:'start'});
      return;
    }
    const known=['simulator','map','system-diagrams','fuses','troubleshooting','recalls','mfr-comms','walkthroughs','quiz','components','learning-hub','safety','version-log'];
    if(known.indexOf(hash)>=0){
      lastSection=hash;
      const node=el(hash);
      if(node)node.scrollIntoView({behavior:'smooth',block:'start'});
    }
  }

  function registerWorker(){
    if(!('serviceWorker' in navigator))return;
    const host=location.hostname;
    if(location.protocol==='file:'||host==='localhost'||host==='127.0.0.1')return;
    navigator.serviceWorker.register('./sw.js').catch(()=>{});
  }

  document.addEventListener('vehicle-fuse-selected',()=>applyDisplay());
  wireDisplay();
  applyDisplay();
  showWalk(state.walk&&walks.some(w=>w.id===Object.keys(state.walk)[0])?Object.keys(state.walk)[0]:walks[0].id);
  renderQuiz();
  renderComponents();
  renderVersion();
  renderComms();
  registerWorker();
  openHash();
  window.vehicleTrainingLab={walks,questions,components,reloadComms:renderComms};
})();
