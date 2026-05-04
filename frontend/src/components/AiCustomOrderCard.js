import styles from './AiCustomOrderCard.module.css';
import buttonStyles from '../components/buttons/ButtonTheme.module.css';
// import { removeAiCustomOrder } from '../api/aiCustomApi';

function AiCustomOrderCard({order, aiResult, onDelete}){
    const priceDisplay = order.admin_price > 0 
        ? `RM ${order.admin_price}` 
        : `${order.status}`;

    return(
        <div className={styles.aiOrderCard}>
                <div className={styles.aiOrderCardContentContainer}>
                    <div className={styles.aiOrderItemImageContainer}>
                        <img 
                            src={`http://localhost:3000${aiResult?.image_url}`} 
                            alt="Custom Ai design" 
                        />
                    </div>
                    <div className={styles.aiOrderItemInfoContainer}>
                        <h4>Custom Jewelry Design</h4>
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
                </div>
                <div className={styles.aiOrderBtnContainer}>
                    <button 
                        className={`${buttonStyles.button} ${buttonStyles.cancel}`}
                        onClick={() => onDelete(order.id)}
                        title="Remove item"
                    >
                       Cancel Request
                    </button>
                </div>
        </div>
    )
}

export default AiCustomOrderCard;