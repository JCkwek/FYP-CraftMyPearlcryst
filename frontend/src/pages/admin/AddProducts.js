import styles from './AddProducts.module.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/buttons/BackButton';
import AlertBanner from '../../components/AlertBanner';
import {addProduct} from '../../api/productApi';
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
        customizations: []
    });

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (name === 'is_customisable' && !checked) {
            setFormData(prev => ({
                ...prev,
                is_customisable: false,
                customizations: []
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
            
            if (formData.is_customisable) {

                dataPayload.append(
                    'customizations',
                    JSON.stringify(formData.customizations)
                );
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
                customizations: []
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
                        addCustomization={addCustomization}
                        removeCustomization={removeCustomization}
                        handleCustomizationChange={handleCustomizationChange}
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