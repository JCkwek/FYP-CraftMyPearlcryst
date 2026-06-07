import styles from './Orders.module.css';
import BackButton from '../components/buttons/BackButton';
import { useEffect, useState } from 'react';
import OrderCard from '../components/OrderCard';
import { useNavigate } from 'react-router-dom';
import Loading from "../components/Loading";
import { getUserOrder } from '../api/orderApi';
import SearchBar from '../components/SearchBar';
import { ORDER_STATUSES } from '../constants/OrderStatus';

function Orders(){
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const token = localStorage.getItem('token');

    const fetchOrders = async () => {
        try{
            setLoading(true);
            const orders = await getUserOrder({
                query: searchTerm,
                status: selectedStatus
            });
            setOrders(orders);
        }catch(err){
            console.error("Error fetching orders:", err);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        if (!token) {
            navigate('/login', { replace: true }); // 'replace: true' wipes the "Orders" from the history stack
        }

        fetchOrders();
    }, [token, navigate,selectedStatus]);


    if (!token) return null;

    return(
        <div className={styles.orders}>
            <BackButton  to="/account"/>
            <div className={styles.orderContentContainer}>
                <h2>Orders</h2>
                <div className={styles.toolbar}>
                    <SearchBar 
                        placeholder="Search orders by id"
                        value={searchTerm}
                        onChange={setSearchTerm}
                        onSearch={fetchOrders}
                    />

                    <select 
                        className={styles.filterSelect}
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        <option value="">All Status</option>
                        {ORDER_STATUSES.BASE.map(status => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.orderItemContainer}>
                    { loading?(
                        <Loading/>
                    ) : orders.length > 0 ? (
                        orders.map((order) => (
                            <OrderCard order={order} key={order.order_id}/>
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