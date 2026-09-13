# VOICE CHANGER LAB β — Phase 2 Rev.2

Phase 2 Rev.1のPC実機確認で、Whole Analysisは正常表示された一方、
PLAY ORIGINAL中はWaveform/Spectrumのみ更新され、ANALYZERの数値が更新されないことを受けた修正版です。

## Rev.2修正
- 録音時と再生時でRealtime数値解析ロジックを共通化。
- `analyzeRealtimeFrame()` を analyzer.js に追加。
- player.js から同じRealtime解析関数を使用。
- PLAY ORIGINAL中も以下を約10Hzで更新:
  - PITCH / F0
  - NOTE
  - LEVEL / RMS dBFS
  - PEAK dBFS
  - CENTROID
- Waveform / Spectrumは従来どおりCanvasで継続更新。
- 再生STOP/自然終了後は瞬間値を `---` に戻し、`ANALYSIS READY` に復帰。
- Whole Analysis、録音、Permission、ORIGINAL保護のRev.1正常動作は維持。

## Phase 2 Rev.2 実機確認ポイント
1. 録音中にPITCH / NOTE / LEVEL / PEAK / CENTROIDが更新される。
2. 録音終了後、ORIGINAL ANALYSISの全項目が表示される。
3. PLAY ORIGINAL中にWaveform/Spectrumが動く。
4. PLAY ORIGINAL中にPITCH / NOTE / LEVEL / PEAK / CENTROIDも更新される。
5. 無音・Pitch推定不能区間ではPITCH/NOTEが `---` になる。
6. STOPまたは自然終了後、Realtime数値が `---` に戻る。
