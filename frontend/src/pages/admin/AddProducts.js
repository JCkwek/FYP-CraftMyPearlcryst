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
        sizeInput: '' // parse sizes into an array later
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
            if (formData.sizeInput.trim()) {
                const parsedSizes = formData.sizeInput.split(',').map(item => item.trim()); //FormData keys can only accept string parameters.
                dataPayload.append('product_size', JSON.stringify(parsedSizes));
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
                sizeInput: ''
            });
            const fileInput = document.getElementById('product_image');
            if (fileInput) fileInput.value = '';
            setTimeout(() => navigate('/products'), 2000);

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
                <BackButton />
                {successMessage && <AlertBanner message={successMessage} type="success" onClose={() => setSuccessMessage(null)} />}
                {error && <AlertBanner message={error} type="error" onClose={() => setError(null)} />}
                <span></span><span></span>
            </div>
            <div className={styles.addProductsContentContainer}>
                <h2>Add Product</h2>
                <form onSubmit={handleSubmit} className={styles.addProductForm}>
                    <div className={styles.formInputContainer}>
                        <div className={styles.imageInputContainer}>
                            {formData.product_image ? (
                                <ProductImage
                                        image={URL.createObjectURL(formData.product_image)}
                                        alt="Preview Product Img"
                                />
                            ) : (
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
                            
                        <div className={styles.infoInputContainer}>
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

                            <div className={styles.formInput}>
                                <label htmlFor="sizeInput">Size (Comma-Separated Array Strings)</label>
                                <input 
                                    id="sizeInput"
                                    type="text" 
                                    name="sizeInput" 
                                    value={formData.sizeInput} 
                                    onChange={handleChange} 
                                    placeholder="e.g., 16, 18, 20"
                                />
                            </div>

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
                            <div className={styles.checkboxRow}>
                            <label className={styles.checkboxLabel}>
                                <input 
                                    type="checkbox" 
                                    name="product_availability" 
                                    checked={formData.product_availability} 
                                    onChange={handleChange} 
                                />
                                Add Product To Inventory
                            </label>

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
                        </div>
                    </div>

                    <div className={styles.addProductFormBtns}>
                        <button 
                            type="button" 
                            className={`${buttonStyles.button} ${buttonStyles.cancel}`}
                            onClick={() => navigate('/products')}
                            disabled={loading}
                        >
                            Discard
                        </button>
                        <button 
                            type="submit" 
                            className={`${buttonStyles.button} ${buttonStyles.green}`}
                            disabled={loading}
                        >
                            {loading ? "Saving Item..." : "Publish Product Entry"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddProducts;