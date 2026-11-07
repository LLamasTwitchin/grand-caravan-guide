/* Invariants for the 2012 Grand Caravan guide. Run: node scripts/check-guide.js */
const fs=require('fs');
const path=require('path');
const root=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const diagrams=fs.readFileSync(path.join(root,'assets','system-diagrams.js'),'utf8');
const recalls=fs.readFileSync(path.join(root,'assets','reported-issues.js'),'utf8');
const webgl=fs.readFileSync(path.join(root,'assets','vehicle-webgl.js'),'utf8');
const lab=fs.readFileSync(path.join(root,'assets','training-lab.js'),'utf8');
const comms=fs.readFileSync(path.join(root,'assets','mfr-comms.js'),'utf8');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
let failed=0;
function fail(message){console.error('FAIL:',message);failed++;}
if(!html.includes('[12,40,"Rear window defogger","Comfort & body","J14"]'))fail('screenshot #12 must stay the 40 A defogger at cavity J14');
if(!html.includes('cavity:"J12",manualOnly:true')&&!html.includes('cavity:"J12", manualOnly:true'))fail('J12 must stay a manual cavity with no screenshot index');
if(/screenshot #12 is cavity J12/i.test(html+diagrams))fail('screenshot #12 was equated with cavity J12');
if(!diagrams.includes('Not an OEM wiring diagram'))fail('diagrams must say they are not OEM wiring diagrams');
if(!diagrams.includes("fuse:{n:12,cavity:'J14'}")&&!diagrams.includes('cavity:\'J14\''))fail('cooling diagram must point screenshot #12 at J14');
if(!diagrams.includes("cavity:'J12'"))fail('diagrams must name cavity J12');
if(!recalls.includes('not a ranking'))fail('recalls must say they are not a ranking');
if(!recalls.includes('11V487')||!recalls.includes('25V876'))fail('recall snapshot is missing an expected campaign');
if(!html.includes('assets/system-diagrams.js')||!html.includes('assets/reported-issues.js'))fail('new scripts are not linked from index.html');
if(!webgl.includes('simplified return'))fail('power-path return overlay is missing');
if(!webgl.includes('function setXray')||!webgl.includes('dashOffset'))fail('x-ray view or path animation is missing');
if(!html.includes('assets/training-lab.js')||!html.includes('id="xray-toggle"')||!html.includes('id="cavity-filter"'))fail('training controls are not in index.html');
if(!lab.includes('Diagnosing a no-crank condition'))fail('no-crank walkthrough is missing');
if(!lab.includes('not a professional certificate'))fail('quiz must say it is not a professional certificate');
if(!lab.includes('not connector pin numbers'))fail('component roles must reject pin numbers');
if(/\bpin\s*\d+/i.test(lab))fail('component library invented a pin number');
if(!comms.includes('10051775')||!comms.includes('not a fuse'))fail('manufacturer communication record is missing its limit');
if(!sw.includes('gc-guide-v21'))fail('service worker cache name changed unexpectedly');
if(!html.includes('manifest.webmanifest'))fail('manifest is not linked');
const vin=/\b[A-HJ-NPR-Z0-9]{17}\b/;
for(const [name,text] of [['index',html],['diagrams',diagrams],['recalls',recalls],['lab',lab],['comms',comms]]){
  if(vin.test(text))fail('possible VIN-like token in '+name);
}
if(failed)process.exit(1);
console.log('check-guide: ok');
