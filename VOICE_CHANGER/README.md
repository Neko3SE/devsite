# VOICE CHANGER LAB β — Phase 5 Rev.1

Baseline: Phase 5. Phase 5 WAV saving was verified on PC and Android.

## Fixed regression — re-record after processing
Phase 5 inherited a state guard that enabled RECORD only in `READY` and `RECORDED`.
After PRESET or MANUAL APPLY, the application is in `PROCESSED`, so re-recording was incorrectly disabled.

Rev.1 fixes both the UI guard and the recording logic guard:

- RECORD is available in `READY`, `RECORDED`, and `PROCESSED` when the microphone is READY.
- When an existing session is present, the existing `REPLACE RECORDING?` confirmation is still used.
- Starting a replacement recording does **not** immediately destroy ORIGINAL or PROCESSED.
- The pre-recording state is snapshotted.
- Only after the new recording is decoded, validated, and is at least 0.5 seconds long is the new ORIGINAL committed and old PROCESSED cleared.
- If the replacement is too short or recording/decode fails, the previous ORIGINAL and PROCESSED are retained and the app returns to the previous usable state (`PROCESSED` when applicable).
- MANUAL parameter settings remain retained across a successful re-record, per the approved design.
- WAV saving and DSP algorithms are unchanged.

## Regression test
1. Record -> PRESET -> APPLY -> confirm `PROCESSED`.
2. Confirm RECORD is enabled.
3. RECORD -> replacement confirmation -> CANCEL: current ORIGINAL/PROCESSED remain.
4. RECORD -> RECORD NEW -> record >=0.5 sec: new ORIGINAL commits and old PROCESSED clears.
5. Create PROCESSED again -> RECORD NEW -> stop <0.5 sec: old ORIGINAL/PROCESSED remain available.
6. Repeat the successful replacement path after MANUAL APPLY.
7. Confirm MANUAL control values remain after successful replacement recording.
8. Confirm SAVE ORIGINAL / SAVE PROCESSED still work.
