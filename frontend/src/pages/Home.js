import style from './Home.module.css';
import {useState, useEffect} from 'react';
import Banner from '../components/Banner';
import { getBanners } from '../api/bannerApi';


function Home(){
//state and handle functions
  const [banners, setBanners] = useState([]);

  useEffect(()=>{
    fetchBanners();
  },[]);

  const fetchBanners = async () => {
    try{
      const res = await getBanners();
      console.log(res);
      setBanners(res);
    }catch(err){
      console.error("Failed to load banner",err);
    }
  };
//
return(
      <div className={style.home}>
        <Banner banners={banners} />
        <div className={style.homeContainer}>
          <h1>Home</h1>
          <p>Pearlcryst</p>
        </div>
   
      </div>
  )
}

export default Home;