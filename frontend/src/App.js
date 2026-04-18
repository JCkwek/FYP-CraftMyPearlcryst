// import logo from './logo.svg';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetails';
import Cart from './pages/Cart';
import Account from './pages/Account';
import Login from './pages/Login';
import Orders from './pages/Orders';
import OrderSuccess from './pages/OrderSuccess';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AiCustom from './pages/AiCustom';
import AiChat from './pages/AiChat';


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
          <Route path="account" element={<Account />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/orders" element={<Orders />}/>
          <Route path="/checkout-success" element={<OrderSuccess />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />}/>
          <Route path="/aiCustom" element={<AiCustom />}/>
          <Route path="/aiChat" element={<AiChat />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
