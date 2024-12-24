import pytest
# sign up testing
@pytest.mark.order(1)
@pytest.mark.auth
def test_signup_success(client):
    payload = {
        "name": "Rese1t User",
        "email": "mhiaf112014@gmail.com",
        "password": "password123",
        "role": "student"
    }
    response = client.post('/auth/signup', json=payload)
    assert response.status_code == 201
    assert response.json['message'] == "Signup successful"
@pytest.mark.order(2)
@pytest.mark.auth
def test_signup_missing_fields(client):
    payload = {"email": "testman24@example.com", "password": "password123"}
    response = client.post('/auth/signup', json=payload)
    assert response.status_code == 400
    assert "All fields" in response.json['error']


# login testing
@pytest.mark.order(3)
@pytest.mark.auth
def test_login_success(client):
    client.post('/auth/signup', json={
        "name": "Test User",
        "email": "testman24@example.com",
        "password": "password123",
        "role": "student"
    })
    payload = {"email": "testman24@example.com", "password": "password123"}
    response = client.post('/auth/login', json=payload)
    assert response.status_code == 200
    assert response.json['message'] == "Login successful"
    
@pytest.mark.order(4)
@pytest.mark.auth
def test_login_invalid_credentials(client):
    payload = {"email": "nonexistent@example.com", "password": "wrongpassword"}
    response = client.post('/auth/login', json=payload)
    assert response.status_code == 401
    assert "Invalid email or password" in response.json['error']


# forgot password testing
@pytest.mark.order(5)
@pytest.mark.auth
def test_forgot_password_success(client, mocker):
    mocker.patch("utils.mail.send_reset_email", return_value=True)

    client.post('/auth/signup', json={
        "name": "Reset User",
        "email": "mhiaf2014@gmail.com",
        "password": "password123",
        "role": "teacher"
    })
    payload = {"email": "mhiaf2014@gmail.com"}
    response = client.post('/auth/forgot-password', json=payload)
    assert response.status_code == 200
    assert response.json['message'] == "Password reset email sent"
    
@pytest.mark.order(6)
@pytest.mark.auth
def test_forgot_password_email_not_found(client):
    payload = {"email": "unknown@example.com"}
    response = client.post('/auth/forgot-password', json=payload)
    assert response.status_code == 404
    assert "Email not found" in response.json['error']


# logout testing
@pytest.mark.order(7)
@pytest.mark.auth
def test_logout_success(client):
    client.post('/auth/login', json={"email": "testman24@example.com", "password": "password123"})
    response = client.post('/auth/logout')
    assert response.status_code == 200
    assert response.json['message'] == "Logged out successfully"
