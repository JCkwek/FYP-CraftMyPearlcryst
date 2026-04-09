import styles from './Profile.module.css';
import BackButton from '../components/buttons/BackButton.js';
import { useState, useEffect } from 'react';
import api from '../api';
import Loading from '../components/Loading.js'

function Profile(){
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
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
            // Pre-fill form with existing data
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
            alert("Passwords do not match!");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const res = await api.put(`/users/profile`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update local state and storage
            const updatedUser = res.data; 
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (err) {
            console.error(err);
            alert("Failed to update profile.");
        }
    };

    if (!user) {
        return <Loading />;
    }

    return (
        <div className={styles.profile}>
            <BackButton />
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
                            <button className={styles.cancelButton} onClick={() => setIsEditing(false)}>Cancel</button>
                            <button className={styles.saveButton} onClick={handleSave}>Save Changes</button>
                        </div>
                    ) : (
                        <div className={styles.profileButtons}>
                            <button className={styles.editButton} onClick={() => setIsEditing(true)}>Edit Profile</button>
                        </div>
                    )
                }
                        
                </div>

            </div>
        </div>
    )
}

export default Profile;