import styles from './RotatingCarousel.module.css';
import { useState, useEffect,useRef } from 'react';
import { getImages } from '../api/rotateImageApi';

function RotatingCarousel(){
    const [images, setImages] = useState([]);
    const [angle, setAngle] = useState(0);
    const requestRef = useRef();
    useEffect(() => {
        fetchRotateImage();
    }, []);

    const fetchRotateImage = async () => {
        try{
          const res = await getImages();
          console.log(res);
          setImages(res);
        }catch(err){
          console.error("Failed to load rotate image",err);
        }
      };

const animate = () => {
        setAngle((prevAngle) => prevAngle + 0.2); // Adjust speed here
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, []);

    if (images.length === 0) return null;

    const radius = 300; // How big the circle is
    const centerX = 650; // Center X of the container
    const centerY = 300; // Center Y of the container

    return (
        <div className={styles.rotatingCarousel}>
           <div className={styles.circleArea}>
                {images.map((img, index) => {
                    // Math to calculate position on the circle
                    const totalImages = images.length;
                    const individualAngle = (index * (360 / totalImages) + angle) * (Math.PI / 180);
                    
                    const x = centerX + radius * Math.cos(individualAngle);
                    const y = centerY + radius * Math.sin(individualAngle);

                    return (
                        <div 
                            key={img.image_id} 
                            className={styles.imageCard}
                            style={{ 
                                left: `${x}px`, 
                                top: `${y}px`,
                                transform: 'translate(-50%, -50%)' // Keeps image centered on its coordinates
                            }}
                        >
                            <img src={`http://localhost:3000${img.image_path}`} alt={img.alt_text} />
                        </div>
                    );
                })}
            </div>
        </div>  
    )
}

export default RotatingCarousel;