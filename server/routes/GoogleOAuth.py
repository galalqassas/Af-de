from flask import Blueprint, request, redirect, url_for, session, jsonify
from oauthlib.oauth2 import WebApplicationClient
from utils.db  import singleton_db
db = singleton_db.get_db
from models.user import Student, Teacher, Parent, Admin
import requests
import config
import logging
import os
import bcrypt

# to allow HTTP for local development
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

google_oauth_bp = Blueprint('google_oauth', __name__)

# OAuth2 client setup
client = WebApplicationClient(config.Config.GOOGLE_CLIENT_ID)

ROLE_MODELS = {
    'student': Student,
    'teacher': Teacher,
    'parent': Parent,
    'admin': Admin
}

@google_oauth_bp.route('/google-login', methods=['GET'])
def google_login():
    role = request.args.get('role')
    student_id = request.args.get('student_id')

    logging.info(f"Google Login initiated. Role: {role}, Student ID: {student_id}")

    if not role:
        return jsonify({"error": "Role is required"}), 400
    if role == 'parent' and not student_id:
        return jsonify({"error": "Student ID is required for parents"}), 400

    session.clear() 
    session['role'] = role
    if role == 'parent':
        session['student_id'] = student_id

    authorization_endpoint = "https://accounts.google.com/o/oauth2/auth"
    request_uri = client.prepare_request_uri(
        authorization_endpoint,
        redirect_uri=url_for('google_oauth.google_callback', _external=True),
        scope=["openid", "email", "profile"],
    )
    return redirect(request_uri)


@google_oauth_bp.route('/google-callback', methods=['GET'])
def google_callback():
    try:
        code = request.args.get('code')
        if not code:
            return jsonify({"error": "Authorization code is missing"}), 400
        token_endpoint = "https://oauth2.googleapis.com/token"
        token_url, headers, body = client.prepare_token_request(
            token_endpoint,
            authorization_response=request.url,
            redirect_url=url_for('google_oauth.google_callback', _external=True),
            code=code,
            client_secret=config.Config.GOOGLE_CLIENT_SECRET
        )
        token_response = requests.post(token_url, headers=headers, data=body)
        client.parse_request_body_response(token_response.text)
        userinfo_endpoint = "https://www.googleapis.com/oauth2/v3/userinfo"
        uri, headers, body = client.add_token(userinfo_endpoint)
        userinfo_response = requests.get(uri, headers=headers, data=body)
        user_info = userinfo_response.json()
        email = user_info.get("email")
        name = user_info.get("name")
        if not email or not name:
            return jsonify({"error": "Failed to retrieve user information"}), 400

        role = session.get('role')
        student_id = session.get('student_id')

        if not role:
            return jsonify({"error": "Role is missing from the session"}), 400
        if role == 'parent' and not student_id:
            return jsonify({"error": "Student ID is missing from the session"}), 400

        existing_user = ROLE_MODELS[role].query.filter_by(email=email).first()
        if existing_user:
            session.clear()
            session['user_id'] = getattr(existing_user, f"{role}_id", None)
            session['role'] = role
            dashboard_url = f"http://localhost:5173/{role}-dashboard"
            return redirect(dashboard_url)

        random_password = bcrypt.hashpw(os.urandom(16), bcrypt.gensalt()).decode('utf-8')

        if role == 'parent':
            student = Student.query.filter_by(student_id=student_id).first()
            if not student:
                return jsonify({"error": "Invalid student ID"}), 400
            existing_parent = Parent.query.filter_by(student_id=student_id).first()
            if existing_parent:
                return jsonify({"error": "This student is already associated with another parent"}), 400
            new_user = Parent(name=name, email=email, password=random_password, student_id=student_id)
        else:
            new_user = ROLE_MODELS[role](name=name, email=email, password=random_password)

        with db.session.begin_nested():
            db.session.add(new_user)
        db.session.commit()
        session['user_id'] = getattr(new_user, f"{role}_id", None)
        session['role'] = role

        dashboard_url = f"http://localhost:5173/{role}-dashboard"
        return redirect(dashboard_url)
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"HTTP request failed: {str(e)}"}), 500
    except Exception as e:
        db  .session.rollback()
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500

