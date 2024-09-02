import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const OrderSummary = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/orders/summary', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error(error);
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
        orders.map((order) => (
          <div key={order._id} className="order">
            <h4>Order ID: {order._id}</h4>
            <p>Total Amount: ${order.totalAmount}</p>
            <p>Address: {order.address}</p>
            <p>Payment Method: {order.paymentMethod}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderSummary;
