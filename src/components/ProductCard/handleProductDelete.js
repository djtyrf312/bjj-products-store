import { toast } from 'react-toastify';

const handleDelete = async (productId, setIsDeleting, onDelete) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
        return;
    }

    setIsDeleting(true);

    try {
        const response = await fetch(`api/products/${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Failed to delete product');
        }
        onDelete(productId);
    } catch (err) {
        toast.error(
            `Error deleting product: ${err.message}`,
            { 
                autoClose: 1500,
                hideProgressBar: true
            });
    } finally {
        toast.success('Product deleted successfully', {
            autoClose: 1500,
            hideProgressBar: true
        });
        setIsDeleting(false);
    }
};

export default handleDelete;