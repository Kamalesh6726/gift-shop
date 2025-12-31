/*************************************************
 * FRIENDZ STATIONERY – FINAL app.js (STABLE)
 *************************************************/
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
  { name:"Exam Pad", price:80, qty:15, sales:[] },

  { name:"Stapler", price:70, qty:10, sales:[] },
  { name:"Stapler Pin", price:20, qty:25, sales:[] },
  { name:"Scissor", price:40, qty:15, sales:[] },
  { name:"Fevicol", price:25, qty:30, sales:[] },
  { name:"Feviquick", price:20, qty:20, sales:[] },
  { name:"Double Side Tape", price:30, qty:20, sales:[] },
  { name:"Colour Tape", price:25, qty:20, sales:[] },
  { name:"Tape Roll", price:20, qty:25, sales:[] },
  { name:"Office Cover", price:50, qty:15, sales:[] },

  { name:"Keychain", price:25, qty:30, sales:[] },
  { name:"Camera Keychain", price:40, qty:20, sales:[] },
  { name:"Gift Paper", price:15, qty:40, sales:[] },
  { name:"Gift Pack", price:50, qty:20, sales:[] },
  { name:"Gifts", price:100, qty:10, sales:[] },
  { name:"Toys", price:120, qty:10, sales:[] },
  { name:"Teddy", price:300, qty:5, sales:[] },
  { name:"Naruto Card", price:20, qty:50, sales:[] },
  { name:"Magical Slate", price:90, qty:10, sales:[] },
  { name:"Friendship Band", price:20, qty:40, sales:[] },
  { name:"High Bouncing Ball", price:25, qty:30, sales:[] },
  { name:"Light Pamparam", price:40, qty:15, sales:[] },
  { name:"Light Toys", price:60, qty:15, sales:[] },

  { name:"Hair Band", price:20, qty:40, sales:[] },
  { name:"Lip Balm", price:35, qty:20, sales:[] },
  { name:"Nail Polish", price:30, qty:25, sales:[] },
  { name:"Clip", price:10, qty:50, sales:[] },
  { name:"Light Clip", price:20, qty:25, sales:[] },
  { name:"Rose Clip", price:25, qty:20, sales:[] },
  { name:"Earrings", price:40, qty:30, sales:[] },
  { name:"Gents Ring", price:50, qty:20, sales:[] },
  { name:"Girls Ring", price:50, qty:20, sales:[] },
  { name:"Chain", price:80, qty:10, sales:[] },
  { name:"Hand Chain", price:60, qty:15, sales:[] },
  { name:"Kadukan (Boys)", price:50, qty:15, sales:[] },
  { name:"Pottu", price:10, qty:30, sales:[] },
  { name:"Santhu Pottu", price:15, qty:25, sales:[] },

  { name:"Charger", price:150, qty:10, sales:[] },
  { name:"OTG Cable", price:120, qty:8, sales:[] },
  { name:"Headset", price:250, qty:5, sales:[] },
  { name:"Phone Cover", price:150, qty:10, sales:[] },
  { name:"Memory Card", price:300, qty:5, sales:[] },
  { name:"HW Battery", price:40, qty:20, sales:[] },
  { name:"Remote Battery", price:40, qty:20, sales:[] },
  { name:"Battery Fan", price:90, qty:12, sales:[] },
  { name:"Light Watch", price:120, qty:10, sales:[] },
  { name:"Water Bottle", price:120, qty:10, sales:[] }
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
    const pin = prompt("Enter PIN to view Profit");
    if (pin !== PROFIT_PIN) return alert("Wrong PIN");
  }

  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
  document.getElementById(id)?.classList.remove("hidden");
  if (id === "aadhar") renderAadhaarPayments();
  if (id === "items") renderItems();
  if (id === "dashboard") updateDashboard();
  if (id === "profit") setTimeout(renderMonthlyProfitChart, 150);
  
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
  items[i].sales.push({ date: new Date().toISOString().split("T")[0], amount: items[i].price });
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
  totalSales.textContent = "₹" + items.reduce((s,p)=>s+p.sales.reduce((x,y)=>x+y.amount,0),0);
}

/* ================= PROFIT GRAPH ================= */
let chart;
function renderMonthlyProfitChart() {
  const ctx = document.getElementById("monthlyProfitChart")?.getContext("2d");
  if (!ctx) return;

  const data = Array(12).fill(0);
  items.forEach(i=>i.sales.forEach(s=>data[new Date(s.date).getMonth()]+=s.amount));

  if (chart) chart.destroy();
  chart = new Chart(ctx,{
    type:"bar",
    data:{labels:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    datasets:[{label:"Monthly Profit (₹)",data,backgroundColor:"#4f46e5"}]},
    options:{responsive:true,scales:{y:{beginAtZero:true}}}
  });
}

/* ================= CLOSE SHOP ================= */
function closeShop() {
  const today = new Date().toISOString().split("T")[0];
  let total = 0;
  items.forEach(i=>i.sales.forEach(s=>{ if(s.date===today) total+=s.amount; }));
  alert(`SHOP CLOSED\nDate: ${today}\nRevenue: ₹${total}`);

  fetch("http://127.0.0.1:5000/api/close-shop",{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({ total })
  });
}

/* ================= INIT ================= */
document.addEventListener("DOMContentLoaded",()=>{
  renderItems();
  updateDashboard();
});
const AADHAAR_KEY = "aadhaar_payments";

function saveAadhaarPayment() {
  const aadhaar = aadhaarNumber.value.trim();
  const amount = +aadhaarAmount.value;
  const ref = aadhaarRef.value.trim();

  if (!aadhaar || !amount) {
    alert("Enter Aadhaar number and amount");
    return;
  }

  let records = JSON.parse(localStorage.getItem(AADHAAR_KEY)) || [];

  records.push({
    aadhaar: aadhaar.replace(/\d(?=\d{4})/g, "X"), // mask Aadhaar
    amount,
    ref,
    date: new Date().toLocaleString()
  });

  localStorage.setItem(AADHAAR_KEY, JSON.stringify(records));

  aadhaarNumber.value = "";
  aadhaarAmount.value = "";
  aadhaarRef.value = "";

  renderAadhaarPayments();
}

function renderAadhaarPayments() {
  const box = document.getElementById("aadhaarHistory");
  if (!box) return;

  const records = JSON.parse(localStorage.getItem(AADHAAR_KEY)) || [];
  box.innerHTML = "";

  records.forEach(r => {
    box.innerHTML += `
      <div class="card">
        <p>🆔 ${r.aadhaar}</p>
        <p>₹${r.amount}</p>
        <p>${r.ref || "—"}</p>
        <p>${r.date}</p>
      </div>
    `;
  });
}

