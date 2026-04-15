import styles from './ErrorBanner.module.css'

function ErrorBanner({message, type = 'error'}){

    const typeClass = styles[type] || styles.error;

    return(
        <div className={`${styles.errorBanner} ${typeClass}`}>
            {message}
        </div>
    )
}

export default ErrorBanner;