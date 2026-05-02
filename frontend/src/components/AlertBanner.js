import styles from './AlertBanner.module.css'
import { useEffect, useState } from 'react';

function ErrorBanner({message, type = 'error', onClose}){
    const typeClass = styles[type] || styles.error;
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        if (!message) return;
        setIsExiting(false);
        const timer = setTimeout(() => {
            setIsExiting(true);
            const unmountTimer = setTimeout(() => {
                onClose();
            }, 300);
            return () => clearTimeout(unmountTimer);
        }, 3000);
        return () => clearTimeout(timer);
    }, [message, onClose]);

    if (!message) return null;

    return(
        <div className={`${styles.alertBanner} ${typeClass} ${isExiting ? styles.fadeOut : ''}`}>
            {message}
        </div>
    )
}

export default ErrorBanner;