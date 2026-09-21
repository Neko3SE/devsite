# PIANO EMULATOR

Neko3SE LAB experimental browser content.

**Live Site / 実際に使う:** https://neko3se.com/pianoemu/

## Overview / 概要

ブラウザ上の鍵盤を直接弾くだけでなく、音階を文字列として記述して再生する仕組みを組み合わせると、どのような音楽インターフェースになるのか。

**English**  
What kind of musical interface emerges when a playable browser keyboard is combined with text-described note playback?

## Features / 主な機能

- Two-octave browser keyboard
- Click/tap performance
- Text playback using code notation and Japanese note input
- Rest notation: R
- Playback key highlighting
- BPM and volume controls
- Japanese / English UI

## How It Works / 仕組み

Web Audio APIによる音生成と、鍵盤・テキスト入力・再生表示をブラウザ内で連動させています。

**English**  
Web Audio sound generation is coordinated with keyboard interaction, text input and playback visualization in the browser.

## Technology / 使用技術

HTML5, CSS, JAVASCRIPT, WEB AUDIO API, TOUCH INTERACTION, RESPONSIVE DESIGN

## Environment / 動作環境

ブラウザ上で動作するコンテンツです。PC・Android・iPhoneを含む実機検証を行っていますが、端末・OS・ブラウザの組み合わせすべてを保証するものではありません。マイクや音声を利用するコンテンツでは、ブラウザ権限や端末設定も動作に影響します。

**English**  
This content runs in a web browser and has been tested on real devices including PC, Android and iPhone environments. This does not guarantee every device, OS and browser combination. For microphone/audio content, browser permissions and device settings can also affect behavior.

## Known Limitations / 既知の制約

- Audio behavior can vary by browser and device audio settings.
- Landscape orientation is recommended on small smartphone screens.
- This is a browser instrument experiment, not a precision musical-instrument emulation.

## Related Links / 関連リンク

- Live Site: https://neko3se.com/pianoemu/
- Source directory: https://github.com/Neko3SE/devsite/tree/main/pianoemu
- Neko3SE LAB: https://neko3se.com/

## License

See the repository root `LICENSE`.
