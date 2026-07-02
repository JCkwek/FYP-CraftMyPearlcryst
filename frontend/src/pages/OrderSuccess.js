import styles from './OrderSuccess.module.css';
import buttonStyles from '../components/buttons/ButtonTheme.module.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { confirmPayment } from '../api/orderApi';
import { confirmAiPayment } from '../api/aiCustomOrderApi';

function OrderSuccess(){
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const orderType = searchParams.get('type');       // 'ai' or null (regular)
    const aiOrderId = searchParams.get('orderId');    // only present for AI orders
    const [status, setStatus] = useState('processing');
    
    useEffect(() => {
        let isMounted = true;
        let attempts = 0;

        const finalizeOrder = async () => {
            try {
                if (orderType === 'ai' && aiOrderId) {
                    // AI custom order payment confirmation
                    await confirmAiPayment(sessionId, aiOrderId);
                } else {
                    // Regular order payment confirmation
                    await confirmPayment(sessionId);
                }
                if (isMounted) setStatus('success');
            } catch(err) {
                console.warn(`Attempt ${attempts + 1} failed, webhook might still be processing...`);
                attempts++;
                // Retry up to 5 times (every 2 seconds) before giving up
                if (attempts < 5 && isMounted) {
                    setTimeout(finalizeOrder, 2000);
                } else {
                    if (isMounted) setStatus('error');
                }
            }
        };

        if (sessionId) {
            finalizeOrder();
        } else {
            setStatus('error');
        }

        return () => { isMounted = false; }; // Clean up to avoid memory leaks

    }, [sessionId, orderType, aiOrderId]);


    return (
        <div className={styles.orderSuccess}>
            <div className={styles.orderSuccessContentContainer}>
                {status === 'processing'? (
                    <h2>Verifying your payment...</h2>
                ): status === 'success' ? (
                    <>
                        <h2><FaCheck /> Payment Successful</h2>
                        <p>
                            {orderType === 'ai'
                                ? 'Your custom AI jewellery order has been placed and paid!'
                                : 'Your order has been placed.'}
                        </p>
                        <button onClick={() => navigate('/orders')} className={`${buttonStyles.button} ${buttonStyles.main}`}>View My Orders</button>
                    </>
                ) : (
                    <>
                        <h2>Payment Verification Failed</h2>
                        <p>Something went wrong. Please contact support if your payment was deducted.</p>
                        <button onClick={() => navigate('/orders')} className={`${buttonStyles.button} ${buttonStyles.main}`}>View My Orders</button>
                    </>
                )
                }
            </div>
        </div>
    )
}

export default OrderSuccess;