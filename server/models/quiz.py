from utils.db import singleton_db

db = singleton_db.get_db

class Quiz(db.Model):
    __tablename__ = 'quiz'

    quiz_id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('course.course_id'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    max_score = db.Column(db.Integer, nullable=False)
    post_date = db.Column(db.Date, nullable=False)
    deadline = db.Column(db.Date, nullable=False)
    question = db.Column(db.String(255), nullable=True)
    option_a = db.Column(db.Text, nullable=True)
    option_b = db.Column(db.Text, nullable=True)
    option_c = db.Column(db.Text, nullable=True)
    option_d = db.Column(db.Text, nullable=True)
    answer = db.Column(db.String(10), nullable=True)

    # Relationships
    course = db.relationship('Course', back_populates='quizzes', lazy=True)
    student_quiz_progress = db.relationship('StudentQuizProgress', back_populates='quiz', lazy=True)

    


class StudentQuizProgress(db.Model):
    __tablename__ = 'student_quiz_progress'

    progress_id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student.student_id'), nullable=False)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.quiz_id'), nullable=False)
    current_score = db.Column(db.Integer, default=0, nullable=True)
    status = db.Column(db.Enum('in_progress', 'completed'), default='in_progress', nullable=False)
    completion_date = db.Column(db.Date, nullable=True)

    # Relationships
    student = db.relationship('Student', back_populates='quiz_progress', lazy=True)
    quiz = db.relationship('Quiz', back_populates='student_quiz_progress', lazy=True)
