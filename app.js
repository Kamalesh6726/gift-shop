/*************************************************
 * FRIENDZ STATIONERY – FINAL app.js
 * Frontend: Vercel / Netlify
 * Backend: Render
 *************************************************/

// ✅ YOUR RENDER BACKEND URL
const API_BASE = "https://gift-shop-1-jpqm.onrender.com";

const STORAGE_KEY = "friendz_items";
const PROFIT_PIN = "1234";

/* ================= DEFAULT INVENTORY ================= */
const DEFAULT_PRODUCTS = [
  { name: "XO Pen Blue", price: 10, qty: 50, sales: [] },
  { name: "XO Pen Black", price: 10, qty: 50, sales: [] },
  { name: "Supra Slider Blue Pen", price: 15, qty: 40, sales: [] },
  { name: "Reynolds Vista Blue Pen", price: 15, qty: 40, sales: [] },
  { name: "XO Glow Pen Blue", price: 20, qty: 30, sales: [] },
  { name: "XO Glow Pen Black", price: 20, qty: 30, sales: [] },
  { name: "XO Glow Pen Red", price: 20, qty: 30, sales: [] },
  { name: "Gents Ring", price: 150, qty: 15, sales: [] },
  { name: "Girls Ring", price: 120, qty: 20, sales: [] },
  { name: "Earrings", price: 100, qty: 25, sales: [] },
  { name: "Clip", price: 10, qty: 50, sales: [] },
  { name: "Nail Polish", price: 50, qty: 30, sales: [] },
  { name: "Hair Band", price: 15, qty: 40, sales: [] },
  { name: "Lip Balm", price: 25, qty: 50, sales: [] },
  { name: "Keychain", price: 30, qty: 40, sales: [] },
  { name: "Eraser", price: 5, qty: 100, sales: [] },
  { name: "Sharpener", price: 10, qty: 60, sales: [] },
  { name: "Kadukan (Boys)", price: 50, qty: 30, sales: [] },
  { name: "Chain", price: 100, qty: 20, sales: [] },
  { name: "Hand Chain", price: 120, qty: 20, sales: [] },
  { name: "Reynolds 045 Blue Pen", price: 10, qty: 50, sales: [] },
  { name: "Charger", price: 300, qty: 10, sales: [] },
  { name: "HW Battery", price: 50, qty: 30, sales: [] },
  { name: "Scale", price: 15, qty: 40, sales: [] },
  { name: "Light Watch", price: 250, qty: 10, sales: [] },
  { name: "Camera Keychain", price: 50, qty: 25, sales: [] },
  { name: "Highlighter", price: 30, qty: 20, sales: [] },
  { name: "Balloon", price: 5, qty: 200, sales: [] },
  { name: "Bubbles Water", price: 30, qty: 30, sales: [] },
  { name: "Cockroach & Ant Killer", price: 80, qty: 20, sales: [] },
  { name: "Naruto Card", price: 10, qty: 50, sales: [] },
  { name: "Pencil", price: 5, qty: 100, sales: [] },
  { name: "Wooden Scale", price: 20, qty: 30, sales: [] },
  { name: "Tip", price: 5, qty: 80, sales: [] },
  { name: "Marker", price: 30, qty: 25, sales: [] },
  { name: "Geometry Box", price: 120, qty: 15, sales: [] },
  { name: "Sketch Book", price: 80, qty: 20, sales: [] },
  { name: "Crayons", price: 60, qty: 15, sales: [] },
  { name: "3D Gum", price: 5, qty: 50, sales: [] },
  { name: "Tape Roll", price: 40, qty: 30, sales: [] },
  { name: "Stapler", price: 120, qty: 10, sales: [] },
  { name: "Stapler Pins", price: 25, qty: 40, sales: [] },
  { name: "Whitener", price: 30, qty: 20, sales: [] },
  { name: "Fevicol", price: 25, qty: 30, sales: [] },
  { name: "Double Side Tape", price: 40, qty: 25, sales: [] },
  { name: "Color Tape", price: 30, qty: 30, sales: [] },
  { name: "Scissors", price: 60, qty: 20, sales: [] },
  { name: "Notebook", price: 50, qty: 30, sales: [] },
  { name: "Map", price: 20, qty: 25, sales: [] },
  { name: "File", price: 40, qty: 20, sales: [] },
  { name: "Seepu", price: 15, qty: 40, sales: [] },
  { name: "Brown Sheet", price: 10, qty: 40, sales: [] },
  { name: "Chat", price: 5, qty: 100, sales: [] },
  { name: "Gift Paper", price: 20, qty: 50, sales: [] },
  { name: "Birthday Decoration", price: 150, qty: 10, sales: [] },
  { name: "Gum", price: 5, qty: 100, sales: [] },
  { name: "Light Rose", price: 100, qty: 15, sales: [] },
  { name: "Pouge", price: 50, qty: 20, sales: [] },
  { name: "Water Bottle", price: 150, qty: 15, sales: [] },
  { name: "Kosuvathi Sticker", price: 10, qty: 50, sales: [] },
  { name: "Gifts", price: 200, qty: 20, sales: [] },
  { name: "Toys", price: 100, qty: 20, sales: [] },
  { name: "Teddy", price: 250, qty: 8, sales: [] },
  { name: "Exam Pad", price: 80, qty: 15, sales: [] },
  { name: "Hanger", price: 50, qty: 20, sales: [] },
  { name: "Headset", price: 400, qty: 8, sales: [] },
  { name: "OTG Cable", price: 150, qty: 20, sales: [] },
  { name: "Phone Cover", price: 150, qty: 15, sales: [] },
  { name: "Battery Fan", price: 250, qty: 10, sales: [] },
  { name: "Pottu", price: 10, qty: 50, sales: [] },
  { name: "Mask", price: 20, qty: 50, sales: [] },
  { name: "Remote Battery", price: 40, qty: 30, sales: [] },
  { name: "Rose Light", price: 100, qty: 15, sales: [] },
  { name: "Bubbles Liquid", price: 30, qty: 30, sales: [] },
  { name: "Smiley Stamp", price: 20, qty: 40, sales: [] },
  { name: "Kulla", price: 10, qty: 50, sales: [] },
  { name: "Light Clip", price: 50, qty: 20, sales: [] },
  { name: "Curshif", price: 15, qty: 30, sales: [] },
  { name: "Rubber Band", price: 5, qty: 100, sales: [] },
  { name: "Cup", price: 50, qty: 20, sales: [] },
  { name: "Santhu Pottu", price: 10, qty: 50, sales: [] },
  { name: "Meen Pen", price: 10, qty: 40, sales: [] },
  { name: "BTS Pen", price: 15, qty: 30, sales: [] },
  { name: "Mani", price: 25, qty: 30, sales: [] },
  { name: "Rose Clip", price: 15, qty: 30, sales: [] },
  { name: "Fountain Pen", price: 50, qty: 10, sales: [] },
  { name: "Cartridge", price: 20, qty: 30, sales: [] },
  { name: "High Bouncing Ball", price: 30, qty: 25, sales: [] },
  { name: "Light Pamparam", price: 50, qty: 20, sales: [] },
  { name: "Light Toys", price: 80, qty: 15, sales: [] },
  { name: "A4 Sheets", price: 120, qty: 10, sales: [] },
  { name: "Magical Slate", price: 200, qty: 10, sales: [] },
  { name: "Friendship Band", price: 30, qty: 30, sales: [] },
  { name: "Gun Pen", price: 25, qty: 20, sales: [] },
  { name: "Kuchi Box", price: 100, qty: 15, sales: [] },
  { name: "Angel (Butterfly Set)", price: 150, qty: 10, sales: [] },
  { name: "Out (Birthday)", price: 100, qty: 10, sales: [] },
  { name: "Air Pump", price: 150, qty: 10, sales: [] },
  { name: "Air Pump (Balloon)", price: 150, qty: 10, sales: [] },
  { name: "Flower Candles & Candles", price: 50, qty: 20, sales: [] },
  { name: "Feviquick", price: 20, qty: 30, sales: [] },
  { name: "Office Cover", price: 50, qty: 20, sales: [] },
  { name: "Ben 10 Scale", price: 25, qty: 20, sales: [] },
  { name: "Gift Pack", price: 200, qty: 10, sales: [] },
  { name: "Memory Card", price: 500, qty: 5, sales: [] },
  { name: "Gel Pen", price: 15, qty: 40, sales: [] },
  { name: "Pikachu Pen", price: 20, qty: 30, sales: [] },
  { name: "Surya Pen", price: 10, qty: 40, sales: [] },
  { name: "Reynolds Pen", price: 10, qty: 40, sales: [] }
];


/* ================= LOAD INVENTORY ================= */
let items = JSON.parse(localStorage.getItem(STORAGE_KEY));
if (!items || items.length === 0) {
  items = DEFAULT_PRODUCTS;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

/* ================= UTIL ================= */
function saveItems() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

/* ================= NAVIGATION ================= */
function showPage(id) {
  if (id === "profit") {
    const pin = prompt("Enter PIN");
    if (pin !== PROFIT_PIN) return alert("Wrong PIN");
  }

  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
  document.getElementById(id)?.classList.remove("hidden");

  if (id === "items") renderItems();
  if (id === "dashboard") updateDashboard();
  if (id === "profit") setTimeout(renderMonthlyProfitChart, 100);
}

/* ================= INVENTORY ================= */
function addItem() {
  const name = itemName.value.trim();
  const price = +itemPrice.value;
  const qty = +itemQty.value;

  if (!name || !price || !qty) return alert("Fill all fields");

  items.push({ name, price, qty, sales: [] });
  saveItems();
  renderItems();
  updateDashboard();

  itemName.value = itemPrice.value = itemQty.value = "";
}

function sellItem(i) {
  if (items[i].qty <= 0) return alert("Out of stock");

  items[i].qty--;
  items[i].sales.push({
    date: new Date().toISOString().split("T")[0],
    amount: items[i].price
  });

  saveItems();
  renderItems();
  updateDashboard();
}

/* ================= RENDER ================= */
function renderItems() {
  const list = document.getElementById("itemsList");
  if (!list) return;

  list.innerHTML = "";
  items.forEach((p, i) => {
    list.innerHTML += `
      <div class="card">
        <h3>${p.name}</h3>
        <p>₹${p.price}</p>
        <p>Qty: ${p.qty}</p>
        <button onclick="sellItem(${i})">Sell</button>
      </div>`;
  });
}

function updateDashboard() {
  totalItems.textContent = items.length;
  totalQty.textContent = items.reduce((a,b)=>a+b.qty,0);
  totalSales.textContent =
    "₹" + items.reduce((s,p)=>s+p.sales.reduce((x,y)=>x+y.amount,0),0);
}

/* ================= PROFIT GRAPH ================= */
let chart;
function renderMonthlyProfitChart() {
  const ctx = document.getElementById("monthlyProfitChart")?.getContext("2d");
  if (!ctx) return;

  const data = Array(12).fill(0);
  items.forEach(i =>
    i.sales.forEach(s =>
      data[new Date(s.date).getMonth()] += s.amount
    )
  );

  if (chart) chart.destroy();
  chart = new Chart(ctx,{
    type:"bar",
    data:{
      labels:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
      datasets:[{ label:"Monthly Profit (₹)", data }]
    },
    options:{ responsive:true, scales:{ y:{ beginAtZero:true } } }
  });
}

/* ================= CLOSE SHOP → BACKEND ================= */
function closeShop() {
  const today = new Date().toISOString().split("T")[0];
  let total = 0;

  items.forEach(i =>
    i.sales.forEach(s => {
      if (s.date === today) total += s.amount;
    })
  );

  alert(`SHOP CLOSED\nDate: ${today}\nRevenue: ₹${total}`);

  fetch(`${API_BASE}/api/close-shop`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ total })
  })
  .then(res => res.json())
  .then(data => console.log("Backend response:", data))
  .catch(err => console.error("Backend error:", err));
}

/* ================= INIT ================= */
document.addEventListener("DOMContentLoaded", () => {
  renderItems();
  updateDashboard();
});



