import styles from './AiCustomOrder.module.css'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {fetchAiCustomOrder, removeAiCustomOrder} from '../api/aiCustomOrderApi';
import AiCustomOrderCard from '../components/AiCustomOrderCard';
import Loading from '../components/Loading';
import SearchBar from '../components/SearchBar';
import { ORDER_STATUSES } from '../constants/OrderStatus';

function AiCustomOrder(){
    const navigate = useNavigate();
    const [aiOrders, setAiOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const token = localStorage.getItem('token');

    const fetchAiOrders = async () => {
        try{
            const res  =  await fetchAiCustomOrder({
                query: searchTerm,
                status: selectedStatus
            });

            console.log("AI orderss: ",res)
            setAiOrders(res);
        }catch(err){
            console.error("Error fetching Ai custom orders", err);
        }finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        if (!token) {
            navigate('/login', { replace: true }); // 'replace: true' wipes the "Orders" from the history stack
        }

        fetchAiOrders();
    }, [token, navigate, selectedStatus])

     if (!token) return null;

    const handleDelete = async(orderId) => {
        if (window.confirm("Are you sure you want to cancel this request?")) {
            try {
                await removeAiCustomOrder(orderId);
                setAiOrders(aiOrders.filter(o => o.id !== orderId)); // Local update
            } catch (err) {
                alert("Failed to delete: " + err.message);
            }
        }
    }

    return(
        <div className={styles.aiOrder}>
            <div className={styles.aiOrderContentContainer}>
                <h2>Custom Lab Orders</h2>
                <div className={styles.toolbar}>
                    <SearchBar 
                        placeholder="Search orders by id"
                        value={searchTerm}
                        onChange={setSearchTerm}
                        onSearch={fetchAiOrders}
                    />

                    <select 
                        className={styles.filterSelect}
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        <option value="">All Status</option>
                        {ORDER_STATUSES.AI.map(status => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>

                    <div className={styles.aiOrderItemContainer}>
                    { loading?(
                        <Loading/>
                    ) : aiOrders.length > 0 ? (
                        aiOrders.map((order) => (
                            <div key={order.id} className={styles.orderGroup}>            
                                <AiCustomOrderCard 
                                    order={order} 
                                    aiResult={order.aiResult}
                                    onDelete={handleDelete}
                                />
                            </div>
                        ))
                    ) : (
                        <p>You do not have any custom lab orders.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AiCustomOrder;