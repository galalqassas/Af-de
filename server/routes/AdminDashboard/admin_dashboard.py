from flask import Blueprint, jsonify
from models.user import Student, Teacher, Parent, Admin
from models.course import Course
from models.enrollment import Enrollment
from models.payment import Payment
from models.hiring_requests import HiringRequest
from sqlalchemy import func
from datetime import datetime, date
from utils.db import singleton_db
db = singleton_db.get_db
dash_home_bp = Blueprint('dash_home_bp', __name__)

@dash_home_bp.route('/admin', methods=['GET'])
def get_dashboard_data():
    try:
        # Total Users count - unchanged as user models remain the same
        total_students = Student.query.count()
        total_teachers = Teacher.query.count()
        total_parents = Parent.query.count()
        total_admins = Admin.query.count()
        total_users = {
            'students': total_students,
            'teachers': total_teachers,
            'parents': total_parents,
            'admins': total_admins
        }

        # Active courses - unchanged as Course model remains similar
        active_courses = Course.query.count()

        # Pending teacher approvals - using hiring_status from Teacher model
        pending_approvals = Teacher.query.filter_by(hiring_status='pending').count()

        # Daily payments - using Payment model
        total_payments = Payment.query.count()

        # Enrollments over time - using Enrollment model
        enrollments = db.session.query(
            func.extract('year', Enrollment.enrollment_date).label('year'),
            func.count(Enrollment.enrollment_id).label('count')
        ).group_by(
            func.extract('year', Enrollment.enrollment_date)
        ).order_by('year').all()

        enrollments_data = [
            {'year': int(year), 'count': count}
            for year, count in enrollments
        ]

        # If no enrollments, provide sample data for chart
        if not enrollments_data:
            current_year = datetime.now().year
            enrollments_data = [
                {'year': year, 'count': 0} 
                for year in range(current_year-2, current_year+1)
            ]
        total_enrollments = Enrollment.query.count()

        dashboard_data = {
            'total_users': total_users,
            'active_courses': active_courses,
            'pending_approvals': pending_approvals,
            'total_enrollments': total_enrollments,
            'enrollments_over_time': enrollments_data
        }

        return jsonify(dashboard_data)

    except Exception as e:
        return jsonify({'error': str(e)}), 500