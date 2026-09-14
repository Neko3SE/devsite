export function encodeWavPcm16(samples,sampleRate){
  if(!(samples instanceof Float32Array)||!samples.length||!Number.isFinite(sampleRate)||sampleRate<=0)throw new Error("SAV_INVALID_AUDIO");
  for(let i=0;i<samples.length;i++)if(!Number.isFinite(samples[i]))throw new Error("SAV_INVALID_AUDIO");
  const bytes=44+samples.length*2,ab=new ArrayBuffer(bytes),v=new DataView(ab);
  const text=(o,s)=>{for(let i=0;i<s.length;i++)v.setUint8(o+i,s.charCodeAt(i))};
  text(0,"RIFF");v.setUint32(4,bytes-8,true);text(8,"WAVE");text(12,"fmt ");
  v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,Math.round(sampleRate),true);
  v.setUint32(28,Math.round(sampleRate)*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);text(36,"data");v.setUint32(40,samples.length*2,true);
  let o=44;for(let i=0;i<samples.length;i++,o+=2){const x=Math.max(-1,Math.min(1,samples[i]));v.setInt16(o,Math.round(x<0?x*32768:x*32767),true)}
  return new Blob([ab],{type:"audio/wav"});
}
export function wavFilename(source,preset,now=new Date()){
 const pad=n=>String(n).padStart(2,"0"),stamp=`${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
 const tag=source==="original"?"original":(preset||"manual").toLowerCase().replace(/[^a-z0-9_-]+/g,"_");
 return `voice_${tag}_${stamp}.wav`;
}
