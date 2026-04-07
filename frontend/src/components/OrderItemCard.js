import styles from './OrderItemCard.module.css'; 

function OrderItemCard({ item , status, customization}) {
    const product = item.Product;
    const itemPrice = parseFloat(item.price_at_purchase) || 0;

    console.log("Customization Prop:", customization);
let customDetails = {};
    try {
        if (customization) {
            customDetails = typeof customization === 'string' 
                ? JSON.parse(customization) 
                : customization;
            
            // If it was double-stringified, 'details' might still be a string
            if (typeof customDetails === 'string') {
                customDetails = JSON.parse(customDetails);
            }
        }
    } catch (e) {
        console.error("Error parsing customization:", e);
        customDetails = {}; // Fallback to empty object
    }

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
                    {/*name*/}
                    <div className={styles.orderItemNameContainer}>
                        <h4>{product?.product_name || `Product ID: ${item.product_id}`}</h4>
                    </div>
                    {/*custom details*/}
                    <div className={styles.customSpecs}>
                        {customDetails?.size && <span>Size: {customDetails.size} inch</span>}
                        {customDetails?.color && (
                            <div className={styles.colorRow}>
                                    Color: <span 
                                        className={styles.colorCircle} 
                                        style={{ backgroundColor: customDetails.color }}
                                    />
                                </div>
                        )}
                    </div>
                    {/*price*/}
                    <div className={styles.orderItemPriceContainer}>
                        RM {itemPrice.toFixed(2)}
                    </div>
                    { /* size */}
                    {/* <div className={styles.orderItemSizeContainer}>
                        {size ? `size: ${size}` : 'Standard Size'}
                    </div> */}
                    {/* quantity */}
                    <div className={styles.quantityContainer}>
                        x {item.quantity}
                    </div>
                    {/* status */}
                    <div className={styles.statusContainer}>
                        {status}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderItemCard;