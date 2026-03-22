import 'bootstrap/dist/css/bootstrap.min.css';
import Carousel from 'react-bootstrap/Carousel';
import styles from './Banner.module.css';

function Banner({banners}){
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