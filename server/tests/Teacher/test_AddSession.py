import pytest
from models import Session, Notification
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash


@pytest.fixture
def mock_session_data():
    return {
        "teacher_id": 1,
        "course_id": 1,
        "session_date": (datetime.now() + timedelta(days=1)).isoformat(),
        "session_link": "https://example.com/session-link"
    }


@pytest.fixture
def seed_test_data(test_session):
    from models import Teacher, Course
    teacher = Teacher(
        teacher_id=1,
        name="Test Teacher",
        email="teacher@example.com",
        password=generate_password_hash("password123")
    )
    course = Course(
        course_id=1,
        course_name="Test Course",
        course_description="Sample course",
        teacher_id=1,
        price=100.00  
    )
    test_session.add_all([teacher, course])
    test_session.commit()


def test_add_session_success(client, test_session, mock_session_data, seed_test_data):
    response = client.post("/session/add", json=mock_session_data)

    assert response.status_code == 201
    assert response.json["message"] == "Session and notification added successfully!"

    session = test_session.query(Session).filter_by(course_id=1).first()
    assert session is not None
    assert session.teacher_id == 1
    assert session.course_id == 1
    assert session.session_link == "https://example.com/session-link"

    notification = test_session.query(Notification).filter_by(course_id=1).first()
    assert notification is not None
    assert "A new session has been scheduled" in notification.message


def test_add_session_missing_fields(client, test_session):
    response = client.post("/session/add", json={
        "teacher_id": 1,
        "session_link": "https://example.com/session-link"
    })

    assert response.status_code == 400
    assert "course_id" in response.json["error"] or "session_date" in response.json["error"]


def test_add_session_invalid_date_format(client, test_session, mock_session_data):
    mock_session_data["session_date"] = "invalid-date-format"
    response = client.post("/session/add", json=mock_session_data)

    assert response.status_code == 400
    assert "Invalid isoformat string" in response.json["error"]


def test_add_session_teacher_not_found(client, test_session, mock_session_data):
    mock_session_data["teacher_id"] = 9999
    response = client.post("/session/add", json=mock_session_data)

    assert response.status_code == 400
    assert "foreign key constraint fails" in response.json["error"].lower()


def test_add_session_course_not_found(client, test_session, mock_session_data):
    mock_session_data["course_id"] = 9999
    response = client.post("/session/add", json=mock_session_data)

    assert response.status_code == 400
    assert "foreign key constraint fails" in response.json["error"].lower()
