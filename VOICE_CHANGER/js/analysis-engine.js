export class AnalysisEngine{
  constructor(){this.worker=null;this.seq=0;this.pending=new Map();}
  ensure(){
    if(this.worker)return;
    if(!window.Worker)throw new Error("CAP_WORKER_UNAVAILABLE");
    this.worker=new Worker("worker/analysis-worker.js");
    this.worker.onmessage=e=>{
      const m=e.data||{},p=this.pending.get(m.requestId);if(!p)return;
      if(m.type==="PROGRESS"){p.onProgress?.(m);return;}
      this.pending.delete(m.requestId);
      if(m.type==="COMPLETE")p.resolve(m.result);else p.reject(new Error(m.message||"ANALYSIS_FAILED"));
    };
    this.worker.onerror=e=>{for(const [,p] of this.pending)p.reject(new Error(e.message||"ANALYSIS_WORKER_FAILED"));this.pending.clear();};
  }
  analyze(samples,sampleRate,onProgress){
    this.ensure();const requestId=++this.seq;
    // Copy before transfer: ORIGINAL remains immutable and owned by AudioSession.
    const copy=samples.slice();
    return new Promise((resolve,reject)=>{
      this.pending.set(requestId,{resolve,reject,onProgress});
      this.worker.postMessage({type:"ANALYZE",requestId,samples:copy.buffer,sampleRate},[copy.buffer]);
    });
  }
  cleanup(){if(this.worker)this.worker.terminate();this.worker=null;for(const[,p]of this.pending)p.reject(new Error("ANALYSIS_CANCELLED"));this.pending.clear();}
}