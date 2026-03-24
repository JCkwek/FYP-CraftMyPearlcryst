import styles from './Login.module.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BackButton from '../components/buttons/BackButton';
import axios from 'axios'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user'))

    const handleSubmit = async (e) => {
        e.preventDefault()

    try {
        const res = await axios.post('http://localhost:3000/auth/login', {
            email,
            password
        });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        console.log(res.data)
        navigate('/account')// Redirect

    } catch (err) {
        console.error(err.response?.data?.error || err.message)
        alert(err.response?.data?.error || "Login failed")
    }
    }

    return (
        <div className={styles.login}>
            <BackButton />
            <div className={styles.loginCard}>
                <h2 className={styles.title}>Welcome Back</h2>
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

                    <button type="submit" className={styles.loginButton}>
                        Login
                    </button>
                </form>

                <p className={styles.registerText}>
                    Don’t have an account? 
                    <span onClick={() => navigate('/register')}>
                        Register
                    </span>
                </p> 
            </div>
        </div>
    )
}

export default Login