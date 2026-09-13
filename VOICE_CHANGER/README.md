# VOICE CHANGER LAB β — Phase 4 Rev.1

Baseline: Phase 4, verified on PC and Android.

## Rev.1 — BYPASS monitor routing
Phase 4 correctly disabled DSP APPLY during BYPASS, but it also disabled the VOICE PROCESSOR playback button. This made BYPASS comparison inconvenient.

Rev.1 changes the VOICE PROCESSOR playback behavior:

- `BYPASS OFF` -> button label `PLAY PROCESSED` -> plays the latest valid processed audio.
- `BYPASS ON` -> button label `PLAY ORIGINAL` -> plays ORIGINAL from the same VOICE PROCESSOR location.
- APPLY remains disabled while BYPASS is ON.
- Existing PROCESSED audio is retained and is available again immediately after BYPASS is turned OFF.
- Analyzer identifies bypass playback as `A : ORIGINAL / BYPASS`.
- The same VOICE PROCESSOR STOP button stops either routed source.
- Natural playback completion uses the existing centralized playback cleanup.
- No DSP algorithm or MANUAL parameter behavior was changed.

## Regression test
1. Create valid PROCESSED audio.
2. BYPASS OFF -> PLAY PROCESSED -> processed audio / Analyzer -> STOP.
3. BYPASS ON -> button changes to PLAY ORIGINAL.
4. PLAY ORIGINAL -> original audio / Analyzer shows `A : ORIGINAL / BYPASS` -> STOP.
5. Confirm APPLY is disabled while BYPASS ON.
6. BYPASS OFF -> button returns to PLAY PROCESSED and existing processed audio remains playable.
7. Repeat with natural playback completion.
8. Verify PRESET/MANUAL controls return correctly after STOP/end.
