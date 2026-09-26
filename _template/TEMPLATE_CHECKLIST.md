# Neko3SE LAB — New Content Release Checklist

## 1. File / URL

- [ ] slug は小文字・短く・恒久利用できる名前
- [ ] 公開URLは `https://neko3se.com/<slug>/`
- [ ] `index.html` / 専用CSS / 専用JS / `README.md` を整理
- [ ] 不要なバイナリをRepositoryへ追加していない
- [ ] 大きな画像・動画を置く場合は既存のBase64管理方針と整合

## 2. HEAD / META

- [ ] `{{...}}` が1件も残っていない
- [ ] TITLE規則: `正式名 | Neko3SE LAB | 日本語の特徴説明`
- [ ] meta description
- [ ] canonical
- [ ] copyright
- [ ] viewport / color-scheme / theme-color
- [ ] Google tag `G-QRJ1BC3PVM`
- [ ] favicon SVG / ICO / Apple Touch Icon

## 3. Open Graph / X

- [ ] og:title
- [ ] og:description
- [ ] og:type
- [ ] og:url
- [ ] og:site_name
- [ ] og:locale / alternate
- [ ] og:image = `/og_images/<slug>_img.png`
- [ ] og:image width 1200 / height 630
- [ ] og:image:alt
- [ ] twitter:card = `summary_large_image`
- [ ] twitter:title / description / image / image:alt
- [ ] OGP画像を `og/og-generator.html` で実際に生成・配置

## 4. Structured Data

- [ ] JSON-LD `@type` が内容に適切
- [ ] `@id` / `url` がcanonicalと一致
- [ ] `name` / `description` がページ内容と一致
- [ ] author = `https://neko3se.com/#neko3se`
- [ ] isPartOf = `https://neko3se.com/#website`

## 5. Shared UI

- [ ] `common/neko3se-site.css` を参照
- [ ] 標準背景なら `common/neko3se-grid.css` + `n3-grid-page`
- [ ] `<header id="n3-site-header">`
- [ ] `<footer id="n3-site-footer">`
- [ ] `common/neko3se-site.js` を参照
- [ ] `data-n3-root=".."`
- [ ] `common/neko3se-site.js` の `pages` / `navGroups` に新ページを追加
- [ ] ヘッダーのページ名とメニュー表示を確認

## 6. Japanese / English

- [ ] 初期表示は日本語
- [ ] 状態保存なし
- [ ] 日本語時 `English` / 英語時 `Japanese`
- [ ] `<html lang>` が切り替わる
- [ ] 日本語・英語で意味の不一致がない
- [ ] LAB NOTEも両言語で切り替わる

## 7. LAB NOTE

- [ ] LAB NOTE / EXPERIMENT THEME
- [ ] 01 / WHY
- [ ] 02 / EXPERIMENT
- [ ] 03 / FINDINGS
- [ ] 04 / TECHNOLOGY
- [ ] 05 / RELATED
- [ ] 06 / MORE
- [ ] TECHNOLOGYタグが実装内容と一致
- [ ] RELATEDのリンク先が実在
- [ ] TECHNICAL DOCUMENTATION = 同一フォルダ `README.md`
- [ ] SOURCE CODE = 対象GitHubフォルダ

## 8. Site-wide Indexes

- [ ] TOPへ追加
- [ ] `common/neko3se-site.js` へ追加
- [ ] `sitemap.xml` へ追加
- [ ] root `README.md` へ追加
- [ ] `llms.txt` へ追加・必要箇所更新
- [ ] 404旧URL転送が必要なら追加
- [ ] RELATED候補となる既存ページ側も必要に応じ更新

## 9. Validation / Device Test

- [ ] HTML構造
- [ ] CSS / JS構文
- [ ] console errorなし
- [ ] canonical / OG / JSON-LD URL確認
- [ ] 内部リンク切れなし
- [ ] PC
- [ ] Android
- [ ] iPhone
- [ ] 縦画面 / 横画面が重要なUIは両方確認
- [ ] 日本語 / 英語双方を確認
