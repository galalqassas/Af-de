import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Blueprint, jsonify
from models import CourseRating

feedback_bp = Blueprint('feedback', __name__)

@feedback_bp.route('/ratings', methods=['GET'])
def get_all_feedbacks():
    feedbacks = CourseRating.query.all()  
    feedback_list = []
    
    for feedback in feedbacks:
        feedback_list.append({
            'rating_id': feedback.rating_id,
            'student_name': feedback.student.name,  
            'rating': feedback.rating,
            'comment': feedback.feedback,
            'course_name': feedback.course.course_name  
        })
    
    return jsonify(feedback_list)
