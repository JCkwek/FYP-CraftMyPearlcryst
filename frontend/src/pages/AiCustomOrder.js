import styles from './AiCustomOrder.module.css'
import { useState, useEffect } from 'react';
import {fetchAiCustomOrder, removeAiCustomOrder} from '../api/aiCustomOrderApi';
import AiCustomOrderCard from '../components/AiCustomOrderCard';
import Loading from '../components/Loading';

function AiCustomOrder(){
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
    }, [])

    const handleDelete = async(orderId) => {
        if (window.confirm("Are you sure you want to cancel this request?")) {
            try {
                await removeAiCustomOrder(orderId);
                setOrders(orders.filter(o => o.id !== orderId)); // Local update
            } catch (err) {
                alert("Failed to delete: " + err.message);
            }
        }
    }

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
                                
                                {order.status !== 'pending' && (
                                    <small className={styles.updateTime}>
                                        Updated on: {new Date(order.updated_at || order.updatedAt).toLocaleDateString()}
                                    </small>
                                )}
                                
                                    <AiCustomOrderCard 
                                        order={order} 
                                        aiResult={order.aiResult}
                                        onDelete={handleDelete}
                                    />
                            </div>
                        ))
                    ) : (
                        <p>You do not have any custom quote request.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AiCustomOrder;