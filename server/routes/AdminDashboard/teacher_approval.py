# routes/admin/teacher_approval.py
from flask import Blueprint, jsonify, request
from models.hiring_requests import HiringRequest
from models.user import Teacher
from utils.db import singleton_db
from datetime import date
db = singleton_db.get_db
teacher_approval_bp = Blueprint('teacher_approval', __name__)

@teacher_approval_bp.route('/api/admin/teacher-applications', methods=['GET'])
def get_teacher_applications():
    try:
        applications = db.session.query(
            HiringRequest, Teacher
        ).join(
            Teacher, HiringRequest.teacher_id == Teacher.teacher_id
        ).filter(
            HiringRequest.status == 'pending'
        ).all()

        return jsonify([{
            'request_id': app.HiringRequest.request_id,
            'teacher_id': app.Teacher.teacher_id,
            'name': app.Teacher.name,
            'email': app.Teacher.email,
            'designation': app.Teacher.designation,
            'request_date': app.HiringRequest.request_date.isoformat(),
        } for app in applications])

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@teacher_approval_bp.route('/api/admin/teacher-applications/<int:request_id>', methods=['PUT'])
def update_application_status(request_id):
    try:
        data = request.get_json()
        status = data.get('status')
        teacher_id = data.get('teacher_id')

        if status not in ['approved', 'rejected']:
            return jsonify({'error': 'Invalid status'}), 400

        # Start transaction
        db.session.begin()

        # Update hiring request
        hiring_request = HiringRequest.query.get(request_id)
        if not hiring_request:
            db.session.rollback()
            return jsonify({'error': 'Application not found'}), 404

        hiring_request.status = status
        hiring_request.reviewed_date = date.today()

        # Update teacher status
        teacher = Teacher.query.get(teacher_id)
        if teacher:
            teacher.hiring_status = 'hired' if status == 'approved' else 'rejected'

        db.session.commit()

        return jsonify({
            'message': f'Teacher application {status} successfully',
            'request_id': request_id
        })

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500