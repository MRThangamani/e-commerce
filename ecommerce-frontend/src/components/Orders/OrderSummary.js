import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
const apiUrl = process.env.REACT_APP_API_BASE_URL;

const OrderSummary = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/orders/summary`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        setOrders(data.order);
      } catch (error) {
        toast.error(error)
      }
    };

    fetchOrders();
  }, [user]);

  return (
    <div className="order-summary">
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders?.map((order) => (
          <div key={order._id} className="order">
            <h4>Order ID: {order._id}</h4>
            <p>Total Amount: ${order.totalAmount}</p>
            <p>Address Details: <p>Street : {order.shippingAddress.street}</p> <p>City : {order.shippingAddress.city}</p>
            <p>State : {order.shippingAddress.state}</p><p>Zip : {order.shippingAddress.zip}</p></p>
            <p>Payment Method: {order.paymentMethod}</p>
          </div>
        ))
      )}
      <ToastContainer /> 
    </div>
  );
};

export default OrderSummary;
