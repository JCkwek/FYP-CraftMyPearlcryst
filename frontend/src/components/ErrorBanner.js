import styles from './ErrorBanner.module.css'

function ErrorBanner({message}){
    return(
        <div className={styles.errorBanner}>
            {message}
        </div>
    )
}

export default ErrorBanner;