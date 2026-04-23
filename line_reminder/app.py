"""
Flask app: LINE webhook endpoint + startup initialization.
"""
import os
from flask import Flask, abort, request
from linebot.v3.exceptions import InvalidSignatureError
from linebot.v3.webhooks import MessageEvent, TextMessageContent

import task_store
import line_client
from scheduler import start_scheduler

app = Flask(__name__)


@app.route("/webhook", methods=["POST"])
def webhook():
    signature = request.headers.get("X-Line-Signature", "")
    body = request.get_data(as_text=True)
    try:
        line_client.handler.handle(body, signature)
    except InvalidSignatureError:
        abort(400)
    return "OK"


@line_client.handler.add(MessageEvent, message=TextMessageContent)
def handle_message(event: MessageEvent):
    user_id = event.source.user_id
    text = event.message.text.strip()
    week_key = task_store.current_week_key()

    if text == "done:all":
        for t in task_store.get_all_tasks():
            task_store.mark_complete(t["id"], week_key)
        line_client.send_text(user_id, "🎉 今週のタスクをすべて完了しました！お疲れ様でした！")
        return

    if text.startswith("done:"):
        task_id = text.removeprefix("done:")
        task_store.mark_complete(task_id, week_key)
        remaining = task_store.get_incomplete_tasks(week_key)
        if not remaining:
            line_client.send_text(user_id, "🎉 今週のタスクをすべて完了しました！お疲れ様でした！")
        else:
            names = "、".join(t["name"] for t in remaining)
            line_client.send_text(user_id, f"✅ 完了を記録しました！\n残り：{names}")
        return

    # Unknown message – show current status
    remaining = task_store.get_incomplete_tasks(week_key)
    if remaining:
        names = "\n".join(f"　☐ {t['name']}" for t in remaining)
        line_client.send_text(user_id, f"📋 今週の残タスク：\n{names}")
    else:
        line_client.send_text(user_id, "✅ 今週のタスクはすべて完了済みです！")


if __name__ == "__main__":
    task_store.init_db()
    task_store.load_tasks_from_json()
    start_scheduler()
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
