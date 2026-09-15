import {AudioEngine} from "./audio-engine.js";
import {PitchDetector} from "./pitch-detector.js";
import {analyzeTuning,tuningStatus,frequencyFromMidi,noteParts,clampA4} from "./tuning.js";
import {setLanguage, getLanguage, msg} from "./ui.js";
import {SoundAnalyzer} from "./sound-analyzer.js";
import {VocalAnalyzer} from "./vocal-analyzer.js";

const engine=new AudioEngine();
const pitchDetector=new PitchDetector();
const soundAnalyzer=new SoundAnalyzer();
const vocalAnalyzer=new VocalAnalyzer();
const state={microphone:"NOT_STARTED",input:"UNKNOWN",hold:false,holdSnapshot:null,mode:"INSTRUMENT"};
let measureTimer=0, uiTimer=0, latest=null, latestPitch=null, latestTuning=null, latestSound=null, holdSound=null, latestVocal=null, holdVocal=null;
let tunerState={a4:440.0,tolerance:5,accidental:"sharp",status:"---",toneMidi:69,tonePlaying:false,toneTransition:false};

const $=id=>document.getElementById(id);
const els={hero:$("hero"),workspace:$("workspace"),start:$("startButton"),retry:$("retryButton"),heroStatus:$("heroStatus"),status:$("statusLine"),
instrumentMode:$("instrumentMode"),vocalMode:$("vocalMode"),instrumentView:$("instrumentView"),vocalView:$("vocalView"),hold:$("holdButton"),tone:$("toneButton"),stop:$("stopButton"),restart:$("restartButton"),
inputState:$("inputState"),levelBar:$("levelBar"),peakMarker:$("peakMarker"),rms:$("rmsValue"),peak:$("peakValue"),
sampleRate:$("diagSampleRate"),audioState:$("diagAudioState"),ec:$("diagEC"),ns:$("diagNS"),agc:$("diagAGC"),diagInput:$("diagInput"),diagRms:$("diagRms"),diagPeak:$("diagPeak"),pitchFrequency:$("pitchFrequency"),pitchConfidence:$("pitchConfidence"),pitchVoiced:$("pitchVoiced"),pitchStatus:$("pitchStatus"),diagPitchFrequency:$("diagPitchFrequency"),diagPitchConfidence:$("diagPitchConfidence"),diagPitchVoiced:$("diagPitchVoiced"),diagPitchState:$("diagPitchState"),diagRawPeriod:$("diagRawPeriod"),tunerNote:$("tunerNote"),tunerSolfege:$("tunerSolfege"),tunerTarget:$("tunerTarget"),tunerCent:$("tunerCent"),tunerStatus:$("tunerStatus"),centDot:$("centDot"),a4:$("a4Reference"),tolerance:$("tuneTolerance"),accidental:$("accidentalMode"),toneNote:$("toneNote"),toneFrequency:$("toneFrequency"),toneDown:$("toneDown"),tonePlay:$("tonePlay"),toneUp:$("toneUp"),
spectralCentroid:$("spectralCentroid"),spectrumCanvas:$("spectrumCanvas"),waveCanvas:$("waveCanvas"),
vocalNote:$("vocalNote"),vocalSolfege:$("vocalSolfege"),vocalFrequency:$("vocalFrequency"),vocalState:$("vocalState"),vocalTime:$("vocalTime"),vocalEvent:$("vocalEvent"),pitchCanvas:$("pitchCanvas"),vocalAvg:$("vocalAvg"),vocalRange:$("vocalRange"),vocalVariation:$("vocalVariation"),vocalVibrato:$("vocalVibrato"),
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
  if(tunerState.tonePlaying)engine.setReferenceToneFrequency(f);
  return f;
}
async function toggleTone(){
  if(tunerState.toneTransition)return;
  tunerState.toneTransition=true;els.tonePlay.disabled=true;
  if(tunerState.tonePlaying){
    try{
      await engine.stopReferenceTone();tunerState.tonePlaying=false;els.tonePlay.textContent="▶ PLAY TONE";
      const d=await engine.start();state.microphone="READY";state.input="UNKNOWN";renderDiagnostics(d);
      pitchDetector.reset();latest=null;latestPitch=null;latestTuning=null;
      await new Promise(r=>setTimeout(r,250));startLoops();renderStatus();els.stop.hidden=false;els.restart.hidden=true;
    }catch(e){
      tunerState.tonePlaying=false;state.microphone=e?.code||"MICROPHONE_UNAVAILABLE";stopLoops();resetLiveInput();renderStatus();els.stop.hidden=true;els.restart.hidden=false;
    }finally{tunerState.toneTransition=false;els.tonePlay.disabled=false;}
    return;
  }
  if(state.microphone!=="READY"){tunerState.toneTransition=false;els.tonePlay.disabled=false;return;}
  stopLoops();latest=null;latestPitch=null;latestTuning=null;pitchDetector.reset();
  try{
    await engine.stopMeasurement();state.microphone="MICROPHONE_OFF";state.input="UNKNOWN";renderStatus();
    const f=updateToneReadout();await engine.startReferenceTone(f);tunerState.tonePlaying=true;els.tonePlay.textContent="■ STOP TONE";els.stop.hidden=true;
  }catch(e){
    tunerState.tonePlaying=false;els.tonePlay.textContent="▶ PLAY TONE";
    try{const d=await engine.start();state.microphone="READY";renderDiagnostics(d);pitchDetector.reset();await new Promise(r=>setTimeout(r,250));startLoops();els.stop.hidden=false;}
    catch(re){state.microphone=re?.code||"MICROPHONE_UNAVAILABLE";els.stop.hidden=true;els.restart.hidden=false;}
    renderStatus();
  }finally{tunerState.toneTransition=false;els.tonePlay.disabled=false;}
}


function renderLiveMeasurement(p){
  if(!p){
    els.pitchFrequency.textContent="---";
    clearTuner("---");
    return;
  }
  renderPitch(p);
  if(p.voiced && p.pitchState==="VALID" && Number.isFinite(p.frequency)){
    renderTuner(p);
  }else{
    clearTuner(p.pitchState||"---");
  }
}
function drawWaveform(buffer){
  const cv=els.waveCanvas;if(!cv||!buffer)return;const c=cv.getContext("2d"),w=cv.width,h=cv.height;
  c.clearRect(0,0,w,h);c.strokeStyle="#67e892";c.lineWidth=2;c.beginPath();
  const step=Math.max(1,Math.floor(buffer.length/w));
  for(let x=0;x<w;x++){const i=Math.min(buffer.length-1,x*step),y=h/2-buffer[i]*h*.44;x?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();
}
function drawSpectrum(s){
  const cv=els.spectrumCanvas;if(!cv||!s?.dbBins)return;const c=cv.getContext("2d"),w=cv.width,h=cv.height;
  c.clearRect(0,0,w,h);c.strokeStyle="#67e892";c.lineWidth=2;c.beginPath();
  const maxHz=Math.min(10000,s.nyquist),maxBin=Math.min(s.dbBins.length-1,Math.floor(maxHz/s.binHz));
  for(let x=0;x<w;x++){const i=Math.min(maxBin,Math.floor(x/w*maxBin));const db=Math.max(-100,Math.min(0,s.dbBins[i]));const y=h-(db+100)/100*h;x?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();
}
function renderSound(s,wave){
  if(!s)return;
  els.spectralCentroid.textContent=Number.isFinite(s.centroidHz)?`${s.centroidHz.toFixed(1)} Hz`:"--- Hz";
  drawSpectrum(s);drawWaveform(wave);
  for(let i=1;i<=8;i++){
    const h=s.harmonics?.[i-1],v=$(`harmonicValue${i}`),bar=$(`harmonicBar${i}`);
    if(!v||!bar)continue;
    if(!h||h.outOfRange||!Number.isFinite(h.relativePercent)){v.textContent="---";bar.style.setProperty("--v","0%");continue;}
    const pct=Math.max(0,Math.min(100,h.relativePercent));
    v.textContent=i===1?"100%":`${pct.toFixed(1)}%`;
    bar.style.setProperty("--v",`${pct}%`);
  }
}
function formatTime(ms){const s=Math.floor(ms/1000);return `00:${String(s).padStart(2,"0")}`;}
function noteTextFromHz(f){if(!Number.isFinite(f))return "---";const n=Math.round(69+12*Math.log2(f/tunerState.a4));const p=noteParts(n,tunerState.accidental);return `${p.name}${p.octave}`;}
function drawPitchHistory(v){
  const cv=els.pitchCanvas;if(!cv)return;const c=cv.getContext("2d"),w=cv.width,h=cv.height;c.clearRect(0,0,w,h);
  const fs=v?.frames?.map(x=>x.f)||[];if(fs.length<2)return;const lo=Math.min(...fs),hi=Math.max(...fs),span=Math.max(10,hi-lo);
  c.strokeStyle="#67e892";c.lineWidth=2;c.beginPath();
  fs.forEach((f,i)=>{const x=i/(fs.length-1)*w,y=h-(f-(lo-span*.1))/(span*1.2)*h;i?c.lineTo(x,y):c.moveTo(x,y)});c.stroke();
}
function renderVocal(v,pitch){
  if(!v)return;
  const liveF=pitch?.pitchState==="VALID"?pitch.frequency:null;
  const stopped=["MEASUREMENT_STOPPED","MEASUREMENT_COMPLETE"].includes(v.state);
  const f=stopped&&v.lastResult?v.lastResult.avgHz:liveF;
  els.vocalNote.textContent=noteTextFromHz(f);els.vocalFrequency.textContent=Number.isFinite(f)?f.toFixed(2):"---";
  if(els.vocalSolfege){const n=Number.isFinite(f)?Math.round(69+12*Math.log2(f/tunerState.a4)):null;els.vocalSolfege.textContent=n===null?"---":noteParts(n,tunerState.accidental).solfege||"---";}
  els.vocalState.textContent=`● ${v.state}`;els.vocalTime.textContent=`${formatTime(v.elapsedMs)} / 00:30`;
  if(els.vocalEvent){
    const event=v.state==="MEASUREMENT_COMPLETE"?"30秒の計測が完了しました。計測結果を表示しています。次の発声で新しい計測を開始します。":v.state==="MEASUREMENT_STOPPED"?"音が止まったため計測を停止しました。直前の計測結果を表示しています。":v.state==="MEASURING"?"計測中です。音を止めると約1秒後に計測を停止します。":v.state==="VOICE_DETECTED"?"音声を検出しました。計測開始を判定しています。":"発声すると自動で計測を開始します。";
    els.vocalEvent.textContent=event;els.vocalEvent.dataset.state=v.state==="MEASUREMENT_COMPLETE"?"complete":v.state==="MEASUREMENT_STOPPED"?"ended":"live";
  }
  drawPitchHistory(v);
  const r=v.lastResult;
  els.vocalAvg.textContent=r?`${noteTextFromHz(r.avgHz)} / ${r.avgHz.toFixed(2)} Hz`:"---";
  els.vocalRange.textContent=r?`${noteTextFromHz(r.lowHz)} ${r.lowHz.toFixed(2)} – ${noteTextFromHz(r.highHz)} ${r.highHz.toFixed(2)} Hz`:"---";
  els.vocalVariation.textContent=r?`±${r.variationCent.toFixed(1)} cent`:"---";
  els.vocalVibrato.textContent=!r?"INSUFFICIENT DATA":r.vibrato.state==="DETECTED"?`DETECTED / ${r.vibrato.rateHz.toFixed(1)} Hz / ${r.vibrato.depthCent.toFixed(1)} cent`:r.vibrato.state;
}
function clearVocal(){
  for(const e of [els.vocalNote,els.vocalFrequency,els.vocalAvg,els.vocalRange,els.vocalVariation])if(e)e.textContent="---";
  if(els.vocalSolfege)els.vocalSolfege.textContent="---";if(els.vocalState)els.vocalState.textContent="● 計測待機中";if(els.vocalTime)els.vocalTime.textContent="00:00 / 00:30";if(els.vocalEvent){els.vocalEvent.textContent="発声すると自動でセッションを開始します。";els.vocalEvent.dataset.state="live";}if(els.vocalVibrato)els.vocalVibrato.textContent="INSUFFICIENT DATA";
  if(els.pitchCanvas)els.pitchCanvas.getContext("2d").clearRect(0,0,els.pitchCanvas.width,els.pitchCanvas.height);
}
function clearSound(){
  els.spectralCentroid.textContent="--- Hz";
  for(let i=1;i<=8;i++){const v=$(`harmonicValue${i}`),bar=$(`harmonicBar${i}`);if(v)v.textContent="---";if(bar)bar.style.setProperty("--v","0%");}
  for(const cv of [els.spectrumCanvas,els.waveCanvas])if(cv)cv.getContext("2d").clearRect(0,0,cv.width,cv.height);
}
function stopLoops(){
  if(measureTimer){clearInterval(measureTimer);measureTimer=0;}
  if(uiTimer){clearInterval(uiTimer);uiTimer=0;}
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
  latest=null; latestPitch=null; latestSound=null; holdSound=null; latestVocal=null; holdVocal=null; pitchDetector.reset();vocalAnalyzer.reset(); state.input="UNKNOWN"; state.hold=false; state.holdSnapshot=null;
  els.hold.classList.remove("is-active"); els.hold.textContent="HOLD";
  els.inputState.textContent="---"; delete els.inputState.dataset.state;
  els.rms.textContent="--- dBFS"; els.peak.textContent="--- dBFS";
  els.levelBar.style.width="0%"; els.peakMarker.style.left="0%";
  els.diagInput.textContent="---"; els.diagRms.textContent="---"; els.diagPeak.textContent="---";
  els.pitchFrequency.textContent="---";els.pitchConfidence.textContent="---";els.pitchVoiced.textContent="NO";els.pitchStatus.textContent="---"; clearTuner();
  els.diagPitchFrequency.textContent="---";els.diagPitchConfidence.textContent="---";els.diagPitchVoiced.textContent="---";els.diagPitchState.textContent="---";els.diagRawPeriod.textContent="---";
  els.sampleRate.textContent="---"; els.audioState.textContent="closed";
  els.ec.textContent="---"; els.ns.textContent="---"; els.agc.textContent="---"; clearSound();clearVocal();
}
async function stopAnalysis(){
  tunerState.tonePlaying=false;tunerState.toneTransition=false;if(els.tonePlay){els.tonePlay.textContent="▶ PLAY TONE";els.tonePlay.disabled=false;}
  stopLoops();
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
    els.hero.hidden=true;els.workspace.hidden=false;els.heroStatus.textContent="";pitchDetector.reset();startLoops();requestAnimationFrame(()=>requestAnimationFrame(()=>els.workspace.scrollIntoView({behavior:"smooth",block:"start"})));
  }catch(e){
    state.microphone=e.code||"AUDIO_INITIALIZATION_FAILED";els.heroStatus.textContent=msg(state.microphone);els.retry.hidden=false;
  }finally{els.start.disabled=false;}
}
function startLoops(){
  stopLoops();
  measureTimer=setInterval(()=>{
    latest=engine.measure();
    const b=engine.getTimeDomainBuffer();
    latestPitch=pitchDetector.detect(b,engine.context?.sampleRate,latest?.inputState);
    const fb=engine.getFrequencyDomainBuffer();
    const f0=latestPitch?.pitchState==="VALID"?latestPitch.frequency:null;
    latestSound=soundAnalyzer.analyze(fb,engine.context?.sampleRate,engine.analyser?.fftSize,f0);
    if(latestSound&&b)latestSound.waveform=new Float32Array(b);
    if(state.mode==="VOCAL")latestVocal=vocalAnalyzer.update(latestPitch,performance.now(),state.hold);
  },50);
  uiTimer=setInterval(()=>{if(latest)renderInput(latest);if(latestPitch && !state.hold)renderLiveMeasurement(latestPitch);if(latestSound&&!state.hold)renderSound(latestSound,latestSound.waveform);if(state.mode==="VOCAL"&&latestVocal&&!state.hold)renderVocal(latestVocal,latestPitch);renderDiagnostics(engine.getDiagnostics());},100);
}
// Phase 3 controls — wired in the same initialization path as START/HOLD/TONE.
function applyA4Reference(value){
  tunerState.a4=clampA4(value);
  tunerState.toneMidi=69; // A4: A4 REFERENCE change is also a one-touch A4 tone selection.
  els.a4.value=tunerState.a4.toFixed(1);
  updateToneReadout(); // Same calculated value drives both display and active oscillator.
  if(latestPitch&&!state.hold)renderLiveMeasurement(latestPitch);
}
els.a4.addEventListener("change",()=>applyA4Reference(els.a4.value));
document.querySelectorAll("[data-a4]").forEach(b=>b.addEventListener("click",()=>applyA4Reference(b.dataset.a4)));
els.tolerance.addEventListener("change",()=>{
  tunerState.tolerance=Number(els.tolerance.value)||5;
  tunerState.status="---";
  if(latestPitch&&!state.hold)renderLiveMeasurement(latestPitch);
});
els.accidental.addEventListener("change",()=>{
  tunerState.accidental=els.accidental.value;
  updateToneReadout();
  if(latestPitch&&!state.hold)renderLiveMeasurement(latestPitch);
});
els.toneDown.addEventListener("click",()=>{
  tunerState.toneMidi=Math.max(36,tunerState.toneMidi-1);
  updateToneReadout();
});
els.toneUp.addEventListener("click",()=>{
  tunerState.toneMidi=Math.min(96,tunerState.toneMidi+1);
  updateToneReadout();
});
els.tonePlay.addEventListener("click",toggleTone);
updateToneReadout();

els.start.addEventListener("click",startAudio);els.retry.addEventListener("click",startAudio);els.stop.addEventListener("click",stopAnalysis);els.restart.addEventListener("click",restartAnalysis);
els.instrumentMode.addEventListener("click",()=>{state.mode="INSTRUMENT";els.instrumentMode.classList.add("is-active");els.vocalMode.classList.remove("is-active");els.instrumentView.hidden=false;els.vocalView.hidden=true;});
els.vocalMode.addEventListener("click",()=>{state.mode="VOCAL";vocalAnalyzer.reset();latestVocal=vocalAnalyzer.snapshot(performance.now());renderVocal(latestVocal,latestPitch);els.vocalMode.classList.add("is-active");els.instrumentMode.classList.remove("is-active");els.instrumentView.hidden=true;els.vocalView.hidden=false;});
els.hold.addEventListener("click",()=>{state.hold=!state.hold;state.holdSnapshot=state.hold&&latest?{...latest}:null;holdVocal=state.hold&&latestVocal?{...latestVocal,frames:latestVocal.frames.map(x=>({...x})),lastResult:latestVocal.lastResult?structuredClone(latestVocal.lastResult):null}:null;holdSound=state.hold&&latestSound?{...latestSound,dbBins:new Float32Array(latestSound.dbBins),harmonics:latestSound.harmonics.map(h=>({...h})),waveform:latestSound.waveform?new Float32Array(latestSound.waveform):null}:null;if(state.hold&&holdSound)renderSound(holdSound,holdSound.waveform);if(state.hold&&holdVocal&&state.mode==="VOCAL")renderVocal(holdVocal,latestPitch);els.hold.classList.toggle("is-active",state.hold);els.hold.textContent=state.hold?"RELEASE":"HOLD";renderStatus();if(!state.hold){if(latest)renderInput(latest);if(latestPitch)renderLiveMeasurement(latestPitch);if(latestSound)renderSound(latestSound,latestSound.waveform);if(state.mode==="VOCAL"&&latestVocal)renderVocal(latestVocal,latestPitch);}});
function openTone(){els.sheet.classList.add("is-open");els.sheet.setAttribute("aria-hidden","false");els.backdrop.hidden=false;document.body.style.overflow="hidden";}
function closeTone(){els.sheet.classList.remove("is-open");els.sheet.setAttribute("aria-hidden","true");els.backdrop.hidden=true;document.body.style.overflow="";}
els.tone.addEventListener("click",openTone);els.toneClose.addEventListener("click",closeTone);els.backdrop.addEventListener("click",closeTone);
$("langJa").addEventListener("click",()=>setLanguage("ja"));$("langEn").addEventListener("click",()=>setLanguage("en"));
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeTone();});
window.addEventListener("pagehide",()=>{stopLoops();engine.stop();});
document.addEventListener("visibilitychange",async()=>{if(document.visibilityState==="visible"&&engine.context?.state==="suspended"){try{await engine.context.resume();}catch{}}});
setLanguage("ja");
