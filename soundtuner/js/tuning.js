/*
 * SOUND TUNER LAB β — Phase 3 Rev.1
 * 12-TET tuner logic. Pure calculation/state helper; no DOM or audio I/O.
 */
const SHARP_NAMES=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
const FLAT_NAMES =["C","Db","D","Eb","E","F","Gb","G","Ab","A","Bb","B"];
const JA_SOLFEGE =["ド","ド♯","レ","レ♯","ミ","ファ","ファ♯","ソ","ソ♯","ラ","ラ♯","シ"];

export const TUNING_DEFAULTS={
  a4:440.0, a4Min:415.0, a4Max:466.0, a4Step:0.1,
  tolerance:5, accidental:"sharp"
};

export function clampA4(value){
  const n=Number(value);
  if(!Number.isFinite(n)) return TUNING_DEFAULTS.a4;
  return Math.min(TUNING_DEFAULTS.a4Max,Math.max(TUNING_DEFAULTS.a4Min,Math.round(n*10)/10));
}
export function midiFloatFromFrequency(frequency,a4=440){
  return 69+12*Math.log2(frequency/a4);
}
export function frequencyFromMidi(midi,a4=440){
  return a4*Math.pow(2,(midi-69)/12);
}
export function noteParts(midi,accidental="sharp"){
  const names=accidental==="flat"?FLAT_NAMES:SHARP_NAMES;
  const pc=((midi%12)+12)%12;
  return {name:names[pc],octave:Math.floor(midi/12)-1,solfege:JA_SOLFEGE[pc]};
}
export function centsFromTarget(frequency,target){
  return 1200*Math.log2(frequency/target);
}
export function analyzeTuning(frequency,{a4=440,accidental="sharp"}={}){
  if(!Number.isFinite(frequency)||frequency<=0) return null;
  a4=clampA4(a4);
  const midiFloat=midiFloatFromFrequency(frequency,a4);
  const midi=Math.round(midiFloat);
  const target=frequencyFromMidi(midi,a4);
  const cent=centsFromTarget(frequency,target);
  const note=noteParts(midi,accidental);
  return {frequency,midiFloat,midi,target,cent,note:`${note.name}${note.octave}`,solfege:note.solfege};
}

/*
 * UI-status hysteresis:
 * enter IN TUNE at tolerance; leave only after tolerance+0.8 cent.
 * This stabilizes boundary display without altering measured cents.
 */
export function tuningStatus(cent,previous="---",tolerance=5){
  const c=Number(cent), t=Number(tolerance), h=0.8;
  if(!Number.isFinite(c)) return "---";
  if(previous==="IN_TUNE" && Math.abs(c)<=t+h) return "IN_TUNE";
  if(previous==="FLAT" && c<-(t-h)) return "FLAT";
  if(previous==="SHARP" && c>(t-h)) return "SHARP";
  if(Math.abs(c)<=t) return "IN_TUNE";
  return c<0?"FLAT":"SHARP";
}
