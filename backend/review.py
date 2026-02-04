from flask import Blueprint, abort, jsonify
import psycopg
from .db import *
review_bp = Blueprint('review', __name__)

# Perhaps change so it can take product_id or user_id
@review_bp.route('/review/<int:productID>', methods=['GET'])
def get_reviews_by_id(productID):
    db = get_db()
    cur = db.cursor()

    cur.execute(
        "SELECT * FROM review WHERE product_id = %(id)s;" , {'id':productID}
    )

    reviews = cur.fetchall();

    if reviews is None:
        abort(404, description="No reviews for provided product id found")

    return jsonify(reviews)