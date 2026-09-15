export class SoundAnalyzer {
  analyze(dbBins,sampleRate,fftSize,fundamentalHz){
    if(!dbBins||!sampleRate||!fftSize)return null;
    const binHz=sampleRate/fftSize, nyquist=sampleRate/2;
    let powerSum=0, weighted=0;
    for(let i=1;i<dbBins.length;i++){
      const db=dbBins[i];
      if(!Number.isFinite(db))continue;
      const p=Math.pow(10,db/10);
      const hz=i*binHz;
      powerSum+=p; weighted+=hz*p;
    }
    const centroidHz=powerSum>0?weighted/powerSum:null;
    const harmonics=[];
    if(Number.isFinite(fundamentalHz)&&fundamentalHz>0){
      let h1Power=null;
      for(let h=1;h<=8;h++){
        const target=fundamentalHz*h;
        if(target>nyquist){harmonics.push({n:h,targetHz:target,db:null,relativeDb:null,relativePercent:null,outOfRange:true});continue;}
        const center=Math.round(target/binHz);
        let bestDb=-Infinity;
        for(let k=Math.max(1,center-1);k<=Math.min(dbBins.length-1,center+1);k++)bestDb=Math.max(bestDb,dbBins[k]);
        const p=Number.isFinite(bestDb)?Math.pow(10,bestDb/10):0;
        if(h===1)h1Power=p;
        const relativePercent=h1Power>0?Math.sqrt(p/h1Power)*100:null;
        const relativeDb=h1Power>0&&p>0?10*Math.log10(p/h1Power):null;
        harmonics.push({n:h,targetHz:target,db:Number.isFinite(bestDb)?bestDb:null,relativeDb,relativePercent,outOfRange:false});
      }
    }
    return {centroidHz,harmonics,binHz,nyquist,dbBins:new Float32Array(dbBins)};
  }
}
