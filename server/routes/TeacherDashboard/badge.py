# Update badge.py routes
from flask import Blueprint, request, jsonify
from models.badge import Badge, StudentBadge
from models.user import Student
from models.enrollment import Enrollment
from utils.db import singleton_db  
from datetime import date
from sqlalchemy import distinct
db = singleton_db.get_db
badge_bp = Blueprint('badge_bp', __name__)

@badge_bp.route('/api/teacher/students', methods=['GET'])
def get_enrolled_students():
    try:
        students = db.session.query(Student).join(
            Enrollment, Student.student_id == Enrollment.student_id
        ).distinct().all()
        
        return jsonify([{
            'student_id': student.student_id,
            'name': student.name,
            'email': student.email
        } for student in students])
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@badge_bp.route('/api/teacher/badges', methods=['GET'])
def get_badges():
    try:
        badges = Badge.query.all()
        return jsonify([{
            'badge_id': badge.badge_id,
            'badge_name': badge.badge_name,
            'badge_description': badge.badge_description
        } for badge in badges])
    except Exception as e:
        return jsonify({'error': str(e)}), 500
@badge_bp.route('/api/teacher/award-badge', methods=['POST'])
def award_badge():
    try:
        data = request.get_json()
        student_id = data.get('student_id')
        badge_id = data.get('badge_id')

        existing_badge = StudentBadge.query.filter_by(
            student_id=student_id,
            badge_id=badge_id
        ).first()

        if existing_badge:
            return jsonify({
                'error': 'Student already has this badge'
            }), 400

        new_award = StudentBadge(
            student_id=student_id,
            badge_id=badge_id,
            date_awarded=date.today()
        )
        
        db.session.add(new_award)
        db.session.commit()

        badge = Badge.query.get(badge_id)
        student = Student.query.get(student_id)

        return jsonify({
            'message': f'Badge "{badge.badge_name}" awarded successfully to {student.name}!'
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
