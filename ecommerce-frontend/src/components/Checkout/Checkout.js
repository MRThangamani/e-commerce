import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Checkout.css';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import { useNavigate } from 'react-router-dom';
const apiUrl = process.env.REACT_APP_API_BASE_URL;

const CheckoutPage = () => {
  const [cart, setCart] = useState([]);
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: ''
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();


  useEffect(() => {
    axios.get(`${apiUrl}/api/cart`,{
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })
      .then(response => {
        console.log(response)
        const cartItems = response.data.product;
        setCart(cartItems);
        const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        console.log(total)
        setTotalAmount(total);
      })
      .catch(error => toast.error(error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prevState => ({
        ...prevState,
        [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(cart)
    axios.post(`${apiUrl}/api/orders/checkout`, {
      products: cart.map(item => item.productId),
      shippingAddress,
      paymentMethod
    },
    {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })
    .then(response => {
      toast.success(response.data.message)
      navigate('/orders');
    })
    .catch(error => toast.error(error));
  };

  return (
    <div>
            <h1>Checkout</h1>

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
          <div key={item.productId} className="order-item">
            <img src={item.image} alt={item.name} />
            <p>{item.name}</p>
            <p>Quantity: {item.quantity}</p>
            <p>Price: ${item.price?.toFixed(2)}</p>
          </div>
        ))}

        <div className="order-total">
          <p>Total Amount: ${totalAmount?.toFixed(2)}</p>
        </div>

        <button type="submit">Place Order</button>
      </form>
      <ToastContainer /> {/* Add ToastContainer to render toasts */}
    </div>
  );
};

export default CheckoutPage;
