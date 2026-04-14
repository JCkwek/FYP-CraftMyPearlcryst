import styles from './AiSelectedCard.module.css';

function AiSelectedCard({ item }){
    if (!item) return null;
    return(
        <div className={styles.aiSelectedCard}>
            <div className={styles.aiSelectedCardImgContainer}>
                <img src={`http://localhost:3000${item.image_preview}`} alt={item.name} />
            </div>

            <div className={styles.aiSelectedCardTitleContainer}>
                {item.name}
            </div>
        </div>
    )
}

export default AiSelectedCard;