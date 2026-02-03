import os
from . import db
from . import products
from flask import Flask

# Might need to change here for pool
def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev', #Key should be something random for deployment
        DATABASE=os.environ.get("DATABASE_URL")
    )

    if test_config is None:
        app.config.from_pyfile('config.py', silent=True)
    else:
        app.config.from_mapping(test_config)

    db.init_app(app)
    app.register_blueprint(products.products_bp)

    return app