
from backend.celery import app


@app.task(max_retries=0)
def test_task():
    print("HELLO WORD")