import styles from './AiOptionCard.module.css';

function AiOptionCard({ item, onClick, className }){
    if (!item) return null;

    // Get API base URL from environment or fallback to localhost
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

    // Format image preview path safely
    const imagePath = item.image_preview || '';
    const imgSrc = imagePath.startsWith('http')
        ? imagePath
        : `${API_BASE_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;

    return(
        <div className={`${styles.aiOptionCard} ${className}`} onClick={onClick}>
            <div className={styles.aiOptionImgContainer}>
                {/* <img src={`http://localhost:3000${item.image_preview}`} alt={item.name} /> */}
                <img src={imgSrc} alt={item.name} />
            </div>

            <div className={styles.aiOptionTitleContainer}>
                {item.name}
            </div>
        </div>
    )
}

export default AiOptionCard;