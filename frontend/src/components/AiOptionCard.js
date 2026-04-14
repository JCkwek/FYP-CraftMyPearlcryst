import styles from './AiOptionCard.module.css';

function AiOptionCard({ item, onClick, className }){
    if (!item) return null;
    return(
        <div className={`${styles.aiOptionCard} ${className}`} onClick={onClick}>
            <div className={styles.aiOptionImgContainer}>
                <img src={`http://localhost:3000${item.image_preview}`} alt={item.name} />
            </div>

            <div className={styles.aiOptionTitleContainer}>
                {item.name}
            </div>
        </div>
    )
}

export default AiOptionCard;