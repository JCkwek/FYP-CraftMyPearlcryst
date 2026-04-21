import styles from './AlertBanner.module.css'
import { useEffect } from 'react';

function ErrorBanner({message, type = 'error', onClose}){
    const typeClass = styles[type] || styles.error;

    useEffect(() => {
        if (!message) return;
        const timer = setTimeout(() => {
            onClose(); 
        }, 5000);
        return () => clearTimeout(timer);
    }, [message, onClose]);

    if (!message) return null;

    return(
        <div className={`${styles.alertBanner} ${typeClass}`}>
            {message}
        </div>
    )
}

export default ErrorBanner;