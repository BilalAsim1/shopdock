const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json()); // parse JSON request bodies

// Temporary in-memory product data (replaced by Postgres in Step 3)
const products = [
  { id: 1, name: "Mechanical Keyboard", price: 89.99, stock: 12 },
  { id: 2, name: "Wireless Mouse", price: 34.5, stock: 30 },
  { id: 3, name: "USB-C Hub", price: 45.0, stock: 8 },
  { id: 4, name: "Laptop Stand", price: 27.99, stock: 20 },
];

app.get("/", (req, res) => {
  res.send("<h1>ShopDock</h1><p>The store is running!</p>");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// List all products
app.get("/api/products", (req, res) => {
  res.json(products);
});

// Get one product by id
app.get("/api/products/:id", (req, res) => {
  const product = products.find((p) => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json(product);
});

app.listen(PORT, () => {
  console.log(`ShopDock running on http://localhost:${PORT}`);
});
