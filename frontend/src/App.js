// import logo from './logo.svg';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetails';
import Cart from './pages/Cart';

function App() {
  return (
    // <div className="App">
    //   <MainLayout />
    // </div>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MainLayout/>}>
          <Route index element={<Home />} /> 
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
