import styles from './ProductInfo.module.css'

function ProductInfo({product}){
    if (!product) return null;

    return(
        <div className={styles.productInfoContainer}>
            <b><h1>{product.product_name}</h1></b>
            <h5>RM {product.product_price}</h5>
            <p>{product.product_desc}</p>
        </div>
    )
}

export default ProductInfo;