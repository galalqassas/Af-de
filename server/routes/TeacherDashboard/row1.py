from flask import jsonify, request
from . import dashboard_bp
from utils.db import singleton_db
db = singleton_db.get_db
from models import (
    Student, Payment, StudentProgress, Enrollment, Course,
    CourseAssessment, StudentQuizProgress, Teacher, Session
)

@dashboard_bp.route('/dashboard/students-enrolled', methods=['GET'])
def get_students_enrolled():
    teacher_id = request.args.get('teacher_id')
    if not teacher_id:
        return jsonify({"error": "teacher_id is required"}), 400

    course_ids = db.session.query(Course.course_id)\
        .filter_by(teacher_id=teacher_id).all()
    course_ids = [cid[0] for cid in course_ids]

    student_count = db.session.query(Enrollment.student_id)\
        .filter(Enrollment.course_id.in_(course_ids))\
        .distinct().count()
    return jsonify({
        "title": f"{student_count:,}",
        "subTitle": "Students Enrolled"
    })

@dashboard_bp.route('/dashboard/money-obtained', methods=['GET'])
def get_money_obtained():
    teacher_id = request.args.get('teacher_id')
    if not teacher_id:
        return jsonify({"error": "teacher_id is required"}), 400

    course_ids = db.session.query(Course.course_id)\
        .filter_by(teacher_id=teacher_id).all()
    course_ids = [cid[0] for cid in course_ids]

    total_amount = db.session.query(db.func.sum(Payment.amount))\
        .filter(Payment.course_id.in_(course_ids)).scalar()
    total_amount = total_amount if total_amount else 0.00
    return jsonify({
        "title": f"{total_amount:,.2f}",
        "subTitle": "Money Obtained"
    })

@dashboard_bp.route('/dashboard/last-assignment-completed', methods=['GET'])
def get_last_assignment_completed():
    teacher_id = request.args.get('teacher_id')
    if not teacher_id:
        return jsonify({"error": "teacher_id is required"}), 400

    course_ids = db.session.query(Course.course_id)\
        .filter_by(teacher_id=teacher_id).all()
    course_ids = [cid[0] for cid in course_ids]

    latest_assignment = db.session.query(CourseAssessment)\
        .filter(CourseAssessment.course_id.in_(course_ids))\
        .order_by(CourseAssessment.post_date.desc()).first()

    if not latest_assignment or not course_ids:
        return jsonify({
            "title": "0",
            "subTitle": "Students Completed Last Assignment"
        })

    completed_count = db.session.query(StudentQuizProgress)\
        .filter(
            StudentQuizProgress.quiz_id == latest_assignment.assessment_id,
            StudentQuizProgress.status == 'completed'
        ).count()

    return jsonify({
        "title": f"{completed_count}",
        "subTitle": "Students Completed Last Assignment"
    })

@dashboard_bp.route('/dashboard/pending-assignments', methods=['GET'])
def get_pending_assignments():
    teacher_id = request.args.get('teacher_id')
    if not teacher_id:
        return jsonify({"error": "teacher_id is required"}), 400

    course_ids = db.session.query(Course.course_id)\
        .filter_by(teacher_id=teacher_id).all()
    course_ids = [cid[0] for cid in course_ids]

    if not course_ids:
        return jsonify({
            "title": "0",
            "subTitle": "Pending Assignments"
        })

    assessment_ids = db.session.query(CourseAssessment.assessment_id)\
        .filter(CourseAssessment.course_id.in_(course_ids)).all()
    assessment_ids = [aid[0] for aid in assessment_ids]

    if not assessment_ids:
        return jsonify({
            "title": "0",
            "subTitle": "Pending Assignments"
        })

    pending_count = db.session.query(StudentProgress)\
        .filter(
            StudentProgress.assessment_id.in_(assessment_ids),
            StudentProgress.status == 'in_progress'
        ).count()

    return jsonify({
        "title": f"{pending_count}",
        "subTitle": "Pending Assignments"
    })