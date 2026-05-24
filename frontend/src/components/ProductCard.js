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
                <div className={styles.productCardName}>{product.product_name}</div>
                <div className={styles.productCardPrice}>RM {product.product_price} {isAdmin && (productAvailability !== "Available") && <b style={{ color: 'red' }}>{productAvailability}</b>}</div>
            </div>

        </div>
    )
}

export default ProductCard;