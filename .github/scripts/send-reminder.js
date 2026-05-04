#!/usr/bin/env node
'use strict';

const fs = require('fs');
const https = require('https');
const url = require('url');

const webhookUrl = process.env.SLACK_WEBHOOK_URL;
if (!webhookUrl) {
  console.error('SLACK_WEBHOOK_URL が設定されていません');
  process.exit(1);
}

const day = process.argv[2]; // '1' = 月曜, '4' = 木曜
const isFollowUp = day === '4';

const { tasks } = JSON.parse(fs.readFileSync('.github/weekly-tasks.json', 'utf8'));

const categoryEmoji = {
  work: '💼',
  personal: '👤',
  shopping: '🛒',
  health: '💪',
  other: '📌',
};

const taskBlocks = tasks.map((task) => ({
  type: 'section',
  text: {
    type: 'mrkdwn',
    text: `${categoryEmoji[task.category] || '📌'} ${task.title}`,
  },
}));

const headerText = isFollowUp
  ? '🔔 週の折り返しリマインド'
  : '📋 今週のタスクリマインド';

const descText = isFollowUp
  ? '週の半分が過ぎました。月曜のタスク、進んでいますか？残りの日数で完了させましょう！'
  : '今週もお疲れさまです。以下の定期タスクを忘れずに取り組みましょう！';

const payload = {
  blocks: [
    {
      type: 'header',
      text: { type: 'plain_text', text: headerText, emoji: true },
    },
    {
      type: 'section',
      text: { type: 'mrkdwn', text: descText },
    },
    { type: 'divider' },
    ...taskBlocks,
    { type: 'divider' },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `タスク一覧は <https://github.com/love2u2aya/claude-todoapp/blob/main/.github/weekly-tasks.json|weekly-tasks.json> で編集できます`,
        },
      ],
    },
  ],
};

const parsedUrl = url.parse(webhookUrl);
const data = JSON.stringify(payload);

const options = {
  hostname: parsedUrl.hostname,
  path: parsedUrl.path,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
  },
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => (body += chunk));
  res.on('end', () => {
    if (res.statusCode !== 200) {
      console.error(`Slack API エラー: ${res.statusCode} ${body}`);
      process.exit(1);
    }
    console.log('Slack にリマインドを送信しました');
  });
});

req.on('error', (e) => {
  console.error(`送信エラー: ${e.message}`);
  process.exit(1);
});

req.write(data);
req.end();
