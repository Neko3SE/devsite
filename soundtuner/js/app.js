import {AudioEngine} from "./audio-engine.js";
import {setLanguage, getLanguage, msg} from "./ui.js";

const engine=new AudioEngine();
const state={microphone:"NOT_STARTED",input:"UNKNOWN",hold:false,holdSnapshot:null,mode:"INSTRUMENT"};
let measureTimer=0, uiTimer=0, latest=null;

const $=id=>document.getElementById(id);
const els={hero:$("hero"),workspace:$("workspace"),start:$("startButton"),retry:$("retryButton"),heroStatus:$("heroStatus"),status:$("statusLine"),
instrumentMode:$("instrumentMode"),vocalMode:$("vocalMode"),instrumentView:$("instrumentView"),vocalView:$("vocalView"),hold:$("holdButton"),tone:$("toneButton"),stop:$("stopButton"),restart:$("restartButton"),
inputState:$("inputState"),levelBar:$("levelBar"),peakMarker:$("peakMarker"),rms:$("rmsValue"),peak:$("peakValue"),
sampleRate:$("diagSampleRate"),audioState:$("diagAudioState"),ec:$("diagEC"),ns:$("diagNS"),agc:$("diagAGC"),diagInput:$("diagInput"),diagRms:$("diagRms"),diagPeak:$("diagPeak"),
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
function renderStatus(){
  if(state.microphone==="MICROPHONE_OFF"){els.status.dataset.state="warning";els.status.textContent=`■ ${msg("MICROPHONE_OFF")}`;return;}
  if(state.microphone!=="READY"){els.status.dataset.state="error";els.status.textContent=`✕ ${msg(state.microphone)}`;return;}
  if(state.hold){els.status.dataset.state="ready";els.status.textContent="● HOLD";return;}
  if(state.input==="CLIP"){els.status.dataset.state="clip";els.status.textContent=`▲ ${msg("CLIP")}`;return;}
  if(state.input==="LOW"){els.status.dataset.state="low";els.status.textContent=`▲ ${msg("LOW")}`;return;}
  els.status.dataset.state="ready";els.status.textContent=`● ${msg("READY")}`;
}

function resetLiveInput(){
  latest=null; state.input="UNKNOWN"; state.hold=false; state.holdSnapshot=null;
  els.hold.classList.remove("is-active"); els.hold.textContent="HOLD";
  els.inputState.textContent="---"; delete els.inputState.dataset.state;
  els.rms.textContent="--- dBFS"; els.peak.textContent="--- dBFS";
  els.levelBar.style.width="0%"; els.peakMarker.style.left="0%";
  els.diagInput.textContent="---"; els.diagRms.textContent="---"; els.diagPeak.textContent="---";
  els.sampleRate.textContent="---"; els.audioState.textContent="closed";
  els.ec.textContent="---"; els.ns.textContent="---"; els.agc.textContent="---";
}
async function stopAnalysis(){
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
    startLoops(); renderStatus();
  }catch(e){
    state.microphone=e.code||"AUDIO_INITIALIZATION_FAILED"; renderStatus();
  }finally{els.restart.disabled=false;}
}

async function startAudio(){
  els.start.disabled=true;els.retry.hidden=true;els.heroStatus.textContent=msg("REQUESTING");
  try{
    const d=await engine.start();state.microphone="READY";state.input="UNKNOWN";renderDiagnostics(d);
    els.hero.hidden=true;els.workspace.hidden=false;els.heroStatus.textContent="";startLoops();drawTestGraphs();window.scrollTo({top:0});
  }catch(e){
    state.microphone=e.code||"AUDIO_INITIALIZATION_FAILED";els.heroStatus.textContent=msg(state.microphone);els.retry.hidden=false;
  }finally{els.start.disabled=false;}
}
function startLoops(){
  clearInterval(measureTimer);clearInterval(uiTimer);
  measureTimer=setInterval(()=>{latest=engine.measure();},25);
  uiTimer=setInterval(()=>{if(latest)renderInput(latest);renderDiagnostics(engine.getDiagnostics());},100);
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
