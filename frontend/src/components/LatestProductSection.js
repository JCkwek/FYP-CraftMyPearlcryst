import styles from './LatestProductSection.module.css'
import ProductCard from './ProductCard'
import {useState, useEffect} from 'react';
import { getProducts } from '../api/productApi';
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';

function LatestProductSection(){
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();


    useEffect(() => {
        fetchLatestProducts();
    },[]);

    const fetchLatestProducts = async () => {
        try{
            setLoading(true);
            const res = await getProducts({
                onlyAvailable: true,
                latest: true,
                limit: 4
            });
            console.log(res);
            setProducts(res);
        }catch(err){
            console.error("Error fetching producs:", err);
        }finally{
            setLoading(false);
        }
    };

    const handleViewMore = () => {
        navigate('/products'); // redirect to products page
    };

    return(
        <section className={styles.latestProductContainer}> 
        <h2>Explore Our Latest Creations</h2>
        <div className={styles.latestProductColumnContainer}>
        <div className={styles.productCardContainer}>
         {loading ? (
            <Loading />
         ) :  products.map((product) => (
                <ProductCard 
                    key={product.product_id}
                    product={product}
                />
            ))
        }
        </div>
        {!loading && (
            <div className={styles.viewMoreContainer}>
                <button 
                    className={styles.viewMoreBtn}
                    onClick={handleViewMore}
                >
                    View More
                </button>
            </div>
        )      
        }
        </div>
        </section>
    )
}

export default LatestProductSection;