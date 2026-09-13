export class RealtimeAnalyzer {
  constructor(ui){
    this.ui=ui; this.ctx=null; this.source=null; this.analyser=null; this.raf=0; this.lastNumeric=0;
    this.timeData=null; this.freqData=null;
  }
  connect(ctx, stream){
    this.stop();
    this.ctx=ctx;
    this.source=ctx.createMediaStreamSource(stream);
    this.analyser=ctx.createAnalyser();
    this.analyser.fftSize=4096;
    this.analyser.smoothingTimeConstant=.75;
    this.source.connect(this.analyser);
    this.timeData=new Float32Array(this.analyser.fftSize);
    this.freqData=new Float32Array(this.analyser.frequencyBinCount);
    this.loop();
  }
  loop=(ts=0)=>{
    if(!this.analyser) return;
    this.analyser.getFloatTimeDomainData(this.timeData);
    this.analyser.getFloatFrequencyData(this.freqData);
    this.ui.drawWaveform(this.timeData);
    this.ui.drawSpectrum(this.freqData,this.ctx.sampleRate);
    if(ts-this.lastNumeric>=100){
      this.lastNumeric=ts;
      let sum=0, peak=0;
      for(const x of this.timeData){sum+=x*x; const a=Math.abs(x); if(a>peak) peak=a;}
      const rms=Math.sqrt(sum/this.timeData.length);
      const db=v=>v>0?20*Math.log10(v):-Infinity;
      this.ui.updateLevel(db(rms),db(peak));
    }
    this.raf=requestAnimationFrame(this.loop);
  }
  stop(){
    if(this.raf) cancelAnimationFrame(this.raf);
    this.raf=0;
    try{this.source?.disconnect();}catch{}
    try{this.analyser?.disconnect();}catch{}
    this.source=this.analyser=null;
  }
}