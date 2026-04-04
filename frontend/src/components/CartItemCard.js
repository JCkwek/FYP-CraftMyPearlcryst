import styles from './CartItemCard.module.css';
// react-icons FaTrash . 


function CartItemCard({ item, onUpdateQty, onDelete }) {
    const product = item.Product;
    // const itemPrice = parseFloat(product?.product_price) || 0;
    const itemPrice = parseFloat(item.price_at_addition) || 0;
    const itemTotal = (itemPrice * item.quantity).toFixed(2);

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
                        <h4>{product?.product_name || `Product ID: ${item.product_id}`}</h4>
                        {item.size && (
                            <div className={styles.itemSizeLabel}>Size: {item.size} inch</div>
                        )}
                        <p>RM {itemPrice.toFixed(2)}</p>
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