import pytest
from models import Course, Teacher, CourseContent, CourseRating, Student
from werkzeug.security import generate_password_hash
from datetime import datetime


@pytest.fixture
def seed_course_page_data(test_session):
    from models import Teacher, Course, CourseContent, CourseRating, Student
    teacher = Teacher(
        teacher_id=1,
        name="Test Teacher",
        email="teacher@example.com",
        password=generate_password_hash("password123"),
        profile_picture="http://example.com/teacher.jpg"
    )
    course = Course(
        course_id=1,
        course_name="Test Course",
        course_description="A sample course",
        teacher_id=1,
        price=99.99,
        image_url="http://example.com/course.jpg"
    )
    content1 = CourseContent(
        content_id=1,
        course_id=1,
        title="Introduction to Course",
        content_type="video",
        post_date=datetime.utcnow()
    )
    content2 = CourseContent(
        content_id=2,
        course_id=1,
        title="Advanced Topics",
        content_type="video",
        post_date=datetime.utcnow()
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
    rating1 = CourseRating(
        rating_id=1,
        rated_by=1,
        course_id=1,
        rating=4,
        feedback="Great course!"
    )
    rating2 = CourseRating(
        rating_id=2,
        rated_by=2,
        course_id=1,
        rating=5,
        feedback="Very informative."
    )

    test_session.add_all([teacher, course, content1, content2, student1, student2, rating1, rating2])
    test_session.commit()


def test_get_course(client, seed_course_page_data):
    response = client.get('/courses/1')
    assert response.status_code == 200

    data = response.json
    assert data['course_id'] == 1
    assert data['course_name'] == "Test Course"
    assert data['teacher_id'] == 1
    assert data['teacher_name'] == "Test Teacher"
    assert data['price'] == 99.99
    assert len(data['contents']) == 2
    assert data['contents'][0]['title'] == "Introduction to Course"
    assert data['average_rating'] == 4.5
    assert data['rating_count'] == 2



def test_get_course_ratings(client, seed_course_page_data):
    response = client.get('/courses/1/ratings')
    assert response.status_code == 200

    data = response.json
    assert len(data) == 2
    assert data[0]['student_name'] == "Student One"
    assert data[0]['rating'] == 4
    assert data[0]['comment'] == "Great course!"
    assert data[1]['student_name'] == "Student Two"
    assert data[1]['rating'] == 5
    assert data[1]['comment'] == "Very informative."


def test_get_course_ratings_no_ratings(client, test_session):
    from models import Course, Teacher
    teacher = Teacher(
        teacher_id=1,
        name="Test Teacher",
        email="teacher@example.com",
        password=generate_password_hash("password123"),
        profile_picture="http://example.com/teacher.jpg"
    )
    course = Course(
        course_id=1,
        course_name="Test Course",
        course_description="A sample course",
        teacher_id=1,
        price=99.99,
        image_url="http://example.com/course.jpg"
    )
    test_session.add_all([teacher, course])
    test_session.commit()

    response = client.get('/courses/1/ratings')
    assert response.status_code == 200
    assert isinstance(response.json, list)
    assert len(response.json) == 0
