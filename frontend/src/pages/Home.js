import style from './Home.module.css';
import Banner from '../components/Banner';
import WelcomeSection from '../components/WelcomeSection';
import SpecialtiesSection from '../components/SpecialtiesSection';
import LatestProductSection from '../components/LatestProductSection';


function Home(){
return(
      <div className={style.home}>
        <Banner/>
        <div className={style.homeContainer}>
          <WelcomeSection />
          <SpecialtiesSection />
          <LatestProductSection />
        </div>
   
      </div>
  )
}

export default Home;