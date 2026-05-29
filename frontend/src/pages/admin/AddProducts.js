import styles from './AddProducts.module.css';
// import buttonStyles from '../../components/buttons/ButtonTheme.module.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/buttons/BackButton';
import AlertBanner from '../../components/AlertBanner';
import {addProduct} from '../../api/productApi';
// import { FaCamera } from 'react-icons/fa';
// import ProductImage from '../../components/productDetail/ProductImage';
import ProductForm from '../../components/admin/ProductForm';


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
        //reset when switch type
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
        //reset when toggled off customisable
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
            console.log("FILE SELECTED:", files);
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
            dataPayload.append('option_type', formData.option_type);

            if (formData.is_customisable && formData.option_type === 'list') {
                dataPayload.append('sizeInput', formData.sizeInput);
                dataPayload.append('default_value', formData.default_value);
            }

            if (formData.is_customisable && formData.option_type === 'range') {
                dataPayload.append('range_min', formData.range_min);
                dataPayload.append('range_max', formData.range_max);
                dataPayload.append('range_step', formData.range_step);
                dataPayload.append('default_value', formData.default_value);
            }
            console.log("ABOUT TO CALL API");
            await addProduct(dataPayload);
            console.log("API CALL DONE");
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
                    <ProductForm 
                        formData={formData} 
                        handleChange={handleChange} 
                        handleSubmit={handleSubmit} 
                        loading={loading} 
                        submitText="Add Product" 
                        cancelText="Discard"
                        onCancel={() => navigate(`/products`) } 
                    />
                </div>
            </div>
        )
}

export default AddProducts;