import styles from './TopNav.module.css';
import CartButton from './buttons/CartButton';


function TopNav(){
    return(
        <div className={styles.topNav}>
            <div><h2>CraftMyPearlcryst</h2></div>
            <div className={styles.topNavButtonsContainer}>
                <CartButton />
            </div>
        </div>
    )
}

export default TopNav;