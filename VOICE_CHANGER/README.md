# VOICE CHANGER LAB β — Phase 6 Rev.1 — iPhone UI Stabilization

Baseline: Phase 6 β candidate.

## Fix
On iPhone SE, the ANALYZER panel could repeatedly change height while the realtime RMS level crossed the LOW INPUT threshold. The warning element used the HTML `hidden` attribute, so switching `LOW INPUT` on/off inserted and removed the warning row from layout.

Rev.1 keeps a fixed warning line box inside ANALYZER:
- Normal: warning line remains reserved but invisible.
- LOW INPUT: `⚠ LOW INPUT`.
- CLIP: `⚠ CLIP`.
- The analyzer layout no longer gains/loses a row when warning state changes.
- Existing warning thresholds and analyzer calculations are unchanged.
- Added `role="status"` / `aria-live="polite"` to the warning line.
- No DSP, recording, playback, WAV, Pitch/F0, or preset changes.

## Regression focus
1. iPhone SE: move input around the LOW INPUT threshold and confirm ANALYZER panel height remains stable.
2. Confirm `⚠ LOW INPUT` and `⚠ CLIP` still appear correctly.
3. Confirm waveform and spectrum continue updating.
4. PC / Android: confirm analyzer layout and warning display remain normal.
