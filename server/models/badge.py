import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.db import singleton_db
db = singleton_db.get_db
class Badge(db.Model):
    __tablename__ = 'badge'
    badge_id = db.Column(db.Integer, primary_key=True)
    badge_name = db.Column(db.String(255), nullable=False)
    badge_description = db.Column(db.Text, nullable=True)

    # Relationships
    student_badges = db.relationship('StudentBadge', back_populates='badge', lazy=True)

class StudentBadge(db.Model):
    __tablename__ = 'student_badge'
    student_badge_id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student.student_id'), nullable=False)
    badge_id = db.Column(db.Integer, db.ForeignKey('badge.badge_id'), nullable=False)
    date_awarded = db.Column(db.Date, nullable=False)

    # Relationships
    student = db.relationship('Student', back_populates='student_badges', lazy=True)
    badge = db.relationship('Badge', back_populates='student_badges', lazy=True)

