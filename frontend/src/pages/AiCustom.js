import styles from './AiCustom.module.css'
import { useState, useEffect } from 'react';
import Loading from '../components/Loading';
import api from '../api';
import LengthSlider from '../components/LengthSlider';
import RotatingCarousel from '../components/RotatingCarousel';


function AiCustom(){
    const [started, setStarted] = useState(false);
    const [step, setStep] = useState(1);
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selections, setSelections] = useState({}); //Track selections: { 1: {id: 1, name: 'Necklace'}, 2: {id: 3, name: 'Pearl'} }

    useEffect(() => {
        if (!started) return;

        const fetchOptions = async () => {
            setLoading(true);
            try {
                // const parentId = step > 1 ? selections[step - 1]?.component_id : null;
                const requirement = (step === 4) 
                    ? selections[1]?.name 
                    : selections[step - 1]?.name;
                console.log(`DEBUG: Step ${step} | Req: ${requirement}`);
                const res = await api.get(`/aicustomjewelry/step/${step}${requirement ? `?req=${requirement}` : ''}`);
                setOptions(res.data);
            } catch (err) {
                console.error("Error fetching options:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOptions();
    }, [step, started]);

    const handleSelect = (item) => {
        setSelections({ ...selections, [step]: item });
    };

    const handleNext = async () => {
        let nextStep = step + 1;

        // Logic to skip empty steps (e.g., Pendants for Bracelets)
        if (nextStep < 8) {
            const requirement = (nextStep === 4) 
                ? selections[1]?.name 
                : selections[step]?.name;

            try {
                const res = await api.get(`/aicustomjewelry/step/${nextStep}?req=${requirement}`);
                if (res.data.length === 0) {
                    // Skip logic: if no options exist for the next rule, jump forward
                    setStep(nextStep + 1);
                    return;
                }
            } catch (err) {
                console.error("Error pre-fetching next step:", err);
            }
        }
        setStep(nextStep);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const getDynamicStepName = (step, selections) => {
        if (step === 3 && selections[2]?.name === 'Stone') return "Stone Type";
        if (step === 3) return "Color Selection";
        const steps = ["Type", "Material", "Variant", "Pendant", "Pattern", "Style", "Length", "Generate"];
        return steps[step - 1];
    };

    if(!started){
        return (
            <div className={styles.aiCustom}>
                <div className={styles.aiCustomContentContainer}>
                    <RotatingCarousel />
                    <div className={styles.aiCustomStart}>
                        
                        <h2>AI Custom Jewelry</h2>
                        <p>Design your own jewelry using our AI-powered engine.</p>
                        <button 
                            className={styles.startButton} 
                            onClick={() => setStarted(true)}
                        >
                            Get Started
                        </button>
                    </div>
                    <div className={styles.emptySpace}></div>

                </div>
            </div>
        )
    }

    return (
        <div className={styles.aiCustom}>
            <div>
                <div className={styles.progressBar}>
                    Step {step} of 8: {getDynamicStepName(step, selections)}
            </div>

            <div className={styles.optionsGrid}>
                {loading ? (
                    <Loading />
                )
                : step === 7 ? (
                <div className={styles.lengthContainer}>
                    <h3>Choose your length</h3>
                    <LengthSlider 
                        selections={selections} 
                        onSelect={(val) => setSelections({...selections, 7: val})} 
                    />
                </div>
                ) : (
                    options.map((item) => (
                        <div 
                            key={item.component_id}
                            className={`${styles.optionCard} ${selections[step]?.component_id === item.component_id ? styles.selected : ''}`}
                            onClick={() => handleSelect(item)}
                        >
                            <img src={`http://localhost:3000${item.image_preview}`} alt={item.name} />
                            <p>{item.name}</p>
                        </div>
                    ))
                )}
            </div>

            <div className={styles.controls}>
                <button onClick={handleBack} disabled={step === 1}>Back</button>
                <button onClick={handleNext} disabled={!selections[step]}>Next</button>
            </div>
            </div>
           
        </div>
    );
}

export default AiCustom;