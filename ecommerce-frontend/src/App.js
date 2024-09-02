import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProductList from './components/Product/ProductList';
import Cart from './components/Cart/Cart';
import Checkout from './components/Checkout/Checkout';
import OrderSummary from './components/Orders/OrderSummary';
import AdminDashboard from './components/Admin/AdminDashboard';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';

function App() {
  return (
    <AuthProvider>
          <Routes>
            <Route path="/product" element={<ProductList />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<OrderSummary />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Signup />} />
          </Routes>
    </AuthProvider>
  );
}

export default App;
