import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();
const apiUrl = process.env.REACT_APP_API_BASE_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user')); 
    setIsLoggedIn(token !== null);
    setUser(user);
  }, []);

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
        setIsLoggedIn(true);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        if(data?.user?.role == 'admin'){
          navigate('/admin');
        }
        else{
          navigate('/product');
        }
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
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    navigate('/login');
  };
  return (
    <AuthContext.Provider value={{isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
