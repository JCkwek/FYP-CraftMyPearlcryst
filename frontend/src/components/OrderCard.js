import styles from './OrderCard.module.css';
import buttonStyles from './buttons/ButtonTheme.module.css';
import OrderItemCard from './OrderItemCard';
import { ORDER_STATUSES } from '../constants/OrderStatus';
import { useState } from 'react';

function OrderCard({order, currentUser, onStatusChange }){
    const isAdmin = currentUser?.role === 'admin';
    const [selectedStatus, setSelectedStatus] = useState(order.order_status);
    const [updating, setUpdating] = useState(false);

    return(
        <div key={order.order_id} className={styles.orderCard}>
            <u><h3>Order#{order.order_id}</h3></u>
            <div className={styles.orderInfoContainer} >
                <div className={styles.orderInfo} >                                     
                    <h6>Total: RM {order.total_amount}</h6>
                    <h6>Date:  {new Date(order.createdAt).toLocaleString()}</h6>
                </div>
                {isAdmin && 
                    <div className={styles.orderInfo} >
                        <h6>Customer: {order.User?.name}</h6>
                        <h6>Contact: {order.User?.phone_no} / {order.User?.email}</h6>
                    </div>
                }
                <div className={styles.orderInfo} >
                    Status: <h6 className={styles[order.order_status]}>{order.order_status}</h6>
                </div>

                {isAdmin && (
                    !updating ? (
                        <button 
                            className={`${buttonStyles.button} ${buttonStyles.main}`}
                            onClick={() => setUpdating(true)}
                        >
                            Update Status
                        </button>
                        ) : (
                            <div className={styles.statusControls}>
                                <select
                                    className={styles.statusDropDown}
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                >
                                    {ORDER_STATUSES.map(status => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                                <div className={styles.statusButtons}>
                                        <button
                                            className={`${buttonStyles.button} ${buttonStyles.green}`}
                                            onClick={() =>{
                                                onStatusChange(order.order_id, selectedStatus);
                                                setUpdating(false);
                                            }}
                                        >
                                            Save
                                        </button>

                                        <button
                                            className={`${buttonStyles.button} ${buttonStyles.cancel}`}
                                            onClick={() =>{
                                                setSelectedStatus(order.order_status);
                                                setUpdating(false);
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                            </div>
                        ) 
                    )
                }
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
    )
}

export default OrderCard;