import sys
import os
from venv import logger
from flask import Blueprint, request, jsonify, session
from itsdangerous import URLSafeTimedSerializer
from utils.mail import send_reset_email
from utils.db   import singleton_db
db = singleton_db.get_db
import bcrypt
from models.user import Student, Teacher, Parent, Admin
import logging
import config
import base64

auth = Blueprint('auth', __name__)

ROLE_MODELS = {
    'student': Student,
    'teacher': Teacher,
    'parent': Parent,
    'admin': Admin
}

serializer = URLSafeTimedSerializer(config.Config.SECRET_KEY)

    
@auth.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.json
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        role = data.get('role', '').lower()

        if not all([name, email, password, role]):
            return jsonify({"error": "All fields (name, email, password, role) are required"}), 400

        if role not in ROLE_MODELS:
            return jsonify({"error": "Invalid role specified"}), 400

        if ROLE_MODELS[role].query.filter_by(email=email).first():
            return jsonify({"error": f"Email is already taken by a {role}"}), 400

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        if role == 'parent':
            student_id = data.get('student_id')
            if not student_id:
                return jsonify({"error": "Student ID is required for parent signup"}), 400
            new_user = Parent(name=name, email=email, password=hashed_password, student_id=student_id)
        else:
            new_user = ROLE_MODELS[role](name=name, email=email, password=hashed_password)

        db.session.add(new_user)
        db.session.commit()

        user_id = getattr(new_user, f"{role}_id", None)
        return jsonify({"message": "Signup successful", "user_id": user_id}), 201

    except Exception as e:
        logging.error(f"Signup error: {e}")
        db.session.rollback()
        return jsonify({"error": "Internal server error"}), 500


@auth.route('/login', methods=['POST'])
def login():
    session.permanent = True 
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        user, role = None, None
        for r, model in ROLE_MODELS.items():
            user = model.query.filter_by(email=email).first()
            if user and bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
                role = r
                break

        if not user or not role:
            return jsonify({"error": "Invalid email or password"}), 401

        session['user_id'] = getattr(user, f"{role}_id", None)
        session['role'] = role

        logging.info(f"Session data after login: {dict(session)}")
        logging.info(f"Cookies being set in response: {request.cookies.to_dict()}")

        response = {
            "message": "Login successful",
            "role": role,
            f"{role}_id": session['user_id'],
        }
        return jsonify(response), 200
    except Exception as e:
        logging.error(f"Login error: {e}")
        return jsonify({"error": "Internal server error"}), 500



@auth.route('/forgot-password', methods=['POST'])
def forgot_password():
    try:
        data = request.json
        email = data.get('email')


        if not email:
            return jsonify({"error": "Email is required"}), 400
        user = next((model.query.filter_by(email=email).first() for model in ROLE_MODELS.values() if model.query.filter_by(email=email).first()), None)
        if not user:
            return jsonify({"error": "Email not found"}), 404
        reset_token = serializer.dumps(email, salt='password-reset-salt')
        encoded_token = base64.urlsafe_b64encode(reset_token.encode()).decode()
        reset_url = f"reset-password/{encoded_token}"
        logging.info(f"Generated reset URL: {reset_url}")
        if send_reset_email(email, reset_url): 
            logging.info(f"Password reset email sent to {email}")
            return jsonify({"message": "Password reset email sent"}), 200

        return jsonify({"error": "Failed to send email"}), 500

    except Exception as e:
        logging.error(f"Forgot password error: {e}")
        return jsonify({"error": "Internal server error"}), 500



@auth.route('/reset-password/<token>', methods=['POST'])
def reset_password(token):
    try:
        decoded_token = base64.urlsafe_b64decode(token.encode()).decode() 
        logging.info(f"Decoded token: {decoded_token}")

        email = serializer.loads(decoded_token, salt='password-reset-salt', max_age=3600)
        logging.info(f"Decoded email: {email}")

        data = request.json
        new_password = data.get('new_password')
        if not new_password:
            return jsonify({"error": "New password is required"}), 400

        user = next((model.query.filter_by(email=email).first() for model in ROLE_MODELS.values()), None)
        if not user:
            return jsonify({"error": "User not found"}), 404

        user.password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        db.session.commit()
        return jsonify({"message": "Password successfully reset"}), 200

    except Exception as e:
        logging.error(f"Reset password error: {e}")
        db.session.rollback()
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500


@auth.route('/logout', methods=['POST'])
def logout():
    session.clear()
    logging.info("User logged out successfully")
    return jsonify({"message": "Logged out successfully"}), 200
