from flask import Blueprint, jsonify, request
from models import  StudentQuizProgress, Quiz

student_progress_bp = Blueprint("student_progress", __name__)

@student_progress_bp.route('/student/progress', methods=['GET'])
def get_student_progress():
    student_id = request.args.get('student_id', type=int)
    if not student_id:
        return jsonify({"error": "Student ID is required"}), 400

    try:
        progress = StudentQuizProgress.query.filter_by(student_id=student_id).all()
        if not progress:
            return jsonify({"progress": []}), 200  

        progress_data = [
            {
                "quiz_title": Quiz.query.get(entry.quiz_id).title,
                "current_score": entry.current_score,
                "max_score": Quiz.query.get(entry.quiz_id).max_score,
                "status": entry.status,
                "completion_date": entry.completion_date.isoformat() if entry.completion_date else "N/A",
            }
            for entry in progress
        ]
        return jsonify({"progress": progress_data}), 200
    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

