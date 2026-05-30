import styles from './LatestProductSection.module.css';
import buttonStyles from '../components/buttons/ButtonTheme.module.css';
import ProductCard from './ProductCard';
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
                limit: 5
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
        navigate('/products');
    };

    return(
        <section className={styles.latestProduct}> 
            <h2>Explore Our Latest Creations</h2>
            <div className={styles.latestProductContentContainer}>
                {/* <div className={styles.productCardContainer}> */}
                {loading ? (
                    <Loading />
                ) :  products.map((product) => (
                        <ProductCard 
                            key={product.product_id}
                            product={product}
                        />
                ))
                    
                }
                <button 
                        className={`${buttonStyles.button} ${buttonStyles.main}`}
                        onClick={handleViewMore}
                    >
                        View More
                </button>
            </div>
        </section>
    )
}

export default LatestProductSection;