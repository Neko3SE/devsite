const LOW_INPUT_DBFS = -50;       // Phase 1 calibration value; not final.
const CLIP_LINEAR = 0.985;         // Near digital full scale.
const CLIP_HOLD_MS = 700;          // Phase 1 calibration value; not final.
const FFT_SIZE = 2048;

export class AudioEngine {
  constructor() {
    this.stream = null; this.context = null; this.source = null; this.analyser = null;
    this.buffer = null; this.clipUntil = 0; this.last = null;
  }
  async start() {
    if (!window.isSecureContext) throw this._error("SECURE_CONTEXT_REQUIRED");
    if (!navigator.mediaDevices?.getUserMedia) throw this._error("MICROPHONE_UNAVAILABLE");
    await this.stop();
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false},video:false});
    } catch (e) { throw this._mapMediaError(e); }
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) throw this._error("AUDIO_INITIALIZATION_FAILED");
      const context = new AudioContextClass();
      if (context.state === "suspended") await context.resume();
      const source = context.createMediaStreamSource(stream);
      const analyser = context.createAnalyser();
      analyser.fftSize = FFT_SIZE; analyser.smoothingTimeConstant = 0;
      source.connect(analyser);
      this.stream=stream; this.context=context; this.source=source; this.analyser=analyser;
      this.buffer=new Float32Array(analyser.fftSize);
      return this.getDiagnostics();
    } catch(e) {
      stream.getTracks().forEach(t=>t.stop());
      if (e?.code) throw e;
      throw this._error("AUDIO_INITIALIZATION_FAILED", e);
    }
  }
  measure() {
    if (!this.analyser) return null;
    this.analyser.getFloatTimeDomainData(this.buffer);
    let sum=0, peak=0;
    for (let i=0;i<this.buffer.length;i++){const v=this.buffer[i];sum+=v*v;const a=Math.abs(v);if(a>peak)peak=a;}
    const rms=Math.sqrt(sum/this.buffer.length);
    const rmsDb=rms>0?20*Math.log10(rms):-Infinity;
    const peakDb=peak>0?20*Math.log10(peak):-Infinity;
    const now=performance.now();
    if (peak>=CLIP_LINEAR) this.clipUntil=now+CLIP_HOLD_MS;
    let inputState;
    if (now<this.clipUntil) inputState="CLIP";
    else if (rmsDb<LOW_INPUT_DBFS) inputState="LOW";
    else inputState="GOOD";
    return this.last={rms,rmsDb,peak,peakDb,inputState};
  }
  getDiagnostics() {
    const track=this.stream?.getAudioTracks?.()[0];
    const settings=track?.getSettings?.()||{};
    return {
      sampleRate:this.context?.sampleRate??null,
      audioState:this.context?.state??"closed",
      echoCancellation:settings.echoCancellation,
      noiseSuppression:settings.noiseSuppression,
      autoGainControl:settings.autoGainControl
    };
  }
  async stop() {
    if(this.stream){this.stream.getTracks().forEach(t=>t.stop());this.stream=null;}
    if(this.context && this.context.state!=="closed"){try{await this.context.close();}catch{}}
    this.context=null;this.source=null;this.analyser=null;this.buffer=null;this.last=null;this.clipUntil=0;
  }
  _error(code,cause){const e=new Error(code);e.code=code;e.cause=cause;return e;}
  _mapMediaError(e){
    const n=e?.name||"";
    if(n==="NotAllowedError"||n==="SecurityError")return this._error("MICROPHONE_BLOCKED",e);
    if(n==="NotFoundError"||n==="DevicesNotFoundError")return this._error("MICROPHONE_NOT_FOUND",e);
    if(n==="NotReadableError"||n==="TrackStartError"||n==="AbortError")return this._error("MICROPHONE_UNAVAILABLE",e);
    return this._error("MICROPHONE_UNAVAILABLE",e);
  }
}
export const phase1Calibration={LOW_INPUT_DBFS,CLIP_LINEAR,CLIP_HOLD_MS};
