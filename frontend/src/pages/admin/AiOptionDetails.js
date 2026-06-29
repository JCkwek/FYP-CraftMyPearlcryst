import styles from './AiOptionDetails.module.css';
import buttonStyles from '../../components/buttons/ButtonTheme.module.css';
import BackButton from '../../components/buttons/BackButton';
import Loading from '../../components/Loading';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchAiComponents, updateAiComponent, deleteAiComponent } from '../../api/aiCustomApi';
import AiOptionForm from '../../components/admin/AiOptionForm';
import sweetAlert from '../../components/SweetAlert';

function AiOptionDetails(){
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    
    useEffect(() => {
        const loadItem = async () => {
            try {
                setLoading(true);
                const data = await fetchAiComponents();
                const found = data.find(
                    x => x.component_id === parseInt(id)
                );
                setItem(found);
            } catch (err) {
                console.error(err);
            }finally {
                setLoading(false);
            }
        };
        loadItem();
    }, [id]);

    const handleUpdate = async (updatedData) => {
        try {
            setSaving(true);

            // const res = await updateAiComponent(id, updatedData);
            const formData = new FormData();
            Object.entries(updatedData).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    formData.append(key, value);
                }
            });

            const res = await updateAiComponent(id, formData);
            const updatedItem = res;

            setItem(updatedItem);
            setIsEditing(false);

        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        const result = await sweetAlert.confirm({
            title: 'Delete this option?',
            text: 'This action cannot be undone.',
            confirmText: 'Delete',
            cancelText: 'Cancel'
        });

        if (result.isConfirmed) {
            try {
                setSaving(true);
                await deleteAiComponent(id);
                navigate('/aiCustom');
            } catch (err) {
                console.error(err);
            } finally {
                setSaving(false);
            }
        }
    };

    return(
        <div className={styles.aiOptionDetails}>
        <BackButton />

        <div className={styles.aiOptionDetailsContentContainer}>

            {loading ? (
                <Loading />
            ) : saving?(
                <Loading />
            ) : isEditing ? (
                <AiOptionForm
                    initialData={item}
                    onSubmit={handleUpdate}
                    onCancel={() => setIsEditing(false)}
                />
            ) : !item ? (
                <p>Item not found</p>
            ) : (
                <div className={styles.aiOptionCard}>
                    <h2>{item.name}</h2>

                    <div className={styles.imageContainer}>
                        <img
                            src={`http://localhost:3000${item.image_preview}`}
                            alt={item.name}
                        />
                    </div>

                    <div className={styles.infoBox}>
                        <p><b>Step:</b> {item.step}</p>
                        <p><b>Category:</b> {item.category}</p>
                        <p><b>Requirement:</b> {item.requirement || 'None'}</p>
                        <p><b>Prompt Fragment:</b></p>
                        <p>{item.prompt_fragment}</p>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                        <button
                            className={`${buttonStyles.button} ${buttonStyles.main}`}
                            onClick={() => setIsEditing(true)}
                        >
                            Edit
                        </button>
                        <button
                            className={`${buttonStyles.button} ${buttonStyles.cancel}`}
                            onClick={handleDelete}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </div>
    </div>
    )
}

export default AiOptionDetails;