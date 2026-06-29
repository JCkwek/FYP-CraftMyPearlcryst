import styles from './AiOptionForm.module.css';
import buttonStyles from '../../components/buttons/ButtonTheme.module.css';
import { useEffect, useState } from 'react';
import sweetAlert from '../../components/SweetAlert';
import {fetchAiOptionRequirements} from '../../api/aiCustomApi';

const STEP_TO_CATEGORY = {
    1: 'base_type',
    2: 'material',
    3: 'variant',
    4: 'pendant',
    5: 'pattern',
    6: 'style',
    7: 'length',
};

function AiOptionForm({ initialData, onSubmit, onCancel }){
    const [requirements, setRequirements] = useState([]);
    const [isNewRequirement, setIsNewRequirement] = useState(false);
    const isEditMode = !!initialData?.component_id;
    const emptyForm = {
        name: '',
        step: 1,
        category: '',
        requirement: '',
        prompt_fragment: '',
        image_preview: '',
        image_file: null
    };
    const [formData, setFormData] = useState(emptyForm);
    const [previewUrl, setPreviewUrl] = useState('');

    useEffect(() => {
        if (initialData) {
            setFormData(prev => {
                const combined = { ...emptyForm, ...initialData };
                combined.category = STEP_TO_CATEGORY[combined.step] || '';
                return combined;
            });
        } else {
            setFormData({
                ...emptyForm,
                category: STEP_TO_CATEGORY[emptyForm.step] || ''
            });
        }
    }, [initialData]);

    useEffect(() => {
        const loadRequirements = async () => {
            try {
                const data = await fetchAiOptionRequirements();
                setRequirements(data);
            } catch (err) {
                console.error(err);
            }
        };

        loadRequirements();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, files} = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'file'
                ? files[0]
                : value
        }));
    };

    const getImagePreview = () => {
        if (formData.image_file) {
            return URL.createObjectURL(formData.image_file);
        }

        if (formData.image_preview) {
            return `http://localhost:3000${formData.image_preview}`;
        }

        return null;
    };

    useEffect(() => {
        let objectUrl = null;

        if (formData.image_file) {
            objectUrl = URL.createObjectURL(formData.image_file);
            setPreviewUrl(objectUrl);
        } else if (formData.image_preview) {
            setPreviewUrl(`http://localhost:3000${formData.image_preview}`);
        } else {
            setPreviewUrl('');
        }

        // Clean up the URL object when component unmounts or file changes
        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [formData.image_file, formData.image_preview]);

  
    return(
       <div className={styles.aiOptionDetails}>
            <div className={styles.aiOptionDetailsContentContainer}>
                <div className={styles.aiOptionCard}>
                    <div className={styles.formInput}>
                        <label>Label</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder='e.g. color,material'
                        />
                    </div>

                    <div className={styles.imageContainer}>
                        {getImagePreview() ? (
                            <img
                                // src={getImagePreview()}
                                src={previewUrl}
                                alt="AI Option Preview"
                            />
                        ) : (
                            <div className={styles.placeholder}>
                                <span>🖼️</span>
                                <p>No image uploaded</p>
                            </div>
                        )}

                        <div className={styles.fileUploadFormGroup}>
                            <label
                                htmlFor="image_file"
                                className={`${buttonStyles.button} ${buttonStyles.main}`}
                            >
                                {previewUrl ? 'Change Image' : 'Upload Image'}
                            </label>

                            <input
                                id="image_file"
                                type="file"
                                name="image_file"
                                accept="image/*"
                                onChange={handleChange}
                                hidden
                            />
                        </div>
                    </div>

                    <div className={styles.infoBox}>

                       <div className={styles.formInput}>
                            {/* <select
                                name="step"
                                value={formData.step}
                                onChange={handleChange}
                            >
                                {[1,2,3,4,5,6,7].map(step => (
                                    <option key={step} value={step}>
                                        Step {step}
                                    </option>
                                ))}
                            </select> */}
                            {/* <label>Step</label> */}
                           <div><b>Step: </b>{formData.step}</div>
                        </div>
                        <div className={styles.formInput}>
                            {/* <label>Category</label> */}
                            <div><b>Category: </b>{formData.category}</div>
                            {/* <input
                                type="text"
                                name="category"
                                value={formData.category}
                                readOnly
                                disabled
                            /> */}
                        </div>
                        <div className={styles.formInput}>
                            <label>Requirement</label>
                                {!isNewRequirement ? (
                                    <select
                                        name="requirement"
                                        value={formData.requirement}
                                        onChange={handleChange}
                                    >
                                        <option value="">-- Select Requirement --</option>

                                        {requirements.map((req, idx) => (
                                            <option key={idx} value={req}>
                                                {req}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                     <div className={styles.formInput}>
                                        <input
                                            type="text"
                                            name="requirement"
                                            value={formData.requirement}
                                            onChange={handleChange}
                                            placeholder="Enter new requirement"
                                        />
                                    </div>
                                )}

                                <button
                                    type="button"
                                    className={`${buttonStyles.button} ${buttonStyles.main}`}
                                    onClick={() => {
                                        setIsNewRequirement(prev => {
                                            const next = !prev;
                                            if (next) {
                                                setFormData(prev => ({ ...prev, requirement: '' }));
                                            }
                                            return next;
                                        });
                                    }}
                                >
                                    {isNewRequirement ? 'Choose Existing' : 'Add New Requirement'}
                                </button>
                        </div>
                        <div className={styles.formInput}>
                            <label>Prompt Fragment</label>
                            <textarea
                                name="prompt_fragment"
                                value={formData.prompt_fragment}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className={styles.formBtns}>
                        <button className={`${buttonStyles.button} ${buttonStyles.cancel}`} 
                            onClick={async () => {
                                const result = await sweetAlert.confirm({
                                    title: 'Discard changes?',
                                    text: 'Your unsaved edits will be lost.',
                                    confirmText: 'Discard',
                                    cancelText: 'Keep Editing'
                                });

                                if (result.isConfirmed) {
                                    onCancel();
                                }
                            }} 
                        >
                            Discard
                        </button>
                        <button className={`${buttonStyles.button} ${buttonStyles.green}`} onClick={() => onSubmit(formData, initialData?.component_id,isEditMode)}>Save</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AiOptionForm;