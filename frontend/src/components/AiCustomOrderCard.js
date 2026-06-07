import styles from './AiCustomOrderCard.module.css';
import buttonStyles from '../components/buttons/ButtonTheme.module.css';
// import { removeAiCustomOrder } from '../api/aiCustomApi';
import { ORDER_STATUSES } from '../constants/OrderStatus';
import { useState } from 'react';

function AiCustomOrderCard({order, aiResult, onDelete,currentUser, onStatusChange, onAccept, onReject}){
    const [selectedStatus, setSelectedStatus] = useState(order.status);
    const [updating, setUpdating] = useState(false);
    const priceDisplay = order.admin_price > 0 
        ? `RM ${order.admin_price}` 
        : "-";
    const isAdmin = currentUser?.role === 'admin';

    return(
        <div className={styles.aiOrderCard}>
            <u><h3>Custom Lab-Order#{order.id}</h3></u>
            <div className={styles.orderInfoContainer}>
                <div className={styles.orderInfo} >                                   
                    <h6>Date:  {new Date(order.created_at).toLocaleString()}</h6>
                    <h6>
                        Updated: {
                            order.status !== 'pending'
                                ? new Date(order.updated_at).toLocaleDateString()
                                : '-'
                        }
                    </h6> 
                </div>
                {isAdmin && 
                    <div className={styles.orderInfo} >
                        <h6>Customer: {order.User?.name}</h6>
                        <h6>Contact: {order.User?.phone_no} / {order.User?.email}</h6>
                    </div>
                }
                <div className={styles.orderInfo} >  
                    Status: <h6 className={styles[order.status]}> <strong>{order.status.toUpperCase()}</strong></h6>
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
                                    {ORDER_STATUSES.UPDATE.map(status => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                                <div className={styles.statusButtons}>
                                        <button
                                            className={`${buttonStyles.button} ${buttonStyles.green}`}
                                            onClick={() =>{
                                                onStatusChange(order.id, selectedStatus);
                                                setUpdating(false);
                                            }}
                                        >
                                            Save
                                        </button>

                                        <button
                                            className={`${buttonStyles.button} ${buttonStyles.cancel}`}
                                            onClick={() =>{
                                                setSelectedStatus(order.status);
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
                <div className={styles.aiOrderItemCard}>
                    <div className={styles.aiOrderItemImageContainer}>
                        <img 
                            src={`http://localhost:3000${aiResult?.image_url}`} 
                            alt="Custom Ai design" 
                        />
                    </div>
                    <div className={styles.aiOrderDetails}>
                        <p>
                            <strong>Prompt:</strong> {aiResult?.full_prompt?.substring(0, 100)}...
                        </p>
                        <p><strong>Quoted Price:</strong> {priceDisplay}</p>
                        {order.admin_note && (
                            <p>
                                <strong>Note from Artisan:</strong> {order.admin_note}
                            </p>
                        )}
                    </div>
                    {isAdmin? ( order.status === "pending" &&
                        <div className={styles.aiOrderBtnContainer}>
                                <button 
                                    className={`${buttonStyles.button} ${buttonStyles.green}`}
                                    onClick={() => onAccept(order)}
                                >
                                    Accept
                                </button>
                            
                                <button 
                                    className={`${buttonStyles.button} ${buttonStyles.red}`}
                                    onClick={() => onReject(order)}
                                >
                                    Reject
                                </button>                          
                            </div>
                        
                    ): (
                        <div className={styles.aiOrderBtnContainer}>
                            <button 
                                className={`${buttonStyles.button} ${buttonStyles.cancel}`}
                                onClick={() => onDelete(order.id)}
                                title="Remove item"
                            >
                            Cancel Request
                            </button>
                        </div>
                    )
                    }
                </div>

            
    </div>
    )
}

export default AiCustomOrderCard;