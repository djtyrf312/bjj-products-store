const express = require('express');
const cors = require('cors');

const PORT = process.env.PORT || 4000;
const productsRouter = require('./routes/products');
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
