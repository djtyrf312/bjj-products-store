const express = require('express');
const router = express.Router();
const initializeDatabase = require('../data/utils/initializeDb');
const db = initializeDatabase();

const productsRoute = '/api/products';

router.get(productsRoute, (req, res) => {
    db.all('SELECT * FROM products ORDER BY id', (err, rows) => {
        if (err) {
            console.error('Failed to query products', err);
            return res.status(500).json({ error: 'Failed to load products' });
        }
        res.json(rows);
    });
});

router.delete(productsRoute + '/:id', (req, res) => {
    const productId = req.params.id;
    
    db.run(`UPDATE products SET isDeleted = 1 WHERE id = ?`, [productId], function(err) {
        if (err) {
            console.error('Failed to delete product', err);
            return res.status(500).json({ error: 'Failed to delete product' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.sendStatus(204);
    });
});

module.exports = router;