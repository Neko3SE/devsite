import { setLanguage, t } from "./ui.js";

const hero = document.getElementById("hero");
const workspace = document.getElementById("workspace");
const start = document.getElementById("startButton");
const instrumentMode = document.getElementById("instrumentMode");
const vocalMode = document.getElementById("vocalMode");
const instrumentView = document.getElementById("instrumentView");
const vocalView = document.getElementById("vocalView");
const spectrumDetails = document.getElementById("spectrumDetails");
const hold = document.getElementById("holdButton");
const tone = document.getElementById("toneButton");
const sheet = document.getElementById("toneSheet");
const backdrop = document.getElementById("toneBackdrop");
const close = document.getElementById("toneClose");

function drawGraphs(){
  const spectrum=document.getElementById("spectrumCanvas");
  const wave=document.getElementById("waveCanvas");
  const pitch=document.getElementById("pitchCanvas");
  if(spectrum){const c=spectrum.getContext("2d");c.clearRect(0,0,spectrum.width,spectrum.height);c.strokeStyle="#67e892";c.lineWidth=3;c.beginPath();for(let x=0;x<spectrum.width;x+=8){const y=280-(Math.sin(x*.035)*25+Math.sin(x*.011)*18+Math.max(0,190-x*.16)*(0.25+0.75*Math.abs(Math.sin(x*.023))));c.lineTo(x,Math.max(20,y));}c.stroke();}
  if(wave){const c=wave.getContext("2d");c.clearRect(0,0,wave.width,wave.height);c.strokeStyle="#67e892";c.lineWidth=2;c.beginPath();for(let x=0;x<wave.width;x++){const y=wave.height/2+Math.sin(x*.09)*45*Math.sin(x*.004+1);x?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();}
  if(pitch){const c=pitch.getContext("2d");c.clearRect(0,0,pitch.width,pitch.height);c.strokeStyle="#67e892";c.lineWidth=3;c.beginPath();for(let x=0;x<pitch.width;x+=4){const y=pitch.height/2+Math.sin(x*.035)*30+Math.sin(x*.008)*12;x?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();}
}

start.addEventListener("click",()=>{hero.hidden=true;workspace.hidden=false;drawGraphs();window.scrollTo({top:0,behavior:"smooth"});});
instrumentMode.addEventListener("click",()=>{instrumentMode.classList.add("is-active");vocalMode.classList.remove("is-active");instrumentView.hidden=false;vocalView.hidden=true;spectrumDetails.open=true;});
vocalMode.addEventListener("click",()=>{vocalMode.classList.add("is-active");instrumentMode.classList.remove("is-active");instrumentView.hidden=true;vocalView.hidden=false;spectrumDetails.open=false;drawGraphs();});
hold.addEventListener("click",()=>{hold.classList.toggle("is-active");hold.textContent=hold.classList.contains("is-active")?"RELEASE":"HOLD";});
function openTone(){sheet.classList.add("is-open");sheet.setAttribute("aria-hidden","false");backdrop.hidden=false;document.body.style.overflow="hidden";}
function closeTone(){sheet.classList.remove("is-open");sheet.setAttribute("aria-hidden","true");backdrop.hidden=true;document.body.style.overflow="";}
tone.addEventListener("click",openTone);close.addEventListener("click",closeTone);backdrop.addEventListener("click",closeTone);document.addEventListener("keydown",e=>{if(e.key==="Escape")closeTone();});
document.getElementById("langJa").addEventListener("click",()=>setLanguage("ja"));
document.getElementById("langEn").addEventListener("click",()=>setLanguage("en"));
setLanguage("ja");
