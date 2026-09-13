const NOTE_NAMES=["C","C♯","D","D♯","E","F","F♯","G","G♯","A","A♯","B"];

function dbfs(v){ return v>0 ? 20*Math.log10(v) : -Infinity; }
function noteFromHz(hz){
  if(!Number.isFinite(hz)||hz<=0)return null;
  const midiFloat=69+12*Math.log2(hz/440);
  const midi=Math.round(midiFloat);
  const cents=Math.round((midiFloat-midi)*100);
  return {name:NOTE_NAMES[(midi%12+12)%12]+(Math.floor(midi/12)-1), cents};
}
function estimateF0(frame,sampleRate){
  let sum=0;
  for(const x of frame) sum+=x*x;
  const rms=Math.sqrt(sum/frame.length);
  if(rms<0.0018) return {hz:null,confidence:0};

  // Remove DC before normalized autocorrelation.
  let mean=0; for(const x of frame) mean+=x; mean/=frame.length;
  const minHz=60,maxHz=500;
  const minLag=Math.max(2,Math.floor(sampleRate/maxHz));
  const maxLag=Math.min(frame.length-2,Math.ceil(sampleRate/minHz));
  let bestLag=0,best=-1;

  for(let lag=minLag;lag<=maxLag;lag++){
    let xy=0,xx=0,yy=0;
    const n=frame.length-lag;
    for(let i=0;i<n;i++){
      const a=frame[i]-mean,b=frame[i+lag]-mean;
      xy+=a*b;xx+=a*a;yy+=b*b;
    }
    const corr=(xx>0&&yy>0)?xy/Math.sqrt(xx*yy):0;
    if(corr>best){best=corr;bestLag=lag;}
  }
  if(best<0.70||!bestLag)return {hz:null,confidence:Math.max(0,best)};
  // Parabolic interpolation around lag for a slightly smoother estimate.
  const corrAt=(lag)=>{
    let xy=0,xx=0,yy=0,n=frame.length-lag;
    for(let i=0;i<n;i++){const a=frame[i]-mean,b=frame[i+lag]-mean;xy+=a*b;xx+=a*a;yy+=b*b;}
    return (xx>0&&yy>0)?xy/Math.sqrt(xx*yy):0;
  };
  let lag=bestLag;
  if(bestLag>minLag&&bestLag<maxLag){
    const a=corrAt(bestLag-1),b=best,c=corrAt(bestLag+1);
    const den=a-2*b+c;
    if(Math.abs(den)>1e-9)lag=bestLag+0.5*(a-c)/den;
  }
  const hz=sampleRate/lag;
  return (hz>=minHz&&hz<=maxHz)?{hz,confidence:best}:{hz:null,confidence:best};
}
function centroidFromSpectrum(freqDb,sampleRate){
  const ny=sampleRate/2;
  let weighted=0,total=0;
  for(let i=1;i<freqDb.length;i++){
    const mag=Math.pow(10,freqDb[i]/20);
    const f=i/freqDb.length*ny;
    weighted+=f*mag;total+=mag;
  }
  return total>1e-8?weighted/total:null;
}

export class RealtimeAnalyzer {
  constructor(ui){
    this.ui=ui;this.ctx=null;this.source=null;this.analyser=null;this.raf=0;this.lastNumeric=0;
    this.timeData=null;this.freqData=null;this.f0Frame=null;
  }
  connect(ctx,stream){
    this.stop();this.ctx=ctx;
    this.source=ctx.createMediaStreamSource(stream);
    this.analyser=ctx.createAnalyser();this.analyser.fftSize=4096;this.analyser.smoothingTimeConstant=.75;
    this.source.connect(this.analyser);
    this.timeData=new Float32Array(this.analyser.fftSize);
    this.freqData=new Float32Array(this.analyser.frequencyBinCount);
    this.loop();
  }
  loop=(ts=0)=>{
    if(!this.analyser)return;
    this.analyser.getFloatTimeDomainData(this.timeData);
    this.analyser.getFloatFrequencyData(this.freqData);
    this.ui.drawWaveform(this.timeData);this.ui.drawSpectrum(this.freqData,this.ctx.sampleRate);
    if(ts-this.lastNumeric>=100){
      this.lastNumeric=ts;
      let sum=0,peak=0;
      for(const x of this.timeData){sum+=x*x;peak=Math.max(peak,Math.abs(x));}
      const rms=Math.sqrt(sum/this.timeData.length);
      const f0=estimateF0(this.timeData,this.ctx.sampleRate);
      const note=noteFromHz(f0.hz);
      const centroid=centroidFromSpectrum(this.freqData,this.ctx.sampleRate);
      this.ui.updateRealtime({rmsDb:dbfs(rms),peakDb:dbfs(peak),f0:f0.hz,note,centroid,confidence:f0.confidence});
    }
    this.raf=requestAnimationFrame(this.loop);
  }
  stop(){
    if(this.raf)cancelAnimationFrame(this.raf);this.raf=0;
    try{this.source?.disconnect();}catch{} try{this.analyser?.disconnect();}catch{}
    this.source=this.analyser=null;
  }
}

export function analyzeWhole(samples,sampleRate){
  const duration=samples.length/sampleRate;
  let sum=0,peak=0;
  for(const x of samples){sum+=x*x;peak=Math.max(peak,Math.abs(x));}
  const rms=Math.sqrt(sum/samples.length);

  const frameSize=Math.max(1024,Math.round(sampleRate*.04));
  const hop=Math.max(256,Math.round(sampleRate*.01));
  const pitches=[];
  // Keep whole analysis bounded on main thread in Phase 2; worker migration remains planned.
  for(let start=0;start+frameSize<=samples.length;start+=hop){
    const frame=samples.subarray(start,start+frameSize);
    const r=estimateF0(frame,sampleRate);
    if(r.hz&&r.confidence>=.70)pitches.push(r.hz);
  }
  const pitchAvg=pitches.length?pitches.reduce((a,b)=>a+b,0)/pitches.length:null;
  const pitchMin=pitches.length?Math.min(...pitches):null;
  const pitchMax=pitches.length?Math.max(...pitches):null;
  return {
    duration,rmsAvgDb:dbfs(rms),peakDb:dbfs(peak),
    pitchAvg,pitchMin,pitchMax,voicedFrames:pitches.length,
    note:noteFromHz(pitchAvg)
  };
}
export {noteFromHz};