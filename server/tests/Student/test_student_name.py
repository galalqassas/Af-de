import pytest
from models import Student


@pytest.fixture
def add_sample_student(test_session):
    student = Student(name="TestMan1", email="testman1@example.com", password="password123")
    test_session.add(student)
    test_session.commit()  
    return student


# Test case: Successful retrieval of student name by student ID.
def test_get_student_name_success(client, add_sample_student):
    student = add_sample_student  

    response = client.get(f'/studentname?student_id={student.student_id}')
    assert response.status_code == 200
    assert response.json['student_name'] == student.name


# Test case: Missing student ID in the request.
def test_get_student_name_missing_id(client):
    response = client.get('/studentname')
    assert response.status_code == 400
    assert "Student ID is required" in response.json['error']


# Test case: Student not found for a non-existent student ID.
def test_get_student_name_not_found(client, test_session):
    non_existent_id = 9999
    student = test_session.query(Student).filter_by(student_id=non_existent_id).first()
    assert student is None  

    response = client.get(f'/studentname?student_id={non_existent_id}')
    
    print(f"Response Status: {response.status_code}")
    print(f"Response Data: {response.json}")

    assert response.status_code == 404
    assert response.json["error"] == "Not Found"
