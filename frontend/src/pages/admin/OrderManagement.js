import styles from './OrderManagement.module.css';
import { useState, useEffect } from 'react';
import SearchBar from '../../components/SearchBar';
import { ORDER_STATUSES } from '../../constants/OrderStatus';
import Loading from '../../components/Loading';
import OrderCard from '../../components/OrderCard';
import {getOrders, updateOrderStatus} from '../../api/orderApi';


function OrderManagement({ currentUser }){
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState('regular');
    const [orders, setOrders] = useState([]);

     useEffect(() => {
        const fetchOrders = async () => {
            try{
                const orders = await getOrders();
                setOrders(orders);
            }catch(err){
                console.error("Error fetching orders:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);

            setOrders(prev =>
                prev.map(order =>
                    order.order_id === orderId
                        ? { ...order, order_status: newStatus }
                        : order
                )
            );

        } catch (err) {
            console.error("Failed to update order status:", err);
        }
    };

    return(
        <div className={styles.orderManagement}>
            <div className={styles.orderManagementContentContainer}>
                <h2>Order Management</h2>

                <div className={styles.tabContainer}>
                    <button
                        className={`${styles.tabButton} ${selectedTab === 'regular' ? styles.activeTab : '' }`}
                        onClick={() => setSelectedTab('regular')}
                    >
                        Regular Orders
                    </button>

                    <button
                        className={`${styles.tabButton} ${selectedTab === 'ai' ? styles.activeTab : ''}`}
                        onClick={() => setSelectedTab('ai')}
                    >
                        AI Custom Orders
                    </button>
                </div>

                <div className={styles.toolbar}>
                    <SearchBar placeholder="Search orders"/>

                    <select className={styles.filterSelect}>
                        <option value="">All Status</option>
                        {ORDER_STATUSES.map(status => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>
                
                {/*regular orders */}
                <div className={styles.ordersContainer}>
                    { loading?(
                        <Loading/>
                    ) : Array.isArray(orders) && orders.length > 0 && selectedTab === 'regular'? (
                        orders.map((order) => (
                            <OrderCard 
                                order={order} 
                                key={order.order_id} 
                                currentUser={currentUser} 
                                onStatusChange={handleStatusChange}
                            />
                        ))
                    ) : (
                        <p>You do not have any orders.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default OrderManagement;