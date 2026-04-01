import styles from './Login.module.css'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BackButton from '../components/buttons/BackButton';
// import axios from 'axios';
import api from '../api';
import ErrorBanner from '../components/ErrorBanner';

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate()

    // const user = JSON.parse(localStorage.getItem('user'))

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/account');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

    try {
        const res = await api.post('/auth/login', {
            email,
            password
        });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        console.log(res.data)
        navigate('/account')// Redirect

    } catch (err) {
        const msg = err.response?.data?.error || "Login failed";
        setError(msg);
    }finally{
        setLoading(false);
    }
    }

    return (
        <div className={styles.login}>
            <BackButton />
            <div className={styles.loginCard}>
                <h2>Welcome Back</h2>
                {error && <ErrorBanner message={error}/>}
                <form onSubmit={handleSubmit} className={styles.loginForm}>
                    <div className={styles.loginFormInput}>
                        <label>Email</label>
                        <br></br>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.loginFormInput}>
                        <label>Password</label>
                        <br></br>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className={styles.loginButton}
                        disabled={loading} //prevent double click
                    >
                        { loading? "Logging in...": "Login"}
                    </button>
                </form>

                <p className={styles.registerText}>
                    Don’t have an account? 
                    <span onClick={() => navigate('/register')}>
                        <u>Register</u>
                    </span>
                </p> 
            </div>
        </div>
    )
}

export default Login