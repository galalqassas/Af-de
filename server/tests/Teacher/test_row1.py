import pytest
from datetime import datetime
from models import Course, Enrollment, Payment, CourseAssessment, StudentQuizProgress, StudentProgress, Teacher, Student


import pytest
from datetime import datetime, timedelta
from models import Course, Enrollment, Payment, CourseAssessment, StudentQuizProgress, StudentProgress, Teacher, Student, Quiz


@pytest.fixture
def seed_dashboard_test_data(test_session):
    student1 = Student(
        student_id=1,
        name="Student One",
        email="student1@example.com",
        password="password123"
    )
    student2 = Student(
        student_id=2,
        name="Student Two",
        email="student2@example.com",
        password="password123"
    )
    teacher = Teacher(
        teacher_id=1,
        name="Test Teacher",
        email="teacher@example.com",
        password="password123"
    )
    course = Course(
        course_id=1,
        course_name="Test Course",
        course_description="A sample course",
        teacher_id=1,
        price=100.00
    )
    enrollment1 = Enrollment(
        student_id=1,
        course_id=1,
        enrollment_date=datetime.utcnow()
    )
    enrollment2 = Enrollment(
        student_id=2,
        course_id=1,
        enrollment_date=datetime.utcnow()
    )
    payment = Payment(
        student_id=1,
        course_id=1,
        amount=200.00,
        payment_date=datetime.utcnow(),
        card_last_four_digits="1234",
        card_month="12",
        card_year="25",
        card_cvv="123"
    )
    quiz = Quiz(
        quiz_id=1,
        course_id=1,
        title="Sample Quiz",
        max_score=10,
        post_date=datetime.utcnow(),
        deadline=(datetime.utcnow() + timedelta(days=7))
    )
    quiz_progress = StudentQuizProgress(
        quiz_id=1,
        student_id=1,
        status='completed',
        current_score=8,
        completion_date=datetime.utcnow()
    )
    assessment = CourseAssessment(
        assessment_id=1,
        course_id=1,
        title="Test Assessment",
        post_date=datetime.utcnow(),
        max_score=100,
        deadline=(datetime.utcnow() + timedelta(days=7))
    )
    student_progress = StudentProgress(
        assessment_id=1,
        student_id=2,
        status='fail',
        score=50,
        completion_date=None
    )
    test_session.add_all([
        student1, student2, teacher, course,
        enrollment1, enrollment2, payment,
        quiz, quiz_progress, assessment, student_progress
    ])
    test_session.commit()






def test_get_students_enrolled(client, seed_dashboard_test_data):
    response = client.get('/dashboard/students-enrolled?teacher_id=1')
    assert response.status_code == 200
    assert response.json == {
        "title": "2",
        "subTitle": "Students Enrolled"
    }


def test_get_students_enrolled_missing_teacher_id(client):
    response = client.get('/dashboard/students-enrolled')
    assert response.status_code == 400
    assert response.json["error"] == "teacher_id is required"


def test_get_money_obtained(client, seed_dashboard_test_data):
    response = client.get('/dashboard/money-obtained?teacher_id=1')
    assert response.status_code == 200
    assert response.json == {
        "title": "200.00",
        "subTitle": "Money Obtained"
    }


def test_get_money_obtained_missing_teacher_id(client):
    response = client.get('/dashboard/money-obtained')
    assert response.status_code == 400
    assert response.json["error"] == "teacher_id is required"


def test_get_last_assignment_completed(client, seed_dashboard_test_data):
    response = client.get('/dashboard/last-assignment-completed?teacher_id=1')
    assert response.status_code == 200
    assert response.json == {
        "title": "1",
        "subTitle": "Students Completed Last Assignment"
    }


def test_get_last_assignment_completed_no_assignments(client, test_session):
    test_session.query(CourseAssessment).delete()
    test_session.commit()

    response = client.get('/dashboard/last-assignment-completed?teacher_id=1')
    assert response.status_code == 200
    assert response.json == {
        "title": "0",
        "subTitle": "Students Completed Last Assignment"
    }


def test_get_pending_assignments(client, seed_dashboard_test_data):
    response = client.get('/dashboard/pending-assignments?teacher_id=1')
    assert response.status_code == 200
    assert response.json == {
        "title": "0",
        "subTitle": "Pending Assignments"
    }


def test_get_pending_assignments_no_pending(client, test_session):
    test_session.query(StudentProgress).delete()
    test_session.commit()

    response = client.get('/dashboard/pending-assignments?teacher_id=1')
    assert response.status_code == 200
    assert response.json == {
        "title": "0",
        "subTitle": "Pending Assignments"
    }
