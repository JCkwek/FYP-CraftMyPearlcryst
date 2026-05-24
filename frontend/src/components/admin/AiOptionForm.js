import styles from './AiOptionForm.module.css';
import buttonStyles from '../../components/buttons/ButtonTheme.module.css';
import { useEffect, useState } from 'react';
import sweetAlert from '../../components/SweetAlert';
import {fetchAiOptionRequirements} from '../../api/aiCustomApi';

function AiOptionForm({ initialData, onSubmit,onCancel }){
    const [requirements, setRequirements] = useState([]);
    const [isNewRequirement, setIsNewRequirement] = useState(false);
    const isEditMode = !!initialData?.component_id;
    const emptyForm = {
        name: '',
        step: 1,
        category: '',
        requirement: '',
        prompt_fragment: '',
        image_preview: ''
    };

    const [formData, setFormData] = useState(emptyForm);

    useEffect(() => {
    if (initialData) {
            setFormData(prev => ({
                ...emptyForm,
                ...initialData
            }));
        } else {
            setFormData(emptyForm);
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
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

  
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
                        <img
                            src={
                                formData.image_preview
                                    ? `http://localhost:3000${formData.image_preview}`
                                    : '/placeholder.png'
                            }
                            alt='option images'
                        />
                    </div>
                    <div className={styles.infoBox}>
                       <div className={styles.formInput}>
                            <select
                                name="step"
                                value={formData.step}
                                onChange={handleChange}
                            >
                                {[1,2,3,4,5,6,7].map(step => (
                                    <option key={step} value={step}>
                                        Step {step}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.formInput}>
                        <label>Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option value="">-- Select Category --</option>

                            {[
                                'base_type',
                                'pendant',
                                'material',
                                'variant',
                                'style'
                            ].map(cat => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
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
                        <button className={`${buttonStyles.button} ${buttonStyles.green}`} onClick={() => onSubmit(formData, isEditMode)}>Save</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AiOptionForm;