from datetime import datetime
from models import Student, Course, Payment

def test_create_payment_success(client, test_session):
    student = Student(student_id=1, name="Test Student", email="test@example.com", password="password123")
    course = Course(course_id=1, course_name="Test Course", price=100.0, course_description="Sample course description")
    test_session.add_all([student, course])
    test_session.commit()
    with client.session_transaction() as session:
        session['user_id'] = 1

    response = client.post(
        '/payment?student_id=1',
        json={
            "course_id": 1,
            "amount": 100.0,
            "card_last_four_digits": "1234",
            "card_month": "12",
            "card_year": str(datetime.now().year % 100 + 1),  # next year
            "card_cvv": "123",
        }
    )

    assert response.status_code == 201
    assert response.json['message'] == 'Payment successful'
    assert 'payment_id' in response.json


def test_create_payment_missing_student_id(client):
    response = client.post(
        '/payment',
        json={
            "course_id": 1,
            "amount": 100.0,
            "card_last_four_digits": "1234",
            "card_month": "12",
            "card_year": "25",
            "card_cvv": "123",
        }
    )

    assert response.status_code == 400
    assert response.json['error'] == 'Student ID is required'


def test_create_payment_invalid_user(client):
    with client.session_transaction() as session:
        session['user_id'] = 2  # mismatched user_id

    response = client.post(
        '/payment?student_id=1',
        json={
            "course_id": 1,
            "amount": 100.0,
            "card_last_four_digits": "1234",
            "card_month": "12",
            "card_year": "25",
            "card_cvv": "123",
        }
    )

    assert response.status_code == 401
    assert response.json['error'] == 'User not logged in or session mismatch'


def test_create_payment_invalid_card_info(client):
    with client.session_transaction() as session:
        session['user_id'] = 1

    response = client.post(
        '/payment?student_id=1',
        json={
            "course_id": 1,
            "amount": 100.0,
            "card_last_four_digits": "1234",
            "card_month": "13",  # invalid month
            "card_year": "20",  # invalid year
            "card_cvv": "12",  # invalid CVV length
        }
    )

    assert response.status_code == 400
    assert 'error' in response.json
    assert "Invalid card" in response.json['error']


def test_create_payment_duplicate_payment(client, test_session):
    student = Student(student_id=1, name="Test Student", email="test@example.com", password="password123")
    course = Course(course_id=1, course_name="Test Course", price=100.0, course_description="Sample course description")
    payment = Payment(
        student_id=1,
        course_id=1,
        amount=100.0,
        payment_date=datetime.utcnow(),
        card_last_four_digits="1234",
        card_month=12,
        card_year=25,
        card_cvv="123",
    )
    test_session.add_all([student, course, payment])
    test_session.commit()

    with client.session_transaction() as session:
        session['user_id'] = 1

    response = client.post(
        '/payment?student_id=1',
        json={
            "course_id": 1,
            "amount": 100.0,
            "card_last_four_digits": "1234",
            "card_month": "12",
            "card_year": str(datetime.now().year % 100 + 1),  # next year
            "card_cvv": "123",
        }
    )

    assert response.status_code == 400
    assert response.json['error'] == 'Student has already purchased this course'


def test_get_payments_by_student_success(client, test_session):
    student = Student(student_id=1, name="Test Student", email="test@example.com", password="password123")
    course1 = Course(course_id=1, course_name="Test Course 1", price=50.0, course_description="Description 1")
    course2 = Course(course_id=2, course_name="Test Course 2", price=75.0, course_description="Description 2")
    payment1 = Payment(
        student_id=1,
        course_id=1,
        amount=50.0,
        payment_date=datetime.utcnow(),
        card_last_four_digits="1234",
        card_month=12,
        card_year=25,
        card_cvv="123"
    )
    payment2 = Payment(
        student_id=1,
        course_id=2,
        amount=75.0,
        payment_date=datetime.utcnow(),
        card_last_four_digits="5678",
        card_month=11,
        card_year=25,
        card_cvv="456"
    )
    test_session.add_all([student, course1, course2, payment1, payment2])
    test_session.commit()

    response = client.get('/payment/student/1')

    assert response.status_code == 200
    assert isinstance(response.json, list)
    assert len(response.json) == 2
    assert response.json[0]['payment_id'] == payment1.payment_id
    assert response.json[1]['payment_id'] == payment2.payment_id


def test_get_payments_by_student_no_payments(client, test_session):
    student = Student(student_id=2, name="Test Student 2", email="student2@example.com", password="password123")
    test_session.add(student)
    test_session.commit()

    response = client.get('/payment/student/2')

    assert response.status_code == 404
    assert response.json['message'] == 'No payments found for this student'


def test_get_payments_by_student_invalid_student(client, test_session):
    non_existent_id = 9999
    student = test_session.query(Student).filter_by(student_id=non_existent_id).first()
    assert student is None
    response = client.get(f'/payment/student/{non_existent_id}')

    print(f"Response Status: {response.status_code}")
    print(f"Response Data: {response.json}")

    assert response.status_code == 404
    assert response.json["message"] == "Student not found"


def test_get_payments_by_course_success(client, test_session):
    course = Course(course_id=1, course_name="Test Course", price=100.0, course_description="Sample course description")
    student1 = Student(student_id=1, name="Test Student 1", email="student1@example.com", password="password123")
    student2 = Student(student_id=2, name="Test Student 2", email="student2@example.com", password="password456")
    payment1 = Payment(
        student_id=1,
        course_id=1,
        amount=100.0,
        payment_date=datetime.utcnow(),
        card_last_four_digits="1234",
        card_month=12,
        card_year=25,
        card_cvv="123"
    )
    payment2 = Payment(
        student_id=2,
        course_id=1,
        amount=100.0,
        payment_date=datetime.utcnow(),
        card_last_four_digits="5678",
        card_month=12,
        card_year=25,
        card_cvv="456"
    )
    test_session.add_all([course, student1, student2, payment1, payment2])
    test_session.commit()
    
    response = client.get('/payment/course/1')

    assert response.status_code == 200
    assert isinstance(response.json, list)
    assert len(response.json) == 2
    assert response.json[0]['payment_id'] == payment1.payment_id
    assert response.json[1]['payment_id'] == payment2.payment_id


def test_get_payments_by_course_no_payments(client, test_session):
    course = Course(course_id=2, course_name="Empty Course", price=50.0, course_description="No payments yet")
    test_session.add(course)
    test_session.commit()
    response = client.get('/payment/course/2')

    assert response.status_code == 404
    assert response.json['message'] == 'No payments found for this course'


def test_get_payments_by_course_invalid_course(client, test_session):
    non_existent_id = 9999
    course = test_session.query(Course).filter_by(course_id=non_existent_id).first()
    assert course is None
    response = client.get(f'/payment/course/{non_existent_id}')
    print(f"Response Status: {response.status_code}")
    print(f"Response Data: {response.json}")

    assert response.status_code == 404
    assert response.json["message"] == "No payments found for this course"


    
def test_get_all_payments_success(client, test_session):
    student = Student(student_id=1, name="Test Student", email="test@example.com", password="password123")
    course = Course(course_id=1, course_name="Test Course", price=100.0, course_description="Sample description")
    payment = Payment(
        student_id=1,
        course_id=1,
        amount=100.0,
        payment_date=datetime.utcnow(),
        card_last_four_digits="1234",
        card_month=12,
        card_year=25,
        card_cvv="123"
    )
    test_session.add_all([student, course, payment])
    test_session.commit()
    response = client.get('/payment')
    assert response.status_code == 200
    assert isinstance(response.json, list)
    assert len(response.json) == 1
    assert response.json[0]['payment_id'] == payment.payment_id


def test_get_all_payments_no_payments(client, test_session):
    payments = test_session.query(Payment).all()
    assert len(payments) == 0
    response = client.get('/payment')
    print(f"Response Status: {response.status_code}")
    print(f"Response Data: {response.json}")

    assert response.status_code == 404
    assert response.json["message"] == "No payments found"



def test_delete_payment_success(client, test_session):
    student = Student(student_id=1, name="Test Student", email="test@example.com", password="password123")
    course = Course(course_id=1, course_name="Test Course", price=100.0, course_description="Sample description")
    payment = Payment(
        student_id=1,
        course_id=1,
        amount=100.0,
        payment_date=datetime.utcnow(),
        card_last_four_digits="1234",
        card_month=12,
        card_year=25,
        card_cvv="123"
    )
    test_session.add_all([student, course, payment])
    test_session.commit()

    response = client.delete(f'/payment/{payment.payment_id}')
    assert response.status_code == 200
    assert response.json['message'] == 'Payment deleted successfully'


def test_delete_payment_not_found(client, test_session):
    non_existent_id = 9999
    payment = test_session.query(Payment).filter_by(payment_id=non_existent_id).first()
    assert payment is None
    response = client.delete(f'/payment/{non_existent_id}')
    print(f"Response Status: {response.status_code}")
    print(f"Response Data: {response.json}")

    assert response.status_code == 404
    assert response.json["error"] == "Payment not found"



def test_get_admin_payments_success(client, test_session):
    student = Student(student_id=1, name="Test Student", email="test@example.com", password="password123")
    course = Course(course_id=1, course_name="Test Course", price=100.0, course_description="Sample description")
    payment = Payment(
        student_id=1,
        course_id=1,
        amount=100.0,
        payment_date=datetime.utcnow(),
        card_last_four_digits="1234",
        card_month=12,
        card_year=25,
        card_cvv="123"
    )
    test_session.add_all([student, course, payment])
    test_session.commit()
    response = client.get('/api/admin/payment')

    assert response.status_code == 200
    assert isinstance(response.json, list)
    assert len(response.json) == 1
    assert response.json[0]['payment_id'] == payment.payment_id
    assert response.json[0]['student_name'] == student.name
    assert response.json[0]['course_name'] == course.course_name


def test_get_admin_payments_no_payments(client, test_session):
    payments = test_session.query(Payment).all()
    assert len(payments) == 0
    response = client.get('/api/admin/payment')
    print(f"Response Status: {response.status_code}")
    print(f"Response Data: {response.json}")

    assert response.status_code == 200
    assert isinstance(response.json, list)
    assert len(response.json) == 0
