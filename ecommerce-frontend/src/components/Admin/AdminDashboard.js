import React, { useEffect, useState } from 'react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/users', {
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
