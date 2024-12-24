from flask import Blueprint, jsonify, request, session
from models import Student, Course, Enrollment
from utils.db  import singleton_db
db = singleton_db.get_db
student_enrolled_courses_bp = Blueprint("student_enrolled_courses", __name__)

@student_enrolled_courses_bp.route("/student/enrolled-courses", methods=["GET"])
def get_student_enrolled_courses():
    student_id = request.args.get("student_id") or session.get("student_id")
    if not student_id:
        return jsonify({"error": "Student ID is required to fetch enrolled courses."}), 400

    try:
        student = Student.query.get(student_id)
        if not student:
            return jsonify({"error": "Student not found."}), 404

        enrolled_courses = (
            db.session.query(Course)
            .join(Enrollment, Enrollment.course_id == Course.course_id)
            .filter(Enrollment.student_id == student_id)
            .all()
        )

        courses = [
            {
                "course_id": course.course_id,
                "course_name": course.course_name,
                "course_description": course.course_description,
                "price": course.price,
                "image_url": course.image_url,
            }
            for course in enrolled_courses
        ]

        return jsonify({"courses": courses}), 200

    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500
