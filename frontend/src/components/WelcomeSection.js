import styles from './WelcomeSection.module.css'
function WelcomeSection(){
    return (
        <section className={styles.welcomeSectionContainer}>
            <h2>Welcome to CraftMyPearlcryst</h2>
            <p>
                Explore our handcrafted pearl and crystal jewelry, thoughtfully made with care, and customize each piece to suit your own needs.
            </p>
        </section>
    )
}

export default WelcomeSection;