import styles from './AiCustomOrderCard.module.css';

function AiCustomOrderCard({order, aiResult}){
    const priceDisplay = order.admin_price > 0 
        ? `RM ${order.admin_price}` 
        : "Pending Review";

    return(
        <div className={styles.aiOrderCard}>
            <div className={styles.aiOrderCardContentContainer}>
                <div className={styles.aiOrderItemDetailsContainer}>
                    <div className={styles.aiOrderItemImageContainer}>
                        <img 
                            src={`http://localhost:3000${aiResult?.image_url}`} 
                            alt="Custom Ai design" 
                        />
                    </div>
                    <div className={styles.aiOrderItemInfoContainer}>
                        <div className={styles.productNameContainer} >
                            <h4>Custom Jewelry Design</h4>
                            <p className={styles.promptSnippet}>
                                <strong>Prompt:</strong> {aiResult?.full_prompt?.substring(0, 100)}...
                            </p>
                            <p><strong>Quoted Price:</strong> {priceDisplay}</p>
                            {order.admin_note && (
                                <p className={styles.adminNote}>
                                    <strong>Note from Artisan:</strong> {order.admin_note}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AiCustomOrderCard;