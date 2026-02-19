import os

from . import db
from .endpoints import dbtest
from .endpoints import products
from .endpoints import review
from .endpoints import orders
from .endpoints import order_items
from .endpoints import users
from flask import Flask, app

def _build_db_url_from_rds_env() -> str:
    host = os.environ.get("RDS_HOSTNAME")
    port = os.environ.get("RDS_PORT", "5432")
    name = os.environ.get("RDS_DB_NAME")
    user = os.environ.get("RDS_USERNAME")
    pw   = os.environ.get("RDS_PASSWORD")

    if not all([host, name, user, pw]):
        missing = [k for k in ["RDS_HOSTNAME","RDS_DB_NAME","RDS_USERNAME","RDS_PASSWORD"] if not os.environ.get(k)]
        raise RuntimeError(f"Missing required RDS env vars: {', '.join(missing)}")

    return f"postgresql://{user}:{pw}@{host}:{port}/{name}"

# Might need to change here for pool
def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)

    app.config.from_mapping(
        SECRET_KEY='dev',  # Key should be something random for deployment
        DATABASE_URL= _build_db_url_from_rds_env()
    )

    if not app.config["DATABASE_URL"]:
        raise RuntimeError("DATABASE_URL is not set (Elastic Beanstalk -> Environment properties).")

    if test_config is None:
        app.config.from_pyfile("config.py", silent=True)
    else:
        app.config.from_mapping(test_config)

    db.init_app(app)

    # Optionally prefix with /api for Amplify usage:
    #---Test---#
    
    app.register_blueprint(dbtest.dbtest_bp, url_prefix="/api")

    #--Test---#
    app.register_blueprint(products.products_bp, url_prefix="/api")
    app.register_blueprint(review.review_bp, url_prefix="/api")
    app.register_blueprint(orders.orders_bp, url_prefix="/api")
    app.register_blueprint(order_items.order_items_bp, url_prefix="/api")
    app.register_blueprint(users.users_bp, url_prefix="/api")

    @app.get("/")
    def root():
        return {"app": "backend", "ok": True}

    @app.get("/health")
    def health():
        return {"ok": True}

    return app
