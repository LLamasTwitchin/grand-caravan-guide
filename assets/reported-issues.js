/* NHTSA recall snapshot for the active profile.
   Counts and campaigns are source records, not a ranking of what fails most often.
   Retrieved 7 November 2026 from the public NHTSA recalls-by-vehicle API. */
(function(){
  const library={
    'dodge-grand-caravan-2012':{
      retrieved:'7 November 2026',
      sourceUrl:'https://api.nhtsa.gov/recalls/recallsByVehicle?make=dodge&model=grand%20caravan&modelYear=2012',
      vehicleUrl:'https://www.nhtsa.gov/vehicle/2012/DODGE/GRAND%20CARAVAN',
      recalls:[
        {
          date:'29 September 2011',
          id:'11V487',
          makerId:'Chrysler L33',
          component:'Engine and engine cooling',
          affects:'Certain 2012 vehicles with 3.6 L engines built from 31 August 2011 through 13 September 2011. The Grand Caravan is one of several models named. This guide has not verified the engine in the active profile.',
          issue:'NHTSA summary: connecting-rod bearing failure from debris inside the engine block.',
          risk:'Connecting-rod failure may lead to engine seizure, which may increase the risk of a crash.',
          remedy:'Chrysler was to notify owners and replace the engine. Confirm open status with NHTSA or a dealer before treating a van as included.'
        },
        {
          date:'3 April 2012',
          id:'12V141',
          makerId:'Chrysler M13',
          component:'Rear suspension',
          affects:'Certain 2012 Town & Country and Grand Caravan vehicles built from 15 November 2011 through 21 November 2011 only.',
          issue:'NHTSA summary: some right-rear hub and bearing assemblies were not fully machined.',
          risk:'Durability may decrease and a wheel may separate, increasing the risk of a crash.',
          remedy:'Dealers were to replace the right-rear hub and bearing assembly. A 2012 model year alone does not put a van inside this five-day build window.'
        },
        {
          date:'2 May 2012',
          id:'12V191',
          makerId:'Chrysler M17',
          component:'Equipment · power liftgate',
          affects:'Certain 2012 Town & Country and Grand Caravan vehicles built from 9 March 2012 through 12 March 2012 only.',
          issue:'NHTSA summary: the right-side liftgate pinch sensor may not function properly, so more force may be needed to stop the power liftgate near the end of its close.',
          risk:'The liftgate may close on a person, increasing the risk of injury.',
          remedy:'Dealers were to inspect and replace the right-side liftgate pinch sensor if needed.'
        },
        {
          date:'7 May 2014',
          id:'14V234',
          makerId:'Chrysler P25',
          component:'Electrical system',
          affects:'Certain 2010–2014 Town & Country and Grand Caravan vehicles manufactured from 25 August 2010 through 31 October 2013.',
          issue:'NHTSA summary: the driver-door vent-window switch may overheat.',
          risk:'An overheated switch may result in a vehicle fire.',
          remedy:'Dealers were to replace the vent-window switch. Inclusion follows the build range, not the model year by itself.'
        },
        {
          date:'13 June 2017',
          id:'17V376',
          makerId:'Chrysler T33',
          component:'Frontal air bags',
          affects:'Certain 2011–2012 Dodge Grand Caravan vehicles. The campaign is not a statement that every 2012 van has the condition.',
          issue:'NHTSA summary: the driver frontal air bag may deploy unexpectedly if its wiring harness chafes inside the steering wheel and short-circuits.',
          risk:'Unexpected deployment increases the risk of a crash or injury to the driver.',
          remedy:'Dealers were to inspect the air-bag wiring in the steering wheel, replace it if needed, and install a protective cover. Do not probe the restraint circuit from this guide.'
        },
        {
          date:'18 December 2025',
          id:'25V876',
          makerId:'Rollx Vans',
          component:'Adaptive equipment · wheelchair restraints',
          affects:'Certain vehicles, including some Dodge Grand Caravans, only when equipped with QRT-Deluxe or QRT-Max wheelchair restraints. This is an equipment recall, not a Dodge production campaign.',
          issue:'NHTSA summary: the retractors may not lock, so the wheelchair may not be secured.',
          risk:'An unsecured wheelchair can move in transit and increase the risk of injury.',
          remedy:'Rollx was to work with Q\'Straint to inspect and replace retractors as needed. Owner letters were mailed 5 February 2026. It does not apply to a van without that restraint.'
        }
      ]
    }
  };

  const profileId=document.body.dataset.vehicleProfile||'dodge-grand-caravan-2012';
  const pack=library[profileId];
  const root=document.querySelector('#recalls');
  if(!root)return;
  if(!pack){root.hidden=true;return;}
  window.vehicleRecallLibrary=library;

  const intro=root.querySelector('#recall-intro');
  intro.textContent='NHTSA returned '+pack.recalls.length+' recall records for a 2012 Dodge Grand Caravan on '+pack.retrieved+'. They are listed by report date. This is not a ranking by how often a problem occurs, how severe it is, or whether a particular van is included. A campaign can name many models, a short build window, or one engine. The complaint categories elsewhere on this page are a different dataset: owner reports, not recalls.';

  const links=root.querySelector('#recall-links');
  const api=document.createElement('a');
  api.href=pack.sourceUrl;
  api.target='_blank';
  api.rel='noopener';
  api.textContent='Open the NHTSA recall file';
  const vehicle=document.createElement('a');
  vehicle.href=pack.vehicleUrl;
  vehicle.target='_blank';
  vehicle.rel='noopener';
  vehicle.textContent='Open the NHTSA vehicle page';
  links.append(api,document.createTextNode(' · '),vehicle);

  const list=root.querySelector('#recall-list');
  pack.recalls.forEach(item=>{
    const card=document.createElement('article');
    card.className='recall-card';
    const meta=document.createElement('div');
    meta.className='recall-meta';
    meta.textContent=item.date+' · NHTSA '+item.id+' · '+item.makerId;
    const title=document.createElement('h3');
    title.textContent=item.component;
    function paragraph(label,text){
      const p=document.createElement('p');
      const strong=document.createElement('strong');
      strong.textContent=label+' ';
      p.append(strong,document.createTextNode(text));
      return p;
    }
    const campaign=document.createElement('a');
    campaign.href='https://www.nhtsa.gov/recalls?nhtsaId='+item.id;
    campaign.target='_blank';
    campaign.rel='noopener';
    campaign.textContent='Look up '+item.id+' at NHTSA';
    card.append(meta,title,paragraph('Who it can include.',item.affects),paragraph('What the record says.',item.issue),paragraph('Stated risk.',item.risk),paragraph('Stated remedy.',item.remedy),campaign);
    list.append(card);
  });
})();
