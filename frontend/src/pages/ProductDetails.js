import styles from './ProductDetails.module.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import api from '../api';
import BackButton from '../components/buttons/BackButton';
import ProductInfo from '../components/productDetail/ProductInfo';
import ProductImage from '../components/productDetail/ProductImage';
import Loading from '../components/Loading';
import ColorSelect from '../components/ColorSelect';

function ProductDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [isCustomising, setIsCustomising] = useState(false);

    // Fetch Product Data
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/${id}`);
                const fetchedProduct = res.data;
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
                        const base = sizeOption.values[0]?.visual_value.split(',')[2];
                        setSelectedSize(base);
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
                const config = option.values[0];
                const [, , base] = config.visual_value.split(',').map(Number);
                const current = parseFloat(selectedSize) || base;
                const rate = parseFloat(config.price_modifier || 0);
                total += (current - base) * rate;
            }    
        });
        return Math.max(5.00, total);
    }, [product, selectedSize, isCustomising]);

    //  Add to Cart Handler
    const handleAddToCart = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Please login to add items to your cart.");
            navigate('/login');
            return;
        }
        
        const customization = {};
        if (selectedSize) {
            customization.size = selectedSize.toString();
        }
        if (selectedColor) {
            customization.color = selectedColor;
        }

        try {
            await api.post('/cart', {
                productId: product.product_id,
                quantity: 1,
                displayPrice: calculatedPrice,
                customization: customization
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert(`Added ${product.product_name} to cart!`);
        } catch (err) {
            console.error("Error adding to cart:", err);
            alert("Failed to add to cart.");
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
            const base = sizeOption.values[0]?.visual_value.split(',')[2];
            setSelectedSize(base);
        }

        // Find and reset Color to the 1st option (default)
        // const colorOption = product?.options?.find(opt => 
        //     opt.option_name.toLowerCase().includes('color')
        // );
        // if (colorOption && colorOption.values.length > 0) {
        //     setSelectedColor(colorOption.values[0].value_label);
        // }
    }

    if (!product) return <Loading />;

    return (
        <div className={styles.productDetails}>
            <BackButton />
            <div className={styles.productDetailsContentContainer}>
                <ProductImage product={product} />
                
                <div className={styles.productDetailsInfo}>
                    <ProductInfo product={product} displayPrice={calculatedPrice} />
                    
                    <div className={styles.sizeSelectionContainer}>
                        {product.options?.map(option => (
                            <div key={option.option_id} className={styles.optionSection}>
                                
                                {/* LIST TYPE (COLORS OR DROP-DOWN SIZES) */}
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

                                {/* RANGE TYPE (CUSTOM SLIDER) */}
                                {option.option_type === 'range' && (
                                    <div className={styles.rangeSizeContainer}>
                                        {!isCustomising ? (
                                            <div>{option.option_name}: {selectedSize} inch</div>
                                        ) : (
                                            <div className={styles.rangeSizeInputContainer}>
                                                <div>{option.option_name}:</div> 
                                                <div className={styles.rangeSizeInputContainerTop}>
                                                    {selectedSize} inch
                                                </div>
                                                <div className={styles.rangeSizeInputContainerBottom}>
                                                    <div className={styles.rangeSizeInputText}>{option.values[0].visual_value.split(',')[0]}</div>
                                                    <input
                                                        className={styles.rangeSizeInput}
                                                        type="range"
                                                        min={option.values[0].visual_value.split(',')[0]}
                                                        max={option.values[0].visual_value.split(',')[1]}
                                                        value={selectedSize}
                                                        onChange={(e) => setSelectedSize(e.target.value)}
                                                    />
                                                    <div className={styles.rangeSizeInputText}>{option.values[0].visual_value.split(',')[1]}</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className={styles.productDetailsButtons}>
                        {product.is_customisable && !isCustomising && (
                            <button className={styles.customiseButton} onClick={() => setIsCustomising(true)}>
                                Customise
                            </button>
                        )}
                        
                        {isCustomising && (
                            <button className={styles.cancelButton} onClick={resetCustomization}>
                                Cancel
                            </button>
                        )}
                        
                        <button className={styles.addToCartButton} onClick={handleAddToCart}>
                            Add To Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;