import 'bootstrap/dist/css/bootstrap.min.css';
import Carousel from 'react-bootstrap/Carousel';
import styles from './Banner.module.css';
import { getBanners } from '../api/bannerApi';
import {useState, useEffect} from 'react';

function Banner(){
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

    return(
        <Carousel className={styles.carousel}>
            {banners.map((banner) => ( 
                <Carousel.Item key={banner.id}>
                <img
                    className="d-block w-100"
                    src={`http://localhost:3000${banner.image_url}`}
                    alt={banner.title}
                />
                <Carousel.Caption>
                    <h3>{banner.title}</h3>
                    {/* <p>Some description</p> */}
                </Carousel.Caption>
                </Carousel.Item>
            ))}
          </Carousel>
    )

}

export default Banner;