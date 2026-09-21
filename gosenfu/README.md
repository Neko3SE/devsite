# 五線譜ドレミclip

Neko3SE LAB experimental browser content.

**Live Site / 実際に使う:** https://neko3se.com/gosenfu/

## Overview / 概要

五線譜上の音符、ドレミの音階表示、実際に鳴る音を短いコンテンツとして同期させたとき、ブラウザでどこまでシンプルな音楽教材としてまとめられるのか。

**English**  
How simply can staff notation, solfege labels and sounding notes be synchronized into a short browser-based learning clip?

## Features / 主な機能

- Short synchronized staff-notation and scale clip
- solfege-oriented learning presentation
- Video embedded in the HTML as a Base64 Data URL
- Japanese / English presentation

## How It Works / 仕組み

動画データをData URLとしてHTML内へ埋め込み、単一ページで再生できる構成にしています。

**English**  
Video data is embedded as a Data URL so the clip can be played from a self-contained page.

## Technology / 使用技術

HTML5, HTML5 VIDEO, BASE64, DATA URL, RESPONSIVE DESIGN

## Environment / 動作環境

ブラウザ上で動作するコンテンツです。PC・Android・iPhoneを含む実機検証を行っていますが、端末・OS・ブラウザの組み合わせすべてを保証するものではありません。マイクや音声を利用するコンテンツでは、ブラウザ権限や端末設定も動作に影響します。

**English**  
This content runs in a web browser and has been tested on real devices including PC, Android and iPhone environments. This does not guarantee every device, OS and browser combination. For microphone/audio content, browser permissions and device settings can also affect behavior.

## Known Limitations / 既知の制約

- Base64 video embedding increases the HTML file size.
- Playback behavior depends on browser media support and device settings.
- The clip is a compact learning aid rather than a full notation editor or score player.

## Related Links / 関連リンク

- Live Site: https://neko3se.com/gosenfu/
- Source directory: https://github.com/Neko3SE/devsite/tree/main/gosenfu
- Neko3SE LAB: https://neko3se.com/

## License

See the repository root `LICENSE`.
