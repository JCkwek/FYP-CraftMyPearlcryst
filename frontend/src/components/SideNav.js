import styles from './SideNav.module.css'
import { NavLink } from 'react-router-dom';

function SideNav({ user }){
    const isAdmin = user && user.role === 'admin';

    return(
        <div className={styles.sideNav}>
            <div className={styles.sideNavTabContainer}>
                {isAdmin ? (
                    <>
                        <NavLink 
                            to="/admin/dashboard"
                            className={({isActive}) =>
                                isActive ? `${styles.sideNavTab} ${styles.active}` : styles.sideNavTab
                            }
                        >
                            Dashboard
                        </NavLink>

                        <NavLink 
                            to="/admin/orderManagement"
                            className={({isActive}) =>
                                isActive ? `${styles.sideNavTab} ${styles.active}` : styles.sideNavTab
                            }
                        >
                            Orders
                        </NavLink>
                    </>
                ) : (
                    <NavLink 
                        to="/"
                        className={({isActive}) =>
                            isActive ? `${styles.sideNavTab} ${styles.active}` : styles.sideNavTab
                        }
                    >
                        Home
                    </NavLink>
                )}

                <NavLink 
                    to="/products" 
                    className={({isActive}) =>
                        isActive
                            ? `${styles.sideNavTab} ${styles.active}`
                            : styles.sideNavTab
                    }
                    >Products
                </NavLink>
                
                {isAdmin}
                <NavLink 
                    to="/aiCustom" 
                    className={({isActive}) =>
                        isActive
                            ? `${styles.sideNavTab} ${styles.active}`
                            : styles.sideNavTab
                    }
                    >Custom Lab
                </NavLink>

                <NavLink 
                    to="/aiChat" 
                    className={({isActive}) =>
                        isActive
                            ? `${styles.sideNavTab} ${styles.active}`
                            : styles.sideNavTab
                    }
                    >Concierge
                </NavLink>

            </div> 
                

        </div>
    )
}

export default SideNav;