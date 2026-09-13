# VOICE CHANGER LAB β — Phase 3 Rev.2

Phase 3 Rev.1 PC test:
- APPLY -> PLAY PROCESSED -> sound -> Analyzer -> STOP: OK
- Defect: pressing the PLAYBACK (ORIGINAL) STOP left the VOICE PROCESSOR STOP enabled and PRESET controls disabled.

## Root cause
ORIGINAL and PROCESSED playback shared the single `PLAYING` app state, but the application did not explicitly track which source was playing. The two STOP UIs could therefore become unsynchronized.

## Rev.2 fix
- Added explicit `playbackSource`: `ORIGINAL | PROCESSED | null`.
- Added `playbackReturnState`.
- Added shared `finishPlayback()` cleanup path.
- ORIGINAL STOP is enabled only while ORIGINAL is playing.
- PROCESSED STOP is enabled only while PROCESSED is playing.
- Both manual STOP paths and natural playback completion use the same state restoration logic.
- After playback ends:
  - `playbackSource = null`
  - app returns to `PROCESSED` when a processed result exists, otherwise `RECORDED`
  - PRESET selection is re-enabled
  - APPLY / PLAY controls are recalculated
  - both STOP buttons are disabled
  - Analyzer instantaneous values are reset

DSP processing itself is unchanged from Rev.1.

## PC regression test
1. PLAY ORIGINAL -> PLAYBACK STOP -> PRESET buttons selectable.
2. PLAY PROCESSED -> VOICE PROCESSOR STOP -> PRESET buttons selectable.
3. Natural end of ORIGINAL -> PRESET buttons selectable.
4. Natural end of PROCESSED -> PRESET buttons selectable.
5. Only the STOP button belonging to the currently playing source is enabled.
6. APPLY -> PLAY PROCESSED still produces sound and Analyzer activity.
