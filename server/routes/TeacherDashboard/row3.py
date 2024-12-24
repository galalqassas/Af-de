from flask import jsonify, request
from . import dashboard_bp
from utils.db  import singleton_db 
db = singleton_db.get_db
from models import (
    Student, Payment, StudentProgress, Enrollment, Course,
    CourseAssessment, StudentQuizProgress, Teacher, Session
)

@dashboard_bp.route('/dashboard/session-activity', methods=['GET'])
def get_session_activity():
    teacher_id = request.args.get('teacher_id', type=int)

    courses = Course.query.filter_by(teacher_id=teacher_id).all()
    if not courses:
        return jsonify([{
            "id": "Sessions",
            "color": "hsl(205, 70%, 50%)",
            "data": []
        }])

    sessions_data = db.session.query(
        Course.course_name,
        db.func.count(Session.session_id).label('session_count')
    ).join(Session, Session.course_id == Course.course_id)\
     .filter(Course.teacher_id == teacher_id)\
     .group_by(Course.course_name).all()

    return jsonify([{
        "id": "Sessions",
        "color": "hsl(205, 70%, 50%)",
        "data": [
            {"x": course_name, "y": count}
            for course_name, count in sessions_data
        ]
    }])

@dashboard_bp.route('/dashboard/assessment-scores', methods=['GET'])
def get_assessment_scores():
    teacher_id = request.args.get('teacher_id', type=int)
    if not teacher_id:
        return jsonify({"error": "teacher_id is required"}), 400

    course_ids = db.session.query(Course.course_id)\
        .filter_by(teacher_id=teacher_id).all()
    course_ids = [cid[0] for cid in course_ids]

    if not course_ids:
        return jsonify([])

    assessment_scores = db.session.query(
        CourseAssessment.title.label('assessment'),
        db.func.avg(StudentProgress.score).label('average_score')
    ).join(
        StudentProgress,
        StudentProgress.assessment_id == CourseAssessment.assessment_id
    ).filter(
        CourseAssessment.course_id.in_(course_ids)
    ).group_by(
        CourseAssessment.assessment_id,
        CourseAssessment.title
    ).order_by(
        CourseAssessment.post_date
    ).all()

    data = [
        {
            "assessment": score.assessment,
            "Average Score": round(float(score.average_score), 2)
        }
        for score in assessment_scores
    ]

    return jsonify(data)