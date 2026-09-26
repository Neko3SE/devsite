# Neko3SE LAB — New Content Template

新規コンテンツを追加する際の開発用ひな型です。`_template/` 自体を公開コンテンツとしてサイトナビゲーションや `sitemap.xml` へ登録しません。

## 使い方

1. `_template/` を新しい slug 名のフォルダへコピーする。
2. `template.css` / `template.js` を必要に応じて `<slug>.css` / `<slug>.js` に改名し、`index.html` の参照も変更する。
3. `{{...}}` プレースホルダーをすべて置換する。
4. `data-n3-page="{{PAGE_ID}}"` と同じ `id` を `common/neko3se-site.js` の `pages` に追加し、適切な `navGroups` に登録する。
5. TOP、`sitemap.xml`、root `README.md`、`llms.txt` など、サイト全体の索引を更新する。
6. `og/og-generator.html` で 1200×630 のOGPを作成し、`/og_images/<slug>_img.png` として配置する。ベース画像は `og-base.js` を使い、中央タイトル2行と説明文だけを差し替える。必要に応じて各文字のX / Y座標とSIZEを調整できる。
7. `TEMPLATE_CHECKLIST.md` で公開前確認を行う。

## TITLE の規則

`<正式コンテンツ名> | Neko3SE LAB | <日本語の短い特徴説明>`

例:

`SOUND TUNER LAB β | Neko3SE LAB | 楽器も声も音として測るブラウザサウンド解析`

## URL / ファイル名の規則

- canonical: `https://neko3se.com/<slug>/`
- OGP: `https://neko3se.com/og_images/<slug>_img.png`
- Technical Documentation: 同じコンテンツフォルダの `README.md`
- Source Code: `https://github.com/Neko3SE/devsite/tree/main/<slug>`

## META / OG

`description`、OG、X Cardは同じ意味内容を共有できますが、SNS表示では短く読みやすい文に調整します。OG画像は 1200×630 px を標準とします。

## JSON-LD

ひな型は `WebApplication` を標準としています。記事中心なら `WebPage`、動画が主対象なら `VideoObject` など、実際のページ内容に合わせて変更してください。`author` は `https://neko3se.com/#neko3se`、`isPartOf` は `https://neko3se.com/#website` を維持します。

## 背景

標準では `common/neko3se-grid.css` と `body.n3-grid-page` を利用します。独自背景を採用する場合は `n3-grid-page` と共通グリッドCSS参照を外し、コンテンツ側CSSで背景を定義します。

## 日本語 / 英語

- 初期表示は日本語。
- 状態は保存しない。
- 日本語時のボタン表記は `English`。
- 英語時のボタン表記は `Japanese`。
- `html[lang]` も切り替える。
- `data-ja` / `data-en` は短い本文向け。
- LAB NOTEは既存共通CSSに合わせて `.n3-labnote-ja` / `.n3-labnote-en` を使う。

## LAB NOTE

標準セクション:

1. WHY
2. EXPERIMENT
3. FINDINGS
4. TECHNOLOGY
5. RELATED
6. MORE

`MORE` は原則として `TECHNICAL DOCUMENTATION` と `SOURCE CODE` の2カードを維持します。

## OGP Generator

`og/og-generator.html` をブラウザで開き、`TITLE LINE 1`、`TITLE LINE 2`、`DESCRIPTION`、`FILE NAME` を入力して `EXPORT PNG` を押します。ベース画像 `og-base.js` は固定で読み込まれ、中央の文字だけが差し替わります。必要に応じて `SHOW SAFE AREA` を使い、文字の安全領域を確認できます。各文字には `X` / `Y` / `SIZE` 入力欄があり、レイアウトと文字サイズを微調整できます。生成処理はブラウザ内だけで行います。

生成したPNGを `/og_images/<slug>_img.png` へ配置してください。
