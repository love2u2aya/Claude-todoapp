# Weekly Task Reminder

毎週のタスクを自動でリマインドするシステムです。

| 時間 | チャンネル | 内容 |
|------|-----------|------|
| 平日 9:00 AM (JST) | LINE | 朝のタスクリスト |
| 平日 6:00 PM (JST) | Slack | 夕方の進捗確認 |

月曜日は「今週のタスク」、火〜金は「まだ残っているタスク」として送信されます。

---

## セットアップ

### 1. タスクの編集

`tasks.yaml` を編集してタスクを追加・変更します。

```yaml
weekly_tasks:
  - title: "経費精算"
    emoji: "💰"
  - title: "週次レポート提出"
    emoji: "📊"
```

### 2. LINE Messaging API の設定

1. [LINE Developers Console](https://developers.line.biz/) でプロバイダーを作成
2. Messaging API チャンネルを作成
3. チャンネルアクセストークン（長期）を発行
4. 自分のユーザーIDを確認（BotにメッセージするとWebhookで取得できます）

### 3. Slack Webhook の設定

1. [Slack API](https://api.slack.com/apps) でアプリを作成
2. Incoming Webhooks を有効化
3. 通知先チャンネルを選択して Webhook URL を取得

### 4. GitHub Secrets の設定

GitHubリポジトリの Settings → Secrets and variables → Actions で以下を設定：

| Secret名 | 内容 |
|---------|------|
| `LINE_CHANNEL_ACCESS_TOKEN` | LINEのチャンネルアクセストークン |
| `LINE_USER_ID` | リマインドを受け取るLINEユーザーID |
| `SLACK_WEBHOOK_URL` | SlackのIncoming Webhook URL |

### 5. 動作確認

GitHub Actions の画面から `workflow_dispatch` で手動実行できます。
`dry_run` を有効にするとメッセージを送信せずプレビューのみ表示します。

---

## ファイル構成

```
.
├── tasks.yaml                          # タスク設定
├── scripts/
│   ├── send_line.py                    # LINE送信スクリプト
│   └── send_slack.py                   # Slack送信スクリプト
└── .github/workflows/
    ├── morning-reminder.yml            # 朝 9:00 LINE (月〜金)
    └── evening-reminder.yml            # 夕 18:00 Slack (月〜金)
```

## LINEユーザーIDの調べ方

Botに友だち追加した後、LINEからBotにメッセージを送ると、
Webhook URLに以下の形式でリクエストが来ます：

```json
{
  "source": {
    "userId": "Uxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  }
}
```

この `userId` を `LINE_USER_ID` に設定してください。
簡易的には [LINE API Test Tool](https://developers.line.biz/console/) でも確認できます。
