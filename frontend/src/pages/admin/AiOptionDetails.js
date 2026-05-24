import styles from './AiOptionDetails.module.css';
import buttonStyles from '../../components/buttons/ButtonTheme.module.css';
import BackButton from '../../components/buttons/BackButton';
import Loading from '../../components/Loading';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchAiComponents } from '../../api/aiCustomApi';
import AiOptionForm from '../../components/admin/AiOptionForm';

function AiOptionDetails(){
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(false);
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
        console.log(updatedData);

        // later:
        // await updateAiComponent(id, updatedData)

        setItem(updatedData);
        setIsEditing(false);
    };

    return(
        isEditing? (
            <AiOptionForm
                initialData={item}
                onSubmit={(updatedData) => {
                    console.log(updatedData);
                }}
                onCancel={() => setIsEditing(false)}
            />
        ): (
            <div className={styles.aiOptionDetails}>
            <BackButton/>
            <div className={styles.aiOptionDetailsContentContainer}>
                {loading ? (
                    <Loading />
                ):!item ?(
                    <p>Item not found</p>
                ):(
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
                        <p><b>Requirement:</b> {item.requirement || 'None'}</p>
                        <p><b>Prompt Fragment:</b></p>
                        <p>{item.prompt_fragment}</p>
                    </div>
                    <button className={`${buttonStyles.button} ${buttonStyles.main}`} onClick={() => setIsEditing(true)}>Edit</button>
                </div>
                )}
            </div>
        </div>
        )
        
    )
}

export default AiOptionDetails;