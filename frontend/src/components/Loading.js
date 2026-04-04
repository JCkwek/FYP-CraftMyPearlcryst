import React from 'react';
import styles from './Loading.module.css';

function Loading({ message = "Loading...", fullPage = true }){
    return (
        <div className={`${styles.loaderContainer} ${fullPage ? styles.fullPage : ''}`}>
        <div className={styles.spinner}></div>
        {/* {message && <p className={styles.message}>{message}</p>} */}
        </div>
    );
}

export default Loading;