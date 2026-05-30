import styles from './OrderManagement.module.css';
// import buttonStyles from '../../components/buttons/ButtonTheme.module.css';
import { useState, useEffect } from 'react';
import SearchBar from '../../components/SearchBar';
import { ORDER_STATUSES } from '../../constants/OrderStatus';
import Loading from '../../components/Loading';
import OrderItemCard from '../../components/OrderItemCard';
import {getOrders} from '../../api/orderApi';

function OrderManagement(){
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
                            <div key={order.order_id} className={styles.orderGroup}>
                                <u><h3>Order #{order.order_id}</h3></u>
                                <div className={styles.orderInfoContainer} >
                                    <div className={styles.orderInfo} >                                     
                                        <h6>Total: RM {order.total_amount}</h6>
                                        <h6>Date:  {new Date(order.createdAt).toLocaleString()}</h6>
                                        <h6>Status: {order.order_status}</h6>
                                    </div>
                                    <div className={styles.orderInfo} >
                                        <h6>Customer: {order.User?.name}</h6>
                                        <h6>Contact: {order.User?.phone_no} / {order.User?.email}</h6>
                                    </div>
                                    <div className={styles.orderInfo} >
                                        <h6>Status: {order.order_status}</h6>
                                    </div>
                                </div>
                                
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

export default OrderManagement;