import styles from './CartItemCard.module.css';
// react-icons FaTrash . 


function CartItemCard({ item, onUpdateQty, onDelete }) {
    const product = item.Product;
    const itemPrice = Number(item.price_at_addition) || 0;
    const itemTotal = (itemPrice * item.quantity).toFixed(2);

    const customDetails = typeof item.customization === 'string'
        ? JSON.parse(item.customization)
        : item.customization

    return (
        <div className={styles.cartItemCardContainer}>
            <div className={styles.cartItemCardContentContainer}>
                
                {/* product details */}
                <div className={styles.cardItemDetailsContainer}>
                    <div className={styles.cartItemImageContainer}>
                        <img 
                            src={`http://localhost:3000${product?.product_image}`} 
                            alt={product?.product_name} 
                        />
                    </div>
                    <div className={styles.cartItemInfoContainer}>
                        <div className={styles.productNameContainer} >
                            <h4>{product?.product_name}</h4>
                            Product ID: #{item.product_id}
                        </div>
                        
                        {/*custom details */}
                        <div className={styles.customDetailsContainer}>
                            {customDetails?.size && (
                                <div className={styles.customSizeLabel}>Size: {customDetails.size}</div>
                            )}
                            {customDetails?.color && (
                                <div className={styles.customColorLabel}>
                                    Color: 
                                    <span 
                                        className={styles.colorCircle} 
                                        style={{ backgroundColor: customDetails.color }}
                                        title={customDetails.color}
                                    />
                                </div>
                            )}
                        </div>
                        
                        {/* <div className={styles.itemPriceContainer} >RM {itemPrice.toFixed(2)}</div> */}
                    </div>
                </div>

                {/* quantity */}
                <div className={styles.quantityContainer}>
                    <button
                        className={styles.quantityUpdateButton} 
                        onClick={() => onUpdateQty(item.cart_item_id, 'decrement')}
                        disabled={item.quantity <= 1}
                    > - </button>
                    <div className={styles.quantityTextContainer}>{item.quantity}</div>
                    <button 
                        className={styles.quantityUpdateButton}
                        onClick={() => onUpdateQty(item.cart_item_id, 'increment')}
                    > + </button>
                </div>

                {/* total */}
                <div className={styles.totalContainer}>RM {itemTotal}</div>

                {/* delete */}
                <div className={styles.deleteContainer}>
                    <button 
                        className={styles.deleteButton}
                        onClick={() => onDelete(item.cart_item_id)}
                        title="Remove item"
                    >
                        &times;
                    </button>
                </div>
                
            </div>
        </div>
    )
}

export default CartItemCard;