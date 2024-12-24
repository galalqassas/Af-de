from flask import Blueprint, jsonify, request, session
from models import Student, Course, Enrollment

student_dashboard_course_bp = Blueprint("StudentDashboardCourses", __name__)

@student_dashboard_course_bp.route("/StudentDashboardCourses", methods=["GET"])
def get_student_dashboard_courses():
    student_id = request.args.get("student_id") or session.get("student_id")
    if not student_id:
        return jsonify({"error": "Student ID is required to fetch courses."}), 400

    try:
        student = Student.query.get(student_id)
        if not student:
            return jsonify({"error": "Student not found."}), 404

        enrolled_courses = Enrollment.query.filter_by(student_id=student_id).all()
        enrolled_course_ids = [e.course_id for e in enrolled_courses]

        available_courses = Course.query.filter(~Course.course_id.in_(enrolled_course_ids)).all()
        courses = [
            {
                "course_id": course.course_id,
                "course_name": course.course_name,
                "course_description": course.course_description,
                "price": course.price,
                "image_url": course.image_url,
            }
            for course in available_courses
        ]
        return jsonify(courses), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
