import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ForgotPassword.module.css'; 

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Hook to navigate between pages

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError("Please enter a valid email.");
      return;
    }

    setIsLoading(true);

    try {
      // Sending the request using fetch API
      const response = await fetch('http://localhost:5000/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json(); // Parse the response as JSON

      if (response.ok) {
        setSuccess(result.message);
        setEmail(''); // Clear email input on success
      } else {
        setError(result.error || 'An error occurred while processing your request.');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred while processing your request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.left}>
          <h2 className={styles.title}>Forgot Password</h2>
          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className={styles.btn} disabled={isLoading}>
              {isLoading ? 'Sending email...' : 'Send Reset Link'}
            </button>
          </form>
        </div>

        <div className={styles.right}>
          <h3>Remember your password?</h3>
          <p>Go back to login and sign in with your credentials.</p>
          <button className={styles.backBtn} onClick={() => navigate('/login')}>
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
