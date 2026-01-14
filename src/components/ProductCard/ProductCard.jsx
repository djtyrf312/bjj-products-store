import React, { useState } from 'react';
import './ProductCard.css';
import { FaRegTrashAlt } from "react-icons/fa";
import { handleDelete } from './handleProductDelete';
import { Button } from '@mui/material';


const ProductCard = ({ onDelete, productItem, index }) => {
    const { id, photo, title, description, price } = productItem;
    const [isDeleting, setIsDeleting] = useState(false);

    // Determine if photo is a full URL or just a filename
    const imageSource = photo.startsWith('http://') || photo.startsWith('https://') 
        ? photo 
        : `/images/${photo}`;

    return (
        <div key={id} className="product-card">
        <div className="product-image-container">
            <img 
            src={imageSource} 
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
            <Button 
                variant="contained"
                color="primary"
                onClick={() => handleDelete(id, setIsDeleting, onDelete)}
                disabled={isDeleting}
                title="Delete product"
                aria-label={`Delete ${title}`}
                className='delete-product-btn'
            >
                <FaRegTrashAlt />
            </Button>
            </div>
        </div>
        </div>
    )
}

export default ProductCard;