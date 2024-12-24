import pytest
from datetime import datetime
from models import Student, Course, Enrollment


# Fixture to set up student and courses for testing.
@pytest.fixture
def setup_student_and_courses(test_session):
    student = Student(name="TestMan1", email="testman1@example.com", password="password123")
    test_session.add(student)
    test_session.commit()  

    course1 = Course(
        course_name="Python Basics",
        course_description="Learn the basics of Python programming.",
        price=99.99,
        image_url="https://example.com/python.jpg"
    )
    course2 = Course(
        course_name="Data Science Fundamentals",
        course_description="An introduction to data science concepts.",
        price=149.99,
        image_url="https://example.com/data-science.jpg"
    )
    test_session.add_all([course1, course2])
    test_session.commit()  

    enrollment1 = Enrollment(
        student_id=student.student_id,
        course_id=course1.course_id,
        enrollment_date=datetime.utcnow()
    )
    enrollment2 = Enrollment(
        student_id=student.student_id,
        course_id=course2.course_id,
        enrollment_date=datetime.utcnow()
    )
    test_session.add_all([enrollment1, enrollment2])
    test_session.commit()

    return student


# Test case: Successful retrieval of enrolled courses for a student.
def test_get_student_enrolled_courses_success(client, setup_student_and_courses):
    student = setup_student_and_courses

    response = client.get(f"/student/enrolled-courses?student_id={student.student_id}")
    assert response.status_code == 200

    data = response.json
    assert "courses" in data
    assert len(data["courses"]) == 2


# Test case: Missing student ID in the request.
def test_get_student_enrolled_courses_missing_student_id(client):
    response = client.get("/student/enrolled-courses")
    assert response.status_code == 400
    assert response.json["error"] == "Student ID is required to fetch enrolled courses."


# Test case: Student exists but has no enrolled courses.
def test_get_student_enrolled_courses_no_courses(client, test_session):

    student = Student(name="TestMan2", email="testman2@example.com", password="password123")
    test_session.add(student)
    test_session.commit()

    response = client.get(f"/student/enrolled-courses?student_id={student.student_id}")
    assert response.status_code == 200
    assert response.json["courses"] == []
