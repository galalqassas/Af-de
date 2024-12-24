import pytest
from models import CourseRating, Course, Student


# Fixture to set up course and student for testing.
@pytest.fixture
def setup_course_and_student(test_session):
    course = Course(
        course_name="Python Programming",
        course_description="Learn Python basics and advanced topics.",
        price=100.00,
    )
    student = Student(name="TestMan1", email="testman1@example.com", password="password123")
    test_session.add_all([course, student])
    test_session.commit()
    return {"course": course, "student": student}


# Test successful feedback submission.
def test_submit_feedback_success(client, setup_course_and_student):
    data = setup_course_and_student
    course = data["course"]
    student = data["student"]

    feedback_payload = {
        "rated_by": student.student_id,
        "course_id": course.course_id,
        "rating": 5,
        "feedback": "Great course! Highly recommended."
    }

    response = client.post("/submit-feedback", json=feedback_payload)

    assert response.status_code == 201
    assert response.json["message"] == "Feedback submitted successfully!"

    feedback_in_db = CourseRating.query.filter_by(
        rated_by=student.student_id, course_id=course.course_id
    ).first()

    assert feedback_in_db is not None
    assert feedback_in_db.rating == 5
    assert feedback_in_db.feedback == "Great course! Highly recommended."


# Test feedback submission with missing required fields.
def test_submit_feedback_missing_fields(client):
    incomplete_payload = {
        "rated_by": 1,  
        "feedback": "Incomplete feedback test."
    }

    response = client.post("/submit-feedback", json=incomplete_payload)

    assert response.status_code == 400
    assert response.json["error"] == "Rated_by, course_id, and rating are required."


# Test feedback submission with invalid rating value.
def test_submit_feedback_invalid_rating(client, setup_course_and_student):
    data = setup_course_and_student
    course = data["course"]
    student = data["student"]

    invalid_feedback_payload = {
        "rated_by": student.student_id,
        "course_id": course.course_id,
        "rating": 10,  
        "feedback": "Rating out of range."
    }

    response = client.post("/submit-feedback", json=invalid_feedback_payload)

    assert response.status_code == 400
    assert response.json["error"] == "Rating must be between 1 and 5."


# Test feedback submission with an internal server error.
def test_submit_feedback_internal_error(client, mocker):

    mocker.patch("models.CourseRating.__init__", side_effect=Exception("Database error"))

    feedback_payload = {
        "rated_by": 1,
        "course_id": 1,
        "rating": 5,
        "feedback": "Testing internal server error."
    }

    response = client.post("/submit-feedback", json=feedback_payload)

    assert response.status_code == 500
    assert "Internal server error" in response.json["error"]
