import styles from './Orders.module.css';
import BackButton from '../components/buttons/BackButton';
import { useEffect, useState } from 'react';
import OrderCard from '../components/OrderCard';
import AiCustomOrderCard from '../components/AiCustomOrderCard';
import { useNavigate } from 'react-router-dom';
import Loading from "../components/Loading";
import { getUserOrder } from '../api/orderApi';
import { fetchAiCustomOrder, removeAiCustomOrder, updateMyAiOrderStatus, createAiCheckoutSession } from '../api/aiCustomOrderApi';
import SearchBar from '../components/SearchBar';
import { ORDER_STATUSES } from '../constants/OrderStatus';

function Orders(){
    const navigate = useNavigate();
    const [selectedTab, setSelectedTab] = useState('regular');
    const [orders, setOrders] = useState([]);
    const [aiOrders, setAiOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const token = localStorage.getItem('token');

    const statusOptions =
        selectedTab === 'regular'
            ? ORDER_STATUSES.BASE
            : ORDER_STATUSES.AI;

    // fetch regular orders
    const fetchOrders = async () => {
        try{
            setLoading(true);
            const data = await getUserOrder({
                query: searchTerm,
                status: selectedStatus
            });
            setOrders(data);
        }catch(err){
            console.error("Error fetching orders:", err);
        } finally {
            setLoading(false);
        }
    };

    // fetch AI custom orders
    const fetchAiOrders = async () => {
        try{
            setLoading(true);
            const res = await fetchAiCustomOrder({
                query: searchTerm,
                status: selectedStatus
            });
            setAiOrders(res);
        }catch(err){
            console.error("Error fetching Ai custom orders", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) {
            navigate('/login', { replace: true });
        }
    }, [token, navigate]);

    useEffect(() => {
        if (!token) return;
        if (selectedTab === 'regular') {
            fetchOrders();
        } else {
            fetchAiOrders();
        }
    }, [selectedTab, selectedStatus]);

    if (!token) return null;

    const handleSearch = () => {
        if (selectedTab === 'regular') {
            fetchOrders();
        } else {
            fetchAiOrders();
        }
    };

    // Customer deletes/cancels a pending AI order
    const handleAiDelete = async (orderId) => {
        if (window.confirm("Are you sure you want to cancel this request?")) {
            try {
                await removeAiCustomOrder(orderId);
                setAiOrders(prev => prev.filter(o => o.id !== orderId));
            } catch (err) {
                alert("Failed to cancel: " + err.message);
            }
        }
    };

    // Customer places an order (quoted → ordered, awaiting payment)
    const handlePlaceOrder = async (orderId) => {
        if (window.confirm("Confirm place order at the quoted price? You will need to complete payment.")) {
            try {
                await updateMyAiOrderStatus(orderId, 'ordered');
                setAiOrders(prev =>
                    prev.map(o => o.id === orderId ? { ...o, status: 'ordered' } : o)
                );
            } catch (err) {
                alert("Failed to place order: " + (err.response?.data?.message || err.message));
            }
        }
    };

    // Customer pays for a placed (ordered) AI order via Stripe
    const handlePayNow = async (orderId) => {
        try {
            const data = await createAiCheckoutSession(orderId);
            if (data?.url) {
                window.location.href = data.url;
            }
        } catch (err) {
            alert("Failed to start payment: " + (err.response?.data?.message || err.message));
        }
    };

    // Customer cancels a quoted AI order
    const handleAiCancel = async (orderId) => {
        if (window.confirm("Are you sure you want to cancel this order?")) {
            try {
                await updateMyAiOrderStatus(orderId, 'cancelled');
                setAiOrders(prev =>
                    prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o)
                );
            } catch (err) {
                alert("Failed to cancel: " + (err.response?.data?.message || err.message));
            }
        }
    };

    return(
        <div className={styles.orders}>
            <BackButton to="/account"/>
            <div className={styles.orderContentContainer}>
                <h2>My Orders</h2>

                {/* Tab switcher */}
                <div className={styles.tabContainer}>
                    <button
                        className={`${styles.tabButton} ${selectedTab === 'regular' ? styles.activeTab : styles.nonActiveTab}`}
                        onClick={() => { setSelectedTab('regular'); setSelectedStatus(''); }}
                    >
                        Regular Orders
                    </button>
                    <button
                        className={`${styles.tabButton} ${selectedTab === 'ai' ? styles.activeTab : styles.nonActiveTab}`}
                        onClick={() => { setSelectedTab('ai'); setSelectedStatus(''); }}
                    >
                        Custom Lab Orders
                    </button>
                </div>

                <div className={styles.toolbar}>
                    <SearchBar 
                        placeholder="Search orders by id"
                        value={searchTerm}
                        onChange={setSearchTerm}
                        onSearch={handleSearch}
                    />

                    <select 
                        className={styles.filterSelect}
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        <option value="">All Status</option>
                        {statusOptions.map(status => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.orderItemContainer}>
                    {loading ? (
                        <Loading/>
                    ) : selectedTab === 'regular' ? (
                        orders.length > 0 ? (
                            orders.map((order, index) => (
                                <div
                                    key={order.order_id}
                                    className={styles.orderCardWrapper}
                                    style={{ animationDelay: `${index * 0.08}s` }}
                                >
                                    <OrderCard order={order} key={order.order_id}/>
                                </div>
                            ))
                        ) : (
                            <p>You do not have any orders.</p>
                        )
                    ) : (
                        aiOrders.length > 0 ? (
                            aiOrders.map((order, index) => (
                                <div
                                    key={order.id}
                                    className={styles.orderCardWrapper}
                                    style={{ animationDelay: `${index * 0.08}s` }}
                                >
                                    <AiCustomOrderCard
                                        order={order}
                                        aiResult={order.aiResult}
                                        onDelete={handleAiDelete}
                                        onPlaceOrder={handlePlaceOrder}
                                        onCancel={handleAiCancel}
                                        onPayNow={handlePayNow}
                                    />
                                </div>
                            ))
                        ) : (
                            <p>You do not have any AI custom orders.</p>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

export default Orders;