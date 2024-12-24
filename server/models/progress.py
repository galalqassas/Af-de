import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.db import singleton_db
db = singleton_db.get_db
from models.badge import StudentBadge

class StudentProgress(db.Model):
    __tablename__ = 'student_progress'
    progress_id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student.student_id'), nullable=False)
    assessment_id = db.Column(db.Integer, db.ForeignKey('course_assessment.assessment_id'), nullable=False)
    status = db.Column(db.Enum('pass', 'fail'), nullable=False)
    completion_date = db.Column(db.Date, nullable=True)
    score = db.Column(db.Integer, nullable=False)

    # Relationships
    student = db.relationship('Student', back_populates='progress', lazy=True)
    assessment = db.relationship('CourseAssessment', back_populates='progress', lazy=True)