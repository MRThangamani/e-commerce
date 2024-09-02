import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Checkout.css';

const CheckoutPage = () => {
  const [cart, setCart] = useState([]);
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: ''
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    axios.get('http://localhost:5000/api/cart')
      .then(response => {
        const cartItems = response.data.items;
        setCart(cartItems);
        const total = cartItems.reduce((acc, item) => acc + (item.productId.selling_price * item.quantity), 0);
        setTotalAmount(total);
      })
      .catch(error => console.error('Error fetching cart:', error));
  }, []);

  const handleChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/orders/checkout', {
      shippingAddress,
      paymentMethod: 'Cash' 
    },
    {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })
    .then(response => {
      alert('Order placed successfully!');
      window.location.href = '/'; 
    })
    .catch(error => console.error('Error placing order:', error));
  };

  return (
    <div>
      <header>
        <h1>Checkout</h1>
        <nav>
          {/* Navigation Menu */}
        </nav>
      </header>

      <form onSubmit={handleSubmit} className="checkout-form">
        <h2>Shipping Information</h2>
        <label>
          Street:
          <input type="text" name="street" value={shippingAddress.street} onChange={handleChange} required />
        </label>
        <label>
          City:
          <input type="text" name="city" value={shippingAddress.city} onChange={handleChange} required />
        </label>
        <label>
          State:
          <input type="text" name="state" value={shippingAddress.state} onChange={handleChange} required />
        </label>
        <label>
          Zip:
          <input type="text" name="zip" value={shippingAddress.zip} onChange={handleChange} required />
        </label>

        <h2>Order Summary</h2>
        {cart.map(item => (
          <div key={item.productId._id} className="order-item">
            <img src={item.productId.image} alt={item.productId.name} />
            <p>{item.productId.name}</p>
            <p>Quantity: {item.quantity}</p>
            <p>Price: ${item.productId.selling_price.toFixed(2)}</p>
          </div>
        ))}

        <div className="order-total">
          <p>Total Amount: ${totalAmount.toFixed(2)}</p>
        </div>

        <button type="submit">Place Order</button>
      </form>
    </div>
  );
};

export default CheckoutPage;
