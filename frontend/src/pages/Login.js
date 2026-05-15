import styles from './Login.module.css'
import buttonStyles from '../components/buttons/ButtonTheme.module.css'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BackButton from '../components/buttons/BackButton';
import api from '../api/api';
import AlertBanner from '../components/AlertBanner';

function Login({ onLoginSuccess }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (token && storedUser) {
            try {
                const user = JSON.parse(storedUser);
                if (user.role === 'admin') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/account');
                }
            } catch (e) {
                // Clear corruption just in case
                localStorage.clear();
            }
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await api.post('/auth/login', {
                email,
                password
            });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            console.log(res.data)
            if (onLoginSuccess) {
                onLoginSuccess(res.data.user);
            }
            const user = res.data.user;
            if (user && user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/account');
            }
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
                <div className={styles.loginCardHeader}>
                    <h2>Welcome Back</h2>
                </div>
                {error && <AlertBanner message={error} onClose={() => setError(null)}/>}
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
                        className={`${buttonStyles.button} ${buttonStyles.main}`}
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