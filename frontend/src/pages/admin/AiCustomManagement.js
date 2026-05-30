import styles from './AiCustomManagement.module.css';
import React, { useState, useEffect } from 'react';
import AiOptionCard from '../../components/AiOptionCard';
import { fetchAiComponents, addAiComponent } from '../../api/aiCustomApi';
import { useNavigate } from 'react-router-dom';
import AiOptionForm from '../../components/admin/AiOptionForm';


function AiCustomManagement(){
    const [items, setItems] = useState([]);
    const [grouped, setGrouped] = useState({});
    const [isCreating, setIsCreating] = useState(false);
    const [selectedStep, setSelectedStep] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const loadComponents = async () => {
            try {
                const data = await fetchAiComponents();
                setItems(data);
            } catch (error) {
                console.error(error);
            }
        };

        loadComponents();
    }, []);

    useEffect(() => {
        const groupedData = items.reduce((acc, item) => {
            const step = item.step;

            if (!acc[step]) acc[step] = [];
            acc[step].push(item);

            return acc;
        }, {});
        setGrouped(groupedData);
        console.log(groupedData);
    }, [items]);

return (
    <div className={styles.aiCustomManagement}>
        <div className={styles.aiCustomManagementContentContainer}>
            {!isCreating? (
                <>
                <h2>Custom Lab Management</h2>
                {[1,2,3,4,5,6,7].map((stepNum, index) => (
                    <div key={stepNum} className={styles.stepSection}>
                        <h4>Step {stepNum}</h4>

                        <div className={`${styles.cardRow} ${styles.cardEntry}`} style={{ animationDelay: `${index * 0.1}s` }}>
                            {grouped[stepNum]?.map(item => (
                                <AiOptionCard
                                    key={item.component_id}
                                    item={item}
                                    onClick={() =>
                                        navigate(`/admin/aiOption/${item.component_id}`)
                                    }
                                    
                                />
                            ))}

                            <div
                                className={styles.addCard}
                                onClick={() => {
                                    console.log("CLICK ADD STEP:", stepNum);
                                    setSelectedStep(stepNum);
                                    setIsCreating(true);
                                }}
                            >
                                + Add
                            </div>
                        </div>
                    </div>
                ))}
                </>
            ): (
                <>
                    <h2>New Option</h2>
                    <AiOptionForm
                        initialData={{ step: selectedStep }}
                        onCancel={() => setIsCreating(false)}
                        onSubmit={async (data) => {
                            await addAiComponent(data);
                            setIsCreating(false);
                            const refreshed = await fetchAiComponents();
                            setItems(refreshed);
                        }}
                    />
                </>
            )
            }
            
        </div>
    </div>
);
}

export default AiCustomManagement;