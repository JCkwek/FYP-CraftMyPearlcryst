import styles from './SideNav.module.css'
import { NavLink } from 'react-router-dom';

function SideNav({ user,isOpen, closeSidebar }){
    const isAdmin = user && user.role === 'admin';

    return(
        <div className={`${styles.sideNav} ${isOpen ? styles.open : ""}`}>
            <div className={styles.sideNavTabContainer}>
                {isAdmin ? (
                    <>
                        <NavLink 
                            to="/admin/dashboard"
                            onClick={closeSidebar}
                            className={({isActive}) =>
                                isActive ? `${styles.sideNavTab} ${styles.active}` : styles.sideNavTab
                            }
                        >
                            Dashboard
                        </NavLink>

                        <NavLink 
                            to="/admin/orderManagement"
                            onClick={closeSidebar}
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
                        onClick={closeSidebar}
                        className={({isActive}) =>
                            isActive ? `${styles.sideNavTab} ${styles.active}` : styles.sideNavTab
                        }
                    >
                        Home
                    </NavLink>
                )}

                <NavLink 
                    to="/products" 
                    onClick={closeSidebar}
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
                    onClick={closeSidebar}
                    className={({isActive}) =>
                        isActive
                            ? `${styles.sideNavTab} ${styles.active}`
                            : styles.sideNavTab
                    }
                    >Custom Lab
                </NavLink>

                <NavLink 
                    to="/aiChat" 
                    onClick={closeSidebar}
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