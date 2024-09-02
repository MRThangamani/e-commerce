import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();
const apiUrl = process.env.REACT_APP_API_BASE_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      console.log(data)
      if (response.ok) {
        localStorage.setItem('token', data.JWTtoken);
        const decoded = jwtDecode(data.JWTtoken);
        setUser(decoded);
        navigate('/product');
        return { success: true, message: data.message };
      }
      else{
        return { success: false, message: data.message || 'Login failed. Please try again.' };
      }
    } catch (error) {
      return {error}
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
