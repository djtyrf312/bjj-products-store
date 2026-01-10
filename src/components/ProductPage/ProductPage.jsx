import React, { useState, useEffect } from 'react';
import './ProductPage.css';
import ProductCard from '../ProductCard/ProductCard.jsx';
const apiBase = process.env.REACT_APP_API_BASE || '/api';


const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const onProductDelete = (deletedProductId) => {
    setProducts(products.filter(product => product.id !== deletedProductId));
  }

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

      {products.length === 0 
      ? (<h2
          className="no-products-title">
            No products available.
        </h2>) 
        : <div className="products-grid">
        {products.map((product, index) => (
            <ProductCard
              key={product.id}
              productItem={product}
              index={index} 
              onDelete={onProductDelete}>  
            </ProductCard>
        ))}
      </div>}
    </div>
  );
};

export default ProductPage;
