import styles from './ProductDetails.module.css'
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
// import axios from 'axios';
import api from '../api';
import BackButton from '../components/buttons/BackButton';
import ProductInfo from '../components/productDetail/ProductInfo';
import ProductImage from '../components/productDetail/ProductImage';
import { useNavigate } from 'react-router-dom'; 

function ProductDetails(){
    const navigate = useNavigate();
    const { id } = useParams(); 
    const [product, setProduct] = useState(null);

    const handleAddToCart = async () => {
        const token = localStorage.getItem('token');
        if(!token){
            alert("Please login to add items to your cart. ");
            navigate('/login');
            return;
        }

        try{
            await api.post('/cart', {
                productId: product.product_id,
                quantity:1
            }, {
                headers:{ Authorization:`Bearer ${token}`}
            });

            alert("Added to cart successfully!");
        }catch(err){
            console.error("Error adding to cart:", err);
            alert("Failed to add to cart.");
        }
    }

    useEffect(() => {
        const fetchProduct = async () => {
        try {
            const res = await api.get(`/products/${id}`);
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
                <div className={styles.productDetailsInfo}>
                    <ProductInfo product={product}/>
                    <div className={styles.productDetailsButtons}>
                        {product.is_customisable && (
                            <button className={styles.customiseButton}>Customise</button>
                        )}
                        <button className={styles.addToCartButton} onClick={handleAddToCart}>Add To Cart</button>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default ProductDetails;