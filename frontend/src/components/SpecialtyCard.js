import styles from './SpecialtyCard.module.css';

function SpecialtyCard({icon, title, desc}){
    return(
        <div className={styles.specialtyCardContainer}>
            <div className={styles.specialtyCardInfo}>
                <h4>{title}</h4>
                <p>{desc}</p>
            </div>
            <div className={styles.specialtyCardIcon}>{icon}</div>
        </div>
    )
}

export default SpecialtyCard;