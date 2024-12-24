import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './CheckOut.module.css';

function CheckoutPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [courseDetails, setCourseDetails] = useState(null);
  const [formData, setFormData] = useState({
    userId: '', 
    courseId: courseId,
    amount: '',
    country: 'Egypt',
    zipCode: '',
    cardHolderName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVV: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch(`http://localhost:5000/courses/${courseId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch course: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched course details:", data);
        setCourseDetails(data);
        setFormData((prevData) => ({
          ...prevData,
          amount: data.price,
        }));
      })
      .catch((error) => {
        console.error('Error fetching course:', error.message);
        setErrorMessage('Failed to load course details.');
      })
      .finally(() => setIsLoading(false));

    // check if user is logged in
    const userId = sessionStorage.getItem('student_id');
    if (userId) {
      setFormData((prevData) => ({
        ...prevData,
        userId: userId,
      }));
    } else {
      setShowRedirectMessage(true);
      setTimeout(() => navigate('/login'), 3000); 
    }
  }, [courseId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateForm = () => {
    const { zipCode, cardNumber, cardExpiry, cardCVV } = formData;

    if (!zipCode || !cardNumber || !cardExpiry || !cardCVV) {
      setErrorMessage('All fields are required.');
      return false;
    }

    const expiryParts = cardExpiry.split('/');
    if (
      expiryParts.length !== 2 || 
      isNaN(expiryParts[0]) || 
      isNaN(expiryParts[1]) || 
      expiryParts[0] < 1 || 
      expiryParts[0] > 12
    ) {
      setErrorMessage('Invalid expiry date. Use MM/YY format.');
      return false;
    }

    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    if (
      parseInt(expiryParts[1]) < currentYear || 
      (parseInt(expiryParts[1]) === currentYear && parseInt(expiryParts[0]) < currentMonth)
    ) {
      setErrorMessage('Card has expired.');
      return false;
    }

    if (cardNumber.length !== 16 || isNaN(cardNumber)) {
      setErrorMessage('Invalid card number. It should be 16 digits.');
      return false;
    }

    if (cardCVV.length !== 3 || isNaN(cardCVV)) {
      setErrorMessage('Invalid CVV. It should be 3 digits.');
      return false;
    }

    setErrorMessage('');
    return true;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    console.log("Form Data:", formData);
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/payment?student_id=${formData.userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', 
        body: JSON.stringify({
          course_id: formData.courseId,
          amount: formData.amount,
          card_last_four_digits: formData.cardNumber.slice(-4),
          card_month: formData.cardExpiry.split('/')[0],
          card_year: formData.cardExpiry.split('/')[1],
          card_cvv: formData.cardCVV,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Payment Successful: ' + data.payment_id);
        navigate('/thank-you');
      } else {
        setErrorMessage(data.message || 'Payment failed');
      }
    } catch (error) {
      setErrorMessage('Payment failed. Please try again.');
      console.error('Error during payment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Checkout</h1>
      {showRedirectMessage && (
        <div className={styles.redirectBox}>
          <p>You are not logged in. Redirecting to the login page...</p>
        </div>
      )}
      {courseDetails ? (
        <div className={styles.flexContainer}>
          <div className={styles.formSection}>
            <h2>Billing Address</h2>
            <label className={styles.label}>Country</label>
            <select
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className={styles.select}
            >
              <option>Egypt</option>
              <option>United States</option>
              <option>Canada</option>
              <option>United Kingdom</option>
            </select>
            <label className={styles.label}>ZIP Code (Required)</label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
              required
              className={styles.input}
            />
            <h2>Payment Card</h2>
            <label className={styles.label}>Name on Card</label>
            <input
              type="text"
              name="cardHolderName"
              value={formData.cardHolderName}
              onChange={handleInputChange}
              className={styles.input}
            />
            <label className={styles.label}>Card Number</label>
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleInputChange}
              className={styles.input}
            />
            <label className={styles.label}>Expiry Date (MM/YY)</label>
            <input
              type="text"
              name="cardExpiry"
              value={formData.cardExpiry}
              onChange={handleInputChange}
              className={styles.input}
            />
            <label className={styles.label}>CVV</label>
            <input
              type="text"
              name="cardCVV"
              value={formData.cardCVV}
              onChange={handleInputChange}
              className={styles.input}
            />
            {errorMessage && <p className={styles.error}>{errorMessage}</p>}
            <button onClick={handlePayment} className={styles.button} disabled={isLoading}>
              {isLoading ? 'Processing Payment...' : 'Complete Payment'}
            </button>
          </div>
          <div className={styles.summarySection}>
            <h2>Summary</h2>
            <img
              src={`../../assets/${courseDetails.image_url}`}
              alt={courseDetails.course_name}
              className={styles.courseImage}
            />
            <p>Course: {courseDetails.course_name}</p>
            <p>Original Price: ${courseDetails.price}</p>
            <p>Subtotal: ${courseDetails.price}</p>
            <p>Estimated Tax: $0.00</p>
            <h3>Total: ${courseDetails.price}</h3>
          </div>
        </div>
      ) : (
        <p>Loading course details...</p>
      )}
    </div>
  );
}

export default CheckoutPage;
