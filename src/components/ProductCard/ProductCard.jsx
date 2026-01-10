import React, { useState } from 'react';
import './ProductCard.css';
import { toast } from 'react-toastify';
import { FaRegTrashAlt } from "react-icons/fa";


const ProductCard = ({ onDelete, productItem, index }) => {
    const { id, photo, title, description, price } = productItem;
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) {
            return;
        }

        setIsDeleting(true);

        fetch(`api/products/${productId}`, {
            method: 'DELETE',
            headers: {
            'Content-Type': 'application/json',
            },
        })
        .then((response) => {
        if (!response.ok) throw new Error('Failed to delete product');
        // Remove product from state
        onDelete(productId);
        })
        .catch((err) => {
            toast.error(
                `Error deleting product: ${err.message}`,
                { 
                    autoClose: 1500,
                    hideProgressBar: true
                });
        })
        .finally(() => {
        setIsDeleting(false);
        });
    };

    return (
        <div key={id} className="product-card">
        <div className="product-image-container">
            <img 
            src={`/images/${photo}`} 
            alt={title}
            className="product-image"
            onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x300?text=Image+Not+Found';
            }}
            />
            <div className="product-index">#{index + 1}</div>
        </div>

        <div className="product-info">
            <h2 className="product-title">{title}</h2>
            
            <p className="product-description">
            {description}
            </p>

            <div className="product-footer">
            <span className="product-price">${price.toFixed(2)}</span>
            <button className="add-to-cart-btn" hidden >Add to Cart</button>
            <button 
                className="delete-product-btn" 
                onClick={() => handleDelete(id)} 
                disabled={isDeleting}
                title="Delete product"
                aria-label={`Delete ${title}`}
            >
                
                <FaRegTrashAlt />
            </button>
            </div>
        </div>
        </div>
    )
}

export default ProductCard;