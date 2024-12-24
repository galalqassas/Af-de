/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SignUp.module.css';

function Signup() {
  const [userType, setUserType] = useState(''); 
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(''); 
    setSuccess(''); 
    setLoading(true);

    if (!userType) {
      setError('Please select a user type before proceeding.');
      setLoading(false);
      return;
    }

    const formData = {
      role: userType,
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value,
    };

    if (userType === 'parent') {
      const student_id = e.target.student_id.value;
      if (!student_id) {
        setError('Student ID is required for parent signup.');
        setLoading(false);
        return;
      }
      formData.student_id = student_id;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(result.message || 'Signup successful!');
        setError('');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(result.error || 'Signup failed. Please try again.');
        setSuccess('');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    setError(''); 
    if (!userType) {
      setError('Please select a user type before signing up with Google.');
      return;
    }

    if (userType === 'parent') {
      const studentIdInput = document.getElementById('student_id');
      const student_id = studentIdInput ? studentIdInput.value : '';
      if (!student_id) {
        setError('Student ID is required for parent signup.');
        return;
      }
    }

    const queryParams = new URLSearchParams({
      role: userType,
      student_id: userType === 'parent' ? document.getElementById('student_id').value : '',
    });

    window.location.href = `http://localhost:5000/auth/google-login?${queryParams.toString()}`;
  };

  return (
    <div className={styles.signupPage}>
      <div className={styles.authCard}>
        <div className={styles.left}>
          <h1 className={styles.title}>Scholar</h1>
          <div className={styles.socialSignup}>
            {error && <p className={styles.error}>{error}</p>}
            <select
              className={styles.roleDropdown}
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="parent">Parent</option>
            </select>
            <button
              className={styles.google}
              onClick={handleGoogleSignup}
              aria-label="Sign Up with Google"
            >
              Sign Up with Google
            </button>
          </div>
          <p className={styles.or}>or sign up with your email</p>
          <form onSubmit={handleSignup}>
            {success && <p className={styles.success}>{success}</p>}
            <input
              type="text"
              name="name"
              placeholder="Name"
              aria-label="Full Name"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              aria-label="Email Address"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              aria-label="Password"
              required
            />
            {userType === 'parent' && (
              <input
                type="text"
                id="student_id"
                name="student_id"
                placeholder="Student ID"
                aria-label="Student ID"
                required
              />
            )}
            <button
              className={styles.btn}
              type="submit"
              disabled={loading}
              aria-label="Sign Up"
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>
        </div>
        <div className={styles.right}>
          <h3>Welcome Back!</h3>
          <p>Sign in with your account to continue exploring amazing features.</p>
          <button
            className={styles.btn}
            onClick={() => navigate('/login')}
            aria-label="Sign In"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup;
