export class AudioEngine {
  constructor(){ this.context=null; }
  async ensureContext(){
    if(!this.context){
      const AC=window.AudioContext||window.webkitAudioContext;
      if(!AC) throw new Error("AudioContext unavailable");
      this.context=new AC();
    }
    if(this.context.state==="suspended") await this.context.resume();
    return this.context;
  }
  async decode(blob){
    const ctx=await this.ensureContext();
    const ab=await blob.arrayBuffer();
    return await ctx.decodeAudioData(ab.slice(0));
  }
  toMono(audioBuffer){
    const n=audioBuffer.length, ch=audioBuffer.numberOfChannels;
    const out=new Float32Array(n);
    for(let c=0;c<ch;c++){
      const src=audioBuffer.getChannelData(c);
      for(let i=0;i<n;i++) out[i]+=src[i]/ch;
    }
    return {samples:out,sampleRate:audioBuffer.sampleRate,duration:n/audioBuffer.sampleRate};
  }
}