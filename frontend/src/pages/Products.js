import style from "./Products.module.css";
import {useState, useEffect} from 'react';
import { getProducts } from '../api/productApi';
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";

function Products(){
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    },[]);

    const fetchProducts = async () => {
        try{
            const res = await getProducts();
            console.log(res);
            setProducts(res);
        }catch(err){
            console.error("Error fetching producs:", err);
        }
    };

 return (
    <div className={style.products}>
      <h1>Products</h1>
      <SearchBar />
      <div className={style.productList}>
        <div className={style.productcardcontainer}>
        {products.map((product) => (
          <ProductCard 
            key={product.product_id}
            product={product}
            />
            ))}
        </div>
        </div>
    </div>
  );
}

export default Products;

