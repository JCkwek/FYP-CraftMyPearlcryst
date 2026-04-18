import styles from './SideNav.module.css'
import { NavLink } from 'react-router-dom';
function SideNav(){
    return(
        <div className={styles.sideNav}>
            {/* <h2>SideNav</h2> */}
            <div className={styles.sideNavTabContainer}>
                <NavLink 
                    to="/"
                    className={({isActive}) =>
                        isActive
                            ? `${styles.sideNavTab} ${styles.active}`
                            : styles.sideNavTab
                    }
                    >Home
                </NavLink>

                <NavLink 
                    to="/products" 
                    className={({isActive}) =>
                        isActive
                            ? `${styles.sideNavTab} ${styles.active}`
                            : styles.sideNavTab
                    }
                    >Product
                </NavLink>

                <NavLink 
                    to="/aiCustom" 
                    className={({isActive}) =>
                        isActive
                            ? `${styles.sideNavTab} ${styles.active}`
                            : styles.sideNavTab
                    }
                    >AI Custom Jewelry
                </NavLink>

                <NavLink 
                    to="/aiChat" 
                    className={({isActive}) =>
                        isActive
                            ? `${styles.sideNavTab} ${styles.active}`
                            : styles.sideNavTab
                    }
                    >AI Chat
                </NavLink>
            </div> 
                

        </div>
    )
}

export default SideNav;