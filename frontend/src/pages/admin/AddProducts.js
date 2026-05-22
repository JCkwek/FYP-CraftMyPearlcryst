import styles from './AddProducts.module.css';
import buttonStyles from '../../components/buttons/ButtonTheme.module.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/buttons/BackButton';
import AlertBanner from '../../components/AlertBanner';
import {addProduct} from '../../api/productApi';
import { FaCamera } from 'react-icons/fa';
import ProductImage from '../../components/productDetail/ProductImage';

function AddProducts(){
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [formData, setFormData] = useState({
        product_name: '',
        product_price: '',
        product_desc: '',
        product_image: null ,
        product_availability: true,
        product_type: 'Necklace',
        product_material: '',
        is_customisable: false,
        option_type: 'list',

        // LIST TYPE
        sizeInput: '',

        // RANGE TYPE
        range_min: '',
        range_max: '',
        range_step: 1,
        default_value: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'file') {
            setFormData(prev => ({
                ...prev,
                [name]: files[0] || null // Grab the first uploaded file binary
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setError(null);

        if (!formData.product_image) {
            setError("Please upload a product image.");
            return; // Stops submission early 
        }       
setLoading(true);
        try {
            const dataPayload = new FormData();
            dataPayload.append('product_name', formData.product_name);
            dataPayload.append('product_price', formData.product_price);
            dataPayload.append('product_type', formData.product_type);
            dataPayload.append('product_availability', formData.product_availability);
            dataPayload.append('is_customisable', formData.is_customisable);
            
            if (formData.product_desc) dataPayload.append('product_desc', formData.product_desc);
            if (formData.product_material) dataPayload.append('product_material', formData.product_material);
            if (formData.product_image) {
                dataPayload.append('product_image', formData.product_image);
            }
            // Parse comma-separated text string (e.g. "5, 6, 7") into a true JSON array for Sequelize
            if (formData.is_customisable && formData.option_type === 'list' && formData.sizeInput?.trim()) {
                const parsedSizes = formData.sizeInput.split(',').map(item => item.trim()); //FormData keys can only accept string parameters.
                dataPayload.append('product_size', JSON.stringify(parsedSizes));
            }
            if (formData.is_customisable && formData.option_type === 'range') {
                dataPayload.append('range_min', formData.range_min);
                dataPayload.append('range_max', formData.range_max);
                dataPayload.append('range_step', formData.range_step);
                dataPayload.append('default_value', formData.default_value);
            }

            await addProduct(dataPayload);
            setSuccessMessage(`"${formData.product_name}" successfully added to the database catalog!`);
            
            // reset input
            setFormData({
                product_name: '',
                product_price: '',
                product_desc: '',
                product_image: null,
                product_availability: true,
                product_type: 'Necklace',
                product_material: '',
                is_customisable: false,
                option_type: 'list',
                sizeInput: '',
                range_min: '',
                range_max: '',
                range_step: 1,
                default_value: ''
            });
            const fileInput = document.getElementById('product_image');
            if (fileInput) fileInput.value = '';
            navigate(`/products`, {
                replace: true,
                state: { message: `"${formData.product_name}" added to inventory` }
            });

        } catch (err) {
            console.error("Error creating product:", err);
            setError(err.response?.data?.error || "Failed to create new product entry.");
        } finally {
            setLoading(false);
        }
    };

    return(
            <div className={styles.addProducts}>
                <div className={styles.addProductsTopSection}>
                        <BackButton/>
                        {successMessage && <AlertBanner message={successMessage} type="success" onClose={() => setSuccessMessage(null)} />}
                        {error && <AlertBanner message={error} type="error" onClose={() => setError(null)} />}
                        <span></span><span></span>
                </div>
                <div className={styles.addProductsContentContainer}>
                    <h2>Add Product</h2>
                    <form onSubmit={handleSubmit} className={styles.addProductForm}>
                        <div className={styles.formInputContainer}>
                            {/*product image*/}
                            <div className={styles.imageInputContainer}>
                                {formData.product_image ? (
                                    <ProductImage
                                        image={URL.createObjectURL(formData.product_image)}
                                        alt="Preview Product Img"
                                    />
                                ): (
                                    <div className={styles.productImageContainer}>
                                        <div className={styles.productImageIcon}><FaCamera /></div>
                                        No image uploaded
                                    </div>
                                )}
                                <div className={styles.fileUploadFormGroup}>
                                    <label htmlFor="product_image" className={`${buttonStyles.button} ${buttonStyles.main}`}>
                                        Upload Product Image
                                    </label>
                                    <input 
                                        id="product_image"
                                        type="file" 
                                        name="product_image" 
                                        accept="image/*" 
                                        onChange={handleChange}
                                        className={styles.hiddenFileInput}
                                    />
                                </div>
                            </div>
                            {/*product details form*/}
                            <div className={styles.infoInputContainer}>
                                {/*product name*/}
                                <div className={styles.formInput}>
                                    <label htmlFor="product_name">Product Name *</label>
                                    <input 
                                        id="product_name"
                                        type="text" 
                                        name="product_name" 
                                        value={formData.product_name} 
                                        onChange={handleChange} 
                                        required 
                                        placeholder="e.g., Baroque Pearl Drop Necklace"
                                    />
                                </div>
                                {/*product price*/}
                                <div className={styles.formInput}>
                                    <label htmlFor="product_price">Price (RM) *</label>
                                    <input 
                                        id="product_price"
                                        type="number" 
                                        step="0.01" 
                                        min="0.00"
                                        name="product_price" 
                                        value={formData.product_price} 
                                        onChange={handleChange} 
                                        required 
                                        placeholder="59.99"
                                    />
                                </div>
                                {/*product type*/}
                                <div className={styles.formInput}>
                                    <label htmlFor="product_type">Product Type</label>
                                    <select 
                                        id="product_type"
                                        name="product_type" 
                                        value={formData.product_type} 
                                        onChange={handleChange}
                                    >
                                        <option value="Necklace">Necklace</option>
                                        <option value="Bracelet">Bracelet</option>
                                        <option value="Earrings">Earrings</option>
                                        <option value="Ring">Ring</option>
                                    </select>
                                </div>
                                {/*product material*/}
                                <div className={styles.formInput}>
                                    <label htmlFor="product_material">Base Material</label>
                                    <input 
                                        id="product_material"
                                        type="text" 
                                        name="product_material" 
                                        value={formData.product_material} 
                                        onChange={handleChange} 
                                        placeholder="e.g., pearl, crystal, stone"
                                    />
                                </div>
                                {/*product description*/}
                                <div className={styles.formInput}>
                                    <label htmlFor="product_desc">Product Description</label>
                                    <textarea 
                                        id="product_desc"
                                        name="product_desc" 
                                        rows="4"
                                        value={formData.product_desc} 
                                        onChange={handleChange} 
                                        placeholder="Provide structural metrics, gemstone context, or design specifications..."
                                    />
                                </div>
    
                                {/*checkbox row*/}
                                <div className={styles.checkboxRow}>
                                    {/*set isAvailable or not*/}
                                    <label className={styles.checkboxLabel}>
                                        <input 
                                            type="checkbox" 
                                            name="product_availability" 
                                            checked={formData.product_availability} 
                                            onChange={handleChange} 
                                        />
                                        Set Available
                                    </label>
                                    {/*customizable*/}
                                    <label className={styles.checkboxLabel}>
                                        <input 
                                            type="checkbox" 
                                            name="is_customisable" 
                                            checked={formData.is_customisable} 
                                            onChange={handleChange} 
                                        />
                                        Customizations
                                    </label>
                                
                                </div>
                                {/*customization type: fixed size/ length*/}
                                {formData.is_customisable && (
                                    <div className={styles.formInput}>
                                        <label htmlFor="option_type">Customization Type</label>
                                        <select
                                            id="option_type"
                                            name="option_type"
                                            value={formData.option_type}
                                            onChange={handleChange}
                                        >
                                            <option value="list">Fixed Sizes</option>
                                            <option value="range">Adjustable Length</option>
                                        </select>
                                    </div>
                                )}
                                {/*type list*/}
                                {formData.is_customisable && formData.option_type === 'list' && (
                                    <>
                                        <div className={styles.formInput}>
                                            <label htmlFor="sizeInput">
                                                Available Sizes
                                            </label>
                                            <input
                                                id="sizeInput"
                                                type="text"
                                                name="sizeInput"
                                                value={formData.sizeInput}
                                                onChange={handleChange}
                                                placeholder="e.g., 5, 6, 7"
                                            />
                                        </div>
                                </>   
                                )}
                                {/*type range*/}
                                {formData.is_customisable && formData.option_type === 'range' && (
                                <>
                                    {/*default length*/}
                                    <div className={styles.formInput}>
                                        <label htmlFor="default_value">
                                            Default Length
                                        </label>
    
                                        <input
                                            type="number"
                                            name="default_value"
                                            value={formData.default_value}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    {/*min lenght*/}
                                    <div className={styles.formInput}>
                                        <label htmlFor="range_min">Minimum Length</label>
    
                                        <input
                                            type="number"
                                            name="range_min"
                                            value={formData.range_min}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    {/*max length*/}
                                    <div className={styles.formInput}>
                                        <label htmlFor="range_max">Maximum Length</label>
                                        <input
                                            type="number"
                                            name="range_max"
                                            value={formData.range_max}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    {/*increment value*/}
                                    <div className={styles.formInput}>
                                        <label htmlFor="range_step">Step</label>
                                        <input
                                            type="number"
                                            name="range_step"
                                            value={formData.range_step}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </>
                                )}
                            </div>
                        </div>
                        <div className={styles.addProductFormBtns}>
                            <button 
                                type="button" 
                                className={`${buttonStyles.button} ${buttonStyles.cancel}`}
                                onClick={() => navigate(`/products`)}
                                disabled={loading}
                            >
                                Discard
                            </button>
                            <button 
                                type="submit" 
                                className={`${buttonStyles.button} ${buttonStyles.green}`}
                                disabled={loading}
                            >
                                {loading ? "Saving Product Info..." : "Add Product"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
}

export default AddProducts;