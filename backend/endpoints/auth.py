from flask import Blueprint, abort, jsonify, request
from werkzeug.security import check_password_hash, generate_password_hash
import psycopg
from ..db import *
auth_bp = Blueprint('auth', __name__)

# Flask docs and gemini
@auth_bp.route('/register', methods=['POST'])
def register():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        db = get_db()

        if not email:
            abort(409, description="Email is required.")
        elif not password:
            abort(409, description="Password is required.")
        try:
            with db.cursor() as cur:

                cur.execute(
                    "INSERT INTO users (email, password) VALUES (%s, %s)",
                    (email, generate_password_hash(password),)
                )

                db.commit()

        except psycopg.errors.UniqueViolation:
            abort(409, description="User already exists.")
        except Exception as e:
            abort(500, description=str(e))
        
    return jsonify({'message': 'User registered successfully'}), 200

# Flask docs and gemini
@auth_bp.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        db = get_db()

        if not email:
            abort(400, description="Email is required.")
        elif not password:
            abort(400, description="Password is required.")
        try:
            with db.cursor() as cur:

                cur.execute(
                    "SELECT * FROM users WHERE email = %s",
                    (email,)
                )

                user = cur.fetchone()

                # Should mby not use magic number here 
                if user is None or not check_password_hash(user[2], password):
                    abort(401, description="Invalid credentials.")
                
                # We need token here too
                return jsonify({'message': 'Login successfully'}), 200
        except Exception as e:
            abort(500, description=str(e))
        
