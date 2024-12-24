from flask import Blueprint, jsonify, request
from models import Quiz, StudentQuizProgress
from utils.db   import singleton_db 
from datetime import date
db = singleton_db.get_db
quiz_bp = Blueprint('quiz_bp', __name__)

@quiz_bp.route('/get-quiz', methods=['GET'])
def get_quiz_by_course():

    course_id = request.args.get('course_id')
    if not course_id:
        return jsonify({"error": "Course ID is required"}), 400

    try:
        quizzes = Quiz.query.filter_by(course_id=course_id).all()
        if not quizzes:
            return jsonify({"error": "No quizzes found for this course"}), 404

        valid_quizzes = [
            quiz for quiz in quizzes 
            if quiz.question and quiz.option_a and quiz.option_b and quiz.option_c and quiz.option_d and quiz.answer
        ]

        if not valid_quizzes:
            return jsonify({"error": "No valid quizzes found for this course"}), 404

        quiz_data = [{
            "quiz_id": quiz.quiz_id,
            "course_id": quiz.course_id,
            "title": quiz.title,
            "question": quiz.question,
            "option_a": quiz.option_a,
            "option_b": quiz.option_b,
            "option_c": quiz.option_c,
            "option_d": quiz.option_d,
            "answer": quiz.answer
        } for quiz in valid_quizzes]

        return jsonify(quiz_data), 200
    except Exception as e:
        return jsonify({"error": f"Internal Server Error: {str(e)}"}), 500


@quiz_bp.route('/submit-quiz', methods=['POST'])
def submit_quiz():
    data = request.get_json()
    student_id = data.get('student_id')
    course_id = data.get('course_id')
    answers = data.get('answers')

    if not student_id or not course_id or not answers:
        return jsonify({"error": "Missing required fields"}), 400

    try:
        quizzes = Quiz.query.filter_by(course_id=course_id).all()
        if not quizzes:
            return jsonify({"error": "No quizzes found for this course"}), 404

        total_questions = len(quizzes)
        correct_answers = 0

        for quiz in quizzes:
            expected_answer = quiz.answer.strip().lower() if quiz.answer else None
            submitted_answer = answers.get(str(quiz.quiz_id), "").strip().lower()

            if submitted_answer and expected_answer:
                correct_option_key = f"option_{expected_answer}"
                if submitted_answer == correct_option_key:
                    correct_answers += 1

        score = (correct_answers / total_questions) * 100 if total_questions > 0 else 0

        progress = StudentQuizProgress(
            student_id=student_id,
            quiz_id=quizzes[0].quiz_id,
            current_score=score,
            status='completed',
            completion_date=date.today()
        )

        db.session.add(progress)
        db.session.commit()

        return jsonify({
            "message": "Quiz submitted successfully!",
            "score": score,
            "correct_answers": correct_answers,
            "total_questions": total_questions
        }), 200

    except Exception as e:
        db.session.rollback()
        print("Error:", str(e))
        return jsonify({"error": f"Internal Server Error: {str(e)}"}), 500
