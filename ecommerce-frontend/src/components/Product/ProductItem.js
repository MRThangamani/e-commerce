import React from 'react';

const ProductItem = ({ product, addToCart }) => {
  return (
    <div className="product-item">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p>Original Price: ${product.original_price.toFixed(2)}</p>
      <p>Discount Price: ${product.discount_price.toFixed(2)}</p>
      <p>Price: ${product.selling_price.toFixed(2)}</p>
      <button onClick={() => addToCart(product)}>Add to Cart</button>
    </div>
  );
};

export default ProductItem;
