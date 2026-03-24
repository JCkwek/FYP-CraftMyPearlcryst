import styles from './CartItemCard.module.css'

function CartItemCard(){
    return(
        <div className={styles.cartItemCardContainer}>
            <div className={styles.cartItemCardContentContainer}>
                <div className={styles.cartItemImageContainer}>

                </div>
                <div className={styles.cartItemInfoContainer}>
                    
                </div>
            </div>
        </div>
    )
}

export default CartItemCard;