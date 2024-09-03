import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Cart.css'; 
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
const apiUrl = process.env.REACT_APP_API_BASE_URL;

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    axios.get(`${apiUrl}/api/cart`,{
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })
      .then(response => setCart(response.data))
      .catch(error => toast.error(error));
  }, []);

  console.log(cart)

  const handleInputChange = (e) => {
    console.log(e)
    setQuantity(parseInt(e, 10));
  };

  const handleQuantityChange = (productId, quantity) => {
    if (quantity <= 0) {
      toast.error('Quantity must be greater than 0'); 
      return;
    }
    console.log(productId,quantity)
    axios.post(`${apiUrl}/api/cart/update`, { productId, quantity },{
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })
      .then(response =>{ setCart(response.data)
      toast.success(response.data.message); 
  })
      .catch(error => toast.error(error));
  };

  const handleRemoveItem = (productId) => {
    axios.post(`${apiUrl}/api/cart/remove`, { productId },{
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })
      .then(response => {setCart(response.data)
        toast.success(response.data.message); 
      })
      .catch(error => toast.error(error));
  };

  const calculateTotal = () => {
    console.log(cart)
    return cart?.product.reduce((total, item) => total + (item.price * item.quantity), 0) || 0;
  };

  const getTotalCount = () => {
    return cart?.product.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div>
      <h1>Shopping Cart</h1>

      <div className="cart-items">
        {cart?.product.map(item => (
          <div key={item.productId} className="cart-item">
            <img src={item.image} alt={item.name} />
            <h3>{item.name}</h3>
            <p>Price: ${item.price?.toFixed(2)}</p>
            <label>Quantity</label>
            <input
              type="number"
              value={item.quantity}
              min="1"
              onChange={(e) => handleInputChange(e.target.value)}
            />
            <button onClick={() => handleQuantityChange(item.productId, quantity)}>Update</button>
            <button onClick={() => handleRemoveItem(item.productId)}>Remove</button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <p>Total: ${calculateTotal().toFixed(2)}</p>
        {getTotalCount() > 0 && (
          <button onClick={() => window.location.href = '/checkout'}>
            Continue to Checkout
          </button>
        )}
        <button onClick={() => window.location.href = '/product'}>Continue Shopping</button>
      </div>
      <ToastContainer /> {/* Add ToastContainer to render toasts */}
    </div>
  );
};

export default CartPage;
