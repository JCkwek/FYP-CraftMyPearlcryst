import style from "./Products.module.css";
import {useState, useEffect} from 'react';
import { getProducts, searchProducts } from '../api/productApi';
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";

function Products(){
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    },[]);

    const fetchProducts = async () => {
        try{
            setLoading(true);
            const res = await getProducts();
            console.log(res);
            setProducts(res);
        }catch(err){
            console.error("Error fetching producs:", err);
        }finally{
            setLoading(false);
        }
    };

    const handleSearch = async () =>{
        try{
            if(!search){
                fetchProducts(); //if no search input, show all
                return;
            }
            const res = await searchProducts(search);
            setProducts(res);
        }catch(err){
            console.error("Search product error:", err);
        }
    };


 return (
    <div className={style.products}>
      <h1>Products</h1>
      <SearchBar 
        value={search}
        onChange={setSearch}
        onSearch={handleSearch}
      />
      <div className={style.productList}>
        <div className={style.productCardContainer}>
            {loading ? (
                <p>Loading...</p>
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
  );
}

export default Products;

