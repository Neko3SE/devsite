import {AudioEngine} from "./audio-engine.js";
import {Recorder} from "./recorder.js";
import {RealtimeAnalyzer} from "./analyzer.js";
import {UI} from "./ui.js";

const $=id=>document.getElementById(id);
const ui=new UI(), audio=new AudioEngine(), recorder=new Recorder(), analyzer=new RealtimeAnalyzer(ui);
const state={app:"READY",mic:"REQUIRED",session:null,sessionId:0,recordStarted:0,tick:0,pendingStop:null,micSettings:{}};

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

function updateControls(){
  $("recordBtn").disabled=!(state.mic==="READY"&&(state.app==="READY"||state.app==="RECORDED"));
  $("stopBtn").disabled=state.app!=="RECORDING";
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
  }catch(e){
    micError(e);
  }finally{
    if(state.mic!=="READY") $("enableMic").disabled=false;
  }
});

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
    state.session={id:++state.sessionId,original:mono,recordingInfo:{createdAt:new Date(),mimeType:blob.type}};
    state.app="RECORDED";ui.recorded(mono);ui.status("READY","ready");
    ui.message(reason==="auto"?"✓ RECORDING COMPLETE / 30 SEC AUTO STOP":"✓ RECORDING COMPLETE");
    ui.resetAnalyzer(); updateControls();
  }catch(e){
    recorder.finish();state.mic="READY";
    state.app=state.session?"RECORDED":"READY";
    ui.status("ERROR","error");ui.message("RECORDING FAILED / 録音を完了できませんでした。",true);updateControls();
  }
}

document.addEventListener("visibilitychange",()=>{if(document.hidden&&state.app==="RECORDING")stopRecording("interrupted")});
addEventListener("pagehide",()=>{cancelAnimationFrame(state.tick);analyzer.stop();recorder.finish()});
updateControls();
