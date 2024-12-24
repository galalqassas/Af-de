from flask import Blueprint, jsonify, request
from models.course import Course

course_bp = Blueprint('course', __name__)

@course_bp.route('/courses', methods=['GET'])
def get_courses():
    teacher_id = request.args.get('teacher_id')
    if teacher_id:
        courses = Course.query.filter_by(teacher_id=teacher_id).all()
    else:
        courses = Course.query.all()
    
    return jsonify([{
        'course_id': c.course_id,
        'course_name': c.course_name,
        'description': c.course_description,
        'price': c.price,
        'image_url': c.image_url
    } for c in courses])