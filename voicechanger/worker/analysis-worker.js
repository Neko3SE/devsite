const NOTE_NAMES=["C","C♯","D","D♯","E","F","F♯","G","G♯","A","A♯","B"];
const dbfs=v=>v>0?20*Math.log10(v):-Infinity;
function noteFromHz(hz){
  if(!Number.isFinite(hz)||hz<=0)return null;
  const mf=69+12*Math.log2(hz/440),m=Math.round(mf);
  return {name:NOTE_NAMES[(m%12+12)%12]+(Math.floor(m/12)-1),cents:Math.round((mf-m)*100)};
}
function f0(frame,sr){
  let mean=0,energy=0;
  for(const x of frame)mean+=x; mean/=frame.length;
  for(const x of frame){const y=x-mean;energy+=y*y;}
  const rms=Math.sqrt(energy/frame.length);
  if(rms<0.0018)return null;
  const minLag=Math.max(2,Math.floor(sr/500)),maxLag=Math.min(frame.length-2,Math.ceil(sr/60));
  let best=-1,bestLag=0;
  for(let lag=minLag;lag<=maxLag;lag++){
    let xy=0,xx=0,yy=0,n=frame.length-lag;
    for(let i=0;i<n;i++){const a=frame[i]-mean,b=frame[i+lag]-mean;xy+=a*b;xx+=a*a;yy+=b*b;}
    const c=(xx&&yy)?xy/Math.sqrt(xx*yy):0;
    if(c>best){best=c;bestLag=lag;}
  }
  if(best<.70||!bestLag)return null;
  const hz=sr/bestLag;
  return hz>=60&&hz<=500?hz:null;
}

function spectralCentroid(frame,sr){
  const N=frame.length, bins=Math.min(512,Math.floor(N/2));
  let weighted=0,total=0;
  // Sparse direct DFT for whole-recording summary; intentionally bounded for Worker cost.
  for(let k=1;k<bins;k+=4){
    let re=0,im=0,ang=-2*Math.PI*k/N;
    for(let n=0;n<N;n+=4){const x=frame[n],a=ang*n;re+=x*Math.cos(a);im+=x*Math.sin(a);}
    const mag=Math.hypot(re,im),hz=k*sr/N;weighted+=hz*mag;total+=mag;
  }
  return total>1e-12?weighted/total:null;
}

self.onmessage=e=>{
  const {type,requestId,samples,sampleRate}=e.data||{};
  if(type!=="ANALYZE")return;
  try{
    const a=new Float32Array(samples);
    if(!a.length||!Number.isFinite(sampleRate)||sampleRate<=0)throw new Error("INVALID_AUDIO");
    let sum=0,peak=0;
    for(let i=0;i<a.length;i++){const x=a[i];if(!Number.isFinite(x))throw new Error("NON_FINITE_SAMPLE");sum+=x*x;peak=Math.max(peak,Math.abs(x));}
    const duration=a.length/sampleRate,rms=Math.sqrt(sum/a.length);
    self.postMessage({type:"PROGRESS",requestId,progress:20,stage:"LEVEL ANALYSIS"});
    const frameSize=Math.max(1024,Math.round(sampleRate*.04)),hop=Math.max(256,Math.round(sampleRate*.02));
    const pitches=[];const centroids=[];let frames=0;
    const total=Math.max(1,Math.floor((a.length-frameSize)/hop)+1);
    for(let start=0;start+frameSize<=a.length;start+=hop){
      const frame=a.subarray(start,start+frameSize);
      const hz=f0(frame,sampleRate);
      if(hz)pitches.push(hz);
      if(frames%10===0){const c=spectralCentroid(frame,sampleRate);if(Number.isFinite(c))centroids.push(c);}
      frames++;
      if(frames%25===0)self.postMessage({type:"PROGRESS",requestId,progress:20+Math.round(70*frames/total),stage:"PITCH ANALYSIS"});
    }
    const avg=pitches.length?pitches.reduce((x,y)=>x+y,0)/pitches.length:null;
    let min=null,max=null;
    if(pitches.length){min=pitches[0];max=pitches[0];for(const p of pitches){if(p<min)min=p;if(p>max)max=p;}}
    self.postMessage({type:"COMPLETE",requestId,result:{
      duration,rmsAvgDb:dbfs(rms),peakDb:dbfs(peak),pitchAvg:avg,pitchMin:min,pitchMax:max,
      voicedFrames:pitches.length,note:noteFromHz(avg),
      centroidAvg:centroids.length?centroids.reduce((x,y)=>x+y,0)/centroids.length:null
    }});
  }catch(err){self.postMessage({type:"ERROR",requestId,message:String(err?.message||err)});}
};