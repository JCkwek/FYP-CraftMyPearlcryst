import styles from './OrderUnsuccess.module.css';
import buttonStyles from '../components/buttons/ButtonTheme.module.css';
import { useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';

function OrderUnsuccess(){
    const navigate = useNavigate();

    return (
        <div className={styles.orderUnSuccess}>
            <div className={styles.orderUnSuccessContentContainer}>
                <h2><FaTimes /> Payment Unsuccessful</h2>
                <p>Your payment could not be processed. Please return to your cart to review your items and try again.</p>
                <button onClick={() => navigate('/cart')} className={`${buttonStyles.button} ${buttonStyles.main}`}>Return to Cart</button>
            </div>
        </div>
    )
}

export default OrderUnsuccess;