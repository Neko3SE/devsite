import {AudioEngine} from "./audio-engine.js";
import {Recorder} from "./recorder.js";
import {RealtimeAnalyzer} from "./analyzer.js";
import {AnalysisEngine} from "./analysis-engine.js";
import {DSPEngine} from "./dsp-engine.js";
import {PRESETS} from "./presets.js";
import {Player} from "./player.js";
import {UI} from "./ui.js";

const $=id=>document.getElementById(id);
const ui=new UI(), audio=new AudioEngine(), recorder=new Recorder(), analyzer=new RealtimeAnalyzer(ui),
      player=new Player(ui,audio), analysisEngine=new AnalysisEngine(), dspEngine=new DSPEngine();
const state={app:"READY",mic:"REQUIRED",session:null,sessionId:0,recordStarted:0,tick:0,pendingStop:null,micSettings:{},permissionStatus:null,selectedPreset:null,processed:null,processing:false};

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
ui.setTechnical({"Phase":"1","App State":state.app,"Microphone":state.mic,"Secure Context":String(window.isSecureContext),"MediaRecorder MIME":"UNKNOWN","Actual Sample Rate":"UNKNOWN"});
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
 $("applyPreset").disabled=!original||!state.selectedPreset||busy;
 $("playProcessed").disabled=!state.processed||busy;
 $("stopProcessed").disabled=state.app!=="PLAYING";
}
presetButtons.forEach(b=>b.addEventListener("click",()=>{
 if(b.disabled)return;state.selectedPreset=b.dataset.preset;presetButtons.forEach(x=>x.classList.toggle("selected",x===b));
 $("processorState").textContent=state.processed?"PRESET CHANGED":"READY TO PROCESS";updateProcessorControls();
}));
$("applyPreset").addEventListener("click",async()=>{
 if(!state.session?.original||!state.selectedPreset||state.processing)return;
 if(state.selectedPreset==="ORIGINAL"){state.processed=null;$("processorState").textContent="ORIGINAL / NO DSP";$("processingProgress").textContent="ORIGINAL is the unprocessed recording.";updateProcessorControls();return}
 const original=state.session.original,old=state.processed,preset=state.selectedPreset,sid=state.session.id,t0=performance.now();
 state.processing=true;state.app="PROCESSING";$("processorState").textContent="PROCESSING";updateProcessorControls();
 try{
  const out=await dspEngine.process(original.samples,original.sampleRate,PRESETS[preset],m=>{if(state.session?.id===sid)$("processingProgress").textContent=`${m.stage} ${m.progress}%`});
  if(state.session?.id!==sid)return;
  if(Math.abs(out.duration-original.duration)>1/original.sampleRate)throw Error("DSP_DURATION_MISMATCH");
  const analysis=await analysisEngine.analyze(out.samples,out.sampleRate);
  if(state.session?.id!==sid)return;
  state.processed={samples:out.samples,sampleRate:out.sampleRate,duration:out.duration,analysis,preset,processingInfo:{elapsedMs:performance.now()-t0}};
  $("processorState").textContent="✓ PROCESSING COMPLETE";$("processingProgress").textContent=`${preset} / ${(state.processed.processingInfo.elapsedMs/1000).toFixed(2)} sec`;
 }catch(e){state.processed=old;$("processorState").textContent="PROCESSING FAILED";$("processingProgress").textContent="Original and last valid processed audio are preserved."}
 finally{if(state.session?.id===sid){state.processing=false;state.app=state.processed?"PROCESSED":"RECORDED";updateControls();updateProcessorControls()}}
});
$("playProcessed").addEventListener("click",async()=>{
  if(!state.processed||state.processing||state.app==="PLAYING")return;
  const p=state.processed;
  try{
    state.app="PLAYING";
    ui.status("PLAYING","ready");
    $("analyzerState").textContent=`B : PROCESSED / ${p.preset}`;
    updateControls();updateProcessorControls();
    // Player API is play(samples, sampleRate, onEnded), identical to ORIGINAL playback.
    await player.play(p.samples,p.sampleRate,()=>{
      if(state.app!=="PLAYING")return;
      state.app="PROCESSED";
      ui.status("READY","ready");
      $("analyzerState").textContent="ANALYSIS READY";
      ui.playbackProgress(0,p.duration);
      ui.resetAnalyzer();
      updateControls();updateProcessorControls();
    });
  }catch(e){
    state.app="PROCESSED";
    ui.status("ERROR","error");
    $("analyzerState").textContent="ANALYSIS READY";
    $("processingProgress").textContent="PLAYBACK FAILED / 処理済み音声を再生できませんでした。";
    ui.resetAnalyzer();updateControls();updateProcessorControls();
  }
});
$("stopProcessed").addEventListener("click",()=>{
  if(state.app!=="PLAYING"||!state.processed)return;
  const p=state.processed;
  player.stop(false);
  state.app="PROCESSED";
  ui.status("READY","ready");
  $("analyzerState").textContent="ANALYSIS READY";
  ui.playbackProgress(0,p.duration);
  ui.resetAnalyzer();
  updateControls();updateProcessorControls();
});

function updateControls(){
  $("recordBtn").disabled=!(state.mic==="READY"&&(state.app==="READY"||state.app==="RECORDED"));
  $("stopBtn").disabled=state.app!=="RECORDING";
  const canPlay=!!state.session && (state.app==="RECORDED"||state.app==="PROCESSED");
  $("playBtn").disabled=!canPlay;
  $("playStopBtn").disabled=state.app!=="PLAYING";
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
  if(!(state.mic==="READY"&&(state.app==="READY"||state.app==="RECORDED")))return;
  try{
    await audio.ensureContext();
    const result=await recorder.start(()=>stopRecording("auto"));
    state.pendingStop=result.stopped; state.lastMime=result.mimeType||"UNKNOWN";
    analyzer.connect(audio.context,result.stream);
    state.app="RECORDING";state.mic="ACTIVE";state.recordStarted=performance.now();
    ui.status("RECORDING","recording");ui.mic("MICROPHONE ● ACTIVE");ui.message("");
    $("analyzerState").textContent="LIVE INPUT"; updateControls();
    const tick=()=>{if(state.app!=="RECORDING")return;ui.recording(performance.now()-state.recordStarted);state.tick=requestAnimationFrame(tick)};tick();
  }catch(e){recorder.finish();analyzer.stop();micError(e)}
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
    state.processed=null;state.selectedPreset=null;presetButtons.forEach(b=>b.classList.remove("selected"));$("processorState").textContent="READY TO PROCESS";updateProcessorControls();
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
    state.app=state.session?"RECORDED":"READY";
    ui.status("ERROR","error");ui.message("RECORDING FAILED / 録音を完了できませんでした。",true);updateControls();
  }
}

$("playBtn").addEventListener("click",async()=>{
  if(!state.session||!(state.app==="RECORDED"||state.app==="PROCESSED"))return;
  try{
    const returnState=state.processed?"PROCESSED":"RECORDED";
    state.app="PLAYING";ui.status("PLAYING","ready");$("analyzerState").textContent="A : ORIGINAL";updateControls();updateProcessorControls();
    const o=state.session.original;
    await player.play(o.samples,o.sampleRate,()=>{
      if(state.app!=="PLAYING")return;
      state.app=returnState;ui.status("READY","ready");$("analyzerState").textContent="ANALYSIS READY";
      ui.playbackProgress(0,o.duration);ui.resetAnalyzer();updateControls();updateProcessorControls();
    });
  }catch(e){
    state.app="RECORDED";ui.status("ERROR","error");$("playMessage").textContent="PLAYBACK FAILED / 音声を再生できませんでした。";updateControls();
  }
});
$("playStopBtn").addEventListener("click",()=>{
  if(state.app!=="PLAYING")return;
  player.stop(false);state.app="RECORDED";ui.status("READY","ready");$("analyzerState").textContent="ANALYSIS READY";
  ui.playbackProgress(0,state.session.original.duration);ui.resetAnalyzer();updateControls();
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
