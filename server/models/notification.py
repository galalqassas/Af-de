import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.db import singleton_db
db = singleton_db.get_db

class Notification(db.Model):
    __tablename__ = 'notification'
    notification_id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('course.course_id'), nullable=True)
    teacher_id = db.Column(db.Integer, db.ForeignKey('teacher.teacher_id'), nullable=True)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.now(), nullable=False)

    # Relationships
    course = db.relationship('Course', back_populates='notifications', lazy=True)
    teacher = db.relationship('Teacher', back_populates='notifications', lazy=True)
    student_notifications = db.relationship('StudentNotification', back_populates='notification', lazy=True)



class StudentNotification(db.Model):
    __tablename__ = 'student_notification'
    student_notification_id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student.student_id'), nullable=False)
    notification_id = db.Column(db.Integer, db.ForeignKey('notification.notification_id'), nullable=False)
    is_pushed = db.Column(db.Boolean, default=False)

    # Relationships
    student = db.relationship('Student', back_populates='notifications', lazy=True)
    notification = db.relationship('Notification', back_populates='student_notifications', lazy=True)



