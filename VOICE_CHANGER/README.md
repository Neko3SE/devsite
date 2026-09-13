# VOICE CHANGER LAB β — Phase 1

実装ベースライン: 基本設計仕様書 v1.0 / 詳細設計仕様書 v1.0

## Phase 1 実装範囲
- Responsive UI / Analyzer shell
- Capability Check
- Secure Context check
- Microphone permission flow
- AudioContext lifecycle
- MediaRecorder MIME feature detection
- Max 30 sec recording / auto stop
- 0.5 sec minimum validation
- Realtime waveform / spectrum / RMS / Peak
- Decode + mono normalization
- Transactional re-recording (old session retained until new recording validates)
- Microphone release after recording
- visibilitychange interruption handling
- ORIGINAL session metadata

## 未実装（次Phase）
- F0 / Note
- Whole Analysis
- PRESET / MANUAL DSP
- Web Worker DSP
- A/B playback
- WAV export
- Mini Monitor

## 実機確認
HTTPS環境で確認してください。スマートフォンの file:// は正式サポート対象外です。
