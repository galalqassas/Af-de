import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.db import singleton_db
db = singleton_db.get_db  

class Enrollment(db.Model):
    __tablename__ = 'enrollment'
    enrollment_id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('course.course_id'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('student.student_id'), nullable=False)
    enrollment_date = db.Column(db.Date, nullable=False)

    # Relationships
    course = db.relationship('Course', back_populates='enrollments', lazy=True)
    student = db.relationship('Student', back_populates='enrollments', lazy=True)

