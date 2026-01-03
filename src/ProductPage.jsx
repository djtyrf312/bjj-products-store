import React, { useState, useEffect } from 'react';
import './ProductPage.css';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load products from JSON file
    fetch('/bjj-products.json')
      .then(response => response.json())
      .then(data => {
        setProducts(data.products);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="product-page">
      <header className="page-header">
        <h1>Brazilian Jiu Jitsu Gear</h1>
        <p>Premium BJJ Equipment & Apparel</p>
      </header>

      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image-container">
              <img 
                src={`/images/${product.photo}`} 
                alt={product.title}
                className="product-image"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x300?text=Image+Not+Found';
                }}
              />
              <div className="product-id">#{product.id}</div>
            </div>

            <div className="product-info">
              <h2 className="product-title">{product.title}</h2>
              
              <p className="product-description">
                {product.description}
              </p>

              <div className="product-footer">
                <span className="product-price">${product.price.toFixed(2)}</span>
                <button className="add-to-cart-btn">Add to Cart</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPage;
