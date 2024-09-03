import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css'; 

const Header = () => {
  const { isLoggedIn, user, logout } = useAuth();

  return (
    <header>
      <nav>
        <ul>
          {isLoggedIn ? (
            <>
              {user && user.role !== 'admin' && (
                <>
                  <li>
                    <Link to="/product">Products</Link>
                  </li>
                  <li>
                    <Link to="/cart">Cart</Link>
                  </li>
                  <li>
                    <Link to="/orders">My Orders</Link>
                  </li>
                </>
              )}

              {user && (
                <li>
                  <span>
                    Welcome, {user.name} ({user.role})
                  </span>
                </li>
              )}

              <li>
                <button onClick={logout}>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/signup">Signup</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
