# VOICE CHANGER LAB β

Neko3SE LAB experimental browser content.

**Live Site / 実際に使う:** https://www.neko3se.com/voicechanger/

## Overview / 概要

ブラウザだけで録音した声を変換し、その変化を「聞く」だけでなく、波形や音声指標として「見る」ことはできるのか。

**English**  
Can recorded voice be transformed entirely in the browser and observed not only by listening, but also through waveforms and audio metrics?

## Features / 主な機能

- Up to 30 seconds of microphone recording
- Preset and manual voice transformation
- Waveform visualization
- Pitch, RMS, Peak, voiced-frame and Spectral Centroid analysis
- Processed-audio playback and WAV saving
- Real-device UI stabilization for small screens

## How It Works / 仕組み

録音・音声変換・分析・波形表示の主要処理をブラウザ内で実行しています。

**English**  
Recording, voice transformation, analysis and waveform rendering are primarily processed in the browser.

## Technology / 使用技術

HTML5, CSS, JAVASCRIPT, WEB AUDIO API, MEDIADEVICES, MEDIARECORDER, CANVAS, AUDIO ANALYSIS, RESPONSIVE DESIGN

## Environment / 動作環境

ブラウザ上で動作するコンテンツです。PC・Android・iPhoneを含む実機検証を行っていますが、端末・OS・ブラウザの組み合わせすべてを保証するものではありません。マイクや音声を利用するコンテンツでは、ブラウザ権限や端末設定も動作に影響します。

**English**  
This content runs in a web browser and has been tested on real devices including PC, Android and iPhone environments. This does not guarantee every device, OS and browser combination. For microphone/audio content, browser permissions and device settings can also affect behavior.

## Known Limitations / 既知の制約

- Microphone permission and a compatible browser are required.
- Recording and audio behavior can vary by device, OS, browser and audio route.
- Screen lock or app switching may interrupt recording, processing or playback.
- The displayed audio metrics are experimental analysis values, not calibrated measurement-instrument results.

## Related Links / 関連リンク

- Live Site: https://www.neko3se.com/voicechanger/
- Source directory: https://github.com/Neko3SE/devsite/tree/main/voicechanger
- Neko3SE LAB: https://www.neko3se.com/

## License

See the repository root `LICENSE`.

## Implementation Note / 既存実装ノート

The following approved Rev.2 stabilization record from the previous README is retained for technical history.

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
