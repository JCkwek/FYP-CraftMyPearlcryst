import styles from './ProductCard.module.css' 
import { useNavigate } from 'react-router-dom';

function ProductCard({product}){
    const navigate = useNavigate();

     if (!product) return null;

     const handleClick = () => {
        navigate(`/products/${product.product_id}`); 
     }

    return(
        <div 
            className={styles.productCard}
            onClick={handleClick}
            >
            <div className={styles.productCardImageContainer}>
                {product.product_image && (
                    <img
                        src={`http://localhost:3000${product.product_image}`}
                        alt={product.product_name}
                        width="150"
                    />  
                )}
            </div>
            <div className={styles.productCardDetails}>
                <h6>{product.product_name}</h6>
                <p>RM {product.product_price}</p>
            </div>
        </div>
    )
}

export default ProductCard;