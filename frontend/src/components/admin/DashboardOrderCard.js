import styles from './DashboardOrderCard.module.css';

function DashboardOrderCard({order}){
    return(
        <div key={order.order_id} className={styles.orderCard}>
            <u><h6>Order#{order.order_id}</h6></u>
            <div className={styles.orderInfoContainer} >
                <div className={styles.orderInfo} >                                     
                    <h6>Customer: {order.User?.name}</h6>
                    <h6>Status: <b className={styles[order.order_status]}>{order.order_status.toUpperCase()}</b></h6>
                </div>
                <div className={styles.orderInfo} >                                     
                    <h6>Total: RM {order.total_amount}</h6>
                    <h6>Date:  {new Date(order.createdAt).toLocaleString()}</h6>
                    <h6>Items: {order.OrderItems?.length}</h6>
                </div>

            </div> 
        </div>        
    )
}

export default DashboardOrderCard;