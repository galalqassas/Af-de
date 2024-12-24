import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.db import singleton_db
db = singleton_db.get_db
class Course(db.Model):
    __tablename__ = 'course'
    course_id = db.Column(db.Integer, primary_key=True)
    course_name = db.Column(db.String(255), nullable=False)
    course_description = db.Column(db.Text, nullable=False)
    teacher_id = db.Column(db.Integer, db.ForeignKey('teacher.teacher_id'))
    num_assessments = db.Column(db.Integer, nullable=False, default=0)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    image_url = db.Column(db.String(255))

    # Relationships
    teacher = db.relationship('Teacher', back_populates='courses', lazy=True)
    sessions = db.relationship('Session', back_populates='course', lazy=True)
    quizzes = db.relationship('Quiz', back_populates='course', lazy=True)
    course_content = db.relationship('CourseContent', back_populates='course', lazy=True)
    enrollments = db.relationship('Enrollment', back_populates='course', lazy=True)
    payments = db.relationship('Payment', back_populates='course', lazy=True)
    assessments = db.relationship('CourseAssessment', back_populates='course', lazy=True)
    ratings = db.relationship('CourseRating', back_populates='course', lazy=True)
    notifications = db.relationship('Notification', back_populates='course', lazy=True)


class CourseContent(db.Model):
    __tablename__ = 'course_content'

    content_id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('course.course_id'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    content_type = db.Column(db.String(255), nullable=False)
    post_date = db.Column(db.Date, nullable=False)

    # Relationships
    course = db.relationship('Course', back_populates='course_content', lazy=True)

class CourseAssessment(db.Model):
    __tablename__ = 'course_assessment'
    assessment_id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('course.course_id'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    max_score = db.Column(db.Integer, nullable=False)
    post_date = db.Column(db.Date, nullable=False)
    deadline = db.Column(db.Date, nullable=False)

    # Relationships
    course = db.relationship('Course', back_populates='assessments', lazy=True)
    progress = db.relationship('StudentProgress', back_populates='assessment', lazy=True)

class CourseRating(db.Model):
    __tablename__ = 'course_rating'
    rating_id = db.Column(db.Integer, primary_key=True)
    rated_by = db.Column(db.Integer, db.ForeignKey('student.student_id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('course.course_id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    feedback = db.Column(db.Text, nullable=True)

    # Relationships
    course = db.relationship('Course', back_populates='ratings', lazy=True)
    student = db.relationship('Student', back_populates='course_ratings', lazy=True)
