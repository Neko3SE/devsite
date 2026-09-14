import {analyzeRealtimeFrame} from "./analyzer.js";
export class Player {
  constructor(ui,audioEngine){
    this.ui=ui;this.audioEngine=audioEngine;this.source=null;this.analyser=null;this.gain=null;
    this.raf=0;this.startedAt=0;this.duration=0;this.sessionId=0;this.onEnded=null;this.lastNumeric=0;
    this.timeData=null;this.freqData=null;
  }
  async play(samples,sampleRate,onEnded){
    this.stop(false);
    const ctx=await this.audioEngine.ensureContext();
    const buffer=ctx.createBuffer(1,samples.length,sampleRate);
    buffer.copyToChannel(samples,0);
    this.source=ctx.createBufferSource();this.source.buffer=buffer;
    this.analyser=ctx.createAnalyser();this.analyser.fftSize=4096;this.analyser.smoothingTimeConstant=.75;
    this.gain=ctx.createGain();this.gain.gain.value=1;
    this.source.connect(this.analyser);this.analyser.connect(this.gain);this.gain.connect(ctx.destination);
    this.timeData=new Float32Array(this.analyser.fftSize);this.freqData=new Float32Array(this.analyser.frequencyBinCount);
    this.duration=buffer.duration;this.startedAt=ctx.currentTime;this.onEnded=onEnded;const id=++this.sessionId;
    this.source.onended=()=>{if(id!==this.sessionId)return;this.cleanupNodes();onEnded?.("ended");};
    this.source.start(0);this.loop(ctx,id);
  }
  loop(ctx,id){
    if(id!==this.sessionId||!this.analyser)return;
    this.analyser.getFloatTimeDomainData(this.timeData);this.analyser.getFloatFrequencyData(this.freqData);
    this.ui.drawWaveform(this.timeData);this.ui.drawSpectrum(this.freqData,ctx.sampleRate);
    const now=performance.now();
    if(now-this.lastNumeric>=100){
      this.lastNumeric=now;
      this.ui.updateRealtime(analyzeRealtimeFrame(this.timeData,this.freqData,ctx.sampleRate));
    }
    const elapsed=Math.min(this.duration,ctx.currentTime-this.startedAt);
    this.ui.playbackProgress(elapsed,this.duration);
    this.raf=requestAnimationFrame(()=>this.loop(ctx,id));
  }
  stop(notify=true){
    ++this.sessionId;
    if(this.raf)cancelAnimationFrame(this.raf);this.raf=0;
    if(this.source){try{this.source.onended=null;this.source.stop();}catch{}}
    this.cleanupNodes();if(notify)this.onEnded?.("stopped");
  }
  cleanupNodes(){
    try{this.source?.disconnect();}catch{}try{this.analyser?.disconnect();}catch{}try{this.gain?.disconnect();}catch{}
    this.source=this.analyser=this.gain=null;
  }
  cleanup(){this.stop(false)}
}