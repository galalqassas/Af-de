import pytest
from models import Course, Teacher
from werkzeug.security import generate_password_hash


@pytest.fixture
def seed_course_data(test_session):
    teacher1 = Teacher(
        teacher_id=1,
        name="Teacher One",
        email="teacher1@example.com",
        password=generate_password_hash("password123"),
        profile_picture="http://example.com/teacher1.jpg"
    )
    teacher2 = Teacher(
        teacher_id=2,
        name="Teacher Two",
        email="teacher2@example.com",
        password=generate_password_hash("password123"),
        profile_picture="http://example.com/teacher2.jpg"
    )
    course1 = Course(
        course_id=1,
        course_name="Course One",
        course_description="Description for Course One",
        teacher_id=1,
        price=100.00,
        image_url="http://example.com/course1.jpg"
    )
    course2 = Course(
        course_id=2,
        course_name="Course Two",
        course_description="Description for Course Two",
        teacher_id=1,
        price=200.00,
        image_url="http://example.com/course2.jpg"
    )
    course3 = Course(
        course_id=3,
        course_name="Course Three",
        course_description="Description for Course Three",
        teacher_id=2,
        price=300.00,
        image_url="http://example.com/course3.jpg"
    )

    test_session.add_all([teacher1, teacher2, course1, course2, course3])
    test_session.commit()


def test_get_courses_all(client, seed_course_data):
    response = client.get('/courses')
    assert response.status_code == 200

    data = response.json
    assert len(data) == 3
    assert data[0]['course_name'] == "Course One"
    assert data[1]['course_name'] == "Course Two"
    assert data[2]['course_name'] == "Course Three"


def test_get_courses_by_teacher(client, seed_course_data):
    response = client.get('/courses?teacher_id=1')
    assert response.status_code == 200

    data = response.json
    assert len(data) == 2
    assert data[0]['course_name'] == "Course One"
    assert data[1]['course_name'] == "Course Two"

    response = client.get('/courses?teacher_id=2')
    assert response.status_code == 200

    data = response.json
    assert len(data) == 1
    assert data[0]['course_name'] == "Course Three"


def test_get_courses_no_courses(client, test_session):
    response = client.get('/courses')
    assert response.status_code == 200
    assert len(response.json) == 0


def test_get_courses_invalid_teacher(client, test_session):
    response = client.get('/courses?teacher_id=999')
    assert response.status_code == 200
    assert len(response.json) == 0
