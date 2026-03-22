import styles from './ProductImage.module.css'

function ProductImage({product}){
    if (!product) return null;

    return(
        <div className={styles.productImageContainer}>
            <img
                src={`http://localhost:3000${product.product_image}`}
                alt={product.product_name}
            />  
        </div>
    )
}

export default ProductImage;