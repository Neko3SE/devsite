/*
 * SOUND TUNER LAB β — Phase 2 Rev.1
 * YIN-family monophonic fundamental-frequency detector.
 * No note naming, A4, cent, or DOM logic belongs here.
 */
const DEFAULT_MIN_HZ = 65.4;     // C2 practical research range
const DEFAULT_MAX_HZ = 2093.0;   // C7 practical research range
const DEFAULT_YIN_THRESHOLD = 0.15;
const DEFAULT_CONFIDENCE_GATE = 0.82; // Phase 2 calibration value; not final.
const OCTAVE_RATIO_TOLERANCE = 0.035;
const OCTAVE_CONFIRM_FRAMES = 5;

export class PitchDetector {
  constructor(options={}) {
    this.minHz = options.minHz ?? DEFAULT_MIN_HZ;
    this.maxHz = options.maxHz ?? DEFAULT_MAX_HZ;
    this.yinThreshold = options.yinThreshold ?? DEFAULT_YIN_THRESHOLD;
    this.confidenceGate = options.confidenceGate ?? DEFAULT_CONFIDENCE_GATE;
    this.diff = new Float32Array(0);
    this.cmnd = new Float32Array(0);
    this.lastAcceptedHz = null;
    this.pendingOctaveHz = null;
    this.pendingOctaveFrames = 0;
  }

  reset() {
    this.lastAcceptedHz = null;
    this.pendingOctaveHz = null;
    this.pendingOctaveFrames = 0;
  }

  detect(buffer, sampleRate, inputState="GOOD") {
    if (!buffer || buffer.length < 32 || !sampleRate) return this._invalid("UNSTABLE_SIGNAL");
    if (inputState === "LOW") return this._invalid("LOW_INPUT");

    const minTau = Math.max(2, Math.floor(sampleRate / this.maxHz));
    const maxTau = Math.min(Math.floor(sampleRate / this.minHz), Math.floor(buffer.length / 2));
    if (maxTau <= minTau + 2) return this._invalid("OUT_OF_PITCH_RANGE");

    this._ensure(maxTau + 2);
    const diff = this.diff, cmnd = this.cmnd;

    diff[0] = 0;
    for (let tau=1; tau<=maxTau+1; tau++) {
      let sum = 0;
      const limit = buffer.length - tau;
      for (let i=0; i<limit; i++) {
        const d = buffer[i] - buffer[i+tau];
        sum += d*d;
      }
      diff[tau] = sum;
    }

    cmnd[0] = 1;
    let running = 0;
    for (let tau=1; tau<=maxTau+1; tau++) {
      running += diff[tau];
      cmnd[tau] = running > 0 ? diff[tau] * tau / running : 1;
    }

    let tau = -1;
    for (let t=minTau; t<=maxTau; t++) {
      if (cmnd[t] < this.yinThreshold) {
        while (t+1 <= maxTau && cmnd[t+1] < cmnd[t]) t++;
        tau = t;
        break;
      }
    }
    if (tau < 0) {
      let best=minTau;
      for (let t=minTau+1;t<=maxTau;t++) if(cmnd[t]<cmnd[best]) best=t;
      tau=best;
    }

    const confidence = Math.max(0, Math.min(1, 1 - cmnd[tau]));
    if (!Number.isFinite(confidence) || confidence < this.confidenceGate)
      return {frequency:null, rawFrequency:null, confidence, voiced:false, pitchState:"LOW_CONFIDENCE", rawPeriod:tau};

    const refinedTau = this._parabolicTau(cmnd, tau, minTau, maxTau);
    const rawFrequency = sampleRate / refinedTau;
    if (!Number.isFinite(rawFrequency) || rawFrequency < this.minHz || rawFrequency > this.maxHz)
      return {frequency:null, rawFrequency, confidence, voiced:false, pitchState:"OUT_OF_PITCH_RANGE", rawPeriod:refinedTau};

    const frequency = this._octaveContinuity(rawFrequency);
    if (frequency === null)
      return {frequency:null, rawFrequency, confidence, voiced:false, pitchState:"UNSTABLE_SIGNAL", rawPeriod:refinedTau};

    this.lastAcceptedHz = frequency;
    return {frequency, rawFrequency, confidence, voiced:true, pitchState:"VALID", rawPeriod:refinedTau};
  }

  _octaveContinuity(hz) {
    if (!this.lastAcceptedHz) return hz;
    const ratio = hz / this.lastAcceptedHz;
    const octaveJump = Math.abs(ratio-2) < OCTAVE_RATIO_TOLERANCE*2 ||
                       Math.abs(ratio-0.5) < OCTAVE_RATIO_TOLERANCE*0.5;
    if (!octaveJump) {
      this.pendingOctaveHz=null; this.pendingOctaveFrames=0;
      return hz;
    }
    if (this.pendingOctaveHz && Math.abs(hz/this.pendingOctaveHz-1) < OCTAVE_RATIO_TOLERANCE) {
      this.pendingOctaveFrames++;
    } else {
      this.pendingOctaveHz=hz; this.pendingOctaveFrames=1;
    }
    if (this.pendingOctaveFrames >= OCTAVE_CONFIRM_FRAMES) {
      this.pendingOctaveHz=null; this.pendingOctaveFrames=0;
      return hz;
    }
    return null; // transient octave candidate: do not publish a dubious value
  }

  _parabolicTau(a, tau, minTau, maxTau) {
    if (tau <= minTau || tau >= maxTau) return tau;
    const s0=a[tau-1], s1=a[tau], s2=a[tau+1];
    const den = 2*(2*s1-s2-s0);
    if (!Number.isFinite(den) || Math.abs(den)<1e-12) return tau;
    const delta=(s2-s0)/den;
    return tau + Math.max(-1,Math.min(1,delta));
  }
  _ensure(n) {
    if (this.diff.length >= n) return;
    this.diff = new Float32Array(n);
    this.cmnd = new Float32Array(n);
  }
  _invalid(state) {
    return {frequency:null, rawFrequency:null, confidence:0, voiced:false,pitchState:state,rawPeriod:null};
  }
}

export const phase2Calibration = {
  MIN_HZ:DEFAULT_MIN_HZ, MAX_HZ:DEFAULT_MAX_HZ,
  YIN_THRESHOLD:DEFAULT_YIN_THRESHOLD,
  CONFIDENCE_GATE:DEFAULT_CONFIDENCE_GATE,
  OCTAVE_CONFIRM_FRAMES
};
