from utils.db import singleton_db
db = singleton_db.get_db
class Payment(db.Model):
    __tablename__ = 'payment'

    payment_id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student.student_id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('course.course_id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    payment_date = db.Column(db.Date, nullable=False)
    card_last_four_digits = db.Column(db.String(4), nullable=False)
    card_month = db.Column(db.Integer, nullable=False)
    card_year = db.Column(db.Integer, nullable=False)
    card_cvv = db.Column(db.String(3), nullable=False)

    # Relationships
    student = db.relationship('Student', back_populates='payments', lazy=True)
    course = db.relationship('Course', back_populates='payments', lazy=True)
