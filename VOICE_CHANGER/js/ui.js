const $=id=>document.getElementById(id);
export class UI {
  constructor(){
    this.wave=$("waveform");this.spec=$("spectrum");this.wctx=this.wave.getContext("2d");this.sctx=this.spec.getContext("2d");
    this.resize(); addEventListener("resize",()=>{cancelAnimationFrame(this.resizeRaf);this.resizeRaf=requestAnimationFrame(()=>this.resize())});
  }
  resize(){
    for(const c of [this.wave,this.spec]){
      const dpr=Math.min(devicePixelRatio||1,2),r=c.getBoundingClientRect();
      const w=Math.max(1,Math.round(r.width*dpr)),h=Math.max(1,Math.round(r.height*dpr));
      if(c.width!==w||c.height!==h){c.width=w;c.height=h;}
    }
  }
  status(text,state="ready"){const e=$("systemStatus");e.textContent="● SYSTEM "+text;e.dataset.state=state}
  mic(text){$("micState").textContent=text}
  message(text,isError=false){const e=$("recordMessage");e.textContent=text;e.style.color=isError?"var(--danger)":"var(--accent)"}
  permissionError(html){const e=$("permissionError");e.textContent=html;e.hidden=!html}
  updateLevel(rms,peak){
    $("rmsValue").textContent=Number.isFinite(rms)?rms.toFixed(1)+" dBFS":"--- dBFS";
    $("peakValue").textContent=Number.isFinite(peak)?peak.toFixed(1)+" dBFS":"--- dBFS";
    const pct=Number.isFinite(rms)?Math.max(0,Math.min(100,(rms+80)/80*100)):0;$("levelBar").style.width=pct+"%";
    const w=$("signalWarning"); if(Number.isFinite(peak)&&peak>=-.2){w.hidden=false;w.textContent="⚠ CLIP"} else if(Number.isFinite(rms)&&rms<-55){w.hidden=false;w.textContent="⚠ LOW INPUT"} else w.hidden=true;
  }
  resetAnalyzer(){this.updateLevel(-Infinity,-Infinity);$("pitchValue").textContent="--- Hz";$("noteValue").textContent="---";this.clearScopes()}
  clearScopes(){for(const [c,x] of [[this.wave,this.wctx],[this.spec,this.sctx]]){x.clearRect(0,0,c.width,c.height);x.strokeStyle="#173338";x.beginPath();x.moveTo(0,c.height/2);x.lineTo(c.width,c.height/2);x.stroke()}}
  drawWaveform(data){const c=this.wave,x=this.wctx;x.clearRect(0,0,c.width,c.height);x.strokeStyle="#67e6b1";x.lineWidth=Math.max(1,(devicePixelRatio||1));x.beginPath();const step=data.length/c.width;for(let px=0;px<c.width;px++){const v=data[Math.min(data.length-1,Math.floor(px*step))];const y=(.5-v*.44)*c.height;if(px===0)x.moveTo(px,y);else x.lineTo(px,y)}x.stroke()}
  drawSpectrum(data,sr){const c=this.spec,x=this.sctx;x.clearRect(0,0,c.width,c.height);x.fillStyle="#35b884";const ny=sr/2,min=20,max=Math.min(20000,ny);const bins=Math.min(c.width,180);for(let i=0;i<bins;i++){const f1=min*Math.pow(max/min,i/bins),f2=min*Math.pow(max/min,(i+1)/bins);const b=Math.min(data.length-1,Math.floor(((f1+f2)/2)/ny*data.length));const db=Math.max(-80,Math.min(0,data[b]));const h=(db+80)/80*c.height;const bw=c.width/bins;x.fillRect(i*bw,c.height-h,Math.max(1,bw*.72),h)}}
  setCapabilities(caps){const e=$("capabilities");e.innerHTML="";for(const [name,ok] of Object.entries(caps)){const d=document.createElement("div");d.className="cap "+(ok?"":"no");const s=document.createElement("strong");s.textContent=name;const v=document.createElement("span");v.textContent=ok?"YES":"NO";d.append(s,v);e.append(d)}}
  setTechnical(items){const e=$("technicalDetails");e.innerHTML="";for(const [k,v] of Object.entries(items)){const d=document.createElement("div"),dt=document.createElement("dt"),dd=document.createElement("dd");dt.textContent=k;dd.textContent=v??"UNKNOWN";d.append(dt,dd);e.append(d)}}
  recording(elapsed){$("recordTime").textContent=this.format(elapsed);$("recordProgress").style.width=Math.min(100,elapsed/30000*100)+"%"}
  format(ms){const s=Math.max(0,ms)/1000,m=Math.floor(s/60),r=s-m*60;return String(m).padStart(2,"0")+":"+r.toFixed(1).padStart(4,"0")}
  recorded(meta){$("durationValue").textContent=meta.duration.toFixed(2)+" sec";$("sampleRateValue").textContent=meta.sampleRate+" Hz";$("originalState").textContent="ORIGINAL ● READY";$("recordProgress").style.width=Math.min(100,meta.duration/30*100)+"%"}
}