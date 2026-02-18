from flask import Blueprint, abort, jsonify
import psycopg
from ..db import *
products_bp = Blueprint('products', __name__)

# Gemini and flask doc
@products_bp.route('/products', methods=['GET'])
def get_all_products():
    db = get_db()
    with db.cursosr as cur:

        cur.execute(
            "SELECT * FROM products;"
        )

        products = cur.fetchall()

    if products is None:
        abort(404, desciption="No products found ")

    return jsonify(products)

# Gemini and flask doc 
# Add so reviews are also sent
@products_bp.route('/products/<int:productID>', methods=['GET'])
def get_product_by_id(productID):
    db = get_db()
    with db.cursosr as cur:

        cur.execute(
            "SELECT * FROM products WHERE product_id = %(id)s;", {
                'id': productID}
        )
        product = cur.fetchone()

    if product is None:
        abort(404, description="No product with provided product id found")

    return jsonify(product)
