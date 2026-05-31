import styles from './EditProducts.module.css';
import buttonStyles from '../../components/buttons/ButtonTheme.module.css';
import React, { useState, useEffect,  useRef } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import AlertBanner from '../../components/AlertBanner';
import {editProduct, deleteProduct} from '../../api/productApi';
import Swal from 'sweetalert2';
import ProductForm from '../../components/admin/ProductForm';

function EditProducts(){
    const navigate = useNavigate();
    const location = useLocation();
    const errorRef = useRef(null);
    
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
        customizations: [],
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
        if (error) {
            errorRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }, [error]);

     const addCustomization = () => {
        const selectedOptions = formData.customizations.map(
            c => c.option_name
        );

        const availableOptions = ['Size', 'Color']
            .filter(opt => !selectedOptions.includes(opt));

        if (availableOptions.length === 0) {
            return;
        }

        const newCustomization = {
            option_name: availableOptions[0],
            option_type: 'list',
            values: '',
            range_min: '',
            range_max: '',
            range_step: 1,
            default_value: ''
        };

        setFormData(prev => ({
            ...prev,
            customizations: [
                ...prev.customizations,
                newCustomization
            ]
        }));
    };

    const removeCustomization = (index) => {
        setFormData(prev => ({
            ...prev,
            customizations: prev.customizations.filter(
                (_, i) => i !== index
            )
        }));
    };

    const handleCustomizationChange = (
        index,
        field,
        value
    ) => {
        const updated = [...formData.customizations];
        updated[index][field] = value;
        setFormData(prev => ({
            ...prev,
            customizations: updated
        }));
    };


    useEffect(() => {
        if (!existingProduct || !existingProduct.options) return;
        
        const mapped = existingProduct.options.map(opt => {
            return {
                option_name: opt.option_name,
                option_type: opt.option_type,
                default_value: opt.default_value || '',
                range_min: opt.range_min || '',
                range_max: opt.range_max || '',
                range_step: opt.range_step || 1,
                values:
                    opt.option_type === 'list'
                        ? (opt.values || []).map(v => v.visual_value).join(', ')
                        : ''
            };
        });

        setFormData(prev => ({
            ...prev,
            customizations: mapped
        }));

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
                customizations: []
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
            if (formData.product_desc) dataPayload.append('product_desc', formData.product_desc);
            if (formData.product_material) dataPayload.append('product_material', formData.product_material);
            if (formData.product_image) {
                dataPayload.append('product_image', formData.product_image);
            }
            dataPayload.append('product_availability', formData.product_availability);
            dataPayload.append('is_customisable', formData.is_customisable);
        
            dataPayload.append(
                'customizations',
                JSON.stringify(formData.customizations)
            );

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
        <div className={styles.editProducts}>
            <div className={styles.editProductsTopSection} ref={errorRef}>
                    {successMessage && <AlertBanner message={successMessage} type="success" onClose={() => setSuccessMessage(null)} />}
                    {error && <AlertBanner message={error} type="error" onClose={() => setError(null)} />}
            </div>
            <div className={styles.editProductsContentContainer}>
                <h2>Edit Product</h2>
                <ProductForm 
                    formData={formData} 
                    handleChange={handleChange} 
                    handleSubmit={handleSubmit} 
                    addCustomization={addCustomization}
                    removeCustomization={removeCustomization}
                    handleCustomizationChange={handleCustomizationChange}
                    loading={loading} 
                    submitText="Update Product" 
                    cancelText="Discard" 
                    existingImage={`http://localhost:3000${existingProduct.product_image}`} 
                    onCancel={() => navigate(`/products/${existingProduct.product_id}`) } 
                />
                <div className={styles.dltBtnContainer}>
                    <button className={`${buttonStyles.button} ${buttonStyles.red}`}  onClick={handleDeleteProduct}> Delete Product</button>
                </div>
            </div>
        </div>
    )
}

export default EditProducts;