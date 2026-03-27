import styles from './OrderSuccess.module.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

function OrderSuccess(){
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const [status, setStatus] = useState('processing');
    
    useEffect(() => {
        const finalizeOrder = async () => {
            try{
                const token = localStorage.getItem('token');
                await axios.get(`http://localhost:3000/orders/confirm?session_id=${sessionId}` ,{
                    headers: { Authorization: `Bearer ${token}`}
                });
                setStatus('success');
            }catch(err){
                console.error("Order finalization failed:", err);
                setStatus('error');
            }
        };

        if(sessionId) finalizeOrder();

    }, [sessionId]);

    if(status === 'processing') return <h2>Verifying your payment...</h2>;
    

    return (
        <div className={styles.orderSuccess}>
            <h1>✅ Payment Successful!</h1>
            <p>Your order has been placed.</p>
            <button onClick={() => navigate('/orders')} className={styles.viewMyOrdersBtn}>
                View My Orders
            </button>
        </div>
    )
}

export default OrderSuccess;