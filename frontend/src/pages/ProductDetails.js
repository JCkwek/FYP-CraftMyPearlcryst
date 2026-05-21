import styles from './ProductDetails.module.css';
import buttonStyles from '../components/buttons/ButtonTheme.module.css';
import { useParams } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { getProductById } from '../api/productApi';
import { addToCart } from '../api/cartApi';
import BackButton from '../components/buttons/BackButton';
import ProductInfo from '../components/productDetail/ProductInfo';
import ProductImage from '../components/productDetail/ProductImage';
import Loading from '../components/Loading';
import ColorSelect from '../components/ColorSelect';
import LengthSlider from '../components/LengthSlider';
import AlertBanner from '../components/AlertBanner';
import { useOutletContext, useNavigate, useLocation} from 'react-router-dom';

function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    // const [selectedSize, setSelectedSize] = useState('');
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState('');
    const [isCustomising, setIsCustomising] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const { currentUser }  = useOutletContext();
    const isAdmin = currentUser?.role === 'admin';
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.message) {
            setSuccessMessage(location.state.message);
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate]);


    // Fetch Product
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const fetchedProduct = await getProductById(id);
                setProduct(fetchedProduct);

                // Initialize default size
                const sizeOption = fetchedProduct.options?.find(opt =>
                    opt.option_name.toLowerCase().includes('size') ||
                    opt.option_name.toLowerCase().includes('length')
                );

                if (sizeOption) {
                    if (sizeOption.option_type === 'list') {
                        setSelectedSize(sizeOption.values[0]?.visual_value);
                    } else if (sizeOption.option_type === 'range') {
                        // const base = sizeOption.values[0]?.visual_value.split(',')[2];
                        // setSelectedSize(base);
                        setSelectedSize(sizeOption.default_value);
                    }
                }
            } catch (err) {
                console.error("Error fetching product:", err);
            }
        };
        fetchProduct();
    }, [id]);
    
    //  Dynamic Price Calculation
    const calculatedPrice = useMemo(() => {
        if (!product) return 0;
        let total = parseFloat(product.product_price);
        // for custom length (range size)
        product.options?.forEach(option => {
            if (option.option_type === 'range' && isCustomising) {
                // const config = option.values[0];
                // const [, , base] = config.visual_value.split(',').map(Number);
                // const current = parseFloat(selectedSize) || base;
                // const rate = parseFloat(config.price_modifier || 0);
            // const base = Number(option.default_value);
            // const current = Number(selectedSize ?? base);
            // const rate = Number(option.price_modifier ?? 0);

            // total += (current - base) * rate;
             const baseLength = Number(option.default_value);
            const current = Number(selectedSize ?? baseLength);

            const pricePerUnit = total / baseLength;

            total = pricePerUnit * current;
            }    
        });
        return Math.max(5.00, total);
    }, [product, selectedSize, isCustomising]);

    //  Add to Cart Handler
    const handleAddToCart = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError("Please login to add items to your cart.");
            return;
        }
        
        const customization = {};
        if (selectedSize) {
            customization.size = selectedSize.toString();
        }
        if (selectedColor) {
            customization.color = selectedColor;
        }

        const cartData = {
            productId: product.product_id,
            quantity: 1,
            displayPrice: calculatedPrice,
            customization: customization
        };

        try {
            await addToCart(cartData);
            setSuccessMessage(`Added ${product.product_name} to cart!`);
            resetCustomization(); 
            setSelectedColor('');
            setError(null);
        } catch (err) {
            console.error("Error adding to cart:", err);
            setError("Failed to add to cart.");
        }
    };

    const resetCustomization = () => {
        setIsCustomising(false);
        // Find and reset Size to base (index 2 in CSV-style string)
        const sizeOption = product?.options?.find(opt => 
            opt.option_name.toLowerCase().includes('size') || 
            opt.option_name.toLowerCase().includes('length')
        );
        if (sizeOption && sizeOption.option_type === 'range') {
            // const base = sizeOption.values[0]?.visual_value.split(',')[2];
            // setSelectedSize(base);
            setSelectedSize(sizeOption.default_value);
        }
    }

    if (!product) return <Loading />;

    return (
        <div className={styles.productDetails}>
            <div className={styles.productDetailsTopSection}>
                <BackButton to="/products"/>
                {successMessage && <AlertBanner message={successMessage} type="success" onClose={() => setSuccessMessage(null)}/>}
                {error && <AlertBanner message={error} type="warning" onClose={() => setError(null)}/>}
                <span></span><span></span>
            </div>
            <div className={styles.productDetailsContentContainer}>
                {/* <ProductImage product={product} /> */}
                <ProductImage image={`http://localhost:3000${product.product_image}`} alt={product.product_name}/>
                
                <div className={styles.productDetailsInfo}>
                    <ProductInfo product={product} displayPrice={calculatedPrice} />
                    
                    <div className={styles.sizeSelectionContainer}>
                        {product.options?.map(option => (
                            <div key={option.option_id} className={styles.optionSection}>
                                
                                {/* list type: color/fixed size */}
                                {option.option_type === 'list' && (
                                    <div className={styles.listOptionContainer}>
                                        {option.option_name.toLowerCase().includes('color') ? (
                                            isCustomising && (
                                                <ColorSelect 
                                                    option={option} 
                                                    selectedColor={selectedColor} 
                                                    onSelectColor={setSelectedColor} 
                                                />
                                            )
                                        ) : (
                                            <div className={styles.fixedSizeContainer}>
                                                <label>{option.option_name}: </label>
                                                <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
                                                    {option.values.map(val => (
                                                        <option key={val.value_id} value={val.visual_value}>
                                                            {val.visual_value}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
 
                                        )}
                                    </div>
                                )}

                                {/* range type */}
                                {option.option_type === 'range' && (
                                    <div className={styles.rangeSizeContainer}>
                                        <div>
                                            {option.option_name}: {selectedSize || option.default_value} inch
                                        </div>

                                        {isCustomising && (
                                            <div className={styles.rangeSizeInputContainer}>
                                                <LengthSlider 
                                                    onSelect={(val) => setSelectedSize(val)}
                                                    manualConstraints={
                                                        {
                                                            min: Number(option.range_min),
                                                            max: Number(option.range_max),
                                                            step: Number(option.range_step),
                                                            default: Number(option.default_value)
                                                        }
                                                    }
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {!isAdmin ? (
                        <>
                        <div className={styles.productDetailsButtons}>
                        {product.is_customisable && !isCustomising && (
                            <button className={`${buttonStyles.button} ${buttonStyles.secondary}`} onClick={() => setIsCustomising(true)}>Customise</button>
                        )}
                        {isCustomising && (
                            <button className={`${buttonStyles.button} ${buttonStyles.cancel}`} onClick={resetCustomization}>Cancel</button>
                        )}
                        <button className={`${buttonStyles.button} ${buttonStyles.green}`} onClick={handleAddToCart}> Add To Cart</button>
                        </div>
                        </>
                    ) : (
                        <button className={`${buttonStyles.button} ${buttonStyles.main}`} onClick={() => navigate('/admin/editProducts', { state: { product } })}> Edit Product</button>
                    )
                    }
                    
                    
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;