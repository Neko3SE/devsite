export class DSPEngine{
constructor(){this.worker=null;this.seq=0;this.pending=new Map()}
ensure(){if(this.worker)return;if(!window.Worker)throw Error("CAP_WORKER_UNAVAILABLE");this.worker=new Worker("worker/dsp-worker.js");this.worker.onmessage=e=>{const m=e.data||{},p=this.pending.get(m.requestId);if(!p)return;if(m.type==="PROGRESS"){p.onProgress?.(m);return}this.pending.delete(m.requestId);m.type==="COMPLETE"?p.resolve({...m,samples:new Float32Array(m.samples)}):p.reject(Error(m.message||"DSP_PROCESS_FAILED"))}}
process(samples,sampleRate,params,onProgress){this.ensure();const id=++this.seq,copy=samples.slice();return new Promise((resolve,reject)=>{this.pending.set(id,{resolve,reject,onProgress});this.worker.postMessage({type:"PROCESS",requestId:id,samples:copy.buffer,sampleRate,params},[copy.buffer])})}
cleanup(){this.worker?.terminate();this.worker=null;for(const[,p]of this.pending)p.reject(Error("DSP_CANCELLED"));this.pending.clear()}
}