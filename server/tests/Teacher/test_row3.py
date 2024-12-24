import pytest
from datetime import datetime
from models import Course, Session, Teacher, CourseAssessment, StudentProgress, Student
from werkzeug.security import generate_password_hash



@pytest.fixture
def seed_session_activity_data(test_session):
    teacher = Teacher(
        teacher_id=1,
        name="Test Teacher",
        email="teacher@example.com",
        password=generate_password_hash("password123")
    )
    course1 = Course(
        course_id=1,
        course_name="Course 1",
        teacher_id=1,
        course_description="Sample Course 1",
        price=150.00
    )
    course2 = Course(
        course_id=2,
        course_name="Course 2",
        teacher_id=1,
        course_description="Sample Course 2",
        price=200.00
    )
    session1 = Session(
        session_id=1,
        course_id=1,
        teacher_id=1,
        session_date=datetime.utcnow(),
        session_link="http://session1.com"
    )
    session2 = Session(
        session_id=2,
        course_id=1,
        teacher_id=1,
        session_date=datetime.utcnow(),
        session_link="http://session2.com"
    )
    session3 = Session(
        session_id=3,
        course_id=2,
        teacher_id=1, 
        session_date=datetime.utcnow(),
        session_link="http://session3.com"
    )
    test_session.add_all([teacher, course1, course2, session1, session2, session3])
    test_session.commit()



def test_get_session_activity(client, seed_session_activity_data):
    response = client.get('/dashboard/session-activity?teacher_id=1')
    assert response.status_code == 200
    assert len(response.json) == 1
    assert response.json[0]["id"] == "Sessions"
    assert len(response.json[0]["data"]) == 2
    assert {"x": "Course 1", "y": 2} in response.json[0]["data"]
    assert {"x": "Course 2", "y": 1} in response.json[0]["data"]


def test_get_session_activity_no_courses(client, test_session):
    response = client.get('/dashboard/session-activity?teacher_id=9999')
    assert response.status_code == 200
    assert len(response.json) == 1
    assert response.json[0]["id"] == "Sessions"
    assert response.json[0]["data"] == []


@pytest.fixture
def seed_assessment_scores_data(test_session):
    teacher = Teacher(
        teacher_id=1,
        name="Test Teacher",
        email="teacher@example.com",
        password=generate_password_hash("password123")
    )
    course1 = Course(
        course_id=1,
        course_name="Course 1",
        teacher_id=1,
        course_description="Sample Course 1",
        price=120.00
    )
    course2 = Course(
        course_id=2,
        course_name="Course 2",
        teacher_id=1,
        course_description="Sample Course 2",
        price=180.00
    )
    assessment1 = CourseAssessment(
        assessment_id=1,
        title="Assessment 1",
        course_id=1,
        post_date=datetime.utcnow(),
        max_score=100,
        deadline=datetime.utcnow()
    )
    assessment2 = CourseAssessment(
        assessment_id=2,
        title="Assessment 2",
        course_id=1,
        post_date=datetime.utcnow(),
        max_score=100,
        deadline=datetime.utcnow()
    )
    student1 = Student(
        student_id=1,
        name="Student One",
        email="student1@example.com",
        password=generate_password_hash("password123")
    )
    student2 = Student(
        student_id=2,
        name="Student Two",
        email="student2@example.com",
        password=generate_password_hash("password123")
    )
    progress1 = StudentProgress(
        student_id=1,
        assessment_id=1,
        score=85,
        status="pass"
    )
    progress2 = StudentProgress(
        student_id=2,
        assessment_id=1,
        score=90,
        status="pass"
    )
    progress3 = StudentProgress(
        student_id=1,
        assessment_id=2,
        score=70,
        status="pass"
    )

    test_session.add_all([teacher, course1, course2, assessment1, assessment2, student1, student2, progress1, progress2, progress3])
    test_session.commit()




def test_get_assessment_scores(client, seed_assessment_scores_data):
    response = client.get('/dashboard/assessment-scores?teacher_id=1')
    assert response.status_code == 200
    assert len(response.json) == 2
    assert response.json[0] == {"assessment": "Assessment 1", "Average Score": 87.5}
    assert response.json[1] == {"assessment": "Assessment 2", "Average Score": 70.0}


def test_get_assessment_scores_no_teacher_id(client):
    response = client.get('/dashboard/assessment-scores')
    assert response.status_code == 400
    assert response.json["error"] == "teacher_id is required"


def test_get_assessment_scores_no_assessments(client, test_session):
    response = client.get('/dashboard/assessment-scores?teacher_id=1')
    assert response.status_code == 200
    assert response.json == []
