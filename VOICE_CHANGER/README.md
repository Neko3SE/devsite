# VOICE CHANGER LAB β — Phase 6 — Integration / β Candidate

Baseline: Phase 5 Rev.3, verified through PC/Android implementation cycles.

Phase 6 is an integration and documentation pass toward the β candidate. It does not intentionally change DSP algorithms, recording transactions, WAV encoding, or the approved Android Chrome download path.

## Changes
- Updated phase identification in SYSTEM INFORMATION.
- Replaced obsolete Phase 2 HOW TO USE text with the approved complete workflow:
  Record → Measure → Transform → Compare → Listen → Save.
- Added PRESET, MANUAL, A/B/BYPASS, WAV save guidance.
- Added the approved explanations for Pitch/F0, `UNRELIABLE`, dBFS, Spectral Centroid, and Formant Character.
- Added the preset-name caution: effect-character names are not speaker gender/age classification.
- Added complete browser/foreground/audio-route requirements.
- Retained local-browser privacy statement.
- Retained browser/OS-dependent download filename note established after Android diagnosis.

## Current verified implementation history
- Microphone permission / recording: PC + Android.
- Realtime and whole ORIGINAL analysis: PC + Android.
- PRESET DSP / processed playback: PC + Android.
- MANUAL DSP / BYPASS: PC + Android.
- Re-record after PROCESSED: PC + Android.
- WAV save: PC + Android.
- Android Chrome filename: normal.
- DuckDuckGo Browser filename corruption: isolated as browser-specific download implementation behavior.
- ROBOT unreliable F0 display: Android Chrome verified.

## β candidate test focus
Run a regression pass without changing acoustic tuning:
1. Permission allow / deny / retry.
2. Record >0.5 sec and 30 sec auto-stop.
3. ORIGINAL playback and analyzer.
4. Every PRESET: APPLY → PLAY PROCESSED → STOP.
5. MANUAL: edit → APPLY → BYPASS ON/OFF.
6. Re-record from PROCESSED; cancel, successful replacement, and <0.5 sec failure retention.
7. A/B measured comparison.
8. SAVE ORIGINAL / SAVE PROCESSED and downloaded WAV playback.
9. ROBOT `UNRELIABLE` behavior where F0 is not reliable.
10. No horizontal scrolling on phone.
11. Background/app-switch interruption behavior.
12. iPhone Safari/Edge remains an unverified formal-device target and should be tested before final β release.
