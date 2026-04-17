import styles from './AiSelectedCard.module.css';

function AiSelectedCard({ item }){
    if (!item) return null;
    const frontendAsset = item.image_preview?.startsWith('/assets');
    const backendImg = frontendAsset
        ? item.image_preview 
        : `http://localhost:3000${item.image_preview}`;

    return(
        <div className={styles.aiSelectedCard}>
            <div className={styles.aiSelectedCardImgContainer}>
                <img src={backendImg} alt={item.name} />
            </div>

            <div className={styles.aiSelectedCardTitleContainer}>
                {item.name}
            </div>
        </div>
    )
}

export default AiSelectedCard;