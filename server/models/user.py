from utils.db import singleton_db  

db = singleton_db.get_db  

class Student(db.Model):  
    __tablename__ = 'student'

    student_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)

    # Relationships
    parents = db.relationship('Parent', back_populates='student', lazy=True)
    enrollments = db.relationship('Enrollment', back_populates='student', lazy=True)
    payments = db.relationship('Payment', back_populates='student', lazy=True)
    progress = db.relationship('StudentProgress', back_populates='student', lazy=True)
    quiz_progress = db.relationship('StudentQuizProgress', back_populates='student', lazy=True)
    student_badges = db.relationship('StudentBadge', back_populates='student', lazy=True)
    notifications = db.relationship('StudentNotification', back_populates='student', lazy=True)
    course_ratings = db.relationship('CourseRating', back_populates='student', lazy=True)


class Teacher(db.Model):
    __tablename__ = 'teacher'

    teacher_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    profile_picture = db.Column(db.String(255), nullable=True)
    facebook_url = db.Column(db.String(255), nullable=True)
    twitter_url = db.Column(db.String(255), nullable=True)
    linkedin_url = db.Column(db.String(255), nullable=True)
    hiring_status = db.Column(db.Enum('pending', 'hired', 'rejected'), default='pending', nullable=False)
    designation = db.Column(db.String(100), nullable=True)

    # Relationships
    courses = db.relationship('Course', back_populates='teacher', lazy=True)
    sessions = db.relationship('Session', back_populates='teacher', lazy=True)
    notifications = db.relationship('Notification', back_populates='teacher', lazy=True)
    hiring_requests = db.relationship('HiringRequest', back_populates='teacher', lazy=True)


class Parent(db.Model):
    __tablename__ = 'parent'

    parent_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('student.student_id'), nullable=False)

    # Relationships
    student = db.relationship('Student', back_populates='parents', lazy=True)


class Admin(db.Model):
    __tablename__ = 'admin'

    admin_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
