import styles from './AiSelectedCard.module.css';

function AiSelectedCard({ item }){
    if (!item) return null;
    // const frontendAsset = item.image_preview?.startsWith('/assets');
    // const backendImg = frontendAsset
    //     ? item.image_preview 
    //     : `http://localhost:3000${item.image_preview}`;

    // Get API base URL from environment or fallback to localhost
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
    const imagePath = item.image_preview || '';

    // Handle external URLs, frontend public assets, and backend paths dynamically
    const backendImg = imagePath.startsWith('http') || imagePath.startsWith('/assets')
        ? imagePath 
        : `${API_BASE_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;

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