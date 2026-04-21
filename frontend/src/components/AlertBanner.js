import styles from './AlertBanner.module.css'

function ErrorBanner({message, type = 'error'}){

    const typeClass = styles[type] || styles.error;

    return(
        <div className={`${styles.alertBanner} ${typeClass}`}>
            {message}
        </div>
    )
}

export default ErrorBanner;