/* Invariants for the 2012 Grand Caravan guide. Run: node scripts/check-guide.js */
const fs=require('fs');
const path=require('path');
const root=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const diagrams=fs.readFileSync(path.join(root,'assets','system-diagrams.js'),'utf8');
const recalls=fs.readFileSync(path.join(root,'assets','reported-issues.js'),'utf8');
const webgl=fs.readFileSync(path.join(root,'assets','vehicle-webgl.js'),'utf8');
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
const vin=/\b[A-HJ-NPR-Z0-9]{17}\b/;
for(const [name,text] of [['index',html],['diagrams',diagrams],['recalls',recalls]]){
  if(vin.test(text))fail('possible VIN-like token in '+name);
}
if(failed)process.exit(1);
console.log('check-guide: ok');
