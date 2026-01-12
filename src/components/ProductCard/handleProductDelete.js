import { toast } from 'react-toastify';

const handleDelete = async (productId, setIsDeleting, onDelete) => {
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

export { handleDelete };
