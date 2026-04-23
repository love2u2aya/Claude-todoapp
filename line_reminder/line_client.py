"""
LINE Messaging API wrapper – sending reminders and handling replies.
"""
import os
from linebot.v3 import WebhookHandler
from linebot.v3.messaging import (
    ApiClient,
    Configuration,
    MessagingApi,
    PushMessageRequest,
    TextMessage,
    QuickReply,
    QuickReplyItem,
    MessageAction,
)

_config = Configuration(access_token=os.environ["LINE_CHANNEL_ACCESS_TOKEN"])
handler = WebhookHandler(os.environ["LINE_CHANNEL_SECRET"])


def _api() -> MessagingApi:
    return MessagingApi(ApiClient(_config))


# ── Message builders ──────────────────────────────────────────────────────────

def _task_quick_replies(tasks: list[dict]) -> QuickReply:
    items = [
        QuickReplyItem(action=MessageAction(label=f"✅ {t['name']}", text=f"done:{t['id']}"))
        for t in tasks
    ]
    items.append(
        QuickReplyItem(action=MessageAction(label="🎉 すべて完了", text="done:all"))
    )
    return QuickReply(items=items)


def send_reminder(user_id: str, tasks: list[dict], week_key: str, is_re_remind: bool = False):
    """Push a reminder message to user_id with quick-reply buttons for each task."""
    header = "🔔 再リマインド" if is_re_remind else "📋 今週のタスク"
    task_lines = "\n".join(f"　☐ {t['name']}" for t in tasks)
    body = (
        f"{header}（{week_key}）\n\n"
        f"{task_lines}\n\n"
        "完了したタスクをタップして記録してください。"
    )
    msg = TextMessage(text=body, quick_reply=_task_quick_replies(tasks))
    _api().push_message(PushMessageRequest(to=user_id, messages=[msg]))


def send_text(user_id: str, text: str):
    _api().push_message(PushMessageRequest(to=user_id, messages=[TextMessage(text=text)]))
