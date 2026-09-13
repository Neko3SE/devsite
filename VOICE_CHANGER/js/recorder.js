const MAX_MS=30000;
export class Recorder {
  constructor(){this.stream=null;this.mediaRecorder=null;this.chunks=[];this.stopRequested=false;this.autoTimer=0;this.mimeType="";this.onTrackEnded=null;}
  chooseMime(){
    const list=["audio/webm;codecs=opus","audio/webm","audio/mp4;codecs=mp4a.40.2","audio/mp4","audio/ogg;codecs=opus"];
    if(!window.MediaRecorder) return "";
    for(const m of list) if(MediaRecorder.isTypeSupported?.(m)) return m;
    return "";
  }
  async acquire(){
    const constraints={audio:{channelCount:1,echoCancellation:false,noiseSuppression:false,autoGainControl:false}};
    this.stream=await navigator.mediaDevices.getUserMedia(constraints);
    return this.stream;
  }
  release(){
    clearTimeout(this.autoTimer);
    this.stream?.getTracks().forEach(t=>t.stop());
    this.stream=null;
  }
  async confirmAccess(){const s=await this.acquire(); const settings=s.getAudioTracks()[0]?.getSettings?.()||{}; this.release(); return settings;}
  async start(onAutoStop){
    const stream=await this.acquire();
    this.chunks=[];this.stopRequested=false;this.mimeType=this.chooseMime();
    const opts=this.mimeType?{mimeType:this.mimeType}:undefined;
    this.mediaRecorder=new MediaRecorder(stream,opts);
    this.mediaRecorder.addEventListener("dataavailable",e=>{if(e.data?.size)this.chunks.push(e.data);});
    stream.getAudioTracks().forEach(t=>t.addEventListener("ended",()=>this.onTrackEnded?.(),{once:true}));
    const stopped=new Promise((resolve,reject)=>{
      this.mediaRecorder.addEventListener("stop",()=>resolve(new Blob(this.chunks,{type:this.mediaRecorder.mimeType||this.mimeType||"audio/webm"})),{once:true});
      this.mediaRecorder.addEventListener("error",e=>reject(e.error||new Error("MediaRecorder error")),{once:true});
    });
    this.mediaRecorder.start(250);
    this.autoTimer=setTimeout(()=>onAutoStop(),MAX_MS);
    return {stream,stopped,mimeType:this.mediaRecorder.mimeType||this.mimeType};
  }
  requestStop(){
    if(this.stopRequested)return false;
    this.stopRequested=true;clearTimeout(this.autoTimer);
    if(this.mediaRecorder && this.mediaRecorder.state!=="inactive"){this.mediaRecorder.stop();return true;}
    return false;
  }
  finish(){this.release();this.mediaRecorder=null;}
}