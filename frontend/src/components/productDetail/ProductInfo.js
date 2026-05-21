import styles from './ProductInfo.module.css';
import { useOutletContext} from 'react-router-dom';

function ProductInfo({product, displayPrice}){
    const { currentUser }  = useOutletContext();
    const isAdmin = currentUser?.role === 'admin';
    if (!product) return null;

    return(
        <div className={styles.productInfoContainer}>
            {isAdmin && (
                <h3>ID: #{product.product_id}</h3>
            )}
            <b><h1>{product.product_name}</h1></b>
            <h5>RM {parseFloat(displayPrice).toFixed(2)}</h5>
            <p>{product.product_desc}</p>
        </div>
    )
}

export default ProductInfo;