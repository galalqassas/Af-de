import pytest
from datetime import datetime
from models import Student, Course, Enrollment

@pytest.fixture
def setup_student_dashboard_data(test_session):
    student = Student(name="TestMan1", email="testman1@example.com", password="password123")
    test_session.add(student)
    test_session.commit()

    course1 = Course(course_name="TestCourse1", course_description="Learn Python basics.", price=100.00)
    course2 = Course(course_name="TestCourse2", course_description="Introduction to Data Science.", price=120.00)
    course3 = Course(course_name="TestCourse3", course_description="Advanced ML topics.", price=150.00)

    test_session.add_all([course1, course2, course3])
    test_session.commit()

    enrollment = Enrollment(
        student_id=student.student_id,
        course_id=course1.course_id,
        enrollment_date=datetime.utcnow()
    )
    test_session.add(enrollment)
    test_session.commit()

    return student


# Test case: Successful retrieval of courses for the student.
def test_get_student_dashboard_courses_success(client, setup_student_dashboard_data):
    student = setup_student_dashboard_data

    response = client.get(f"/StudentDashboardCourses?student_id={student.student_id}")
    assert response.status_code == 200

    data = response.json
    assert len(data) == 2  
    assert "TestCourse1" not in [course["course_name"] for course in data]
    assert "TestCourse2" in [course["course_name"] for course in data]
    assert "TestCourse3" in [course["course_name"] for course in data]


# Test case: Student not found for the given student ID.
def test_get_student_dashboard_courses_student_not_found(client, test_session):
    non_existent_id = 9999
    student = test_session.query(Student).filter_by(student_id=non_existent_id).first()
    assert student is None  

    response = client.get(f"/StudentDashboardCourses?student_id={non_existent_id}")
    
    print(f"Response Status: {response.status_code}")
    print(f"Response Data: {response.json}")

    assert response.status_code == 404
    assert response.json["error"] == "Student not found."


# Test case: Missing student ID in the request.
def test_get_student_dashboard_courses_missing_student_id(client):
    response = client.get("/StudentDashboardCourses")
    assert response.status_code == 400
    assert response.json["error"] == "Student ID is required to fetch courses."
