import styles from './CartItemCard.module.css'

function CartItemCard({item}){
    const product = item.Product;

    const itemPrice = parseFloat(product?.product_price) || 0;
    const itemTotal = (itemPrice * item.quantity).toFixed(2);

    return(
        <div className={styles.cartItemCardContainer}>
            <div className={styles.cartItemCardContentContainer}>
                <div className={styles.cardItemDetailsContainer}>
                    <div className={styles.cartItemImageContainer}>
                        <img 
                            src={`http://localhost:3000${product?.product_image}`} 
                            alt={product?.product_name} 
                        />
                    </div>
                    <div className={styles.cartItemInfoContainer}>
                        <h4>{product?.product_name || `Product ID: ${item.product_id}`}</h4>
                        <p>price: RM {itemPrice.toFixed(2)}</p>
                    </div>
                </div>
                <div className={styles.cartItemQtyTotContainer}>
                    <div className={styles.quantityContainer}><p>{item.quantity}</p></div>
                    <div className={styles.totalContainer}><p>RM {itemTotal}</p></div>
                </div>
                
            </div>
        </div>
    )
}

export default CartItemCard;