from flask import Blueprint, jsonify
from models.course import Course

landing_course_bp = Blueprint('LandingPageCourses', __name__)

@landing_course_bp.route('/LandingPageCourses', methods=['GET'])
def get_courses():
    courses = Course.query.all()
    return jsonify([{
        'course_id': c.course_id,
        'course_name': c.course_name,
        'description': c.course_description,
        'price': float(c.price),
        'image_url': c.image_url
    } for c in courses])
