import styles from './ProductDetails.module.css'
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import BackButton from '../components/buttons/BackButton';
import ProductInfo from '../components/productDetail/ProductInfo';
import ProductImage from '../components/productDetail/ProductImage';

function ProductDetails(){
    const { id } = useParams(); 
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/products/${id}`);
            setProduct(res.data);
        } catch (err) {
            console.error("Error fetching product:", err);
        }
    };
        fetchProduct();
        
    }, [id]);



    if (!product) return <p>Loading...</p>;
    return(
        <div className={styles.productDetails}>
            <BackButton />
            <div className={styles.productDetailsContentContainer}>
                <ProductImage product={product}/>
                <ProductInfo product={product}/>
            </div>

        </div>
    )
}

export default ProductDetails;