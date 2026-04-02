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
    const [selectedSize, setSelectedSize] = useState('');
    const [isCustomising, setIsCustomising] = useState(false);
    const [parsedSize, setParsedSize] = useState(null);

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
                quantity:1,
                size: selectedSize
            }, {
                headers:{ Authorization:`Bearer ${token}`}
            });

            alert("Added to cart successfully!");
        }catch(err){
            console.error("Error adding to cart:", err);
            alert("Failed to add to cart.");
        }
    }

    //fetch product
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

    //initialize product size
    useEffect(() =>{
        if (product && product.product_size) {
        let sizeData = product.product_size;

        // If it's a string, we MUST parse it
        if (typeof sizeData === 'string') {
            try {
                sizeData = JSON.parse(sizeData);
            } catch (e) {
                console.error("JSON Parse Error:", e);
            }
        }

        // Save the cleaned-up data to our new state
        setParsedSize(sizeData);

        // Set the default selection
        if (Array.isArray(sizeData)) {
            setSelectedSize(sizeData[0]);
        } else if (sizeData?.type === 'range') {
            setSelectedSize(sizeData.base);
        }
    }
    }, [product]) //only runs when the 'product' state is updated



    if (!product) return <p>Loading...</p>;
    return(
        <div className={styles.productDetails}>
            <BackButton />
            <div className={styles.productDetailsContentContainer}>
                <ProductImage product={product}/>
                <div className={styles.productDetailsInfo}>
                    <ProductInfo product={product}/>
                    <div className={styles.sizeSelectionContainer}>
                        {/* fixed size selection */}
                        {Array.isArray(parsedSize) && (
                            <div className={styles.fixedSizeContainer}>
                                <label>Size: </label>
                                <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
                                    {parsedSize.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        )}
                        {/* range size selection */}
                        {parsedSize?.type === 'range' && (
                            <div className={styles.rangeSizeContainer}>
                                {!isCustomising ? (
                                    <p>Length: {parsedSize.base} inch</p>
                                ) : (
                                    <input 
                                        type="range"
                                        min={parsedSize.min}
                                        max={parsedSize.max}
                                        value={selectedSize}
                                        onChange={(e) => setSelectedSize(e.target.value)}
                                    />
                                )
                            }
                            </div>
                        )}
                    </div>
                    <div className={styles.productDetailsButtons}>
                        {product.is_customisable && (
                            <button 
                                className={styles.customiseButton}
                                onClick={() => setIsCustomising(true)}
                            >Customise
                            </button>
                        )}
                        {isCustomising && (
                            <button 
                                className={styles.cancelButton}
                                onClick={() => {
                                    setIsCustomising(false);
                                    setSelectedSize(parsedSize.base); // Reset to default
                                }}
                            >
                                Cancel
                            </button>
                        )}
                        <button className={styles.addToCartButton} onClick={handleAddToCart}>Add To Cart</button>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default ProductDetails;