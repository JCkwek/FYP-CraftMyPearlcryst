import styles from './Orders.module.css';
import BackButton from '../components/buttons/BackButton';
function Orders(){
    return(
        <div className={styles.orders}>
            <BackButton />
            <h2>Orders</h2>
        </div>
    )
}

export default Orders;