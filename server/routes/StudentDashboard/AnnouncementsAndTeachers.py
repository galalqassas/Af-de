from flask import Blueprint, jsonify, request
from models.enrollment import Enrollment
from models.user import Teacher
from models.notification import Notification, StudentNotification
import traceback

announcements_and_teachers_bp = Blueprint('announcements_and_teachers', __name__)

@announcements_and_teachers_bp.route('/announcements_and_teachers', methods=['GET'])
def get_announcements_and_teachers():
    try:
        student_id = request.args.get('student_id', type=int)
        if not student_id:
            return jsonify({"error": "Student ID is required"}), 400

        enrollments = Enrollment.query.filter_by(student_id=student_id).all()
        if not enrollments:
            return jsonify({"announcements": [], "teachers": []}), 200

        courses = [enrollment.course for enrollment in enrollments if enrollment.course]
        if not courses:
            return jsonify({"announcements": [], "teachers": []}), 200

        teacher_ids = {course.teacher_id for course in courses if course.teacher_id}
        if not teacher_ids:
            return jsonify({"announcements": [], "teachers": []}), 200

        teachers = Teacher.query.filter(Teacher.teacher_id.in_(teacher_ids)).all()

        student_notifications = StudentNotification.query.filter_by(student_id=student_id).all()
        notification_ids = [sn.notification_id for sn in student_notifications if sn.notification_id]
        if not notification_ids:
            return jsonify({"announcements": [], "teachers": []}), 200

        notifications = Notification.query.filter(
            Notification.notification_id.in_(notification_ids)
        ).order_by(Notification.created_at.desc()).all()

        teacher_data = [
            {
                "teacher_id": teacher.teacher_id,
                "name": teacher.name,
                "designation": teacher.designation,
                "profile_picture": teacher.profile_picture
            } for teacher in teachers
        ]

        announcements_data = [
            {
                "notification_id": notification.notification_id,
                "message": notification.message,
                "created_at": notification.created_at.strftime('%Y-%m-%d %H:%M:%S')
            } for notification in notifications
        ]

        return jsonify({
            "announcements": announcements_data,
            "teachers": teacher_data
        }), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

