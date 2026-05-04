import styles from './AiCustomOrder.module.css'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {fetchAiCustomOrder} from '../api/aiCustomApi';
import AiCustomOrderCard from '../components/AiCustomOrderCard';
import Loading from '../components/Loading';

function AiCustomOrder(){
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login', { replace: true });
        }
        const fetchOrders = async () => {
            try{
                const res  =  await fetchAiCustomOrder();
                setOrders(res);
            }catch(err){
                console.error("Error fetching Ai custom orders", err);
            }finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [token, navigate])
    if (!token) return null;

    return(
        <div className={styles.aiOrder}>
            <div className={styles.aiOrderContentContainer}>
                <h2>Ai Custom Order</h2>
                    <div className={styles.aiOrderItemContainer}>
                    { loading?(
                        <Loading/>
                    ) : orders.length > 0 ? (
                        orders.map((order) => (
                            <div key={order.id} className={styles.orderGroup}>
                                <u><h3>Request ID #{order.id}</h3></u>
                                <h5>Date:  {new Date(order.createdAt).toLocaleString()}</h5>
                                <h5>Status: <strong>{order.status.toUpperCase()}</strong></h5>
                                    <AiCustomOrderCard 
                                        order={order} 
                                        aiResult={order.aiResult}
                                    />

                            </div>
                        ))
                    ) : (
                        <p>You do not have custom quote request.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AiCustomOrder;