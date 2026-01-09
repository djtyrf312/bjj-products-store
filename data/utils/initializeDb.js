
const path = require('path');
const DB_PATH = path.join('data', 'products.db');
const fs = require('fs');
const JSON_SEED_PATH = path.join('public', 'bjj-products.json');
const sqlite3 = require('sqlite3').verbose();

console.log(JSON_SEED_PATH);

function initializeDatabase() {
  ensureDbDir();
  const db = new sqlite3.Database(DB_PATH);

  db.serialize(() => {
    db.run(
      `CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        price REAL NOT NULL,
        photo TEXT NOT NULL,
        isDeleted INT NOT NULL DEFAULT 0
      )`
    );

    db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
      if (err) {
        console.error('Error counting products', err);
        return;
      }

      if (row.count === 0) {
        const products = getSeedData();
        const stmt = db.prepare(
          'INSERT INTO products (id, title, description, price, photo, isDeleted) VALUES (?, ?, ?, ?, ?, ?)'
        );
        products.forEach((p) => {
          stmt.run(p.id, p.title, p.description, p.price, p.photo, p.isDeleted);
        });
        stmt.finalize();
        console.log(`Seeded database with ${products.length} products`);
      }
    });
  });

  return db;
}

function ensureDbDir() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function getSeedData() {
  if (!fs.existsSync(JSON_SEED_PATH)) {
    throw new Error(`Seed file missing at ${JSON_SEED_PATH}`);
  }
  const raw = fs.readFileSync(JSON_SEED_PATH, 'utf-8');
  const parsed = JSON.parse(raw);
  if (!parsed.products || !Array.isArray(parsed.products)) {
    throw new Error('Seed file missing products array');
  }
  return parsed.products;
}

module.exports = initializeDatabase;