import pytest
from models import Student


@pytest.fixture
def setup_timetable_data_no_sessions(test_session):
    student = Student(name="TestMan1", email="testman1@example.com", password="password123")
    test_session.add(student)
    test_session.commit()
    return student


# Test case: Missing student ID in the request. 
def test_get_student_timetable_missing_student_id(client):
    response = client.get('/student/timetable')
    assert response.status_code == 400
    assert response.json["error"] == "Student ID is required"


# Test case: Student with no enrollments or sessions.
def test_get_student_timetable_no_sessions(client, setup_timetable_data_no_sessions):
    student = setup_timetable_data_no_sessions

    response = client.get(f'/student/timetable?student_id={student.student_id}')
    assert response.status_code == 200
    assert response.json["timetable"] == []


# Test case: Simulates a database error.
def test_get_student_timetable_internal_error(client, mocker):
    mocker.patch("utils.db.db.session.execute", side_effect=Exception("Simulated database error"))
    response = client.get('/student/timetable?student_id=1')
    assert response.status_code == 500
    assert "Simulated database error" in response.json["error"]
