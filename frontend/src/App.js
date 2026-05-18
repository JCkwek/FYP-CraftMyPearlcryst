import { BrowserRouter, Routes, Navigate ,Route, Outlet } from 'react-router-dom';
import { useState } from 'react';
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
import AddProducts from './pages/admin/AddProducts';
import EditProducts from './pages/admin/EditProducts';

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
  return <Navigate to="/login" replace />;
};

const HomeDispatcher = ({ currentUser }) => {
  if (currentUser && currentUser.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return <Home />;
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
          {/* <Route index element={<Home />} />  */}
          <Route index element={<HomeDispatcher currentUser={currentUser} />} /> 
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
            <Route path="/admin/addProducts" element={<AddProducts />} />
            <Route path="/admin/editProducts" element={<EditProducts />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
