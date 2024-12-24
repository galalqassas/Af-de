import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.db import singleton_db
db = singleton_db.get_db

class Session(db.Model):
    __tablename__ = 'session'
    session_id = db.Column(db.Integer, primary_key=True)
    teacher_id = db.Column(db.Integer, db.ForeignKey('teacher.teacher_id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('course.course_id'), nullable=False)
    session_date = db.Column(db.Date, nullable=False)
    session_link = db.Column(db.String(255), nullable=True)
    # Relationships
    teacher = db.relationship('Teacher', back_populates='sessions', lazy=True)
    course = db.relationship('Course', back_populates='sessions', lazy=True)