import styles from './Register.module.css';
import buttonStyles from '../components/buttons/ButtonTheme.module.css';
import BackButton from '../components/buttons/BackButton';
import { useState, useEffect, useRef} from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../api/userApi';
import AlertBanner from '../components/AlertBanner';

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
    const errorRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/account');
        }
    }, [navigate]);

    useEffect(() => {
        if (error) {
            errorRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }, [error]);

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
            //submitData- kinda like a javascript variable collects all the data from formData, but in this case separate confirmData
            const { confirmPassword, ...submitData } = formData; 
            await registerUser(submitData);
            alert("Registration successful! Please login.");
            navigate('/login');
        }catch(err){
            const msg = err.response?.data?.error || err.response?.data?.message || "Registration failed.";
            setError(msg);
        }  
    };


    return (
        <div className={styles.register}>
            <BackButton/>
            <div className={styles.registerCard} ref={errorRef}>
                <div className={styles.registerCardHeader}>
                    <h2>Create Account</h2>
                </div>
                    {error && <AlertBanner message={error} type="error" onClose={() => setError(null)} />}
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

                    <button type="submit" className={`${buttonStyles.button} ${buttonStyles.main}`}>
                        Register
                    </button>
                </form>
            </div>

        </div>
    )
}

export default Register;