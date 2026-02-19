from flask import Blueprint
import psycopg
from flask import current_app

dbtest_bp = Blueprint("dbtest", __name__)

@dbtest_bp.get("/dbtest")
def dbtest():
    try:
        with psycopg.connect(current_app.config["DATABASE_URL"]) as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT 1;")
                return {"ok": True, "result": cur.fetchone()}
    except Exception as e:
        return {"ok": False, "error": str(e)}, 500
