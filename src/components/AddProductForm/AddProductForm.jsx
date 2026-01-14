import React, { useState, useEffect, useCallback } from 'react';
import './AddProductForm.css';
import { toast } from 'react-toastify';

const apiBase = process.env.REACT_APP_API_BASE || '/api';

const AddProductForm = ({ onProductAdded, onProductUpdated, editProduct, onCloseEdit }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    photo: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!editProduct;

  const handleCancel = useCallback(() => {
    setIsFormVisible(false);
    setFormData({
      title: '',
      description: '',
      price: '',
      photo: ''
    });
    if (isEditMode && onCloseEdit) {
      onCloseEdit();
    }
  }, [isEditMode, onCloseEdit]);

  // Load edit product data when editProduct changes
  useEffect(() => {
    if (editProduct) {
      setFormData({
        title: editProduct.title,
        description: editProduct.description,
        price: editProduct.price.toString(),
        photo: editProduct.photo
      });
      setIsFormVisible(true);
    }
  }, [editProduct]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isFormVisible) {
        handleCancel();
      }
    };

    if (isFormVisible) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isFormVisible, handleCancel]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      handleCancel();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = isEditMode ? `${apiBase}/products/${editProduct.id}` : `${apiBase}/products`;
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price)
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `Failed to ${isEditMode ? 'update' : 'create'} product`);
      }

      const product = await response.json();
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        price: '',
        photo: ''
      });
      
      // Hide form
      setIsFormVisible(false);
      
      // Notify parent component
      if (isEditMode && onProductUpdated) {
        onProductUpdated(product);
        if (onCloseEdit) onCloseEdit();
      } else if (onProductAdded) {
        onProductAdded(product);
      }
      
      toast.success(`Product ${isEditMode ? 'updated' : 'added'} successfully!`, { autoClose: 2000, hideProgressBar: true });
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} product:`, error);
      toast.error(error.message || `Failed to ${isEditMode ? 'update' : 'add'} product`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {!isEditMode && (
        <div className="add-product-button-container">
          <button 
            className="add-product-button"
            onClick={() => setIsFormVisible(true)}
          >
            + Add New Product
          </button>
        </div>
      )}

      {isFormVisible && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className="modal-content">
            <form className="add-product-form" onSubmit={handleSubmit}>
          <h2>{isEditMode ? 'Edit Product' : 'Add New Product'}</h2>
          
          <div className="form-group">
            <label htmlFor="title">Product Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="Enter product title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="4"
              placeholder="Enter product description"
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price ($) *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              min="0.01"
              step="0.01"
              placeholder="0.00"
            />
          </div>

          <div className="form-group">
            <label htmlFor="photo">Photo URL *</label>
            <input
              type="url"
              id="photo"
              name="photo"
              value={formData.photo}
              onChange={handleInputChange}
              required
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Update Product' : 'Add Product')}
            </button>
          </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddProductForm;
