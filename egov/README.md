# e-Gov 法令検索 Viewer β

Neko3SE LAB experimental browser content.

**Live Site / 実際に使う:** https://neko3se.com/egov/

## Overview / 概要

大量の法令情報を、法令名を知っている人だけでなく、「分野から探したい人」にも見つけやすくできないか。

**English**  
Can large collections of laws be made easier to explore for people who want to start from a subject area rather than a known law name?

## Features / 主な機能

- Original genre-based law navigation
- Separate law-name and content search
- Three-pane PC layout and smartphone navigation layout
- Search highlighting, error classification and retry handling
- Law data retrieval through the e-Gov Law API

## How It Works / 仕組み

法令本文を独自に保持せず、e-Gov法令APIから取得したデータをブラウザ上で表示・検索します。

**English**  
Law data is retrieved from the e-Gov Law API and presented and searched in the browser rather than maintained as a separate copy.

## Technology / 使用技術

HTML5, CSS, JAVASCRIPT, E-GOV LAW API, FETCH API, RESPONSIVE UI

## Environment / 動作環境

ブラウザ上で動作するコンテンツです。PC・Android・iPhoneを含む実機検証を行っていますが、端末・OS・ブラウザの組み合わせすべてを保証するものではありません。マイクや音声を利用するコンテンツでは、ブラウザ権限や端末設定も動作に影響します。

**English**  
This content runs in a web browser and has been tested on real devices including PC, Android and iPhone environments. This does not guarantee every device, OS and browser combination. For microphone/audio content, browser permissions and device settings can also affect behavior.

## Known Limitations / 既知の制約

- This is an unofficial viewing aid and does not replace the official e-Gov service.
- Availability and response behavior depend on the e-Gov Law API and network environment.
- Very long laws can require substantial rendering and search work in the browser.

## Related Links / 関連リンク

- Live Site: https://neko3se.com/egov/
- Source directory: https://github.com/Neko3SE/devsite/tree/main/egov
- Neko3SE LAB: https://neko3se.com/

## License

See the repository root `LICENSE`.
