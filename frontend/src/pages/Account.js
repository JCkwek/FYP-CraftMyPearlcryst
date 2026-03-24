import styles from './Account.module.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Account() {
    const navigate = useNavigate();

    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        setToken(localStorage.getItem('token'));
        setUser(JSON.parse(localStorage.getItem('user') || 'null'));
    }, []);

    // Logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        navigate('/login');
    };

    return (
        <div className={styles.account}>
            <div className={styles.accountContentContainer}>
                <h2>Account</h2>

                {/* NOT logged in */}
                {!token ? (
                    <div className={styles.notLoggedIn}>
                        <p>
                            Login to view your orders and manage your account
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