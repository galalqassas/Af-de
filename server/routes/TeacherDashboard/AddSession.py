from flask import Blueprint, jsonify, request
from datetime import datetime
from models import Session, Notification
from utils.db import singleton_db
db = singleton_db.get_db
session_bp = Blueprint("session_bp", __name__)

@session_bp.route("/session/add", methods=["POST"])
def add_session():
    data = request.json
    try:
        teacher_id = data["teacher_id"]
        course_id = data["course_id"]
        session_date = datetime.fromisoformat(data["session_date"])
        session_link = data.get("session_link", "")

        new_session = Session(
            teacher_id=teacher_id,
            course_id=course_id,
            session_date=session_date,
            session_link=session_link,
        )
        db.session.add(new_session)

        notification_message = (
            f"A new session has been scheduled on {session_date.strftime('%Y-%m-%d')}.\n"
            f"Session Link: {session_link}"
        )
        new_notification = Notification(
            course_id=course_id,
            teacher_id=teacher_id,
            message=notification_message,
        )
        db.session.add(new_notification)

        db.session.commit()
        return jsonify({"message": "Session and notification added successfully!"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
