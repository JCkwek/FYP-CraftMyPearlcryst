import styles from './EditProducts.module.css';
import buttonStyles from '../../components/buttons/ButtonTheme.module.css';
import React, { useState, useEffect } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import AlertBanner from '../../components/AlertBanner';
import {editProduct, deleteProduct} from '../../api/productApi';
import { FaCamera } from 'react-icons/fa';
import ProductImage from '../../components/productDetail/ProductImage';
import Swal from 'sweetalert2';

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
        product_image: null, 
        product_availability: existingProduct ? existingProduct.product_availability : true,
        product_type: existingProduct?.product_type || 'Necklace',
        product_material: existingProduct?.product_material || '',
        is_customisable: existingProduct ? existingProduct.is_customisable : false,
        // sizeInput: '' 
        // default_size: existingProduct?.product_size || '',
        option_type: 'list',

        // LIST TYPE
        sizeInput: '',

        // RANGE TYPE
        range_min: '',
        range_max: '',
        range_step: 1,
        default_value: ''
    });

    useEffect(() => {
        if (!existingProduct || !existingProduct.options) return;
        const sizeOption = existingProduct.options.find(opt => 
            opt.option_name.toLowerCase().includes('size') || 
            opt.option_name.toLowerCase().includes('length')
        );
        if (!sizeOption) return;
            
        if (sizeOption.option_type === 'list') {
            const valuesArr = sizeOption.values.map(v => v.visual_value); // Turn [{visual_value: '16'}, {visual_value: '18'}] into "16, 18"
            setFormData(prev => ({ 
                ...prev, 
                option_type: 'list',
                sizeInput: valuesArr.join(', '),
                default_value: sizeOption.default_value || ''
            }));
        } else if (sizeOption.option_type === 'range') {
            setFormData(prev => ({
                ...prev,
                option_type: 'range',
                range_min: sizeOption.range_min || '',
                range_max: sizeOption.range_max || '',
                range_step: sizeOption.range_step || 1,
                default_value: sizeOption.default_value || '',
                product_image: null
            }));
        }
    }, [existingProduct]);
    
    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (name === 'option_type') {
            setFormData(prev => ({
                ...prev,
                option_type: value,
                sizeInput: '',
                range_min: '',
                range_max: '',
                range_step: 1,
                default_value: ''
            }));
            return;
        }

        if (name === 'is_customisable' && !checked) {
            setFormData(prev => ({
                ...prev,
                is_customisable: false,
                option_type: 'list',
                sizeInput: '',
                range_min: '',
                range_max: '',
                range_step: 1,
                default_value: ''
            }));
            return;
        }

        if (type === 'file') {
            setFormData(prev => ({
                ...prev,
                [name]: files[0] || null
            }));
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
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
            dataPayload.append('option_type', formData.option_type);

            if (formData.option_type === 'list') {
                dataPayload.append('sizeInput', formData.sizeInput);
                dataPayload.append('default_value', formData.default_value);
            }
            if (formData.option_type === 'range') {
                dataPayload.append('range_min', formData.range_min);
                dataPayload.append('range_max', formData.range_max);
                dataPayload.append('range_step', formData.range_step);
                dataPayload.append('default_value', formData.default_value);
            }
            if (formData.product_desc) dataPayload.append('product_desc', formData.product_desc);
            if (formData.product_material) dataPayload.append('product_material', formData.product_material);
            if (formData.product_image) {
                dataPayload.append('product_image', formData.product_image);
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

    const handleDeleteProduct = async () => {
        const result = await Swal.fire({
            title: 'Delete Product?',
            text: `Are you sure you want to delete "${existingProduct.product_name}"? This cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it',
            cancelButtonText: 'Cancel',
        });

        if (!result.isConfirmed) return;

        try {
            await deleteProduct(existingProduct.product_id);

            await Swal.fire({
                title: 'Deleted!',
                text: `"${existingProduct.product_name}" has been deleted.`,
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });

            navigate('/products', {
                state: {
                    message: `"${existingProduct.product_name}" deleted successfully`
                }
            });

        } catch (err) {
            console.error("Delete error:", err);

            Swal.fire({
                title: 'Error',
                text: 'Failed to delete product',
                icon: 'error'
            });
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
                        {/*product image*/}
                        <div className={styles.imageInputContainer}>
                            {formData.product_image ? (
                                <ProductImage
                                    image={URL.createObjectURL(formData.product_image)}
                                    alt="Preview Product Img"
                                />
                            ) : existingProduct?.product_image ? (
                               <ProductImage
                                    image={`http://localhost:3000${existingProduct.product_image}`}
                                    alt="Existing Database Product Img"
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
                                    Set Avaailable
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
                <div className={styles.dltBtnContainer}>
                    <button className={`${buttonStyles.button} ${buttonStyles.red}`}  onClick={handleDeleteProduct}> Delete Product</button>
                </div>
            </div>
        </div>
    )
}

export default EditProducts;