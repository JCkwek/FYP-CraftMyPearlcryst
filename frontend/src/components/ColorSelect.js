import styles from './ColorSelect.module.css'
import React from 'react';

function ColorSelect({ option, selectedColor, onSelectColor }){
if (!option) return null;
    return (
        <div className={styles.listOptionContainer}>
            <label>{option.option_name}: </label>
            <div className={styles.swatchGroup}>
                {option.values.map(val => (
                    <button
                        key={val.value_id}
                        type="button"
                        className={`${styles.swatch} ${
                            selectedColor === val.visual_value ? styles.activeSwatch : ''
                        }`}
                        style={{ backgroundColor: val.visual_value }}
                        onClick={() => onSelectColor(val.visual_value)}
                        title={val.value_label}
                    />
                ))}
            </div>
        </div>
    );
}

export default ColorSelect;