import React, { useState, useEffect } from 'react';
import './ProductPage.css';
const apiBase = process.env.REACT_APP_API_BASE || '/api';


const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const handleDelete = (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    fetch(`${apiBase}/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to delete product');
        // Remove product from state
        setProducts(products.filter(product => product.id !== productId));
      })
      .catch((err) => {
        alert(`Error deleting product: ${err.message}`);
      });
  };

  useEffect(() => {
    // Load products from API (backed by SQLite)
    fetch(`${apiBase}/products`)
      .then((response) => {
        if (!response.ok) throw new Error('Failed to load products');
        return response.json();
      })
      .then((data) => {
        const availableProducts = data.filter(product => !product.isDeleted);
        setProducts(availableProducts);
        setLoading(false);
      })
      .catch((err) => {
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
        {products.map((product, index) => (
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
              <div className="product-id">#{index + 1}</div>
            </div>

            <div className="product-info">
              <h2 className="product-title">{product.title}</h2>
              
              <p className="product-description">
                {product.description}
              </p>

              <div className="product-footer">
                <span className="product-price">${product.price.toFixed(2)}</span>
                <button className="add-to-cart-btn">Add to Cart</button>
                <button className="delete-product-btn" onClick={() => handleDelete(product.id)} title="Delete product">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPage;
