import styles from './ProductImage.module.css'

function ProductImage({image, alt}){
    if (!image) return null;

    return(
        <div className={styles.productImageContainer}>
            <img
                src={image}
                alt={alt}
            />  
        </div>
    )
}

export default ProductImage;