import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
const apiUrl = process.env.REACT_APP_API_BASE_URL;

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/auth/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUsers(response.data.users);
      } catch (error) {
        toast.error(error)
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        users.map((user) => (
          <div key={user._id} className="user">
            <h4>Name:{user.name}</h4>
            <h4>Email:{user.email}</h4>
            <p>Phone No: {user.phone}</p>
            <p>Role: {user.role}</p>
          </div>
        ))
      )}
      <ToastContainer /> 
    </div>
  );
};

export default AdminDashboard;
