import styles from './SpecialtyCard.module.css';

function SpecialtyCard({icon, title, desc, image}){
    return(
        <div className={styles.specialtyCardContainer}>
            <img
                className={styles.specialtyCardImage}
                src={image}
                alt={title}
            />
            <div className={styles.specialtyCardOverlay}></div>
            <div className={styles.specialtyCardInfo}>
                <h4>{title}</h4>
                <p>{desc}</p>
            </div>
            {/* <div className={styles.specialtyCardIcon}>{icon}</div> */}
        </div>
    )
}

export default SpecialtyCard;