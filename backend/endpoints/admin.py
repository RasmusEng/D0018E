import os
from flask import Blueprint, current_app
from ..db import get_db

admin_bp = Blueprint("admin", __name__)

@admin_bp.post("/admin/init-db")
def init_db():
    token = os.environ.get("INIT_TOKEN")
    if not token:
        return {"error": "INIT_TOKEN not set"}, 500

    # Require a header token so random people can't wipe/init your DB
    # curl -X POST -H "x-init-token: ..." https://.../api/admin/init-db
    from flask import request
    if request.headers.get("x-init-token") != token:
        return {"error": "unauthorized"}, 401

    db = get_db()
    with db.cursor() as cur:
        with current_app.open_resource("sql/schema.sql") as f:
            cur.execute(f.read().decode("utf8"))
        with current_app.open_resource("sql/dummyData.sql") as f:
            cur.execute(f.read().decode("utf8"))
    db.commit()
    return {"ok": True}
