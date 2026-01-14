import { useState, useEffect } from 'react';
import './ProductPage.css';
import ProductCard from '../ProductCard/ProductCard.jsx';
import AddProductForm from '../AddProductForm/AddProductForm.jsx';
const apiBase = process.env.REACT_APP_API_BASE || '/api';


const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  const onProductDelete = (deletedProductId) => {
    setProducts(products.filter(product => product.id !== deletedProductId));
  }

  const onProductAdded = (newProduct) => {
    setProducts([...products, newProduct]);
  }

  const onProductUpdated = (updatedProduct) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  }

  const handleEdit = (product) => {
    setEditingProduct(product);
  }

  const handleCloseEdit = () => {
    setEditingProduct(null);
  }

  useEffect(() => {
    // Load products from API (backed by SQLite)
    fetch(`${apiBase}/products`)
      .then((response) => {
        if (!response.ok) throw new Error('Failed to load products');
        return response.json();
      })
      .then((data) => {
        setProducts(data);
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
      <AddProductForm 
        onProductAdded={onProductAdded}
        onProductUpdated={onProductUpdated}
        editProduct={editingProduct}
        onCloseEdit={handleCloseEdit}
      />

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
              onDelete={onProductDelete}
              onEdit={handleEdit}>  
            </ProductCard>
        ))}
      </div>}
    </div>
  );
};

export default ProductPage;
