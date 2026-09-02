const express = require("express");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.static("public"));
// Database connection pool. Values come from environment variables,
// with sensible defaults for local development.
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5433,
  user: process.env.DB_USER || "shop",
  password: process.env.DB_PASSWORD || "shoppass",
  database: process.env.DB_NAME || "shopdock",
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

// Checkout: verify stock and return an order summary
// Checkout: decrement stock and record the order — atomically
app.post("/api/checkout", async (req, res) => {
  const { items } = req.body;
  if (!items || items.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Total the order
    const totalResult = await client.query(
      "SELECT SUM(price) AS total FROM products WHERE id = ANY($1)",
      [items]
    );
    const total = Number(totalResult.rows[0].total || 0).toFixed(2);

    // Decrement stock for each purchased item, guarding against overselling
    for (const id of items) {
      const upd = await client.query(
        "UPDATE products SET stock = stock - 1 WHERE id = $1 AND stock > 0 RETURNING id",
        [id]
      );
      if (upd.rowCount === 0) {
        throw new Error(`Product ${id} is out of stock`);
      }
    }

    // Record the order
    const order = await client.query(
      "INSERT INTO orders (total, item_count) VALUES ($1, $2) RETURNING id",
      [total, items.length]
    );

    await client.query("COMMIT");
    res.json({
      message: `Order #${order.rows[0].id} placed! Total: $${total} for ${items.length} item(s).`,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(400).json({ message: err.message || "Checkout failed" });
  } finally {
    client.release();
  }
});
