import styles from './ProductForm.module.css';
import buttonStyles from '../buttons/ButtonTheme.module.css';
import { FaCamera } from 'react-icons/fa';
import ProductImage from '../productDetail/ProductImage';

function ProductForm({
    formData,
    handleChange,
    handleSubmit,

    addCustomization,
    removeCustomization,
    handleCustomizationChange,
    
    loading,
    submitText,
    cancelText,
    onCancel,
    existingImage,
    children
}) {

    return (
        <form onSubmit={handleSubmit} className={styles.productForm}>
            <div className={styles.formInputContainer}>

                {/* product image */}
                <div className={styles.imageInputContainer}>
                    {formData.product_image ? (
                        <ProductImage
                            image={URL.createObjectURL(formData.product_image)}
                            alt="Preview Product Img"
                        />
                    ) : existingImage ? (
                        <ProductImage
                            image={existingImage}
                            alt="Existing Product Img"
                        />
                    ) : (
                        <div className={styles.productImageContainer}>
                            <div className={styles.productImageIcon}>
                                <FaCamera />
                            </div>
                            No image uploaded
                        </div>
                    )}

                    <div className={styles.fileUploadFormGroup}>
                        <label
                            htmlFor="product_image"
                            className={`${buttonStyles.button} ${buttonStyles.main}`}
                        >
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

                {/* product info */}
                <div className={styles.infoInputContainer}>

                    {/* PRODUCT NAME */}
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

                    {/* price */}
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

                    {/* product type */}
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

                    {/* material */}
                    <div className={styles.formInput}>
                        <label htmlFor="product_material">Base Material </label>
                        <input
                            id="product_material"
                            type="text"
                            name="product_material"
                            value={formData.product_material}
                            onChange={handleChange}
                            placeholder="e.g., pearl, crystal, stone"
                        />
                    </div>

                    {/* description */}
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

                    {/* checkboxes */}
                    <div className={styles.checkboxRow}>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                name="product_availability"
                                checked={formData.product_availability}
                                onChange={handleChange}
                            />
                            Set Available
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
                    {formData.is_customisable && (
                        <div className={styles.customizationContainer}>
                            <button
                                type="button"
                                className={`${buttonStyles.button} ${buttonStyles.main}`}
                                onClick={addCustomization}
                            >
                                Add Customization
                            </button>

                            {(formData.customizations || []).length === 0 &&  (
                                <p>No customizations added yet.</p>
                            )}

                            {(formData.customizations || []).map((custom, index) => {
                                const selectedOptions =
                                    formData.customizations.map(
                                        c => c.option_name
                                    );
                                const availableOptions =
                                    ['Size', 'Color']
                                        .filter(
                                            opt =>
                                                !selectedOptions.includes(opt)
                                                || opt === custom.option_name
                                        );
                                return (
                                    <div key={index} className={styles.customizationCard}>
                                        <h5>Customization Option</h5>
                                        {/* CATEGORY */}
                                        <div className={styles.formInput} >
                                            <label>Category</label>
                                            <select
                                                value={custom.option_name}
                                                onChange={(e) =>
                                                    handleCustomizationChange(
                                                        index,
                                                        'option_name',
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                {availableOptions.map(opt => (
                                                    <option
                                                        key={opt}
                                                        value={opt}
                                                    >
                                                        {opt}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        {/* TYPE */}
                                        <div className={styles.formInput}>
                                            <label>Type</label>
                                            <select
                                                value={custom.option_type}
                                                onChange={(e) =>
                                                    handleCustomizationChange(
                                                        index,
                                                        'option_type',
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="list">Fixed List</option>
                                                {custom.option_name === 'Size' && (
                                                    <option value="range">
                                                        Adjustable Range
                                                    </option>
                                                )}
                                            </select>
                                        </div>

                                        {/* LIST TYPE */}
                                        {custom.option_type === 'list' && (
                                            <div className={styles.formInput}>
                                                <label>{custom.option_name} Values</label>
                                                <input
                                                    type="text"
                                                    value={custom.values}
                                                    onChange={(e) =>
                                                        handleCustomizationChange(
                                                            index,
                                                            'values',
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder={
                                                        custom.option_name === 'Color'
                                                            ? 'Gold, Silver, Rose Gold'
                                                            : '5, 6, 7'
                                                    }
                                                />

                                            </div>
                                        )}

                                        {/* RANGE TYPE */}
                                        {custom.option_type === 'range' && (
                                            <>
                                                <div className={styles.formInput}>
                                                    <label>Default Value</label>
                                                    <input
                                                        type="number"
                                                        value={custom.default_value}
                                                        onChange={(e) =>
                                                            handleCustomizationChange(
                                                                index,
                                                                'default_value',
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>

                                                <div className={styles.formInput}>
                                                    <label>Minimum</label>
                                                    <input
                                                        type="number"
                                                        value={custom.range_min}
                                                        onChange={(e) =>
                                                            handleCustomizationChange(
                                                                index,
                                                                'range_min',
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>

                                                <div className={styles.formInput}>
                                                    <label>Maximum</label>
                                                    <input
                                                        type="number"
                                                        value={custom.range_max}
                                                        onChange={(e) =>
                                                            handleCustomizationChange(
                                                                index,
                                                                'range_max',
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>

                                                <div className={styles.formInput}>
                                                    <label>Step </label>
                                                    <input
                                                        type="number"
                                                        value={custom.range_step}
                                                        onChange={(e) =>
                                                            handleCustomizationChange(
                                                                index,
                                                                'range_step',
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </>
                                        )}

                                        <button
                                            type="button"
                                            className={`${buttonStyles.button} ${buttonStyles.cancel}`}
                                            onClick={() =>
                                                removeCustomization(index)
                                            }
                                        >
                                            Remove
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* {formData.is_customisable && (
                        <div className={styles.formInput}>
                            <label htmlFor="option_type">Customization Type</label>
                            <select
                                id="option_type"
                                name="option_type"
                                value={formData.option_type}
                                onChange={handleChange}
                            >
                                <option value="list">
                                    Fixed Sizes
                                </option>

                                <option value="range">
                                    Adjustable Length
                                </option>
                            </select>
                        </div>
                    )}

                
                    {formData.is_customisable &&
                        formData.option_type === 'list' && (
                            <div className={styles.formInput}>
                                <label htmlFor="sizeInput">Available Sizes</label>
                                <input
                                    id="sizeInput"
                                    type="text"
                                    name="sizeInput"
                                    value={formData.sizeInput}
                                    onChange={handleChange}
                                    placeholder="e.g., 5, 6, 7"
                                />
                            </div>
                    )}

                 
                    {formData.is_customisable &&
                        formData.option_type === 'range' && (
                            <>
                                <div className={styles.formInput}>
                                    <label htmlFor="default_value">Default Length</label>
                                    <input
                                        type="number"
                                        name="default_value"
                                        value={formData.default_value}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className={styles.formInput}>
                                    <label htmlFor="range_min">Minimum Length</label>
                                    <input
                                        type="number"
                                        name="range_min"
                                        value={formData.range_min}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className={styles.formInput}>
                                    <label htmlFor="range_max">Maximum Length</label>
                                    <input
                                        type="number"
                                        name="range_max"
                                        value={formData.range_max}
                                        onChange={handleChange}
                                    />
                                </div>

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
                        )
                    } */}

                    {children}
                </div>
            </div>

            <div className={styles.productFormBtns}>
                <button
                    type="button"
                    className={`${buttonStyles.button} ${buttonStyles.cancel}`}
                    onClick={onCancel}
                    disabled={loading}
                >
                    {cancelText}
                </button>

                <button
                    type="submit"
                    className={`${buttonStyles.button} ${buttonStyles.green}`}
                    disabled={loading}
                >
                    {loading
                        ? 'Saving Product Info...'
                        : submitText}
                </button>
            </div>
        </form>
    );
}

export default ProductForm;
