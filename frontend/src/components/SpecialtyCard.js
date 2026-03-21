import styles from './SpecialtyCard.module.css';

function SpecialtyCard({icon, title, desc}){
    return(
        <div className={styles.specialtyCardContainer}>
            <div>{icon}</div>
            <h4>{title}</h4>
            <p>{desc}</p>
        </div>
    )
}

export default SpecialtyCard;