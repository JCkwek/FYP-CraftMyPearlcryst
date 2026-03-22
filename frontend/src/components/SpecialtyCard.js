import styles from './SpecialtyCard.module.css';

function SpecialtyCard({icon, title, desc}){
    return(
        <div className={styles.specialtyCardContainer}>
            <div className={styles.specialtyCardIcon}>{icon}</div>
            <div className={styles.specialtyCardInfo}>
                <h5>{title}</h5>
                <p>{desc}</p>
            </div>
        </div>
    )
}

export default SpecialtyCard;