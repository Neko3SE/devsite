# VOICE CHANGER LAB β — Phase 2 Rev.3

Phase 2 Rev.2の実機確認で、録音・Whole Analysis・ORIGINAL再生・再生中Realtime数値表示が正常動作。
Rev.3では承認されたPermission UX改善を追加しました。

## Rev.3追加
- 起動時に Permissions API が利用可能なら microphone permission を照会。
- `granted`:
  - マイクを自動起動しない。
  - Large `ENABLE MICROPHONE` Panelを非表示。
  - `MICROPHONE ● READY` を表示。
- `prompt`:
  - `ENABLE MICROPHONE` Panelを表示。
  - ユーザー操作時だけ `getUserMedia()` を実行。
- `denied`:
  - `ACCESS DENIED` と復旧案内を表示。
- Permissions API非対応・照会不能:
  - エラー扱いにせず従来の `ENABLE MICROPHONE` フローへフォールバック。
- PermissionStatus の `change` を監視可能なブラウザでは、設定変更にUIを追従。
- 起動時 `granted` は「ブラウザPermissionが許可済み」という意味。
  実際のマイク利用可否は RECORD時の `getUserMedia()` で再検証し、失敗時はPermission Panelへ復帰。

## Rev.3 実機確認ポイント
1. マイク許可済み状態でページReload → `ENABLE MICROPHONE` Panelが消え、`MICROPHONE ● READY` になる。
2. Reloadだけではマイク使用中表示にならない。
3. RECORD押下時にマイクが実際に取得され `MICROPHONE ● ACTIVE` になる。
4. Permission未決定では従来どおり `ENABLE MICROPHONE` が表示される。
5. Permission拒否状態では `ACCESS DENIED` が表示される。
6. Permissions APIが利用できない環境でも従来フローで操作可能。
