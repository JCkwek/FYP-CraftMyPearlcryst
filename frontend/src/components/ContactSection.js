import styles from './ContactSection.module.css';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

function ContactSection() {
    return (
        <section className={styles.contactSection}>
            <h2 className={styles.title}>Contact Us</h2>
            <p className={styles.subtitle}>
                We'd love to hear from you. Visit us or reach out anytime.
            </p>

            <div className={styles.contactContainer}>
                {/* Address */}
                <div className={styles.contactCard}>
                    <FaMapMarkerAlt className={styles.icon} />
                    <h4>Our Store</h4>
                    <p>
                        108, 1st floor Plaza Idaman, <br />
                        Medan Idaman,<br />
                        53100 Kuala Lumpur, <br />
                        Malaysia
                    </p>
                </div>

                {/* Phone */}
                <div className={styles.contactCard}>
                    <FaPhone className={styles.icon} />
                    <h4>Phone</h4>
                    <p>+60 17-333 9280</p>
                </div>

                {/* Email */}
                <div className={styles.contactCard}>
                    <FaEnvelope className={styles.icon} />
                    <h4>Email</h4>
                    <p>pearlcryst@yahoo.com</p>
                </div>

                {/* Opening Hours */}
                <div className={styles.contactCard}>
                    <FaClock className={styles.icon} />
                    <h4>Opening Hours</h4>
                    <p>Mon - Fri: 10:00 AM - 7:00 PM</p>
                </div>
            </div>
        </section>
    );
}

export default ContactSection;