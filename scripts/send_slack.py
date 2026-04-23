import os
import sys
import requests
import yaml
from datetime import datetime
import pytz

JST = pytz.timezone("Asia/Tokyo")

WEEKDAY_JA = {
    0: "月曜日", 1: "火曜日", 2: "水曜日",
    3: "木曜日", 4: "金曜日",
}


def load_config():
    script_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    with open(os.path.join(script_dir, "tasks.yaml"), encoding="utf-8") as f:
        return yaml.safe_load(f)


def build_blocks(config: dict) -> list:
    tasks = config["weekly_tasks"]
    msgs = config["messages"]

    now = datetime.now(JST)
    weekday_ja = WEEKDAY_JA.get(now.weekday(), "")
    date_str = now.strftime("%m/%d")

    task_lines = "\n".join(f"• {t['emoji']} {t['title']}" for t in tasks)

    return [
        {
            "type": "header",
            "text": {
                "type": "plain_text",
                "text": f"{msgs['evening_slack_header']} — {weekday_ja} {date_str}",
            },
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": f"今日のタスクは完了しましたか？\n\n{task_lines}",
            },
        },
        {"type": "divider"},
        {
            "type": "context",
            "elements": [
                {
                    "type": "mrkdwn",
                    "text": msgs["evening_slack_note"],
                }
            ],
        },
    ]


def send(blocks: list):
    webhook_url = os.environ["SLACK_WEBHOOK_URL"]

    resp = requests.post(
        webhook_url,
        json={"blocks": blocks},
        timeout=10,
    )

    if not resp.ok:
        print(f"Slack API error {resp.status_code}: {resp.text}", file=sys.stderr)
        resp.raise_for_status()

    print("Slack message sent.")


def main():
    config = load_config()
    blocks = build_blocks(config)
    print("--- blocks preview ---")
    for b in blocks:
        print(b)
    print("----------------------")
    send(blocks)


if __name__ == "__main__":
    main()
