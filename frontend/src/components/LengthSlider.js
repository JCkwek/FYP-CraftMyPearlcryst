import styles from './LengthSlider.module.css';
import { useState, useEffect } from 'react';
import api from '../api';

function LengthSlider({ selections, onSelect, manualConstraints = null }){
    const [constraints, setConstraints] = useState(manualConstraints || { min: 14, max: 24, default: 18, unit: 'inch' });
    // Use manual default if provided, otherwise check selections, otherwise use constraints default
    const initialVal = manualConstraints?.default || (typeof selections?.[7] === 'object' ? parseInt(selections?.[7]?.name) : selections?.[7]) || constraints.default;
    const [currentValue, setCurrentValue] = useState(initialVal);

    useEffect(() => {
        if (manualConstraints) {
            setConstraints(manualConstraints);
            setCurrentValue(manualConstraints.default);
        }
    }, [manualConstraints]);

    useEffect(() => {
        if (!manualConstraints && selections) {
            const fetchConstraints = async () => {
                try {
                    const baseType = selections[1]?.name; // get base type: necklace/bracelet from Step 1
                    const styleName = selections[6]?.name;// get necklace style: choker/princess/etc. from Step 6
                    const res = await api.get(`/aicustomjewelry/lengths`, {
                        params: { baseType, styleName }
                    });

                    if (res.data) {
                        setConstraints(res.data);
                        if (!selections[7]) {
                        //    setCurrentValue(res.data.default);
                        //     onSelect(res.data.default);
                            setCurrentValue(res.data.default);
                            onSelect(res.data.default);
                        }
                    }
                } catch (err) {
                    console.error("Error fetching length constraints:", err);
                }
            };
            fetchConstraints();
        }
    }, [manualConstraints, selections]);

    const handleChange = (e) => {
        const val = parseInt(e.target.value);
        setCurrentValue(val);
        onSelect(val); // Send value back to AiCustom.js
    };

    return(
        <div className={styles.sliderContainer}>
            <div className={styles.sliderValueDisplay}>
                <span>{currentValue}</span>
                <small>{constraints.unit || 'inch'}</small>
            </div>

            <div className={styles.sliderInputContainer}>
                <div className={styles.sliderRangeValue}>
                    <span>{constraints.min}</span>
                </div>
                <input
                    type="range"
                    min={constraints.min}
                    max={constraints.max}
                    value={currentValue}
                    onChange={handleChange}
                    className={styles.rangeInput}
                />
                <div className={styles.sliderRangeValue}>
                    <span>{constraints.max}</span>
                </div>
            </div>

            
            <p className={styles.hintText}>
                Adjust the slider to fine-tune your {selections?.[1]?.name || 'jewelry'} fit.
            </p>
        </div>
    )
}

export default LengthSlider;