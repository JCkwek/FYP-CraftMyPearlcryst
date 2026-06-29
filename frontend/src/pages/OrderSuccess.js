import styles from './OrderSuccess.module.css';
import buttonStyles from '../components/buttons/ButtonTheme.module.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { confirmPayment } from '../api/orderApi';

function OrderSuccess(){
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const [status, setStatus] = useState('processing');
    
    useEffect(() => {
        const finalizeOrder = async () => {
            try{
                await confirmPayment(sessionId);
                setStatus('success');
            }catch(err){
                console.error("Order finalization failed:", err);
                setStatus('error');
            }
        };

        if(sessionId) finalizeOrder();

    }, [sessionId]);


    return (
        <div className={styles.orderSuccess}>
            <div className={styles.orderSuccessContentContainer}>
                {status === 'processing'? (
                    <h2>Verifying your payment...</h2>
                ): (
                    <>
                        <h2><FaCheck /> Payment Successful</h2>
                        <p>Your order has been placed.</p>
                        <button onClick={() => navigate('/orders')} className={`${buttonStyles.button} ${buttonStyles.main}`}>View My Orders</button>
                    </>
                )
                }
            </div>
        </div>
    )
}

export default OrderSuccess;