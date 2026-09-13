# VOICE CHANGER LAB β — Phase 2

実装ベースライン: Phase 1 Rev.1 + 基本設計仕様書 v1.0 + 詳細設計仕様書 v1.0

## Phase 2 追加実装
- Realtime Pitch/F0 estimation (normalized autocorrelation, confidence gate)
- Realtime NOTE conversion (A4=440 Hz)
- Realtime Spectral Centroid display
- Whole-recording ORIGINAL analysis
  - Pitch AVG / MIN / MAX
  - representative NOTE
  - RMS AVG
  - PEAK
  - voiced frame count
- ORIGINAL playback
- Playback progress gauge
- Playback waveform / spectrum
- Playback/recording state lock
- visibilitychange playback stop

## 継続して有効なPhase 1 Rev.1機能
- Capability Check
- Microphone allow / deny / retry
- AudioContext
- MediaRecorder MIME feature detection
- 30 sec max recording / auto stop
- 0.5 sec validation
- realtime waveform / spectrum / RMS / Peak
- transactional re-recording
- microphone release after recording

## 未実装（次Phase）
- PRESET / MANUAL DSP
- Web Worker DSP pipeline
- PROCESSED whole analysis
- A/B ORIGINAL / PROCESSED comparison
- WAV export
- Mini Monitor

## Phase 2 実機確認ポイント
1. 録音中にPITCHとNOTEが発声時だけ反応し、無音/不安定音では `---` になること。
2. 録音停止後、ORIGINAL ANALYSISが表示されること。
3. PLAY ORIGINALで録音結果が再生できること。
4. 再生中にWaveform/Spectrumが動くこと。
5. STOPおよび自然終了後にRECORDEDへ戻ること。
6. 再録音しても新録音が正常確定するまで旧ORIGINALが保持されること。

※ F0閾値・解析窓はβの音響チューニング対象です。
