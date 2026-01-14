import React, { useState, useEffect } from 'react';
import './AddProductForm.css';
import { toast } from 'react-toastify';

const apiBase = process.env.REACT_APP_API_BASE || '/api';

const AddProductForm = ({ onProductAdded }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    photo: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  }, [isFormVisible]);

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
      const response = await fetch(`${apiBase}/products`, {
        method: 'POST',
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
        throw new Error(error.error || 'Failed to create product');
      }

      const newProduct = await response.json();
      
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
      if (onProductAdded) {
        onProductAdded(newProduct);
      }
      
      toast.success('Product added successfully!');
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error(error.message || 'Failed to add product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setFormData({
      title: '',
      description: '',
      price: '',
      photo: ''
    });
  };

  return (
    <>
      <div className="add-product-button-container">
        <button 
          className="add-product-button"
          onClick={() => setIsFormVisible(true)}
        >
          + Add New Product
        </button>
      </div>

      {isFormVisible && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className="modal-content">
            <form className="add-product-form" onSubmit={handleSubmit}>
          <h2>Add New Product</h2>
          
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
              {isSubmitting ? 'Adding...' : 'Add Product'}
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
