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
    const [productType, setProductType] = useState('');

    useEffect(() => {
        if (location.state?.message) {
            setSuccessMessage(location.state.message);
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate]);

    useEffect(() => {
        fetchProducts('', isAdmin);
    },[isAdmin]);

    const fetchProducts = async (searchValue = '', adminStatus = false, typeValue = '') => {
        try{
            setLoading(true);
            const res = await getProducts({
                query: searchValue,
                onlyAvailable: !adminStatus,
                type: typeValue || undefined
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
        fetchProducts(search, isAdmin, productType);     
    };


 return (
    <div className={styles.products}>
        <div className={styles.productsContentContainer}>
        <h2>Products</h2>
        <div className={styles.contentFirstRow}>
            <div className={styles.contentFirstRowLeftColumn}>
                <SearchBar 
                    value={search}
                    onChange={setSearch}
                    onSearch={handleSearch}
                    placeholder="Search products"
                />
                
                {isAdmin && (
                    <button 
                        className={`${buttonStyles.button} ${buttonStyles.main}`} 
                        onClick={() => navigate('/admin/addProducts')} 
                    >
                    + New Product
                    </button>
                )}

                {successMessage && <AlertBanner message={successMessage} type="success" onClose={() => setSuccessMessage(null)}/>}
                
            </div>

            {/*product type filter */}
            <select
                className={styles.filterSelect}
                value={productType}
                onChange={(e) => {
                    const value = e.target.value;
                    setProductType(value);
                    fetchProducts(search, isAdmin, value);
                }}
            >
                <option value="">All Types</option>
                <option value="Necklace">Necklace</option>
                <option value="Bracelet">Bracelet</option>
                <option value="Ring">Ring</option>
                <option value="Earring">Earring</option>
            </select>
        </div>

        {loading ? (
            <Loading />
        ) : products.length === 0 ? (
            <div className={styles.noProductContainer}>No products found</div>
        ) : (
            <>
                {/*Latest Creatiokn*/}
                {!searchQuery && !productType &&
                    <section className={styles.productList}> 
                        <h4>Latest Creations</h4>
                        <div className={styles.productCardContainer}>
                            {latestProducts.map((latestProducts,index) => (
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
                {/*Collection*/}
                <section className={styles.productList}>
                   {!searchQuery && !productType ? (
                        <h4>Collections</h4>
                    ) : searchQuery && productType ? (
                        <h4>
                            Results for "{searchQuery}" in {productType}
                        </h4>
                    ) : searchQuery ? (
                        <h4>
                            Results for "{searchQuery}"
                        </h4>
                    ) : (
                        <h4>
                            {productType}
                        </h4>
                    )}
                    
                    <div className={styles.productCardContainer}>
                        {products.map((product, index) => (
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
                        ))}
                    </div>
                </section>
            </>
        )
        }
        </div>
    </div>
  );
}

export default Products;

