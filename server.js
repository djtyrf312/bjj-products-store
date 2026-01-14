const express = require('express');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const PORT = process.env.PORT || 4000;
const productsRouter = require('./routes/products');
// const DB_PATH = path.join(__dirname, 'data', 'products.db');
// const JSON_SEED_PATH = path.join(__dirname, 'public', 'bjj-products.json');

// function ensureDbDir() {
//   const dir = path.dirname(DB_PATH);
//   if (!fs.existsSync(dir)) {
//     fs.mkdirSync(dir, { recursive: true });
//   }
// }

// function getSeedData() {
//   if (!fs.existsSync(JSON_SEED_PATH)) {
//     throw new Error(`Seed file missing at ${JSON_SEED_PATH}`);
//   }
//   const raw = fs.readFileSync(JSON_SEED_PATH, 'utf-8');
//   const parsed = JSON.parse(raw);
//   if (!parsed.products || !Array.isArray(parsed.products)) {
//     throw new Error('Seed file missing products array');
//   }
//   return parsed.products;
// }

// function initializeDatabase() {
//   ensureDbDir();
//   const db = new sqlite3.Database(DB_PATH);

//   db.serialize(() => {
//     db.run(
//       `CREATE TABLE IF NOT EXISTS products (
//         id INTEGER PRIMARY KEY,
//         title TEXT NOT NULL,
//         description TEXT NOT NULL,
//         price REAL NOT NULL,
//         photo TEXT NOT NULL
//       )`
//     );

//     db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
//       if (err) {
//         console.error('Error counting products', err);
//         return;
//       }

//       if (row.count === 0) {
//         const products = getSeedData();
//         const stmt = db.prepare(
//           'INSERT INTO products (id, title, description, price, photo) VALUES (?, ?, ?, ?, ?)'
//         );
//         products.forEach((p) => {
//           stmt.run(p.id, p.title, p.description, p.price, p.photo);
//         });
//         stmt.finalize();
//         console.log(`Seeded database with ${products.length} products`);
//       }
//     });
//   });

//   return db;
// }

// const db = initializeDatabase();
const app = express();

app.use(cors());
app.use(express.json()); // Parse JSON request bodies
app.use(productsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
