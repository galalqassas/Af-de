import pytest
from models import Course, Teacher, Student, CourseRating
from werkzeug.security import generate_password_hash
from datetime import datetime


@pytest.fixture
def seed_feedback_data(test_session):
    teacher = Teacher(
        teacher_id=1,
        name="Test Teacher",
        email="teacher@example.com",
        password=generate_password_hash("password123"),
    )
    course = Course(
        course_id=1,
        course_name="Test Course",
        course_description="A sample course",
        teacher_id=1,
        price=99.99,
        image_url="http://example.com/course.jpg"
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
    feedback1 = CourseRating(
        rating_id=1,
        rated_by=1,
        course_id=1,
        rating=4,
        feedback="Great course!"
    )
    feedback2 = CourseRating(
        rating_id=2,
        rated_by=2,
        course_id=1,
        rating=5,
        feedback="Very informative."
    )
    test_session.add_all([teacher, course, student1, student2, feedback1, feedback2])
    test_session.commit()


def test_get_all_feedbacks(client, seed_feedback_data):
    response = client.get('/ratings')
    assert response.status_code == 200

    data = response.json
    assert len(data) == 2
    assert data[0]['rating_id'] == 1
    assert data[0]['student_name'] == "Student One"
    assert data[0]['rating'] == 4
    assert data[0]['comment'] == "Great course!"
    assert data[0]['course_name'] == "Test Course"

    assert data[1]['rating_id'] == 2
    assert data[1]['student_name'] == "Student Two"
    assert data[1]['rating'] == 5
    assert data[1]['comment'] == "Very informative."
    assert data[1]['course_name'] == "Test Course"


def test_get_all_feedbacks_no_feedbacks(client, test_session):
    response = client.get('/ratings')
    assert response.status_code == 200
    assert isinstance(response.json, list)
    assert len(response.json) == 0
