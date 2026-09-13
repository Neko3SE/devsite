# VOICE CHANGER LAB β — Phase 5 Rev.3

Baseline: Phase 5 Rev.2. Re-recording and WAV save flows have been verified on PC and Android. Android filename diagnosis showed normal filenames in Android Chrome; the reported corruption was specific to DuckDuckGo Browser.

## Rev.3 changes

### Pitch / Note reliability display
Code review confirmed that ROBOT uses strong Ring Modulation (35 Hz / Depth 75%), plus delay and drive. The F0 detector uses normalized autocorrelation and rejects estimates below its confidence threshold. Therefore an unavailable ROBOT pitch is not necessarily HIGH or LOW; it can be an unreliable F0 estimate.

The UI now uses:
- `PITCH UNRELIABLE`
- `NOTE ---`

Whole-analysis Pitch AVG/RANGE and A/B Pitch fields also use `UNRELIABLE` when no reliable F0 result is available. No fake pitch value is generated and the confidence threshold is not weakened.

### Download filename
Diagnostic testing established:
- Android Chrome: filename displayed normally.
- DuckDuckGo Browser: filename corruption reproduced.
- UTF-8/BOM and WAV payload encoding are not the cause.

Rev.2's Android-specific extended Blob URL lifetime / synthetic MouseEvent workaround has therefore been removed. The implementation returns to the standard Blob URL + `<a download>` path, while retaining strict ASCII filename sanitization.

The UI now states that the displayed download filename may depend on browser/OS implementation. Android Chrome is the verified Android baseline.

## Regression checks
1. PC and Android Chrome: ORIGINAL/PROCESSED WAV download and playback.
2. Confirm expected ASCII filename on Android Chrome.
3. ROBOT playback: if F0 cannot be reliably estimated, show `PITCH UNRELIABLE` and `NOTE ---`.
4. Other presets with reliable F0 should continue to show numeric Pitch and Note.
5. Re-record after PRESET/MANUAL processing remains functional.
