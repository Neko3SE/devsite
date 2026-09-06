# Neko3SE LAB

**AI / WEB / IDEA / PLAY**

生成AIを活用したコンテンツと、IT関連の小ネタ・実験・制作物を公開する個人ラボです。  
A personal lab for generative AI content, IT experiments, creative ideas, and browser-based projects.

🌐 **Neko3SE LAB on GitHub**  
https://neko3se.github.io/devsite/

---

## About / このサイトについて

**Neko3SE LAB** は、生成AIを活用して企画・制作した技術系コンテンツや、ブラウザで遊べる実験作品を公開する個人ラボです。  

**Neko3SE LAB** is a personal lab showcasing technical content and browser-based experiments planned and created with the help of generative AI.

実用的なツールから、技術実験、音楽、遊び心のあるコンテンツまで、  
**「アイデアを実際に動く形にしてみる」**ことを楽しみながら制作しています。

From practical tools to technical experiments, music, and playful projects,  
the lab explores how ideas can be turned into things that actually work.

---

## Contents / コンテンツ

### Development / 開発・企画

#### AI駆動型非生産的Web技術研究所。 ― 無駄技研。
#### AI-Driven Non-Productive Web Technology Laboratory — Muda Giken

> くだらないことに、実装密度だけは本番級。  
> Serious implementation for gloriously unnecessary ideas.

IT・企業文化を題材にした、ブラウザで遊べる実験コンテンツです。  
A collection of browser-based experimental mini-games inspired by IT work and corporate culture.

- 10種類のミニゲームを収録  
  Includes 10 mini-games
- 日本語を含む8言語に対応  
  Supports 8 languages including Japanese
- PC / Android / iPhoneでの利用を想定  
  Designed for PC, Android, and iPhone
- HTML / CSS / JavaScriptで構成  
  Built with HTML, CSS, and JavaScript
- 外部API・外部ライブラリを使用せず動作  
  Runs without external APIs or libraries

▶ [無駄技研。を開く / Open Muda Giken](https://neko3se.github.io/devsite/mudagiken.html)

---

#### PROMPT GENERATOR

> 構造化プロンプトを、もっと簡単に。  
> Structured prompts, made simple.

生成AIを使い始めた人でも、質問に答える感覚でMarkdown形式の構造化プロンプトを作成できるブラウザツールです。  
A browser-based tool that helps users create structured Markdown prompts by filling in guided fields.

- 日本語 / English 切替  
  Japanese / English interface
- 簡易 / 高度モード  
  Simple / Advanced input modes
- 文章作成、調査・分析、アイデア、学習・解説、プログラム、画像生成などの用途別入力  
  Guided input for writing, research, ideas, learning, programming, image generation, and more
- Markdown形式のプロンプトを自動生成  
  Generates structured prompts in Markdown
- ローカルファイルをBase64（Data URL）として添付可能  
  Local files can be embedded as Base64 Data URLs
- 添付する元ファイルは複数合計3MBまで  
  Combined original file size is limited to 3 MB
- 入力内容や添付ファイルはブラウザ内で処理  
  Inputs and attached files are processed locally in the browser
- クリップボードへのコピー / Markdownファイル保存  
  Copy to clipboard / save as a Markdown file

▶ [PROMPT GENERATORを開く / Open PROMPT GENERATOR](https://neko3se.github.io/devsite/prompt_generator.html)

---

### Entertainment / エンターテイメント

#### PIANO EMULATOR

ブラウザ上で2オクターブの鍵盤を演奏できるピアノ・エミュレータです。  
A browser-based piano emulator with a two-octave keyboard.

- 画面上の鍵盤をクリックして演奏  
  Play using the on-screen keyboard
- 音階をテキスト入力して自動演奏  
  Enter note sequences as text for automatic playback
- カタカナ / コード入力に対応  
  Supports Katakana and note-code input
- `R` による休符入力  
  Use `R` to insert rests
- BPM・音量調整  
  Adjustable BPM and volume
- 日本語 / English 切替  
  Japanese / English interface
- スマートフォンでは横向き演奏を案内  
  Landscape orientation guidance for smartphones

▶ [PIANO EMULATORを開く / Open PIANO EMULATOR](https://neko3se.github.io/devsite/piano_emulator.html)

---

#### 五線譜ドレミclip
#### Do-Re-Mi Staff Notation Clip

> 五線譜の音符と音階吹鳴を完全同期♪  
> Musical notes and scale tones synchronized together.

五線譜上のドレミファソラシドと、それぞれの音を同期させた音楽クリップです。  
A music clip that synchronizes the notes Do-Re-Mi-Fa-Sol-La-Ti-Do on a staff with their corresponding tones.

▶ [五線譜ドレミclipを開く / Open the Do-Re-Mi Clip](https://neko3se.github.io/devsite/gosenfu_doremi.html)

---

## Coming Soon / 今後の予定

今後、以下のコンテンツを追加予定です。  
More content is planned, including:

- 開発・企画ノウハウ  
  Development and planning know-how
- 生成AI画像  
  Generative AI visual works
- 生成AI画像ノウハウ  
  Generative AI image creation tips

---

## Main Repository Structure / 主なリポジトリ構成

```text
devsite/
├─ index.html               # Neko3SE LAB top page
├─ index.css                # Top page styles
│
├─ prompt_generator.html    # Prompt Generator
├─ piano_emulator.html      # Piano Emulator
├─ gosenfu_doremi.html      # Do-Re-Mi staff notation clip
│
├─ mudagiken.html           # Muda Giken main page
├─ mudagiken.css            # Muda Giken common styles
├─ mudagiken_common.js      # Muda Giken common scripts
├─ games/                   # Muda Giken mini-games
├─ i18n/                    # Muda Giken language files
│
├─ og_images/               # Open Graph / social preview images
├─ LICENSE
├─ LICENSE.txt
└─ README.md
```

---

## Usage / 利用方法

公開版はGitHub Pagesから、そのままブラウザで利用できます。  
The published version can be used directly in a web browser through GitHub Pages.

**Neko3SE LAB**  
https://neko3se.github.io/devsite/

ソースコードを確認する場合は、このリポジトリ内のHTML / CSS / JavaScriptファイルを参照してください。  
To inspect the source code, see the HTML, CSS, and JavaScript files in this repository.

---

## Concept / コンセプト

Neko3SE LABでは、生成AIを単なる回答ツールとしてではなく、  
**アイデアを考え、試し、実際に動く形へ変えるための制作ツール**として活用しています。

At Neko3SE LAB, generative AI is used not simply as a question-answering tool, but as a  
**creative tool for exploring ideas, experimenting, and turning concepts into working creations.**

完成度を追求するものもあれば、技術的な実験や、あえて無駄なものを本気で作ることもあります。  
Some projects aim for practicality and polish, while others exist purely for experimentation, curiosity, and fun.

**AI / WEB / IDEA / PLAY**

この4つを軸に、気になったものを自由に制作・公開していきます。  
These four themes form the core of Neko3SE LAB.

---

## License / ライセンス

This project is licensed under the **Apache License 2.0**.  
本プロジェクトは **Apache License 2.0** のもとで公開しています。

詳細は [LICENSE](./LICENSE) または [LICENSE.txt](./LICENSE.txt) を参照してください。  
See [LICENSE](./LICENSE) or [LICENSE.txt](./LICENSE.txt) for details.

---

on GitHub ©2026 Neko3SE.
