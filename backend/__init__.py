import os
from . import db
from flask import Flask
from flask_jwt_extended import  JWTManager

jwt = JWTManager()

# Might need to change here for pool
# Mainly flask docs
def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',  # Key should be something random for deployment
        DATABASE=os.environ.get("DATABASE_URL"),
        JWT_SECRET_KEY = "SUPER SECRET KEY"
        # Should add so tokens expire like 1h after last request or similar
    )

    if test_config is None:
        app.config.from_pyfile('config.py', silent=True)
    else:
        app.config.from_mapping(test_config)

    jwt.init_app(app)

    db.init_app(app)

    from .endpoints import products, review, orders, order_items, users, auth
    app.register_blueprint(products.products_bp)
    app.register_blueprint(review.review_bp)
    app.register_blueprint(orders.orders_bp)
    app.register_blueprint(order_items.order_items_bp)
    app.register_blueprint(users.users_bp)
    app.register_blueprint(auth.auth_bp)

    return app
