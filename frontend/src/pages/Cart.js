import styles from './Cart.module.css';
import BackButton from '../components/buttons/BackButton';
function Cart(){
    return (
        <div className={styles.cart}>
            <BackButton />
            <div className={styles.cartContentContainer}>
                <h2>Your Cart</h2>
            </div>

        </div>
    )
}

export default Cart;