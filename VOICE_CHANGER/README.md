# VOICE CHANGER LAB β — Phase 6 Rev.2 — iPhone UI Stabilization

Baseline: Phase 6 Rev.1.

## Root cause
Rev.1 attempted to reserve the warning row while the HTML `hidden` attribute was active. However, the existing global CSS rule `[hidden]{display:none!important}` overrode that reservation. Therefore the warning row was still removed from layout whenever LOW INPUT disappeared.

## Rev.2 fix
The warning line immediately above WAVEFORM is now permanently present in the layout.

- The `hidden` attribute is no longer used for `signalWarning`.
- JavaScript changes only its text:
  - normal: empty string
  - low level: `⚠ LOW INPUT`
  - clipping: `⚠ CLIP`
- The warning line has a fixed 1.25rem height.
- No insertion/removal from layout occurs as the RMS level crosses the LOW INPUT threshold.
- The global `[hidden]` rule is left unchanged for other UI elements.
- No analyzer thresholds, DSP, recording, playback, WAV, Pitch/F0, or preset logic is changed.

## iPhone SE verification
While recording, repeatedly move the microphone input above and below the LOW INPUT threshold. The text above WAVEFORM should alternate between blank and `⚠ LOW INPUT`, while the ANALYZER/WAVEFORM position and panel height remain stable.
