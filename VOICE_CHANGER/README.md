# VOICE CHANGER LAB β — Phase 3

Phase 2 Rev.4 is the approved PC and Android real-device baseline.

Phase 3 begins the VOICE PROCESSOR / DSP implementation:
- PRESET: ORIGINAL, CHILD, MALE, FEMALE, OLD, ROBOT, ALIEN
- APPLY processing in `worker/dsp-worker.js`
- duration-preserving granular/OLA pitch stage
- Level-1 Formant Character spectral-character stage
- filter/EQ character, modulation, delay, drive, output limiter
- ORIGINAL is preserved and never overwritten
- failed processing retains the last valid PROCESSED audio
- PROCESSED whole analysis is computed internally
- PLAY PROCESSED uses the existing realtime Analyzer

MANUAL, full A/B comparison UI, and WAV export remain later phases.

## Test focus
Record -> select each preset -> APPLY -> PROCESSING COMPLETE -> PLAY PROCESSED.
Confirm audible transformation, Analyzer operation, duration preservation, and Phase 2 regression.
