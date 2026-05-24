import styles from './AiOptionDetails.module.css';
import buttonStyles from '../../components/buttons/ButtonTheme.module.css';
import BackButton from '../../components/buttons/BackButton';
import Loading from '../../components/Loading';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchAiComponents , updateAiComponent } from '../../api/aiCustomApi';
import AiOptionForm from '../../components/admin/AiOptionForm';

function AiOptionDetails(){
    const { id } = useParams();
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

            const res = await updateAiComponent(id, updatedData);
            const updatedItem = res.data;

            setItem(updatedItem);
            setIsEditing(false);

        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
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

                    <button
                        className={`${buttonStyles.button} ${buttonStyles.main}`}
                        onClick={() => setIsEditing(true)}
                    >
                        Edit
                    </button>
                </div>
            )}
        </div>
    </div>
    )
}

export default AiOptionDetails;