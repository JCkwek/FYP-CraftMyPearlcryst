import styles from './OrderManagement.module.css';
import buttonStyles from '../../components/buttons/ButtonTheme.module.css';
import { useState, useEffect } from 'react';
import SearchBar from '../../components/SearchBar';
import { ORDER_STATUSES } from '../../constants/OrderStatus';
import Loading from '../../components/Loading';
import OrderCard from '../../components/OrderCard';
import {getOrders, updateOrderStatus} from '../../api/orderApi';
import {getAllAiCustomOrder, updateAiCustomOrder} from '../../api/aiCustomOrderApi';
import AiCustomOrderCard from '../../components/AiCustomOrderCard';

function OrderManagement({ currentUser }){
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState('regular');
    const [orders, setOrders] = useState([]);
    const [aiOrders, setAiOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedAiOrder, setSelectedAiOrder] = useState(null);
    const [modalType, setModalType] = useState(null); // 'quote' | 'decline'
    const [price, setPrice] = useState('');
    const [note, setNote] = useState('');

    //fetch regular orders
    const fetchOrders = async () => {
            try{
                setLoading(true);
                const orders = await getOrders({
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
        fetchOrders();
    }, [selectedStatus]);

    //fetch ai custom orders
    const fetchAiOrders = async () => {
        try{
            console.log("Fetching AI orders...");
            const res  =  await getAllAiCustomOrder();
            console.log("AI Orders:", res);
            setAiOrders(res);
        }catch(err){
            console.error("Error fetching Ai custom orders", err);
        }finally {
            setLoading(false);
        }
    };

    useEffect(() => {
            fetchAiOrders();
    }, [])

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

    const handleQuoteSubmit = async () => {
        try {
            await updateAiCustomOrder(selectedAiOrder.id, {
                status: 'quoted',
                admin_price: price,
                admin_note: note
            });
            fetchAiOrders();
            setModalType(null);
            setSelectedAiOrder(null);
        } catch (err) {
            console.error(err.response?.data)
        }
    };

    const handleRejectSubmit = async () => {
        try {
            await updateAiCustomOrder(selectedAiOrder.id, {
                status: 'declined',
                admin_note: note
            });
            fetchAiOrders();
            setModalType(null);
            setSelectedAiOrder(null);
        } catch (err) {
            console.error(err);
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
                    <SearchBar 
                        placeholder="Search orders by id and customer name"
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
                    ) : Array.isArray(aiOrders) && aiOrders.length > 0 && selectedTab === 'ai'?(
                        aiOrders.map((order) => (
                            <AiCustomOrderCard 
                                order={order} 
                                key={order.id} 
                                aiResult={order.aiResult}
                                currentUser={currentUser}
                                onAccept={(order) => {
                                setSelectedAiOrder(order);
                                setModalType('quote');
                                setPrice('');
                                setNote('');
                            }}
                            onReject={(order) => {
                                setSelectedAiOrder(order);
                                setModalType('decline');
                                setPrice('');
                                setNote('');
                            }}
                                                    />
                        ))
                    ) : (
                        <p>You do not have any orders.</p>
                    )
                    }
                </div>
                {modalType && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modal}>
                            {modalType === 'quote' ? (
                                <>
                                    <h3>Provide Quote</h3>

                                    <input
                                        type="number"
                                        placeholder="Price"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />

                                    <textarea
                                        placeholder="Optional note"
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                    />

                                    <button className={`${buttonStyles.button} ${buttonStyles.main}`} onClick={handleQuoteSubmit}>
                                        Submit Quote
                                    </button>
                                </>
                            ) : (
                                <>
                                    <h3>Reject Request</h3>

                                    <textarea
                                        placeholder="Reason for rejection"
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                    />

                                    <button className={`${buttonStyles.button} ${buttonStyles.main}`} onClick={handleRejectSubmit}>
                                        Confirm Reject
                                    </button>
                                </>
                            )}

                            <button
                                onClick={() => {
                                    setModalType(null);
                                    setSelectedAiOrder(null);
                                }}
                                className={`${buttonStyles.button} ${buttonStyles.cancel}`}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default OrderManagement;