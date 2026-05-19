import styles from './Profile.module.css';
import buttonStyles from '../components/buttons/ButtonTheme.module.css';
import BackButton from '../components/buttons/BackButton.js';
import { useState, useEffect } from 'react';
import { updateProfile } from '../api/userApi';
import Loading from '../components/Loading.js';
import AlertBanner from '../components/AlertBanner.js';

function Profile(){
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        phone_no: '',
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            // fill form with existing data
            setFormData(prev => ({
                ...prev,
                name: parsedUser.name || '',
                phone_no: parsedUser.phone_no || ''
            }));
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        if (formData.password && formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        try {
            const updatedUser = await updateProfile(formData);
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setIsEditing(false);
            setSuccessMessage("Profile updated successfully!");
        } catch (err) {
            console.error(err);
            setError("Failed to update profile.");
        }
    };

    if (!user) {
        return <Loading />;
    }

    return (
        <div className={styles.profile}>
            <div className={styles.profileTopSection}>
                <BackButton />
                {successMessage && <AlertBanner message={successMessage} type="success" onClose={() => setSuccessMessage(null)}/>}
                {error && <AlertBanner message={error} type="error" onClose={() => setError(null)}/>}
                <span></span><span></span>
            </div>
            <div className={styles.profileContentContainer}>
                <h2>Profile</h2>
                
                <div className={styles.profileInfoContainer}>

                    <div className={styles.profileInfo}>
                        <label>Name : </label>
                        {isEditing? (
                            <input name="name" value={formData.name} onChange={handleChange} className={styles.profileInput} />
                        ) : (
                            <span>{user?.name}</span>
                        )}
                    </div>

                    {/* email usually read-only (security purposes) */}
                    <div className={styles.profileInfo}>
                        <label>Email : </label>
                        <span className={styles.readOnlyEmail}>{user?.email}</span>
                    </div>

                    <div className={styles.profileInfo}>
                        <label>Phone no : </label>
                        {isEditing? (
                            <input name="phone_no" value={formData.phone_no} onChange={handleChange} className={styles.profileInput} />
                        ) : (
                            <span>{user?.phone_no}</span>
                        )}
                        
                    </div>

                    <div className={styles.profileInfo}>
                        <label>Password</label>
                        {isEditing && (
                            <>
                                <div className={styles.profileInfo}>
                                    <label>New Password</label>
                                    <input 
                                        type="password" 
                                        name="password" 
                                        placeholder="Leave blank to keep current" 
                                        onChange={handleChange} 
                                        className={styles.profileInput} 
                                    />
                                </div>
                                <div className={styles.profileInfo}>
                                    <label>Confirm Password</label>
                                    <input 
                                        type="password" 
                                        name="confirmPassword" 
                                        onChange={handleChange} 
                                        className={styles.profileInput} 
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    {isEditing ? (
                        <div className={styles.profileButtons}>
                            <button className={`${buttonStyles.button} ${buttonStyles.cancel}`} onClick={() => setIsEditing(false)}>Cancel</button>
                            <button className={`${buttonStyles.button} ${buttonStyles.green}`} onClick={handleSave}>Save Changes</button>
                        </div>
                    ) : (
                        <div className={styles.profileButtons}>
                            <button className={`${buttonStyles.button} ${buttonStyles.main}`} onClick={() => setIsEditing(true)}>Edit Profile</button>
                        </div>
                    )
                }
                        
                </div>

            </div>
        </div>
    )
}

export default Profile;