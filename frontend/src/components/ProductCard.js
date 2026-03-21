import styles from './ProductCard.module.css' 

function ProductCard({product}){
     if (!product) return null;

    return(
        <div className={styles.productCard}>
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
            {/* <p>{product.product_desc}</p> */}
            </div>
        </div>
    )
}

export default ProductCard;