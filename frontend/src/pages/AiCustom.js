import styles from './AiCustom.module.css';
import buttonStyles from '../components/buttons/ButtonTheme.module.css';
import React, { useState, useEffect } from 'react';
import Loading from '../components/Loading';
import api from '../api';
import LengthSlider from '../components/LengthSlider';
import RotatingCarousel from '../components/RotatingCarousel';
import AiOptionCard from '../components/AiOptionCard';
import AiSelectedCard from '../components/AiSelectedCard';
import ErrorBanner from '../components/ErrorBanner';


function AiCustom(){
    const [started, setStarted] = useState(false);
    const [step, setStep] = useState(1);
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selections, setSelections] = useState({}); //Track selections: { 1: {id: 1, name: 'Necklace'}, 2: {id: 3, name: 'Pearl'} }
    const [error, setError] = useState(null);
    const [generating, setGenerating] = useState(false);
    const [finalImage, setFinalImage] = useState(null);

    useEffect(() => {
        if (!started) return;

        const fetchOptions = async () => {
            setLoading(true);
            try {
                // const parentId = step > 1 ? selections[step - 1]?.component_id : null;
                const requirement = (step === 4 || step === 6) 
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
        setSelections((prev) => {
            //check if new selection is changed or not, if yes then dont reset everything after that
            const newSelections = { ...prev};
            if(prev[step]?.component_id === item.component_id){
                return prev;
            }

            Object.keys(newSelections).forEach((key) => {
                if(parseInt(key) > step){
                    delete newSelections[key];
                }
            })
            newSelections[step] = item;
            return newSelections;
        })
    };
    const handleLengthSelect = (value) => {
        setSelections((prev) => ({
            ...prev,
            7: {
                component_id: 'length', // unique id for React keys
                name: `${value} inch`,
                display_name: 'Length',
                image_preview: '/assets/icons/length_icon.jpg'
            }
        }));
    };

    const handleNext = async () => {
        if (!selections[step]) {
            setError("Please select an option before moving to the next step.");
            setTimeout(() => setError(null), 3000);
            return; 
        }

        // Clear error if an option is selected
        setError(null);

        let nextStep = step + 1;

        // Logic to skip empty steps (e.g., Pendants for Bracelets)
        if (nextStep >= 2 && nextStep <= 6) {
            const requirement = (nextStep === 4 || nextStep === 6) 
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
        if (step < 8) {
            setStep(step + 1);
        }
        setStep(nextStep);
    };

    const handleBack = () => {
        if (step === 1) {
            setStep(1);
            setSelections({});
            setStarted(false);
        } else {
            setStep(step - 1);
        }
    };

    const getDynamicStepName = (step, selections) => {
        if (step === 3 && selections[2]?.name === 'Stone') return "Stone Type";
        if (step === 3) return "Color Selection";
        const steps = ["Type", "Material", "Variant", "Pendant", "Pattern", "Style", "Length", "Generate"];
        return steps[step - 1];
    };

    const handleFinalGenerate = async ()=> {
        setGenerating(true);
        setError(null);
        try{
            const selectionIds = Object.keys(selections)
                .filter(key=> key!=='7')
                .map(key=> selections[key].component_id);

            //extract length from step 7
            const lengthValue = selections[7]
                ? parseInt(selections[7].name)
                : null;
            
            const res = await api.post('/aicustomjewelry/generate', {
                selectionIds,
                length: lengthValue
            });

            if (res.data.success) {
                // Point to your backend for newly saved image
                setTimeout(() => {
                    setFinalImage(`http://localhost:3000${res.data.imageUrl}`);
                    setGenerating(false);
                }, 2000);
            }else {
                setGenerating(false);
            }
        }catch(err){
            console.error("Generation failed:", err);
            setError("AI Generation failed. Please check your backend connection.");
            setGenerating(false);
        }
    }

    const handleReset = () => {
        setStarted(false);
        setStep(1);
        setSelections({});
        setFinalImage(null);
        setGenerating(false);
        setError(null);
    };

    const handleRegenerate = () => {
        setFinalImage(null);
        handleFinalGenerate(); // Re-runs the generation with current selections
    };

    if(!started){
        return (
            <div className={styles.aiCustomStartPage}>
                <div className={styles.aiCustomContentContainer}>
                    <RotatingCarousel />
                    <div className={styles.aiCustomStart}>
                        <h2>AI Custom Jewelry</h2>
                        <p>Design your own jewelry using our AI-powered engine.</p>
                        <button 
                            className={`${buttonStyles.button} ${buttonStyles.main}`} 
                            onClick={() => setStarted(true)}
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.aiCustomizingPage}>
            {!finalImage && !generating && (
                <div>
                <div className={styles.progressBar}>
                    <h4>Step {step}/8: {getDynamicStepName(step, selections)}</h4>
                </div>

                <div className={styles.currentSelectionContainer}>
                    {Object.keys(selections).map((key, index) => (
                        <React.Fragment key={key}>
                            {index > 0 && <div className={styles.plusIcon}>+</div>}
                            <div className={styles.selectedContainer}>
                                <AiSelectedCard item={selections[key]} />
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            </div>
            )}
            

            <div className={styles.aiOptionCardContainer}>
                {loading ? (
                    <Loading />
                )
                : step === 7 ? (
                <div className={styles.lengthContainer}>
                    <LengthSlider 
                        selections={selections} 
                        onSelect={handleLengthSelect}
                    />
                </div>
                ) 
                : step === 8 ?(
                    generating ?  (
                        <div className={styles.generatingLoader}>
                            <RotatingCarousel 
                                customItems={Object.values(selections)} 
                                speed={1.8} 
                            />
                            <div className={styles.generatingLoaderMiddleContainer}>
                                <div className={styles.generatingLoaderMiddle}>
                                    <h5>Creating your design</h5>
                                </div>
                            </div>
                        </div>
                    ) : finalImage ? (
                            <div className={styles.finalAiResultContainer}>
                                <div className={styles.finalAiImageContainer}>
                                    <img src={finalImage} alt="AI Generated Jewelry" className={styles.finalAiImage} />
                                </div>
                                <div className={styles.finalAiResultButtons}>
                                    <button className={`${buttonStyles.button} ${buttonStyles.cancel}`} onClick={handleReset}> Discard & Reset </button>
                                    <button className={`${buttonStyles.button} ${buttonStyles.main}`} onClick={handleRegenerate}>Regenerate</button>
                                    <button className={`${buttonStyles.button} ${buttonStyles.green}`} onClick={() => alert("Order functionality coming soon!")}>Add To Cart</button>
                                </div>
                            </div>
                    ) : (
                        <div className={styles.readyToGenerateContainer}>
                            <div className={styles.readyToGenerate}>
                                <h4>Design Complete!</h4>
                                Click "Generate" to see your custom creation.
                            </div>
                        </div>
                    )
                ) : (
                    options.map((item, index) => (
                        <div 
                            key={item.component_id} 
                            className={styles.optionCardEntry}        
                            style={{ animationDelay: `${index * 0.1}s` }} /*  inline style creates the 'one-after-another' effect */
                        >
                            <AiOptionCard 
                                item={item}
                                className={`${styles.optionCard} ${selections[step]?.component_id === item.component_id ? styles.selected : ''}`}
                                onClick={() => handleSelect(item)}
                            />     
                        </div>                  
                        ))
                )}
            </div>

            {!finalImage && !generating &&(
                <div className={styles.aiBackNextBtnContainer}>
                    <button className={`${buttonStyles.button} ${buttonStyles.plain}`} onClick={handleBack}>Back</button>
                    {error && <ErrorBanner message={error} type="warning"/>}
                    {step === 8 ? (
                        <button className={`${buttonStyles.button} ${buttonStyles.main}`} onClick={handleFinalGenerate}disabled={generating || !!finalImage}>
                            Generate Design
                        </button>
                    ) : (
                        <button className={`${buttonStyles.button} ${buttonStyles.main}`} onClick={handleNext} >Next</button>
                    )}
                </div>
            )}
           
        </div>  
    );
}

export default AiCustom;