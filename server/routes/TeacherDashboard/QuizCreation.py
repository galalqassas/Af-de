from flask import Blueprint, request, jsonify
from models import Quiz
from utils.db   import singleton_db
from datetime import datetime
db = singleton_db.get_db
quiz_creation_bp = Blueprint('quiz_creation_bp', __name__)

@quiz_creation_bp.route('/quiz/create', methods=['POST'])
def create_quiz():
    data = request.get_json()
    try:
        new_quiz = Quiz(
            title=data['title'],
            course_id=int(data['course_id']),
            max_score=int(data['max_score']),
            post_date=datetime.strptime(data['post_date'], '%Y-%m-%d'),
            deadline=datetime.strptime(data['deadline'], '%Y-%m-%d'),
            question=data['question'],
            option_a=data['option_a'],
            option_b=data['option_b'],
            option_c=data['option_c'],
            option_d=data['option_d'],
            answer=data['answer']
        )
        db.session.add(new_quiz)
        db.session.commit()
        return jsonify({"message": "Quiz created successfully!"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to create quiz: {str(e)}"}), 400
