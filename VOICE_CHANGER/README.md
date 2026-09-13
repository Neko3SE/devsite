# VOICE CHANGER LAB β — Phase 5 Rev.2

Baseline: Phase 5 Rev.1. Re-recording regression fix verified on PC and Android.

## Android download filename compatibility
On Android, the browser save/download dialog could show a corrupted filename, including the `.wav` extension.

The WAV payload itself is binary PCM data and does not use UTF-8/BOM. Filename encoding is handled separately by the browser/download manager.

Rev.2 therefore keeps the download filename strictly ASCII and hardens the browser download handoff:

- Filename characters are restricted to `A-Z a-z 0-9 . _ -`.
- `.wav` is enforced.
- No BOM is added.
- No Japanese/non-ASCII characters are used in the download filename.
- Both the `download` property and explicit `download` attribute receive the same ASCII filename.
- The anchor is attached to the DOM during the handoff.
- A real `MouseEvent` is dispatched instead of immediately removing the anchor after `click()`.
- The anchor and Blob URL are retained for 10 seconds before cleanup, allowing Android's download manager more time to consume the filename.
- The exact filename requested from the browser is displayed after `✓ DOWNLOAD STARTED` for comparison with the Android save dialog.
- WAV encoding/DSP/recording behavior is unchanged.

Expected names:
- `voice_original_YYYYMMDD_HHMMSS.wav`
- `voice_child_YYYYMMDD_HHMMSS.wav`
- `voice_robot_YYYYMMDD_HHMMSS.wav`
- `voice_manual_YYYYMMDD_HHMMSS.wav`

## Android verification
1. SAVE ORIGINAL WAV.
2. Compare the filename shown by the app after `DOWNLOAD STARTED` with the Android browser save dialog.
3. Confirm the complete `.wav` extension is readable.
4. Repeat SAVE PROCESSED for PRESET and MANUAL.
5. Open the downloaded WAV and confirm audio playback.
6. Confirm PC download behavior remains unchanged.
