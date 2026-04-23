"""
Task and reminder state management using SQLite.
"""
import json
import sqlite3
from contextlib import contextmanager
from datetime import datetime, timedelta
from pathlib import Path

DB_PATH = Path(__file__).parent / "reminder.db"
TASKS_PATH = Path(__file__).parent / "tasks.json"


@contextmanager
def _db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def init_db():
    with _db() as conn:
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS tasks (
                id   TEXT PRIMARY KEY,
                name TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS reminder_sessions (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                week_key    TEXT NOT NULL,
                sent_at     TEXT NOT NULL,
                message_id  TEXT
            );

            CREATE TABLE IF NOT EXISTS completions (
                week_key TEXT NOT NULL,
                task_id  TEXT NOT NULL,
                done_at  TEXT NOT NULL,
                PRIMARY KEY (week_key, task_id)
            );
        """)


def load_tasks_from_json():
    """Sync tasks.json into the tasks table."""
    data = json.loads(TASKS_PATH.read_text(encoding="utf-8"))
    with _db() as conn:
        conn.execute("DELETE FROM tasks")
        conn.executemany(
            "INSERT INTO tasks (id, name) VALUES (?, ?)",
            [(t["id"], t["name"]) for t in data["tasks"]],
        )


def get_all_tasks() -> list[dict]:
    with _db() as conn:
        rows = conn.execute("SELECT id, name FROM tasks").fetchall()
    return [dict(r) for r in rows]


def current_week_key() -> str:
    """e.g. '2026-W17'"""
    today = datetime.now()
    return today.strftime("%Y-W%V")


def get_incomplete_tasks(week_key: str | None = None) -> list[dict]:
    if week_key is None:
        week_key = current_week_key()
    with _db() as conn:
        done_ids = {
            r[0]
            for r in conn.execute(
                "SELECT task_id FROM completions WHERE week_key = ?", (week_key,)
            ).fetchall()
        }
        all_tasks = [dict(r) for r in conn.execute("SELECT id, name FROM tasks").fetchall()]
    return [t for t in all_tasks if t["id"] not in done_ids]


def mark_complete(task_id: str, week_key: str | None = None):
    if week_key is None:
        week_key = current_week_key()
    with _db() as conn:
        conn.execute(
            "INSERT OR IGNORE INTO completions (week_key, task_id, done_at) VALUES (?, ?, ?)",
            (week_key, task_id, datetime.now().isoformat()),
        )


def record_reminder_sent(week_key: str, message_id: str | None = None):
    with _db() as conn:
        conn.execute(
            "INSERT INTO reminder_sessions (week_key, sent_at, message_id) VALUES (?, ?, ?)",
            (week_key, datetime.now().isoformat(), message_id),
        )


def last_reminder_sent_at(week_key: str) -> datetime | None:
    with _db() as conn:
        row = conn.execute(
            "SELECT sent_at FROM reminder_sessions WHERE week_key = ? ORDER BY sent_at DESC LIMIT 1",
            (week_key,),
        ).fetchone()
    if row:
        return datetime.fromisoformat(row["sent_at"])
    return None


def should_re_remind(week_key: str, interval_hours: int = 12) -> bool:
    """True if incomplete tasks remain and enough time has passed since last reminder."""
    if not get_incomplete_tasks(week_key):
        return False
    last = last_reminder_sent_at(week_key)
    if last is None:
        return True
    return datetime.now() - last >= timedelta(hours=interval_hours)
