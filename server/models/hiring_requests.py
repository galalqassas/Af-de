import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.db import singleton_db
db = singleton_db.get_db 
 
class HiringRequest(db.Model):
    __tablename__ = 'hiring_request'
    request_id = db.Column(db.Integer, primary_key=True)
    teacher_id = db.Column(db.Integer, db.ForeignKey('teacher.teacher_id'), nullable=False)
    status = db.Column(db.Enum('pending', 'approved', 'rejected'), nullable=False)
    request_date = db.Column(db.Date, nullable=False)
    reviewed_by = db.Column(db.Integer, db.ForeignKey('admin.admin_id'), nullable=True)
    reviewed_date = db.Column(db.Date, nullable=True)

    # Relationships
    teacher = db.relationship('Teacher', back_populates='hiring_requests', lazy=True)  
    # admin = db.relationship('Admin', back_populates='hiring_requests', lazy=True)  
