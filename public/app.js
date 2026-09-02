let cart = [];

// Fetch products from the API and render them as cards
async function loadProducts() {
  const res = await fetch("/api/products");
  const products = await res.json();
  const list = document.getElementById("product-list");
  list.innerHTML = "";
  products.forEach((p) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${p.name}</h3>
      <p class="price">$${Number(p.price).toFixed(2)}</p>
      <p class="stock">${p.stock} in stock</p>
      <button>Add to cart</button>
    `;
    card.querySelector("button").addEventListener("click", () => addToCart(p));
    list.appendChild(card);
  });
}

function addToCart(product) {
  cart.push(product);
  renderCart();
}

function renderCart() {
  const items = document.getElementById("cart-items");
  items.innerHTML = "";
  let total = 0;
  cart.forEach((p, i) => {
    total += Number(p.price);
    const li = document.createElement("li");
    li.innerHTML = `<span>${p.name}</span><span>$${Number(p.price).toFixed(2)}</span>`;
    items.appendChild(li);
  });
  document.getElementById("cart-count").textContent = cart.length;
  document.getElementById("cart-total").textContent = total.toFixed(2);
}

document.getElementById("checkout-btn").addEventListener("click", async () => {
  if (cart.length === 0) {
    document.getElementById("checkout-msg").textContent = "Your cart is empty.";
    return;
  }
  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items: cart.map((p) => p.id) }),
  });
  const data = await res.json();
  document.getElementById("checkout-msg").textContent = data.message;
  cart = [];
  renderCart();
});

loadProducts();
