const express = require('express');
const router = express.Router();
const initializeDatabase = require('../../data/utils/initializeDb');
const db = initializeDatabase();
const ROUTES = require('../routes');
const { createProductSchema, updateProductSchema } = require('../schemas');

router.get(ROUTES.PRODUCTS, (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;
    const order = req.query.order?.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    // Get total count
    db.get('SELECT COUNT(*) as total FROM products WHERE isDeleted = 0', (err, countResult) => {
        if (err) {
            console.error('Failed to count products', err);
            return res.status(500).json({ error: 'Failed to load products' });
        }

        const total = countResult.total;
        const totalPages = Math.ceil(total / limit);

        // Get paginated products with ordering
        db.all(
            `SELECT * FROM products WHERE isDeleted = 0 ORDER BY id ${order} LIMIT ? OFFSET ?`,
            [limit, offset],
            (err, rows) => {
                if (err) {
                    console.error('Failed to query products', err);
                    return res.status(500).json({ error: 'Failed to load products' });
                }
                res.json({
                    products: rows,
                    pagination: {
                        page,
                        limit,
                        total,
                        totalPages,
                        order
                    }
                });
            }
        );
    });
});

router.post(ROUTES.PRODUCTS, (req, res) => {
    const result = createProductSchema.safeParse(req.body);
    
    if (!result.success) {
        return res.status(400).json({ 
            error: 'Validation failed', 
            details: result.error.issues.map(e => ({
                field: e.path.join('.'),
                message: e.message
            }))
        });
    }

    const { title, description, price, photo } = result.data;

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

router.put(ROUTES.PRODUCTS + '/:id', (req, res) => {
    const productId = req.params.id;
    
    // Validate request body using Zod schema
    const result = updateProductSchema.safeParse(req.body);
    
    if (!result.success) {
        return res.status(400).json({ 
            error: 'Validation failed', 
            details: result.error.issues.map(e => ({
                field: e.path.join('.'),
                message: e.message
            }))
        });
    }

    const { title, description, price, photo } = result.data;

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

router.delete(ROUTES.PRODUCTS + '/:id', (req, res) => {
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

module.exports = { router, db };