import styles from './Account.module.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

function Account() {
    const navigate = useNavigate();
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);

        // Logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        // navigate('/login');
    };

    useEffect(() => {
    const checkAuth = () => {
        const storedToken = localStorage.getItem('token');
        const storedUser = JSON.parse(localStorage.getItem('user') || 'null');

        if (!storedToken) {
            setToken(null);
            setUser(null);
            return;
        }

        try {
            const decoded = jwtDecode(storedToken);
            const currentTime = Date.now() / 1000;

            if (decoded.exp < currentTime) {
                console.warn("Token expired, logging out...");
                handleLogout();
            } else {
                setToken(storedToken);
                setUser(storedUser);
            }
        } catch (error) {
            handleLogout();
        }
    };

    // Run once on mount
    checkAuth();

    // Check every 10 seconds so the user is kicked 
    // out even if they don't refresh the page
    const interval = setInterval(checkAuth, 10000);
    return () => clearInterval(interval); // Cleanup on unmount
}, []);



    return (
        <div className={styles.account}>
            <div className={styles.accountContentContainer}>
                <h2>Account</h2>

                {/* NOT logged in */}
                {!token ? (
                    <div className={styles.notLoggedIn}>
                        <p>
                            Login to view your orders and manage your account.
                        </p>

                        <button
                            className={styles.loginButton}
                            onClick={() => navigate('/login')}
                        >
                            Login / Register
                        </button>
                    </div>
                ) : (
                    /* Logged in */
                    <div className={styles.loggedIn}>
                        <h4>Welcome, {user?.name}</h4>
                        <div className={styles.accountSectionsContainer}>
                            <div className={styles.accountProfileSection}>
                                <h5>Profile</h5>
                            </div>
                            <div className={styles.accountOrdersSection} onClick={() => navigate('/orders')}>
                                <h5>Orders</h5>
                            </div>
                        </div>
                        <button className={styles.logoutButton} onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Account;