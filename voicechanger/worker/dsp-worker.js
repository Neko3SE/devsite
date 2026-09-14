const send=(type,id,x={})=>postMessage({type,requestId:id,...x});
const prog=(id,stage,progress)=>send("PROGRESS",id,{stage,progress});
const ok=a=>{for(const x of a)if(!Number.isFinite(x))return false;return true};
function pitch(input,sr,st){
 if(Math.abs(st)<.001)return input.slice();
 const r=2**(st/12),N=Math.max(256,Math.round(sr*.04)),H=Math.max(64,Math.round(N*.25));
 const o=new Float32Array(input.length),wgt=new Float32Array(input.length);
 for(let op=0;op<o.length;op+=H){let ip=op*r;
  for(let j=0;j<N&&op+j<o.length;j++){let pos=ip+j*r,i=Math.floor(pos);if(i>=input.length-1)break;
   let f=pos-i,x=input[i]*(1-f)+input[i+1]*f,w=.5-.5*Math.cos(2*Math.PI*j/(N-1));o[op+j]+=x*w;wgt[op+j]+=w}}
 for(let i=0;i<o.length;i++)if(wgt[i]>.001)o[i]/=wgt[i];return o
}
function hp(a,sr,hz){if(!hz)return a;let y=0,x0=0,rc=1/(2*Math.PI*hz),dt=1/sr,k=rc/(rc+dt);for(let i=0;i<a.length;i++){let x=a[i];y=k*(y+x-x0);x0=x;a[i]=y}return a}
function lp(a,sr,hz){if(!hz||hz>=sr*.49)return a;let y=0,k=1-Math.exp(-2*Math.PI*hz/sr);for(let i=0;i<a.length;i++){y+=k*(a[i]-y);a[i]=y}return a}
function character(a,sr,p,le,he){let lo=0,k=1-Math.exp(-2*Math.PI*900/sr),m=p/100,lg=10**(le/20),hg=10**(he/20);for(let i=0;i<a.length;i++){lo+=k*(a[i]-lo);let hi=a[i]-lo;a[i]=lo*lg*(1-m*.35)+hi*hg*(1+m*.35)}return a}
function mod(a,sr,t,r,d){if(t==="off"||!d)return a;let ph=0,step=2*Math.PI*r/sr;for(let i=0;i<a.length;i++){let q=Math.sin(ph);ph+=step;a[i]*=t==="ring"?(1-d)+d*q:1-d+d*(.5+.5*q)}return a}
function delay(a,sr,ms,fb){if(!ms)return a;let d=Math.max(1,Math.round(sr*ms/1000));for(let i=d;i<a.length;i++)a[i]+=a[i-d]*fb;return a}
function drive(a,d){if(!d)return a;let k=1+d*18,z=Math.tanh(k);for(let i=0;i<a.length;i++)a[i]=Math.tanh(a[i]*k)/z;return a}
function limit(a,db){let g=10**(db/20);for(let i=0;i<a.length;i++)a[i]=Math.max(-.98,Math.min(.98,a[i]*g));return a}
onmessage=e=>{const {type,requestId,samples,sampleRate,params}=e.data||{};if(type!=="PROCESS")return;try{
 let input=new Float32Array(samples);if(!input.length||!ok(input))throw Error("DSP_INVALID_INPUT");const dry=input.slice();prog(requestId,"PREPARING",5);
 let a=pitch(input,sampleRate,params.pitch||0);prog(requestId,"PITCH",35);
 a=character(a,sampleRate,params.formant||0,params.lowEq||0,params.highEq||0);prog(requestId,"FORMANT CHARACTER",50);
 a=hp(a,sampleRate,params.lowCut||0);a=lp(a,sampleRate,params.highCut||0);prog(requestId,"FILTER",62);
 a=mod(a,sampleRate,params.modType||"off",params.modRate||0,params.modDepth||0);prog(requestId,"MODULATION",72);
 a=delay(a,sampleRate,params.delayMs||0,params.feedback||0);prog(requestId,"DELAY",82);
 a=drive(a,params.distortion||0);prog(requestId,"DRIVE",90);
 const mix=Math.max(0,Math.min(1,params.mix??1));if(mix<1){for(let i=0;i<a.length;i++)a[i]=dry[i]*(1-mix)+a[i]*mix;}
 a=limit(a,params.outputGain||0);prog(requestId,"LIMITER",96);
 if(a.length!==input.length||!ok(a))throw Error("DSP_INVALID_OUTPUT");prog(requestId,"FINALIZING",100);
 send("COMPLETE",requestId,{samples:a.buffer,sampleRate,duration:a.length/sampleRate});
}catch(err){send("ERROR",requestId,{message:String(err?.message||err)})}};