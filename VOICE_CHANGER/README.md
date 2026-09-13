# VOICE CHANGER LAB β — Phase 2 Rev.1

Phase 2実機確認で「録音・再生・再生時Waveformは正常、Whole Analysis値が表示されない」ことを受けた修正版です。

## Rev.1修正
- Whole Analysisを `worker/analysis-worker.js` に分離。
- `analysis-engine.js` を追加し、Worker要求・応答を管理。
- ORIGINALはデコード/検証成功時点で先に確定し、Whole Analysis失敗から独立。
- ORIGINALをWorkerへ直接Transferせず、コピーをTransferして原本を保護。
- `ANALYZING...` → 実解析進捗 → `ANALYSIS READY` を表示。
- Whole Analysisで DURATION / PITCH AVG / PITCH RANGE / NOTE / RMS AVG / PEAK / VOICED FRAMES を表示。
- Pitch解析に失敗しても、DURATION / RMS AVG / PEAKを表示する安全フォールバックを追加。
- Pitch取得不能時は0ではなく `---`。
- 録音・Permission・ORIGINAL再生の既存正常経路は維持。

## 実機確認ポイント
1. STOP後に `ANALYZING...` が表示される。
2. 解析完了後 `ANALYSIS READY` になる。
3. DURATION / RMS AVG / PEAK が必ず表示される。
4. 通常の発声では PITCH AVG / RANGE / NOTE / VOICED FRAMES が表示される。
5. 無音やPitch推定不能時はPitch系が `---` でも、基本測定値は表示される。
6. PLAY ORIGINALは従来どおり再生でき、再生中Waveform/Spectrumが動く。
