import styles from './AdminDashboard.module.css';
import SalesBarChart from '../../components/SalesBarChart';
import { useState, useEffect } from 'react';
import { getSalesData } from '../../api/orderApi';
import Loading from '../../components/Loading';

function AdminDashboard(){
    const [salesData, setSalesData] = useState([]);
    const [loading, setLoading] = useState(true);

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

    return(
        <div className={styles.adminDashboard}>
            <div className={styles.adminDashboardContentContainer}>
                <h2>Admin Dashboard</h2>
                <div className={styles.chartRow}>
                    <div className={styles.chartCard}>
                        <h3>Monthly Sales Performance</h3>
                        
                        <div className={styles.chartWrapper}>
                            {loading?  (
                                <Loading />
                            ):(
                                <SalesBarChart data={salesData} />
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
