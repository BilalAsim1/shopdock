const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("<h1>ShopDock</h1><p>The store is running!</p>");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`ShopDock running on http://localhost:${PORT}`);
});
