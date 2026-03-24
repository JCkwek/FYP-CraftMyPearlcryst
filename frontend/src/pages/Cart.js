import styles from './Cart.module.css';
import BackButton from '../components/buttons/BackButton';
import CartItemCard from '../components/CartItemCard';

function Cart(){
    return (
        <div className={styles.cart}>
            <BackButton />
            <div className={styles.cartContentContainer}>
                <h2>Your Cart</h2>
                <div className={styles.cartItemContainer}>
                    <CartItemCard />
                </div>
                
            </div>
        </div>
    )
}

export default Cart;