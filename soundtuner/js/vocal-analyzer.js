export class VocalAnalyzer {
  constructor(){this.reset();}
  reset(){this.state="MEASUREMENT_WAITING";this.frames=[];this.sessionStart=null;this.lastValidAt=null;this.candidateStart=null;this.lastResult=null;this.lastFrames=[];this.completed=false;this.completedReason=null;this.awaitingRelease=false;}
  update(pitch,nowMs,hold=false){
    if(hold)return this.snapshot(nowMs);
    const valid=!!(pitch?.voiced&&pitch?.pitchState==="VALID"&&Number.isFinite(pitch.frequency));
    if(valid){
      if(this.awaitingRelease){this.state="MEASUREMENT_COMPLETE";return this.snapshot(nowMs);}
      if(this.completed){this.completed=false;this.completedReason=null;this.state="MEASUREMENT_WAITING";}
      if(this.candidateStart===null)this.candidateStart=nowMs;
      if(this.sessionStart===null && nowMs-this.candidateStart>=200){this.sessionStart=this.candidateStart;this.frames=[];this.lastFrames=[];this.completed=false;}
      if(this.sessionStart!==null){
        this.lastValidAt=nowMs;this.state="MEASURING";
        const elapsed=Math.min(30000,nowMs-this.sessionStart);
        this.frames.push({t:elapsed,f:pitch.frequency});
        if(this.frames.length>900)this.frames.shift();
        if(elapsed>=30000){this.complete("MAX_30S");return this.snapshot(nowMs);}
      }else this.state="VOICE_DETECTED";
    }else{
      this.candidateStart=null;
      if(this.sessionStart!==null&&this.lastValidAt!==null&&nowMs-this.lastValidAt>=1000)this.complete("SILENCE_1S");
      else if(this.awaitingRelease){this.awaitingRelease=false;this.state="MEASUREMENT_COMPLETE";}
      else if(this.completed)this.state=this.completedReason==="MAX_30S"?"MEASUREMENT_COMPLETE":"MEASUREMENT_STOPPED";
      else if(this.sessionStart===null)this.state=this.lastResult?"MEASUREMENT_STOPPED":"MEASUREMENT_WAITING";
    }
    return this.snapshot(nowMs);
  }
  complete(reason="SILENCE_1S"){
    if(this.frames.length){
      this.lastFrames=this.frames.slice();
      const fs=this.frames.map(x=>x.f),avg=fs.reduce((a,b)=>a+b,0)/fs.length;
      const low=Math.min(...fs),high=Math.max(...fs);
      const cents=fs.map(f=>1200*Math.log2(f/avg));
      const variation=Math.max(...cents.map(Math.abs));
      this.lastResult={avgHz:avg,lowHz:low,highHz:high,variationCent:variation,vibrato:this._vibrato(cents)};
    }
    this.completedReason=reason;this.state=reason==="MAX_30S"?"MEASUREMENT_COMPLETE":"MEASUREMENT_STOPPED";
    this.awaitingRelease=reason==="MAX_30S";
    this.sessionStart=null;this.lastValidAt=null;this.candidateStart=null;this.frames=[];this.completed=true;
  }
  _vibrato(cents){
    if(cents.length<20)return {state:"INSUFFICIENT DATA",rateHz:null,depthCent:null};
    const centered=cents.map(v=>v-(cents.reduce((a,b)=>a+b,0)/cents.length));
    let crossings=0;for(let i=1;i<centered.length;i++)if((centered[i-1]<0&&centered[i]>=0)||(centered[i-1]>0&&centered[i]<=0))crossings++;
    const duration=(cents.length-1)*0.05,rate=duration>0?crossings/(2*duration):0;
    const depth=(Math.max(...centered)-Math.min(...centered))/2;
    if(rate>=3&&rate<=9&&depth>=5)return {state:"DETECTED",rateHz:rate,depthCent:depth};
    return {state:"NOT DETECTED",rateHz:rate,depthCent:depth};
  }
  snapshot(nowMs){
    const elapsed=this.sessionStart===null?0:Math.min(30000,nowMs-this.sessionStart);
    return {state:this.state,elapsedMs:this.completedReason==="MAX_30S"&&this.completed?30000:elapsed,frames:(this.frames.length?this.frames:this.lastFrames).slice(),lastResult:this.lastResult,completedReason:this.completedReason};
  }
}
