CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0
);

INSERT INTO products (name, price, stock) VALUES
  ('Mechanical Keyboard', 89.99, 12),
  ('Wireless Mouse', 34.50, 30),
  ('USB-C Hub', 45.00, 8),
  ('Laptop Stand', 27.99, 20);
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  total NUMERIC(10,2) NOT NULL,
  item_count INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
