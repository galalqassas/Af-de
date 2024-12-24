import pytest
from models import Enrollment, StudentQuizProgress, Quiz, Student, Course
from datetime import date

@pytest.fixture
def setup_performance_data(test_session):
    course = Course(
        course_name="Python Programming",
        course_description="A course about Python.",
        price=100.00
    )
    student = Student(name="TestMan1", email="testman1@example.com", password="password123")

    test_session.add_all([course, student])
    test_session.commit()

    quiz1 = Quiz(
        course_id=course.course_id,
        title="Quiz 1",
        max_score=100,
        post_date=date.today(),
        deadline=date.today(),
        question="What is Python?",
        answer="A programming language"
    )

    quiz2 = Quiz(
        course_id=course.course_id,
        title="Quiz 2",
        max_score=50,
        post_date=date.today(),
        deadline=date.today(),
        question="What is a function?",
        answer="Reusable code"
    )

    test_session.add_all([quiz1, quiz2])
    test_session.commit()

    enrollment = Enrollment(student_id=student.student_id, course_id=course.course_id, enrollment_date=date.today())

    progress1 = StudentQuizProgress(
        student_id=student.student_id,
        quiz_id=quiz1.quiz_id,
        current_score=80,
        status="completed",
        completion_date=date.today()
    )

    progress2 = StudentQuizProgress(
        student_id=student.student_id,
        quiz_id=quiz2.quiz_id,
        current_score=40,
        status="in_progress"
    )

    test_session.add_all([enrollment, progress1, progress2])
    test_session.commit()

    return student


# Test case: Successful retrieval of student performance data.
def test_student_performance_success(client, setup_performance_data):
    student = setup_performance_data

    response = client.get(f'/student/performance?student_id={student.student_id}')
    assert response.status_code == 200

    data = response.json
    assert "total_courses" in data
    assert "total_quizzes" in data
    assert "completed_quizzes" in data
    assert "in_progress_quizzes" in data
    assert "quizzes" in data

    assert data["total_courses"] == 1
    assert data["total_quizzes"] == 2
    assert data["completed_quizzes"] == 1
    assert data["in_progress_quizzes"] == 1
    assert len(data["quizzes"]) == 2


# Test case: Student with no enrollments.
def test_student_performance_no_courses(client, test_session):

    student = Student(name="TestMan2", email="testman2@example.com", password="password123")
    test_session.add(student)
    test_session.commit()

    response = client.get(f'/student/performance?student_id={student.student_id}')
    assert response.status_code == 200
    assert response.json == {
        "total_courses": 0,
        "total_quizzes": 0,
        "completed_quizzes": 0,
        "in_progress_quizzes": 0,
        "quizzes": []
    }


# Test case: Missing student ID in the request.
def test_student_performance_missing_student_id(client):
    response = client.get('/student/performance')
    assert response.status_code == 400
    assert response.json["error"] == "Student ID is required"
