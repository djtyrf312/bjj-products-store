import { useState, useRef, useEffect } from 'react';
import './ProductCard.css';
import { FaRegTrashAlt, FaEllipsisV, FaEdit } from "react-icons/fa";
import { handleDelete } from './handleProductDelete';


const ProductCard = ({ onDelete, onEdit, productItem, index }) => {
    const { id, photo, title, description, price } = productItem;
    const [isDeleting, setIsDeleting] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        if (menuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuOpen]);

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
            <div className="kebab-menu" ref={menuRef}>
                <button 
                    className="kebab-button"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Product options"
                >
                    <FaEllipsisV />
                </button>
                {menuOpen && (
                    <div className="kebab-dropdown">
                        <button 
                            className="kebab-option"
                            onClick={() => {
                                setMenuOpen(false);
                                onEdit(productItem);
                            }}
                        >
                            <FaEdit /> Edit
                        </button>
                        <button 
                            className="kebab-option delete"
                            onClick={() => {
                                setMenuOpen(false);
                                handleDelete(id, setIsDeleting, onDelete);
                            }}
                            disabled={isDeleting}
                        >
                            <FaRegTrashAlt /> Delete
                        </button>
                    </div>
                )}
            </div>
        </div>

        <div className="product-info">
            <h2 className="product-title">{title}</h2>
            
            <p className="product-description">
            {description}
            </p>

            <div className="product-footer">
            <span className="product-price">${price.toFixed(2)}</span>
            <button className="add-to-cart-btn" hidden >Add to Cart</button>
            </div>
        </div>
        </div>
    )
}

export default ProductCard;