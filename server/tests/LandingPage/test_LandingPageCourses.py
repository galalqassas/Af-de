import pytest
from models import Course, Teacher
from werkzeug.security import generate_password_hash


@pytest.fixture
def seed_landing_page_courses_data(test_session):
    teacher = Teacher(
        teacher_id=1,
        name="Test Teacher",
        email="teacher@example.com",
        password=generate_password_hash("password123"),
    )
    course1 = Course(
        course_id=1,
        course_name="Course 1",
        course_description="Description for Course 1",
        teacher_id=1,
        price=50.00,
        image_url="http://example.com/course1.jpg"
    )
    course2 = Course(
        course_id=2,
        course_name="Course 2",
        course_description="Description for Course 2",
        teacher_id=1,
        price=75.00,
        image_url="http://example.com/course2.jpg"
    )
    test_session.add_all([teacher, course1, course2])
    test_session.commit()


def test_get_courses(client, seed_landing_page_courses_data):
    response = client.get('/LandingPageCourses')
    assert response.status_code == 200
    data = response.json
    assert len(data) == 2

    assert data[0]['course_id'] == 1
    assert data[0]['course_name'] == "Course 1"
    assert data[0]['description'] == "Description for Course 1"
    assert data[0]['price'] == 50.00
    assert data[0]['image_url'] == "http://example.com/course1.jpg"

    assert data[1]['course_id'] == 2
    assert data[1]['course_name'] == "Course 2"
    assert data[1]['description'] == "Description for Course 2"
    assert data[1]['price'] == 75.00
    assert data[1]['image_url'] == "http://example.com/course2.jpg"


def test_get_courses_no_data(client, test_session):
    response = client.get('/LandingPageCourses')
    assert response.status_code == 200
    assert isinstance(response.json, list)
    assert len(response.json) == 0
