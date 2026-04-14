import styles from "./Products.module.css";
import {useState, useEffect} from 'react';
import { getProducts } from '../api/productApi';
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import Loading from "../components/Loading";

function Products(){
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    },[]);

    const fetchProducts = async (searchValue = '') => {
        try{
            setLoading(true);
            const res = await getProducts({
                query: searchValue,
                onlyAvailable: true
            });
            console.log(res);
            setProducts(res);
        }catch(err){
            console.error("Error fetching producs:", err);
        }finally{
            setLoading(false);
        }
    };

    const handleSearch = async () =>{
        fetchProducts(search);     
    };


 return (
    <div className={styles.products}>
        <div className={styles.productsContentContainer}>
      <h1>Products</h1>
      <SearchBar 
        value={search}
        onChange={setSearch}
        onSearch={handleSearch}
      />
      <div className={styles.productList}>
        <div className={styles.productCardContainer}>
            {loading ? (
                <Loading />
                ) : products.length === 0 ? (
                    <p>No products found</p>
                ) : (
            products.map((product) => (
                    <ProductCard 
                        key={product.product_id}
                        product={product}
                    />
                ))
            )}
            </div>
            </div>
        </div>
    </div>
  );
}

export default Products;

