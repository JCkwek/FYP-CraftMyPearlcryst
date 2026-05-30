import styles from './Orders.module.css';
import BackButton from '../components/buttons/BackButton';
import { useEffect, useState } from 'react';
import OrderItemCard from '../components/OrderItemCard';
import { useNavigate } from 'react-router-dom';
import Loading from "../components/Loading";
import { getUserOrder } from '../api/orderApi';

function Orders(){
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
     
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login', { replace: true }); // 'replace: true' wipes the "Orders" from the history stack
        }

        const fetchOrders = async () => {
            try{
                const orders = await getUserOrder();
                setOrders(orders);
            }catch(err){
                console.error("Error fetching orders:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [token, navigate]);

    if (!token) return null;

    return(
        <div className={styles.orders}>
            <BackButton  to="/account"/>
            <div className={styles.orderContentContainer}>
                <h2>Orders</h2>
                <div className={styles.orderItemContainer}>
                    { loading?(
                        <Loading/>
                    ) : orders.length > 0 ? (
                        orders.map((order) => (
                            <div key={order.order_id} className={styles.orderGroup}>
                                <u><h3>Order #{order.order_id}</h3></u>
                                <h6>Total: RM {order.total_amount}</h6>
                                <h6>Date:  {new Date(order.createdAt).toLocaleString()}</h6>
                                <h6>Status: {order.order_status}</h6>
                                <h6>Order item(s): </h6>
                                {order.OrderItems.map((item) => (
                                    <OrderItemCard 
                                        key={item.id} 
                                        item={item} 
                                        customization={item.customization}
                                    />
                                ))   
                                }
                                
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