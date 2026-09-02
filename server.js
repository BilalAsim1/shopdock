const express = require("express");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

// Database connection pool. Values come from environment variables,
// with sensible defaults for local development.
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5433,
  user: process.env.DB_USER || "shop",
  password: process.env.DB_PASSWORD || "shoppass",
  database: process.env.DB_NAME || "shopdock",
});

app.get("/", (req, res) => {
  res.send("<h1>ShopDock</h1><p>The store is running!</p>");
});

app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch (err) {
    res.status(500).json({ status: "error", database: "unreachable" });
  }
});

// List all products from the database
app.get("/api/products", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Get one product by id
app.get("/api/products/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products WHERE id = $1",
      [parseInt(req.params.id)]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(PORT, () => {
  console.log(`ShopDock running on http://localhost:${PORT}`);
});
