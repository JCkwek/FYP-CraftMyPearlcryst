import styles from './AiCustomManagement.module.css';
import React, { useState, useEffect } from 'react';
import AiOptionCard from '../../components/AiOptionCard';
import { fetchAiComponents } from '../../api/aiCustomApi';
import { useNavigate } from 'react-router-dom';


function AiCustomManagement(){
    const [items, setItems] = useState([]);
    const [grouped, setGrouped] = useState({});
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
            <h2>Custom Lab Management</h2>

            {[1,2,3,4,5,6,7].map(stepNum => (
                <div key={stepNum} className={styles.stepSection}>
                    
                    <h4>Step {stepNum}</h4>

                    <div className={styles.cardRow}>
                        {grouped[stepNum]?.map(item => (
                            <AiOptionCard
                                key={item.component_id}
                                item={item}
                                onClick={() => navigate(`/admin/aiOption/${item.component_id}`)}
                            />
                        ))}

                        {/* + Add button */}
                        <div
                            className={styles.addCard}
                            onClick={() => console.log("Add step", stepNum)}
                        >
                            + Add
                        </div>
                    </div>

                </div>
            ))}
        </div>
    </div>
);
}

export default AiCustomManagement;