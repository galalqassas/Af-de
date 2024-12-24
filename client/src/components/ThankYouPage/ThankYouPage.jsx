import { Link } from 'react-router-dom';
import styles from './ThankYouPage.module.css';

function ThankYouPage() {
    return (
        <div className={styles.container}>
            <h1 className={styles.header}>Thank You for Your Purchase!</h1>
            <p>Your payment was successful. You can now access your purchased course.</p>
            <Link to="/student-dashboard" className={styles.link}>
                Go to Dashboard
            </Link>
        </div>
    );
}

export default ThankYouPage;
