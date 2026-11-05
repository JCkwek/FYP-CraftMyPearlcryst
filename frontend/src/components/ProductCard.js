import styles from './ProductCard.module.css' 
import { useNavigate, useOutletContext } from 'react-router-dom';

function ProductCard({product}){
    const navigate = useNavigate();
    const { currentUser }  = useOutletContext();
    const isAdmin = currentUser?.role === 'admin';

    if (!product) return null;

    const productAvailability = product.product_availability
        ? "Available"
        : "Not Available"

     const handleClick = () => {
        navigate(`/products/${product.product_id}`); 
     }

     // Get API base URL from environment or fallback to empty string if path is relative/absolute
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

    // Format image path safely whether product_image starts with '/' or not
    const imageSrc = product.product_image.startsWith('http')
        ? product.product_image
        : `${API_BASE_URL}${product.product_image.startsWith('/') ? '' : '/'}${product.product_image}`;

    return(
        <div 
            className={styles.productCard}
            onClick={handleClick}
            >
            <div className={styles.productCardImageContainer}>
                {product.product_image && (
                    <img
                        // src={`http://localhost:3000${product.product_image}`}
                        src={imageSrc}
                        alt={product.product_name}
                        width="150"
                    />  
                )}
            </div>
            <div className={styles.productCardDetails}>
                <div className={styles.productCardName}>{product.product_name}</div>
                <div className={styles.productCardPriceContainer}>
                    <div className={styles.productCardPrice}>RM {product.product_price}</div>
                    {isAdmin && (productAvailability !== "Available") && <div className={styles.productCardPrice}><b style={{ color: 'red' }}>{productAvailability}</b></div>}
                </div>
                
            </div>

        </div>
    )
}

export default ProductCard;