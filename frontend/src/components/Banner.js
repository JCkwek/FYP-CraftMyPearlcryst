import 'bootstrap/dist/css/bootstrap.min.css';
import Carousel from 'react-bootstrap/Carousel';
import styles from './Banner.module.css';

function Banner(){
    const banners = [
    {
      id: 1,
      title: 'Handcrafted Elegnace, Designed by You',
      image: '/assets/images/banner1.jpg',
    },
    {
      id: 2,
      title: 'Create Your Own Unique Piece',
      image: '/assets/images/banner2.jpg',
    },
    {
      id: 3,
      title: 'Crafted with Precision and Care',
      image: '/assets/images/banner3.jpg',
    },
  ];

    return(
        <Carousel className={styles.carousel}>
            {banners.map((banner) => ( 
                <Carousel.Item key={banner.id}>
                  <img
                      className="d-block w-100"
                      src={banner.image}
                      alt={banner.title}
                  />
                <Carousel.Caption>
                    <h3>{banner.title}</h3>
                </Carousel.Caption>
                </Carousel.Item>
            ))}
          </Carousel>
    )
}

export default Banner;