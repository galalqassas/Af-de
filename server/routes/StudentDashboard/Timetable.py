from flask import Blueprint, jsonify, request
from sqlalchemy.sql import text
from utils.db   import singleton_db
db = singleton_db.get_db
timetable_bp = Blueprint('timetable', __name__)

@timetable_bp.route('/student/timetable', methods=['GET'])
def get_student_timetable():
    try:
        student_id = request.args.get('student_id', type=int)
        if not student_id:
            return jsonify({"error": "Student ID is required"}), 400

        query = text("""
    SELECT s.session_date AS session_date, 
           c.course_name AS course_name, 
           t.name AS teacher_name 
    FROM session s
    INNER JOIN course c ON c.course_id = s.course_id 
    INNER JOIN teacher t ON t.teacher_id = c.teacher_id
    WHERE c.course_id IN (
        SELECT e.course_id 
        FROM enrollment e 
        WHERE e.student_id = :student_id
    )
    ORDER BY s.session_date ASC
""")


        timetable = db.session.execute(query, {"student_id": student_id}).fetchall()

        result = [
            {
                "session_date": row.session_date.strftime('%Y-%m-%d'),
                "course_name": row.course_name,
                "teacher_name": row.teacher_name
            }
            for row in timetable
        ]

        return jsonify({"timetable": result})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

