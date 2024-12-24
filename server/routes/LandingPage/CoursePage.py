from flask import Blueprint, jsonify
from utils.db import singleton_db
from models import Course, CourseContent, CourseRating
db = singleton_db.get_db
course_page_bp = Blueprint('course_page', __name__)

@course_page_bp.route('/courses/<int:course_id>', methods=['GET'])
def get_course(course_id):
    course = Course.query.get_or_404(course_id)
    contents = CourseContent.query.filter_by(course_id=course_id).all()
    ratings = CourseRating.query.filter_by(course_id=course_id).all()

    course_data = {
        'course_id': course.course_id,
        'course_name': course.course_name,
        'course_description': course.course_description,
        'teacher_id': course.teacher_id,
        'teacher_name': course.teacher.name,
        'teacher_profile_picture': course.teacher.profile_picture,   
        'price': float(course.price),
        'image_url': course.image_url,
        'contents': [{'content_id': content.content_id, 'title': content.title, 'duration': '60 mins'} for content in contents], 
        'average_rating': sum(rating.rating for rating in ratings) / len(ratings) if ratings else 0,
        'rating_count': len(ratings)
    }

    return jsonify(course_data)

@course_page_bp.route('/courses/<int:course_id>/ratings', methods=['GET'])
def get_course_ratings(course_id):
    ratings = CourseRating.query.filter_by(course_id=course_id).all()
    ratings_data = [
        {
            'rating_id': rating.rating_id,
            'student_name': rating.student.name,  
            'rating': rating.rating,
            'comment': rating.feedback
        }
        for rating in ratings
    ]

    return jsonify(ratings_data)