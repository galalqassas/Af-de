# routes/course_list.py
from flask import Blueprint, jsonify
from models.course import Course, CourseRating
from models.enrollment import Enrollment
from models.user import Teacher
from models.progress import StudentProgress, StudentBadge
from sqlalchemy import func
from datetime import datetime

course_list_bp = Blueprint('course_list_bp', __name__)

@course_list_bp.route('/api/courses', methods=['GET'])
def get_courses():
    try:
        courses = Course.query.all()
        courses_list = []
        
        for course in courses:
            teacher = Teacher.query.get(course.teacher_id)
            teacher_name = teacher.name if teacher else "Unknown"

            # Get enrollments with badges (completed)
            completed_enrollments = (
                Enrollment.query
                .join(StudentBadge, Enrollment.student_id == StudentBadge.student_id)
                .filter(Enrollment.course_id == course.course_id)
                .all()
            )
            incomplete_enrollments = (
                Enrollment.query
                .outerjoin(StudentBadge, Enrollment.student_id == StudentBadge.student_id)
                .filter(
                    Enrollment.course_id == course.course_id,
                    StudentBadge.student_badge_id == None
                ).count()
            )

            current_enrollments = (
                Enrollment.query
                .outerjoin(StudentBadge, Enrollment.student_id == StudentBadge.student_id)
                .filter(
                    Enrollment.course_id == course.course_id,
                    StudentBadge.student_badge_id == None
                )
                .all()
            )

            days_to_complete = []
            for enrollment in completed_enrollments:
                badge = StudentBadge.query.filter_by(student_id=enrollment.student_id).first()
                if badge and enrollment.enrollment_date:
                    delta = badge.date_awarded - enrollment.enrollment_date
                    days_to_complete.append(delta.days)

            avg_days = int(sum(days_to_complete) / len(days_to_complete)) if days_to_complete else 0

            reviews = [{
                'studentName': rating.student.name,
                'rating': rating.rating,
                'body': rating.feedback 
            } for rating in course.ratings]

            courses_list.append({
                'id': course.course_id,
                'courseName': course.course_name,
                'courseDescription': course.course_description,
                'currentEnrollmentCount': len(current_enrollments) if current_enrollments else 0,
                'passCount': len(completed_enrollments),
                'hoursToComplete': avg_days, 
                'difficulty': min(max(int(avg_days/30), 1), 4),  
                'teacher': teacher_name,
                'reviews': reviews,
                "dropCount": incomplete_enrollments,
                "numAssessments": len(course.assessments)
            })

        return jsonify(courses_list)
    except Exception as e:
        print(f"Error in get_courses: {str(e)}")
        return jsonify({'error': str(e)}), 500