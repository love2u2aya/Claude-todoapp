# LINE Weekly Reminder – セットアップ手順

## 全体の流れ

```
LINE Developers でチャンネル作成
       ↓
Railway（or Render）にデプロイ
       ↓
Webhook URL を LINE に登録
       ↓
LINEに話しかけて USER_ID を取得
       ↓
完成
```

---

## 1. LINE Messaging API チャンネルの作成

1. [LINE Developers](https://developers.line.biz/) にログイン
2. 「プロバイダー」を作成（個人名でOK）
3. 「Messaging API」チャンネルを作成
4. 「チャンネルシークレット」と「チャンネルアクセストークン（長期）」をメモ

---

## 2. Railway へのデプロイ（無料）

```bash
# Railway CLI をインストール
npm install -g @railway/cli

# ログイン
railway login

# プロジェクト作成・デプロイ
cd line_reminder
railway init
railway up
```

環境変数を Railway のダッシュボードで設定：

| 変数名 | 値 |
|---|---|
| `LINE_CHANNEL_ACCESS_TOKEN` | チャンネルアクセストークン |
| `LINE_CHANNEL_SECRET` | チャンネルシークレット |
| `LINE_USER_IDS` | （後で設定） |
| `RE_REMIND_HOURS` | `12` |
| `REMIND_DOW` | `mon` |
| `REMIND_HOUR` | `9` |

---

## 3. Webhook URL の登録

Railway のダッシュボードからアプリのURLを確認（例: `https://your-app.up.railway.app`）

LINE Developers の「Messaging API設定」で：
- Webhook URL: `https://your-app.up.railway.app/webhook`
- 「Webhookの利用」を ON に変更

---

## 4. ユーザーIDの取得

1. LINEアプリでBotを友達追加（QRコードはLINE Developersで確認）
2. Botに何かメッセージを送る（例：「こんにちは」）
3. Railway のログに `user_id: Uxxxxxxxxx...` と表示される

そのIDを `LINE_USER_IDS` 環境変数に設定してサービスを再起動。

---

## 5. タスクのカスタマイズ

`tasks.json` を編集してタスクを変更：

```json
{
  "tasks": [
    {"id": "expense",  "name": "経費精算"},
    {"id": "report",   "name": "週次レポート作成"},
    {"id": "email",    "name": "未返信メールの確認"},
    {"id": "backlog",  "name": "バックログ整理"}
  ]
}
```

編集後、`git push` → Railway が自動デプロイ。

---

## 動作仕様

| タイミング | 動作 |
|---|---|
| 毎週月曜 09:00 | タスクリストをLINEに送信（クイックリプライボタン付き） |
| 12時間後（未完了があれば） | 「🔔 再リマインド」を送信 |
| さらに12時間後（未完了があれば） | 再々リマインド（完了するまで繰り返し） |
| ボタンをタップ | そのタスクを完了マーク、残タスクを通知 |
| 「🎉 すべて完了」タップ | 全タスク完了、リマインド停止 |

---

## LINEでのメッセージ例

初回リマインド：
```
📋 今週のタスク（2026-W17）

　☐ 経費精算
　☐ 週次レポート作成
　☐ 未返信メールの確認
　☐ バックログ整理

完了したタスクをタップして記録してください。
[✅ 経費精算] [✅ 週次レポート作成] ... [🎉 すべて完了]
```

再リマインド：
```
🔔 再リマインド（2026-W17）

　☐ 週次レポート作成
　☐ バックログ整理

完了したタスクをタップして記録してください。
```
