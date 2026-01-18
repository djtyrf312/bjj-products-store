const express = require('express');
const router = express.Router();
const initializeDatabase = require('../data/utils/initializeDb');
const db = initializeDatabase();

const productsUrl = '/api/products';

router.get(productsUrl, (req, res) => {
    db.all('SELECT * FROM products WHERE isDeleted = 0 ORDER BY id', (err, rows) => {
        if (err) {
            console.error('Failed to query products', err);
            return res.status(500).json({ error: 'Failed to load products' });
        }
        res.json(rows);
    });
});

router.post(productsUrl, (req, res) => {
    const { title, description, price, photo } = req.body;

    // Validate required fields
    if (!title || !description || !price || !photo) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate price is a number
    if (isNaN(price) || price <= 0) {
        return res.status(400).json({ error: 'Price must be a positive number' });
    }

    db.run(
        `INSERT INTO products (title, description, price, photo, isDeleted) VALUES (?, ?, ?, ?, 0)`,
        [title, description, price, photo],
        function(err) {
            if (err) {
                console.error('Failed to create product', err);
                return res.status(500).json({ error: 'Failed to create product' });
            }

            // Return the newly created product
            db.get('SELECT * FROM products WHERE id = ?', [this.lastID], (err, row) => {
                if (err) {
                    console.error('Failed to fetch created product', err);
                    return res.status(500).json({ error: 'Product created but failed to fetch' });
                }
                res.status(201).json(row);
            });
        }
    );
});

router.put(productsUrl + '/:id', (req, res) => {
    const productId = req.params.id;
    const { title, description, price, photo } = req.body;

    // Validate required fields
    if (!title || !description || !price || !photo) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate price is a number
    if (isNaN(price) || price <= 0) {
        return res.status(400).json({ error: 'Price must be a positive number' });
    }

    db.run(
        `UPDATE products SET title = ?, description = ?, price = ?, photo = ? WHERE id = ? AND isDeleted = 0`,
        [title, description, price, photo, productId],
        function(err) {
            if (err) {
                console.error('Failed to update product', err);
                return res.status(500).json({ error: 'Failed to update product' });
            }

            if (this.changes === 0) {
                return res.status(404).json({ error: 'Product not found' });
            }

            // Return the updated product
            db.get('SELECT * FROM products WHERE id = ?', [productId], (err, row) => {
                if (err) {
                    console.error('Failed to fetch updated product', err);
                    return res.status(500).json({ error: 'Product updated but failed to fetch' });
                }
                res.json(row);
            });
        }
    );
});

router.delete(productsUrl + '/:id', (req, res) => {
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

module.exports = {router, productsUrl};