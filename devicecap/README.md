# DEVICE CAPABILITY LAB β

## 日本語

ブラウザから取得・利用できる端末能力を実機で調査する Neko3SE LAB の研究ツールです。

### 方針

- 端末名、OS、ブラウザ、画面、CPU、メモリ、GPU、Web APIを取得可能な範囲で表示します。
- カメラ、マイク、位置情報、モーション、通知、Bluetooth、USB、Serial、HID、MIDI、NFC、画面共有、WebXRなど、ユーザー操作や権限が必要な機能は個別TESTで確認します。
- APIの存在と実際の利用可否を区別します。
- ブラウザが公開していない情報を機種情報などから推測して補完しません。
- 位置情報テストでは精度だけを記録し、緯度・経度をレポートへ保存しません。
- カメラ・マイク・画面共有で取得したMediaStreamはテスト直後に停止します。

### 主な結果表現

`SUPPORTED` / `NOT SUPPORTED` / `NOT EXPOSED` / `PERMISSION DENIED` / `HARDWARE NOT FOUND` / `TEST PASSED` / `TEST FAILED` / `USER CANCELLED`

### ファイル

- `index.html` — UI / metadata / LAB NOTE
- `devicecap.css` — ページ専用スタイル
- `devicecap.js` — 自動診断、実機診断、レポート生成

### 注意

Web APIの対応状況や公開情報はOS・ブラウザ・バージョン・Secure Context・権限状態によって変わります。表示値は端末の物理仕様そのものではなく、その時点でブラウザから観測できた情報です。

---

## English

DEVICE CAPABILITY LAB β is a Neko3SE LAB research tool for examining the device capabilities that a web browser can observe and use on real hardware.

### Policy

- It displays device name, OS, browser, display, CPU, memory, GPU, and Web API information where the browser exposes those values.
- Features that require user interaction or permission—such as camera, microphone, geolocation, motion, notifications, Bluetooth, USB, Serial, HID, MIDI, NFC, screen capture, and WebXR—are checked with individual tests.
- API availability is distinguished from actual usability.
- Information that the browser does not expose is not inferred from device models or other indirect information.
- The geolocation test records accuracy only; latitude and longitude are not stored in the report.
- MediaStreams obtained for camera, microphone, and screen-capture tests are stopped immediately after each test.

### Main result states

`SUPPORTED` / `NOT SUPPORTED` / `NOT EXPOSED` / `PERMISSION DENIED` / `HARDWARE NOT FOUND` / `TEST PASSED` / `TEST FAILED` / `USER CANCELLED`

### Files

- `index.html` — UI / metadata / LAB NOTE
- `devicecap.css` — page-specific styles
- `devicecap.js` — automatic diagnostics, interactive hardware tests, and report generation

### Notes

Web API support and exposed information vary by OS, browser, browser version, Secure Context requirements, and permission state. The displayed values represent what the browser can observe at that moment; they are not necessarily the device's complete physical specifications.
