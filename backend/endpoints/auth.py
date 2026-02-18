from flask import Blueprint, abort, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, unset_jwt_cookies
from werkzeug.security import check_password_hash, generate_password_hash
import psycopg
from ..db import *
auth_bp = Blueprint('auth', __name__)

# https://dev.to/nagatodev/how-to-add-login-authentication-to-a-flask-and-react-application-23i7
# For auth things

# Flask docs and gemini and own and dev.to


@auth_bp.route('/auth/register', methods=['POST'])
def register():
    email = request.json.get('email')
    password = request.json.get('password')
    db = get_db()

    if not email:
        return jsonify({'error': 'Email is required.'}), 409
    elif not password:
        return jsonify({'error': 'Password is required.'}), 409
    try:
        with db.cursor() as cur:

            cur.execute(
                "INSERT INTO users (email, password) VALUES (%s, %s)",
                (email, generate_password_hash(password),)
            )

            db.commit()

    except psycopg.errors.UniqueViolation:
        return jsonify({'error': 'User already exists.'}), 409
    except Exception as e:
        abort(500, description=str(e))

    return jsonify({'message': 'User registered successfully'}), 200

# Flask docs and gemini and own
@auth_bp.route('/auth/login', methods=['POST'])
def login():
    email = request.json.get('email', None)
    password = request.json.get('password', None)
    db = get_db()

    if not email:
        return jsonify({'error': 'Email is required.'}), 409
    elif not password:
        return jsonify({'error': 'Password is required.'}), 409
    try:
        with db.cursor() as cur:
            
            cur.execute(
                "SELECT * FROM users WHERE email = %s",
                (email,)
            )

            user = cur.fetchone()
            if user is None or not check_password_hash(user['password'], password):
                return jsonify({'error': 'Invalid credentials.'}), 401
                
                
            access_token = create_access_token(identity=email, additional_claims=user['admin'])
            return jsonify({'access_token': access_token}), 200
            
    except Exception as e:
        return jsonify({'error':'No is work'}), 500

#dev.to link
@auth_bp.route('/auth/logout', methods=['POST'])
def logout():
    try:
        response = jsonify({"message": "Logout successful YIPPIE"})
        unset_jwt_cookies(response)
        return  response, 200
            
    except Exception as e:
        return jsonify({'error':'No is work'}), 500

#dev.to link
@auth_bp.route('/auth/verify', methods=['GET'])
@jwt_required() # Just check if user not if admin or not
def testVerification():
    response = jsonify({
        "type": "Cho",
        "about": "R"
    })

    return response, 200

