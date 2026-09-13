import {AudioEngine} from "./audio-engine.js";
import {Recorder} from "./recorder.js";
import {RealtimeAnalyzer} from "./analyzer.js";
import {AnalysisEngine} from "./analysis-engine.js";
import {DSPEngine} from "./dsp-engine.js";
import {PRESETS} from "./presets.js";
import {Player} from "./player.js";
import {UI} from "./ui.js";
import {encodeWavPcm16,wavFilename} from "./wav-encoder.js";

const $=id=>document.getElementById(id);
const ui=new UI(), audio=new AudioEngine(), recorder=new Recorder(), analyzer=new RealtimeAnalyzer(ui),
      player=new Player(ui,audio), analysisEngine=new AnalysisEngine(), dspEngine=new DSPEngine();
const state={app:"READY",mic:"REQUIRED",session:null,sessionId:0,recordStarted:0,tick:0,pendingStop:null,micSettings:{},permissionStatus:null,selectedPreset:null,processed:null,processing:false,playbackSource:null,playbackReturnState:null,processorPlaybackActualSource:null,selectedMode:"PRESET",bypassEnabled:false,
manualParameters:{pitch:0,formant:0,lowCut:0,highCut:0,lowEq:0,highEq:0,modType:"off",modRate:.1,modDepth:0,delayMs:0,feedback:0,distortion:0,mix:1,outputGain:0},
appliedMode:null,appliedParameters:null,parametersDirty:false,saveInProgress:false};

function capabilities(){
  return {
    "SECURE CONTEXT":window.isSecureContext,
    "AUDIO CONTEXT":!!(window.AudioContext||window.webkitAudioContext),
    "MICROPHONE API":!!navigator.mediaDevices?.getUserMedia,
    "MEDIA RECORDER":!!window.MediaRecorder,
    "WEB WORKER":!!window.Worker,
    "CANVAS":!!document.createElement("canvas").getContext,
    "BLOB":!!window.Blob,
    "OBJECT URL":!!URL.createObjectURL
  };
}
const caps=capabilities();ui.setCapabilities(caps);
ui.setTechnical({"Phase":"6 Rev.1","App State":state.app,"Microphone":state.mic,"Secure Context":String(window.isSecureContext),"MediaRecorder MIME":"UNKNOWN","Actual Sample Rate":"UNKNOWN"});
ui.clearScopes();

const required=["SECURE CONTEXT","AUDIO CONTEXT","MICROPHONE API","MEDIA RECORDER","WEB WORKER","CANVAS","BLOB","OBJECT URL"];
const missing=required.filter(k=>!caps[k]);
if(missing.length){
  ui.status("ERROR","error");ui.mic("NOT AVAILABLE");
  ui.permissionError("BROWSER FEATURE NOT AVAILABLE / 必要な機能を利用できません: "+missing.join(", "));
  $("enableMic").disabled=true;
}

const presetButtons=[...document.querySelectorAll("[data-preset]")];
function updateProcessorControls(){
 const original=!!state.session?.original,busy=state.processing||state.app==="PLAYING";
 presetButtons.forEach(b=>b.disabled=!original||busy);
 const canApply=state.selectedMode==="PRESET"?!!state.selectedPreset:true;
 $("applyPreset").disabled=!original||!canApply||busy||state.bypassEnabled;
 $("playProcessed").disabled=busy||(state.bypassEnabled?!original:!state.processed);
 $("stopProcessed").disabled=!(state.app==="PLAYING"&&state.playbackSource==="PROCESSED");
}
const fmtHz=v=>Number.isFinite(v)?`${v.toFixed(1)} Hz`:"---";
const fmtDb=v=>Number.isFinite(v)?`${v.toFixed(1)} dBFS`:"---";
const fmtSec=v=>Number.isFinite(v)?`${v.toFixed(3)} sec`:"---";
const delta=(b,a,unit,digits=1)=>Number.isFinite(a)&&Number.isFinite(b)?`${b-a>=0?"+":""}${(b-a).toFixed(digits)} ${unit}`:"---";
function renderAppliedSettings(preset,params=null,mode="PRESET"){
  const p=params||PRESETS[preset];
  if(!p){$("appliedSettings").innerHTML="<span>---</span>";return}
  const rows=[
    ["MODE",mode],["PRESET",mode==="PRESET"?preset:"MANUAL"],["PITCH SHIFT",`${p.pitch>=0?"+":""}${p.pitch.toFixed(1)} st`],
    ["FORMANT CHARACTER",`${p.formant>=0?"+":""}${p.formant}%`],["LOW CUT",`${p.lowCut} Hz`],["HIGH CUT",p.highCut?`${p.highCut} Hz`:"OFF"],
    ["LOW EQ",`${p.lowEq>=0?"+":""}${p.lowEq} dB`],["HIGH EQ",`${p.highEq>=0?"+":""}${p.highEq} dB`],
    ["MODULATION",p.modType==="off"?"OFF":`${p.modType.toUpperCase()} ${p.modRate} Hz / ${Math.round(p.modDepth*100)}%`],
    ["DELAY",p.delayMs?`${p.delayMs} ms / FB ${Math.round(p.feedback*100)}%`:"OFF"],["DRIVE",`${Math.round(p.distortion*100)}%`],["OUTPUT GAIN",`${p.outputGain>=0?"+":""}${p.outputGain} dB`]
  ];
  $("appliedSettings").replaceChildren(...rows.map(([k,v])=>{const d=document.createElement("div");d.className="setting-chip";const a=document.createElement("strong"),b=document.createElement("span");a.textContent=k;b.textContent=v;d.append(a,b);return d}));
}
function renderComparison(){
  const a=state.session?.original?.analysis,b=state.processed?.analysis;
  if(!a||!b){$("comparisonState").textContent="NO PROCESSED AUDIO";return}
  $("comparisonState").textContent="MEASURED A / B";
  $("cmpOrigPitch").textContent=Number.isFinite(a.pitchAvg)?fmtHz(a.pitchAvg):"UNRELIABLE";$("cmpProcPitch").textContent=Number.isFinite(b.pitchAvg)?fmtHz(b.pitchAvg):"UNRELIABLE";$("cmpChangePitch").textContent=delta(b.pitchAvg,a.pitchAvg,"Hz");
  $("cmpOrigRange").textContent=Number.isFinite(a.pitchMin)&&Number.isFinite(a.pitchMax)?`${a.pitchMin.toFixed(1)}–${a.pitchMax.toFixed(1)} Hz`:"UNRELIABLE";
  $("cmpProcRange").textContent=Number.isFinite(b.pitchMin)&&Number.isFinite(b.pitchMax)?`${b.pitchMin.toFixed(1)}–${b.pitchMax.toFixed(1)} Hz`:"UNRELIABLE";
  $("cmpChangeRange").textContent="—";
  $("cmpOrigRms").textContent=fmtDb(a.rmsAvgDb);$("cmpProcRms").textContent=fmtDb(b.rmsAvgDb);$("cmpChangeRms").textContent=delta(b.rmsAvgDb,a.rmsAvgDb,"dB");
  $("cmpOrigPeak").textContent=fmtDb(a.peakDb);$("cmpProcPeak").textContent=fmtDb(b.peakDb);$("cmpChangePeak").textContent=delta(b.peakDb,a.peakDb,"dB");
  $("cmpOrigCentroid").textContent=fmtHz(a.centroidAvg);$("cmpProcCentroid").textContent=fmtHz(b.centroidAvg);$("cmpChangeCentroid").textContent=delta(b.centroidAvg,a.centroidAvg,"Hz");
  $("cmpOrigDuration").textContent=fmtSec(a.duration);$("cmpProcDuration").textContent=fmtSec(b.duration);
  const dd=Math.abs((b.duration??NaN)-(a.duration??NaN));$("cmpChangeDuration").textContent=Number.isFinite(dd)&&dd<=1/(state.session.original.sampleRate||48000)?"MATCH":Number.isFinite(dd)?`WARNING ${(b.duration-a.duration).toFixed(4)} sec`:"---";
}
function resetComparison(){
  $("comparisonState").textContent="NO PROCESSED AUDIO";$("appliedSettings").replaceChildren(Object.assign(document.createElement("span"),{textContent:"---"}));
  ["cmpOrigPitch","cmpProcPitch","cmpChangePitch","cmpOrigRange","cmpProcRange","cmpChangeRange","cmpOrigRms","cmpProcRms","cmpChangeRms","cmpOrigPeak","cmpProcPeak","cmpChangePeak","cmpOrigCentroid","cmpProcCentroid","cmpChangeCentroid","cmpOrigDuration","cmpProcDuration","cmpChangeDuration"].forEach(id=>$(id).textContent="---");
}

function renderSaveControls(){
 const busy=state.processing||state.app==="PLAYING"||state.app==="RECORDING"||state.saveInProgress;
 $("saveOriginal").disabled=!state.session?.original||busy;
 $("saveProcessed").disabled=!state.processed||busy;
 $("saveState").textContent=state.processed?"ORIGINAL + PROCESSED":state.session?.original?"ORIGINAL READY":"NO AUDIO";
}
function updateSaveMeta(source,preset,sampleRate,duration,size){
 $("saveSource").textContent=source.toUpperCase();$("savePreset").textContent=preset||"ORIGINAL";
 $("saveRate").textContent=`${Math.round(sampleRate)} Hz`;$("saveDuration").textContent=`${duration.toFixed(3)} sec`;
 $("saveSize").textContent=size>=1048576?`${(size/1048576).toFixed(2)} MiB`:`${(size/1024).toFixed(1)} KiB`;
}
function safeAsciiFilename(filename){
 const fallback="voice_audio.wav";
 if(typeof filename!=="string"||!filename)return fallback;
 const safe=filename.replace(/[^A-Za-z0-9._-]/g,"_");
 return safe.toLowerCase().endsWith(".wav")?safe:`${safe}.wav`;
}
function triggerDownload(blob,filename){
 const safeName=safeAsciiFilename(filename);
 const url=URL.createObjectURL(blob);
 const a=document.createElement("a");
 a.href=url;
 a.download=safeName;
 a.style.display="none";
 document.body.appendChild(a);
 a.click();
 a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1500);
 return safeName;
}
async function saveWav(kind){
 if(state.saveInProgress||state.processing||state.app==="PLAYING"||state.app==="RECORDING")return;
 const original=kind==="original",audio=original?state.session?.original:state.processed;if(!audio)return;
 state.saveInProgress=true;renderSaveControls();$("saveMessage").textContent="ENCODING WAV...";
 try{
   const blob=encodeWavPcm16(audio.samples,audio.sampleRate);
   const preset=original?"ORIGINAL":(audio.mode==="MANUAL"?"MANUAL":audio.preset);
   updateSaveMeta(kind,preset,audio.sampleRate,audio.duration,blob.size);
   const downloadName=triggerDownload(blob,wavFilename(kind,preset));
   $("saveMessage").textContent=`✓ DOWNLOAD STARTED / ${downloadName}`;
 }catch(e){$("saveMessage").textContent="SAVE FAILED / WAV保存処理を開始できませんでした。";}
 finally{state.saveInProgress=false;renderSaveControls()}
}
$("saveOriginal").addEventListener("click",()=>saveWav("original"));
$("saveProcessed").addEventListener("click",()=>{
 if(state.parametersDirty){
   $("saveMessage").textContent="PARAMETERS CHANGED / 最後に正常生成されたPROCESSED音声を保存します。";
   setTimeout(()=>saveWav("processed"),0);
 }else saveWav("processed");
});

function finishPlayback({stopPlayer=false}={}){
  if(stopPlayer)player.stop(false);
  const source=state.playbackSource;
  const returnState=state.playbackReturnState||(state.processed?"PROCESSED":"RECORDED");
  state.playbackSource=null;
  state.playbackReturnState=null;
  state.app=returnState;
  ui.status("READY","ready");
  $("analyzerState").textContent="ANALYSIS READY";
  const duration=source==="PROCESSED"
    ?(state.processorPlaybackActualSource==="ORIGINAL"?state.session?.original?.duration:state.processed?.duration)
    :state.session?.original?.duration;
  state.processorPlaybackActualSource=null;
  if(Number.isFinite(duration))ui.playbackProgress(0,duration);
  ui.resetAnalyzer();
  updateControls();
  updateProcessorControls();
}
const manualRanges=[...document.querySelectorAll("[data-manual]")],manualNumbers=[...document.querySelectorAll("[data-manual-number]")];
function effectiveManual(){
 const p={...state.manualParameters};
 p.modDepth/=100;p.feedback/=100;p.distortion/=100;p.mix/=100;
 return p;
}
function setManualUI(params){
 const uiVals={...params,modDepth:(params.modDepth??0)*100,feedback:(params.feedback??0)*100,distortion:(params.distortion??0)*100,mix:(params.mix??1)*100};
 for(const el of manualRanges){el.value=uiVals[el.dataset.manual]??0}
 for(const el of manualNumbers){el.value=uiVals[el.dataset.manualNumber]??0}
 const sel=document.querySelector("[data-manual-select=modType]");if(sel)sel.value=params.modType||"off";
}
function markManualDirty(){
 state.parametersDirty=true;if(state.processed){$("processorState").textContent="PARAMETERS CHANGED";$("saveMessage").textContent="PARAMETERS CHANGED / SAVE PROCESSED saves the last successfully generated audio.";}else $("processorState").textContent="READY TO PROCESS";updateProcessorControls();
}
function switchMode(mode){
 if(state.app==="PLAYING"||state.processing)return;
 state.selectedMode=mode;$("presetMode").hidden=mode!=="PRESET";$("manualMode").hidden=mode!=="MANUAL";
 $("presetTab").classList.toggle("active",mode==="PRESET");$("manualTab").classList.toggle("active",mode==="MANUAL");
 updateProcessorControls();
}
$("presetTab").addEventListener("click",()=>switchMode("PRESET"));$("manualTab").addEventListener("click",()=>switchMode("MANUAL"));
manualRanges.forEach(el=>el.addEventListener("input",()=>{const k=el.dataset.manual,v=Number(el.value);state.manualParameters[k]=v;const n=document.querySelector(`[data-manual-number="${k}"]`);if(n)n.value=el.value;markManualDirty()}));
manualNumbers.forEach(el=>el.addEventListener("change",()=>{const k=el.dataset.manual;let v=Number(el.value);v=Math.max(Number(el.min),Math.min(Number(el.max),v));el.value=v;state.manualParameters[k]=v;const r=document.querySelector(`[data-manual="${k}"]`);if(r)r.value=v;markManualDirty()}));
document.querySelector("[data-manual-select=modType]").addEventListener("change",e=>{state.manualParameters.modType=e.target.value;markManualDirty()});
$("resetManual").addEventListener("click",()=>{state.manualParameters={pitch:0,formant:0,lowCut:0,highCut:0,lowEq:0,highEq:0,modType:"off",modRate:.1,modDepth:0,delayMs:0,feedback:0,distortion:0,mix:100,outputGain:0};setManualUI(effectiveManual());markManualDirty()});
$("bypassBtn").addEventListener("click",()=>{
 state.bypassEnabled=!state.bypassEnabled;
 $("bypassBtn").textContent=state.bypassEnabled?"BYPASS ON":"BYPASS OFF";
 $("bypassBtn").classList.toggle("active",state.bypassEnabled);
 $("playProcessed").textContent=state.bypassEnabled?"PLAY ORIGINAL":"PLAY PROCESSED";
 $("processorState").textContent=state.bypassEnabled?"BYPASS / ORIGINAL":state.processed?"PROCESSED READY":"READY TO PROCESS";
 updateProcessorControls();
});
$("copyToManual").addEventListener("click",()=>{if(!state.selectedPreset||!PRESETS[state.selectedPreset])return;const p={...PRESETS[state.selectedPreset],mix:1};state.manualParameters={...p,modDepth:p.modDepth*100,feedback:p.feedback*100,distortion:p.distortion*100,mix:100};setManualUI(p);state.parametersDirty=true;switchMode("MANUAL");$("processorState").textContent="COPIED TO MANUAL";updateProcessorControls()});

presetButtons.forEach(b=>b.addEventListener("click",()=>{
 if(b.disabled)return;state.selectedPreset=b.dataset.preset;presetButtons.forEach(x=>x.classList.toggle("selected",x===b));
 $("processorState").textContent=state.processed?"PRESET CHANGED":"READY TO PROCESS";$("copyToManual").disabled=state.selectedPreset==="ORIGINAL";updateProcessorControls();
}));
$("applyPreset").addEventListener("click",async()=>{
 if(!state.session?.original||state.processing||state.bypassEnabled)return;
 if(state.selectedMode==="PRESET"&&!state.selectedPreset)return;
 if(state.selectedMode==="PRESET"&&state.selectedPreset==="ORIGINAL"){state.processed=null;$("processorState").textContent="ORIGINAL / NO DSP";$("processingProgress").textContent="ORIGINAL is the unprocessed recording.";resetComparison();updateProcessorControls();return}
 const original=state.session.original,old=state.processed,preset=state.selectedMode==="PRESET"?state.selectedPreset:"MANUAL",params=state.selectedMode==="PRESET"?{...PRESETS[state.selectedPreset],mix:1}:effectiveManual(),sid=state.session.id,t0=performance.now();
 state.processing=true;state.app="PROCESSING";$("processorState").textContent="PROCESSING";updateProcessorControls();
 try{
  const out=await dspEngine.process(original.samples,original.sampleRate,params,m=>{if(state.session?.id===sid)$("processingProgress").textContent=`${m.stage} ${m.progress}%`});
  if(state.session?.id!==sid)return;
  if(Math.abs(out.duration-original.duration)>1/original.sampleRate)throw Error("DSP_DURATION_MISMATCH");
  const analysis=await analysisEngine.analyze(out.samples,out.sampleRate);
  if(state.session?.id!==sid)return;
  state.processed={samples:out.samples,sampleRate:out.sampleRate,duration:out.duration,analysis,preset,mode:state.selectedMode,parameters:{...params},processingInfo:{elapsedMs:performance.now()-t0}};
  state.appliedMode=state.selectedMode;state.appliedParameters={...params};state.parametersDirty=false;
  $("processorState").textContent="✓ PROCESSING COMPLETE";$("processingProgress").textContent=`${preset} / ${(state.processed.processingInfo.elapsedMs/1000).toFixed(2)} sec`;
  renderAppliedSettings(preset,params,state.selectedMode);renderComparison();
 }catch(e){state.processed=old;$("processorState").textContent="PROCESSING FAILED";$("processingProgress").textContent="Original and last valid processed audio are preserved."}
 finally{if(state.session?.id===sid){state.processing=false;state.app=state.processed?"PROCESSED":"RECORDED";updateControls();updateProcessorControls()}}
});
$("playProcessed").addEventListener("click",async()=>{
  if(state.processing||state.app==="PLAYING")return;
  const bypass=state.bypassEnabled;
  const source=bypass?state.session?.original:state.processed;
  if(!source)return;
  const sourceName=bypass?"ORIGINAL":"PROCESSED";
  const returnState=state.processed?"PROCESSED":"RECORDED";
  try{
    state.playbackSource="PROCESSED";
    state.processorPlaybackActualSource=sourceName;
    state.playbackReturnState=returnState;
    state.app="PLAYING";
    ui.status("PLAYING","ready");
    $("analyzerState").textContent=bypass?"A : ORIGINAL / BYPASS":`B : PROCESSED / ${state.processed.preset}`;
    updateControls();updateProcessorControls();
    await player.play(source.samples,source.sampleRate,()=>{
      if(state.app!=="PLAYING"||state.playbackSource!=="PROCESSED")return;
      finishPlayback();
    });
  }catch(e){
    state.playbackSource=null;state.playbackReturnState=null;state.processorPlaybackActualSource=null;
    state.app=returnState;
    ui.status("ERROR","error");
    $("analyzerState").textContent="ANALYSIS READY";
    $("processingProgress").textContent=`PLAYBACK FAILED / ${sourceName}音声を再生できませんでした。`;
    ui.resetAnalyzer();updateControls();updateProcessorControls();
  }
});
$("stopProcessed").addEventListener("click",()=>{
  if(state.app!=="PLAYING"||state.playbackSource!=="PROCESSED")return;
  finishPlayback({stopPlayer:true});
});

function updateControls(){
  $("recordBtn").disabled=!(state.mic==="READY"&&(state.app==="READY"||state.app==="RECORDED"||state.app==="PROCESSED"));
  $("stopBtn").disabled=state.app!=="RECORDING";
  const canPlay=!!state.session && (state.app==="RECORDED"||state.app==="PROCESSED");
  $("playBtn").disabled=!canPlay;
  $("playStopBtn").disabled=!(state.app==="PLAYING"&&state.playbackSource==="ORIGINAL");
  ui.setTechnical({
    "Phase":"1","App State":state.app,"Microphone":state.mic,
    "Secure Context":String(window.isSecureContext),
    "MediaRecorder MIME":state.lastMime||"UNKNOWN",
    "Actual Sample Rate":audio.context?.sampleRate?audio.context.sampleRate+" Hz":"UNKNOWN",
    "Requested Channel":"1 / MONO",
    "Actual Channel Count":state.micSettings.channelCount??"UNKNOWN",
    "Echo Cancellation":state.micSettings.echoCancellation??"UNKNOWN",
    "Noise Suppression":state.micSettings.noiseSuppression??"UNKNOWN",
    "Auto Gain Control":state.micSettings.autoGainControl??"UNKNOWN"
  });
  renderSaveControls();
}
function showPermissionPanel(){
  $("permissionPanel").hidden=false;
}
function hidePermissionPanel(){
  $("permissionPanel").hidden=true;
}
function micError(err){
  state.mic=err?.name==="NotAllowedError"?"DENIED":"UNAVAILABLE";
  showPermissionPanel();
  ui.mic(state.mic==="DENIED"?"ACCESS DENIED":"NOT AVAILABLE");
  $("enableMic").textContent="TRY AGAIN";
  ui.permissionError(state.mic==="DENIED"
    ?"MICROPHONE ACCESS DENIED\nマイクの使用を許可してから、もう一度お試しください。\nAllow microphone access and try again."
    :"MICROPHONE NOT AVAILABLE\nマイクの接続や端末の設定を確認してください。\nCheck your microphone connection and device settings.");
  ui.status("ERROR","error"); updateControls();
}
$("enableMic").addEventListener("click",async()=>{
  if($("enableMic").disabled)return;
  $("enableMic").disabled=true;
  ui.permissionError("");
  ui.mic("REQUESTING...");
  try{
    // getUserMedia is called directly from the first user gesture.
    // AudioContext is created/resumed only after microphone permission succeeds.
    state.micSettings=await recorder.confirmAccess();
    await audio.ensureContext();
    state.mic="READY";
    ui.mic("MICROPHONE ● READY");
    ui.status("READY","ready");
    hidePermissionPanel();
    updateControls();
    // Refresh the browser permission state after explicit approval.
    syncMicrophonePermission();
  }catch(e){
    micError(e);
  }finally{
    if(state.mic!=="READY") $("enableMic").disabled=false;
  }
});

async function syncMicrophonePermission(){
  // Permission query is UI synchronization only. It never starts the microphone.
  if(!navigator.permissions?.query){
    state.mic="REQUIRED";
    showPermissionPanel();
    ui.mic("PERMISSION REQUIRED");
    updateControls();
    return;
  }
  try{
    const ps=await navigator.permissions.query({name:"microphone"});
    state.permissionStatus=ps;
    const applyPermissionState=()=>{
      if(ps.state==="granted"){
        // "READY" here means browser permission is granted. Actual device usability
        // is verified again by getUserMedia() when RECORD is pressed.
        state.mic="READY";
        hidePermissionPanel();
        ui.permissionError("");
        ui.mic("MICROPHONE ● READY");
        ui.status("READY","ready");
      }else if(ps.state==="denied"){
        state.mic="DENIED";
        showPermissionPanel();
        ui.mic("ACCESS DENIED");
        $("enableMic").textContent="TRY AGAIN";
        ui.permissionError("MICROPHONE ACCESS DENIED\\nマイクの使用を許可してから、もう一度お試しください。\\nAllow microphone access and try again.");
      }else{
        state.mic="REQUIRED";
        showPermissionPanel();
        ui.mic("PERMISSION REQUIRED");
        $("enableMic").textContent="ENABLE MICROPHONE";
        ui.permissionError("");
      }
      updateControls();
    };
    applyPermissionState();
    ps.addEventListener?.("change",applyPermissionState);
  }catch(e){
    // Some browsers do not expose microphone permission through Permissions API.
    // Fall back to explicit user action without treating it as an error.
    state.permissionStatus=null;
    state.mic="REQUIRED";
    showPermissionPanel();
    ui.mic("PERMISSION REQUIRED");
    $("enableMic").textContent="ENABLE MICROPHONE";
    ui.permissionError("");
    updateControls();
  }
}

$("recordBtn").addEventListener("click",()=>{
  if(state.session){$("replaceDialog").hidden=false;return}
  beginRecording();
});
$("cancelReplace").addEventListener("click",()=>{$("replaceDialog").hidden=true});
$("confirmReplace").addEventListener("click",()=>{$("replaceDialog").hidden=true;beginRecording()});
$("stopBtn").addEventListener("click",()=>stopRecording("manual"));

recorder.onTrackEnded=()=>{if(state.app==="RECORDING")stopRecording("track-ended")};

async function beginRecording(){
  if(!(state.mic==="READY"&&(state.app==="READY"||state.app==="RECORDED"||state.app==="PROCESSED")))return;
  try{
    await audio.ensureContext();
    const result=await recorder.start(()=>stopRecording("auto"));
    state.pendingStop=result.stopped; state.lastMime=result.mimeType||"UNKNOWN";
    analyzer.connect(audio.context,result.stream);
    state.app="RECORDING";state.mic="ACTIVE";state.recordStarted=performance.now();
    ui.status("RECORDING","recording");ui.mic("MICROPHONE ● ACTIVE");ui.message("");
    $("analyzerState").textContent="LIVE INPUT"; updateControls();
    const tick=()=>{if(state.app!=="RECORDING")return;ui.recording(performance.now()-state.recordStarted);state.tick=requestAnimationFrame(tick)};tick();
  }catch(e){recorder.finish();analyzer.stop();state.recordingReturnState=null;micError(e)}
}
async function stopRecording(reason){
  if(state.app!=="RECORDING")return;
  recorder.requestStop();cancelAnimationFrame(state.tick);analyzer.stop();
  const elapsed=performance.now()-state.recordStarted;ui.recording(Math.min(elapsed,30000));
  ui.status("ANALYZING","ready");$("analyzerState").textContent="ANALYSIS READY";
  try{
    const blob=await state.pendingStop;
    recorder.finish();state.mic="READY";ui.mic("MICROPHONE ● READY");
    if(!blob||!blob.size)throw new Error("REC_EMPTY_DATA");
    const decoded=await audio.decode(blob);const mono=audio.toMono(decoded);
    if(!Number.isFinite(mono.duration)||mono.duration<.5){
      state.app=state.session?"RECORDED":"READY";
      ui.message("RECORDING TOO SHORT / 録音時間が短すぎます。0.5秒以上録音してください。",true);
      ui.status("READY","ready");updateControls();return;
    }
    for(const s of mono.samples){if(!Number.isFinite(s))throw new Error("DEC_INVALID_AUDIO")}
    // Transaction commit only after successful decode/validation.
    // Commit the validated ORIGINAL first. Whole analysis is a separate transaction.
    const sid=++state.sessionId;
    state.session={id:sid,original:{...mono,analysis:null},recordingInfo:{createdAt:new Date(),mimeType:blob.type}};
    state.processed=null;state.selectedPreset=null;state.playbackSource=null;state.playbackReturnState=null;state.processorPlaybackActualSource=null;state.appliedMode=null;state.appliedParameters=null;state.parametersDirty=false;presetButtons.forEach(b=>b.classList.remove("selected"));$("processorState").textContent="READY TO PROCESS";resetComparison();updateProcessorControls();
    state.app="RECORDED";ui.recorded(mono);ui.playbackProgress(0,mono.duration);ui.status("ANALYZING","ready");
    ui.analysisStatus("ANALYZING...");
    ui.message(reason==="auto"?"✓ RECORDING COMPLETE / 30 SEC AUTO STOP":"✓ RECORDING COMPLETE");
    ui.resetAnalyzer(); updateControls();

    try{
      const whole=await analysisEngine.analyze(mono.samples,mono.sampleRate,m=>{
        if(state.session?.id===sid)ui.analysisStatus(`${m.stage} ${m.progress}%`);
      });
      if(state.session?.id===sid){
        state.session.original.analysis=whole;
        ui.wholeAnalysis(whole);
        if(state.processed)renderComparison();
        ui.status("READY","ready");
      }
    }catch(analysisError){
      if(state.session?.id===sid){
        ui.analysisStatus("ANALYSIS FAILED");
        // Basic metrics are calculated locally as a safe display fallback.
        let sum=0,peak=0;
        for(const x of mono.samples){sum+=x*x;peak=Math.max(peak,Math.abs(x));}
        const rms=Math.sqrt(sum/mono.samples.length);
        const basic={duration:mono.duration,rmsAvgDb:rms>0?20*Math.log10(rms):-Infinity,peakDb:peak>0?20*Math.log10(peak):-Infinity,
          pitchAvg:null,pitchMin:null,pitchMax:null,voicedFrames:0,note:null};
        ui.wholeAnalysis(basic);ui.analysisStatus("BASIC ANALYSIS READY / PITCH FAILED");
        ui.status("READY","ready");
      }
    }
    updateControls();
  }catch(e){
    recorder.finish();state.mic="READY";
    state.app=state.recordingReturnState||(state.session?(state.processed?"PROCESSED":"RECORDED"):"READY");
    state.recordingReturnState=null;
    ui.status("ERROR","error");ui.message("RECORDING FAILED / 録音を完了できませんでした。現在の録音と処理済み音声は保持されています。",true);
    updateControls();updateProcessorControls();renderSaveControls();
  }
}

$("playBtn").addEventListener("click",async()=>{
  if(!state.session||!(state.app==="RECORDED"||state.app==="PROCESSED"))return;
  const o=state.session.original;
  try{
    state.playbackSource="ORIGINAL";
    state.playbackReturnState=state.processed?"PROCESSED":"RECORDED";
    state.app="PLAYING";
    ui.status("PLAYING","ready");
    $("analyzerState").textContent="A : ORIGINAL";
    updateControls();updateProcessorControls();
    await player.play(o.samples,o.sampleRate,()=>{
      if(state.app!=="PLAYING"||state.playbackSource!=="ORIGINAL")return;
      finishPlayback();
    });
  }catch(e){
    state.playbackSource=null;
    const rs=state.playbackReturnState||(state.processed?"PROCESSED":"RECORDED");
    state.playbackReturnState=null;state.app=rs;
    ui.status("ERROR","error");$("analyzerState").textContent="ANALYSIS READY";
    $("playMessage").textContent="PLAYBACK FAILED / 音声を再生できませんでした。";
    ui.resetAnalyzer();updateControls();updateProcessorControls();
  }
});
$("playStopBtn").addEventListener("click",()=>{
  if(state.app!=="PLAYING"||state.playbackSource!=="ORIGINAL")return;
  finishPlayback({stopPlayer:true});
});

document.addEventListener("visibilitychange",()=>{
  if(!document.hidden)return;
  if(state.app==="RECORDING")stopRecording("interrupted");
  else if(state.app==="PLAYING"){
    player.stop(false);state.app="RECORDED";ui.status("READY","ready");$("analyzerState").textContent="ANALYSIS READY";
    ui.playbackProgress(0,state.session.original.duration);ui.resetAnalyzer();updateControls();
  }
});
addEventListener("pagehide",()=>{cancelAnimationFrame(state.tick);analyzer.stop();player.cleanup();analysisEngine.cleanup();dspEngine.cleanup();recorder.finish()});
updateControls();
syncMicrophonePermission();

updateProcessorControls();

resetComparison();

setManualUI(effectiveManual());

renderSaveControls();
