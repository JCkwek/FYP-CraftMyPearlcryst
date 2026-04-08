import styles from './Profile.module.css';
import BackButton from '../components/buttons/BackButton.js';
import { useState, useEffect } from 'react';

function Profile(){
    const [user, setUser] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("123456 ");

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={styles.profile}>
            <BackButton />
            <div className={styles.profileContentContainer}>
                <h2>Profile</h2>
                {user ? (
                <div className={styles.profileInfoContainer}>

                    <div className={styles.profileInfo}>
                        <label>Name : </label>
                        <span>{user.name}</span>
                    </div>

                    <div className={styles.profileInfo}>
                        <label>Email : </label>
                        <span>{user.email}</span>
                    </div>

                    <div className={styles.profileInfo}>
                        <label>Phone no : </label>
                        <span>{user.phone_no}</span>
                    </div>

                    <div className={styles.profileInfo}>
                        <label>Password</label>
                        <div className={styles.passwordWrapper}>
                            <input 
                                type={showPassword ? "text" : "password"} 
                                value={password} 
                                readOnly 
                                className={styles.passwordInput}
                            />
                            <button 
                                type="button" 
                                onClick={togglePassword}
                                className={styles.viewButton}
                            >
                                {showPassword ? "Hide" : "View"}
                            </button>
                        </div>
                    </div>
                        
                </div>
                ) : (
                    <p>No user information found. Please log in.</p>
                )} 
            </div>
        </div>
    )
}

export default Profile;