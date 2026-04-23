"""
Gunicorn entry point – runs DB init and scheduler before serving.
"""
import task_store
from scheduler import start_scheduler
from app import app  # noqa: F401 – imported for gunicorn

task_store.init_db()
task_store.load_tasks_from_json()
start_scheduler()
