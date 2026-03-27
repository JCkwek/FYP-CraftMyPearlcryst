import styles from './Orders.module.css';
import BackButton from '../components/buttons/BackButton';
import { useEffect, useState } from 'react';
import axios from 'axios';
import OrderItemCard from '../components/OrderItemCard';

function Orders(){
    const [orders, setOrders] = useState([]);
     const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const fetchOrders = async () => {
            try{
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:3000/orders', {
                    headers: { Authorization: `Bearer ${token}`}
                });
                setOrders(res.data);
            }catch(err){
                console.error("Error fetching orders:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <div className={styles.loadingContainer}><p>Loading your orders...</p></div>;

    return(
        <div className={styles.orders}>
            <BackButton />
            <div className={styles.orderContentContainer}>
                <h2>Orders</h2>
                <div className={styles.orderItemContainer}>
                    {orders.length > 0 ? (
                        orders.map((order) => (
                            <div key={order.order_id} className={styles.orderGroup}>
                                <h3>Order #{order.order_id}</h3>
                                {order.OrderItems.map((item) => (
                                    <OrderItemCard 
                                        key={item.id} 
                                        item={item} 
                                        status={order.order_status}
                                    />
                                ))   
                                }

                                <h3>Total: RM {order.total_amount}</h3>
                            </div>
                        ))
                    ) : (
                        <p>You do not have any orders.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Orders;