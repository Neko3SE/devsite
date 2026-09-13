# VOICE CHANGER LAB β — Phase 5 — WAV SAVE

Baseline: Phase 4 Rev.1, verified on PC and Android.

## Implemented
- SAVE ORIGINAL WAV
- SAVE PROCESSED WAV
- WAV RIFF / PCM16 / Mono
- Actual AudioContext/decoded sample rate is written to the WAV header
- ORIGINAL samples are encoded directly: no normalization, limiter, gain, or fade is added at save time
- PROCESSED samples are encoded exactly as the last successful DSP output
- Float32 -> PCM16: negative ×32768, positive ×32767, clamp [-1,1]
- NaN/Infinity rejects save instead of silently writing zeros
- Local device timestamp filenames:
  - voice_original_YYYYMMDD_HHMMSS.wav
  - voice_child_...
  - voice_robot_...
  - voice_manual_...
- Metadata display: source, mode/preset, format, channel, sample rate, duration, actual Blob file size
- Success wording: `✓ DOWNLOAD STARTED`
- Double-click/in-progress guard
- Blob URL is revoked after download start
- Saving is locked during recording, processing, or playback
- If MANUAL parameters are dirty, SAVE PROCESSED saves the last successfully generated PROCESSED result and warns accordingly

## Test focus
1. Save ORIGINAL and play the downloaded WAV.
2. Apply PRESET, save PROCESSED, play it.
3. Apply MANUAL, save PROCESSED; filename should contain `manual`.
4. Confirm sample rate/duration/file size metadata.
5. Edit MANUAL after APPLY without applying again; SAVE PROCESSED should save the last valid processed result.
6. Verify both downloaded WAVs on PC.
7. Android: verify download starts and downloaded WAV can be played by an available app/browser.
