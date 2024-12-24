import pytest
from models import Teacher, Course
from werkzeug.security import generate_password_hash


@pytest.fixture
def seed_teachers_data(test_session):
    teacher1 = Teacher(
        teacher_id=1,
        name="John Doe",
        email="johndoe@example.com",
        password=generate_password_hash("password123"),
        profile_picture="http://example.com/john.jpg",
        facebook_url="http://facebook.com/johndoe",
        twitter_url="http://twitter.com/johndoe",
        linkedin_url="http://linkedin.com/in/johndoe",
        designation="Senior Lecturer"
    )
    teacher2 = Teacher(
        teacher_id=2,
        name="Jane Smith",
        email="janesmith@example.com",
        password=generate_password_hash("password123"),
        profile_picture="http://example.com/jane.jpg",
        facebook_url="http://facebook.com/janesmith",
        twitter_url="http://twitter.com/janesmith",
        linkedin_url="http://linkedin.com/in/janesmith",
        designation="Assistant Professor"
    )
    teacher3 = Teacher(
        teacher_id=3,
        name="Mark Taylor",
        email="marktaylor@example.com",
        password=generate_password_hash("password123"),
        profile_picture="http://example.com/mark.jpg",
        facebook_url="http://facebook.com/marktaylor",
        twitter_url="http://twitter.com/marktaylor",
        linkedin_url="http://linkedin.com/in/marktaylor",
        designation="Professor"
    )
    teacher4 = Teacher(
        teacher_id=4,
        name="Emma Watson",
        email="emmawatson@example.com",
        password=generate_password_hash("password123"),
        profile_picture="http://example.com/emma.jpg",
        facebook_url="http://facebook.com/emmawatson",
        twitter_url="http://twitter.com/emmawatson",
        linkedin_url="http://linkedin.com/in/emmawatson",
        designation="Lecturer"
    )
    course1 = Course(course_id=1, course_name="Course A", teacher_id=1, course_description="Description A", price=50.0)
    course2 = Course(course_id=2, course_name="Course B", teacher_id=1, course_description="Description B", price=75.0)
    course3 = Course(course_id=3, course_name="Course C", teacher_id=2, course_description="Description C", price=100.0)

    test_session.add_all([teacher1, teacher2, teacher3, teacher4, course1, course2, course3])
    test_session.commit()


def test_get_teachers(client, seed_teachers_data):
    response = client.get('/teachers')
    assert response.status_code == 200

    data = response.json
    assert len(data) == 3
    assert data[0]['teacher_id'] == 1
    assert data[0]['name'] == "John Doe"
    assert data[0]['designation'] == "Senior Lecturer"
    assert data[0]['profile_picture'] == "http://example.com/john.jpg"
    assert data[0]['course_count'] == 2

    assert data[1]['teacher_id'] == 2
    assert data[1]['name'] == "Jane Smith"
    assert data[1]['designation'] == "Assistant Professor"
    assert data[1]['profile_picture'] == "http://example.com/jane.jpg"
    assert data[1]['course_count'] == 1

    assert data[2]['teacher_id'] == 3
    assert data[2]['name'] == "Mark Taylor"
    assert data[2]['designation'] == "Professor"
    assert data[2]['profile_picture'] == "http://example.com/mark.jpg"
    assert data[2]['course_count'] == 0


def test_get_teachers_no_data(client, test_session):
    response = client.get('/teachers')
    assert response.status_code == 200
    assert isinstance(response.json, list)
    assert len(response.json) == 0
