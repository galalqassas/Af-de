from flask import Blueprint, jsonify, request
from models import CourseRating
from utils.db import singleton_db  
db = singleton_db.get_db
feedback_form_bp = Blueprint("feedback", __name__)

@feedback_form_bp.route("/submit-feedback", methods=["POST"])
def submit_feedback():
    data = request.json
    try:
        rated_by = data.get("rated_by")
        course_id = data.get("course_id")
        rating = data.get("rating")
        feedback = data.get("feedback")

        if not rated_by or not course_id or not rating:
            return jsonify({"error": "Rated_by, course_id, and rating are required."}), 400
        
        if not (1 <= int(rating) <= 5): 
            return jsonify({"error": "Rating must be between 1 and 5."}), 400

        new_feedback = CourseRating(
            rated_by=rated_by,
            course_id=course_id,
            rating=rating,
            feedback=feedback,
        )

        db.session.add(new_feedback)
        db.session.commit()

        return jsonify({"message": "Feedback submitted successfully!"}), 201
    except Exception as e:
        db  .session.rollback()
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500
