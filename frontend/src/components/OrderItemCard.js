import styles from './OrderItemCard.module.css'; 

function OrderItemCard({ item , status}) {
    const product = item.Product;
    const itemPrice = parseFloat(item.price_at_purchase) || 0;

    return (
        <div className={styles.orderItemCardContainer}>
            <div className={styles.orderItemCardContentContainer}>
                
                {/* product details */}
                <div className={styles.orderItemDetailsContainer}>
                    <div className={styles.orderItemImageContainer}>
                        <img 
                            src={`http://localhost:3000${product?.product_image}`} 
                            alt={product?.product_name} 
                        />
                    </div>
                    <div className={styles.orderItemInfoContainer}>
                        <h4>{product?.product_name || `Product ID: ${item.product_id}`}</h4>
                        <p>RM {itemPrice.toFixed(2)}</p>
                    </div>
                    <div className={styles.quantityTextContainer}>
                        {item.quantity}
                        {status}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderItemCard;