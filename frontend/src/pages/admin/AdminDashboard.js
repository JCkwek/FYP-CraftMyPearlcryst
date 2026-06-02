import styles from './AdminDashboard.module.css';
import buttonStyles from '../../components/buttons/ButtonTheme.module.css';
import SalesBarChart from '../../components/SalesBarChart';
import { useState, useEffect } from 'react';
import { getSalesData } from '../../api/orderApi';
import Loading from '../../components/Loading';
import {getOrders} from '../../api/orderApi';
import { useNavigate } from 'react-router-dom'
import DashboardOrderCard from '../../components/admin/DashboardOrderCard';

function AdminDashboard(){
    const [salesData, setSalesData] = useState([]);
    const [loading, setLoading] = useState(true);   
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSales = async () => {
            try {
                setLoading(true);
                const data = await getSalesData();
                setSalesData(data);
            } catch (err) {
                console.error("Error fetching admin analytics:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSales();
    }, []);

    useEffect(() => {
        const fetchOrders = async () => {
            try{
                setLoading(true);
                const orders = await getOrders({
                status: "paid"
            });
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
        <div className={styles.adminDashboard}>
            <div className={styles.adminDashboardContentContainer}>
                <h2>Admin Dashboard</h2>
                <div className={styles.cardRow}>
                    <div className={styles.dashboardCard}>
                        <h4>Monthly Sales Performance</h4>
                        <div className={styles.cardContentContainer}>
                            {loading?  (
                                <Loading />
                            ):(
                                <SalesBarChart data={salesData} />
                            )
                            }
                        </div>
                    </div>
                    <div className={styles.dashboardCard}>
                        <h4>Orders</h4>
                        <div className={styles.cardContentContainer}>
                            {loading?  (
                                <Loading />
                            ):(
                                <div className={styles.newOrdersCard} >
                                    <p>You have new <b>{`${orders.length}`} </b> new orders.</p>
                                     <div className={styles.newOrdersItemContainer} >
                                        {orders.map((order) => (
                                            <DashboardOrderCard 
                                                order={order} 
                                                key={order.order_id} 
                                            />
                                        ))}
                                    </div>
                                    <button 
                                        className={`${buttonStyles.button} ${buttonStyles.main}`}
                                        onClick={() => navigate('/admin/orderManagement')}
                                    >
                                        View Orders
                                    </button>
                                </div>
                            )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard;
