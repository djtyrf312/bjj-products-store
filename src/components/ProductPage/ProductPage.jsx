import { useState, useEffect } from 'react';
import './ProductPage.css';
import ProductCard from '../ProductCard/ProductCard.jsx';
import AddProductForm from '../AddProductForm/AddProductForm.jsx';
import Pagination from '../Pagination/Pagination.jsx';
const apiBase = process.env.REACT_APP_API_BASE || '/api';


const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [sortOrder, setSortOrder] = useState('asc');
  const itemsPerPage = 8;

  const onProductDelete = (deletedProductId) => {
    setProducts(products.filter(product => product.id !== deletedProductId));
  }

  const onProductAdded = (newProduct) => {
    setProducts([...products, newProduct]);
    // Refresh to get updated pagination
    fetchProducts(currentPage);
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

  const fetchProducts = (page, order = sortOrder) => {
    setLoading(true);
    const url = `${apiBase}/products?page=${page}&limit=${itemsPerPage}&order=${order}`;
    console.log('Fetching products:', { page, order, url });
    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error('Failed to load products');
        return response.json();
      })
      .then((data) => {
        console.log('Products received:', { 
          ids: data.products.map(p => p.id), 
          order: data.pagination.order 
        });
        setProducts(data.products);
        setCurrentPage(data.pagination.page);
        setTotalPages(data.pagination.totalPages);
        setTotalProducts(data.pagination.total);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchProducts(page, sortOrder);
    }
  };

  const handleSortChange = (e) => {
    const newOrder = e.target.value;
    setSortOrder(newOrder);
    setCurrentPage(1);
    fetchProducts(1, newOrder);
  };

  useEffect(() => {
    fetchProducts(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="product-page">
      <div className="product-page-header">
        <div className="sort-control">
          <label htmlFor="sort-order">Sort by ID:</label>
          <select id="sort-order" value={sortOrder} onChange={handleSortChange}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
        <AddProductForm 
          onProductAdded={onProductAdded}
          onProductUpdated={onProductUpdated}
          editProduct={editingProduct}
          onCloseEdit={handleCloseEdit}
        />
      </div>

      {products.length === 0 
      ? (<h2
          className="no-products-title">
            No products available.
        </h2>) 
        : (
          <>
            <div className="products-grid">
              {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  productItem={product}
                  index={index} 
                  onDelete={onProductDelete}
                  onEdit={handleEdit}>  
                </ProductCard>
              ))}
            </div>
            
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalProducts}
              onPageChange={handlePageChange}
            />
          </>
        )}
    </div>
  );
};

export default ProductPage;
