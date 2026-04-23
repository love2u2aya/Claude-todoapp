"""
APScheduler jobs:
  - Weekly reminder every Monday at 09:00 (Asia/Tokyo)
  - Re-remind check every hour; fires if interval has elapsed and tasks remain
"""
import os
import logging
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger

import task_store
import line_client

logger = logging.getLogger(__name__)

# Comma-separated LINE user IDs to notify, e.g. "Uxxxxxxx,Uyyyyyyy"
_USER_IDS: list[str] = [uid.strip() for uid in os.environ.get("LINE_USER_IDS", "").split(",") if uid.strip()]

# How many hours between re-reminds (default 12)
RE_REMIND_HOURS = int(os.environ.get("RE_REMIND_HOURS", "12"))

# Day-of-week and time for the initial weekly reminder (default: Monday 09:00 JST)
REMIND_DOW  = os.environ.get("REMIND_DOW", "mon")
REMIND_HOUR = int(os.environ.get("REMIND_HOUR", "9"))
REMIND_MIN  = int(os.environ.get("REMIND_MIN", "0"))


def _send_reminder(is_re_remind: bool = False):
    week_key = task_store.current_week_key()
    tasks = task_store.get_incomplete_tasks(week_key)
    if not tasks:
        logger.info("All tasks complete for %s – skipping reminder.", week_key)
        return

    for user_id in _USER_IDS:
        try:
            line_client.send_reminder(user_id, tasks, week_key, is_re_remind=is_re_remind)
        except Exception:
            logger.exception("Failed to send reminder to %s", user_id)

    task_store.record_reminder_sent(week_key)
    label = "re-remind" if is_re_remind else "weekly reminder"
    logger.info("Sent %s for %s (%d tasks remaining).", label, week_key, len(tasks))


def _weekly_job():
    _send_reminder(is_re_remind=False)


def _re_remind_job():
    week_key = task_store.current_week_key()
    if task_store.should_re_remind(week_key, interval_hours=RE_REMIND_HOURS):
        _send_reminder(is_re_remind=True)


def start_scheduler():
    scheduler = BackgroundScheduler(timezone="Asia/Tokyo")

    # Initial reminder every Monday (or configured day) at 09:00 JST
    scheduler.add_job(
        _weekly_job,
        CronTrigger(day_of_week=REMIND_DOW, hour=REMIND_HOUR, minute=REMIND_MIN, timezone="Asia/Tokyo"),
        id="weekly_reminder",
        replace_existing=True,
    )

    # Re-remind check runs every hour; actual send is gated by should_re_remind()
    scheduler.add_job(
        _re_remind_job,
        CronTrigger(minute=0, timezone="Asia/Tokyo"),
        id="re_remind_check",
        replace_existing=True,
    )

    scheduler.start()
    logger.info(
        "Scheduler started. Weekly reminder: %s %02d:%02d JST. Re-remind interval: %dh.",
        REMIND_DOW, REMIND_HOUR, REMIND_MIN, RE_REMIND_HOURS,
    )
    return scheduler
