import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Cart.css'; 

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    axios.get('http://localhost:5000/api/cart',{
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })
      .then(response => setCart(response.data))
      .catch(error => console.error('Error fetching cart:', error));
  }, []);

  console.log(cart)

  const handleQuantityChange = (productId, quantity) => {
    console.log(productId,quantity)
    axios.post('http://localhost:5000/api/cart/update', { productId, quantity },{
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })
      .then(response => setCart(response.data))
      .catch(error => console.error('Error updating cart item:', error));
  };

  const handleRemoveItem = (productId) => {
    axios.post('http://localhost:5000/api/cart/remove', { productId },{
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })
      .then(response => setCart(response.data))
      .catch(error => console.error('Error removing cart item:', error));
  };

  const calculateTotal = () => {
    return cart?.items.reduce((total, item) => total + (item.productId.selling_price * item.quantity), 0) || 0;
  };

  return (
    <div>
      <header>
        <h1>Shopping Cart</h1>
        <nav>
          {/* Navigation Menu */}
        </nav>
      </header>

      <div className="cart-items">
        {cart?.items.map(item => (
          <div key={item.productId._id} className="cart-item">
            <img src={item.productId.image} alt={item.productId.name} />
            <h3>{item.productId.name}</h3>
            <p>Price: ${item.productId.selling_price?.toFixed(2)}</p>
            <input
              type="number"
              value={item.quantity}
              min="1"
              onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value))}
            />
            <button onClick={() => handleRemoveItem(item.productId)}>Remove</button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <p>Subtotal: ${calculateTotal().toFixed(2)}</p>
        <p>Total: ${calculateTotal().toFixed(2)}</p>
        <button onClick={() => window.location.href = '/checkout'}>Continue to Checkout</button>
        <button onClick={() => window.location.href = '/product'}>Continue Shopping</button>
      </div>
    </div>
  );
};

export default CartPage;
