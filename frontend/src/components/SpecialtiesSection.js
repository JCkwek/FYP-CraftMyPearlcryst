import styles from './SpecialtiesSection.module.css'
import SpecialtyCard from './SpecialtyCard'
import { FaGem, FaMagic, FaCircle } from 'react-icons/fa';

function SpecialtiesSection(){
    const specialties = [
        {
            icon: < FaCircle />,
            title: "Pear Jewelry",
            desc: "Elegant handcrafted designs using freshwater pearls."
        },
        {
            icon: <FaGem/>,
            title: "Crystal Designs",
            desc: "Unique crystal jewelry with modern and timeless styles."
        },
        {
            icon: <FaMagic />,
            title: "Custom Creation",
            desc: "Customize our jewelry or design your own with our AI assistance"
        }
    ];

    return(
        <section className={styles.specialtiesContainer}>
            <h2>Our Specialties</h2>
            <div className={styles.specialtiesCardContainer}>
                {specialties.map((item, index) => (
                    <SpecialtyCard 
                        key={index}
                        icon={item.icon}
                        title={item.title}
                        desc={item.desc}
                    />
                ))}
            </div>
        </section>
    )
}

export default SpecialtiesSection;