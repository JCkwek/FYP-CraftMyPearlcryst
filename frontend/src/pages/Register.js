import styles from './Register.module.css'
import BackButton from '../components/buttons/BackButton';
import { useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
// import axios from 'axios';
import api from '../api';

function Register(){
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone_no: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/account');
        }
    }, [navigate]);

    const handleChange = (e) =>{
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) =>{
        e.preventDefault();
        setError('');

        if(formData.password !== formData.confirmPassword){
            return setError("Password do not match");
        }

        try{
            const response = await api.post('/auth/register', {
                name: formData.name,
                email: formData.email,
                phone_no: formData.phone_no,
                password: formData.password
            });

            if(response.status === 201){
                alert("Registration successful! Please login.");
                navigate('/login');
            }
        }catch(err){
            setError(err.response?.data?.message || "Registration failed. Try again. ");
        }  
    };


    return (
        <div className={styles.register}>
            <BackButton />
            <div className={styles.registerCard}>
                <h2>Create Account</h2>
                {error && <div className={styles.errorBanner}>{error}</div>}
                <form onSubmit={handleSubmit} className={styles.registerForm}>
                    <div className={styles.registerFormInput}>
                        <label>Name</label>
                        <br></br>
                        <input 
                            type="text" 
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.registerFormInput}>
                        <label>Email</label>
                        <br></br>
                        <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.registerFormInput}>
                        <label>Phone no. </label>
                        <br></br>
                        <input 
                            type="text" 
                            name="phone_no"
                            value={formData.phone_no}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.registerFormInput}>
                        <label>Password</label>
                        <br></br>
                        <input 
                            type="password" 
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.registerFormInput}>
                        <label>Confirm Password</label>
                        <br></br>
                        <input 
                            type="password" 
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className={styles.registerButton}>
                        Register
                    </button>
                </form>
            </div>

        </div>
    )
}

export default Register;