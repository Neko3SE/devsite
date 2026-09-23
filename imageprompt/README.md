# PRO IMAGE PROMPT LAB

Neko3SE LAB experimental browser content.

**Live Site / 実際に使う:** https://neko3se.com/imageprompt/

## Overview / 概要

画像生成AIへ意図を伝えるとき、被写体だけでなく、構図、光、質感、雰囲気などをどのように整理して指示すればよいのか。

**English**  
How should subject, composition, light, texture and mood be organized when communicating an image concept to a generative model?

## Features / 主な機能

- Prompt-design template and explanation
- Breakdown of subject, composition, light, texture and mood
- Sample prompt and generated-image example
- Generated example image stored as an external Base64 text asset and loaded in the page

## How It Works / 仕組み

生成画像はバイナリファイルとして配置せず、Base64データを外部テキストファイルとして保持し、JavaScriptで読み込んで表示しています。プロンプト設計の解説と作例は同じページで確認できます。

**English**  
The generated image is stored as an external Base64 text asset rather than a binary file and loaded with JavaScript, while the prompt-design explanation and example remain together on the same page.

## Technology / 使用技術

HTML5, CSS, JAVASCRIPT, BASE64 TEXT ASSET, RESPONSIVE DESIGN

## Environment / 動作環境

ブラウザ上で動作するコンテンツです。PC・Android・iPhoneを含む実機検証を行っていますが、端末・OS・ブラウザの組み合わせすべてを保証するものではありません。マイクや音声を利用するコンテンツでは、ブラウザ権限や端末設定も動作に影響します。

**English**  
This content runs in a web browser and has been tested on real devices including PC, Android and iPhone environments. This does not guarantee every device, OS and browser combination. For microphone/audio content, browser permissions and device settings can also affect behavior.

## Known Limitations / 既知の制約

- Generated results vary by model, version and generation conditions.
- The page explains prompt design; it does not run an image-generation model in the browser.
- The example image is kept as a large Base64 text asset, so the repository still contains a large text file even though the HTML itself stays lightweight.

## Related Links / 関連リンク

- Live Site: https://neko3se.com/imageprompt/
- Source directory: https://github.com/Neko3SE/devsite/tree/main/imageprompt
- Neko3SE LAB: https://neko3se.com/

## License

See the repository root `LICENSE`.
