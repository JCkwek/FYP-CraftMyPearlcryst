import styles from './TopNav.module.css';
import { FaShoppingBag } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


function TopNav(){
    const navigate = useNavigate();

    return(
        <div className={styles.topNav}>
            <div><h2>CraftMyPearlcryst</h2></div>
            <div className={styles.topNavButtonsContainer}>
                <button className={styles.topNavButton} onClick={() => navigate("/cart")}>
                    <FaShoppingBag className={styles.topNavButtonIcon} />
                </button>
                <button className={styles.topNavButton} onClick={() => navigate("/account")}>
                    <FaUser className={styles.topNavButtonIcon} />
                </button>
            </div>
        </div>
    )
}

export default TopNav;