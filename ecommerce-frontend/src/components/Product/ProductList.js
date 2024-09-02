// src/components/ProductList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductItem from './ProductItem';
import './Product.css'; 

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [view, setView] = useState('grid'); // 'grid' or 'list'
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]); // Example range [min, max]

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const addToCart = (product) => {
    if (!authToken) {
      alert('You must be logged in to add items to your cart.');
      return;
    }

    axios.post('http://localhost:5000/api/cart/add', {
      productId: product.id,
      quantity: 1
    }, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })
      .then(response => {
        if (response.data.success) {
          // Save cart items to LocalStorage
          const cart = JSON.parse(localStorage.getItem('cart')) || [];
          cart.push({ ...product, quantity: 1 });
          localStorage.setItem('cart', JSON.stringify(cart));
          alert('Item added to cart!');
        }
      })
      .catch(error => console.error('Error adding to cart:', error));
  };

  // Filter products based on the criteria
  const filteredProducts = products.filter(product => {
    return (
      (searchTerm === '' || product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (product.selling_price >= priceRange[0] && product.selling_price <= priceRange[1])
    );
  });

  return (
    <div>

      <div className="filters">
        <input 
          type="text" 
          placeholder="Search by name or description" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
        <div className="price-filter">
          <label>
            Min Price:
            <input 
              type="number" 
              value={priceRange[0]} 
              onChange={(e) => setPriceRange([parseFloat(e.target.value), priceRange[1]])} 
            />
          </label>
          <label>
            Max Price:
            <input 
              type="number" 
              value={priceRange[1]} 
              onChange={(e) => setPriceRange([priceRange[0], parseFloat(e.target.value)])} 
            />
          </label>
        </div>
      </div>

      <div className="view-toggle">
        <button onClick={() => setView('grid')}>Grid View</button>
        <button onClick={() => setView('list')}>List View</button>
      </div>

      <div className={`product-display ${view}`}>
        {filteredProducts.map(product => (
          <ProductItem
            key={product.id}
            product={product}
            addToCart={addToCart}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
