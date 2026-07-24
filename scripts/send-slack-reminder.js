#!/usr/bin/env node

const { readFileSync } = require('fs');
const { join } = require('path');

const WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
const IS_FOLLOWUP = process.env.REMINDER_TYPE === 'followup';

if (!WEBHOOK_URL) {
  console.error('Error: SLACK_WEBHOOK_URL environment variable is not set.');
  process.exit(1);
}

const config = JSON.parse(
  readFileSync(join(__dirname, '..', 'weekly-tasks.json'), 'utf-8')
);

const CATEGORY_EMOJI = {
  work: '💼',
  personal: '🏠',
  shopping: '🛒',
  health: '💪',
  other: '📌',
};

function buildTaskBlocks(tasks) {
  return tasks.map((task) => {
    const emoji = CATEGORY_EMOJI[task.category] || '📌';
    const noteText = task.note ? `\n> ${task.note}` : '';
    return {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `${emoji} *${task.title}*${noteText}`,
      },
    };
  });
}

function buildPayload(tasks) {
  const today = new Date().toLocaleDateString('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  const headerText = IS_FOLLOWUP
    ? '🔔 週次タスク — 再リマインド'
    : '📋 今週のタスク一覧';

  const introText = IS_FOLLOWUP
    ? `*${today}*\nまだ完了していないタスクがあれば、今週中に片付けましょう！`
    : `*${today}*\n今週もよろしくお願いします！以下のタスクを確認してください。`;

  return {
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: headerText, emoji: true },
      },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: introText },
      },
      { type: 'divider' },
      ...buildTaskBlocks(tasks),
      { type: 'divider' },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: '✅ 完了したタスクには :white_check_mark: でリアクションを！　📝 タスクを編集: <https://github.com/love2u2aya/claude-todoapp/blob/main/weekly-tasks.json|weekly-tasks.json>',
          },
        ],
      },
    ],
  };
}

async function sendReminder() {
  const payload = buildPayload(config.tasks);

  const res = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`Slack API error: ${res.status} ${body}`);
    process.exit(1);
  }

  const type = IS_FOLLOWUP ? '再リマインド' : '初回リマインド';
  console.log(`Slack ${type}を送信しました (${config.tasks.length}件のタスク)`);
}

sendReminder();
