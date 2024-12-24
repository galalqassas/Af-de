from flask import Blueprint, jsonify, request
from models.enrollment import Enrollment
from models.quiz import StudentQuizProgress

performance_bp = Blueprint('performance', __name__)

@performance_bp.route('/student/performance', methods=['GET'])
def get_student_performance():
    try:
        student_id = request.args.get('student_id', type=int)
        if not student_id:
            return jsonify({"error": "Student ID is required"}), 400

        total_courses = Enrollment.query.filter_by(student_id=student_id).count()

        total_quizzes = StudentQuizProgress.query.filter_by(student_id=student_id).count()
        completed_quizzes = StudentQuizProgress.query.filter_by(
            student_id=student_id, status='completed'
        ).count()

        in_progress_quizzes = total_quizzes - completed_quizzes

        quizzes = StudentQuizProgress.query.filter_by(student_id=student_id).all()
        quiz_data = [
            {
                "quiz_id": q.quiz_id,
                "score": q.current_score,
                "status": q.status,
                "completion_date": q.completion_date
            } 
            for q in quizzes
        ]

        return jsonify({
            "total_courses": total_courses,
            "total_quizzes": total_quizzes,
            "completed_quizzes": completed_quizzes,
            "in_progress_quizzes": in_progress_quizzes,
            "quizzes": quiz_data
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
