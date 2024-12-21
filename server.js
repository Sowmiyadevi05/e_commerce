const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Gsd@7233',
    database: process.env.DB_NAME || 'e_commerce',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Endpoint to fetch all products
app.get('/products', (req, res) => {
    pool.query('SELECT * FROM products', (err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// Endpoint to fetch a product by ID
app.get('/products/:id', (req, res) => {
    const { id } = req.params;
    pool.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Error fetching product by ID:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(results[0]);
    });
});

// Endpoint to add a new product
app.post('/products', (req, res) => {
    const { name, ImageURL, PRICE, discount } = req.body;
    if (!name || !ImageURL || !PRICE || discount == null) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    pool.query(
        'INSERT INTO products (name, ImageURL, PRICE, discount) VALUES (?, ?, ?, ?)',
        [name, ImageURL, PRICE, discount],
        (err, results) => {
            if (err) {
                console.error('Error adding product:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.status(201).json({
                id: results.insertId,
                name,
                ImageURL,
                PRICE,
                discount
            });
        }
    );
});

// Endpoint to update a product
app.put('/products/:id', (req, res) => {
    const { id } = req.params;
    const { name, ImageURL, PRICE, discount } = req.body;
    if (!name || !ImageURL || !PRICE || discount == null) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    pool.query(
        'UPDATE products SET name = ?, ImageURL = ?, PRICE = ?, discount = ? WHERE id = ?',
        [name, ImageURL, PRICE, discount, id],
        (err, results) => {
            if (err) {
                console.error('Error updating product:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Product not found' });
            }
            res.json({ message: 'Product updated successfully' });
        }
    );
});

// Endpoint to delete a product
app.delete('/products/:id', (req, res) => {
    const { id } = req.params;
    pool.query('DELETE FROM products WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Error deleting product:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${3000}`);
});