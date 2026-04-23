import os
import sys
import requests
import yaml
from datetime import datetime
import pytz

JST = pytz.timezone("Asia/Tokyo")


def load_config():
    script_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    with open(os.path.join(script_dir, "tasks.yaml"), encoding="utf-8") as f:
        return yaml.safe_load(f)


def build_message(config: dict) -> str:
    tasks = config["weekly_tasks"]
    msgs = config["messages"]

    now = datetime.now(JST)
    is_monday = now.weekday() == 0
    date_str = now.strftime("%m/%d (%a)")

    header = msgs["monday_morning_line"] if is_monday else msgs["weekday_morning_line"]

    task_lines = "\n".join(f"{t['emoji']} {t['title']}" for t in tasks)

    footer = "今週も頑張りましょう💪" if is_monday else "今日こそ片付けましょう！"

    return (
        f"{header}\n"
        f"{date_str}\n"
        "━━━━━━━━━━━━━\n"
        f"{task_lines}\n"
        "━━━━━━━━━━━━━\n"
        f"{footer}"
    )


def send(message: str):
    token = os.environ["LINE_CHANNEL_ACCESS_TOKEN"]
    user_id = os.environ["LINE_USER_ID"]

    resp = requests.post(
        "https://api.line.me/v2/bot/message/push",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}",
        },
        json={
            "to": user_id,
            "messages": [{"type": "text", "text": message}],
        },
        timeout=10,
    )

    if not resp.ok:
        print(f"LINE API error {resp.status_code}: {resp.text}", file=sys.stderr)
        resp.raise_for_status()

    print("LINE message sent.")


def main():
    config = load_config()
    message = build_message(config)
    print("--- message preview ---")
    print(message)
    print("-----------------------")
    send(message)


if __name__ == "__main__":
    main()
