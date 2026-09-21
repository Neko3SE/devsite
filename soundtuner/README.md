# SOUND TUNER LAB β

Browser-based sound tuner and audio analysis experiment for instruments and vocals.

**Live Site / 実際に使う:** https://neko3se.com/soundtuner/

## Overview

SOUND TUNER LAB β は、スマートフォンやPCのマイク入力を利用し、楽器や人の声を「音」として測定・可視化するブラウザ実験ツールです。専用アプリやサーバー側の音声処理を使わず、主要な解析をブラウザ内で実行します。

**English**

SOUND TUNER LAB β is a browser experiment that measures and visualizes instruments and human voices as sound through microphone input. Its main analysis runs locally in the browser without a dedicated app or server-side audio processing.

## Features

- Instrument tuner with note, frequency and cent difference
- VOCAL mode with pitch history, average pitch, pitch range, pitch variation and vibrato observation
- START / STOP analysis controls
- HOLD / RELEASE for retaining the current analysis view
- Adjustable A4 reference frequency (415–466 Hz, including presets)
- Sharp / flat accidental display selection
- Configurable in-tune tolerance
- Reference TONE playback
- Live microphone RMS / peak input display
- Input diagnostics
- Frequency spectrum and Spectral Centroid
- Live waveform
- Harmonics H1–H8 relative to H1
- VOCAL measurement stops after about one second of silence or at a maximum of 30 seconds, while retaining the latest result
- Japanese / English UI

## How It Works

ブラウザの `MediaDevices` からマイク入力を取得し、Web Audio APIを利用して入力レベル、ピッチ、周波数スペクトル、波形、倍音などを解析します。基準周波数A4は変更可能で、チューナー表示と基準音へ反映されます。

基準音の再生中はマイク入力を一時的に解放し、基準音停止後にマイクを再取得して計測へ復帰します。これは実機検証で確認した音声入出力の競合に対応するための実装です。

**English**

Microphone input is acquired through `MediaDevices`, and the Web Audio API is used to analyze input level, pitch, frequency spectrum, waveform and harmonics. The A4 reference frequency is adjustable and is reflected in tuner calculations and reference-tone playback.

During reference-tone playback, microphone input is temporarily released. After the tone stops, the microphone is reacquired and measurement resumes. This behavior addresses an audio input/output conflict observed during real-device testing.

## Technology

- HTML5
- CSS
- JavaScript (ES modules)
- Web Audio API
- MediaDevices / microphone input
- Canvas for waveform, spectrum and pitch-history visualization
- Responsive Web Design

## Environment

実機検証はPC、Android、iPhone環境で実施しています。ブラウザのマイク利用にはユーザーによる許可と、安全なコンテキスト（HTTPS）が必要です。

**English**

Real-device testing has been performed on PC, Android and iPhone environments. Microphone access requires user permission and a secure browser context (HTTPS).

## Known Limitations

- 測定結果は端末、マイク、OS、ブラウザ、周辺環境の影響を受けます。
- 内蔵マイクや端末側の音声処理により、楽器音、低音・高音、持続音などが抑制される場合があります。
- Noise Suppression、Echo Cancellation、Automatic Gain Control等をブラウザ側から完全に制御できない場合があります。
- Web Audio API / MediaDevicesの挙動には環境差があります。
- 本ツールは実験的なブラウザコンテンツであり、精密測定機器の代替を目的としていません。

**English**

- Results depend on the device, microphone, OS, browser and surrounding environment.
- Built-in microphones or device audio processing may suppress instrument sounds, low/high frequencies or sustained tones.
- Noise suppression, echo cancellation, automatic gain control and similar processing cannot always be fully controlled from the browser.
- Web Audio API and MediaDevices behavior can vary between environments.
- This is an experimental browser tool and is not intended to replace precision measurement equipment.

## Related Links

- Live Site: https://neko3se.com/soundtuner/
- Neko3SE LAB: https://neko3se.com/
- About Neko3SE: https://neko3se.com/about/
- Source Code: https://github.com/Neko3SE/devsite/tree/main/soundtuner

## License

See the repository root `LICENSE` / `LICENSE.txt` for licensing information.
