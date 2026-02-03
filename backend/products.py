from flask import Blueprint, jsonify
import psycopg 
from .db import *
products_bp = Blueprint('products', __name__)

@products_bp.route('/products', methods=['GET'])
def products():
    db = get_db()
    cur = db.cursor();
    
    try:
        post = cur.execute(
            "SELECT * FROM products;"
        ).fetchall()

        
    except:
        print("ERROR GOES HERE")

    finally:
        cur.close()


    return jsonify(post)


@products_bp.route('/products/test', methods=['GET'])
def productsTest():
    db = get_db()
    #
    #try:
    #    with cur as db.cursor():
    #        cur.execute(
#
    #        )
    #except:
#
    #finally:
    #    dwa
#

    return jsonify({"username": "dwadwadwa",
        "theme": "grayu",
        "image": "coolURL"})