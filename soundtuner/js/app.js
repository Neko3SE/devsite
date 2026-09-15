import {AudioEngine} from "./audio-engine.js";
import {PitchDetector} from "./pitch-detector.js";
import {analyzeTuning,tuningStatus,frequencyFromMidi,noteParts,clampA4} from "./tuning.js";
import {setLanguage, getLanguage, msg} from "./ui.js";

const engine=new AudioEngine();
const pitchDetector=new PitchDetector();
const state={microphone:"NOT_STARTED",input:"UNKNOWN",hold:false,holdSnapshot:null,mode:"INSTRUMENT"};
let measureTimer=0, uiTimer=0, latest=null, latestPitch=null, latestTuning=null;
let tunerState={a4:440.0,tolerance:5,accidental:"sharp",status:"---",toneMidi:69,tonePlaying:false};

const $=id=>document.getElementById(id);
const els={hero:$("hero"),workspace:$("workspace"),start:$("startButton"),retry:$("retryButton"),heroStatus:$("heroStatus"),status:$("statusLine"),
instrumentMode:$("instrumentMode"),vocalMode:$("vocalMode"),instrumentView:$("instrumentView"),vocalView:$("vocalView"),hold:$("holdButton"),tone:$("toneButton"),stop:$("stopButton"),restart:$("restartButton"),
inputState:$("inputState"),levelBar:$("levelBar"),peakMarker:$("peakMarker"),rms:$("rmsValue"),peak:$("peakValue"),
sampleRate:$("diagSampleRate"),audioState:$("diagAudioState"),ec:$("diagEC"),ns:$("diagNS"),agc:$("diagAGC"),diagInput:$("diagInput"),diagRms:$("diagRms"),diagPeak:$("diagPeak"),pitchFrequency:$("pitchFrequency"),pitchConfidence:$("pitchConfidence"),pitchVoiced:$("pitchVoiced"),pitchStatus:$("pitchStatus"),diagPitchFrequency:$("diagPitchFrequency"),diagPitchConfidence:$("diagPitchConfidence"),diagPitchVoiced:$("diagPitchVoiced"),diagPitchState:$("diagPitchState"),diagRawPeriod:$("diagRawPeriod"),tunerNote:$("tunerNote"),tunerSolfege:$("tunerSolfege"),tunerTarget:$("tunerTarget"),tunerCent:$("tunerCent"),tunerStatus:$("tunerStatus"),centDot:$("centDot"),a4:$("a4Reference"),tolerance:$("tuneTolerance"),accidental:$("accidentalMode"),toneNote:$("toneNote"),toneFrequency:$("toneFrequency"),toneDown:$("toneDown"),tonePlay:$("tonePlay"),toneUp:$("toneUp"),
sheet:$("toneSheet"),backdrop:$("toneBackdrop"),toneClose:$("toneClose")};

function dbText(v){return Number.isFinite(v)?`${v.toFixed(1)} dBFS`:"-∞ dBFS";}
function boolText(v){return v===true?"ON":v===false?"OFF":"UNAVAILABLE";}
function levelPercent(db){if(!Number.isFinite(db))return 0;return Math.max(0,Math.min(100,(db+70)/70*100));}
function renderDiagnostics(d){els.sampleRate.textContent=d.sampleRate?`${d.sampleRate} Hz`:"---";els.audioState.textContent=d.audioState||"---";els.ec.textContent=boolText(d.echoCancellation);els.ns.textContent=boolText(d.noiseSuppression);els.agc.textContent=boolText(d.autoGainControl);}
function renderInput(m){
  if(!m)return;
  const shown=state.hold&&state.holdSnapshot?state.holdSnapshot:m;
  els.inputState.textContent=shown.inputState;els.inputState.dataset.state=shown.inputState.toLowerCase();
  els.rms.textContent=dbText(shown.rmsDb);els.peak.textContent=dbText(shown.peakDb);
  els.levelBar.style.width=`${levelPercent(shown.rmsDb)}%`;els.peakMarker.style.left=`${levelPercent(shown.peakDb)}%`;
  els.diagInput.textContent=shown.inputState;els.diagRms.textContent=dbText(shown.rmsDb);els.diagPeak.textContent=dbText(shown.peakDb);
  state.input=shown.inputState; renderStatus();
}


function clearTuner(status="---"){
  latestTuning=null;
  els.tunerNote.textContent="---"; els.tunerSolfege.textContent="---";
  els.tunerTarget.textContent="---"; els.tunerCent.textContent="---";
  els.tunerStatus.textContent=status; els.centDot.hidden=true;
  tunerState.status="---";
}
function renderTuner(p){
  if(!p?.voiced || p.pitchState!=="VALID" || !Number.isFinite(p.frequency)){
    clearTuner(p?.pitchState||"---"); return;
  }
  const t=analyzeTuning(p.frequency,tunerState);
  if(!t){clearTuner();return}
  latestTuning=t;
  tunerState.status=tuningStatus(t.cent,tunerState.status,tunerState.tolerance);
  els.tunerNote.textContent=t.note;
  els.tunerSolfege.textContent=t.solfege;
  els.tunerTarget.textContent=`${t.target.toFixed(2)} Hz`;
  els.tunerCent.textContent=`${t.cent>=0?"+":""}${t.cent.toFixed(1)}`;
  els.tunerStatus.textContent=tunerState.status==="IN_TUNE"?"● IN TUNE":tunerState.status;
  els.centDot.hidden=false;
  els.centDot.style.left=`${Math.max(0,Math.min(100,50+t.cent))}%`;
}
function updateToneReadout(){
  const parts=noteParts(tunerState.toneMidi,tunerState.accidental);
  const f=frequencyFromMidi(tunerState.toneMidi,tunerState.a4);
  els.toneNote.textContent=`${parts.name}${parts.octave}`;
  els.toneFrequency.textContent=`${f.toFixed(2)} Hz`;
  return f;
}
async function toggleTone(){
  if(tunerState.tonePlaying){
    engine.stopReferenceTone(); tunerState.tonePlaying=false;
    els.tonePlay.textContent="▶ PLAY TONE"; startLoops(); renderStatus(); return;
  }
  if(state.microphone!=="READY") return;
  clearInterval(measureTimer);clearInterval(uiTimer);measureTimer=0;uiTimer=0;
  const f=updateToneReadout();
  try{
    await engine.startReferenceTone(f);
    tunerState.tonePlaying=true; els.tonePlay.textContent="■ STOP TONE";
  }catch(e){
    tunerState.tonePlaying=false; startLoops();
  }
}

function renderPitch(p){
  if(!p)return;
  const f=p.frequency;
  els.pitchFrequency.textContent=Number.isFinite(f)?f.toFixed(2):"---";
  els.pitchConfidence.textContent=Number.isFinite(p.confidence)?p.confidence.toFixed(3):"---";
  els.pitchVoiced.textContent=p.voiced?"YES":"NO";
  els.pitchStatus.textContent=p.pitchState||"---";
  els.diagPitchFrequency.textContent=Number.isFinite(f)?`${f.toFixed(2)} Hz`:"---";
  els.diagPitchConfidence.textContent=Number.isFinite(p.confidence)?p.confidence.toFixed(3):"---";
  els.diagPitchVoiced.textContent=p.voiced?"YES":"NO";
  els.diagPitchState.textContent=p.pitchState||"---";
  els.diagRawPeriod.textContent=Number.isFinite(p.rawPeriod)?p.rawPeriod.toFixed(3):"---";
}

function renderStatus(){
  if(state.microphone==="MICROPHONE_OFF"){els.status.dataset.state="warning";els.status.textContent=`■ ${msg("MICROPHONE_OFF")}`;return;}
  if(state.microphone!=="READY"){els.status.dataset.state="error";els.status.textContent=`✕ ${msg(state.microphone)}`;return;}
  if(state.hold){els.status.dataset.state="ready";els.status.textContent="● HOLD";return;}
  if(state.input==="CLIP"){els.status.dataset.state="clip";els.status.textContent=`▲ ${msg("CLIP")}`;return;}
  if(state.input==="LOW"){els.status.dataset.state="low";els.status.textContent=`▲ ${msg("LOW")}`;return;}
  els.status.dataset.state="ready";els.status.textContent=`● ${msg("READY")}`;
}

function resetLiveInput(){
  latest=null; latestPitch=null; pitchDetector.reset(); state.input="UNKNOWN"; state.hold=false; state.holdSnapshot=null;
  els.hold.classList.remove("is-active"); els.hold.textContent="HOLD";
  els.inputState.textContent="---"; delete els.inputState.dataset.state;
  els.rms.textContent="--- dBFS"; els.peak.textContent="--- dBFS";
  els.levelBar.style.width="0%"; els.peakMarker.style.left="0%";
  els.diagInput.textContent="---"; els.diagRms.textContent="---"; els.diagPeak.textContent="---";
  els.pitchFrequency.textContent="---";els.pitchConfidence.textContent="---";els.pitchVoiced.textContent="NO";els.pitchStatus.textContent="---"; clearTuner();
  els.diagPitchFrequency.textContent="---";els.diagPitchConfidence.textContent="---";els.diagPitchVoiced.textContent="---";els.diagPitchState.textContent="---";els.diagRawPeriod.textContent="---";
  els.sampleRate.textContent="---"; els.audioState.textContent="closed";
  els.ec.textContent="---"; els.ns.textContent="---"; els.agc.textContent="---";
}
async function stopAnalysis(){
  tunerState.tonePlaying=false; if(els.tonePlay)els.tonePlay.textContent="▶ PLAY TONE";
  clearInterval(measureTimer); clearInterval(uiTimer); measureTimer=0; uiTimer=0;
  await engine.stop();
  resetLiveInput();
  state.microphone="MICROPHONE_OFF";
  renderStatus();
  els.stop.hidden=true;
  els.restart.hidden=false;
}
async function restartAnalysis(){
  els.restart.disabled=true;
  try{
    const d=await engine.start();
    state.microphone="READY"; state.input="UNKNOWN";
    renderDiagnostics(d); els.restart.hidden=true; els.stop.hidden=false;
    pitchDetector.reset(); startLoops(); renderStatus();
  }catch(e){
    state.microphone=e.code||"AUDIO_INITIALIZATION_FAILED"; renderStatus();
  }finally{els.restart.disabled=false;}
}

async function startAudio(){
  els.start.disabled=true;els.retry.hidden=true;els.heroStatus.textContent=msg("REQUESTING");
  try{
    const d=await engine.start();state.microphone="READY";state.input="UNKNOWN";renderDiagnostics(d);
    els.hero.hidden=true;els.workspace.hidden=false;els.heroStatus.textContent="";pitchDetector.reset();startLoops();drawTestGraphs();requestAnimationFrame(()=>requestAnimationFrame(()=>els.workspace.scrollIntoView({behavior:"smooth",block:"start"})));
  }catch(e){
    state.microphone=e.code||"AUDIO_INITIALIZATION_FAILED";els.heroStatus.textContent=msg(state.microphone);els.retry.hidden=false;
  }finally{els.start.disabled=false;}
}
function startLoops(){
  clearInterval(measureTimer);clearInterval(uiTimer);
  measureTimer=setInterval(()=>{
    latest=engine.measure();
    const b=engine.getTimeDomainBuffer();
    latestPitch=pitchDetector.detect(b,engine.context?.sampleRate,latest?.inputState);
  },50);
  uiTimer=setInterval(()=>{if(latest)renderInput(latest);if(latestPitch){renderPitch(latestPitch);renderTuner(latestPitch);}renderDiagnostics(engine.getDiagnostics());},100);
}
function drawTestGraphs(){
  for(const [id,type] of [["spectrumCanvas","s"],["waveCanvas","w"],["pitchCanvas","p"]]){
    const cv=$(id);if(!cv)continue;const c=cv.getContext("2d");c.clearRect(0,0,cv.width,cv.height);c.strokeStyle="#67e892";c.lineWidth=2.5;c.beginPath();
    for(let x=0;x<cv.width;x+=type==="w"?1:4){let y;if(type==="w")y=cv.height/2+Math.sin(x*.09)*42*Math.sin(x*.004+1);else if(type==="p")y=cv.height/2+Math.sin(x*.035)*28+Math.sin(x*.008)*10;else y=cv.height-25-(Math.sin(x*.035)*22+Math.max(0,150-x*.12)*(.25+.75*Math.abs(Math.sin(x*.023))));x?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();
  }
}
els.start.addEventListener("click",startAudio);els.retry.addEventListener("click",startAudio);els.stop.addEventListener("click",stopAnalysis);els.restart.addEventListener("click",restartAnalysis);
els.instrumentMode.addEventListener("click",()=>{state.mode="INSTRUMENT";els.instrumentMode.classList.add("is-active");els.vocalMode.classList.remove("is-active");els.instrumentView.hidden=false;els.vocalView.hidden=true;});
els.vocalMode.addEventListener("click",()=>{state.mode="VOCAL";els.vocalMode.classList.add("is-active");els.instrumentMode.classList.remove("is-active");els.instrumentView.hidden=true;els.vocalView.hidden=false;drawTestGraphs();});
els.hold.addEventListener("click",()=>{state.hold=!state.hold;state.holdSnapshot=state.hold&&latest?{...latest}:null;els.hold.classList.toggle("is-active",state.hold);els.hold.textContent=state.hold?"RELEASE":"HOLD";renderStatus();if(!state.hold&&latest)renderInput(latest);});
function openTone(){els.sheet.classList.add("is-open");els.sheet.setAttribute("aria-hidden","false");els.backdrop.hidden=false;document.body.style.overflow="hidden";}
function closeTone(){els.sheet.classList.remove("is-open");els.sheet.setAttribute("aria-hidden","true");els.backdrop.hidden=true;document.body.style.overflow="";}
els.tone.addEventListener("click",openTone);els.toneClose.addEventListener("click",closeTone);els.backdrop.addEventListener("click",closeTone);
$("langJa").addEventListener("click",()=>setLanguage("ja"));$("langEn").addEventListener("click",()=>setLanguage("en"));
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeTone();});
window.addEventListener("pagehide",()=>{clearInterval(measureTimer);clearInterval(uiTimer);engine.stop();});
document.addEventListener("visibilitychange",async()=>{if(document.visibilityState==="visible"&&engine.context?.state==="suspended"){try{await engine.context.resume();}catch{}}});
setLanguage("ja");


els.a4?.addEventListener("change",()=>{
  tunerState.a4=clampA4(els.a4.value); els.a4.value=tunerState.a4.toFixed(1);
  updateToneReadout(); if(latestPitch)renderTuner(latestPitch);
});
document.querySelectorAll("[data-a4]").forEach(b=>b.addEventListener("click",()=>{
  tunerState.a4=clampA4(b.dataset.a4); els.a4.value=tunerState.a4.toFixed(1);
  updateToneReadout(); if(latestPitch)renderTuner(latestPitch);
}));
els.tolerance?.addEventListener("change",()=>{tunerState.tolerance=Number(els.tolerance.value)||5;tunerState.status="---";if(latestPitch)renderTuner(latestPitch);});
els.accidental?.addEventListener("change",()=>{tunerState.accidental=els.accidental.value;updateToneReadout();if(latestPitch)renderTuner(latestPitch);});
els.toneDown?.addEventListener("click",()=>{if(!tunerState.tonePlaying){tunerState.toneMidi=Math.max(36,tunerState.toneMidi-1);updateToneReadout();}});
els.toneUp?.addEventListener("click",()=>{if(!tunerState.tonePlaying){tunerState.toneMidi=Math.min(96,tunerState.toneMidi+1);updateToneReadout();}});
els.tonePlay?.addEventListener("click",toggleTone);
updateToneReadout();

