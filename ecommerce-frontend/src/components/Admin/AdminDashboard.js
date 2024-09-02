import React, { useEffect, useState } from 'react';
import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_BASE_URL;

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/admin/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error(error);
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
            <h4>{user.email}</h4>
            <p>Role: {user.role}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminDashboard;
