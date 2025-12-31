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
  { name:"XO Pen Blue", price:10, qty:50, sales:[] },
  { name:"XO Pen Black", price:10, qty:50, sales:[] },
  { name:"Supra Slider Blue Pen", price:15, qty:40, sales:[] },
  { name:"Reynolds Vista Blue Pen", price:15, qty:40, sales:[] },
  { name:"XO Glow Pen Blue", price:20, qty:30, sales:[] },
  { name:"XO Glow Pen Black", price:20, qty:30, sales:[] },
  { name:"XO Glow Pen Red", price:20, qty:30, sales:[] },
  { name:"Reynolds 045 Blue Pen", price:10, qty:50, sales:[] },
  { name:"Meen Pen", price:10, qty:40, sales:[] },
  { name:"BTS Pen", price:15, qty:30, sales:[] },
  { name:"Fountain Pen", price:50, qty:10, sales:[] },
  { name:"Gun Pen", price:25, qty:20, sales:[] },
  { name:"Gel Pen", price:15, qty:40, sales:[] },
  { name:"Pikachu Pen", price:20, qty:30, sales:[] },
  { name:"Surya Pen", price:10, qty:40, sales:[] },
  { name:"Reynolds Pen", price:10, qty:40, sales:[] },
  { name:"Eraser", price:5, qty:100, sales:[] },
  { name:"Sharpener", price:10, qty:60, sales:[] },
  { name:"Scale", price:15, qty:40, sales:[] },
  { name:"Wooden Scale", price:20, qty:30, sales:[] },
  { name:"Pencil", price:5, qty:100, sales:[] },
  { name:"Tip", price:5, qty:80, sales:[] },
  { name:"Marker", price:30, qty:25, sales:[] },
  { name:"Highlighter", price:30, qty:20, sales:[] },
  { name:"Whitener", price:30, qty:20, sales:[] },
  { name:"Crayons", price:60, qty:15, sales:[] },
  { name:"A4 Sheets", price:120, qty:10, sales:[] },
  { name:"Notebook", price:50, qty:30, sales:[] },
  { name:"Map", price:20, qty:25, sales:[] },
  { name:"File", price:40, qty:20, sales:[] },
  { name:"Brown Sheet", price:10, qty:40, sales:[] },
  { name:"Exam Pad", price:80, qty:15, sales:[] }
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

