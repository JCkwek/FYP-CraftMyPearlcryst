import styles from './SpecialtiesSection.module.css'
import SpecialtyCard from './SpecialtyCard'
import { FaGem, FaMagic, FaCircle } from 'react-icons/fa';

function SpecialtiesSection(){
    const specialties = [
        {
            icon: < FaCircle />,
            title: "Freshwater Pearls",
            desc: "Elegant handcrafted designs using freshwater pearls.",
            image: '/assets/images/pearlJewel.jpg',
        },
        {
            icon: <FaGem/>,
            title: "Crystal Designs",
            desc: "Unique crystal jewelry with modern and timeless styles.",
            image: '/assets/images/crystalJewel.jpg',
        },
        {
            icon: <FaMagic />,
            title: "Semi-Precious Stones",
            desc: "Natural semi-precious stones jewelry, each offering its own unique color, texture, and character.",
            image: '/assets/images/stonesJewel.jpg',
        },
        {
            icon: <FaMagic />,
            title: "Custom Creation",
            desc: "Customize our jewelry or design your own with our AI assistance",
            image: '/assets/images/customJewel.jpg',
        }
    ];

    return(
        <section className={styles.specialtiesContainer}>
            <h2>Our Specialties</h2>
            <div className={styles.scrollContainer}>           
            <div className={styles.specialtiesCardContainer}>
                {specialties.map((item, index) => (
                    <SpecialtyCard 
                        key={index}
                        icon={item.icon}
                        title={item.title}
                        desc={item.desc}
                        image={item.image}
                    />
                ))}
            </div>
            </div>
        </section>
    )
}

export default SpecialtiesSection;