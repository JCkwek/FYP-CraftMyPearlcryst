import styles from "./Products.module.css";
import buttonStyles from "../components/buttons/ButtonTheme.module.css";
import {useState, useEffect} from 'react';
import { getProducts } from '../api/productApi';
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import Loading from "../components/Loading";
import AlertBanner from '../components/AlertBanner';
import { useOutletContext , useNavigate, useLocation} from 'react-router-dom';

function Products(){
    const [products, setProducts] = useState([]);
    const [latestProducts, setLatestProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState(null);
    const navigate = useNavigate();
    const { currentUser }  = useOutletContext();
    const isAdmin = currentUser?.role === 'admin';
    const location = useLocation();

    useEffect(() => {
        if (location.state?.message) {
            setSuccessMessage(location.state.message);
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate]);

    useEffect(() => {
        fetchProducts('', isAdmin);
    },[isAdmin]);

    const fetchProducts = async (searchValue = '', adminStatus = false) => {
        try{
            setLoading(true);
            const res = await getProducts({
                query: searchValue,
                onlyAvailable: !adminStatus
            });
            console.log(res);
            setProducts(res);
        }catch(err){
            console.error("Error fetching producs:", err);
        }finally{
            setLoading(false);
        }
    };

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
            setLatestProducts(res);
        }catch(err){
            console.error("Error fetching latest products:", err);
        }finally{
            setLoading(false);
        }
    };

    const handleSearch = async () =>{
        setSearchQuery(search);
        fetchProducts(search, isAdmin);     
    };


 return (
    <div className={styles.products}>
        <div className={styles.productsContentContainer}>
        <h2>Products</h2>
        <div className={styles.contentFirstRow}>
            <SearchBar 
                value={search}
                onChange={setSearch}
                onSearch={handleSearch}
                placeholder="Search products"
            />
            {successMessage && <AlertBanner message={successMessage} type="success" onClose={() => setSuccessMessage(null)}/>}
            {isAdmin && (
                <button 
                    className={`${buttonStyles.button} ${buttonStyles.main}`} 
                    onClick={() => navigate('/admin/addProducts')} 
                >
                + New Product
                </button>
            )}
        </div>
        {!searchQuery && 
        <section className={styles.productList}> 
            <h4>Latest Creations</h4>
            <div className={styles.productCardContainer}>
                {loading ? (
                    <Loading />
                ) :  latestProducts.map((latestProducts,index) => (
                    <div 
                        key={latestProducts.product_id} 
                        className={styles.productCardEntry}        
                        style={{ animationDelay: `${index * 0.1}s` }} /*  inline style creates the 'one-after-another' effect */
                    >
                        <ProductCard 
                            key={latestProducts.product_id}
                            product={latestProducts}
                        />
                    </div>
                ))   
                }
            </div>
        </section>
        }

        <div className={styles.productList}>
            <h4>Collections</h4>
            <div className={styles.productCardContainer}>
                {loading ? (
                    <Loading />
                    ) : products.length === 0 ? (
                            <p>No products found</p>
                    ) : (
                products.map((product, index) => (
                    <div 
                        key={product.product_id} 
                        className={styles.productCardEntry}        
                        style={{ animationDelay: `${index * 0.1}s` }} /*  inline style creates the 'one-after-another' effect */
                    >
                        <ProductCard 
                            key={product.product_id}
                            product={product}
                        />
                    </div>
                    ))
                )}
                </div>
            </div>
        </div>
    </div>
  );
}

export default Products;

