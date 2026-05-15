import { BrowserRouter, Routes, Navigate ,Route, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
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
import AiCustomOrder from './pages/AiCustomOrder';

//Admin
import AdminDashboard from './pages/admin/AdminDashboard';

const AdminRouteGuard = () => {
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  
  if (token && storedUser) {
    try {
      const user = JSON.parse(storedUser);
      if (user.role === 'admin') {
        return <Outlet />; // Access granted, render the admin page
      }
    } catch (e) {
      console.error(e);
    }
  }
  // Access denied, boot them back to login
  return <Navigate to="/login" replace />;
};

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MainLayout currentUser={currentUser} setCurrentUser={setCurrentUser}/>}>
          <Route index element={<Home />} /> 
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/account" element={<Account />}/>
          <Route path="/login" element={<Login onLoginSuccess={setCurrentUser}/>}/>
          <Route path="/orders" element={<Orders />}/>
          <Route path="/checkout-success" element={<OrderSuccess />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />}/>
          <Route path="/aiCustom" element={<AiCustom />}/>
          <Route path="/aiChat" element={<AiChat />}/>
          <Route path="/aiCustomOrder" element={<AiCustomOrder />}/>
          {/*Admin routes */}
          <Route element={<AdminRouteGuard />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
