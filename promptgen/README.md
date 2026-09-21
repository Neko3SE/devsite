# PROMPT GENERATOR

Neko3SE LAB experimental browser content.

**Live Site / 実際に使う:** https://www.neko3se.com/promptgen/

## Overview / 概要

生成AIへの指示を長い文章としてゼロから書くのではなく、目的・条件・制約などの要素に分けて入力すれば、より整理された再利用可能なプロンプトを作れるのではないか。

**English**  
Can reusable prompts be made easier to build by separating goals, conditions and constraints instead of writing a long instruction from scratch?

## Features / 主な機能

- Simple and advanced input modes
- Markdown prompt generation
- Copy and Markdown file save
- Multiple local file attachments as Base64 Data URLs
- Combined source-file limit: 3 MB
- Japanese / English UI

## How It Works / 仕組み

入力・ファイル変換・Markdown生成・コピー・保存はブラウザ内で処理します。

**English**  
Input handling, file conversion, Markdown generation, copying and saving are processed in the browser.

## Technology / 使用技術

HTML5, CSS, JAVASCRIPT, FILE API, BASE64, DATA URL, CLIPBOARD API

## Environment / 動作環境

ブラウザ上で動作するコンテンツです。PC・Android・iPhoneを含む実機検証を行っていますが、端末・OS・ブラウザの組み合わせすべてを保証するものではありません。マイクや音声を利用するコンテンツでは、ブラウザ権限や端末設定も動作に影響します。

**English**  
This content runs in a web browser and has been tested on real devices including PC, Android and iPhone environments. This does not guarantee every device, OS and browser combination. For microphone/audio content, browser permissions and device settings can also affect behavior.

## Known Limitations / 既知の制約

- Attached source files are limited to a combined 3 MB.
- Base64/Data URL embedding increases prompt size substantially.
- Whether an external generative-AI service can interpret an embedded file depends on that service and file format.

## Related Links / 関連リンク

- Live Site: https://www.neko3se.com/promptgen/
- Source directory: https://github.com/Neko3SE/devsite/tree/main/promptgen
- Neko3SE LAB: https://www.neko3se.com/

## License

See the repository root `LICENSE`.
