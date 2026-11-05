import styles from './RotatingCarousel.module.css';
import { useState, useEffect, useRef } from 'react';
// import { getImages } from '../api/rotateImageApi';

function RotatingCarousel({ customItems = null, speed = 0.2 }) {
    const [images, setImages] = useState([]);
    const [angle, setAngle] = useState(0);
    const requestRef = useRef();
    useEffect(() => {
        if (customItems) {
            setImages(customItems); // images from custom ai selection
        } else {
            // fetchRotateImage(); // images for landing page
            const defaultImages = [
                { image_id: 1, image_path: '/assets/images/ai rotate image/aiimg01.jpg', alt_text: 'AI Rotate 1' },
                { image_id: 2, image_path: '/assets/images/ai rotate image/aiimg02.jpg', alt_text: 'AI Rotate 2' },
                { image_id: 3, image_path: '/assets/images/ai rotate image/aiimg03.jpg', alt_text: 'AI Rotate 3' },
                { image_id: 4, image_path: '/assets/images/ai rotate image/aiimg04.jpg', alt_text: 'AI Rotate 4' },
                { image_id: 5, image_path: '/assets/images/ai rotate image/aiimg05.jpg', alt_text: 'AI Rotate 5' }
            ];
            setImages(defaultImages);
        }
    }, [customItems]);

    // const fetchRotateImage = async () => {
    //     try {
    //         const res = await getImages();
    //         console.log(res);
    //         setImages(res);
    //     } catch (err) {
    //         console.error("Failed to load rotate image", err);
    //     }
    // };

    const animate = () => {
        setAngle((prevAngle) => prevAngle + speed); 
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, [speed]);

    if (images.length === 0) return null;

    return (
        <div className={styles.rotatingCarousel}>
            <div className={styles.circleArea}>
                {images.map((img, index) => {
                    // calculate position on the circle
                    const totalImages = images.length;
                    const individualAngle = (index * (360 / totalImages) + angle) * (Math.PI / 180);

                    // //handle both API images and selection images
                    // const imgSrc = img.image_preview 
                    //     ? (img.image_preview.startsWith('http') ? img.image_preview : `http://localhost:3000${img.image_preview}`)
                    //     : `http://localhost:3000${img.image_path}`;

                    // Handle API images, custom selection, or local public folder assets safely
                    const rawPath = img.image_preview || img.image_path;
                    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

                    const imgSrc = rawPath.startsWith('http') || rawPath.startsWith('/')
                        ? (rawPath.startsWith('http') ? rawPath : rawPath) // Relative paths starting with '/' automatically map to public folder
                        : `${API_BASE_URL}/${rawPath}`;

                   // 50% is the center, 35% is the radius (adjust 35 to change how far out they go)
                    const leftPos = 50 + 35 * Math.cos(individualAngle);
                    const topPos = 50 + 35 * Math.sin(individualAngle);

                    return (
                        <div
                            key={img.image_id}
                            className={styles.imageCard}
                            style={{
                                left: `${leftPos}%`,
                                top: `${topPos}%`,
                                transform: 'translate(-50%, -50%)' // Keeps image centered on its coordinates
                            }}
                        >
                            <img src={imgSrc} alt={img.alt_text} />
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default RotatingCarousel;