import styles from './EditProducts.module.css';
import buttonStyles from '../../components/buttons/ButtonTheme.module.css';
import React, { useState, useEffect } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import AlertBanner from '../../components/AlertBanner';
import {editProduct} from '../../api/productApi';
import { FaCamera } from 'react-icons/fa';

function EditProducts(){
    const navigate = useNavigate();
    const location = useLocation();
    
    // Detect if a product was passed via router navigation state
    const existingProduct = location.state?.product || null;
    const isEditMode = !!existingProduct;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const [formData, setFormData] = useState({
        product_name: existingProduct?.product_name || '',
        product_price: existingProduct?.product_price || '',
        product_desc: existingProduct?.product_desc || '',
        product_image: null, // Keeps binary file stream for uploads
        product_availability: existingProduct ? existingProduct.product_availability : true,
        product_type: existingProduct?.product_type || 'Necklace',
        product_material: existingProduct?.product_material || '',
        is_customisable: existingProduct ? existingProduct.is_customisable : false,
        sizeInput: '' 
    });

    useEffect(() => {
        if (existingProduct && existingProduct.options) {
            const sizeOption = existingProduct.options.find(opt => 
                opt.option_name.toLowerCase().includes('size') || 
                opt.option_name.toLowerCase().includes('length')
            );
            
            if (sizeOption) {
                if (sizeOption.option_type === 'list') {
                    // Turn [{visual_value: '16'}, {visual_value: '18'}] into "16, 18"
                    const valuesArr = sizeOption.values.map(v => v.visual_value);
                    setFormData(prev => ({ ...prev, sizeInput: valuesArr.join(', ') }));
                } else if (sizeOption.option_type === 'range') {
                    // Turn "14,22,16" string config back into readable text format
                    const rawRange = sizeOption.values[0]?.visual_value || '';
                    setFormData(prev => ({ ...prev, sizeInput: rawRange }));
                }
            }
        }
    }, [existingProduct]);
    
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

        if (!isEditMode && !formData.product_image) {
            setError("Please upload a product image.");
            return; 
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

            await editProduct(existingProduct.product_id, dataPayload);

            const fileInput = document.getElementById('product_image');
            if (fileInput) fileInput.value = '';
            navigate(`/products/${existingProduct.product_id}`, {
                replace: true,
                state: { message: `"${formData.product_name}" details successfully updated!` }
            });

        } catch (err) {
            console.error("Error updating product:", err);
            setError(err.response?.data?.error || "Failed to update product.");
        } finally {
            setLoading(false);
        }
    };

    return(
        <div className={styles.addProducts}>
            <div className={styles.addProductsTopSection}>
                    {successMessage && <AlertBanner message={successMessage} type="success" onClose={() => setSuccessMessage(null)} />}
                    {error && <AlertBanner message={error} type="error" onClose={() => setError(null)} />}
            </div>
            <div className={styles.addProductsContentContainer}>
                <h2>Edit Product</h2>
                <form onSubmit={handleSubmit} className={styles.addProductForm}>
                    <div className={styles.formInputContainer}>
                        <div className={styles.imageInputContainer}>
                            {formData.product_image ? (
                                <div className={styles.productImageContainer}>
                                    <img
                                        src={URL.createObjectURL(formData.product_image)} 
                                        alt="Preview Product Img" 
                                    />  
                                </div>
                            ) : existingProduct?.product_image ? (
                                <div className={styles.productImageContainer}>
                                    <img
                                        src={`http://localhost:3000${existingProduct.product_image}`}
                                        alt="Existing Database Product Img"
                                    />  
                                </div>
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

                    <div className={styles.editProductFormBtns}>
                        <button 
                            type="button" 
                            className={`${buttonStyles.button} ${buttonStyles.cancel}`}
                            onClick={() => navigate(`/products/${existingProduct.product_id}`)}
                            disabled={loading}
                        >
                            Discard
                        </button>
                        <button 
                            type="submit" 
                            className={`${buttonStyles.button} ${buttonStyles.green}`}
                            disabled={loading}
                        >
                            {loading ? "Saving Product Info..." : "Update Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditProducts;