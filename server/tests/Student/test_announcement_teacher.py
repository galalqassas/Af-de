import pytest
from models import Teacher, Notification, Enrollment, Course, StudentNotification, Student
from datetime import datetime

@pytest.fixture
def setup_data(test_session):

    teacher1 = Teacher(name="TestMan1", email="testman1@example.com", password="password123", designation="Professor")
    teacher2 = Teacher(name="TestMan2", email="testman2@example.com", password="password123", designation="Assistant Professor")

    course1 = Course(course_name="Web Development", course_description="Introduction to Web", teacher=teacher1, price=100.00)
    course2 = Course(course_name="Python", course_description="Introduction to Python", teacher=teacher2, price=150.00)

    student = Student(name="TestStudent1", email="teststudent1@example.com", password="password123")

    enrollment1 = Enrollment(student=student, course=course1, enrollment_date=datetime.utcnow())
    enrollment2 = Enrollment(student=student, course=course2, enrollment_date=datetime.utcnow())

    notification1 = Notification(course=course1, teacher=teacher1, message="Math 101 exam on Friday", created_at=datetime.utcnow())
    notification2 = Notification(course=course2, teacher=teacher2, message="Physics lab canceled", created_at=datetime.utcnow())

    student_notification1 = StudentNotification(student=student, notification=notification1)
    student_notification2 = StudentNotification(student=student, notification=notification2)

    test_session.add_all([teacher1, teacher2, course1, course2, student, enrollment1, enrollment2, notification1, notification2, student_notification1, student_notification2])
    test_session.commit()

    return student

# Test case: Missing student ID in the request
def test_announcements_and_teachers_no_student_id(client):

    response = client.get('/announcements_and_teachers')
    assert response.status_code == 400
    assert response.json["error"] == "Student ID is required"

# Test case: No enrollments for the student
def test_announcements_and_teachers_no_enrollments(client, test_session):

    student = Student(name="TestStudent2", email="teststudent2@example.com", password="password123")
    test_session.add(student)
    test_session.commit()

    response = client.get(f'/announcements_and_teachers?student_id={student.student_id}')
    
    assert response.status_code == 200
    assert response.json == {"announcements": [], "teachers": []}

# Test case: Successful retrieval of announcements and teachers
def test_announcements_and_teachers_success(client, setup_data):

    student = setup_data 

    response = client.get(f'/announcements_and_teachers?student_id={student.student_id}')
    
    assert response.status_code == 200

    data = response.json
    
    assert "announcements" in data
    assert "teachers" in data

    assert len(data["teachers"]) == 2
    assert data["teachers"][0]["name"] == "TestMan1"
    assert data["teachers"][1]["name"] == "TestMan2"

    assert len(data["announcements"]) == 2
    assert "Math 101 exam on Friday" in [announcement["message"] for announcement in data["announcements"]]
    assert "Physics lab canceled" in [announcement["message"] for announcement in data["announcements"]]
