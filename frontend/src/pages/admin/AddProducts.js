import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AddProducts.module.css';
import buttonStyles from '../../components/buttons/ButtonTheme.module.css';
import BackButton from '../../components/buttons/BackButton';
import AlertBanner from '../../components/AlertBanner';
import {addProduct} from '../../api/productApi';


function AddProducts(){
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [formData, setFormData] = useState({
        product_name: '',
        product_price: '',
        product_desc: '',
        // product_image: '',
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

            // Assemble payload matching your model properties
            // const payload = {
            //     product_name: formData.product_name,
            //     product_price: parseFloat(formData.product_price),
            //     product_desc: formData.product_desc || null,
            //     product_image: formData.product_image || null,
            //     product_availability: formData.product_availability,
            //     product_type: formData.product_type,
            //     product_material: formData.product_material || null,
            //     is_customisable: formData.is_customisable,
            //     product_size: parsedSizes
            // };

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
            <div className={styles.addProductsContentContainer}>
                <div className={styles.addProductsTopSection}>
                    <BackButton />
                    {successMessage && <AlertBanner message={successMessage} type="success" onClose={() => setSuccessMessage(null)} />}
                    {error && <AlertBanner message={error} type="warning" onClose={() => setError(null)} />}
                </div>

                <h2>Add Product</h2>

                <form onSubmit={handleSubmit} className={styles.productForm}>
                    <div className={styles.formGrid}>
                        
                        {/* Left Side fields */}
                        <div className={styles.formGroup}>
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

                        <div className={styles.formGroup}>
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

                        <div className={styles.formGroup}>
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

                        <div className={styles.formGroup}>
                            <label htmlFor="product_material">Base Material</label>
                            <input 
                                id="product_material"
                                type="text" 
                                name="product_material" 
                                value={formData.product_material} 
                                onChange={handleChange} 
                                placeholder="e.g., 14k Gold Filled, Sterling Silver"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="product_image">Product Image</label>
                            <input 
                                id="product_image"
                                type="file" 
                                name="product_image" 
                                accept="image/*" // restrains search queries exclusively to device graphics items
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.formGroup}>
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

                    </div>

                    <div className={styles.formGroupFull}>
                        <label htmlFor="product_desc">Description</label>
                        <textarea 
                            id="product_desc"
                            name="product_desc" 
                            rows="5"
                            value={formData.product_desc} 
                            onChange={handleChange} 
                            placeholder="Provide deep architectural product design info, pearl dimensions, styles context..."
                        />
                    </div>

                    {/* Checkbox Flags Row */}
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
                            Allow Customizations
                        </label>
                    </div>

                    <div className={styles.formActionsButtons}>
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