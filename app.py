import os
import sqlite3
from datetime import datetime, timedelta

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

# Optional: Twilio for SMS
from twilio.rest import Client


# ---------------- CONFIG ----------------

DB_PATH = os.environ.get("DB_PATH", "inventory.db")

# Twilio (SMS) config (set in Railway Variables)
TWILIO_SID = os.environ.get("TWILIO_ACCOUNT_SID", "")
TWILIO_TOKEN = os.environ.get("TWILIO_AUTH_TOKEN", "")
TWILIO_FROM = os.environ.get("TWILIO_FROM_NUMBER", "")

SHOP_ALERT_NUMBERS = {
    "glory": os.environ.get("SHOP_GLORY_TO", ""),
    "footwear": os.environ.get("SHOP_FOOTWEAR_TO", "")
}

ALERT_COOLDOWN_MINUTES = int(os.environ.get("ALERT_COOLDOWN_MINUTES", "60"))

# ---------------- APP INIT ----------------

app = Flask(__name__)
CORS(app)


# ---------------- DATABASE ----------------

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            shop_name TEXT NOT NULL,
            sku TEXT NOT NULL UNIQUE,
            name TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            reorder_threshold INTEGER NOT NULL,
            last_alert_at TEXT
        )
        """
    )
    conn.commit()
    conn.close()


# ---------------- SMS LOGIC ----------------

def send_sms(to_number: str, product_name: str, current_qty: int, shop_name: str):
    if not (TWILIO_SID and TWILIO_TOKEN and TWILIO_FROM and to_number):
        print("[SMS] Skipped (Twilio not configured)")
        return

    message = (
        "⚠️ LOW STOCK ALERT\n"
        f"Shop: {shop_name}\n"
        f"Product: {product_name}\n"
        f"Available: {current_qty}\n\n"
        "Please restock soon."
    )

    try:
        client = Client(TWILIO_SID, TWILIO_TOKEN)
        client.messages.create(
            to=to_number,
            from_=TWILIO_FROM,
            body=message
        )
        print("[SMS] Low-stock alert sent")
    except Exception as e:
        print("[SMS ERROR]", e)


def maybe_alert_low_stock(product):
    qty = product["quantity"]
    thr = product["reorder_threshold"]

    if qty > thr:
        return

    shop = product["shop_name"]
    sku = product["sku"]
    name = product["name"]
    to = SHOP_ALERT_NUMBERS.get(shop, "")

    now = datetime.utcnow()
    last = product["last_alert_at"]

    if last:
        try:
            last_dt = datetime.fromisoformat(last)
            if now - last_dt < timedelta(minutes=ALERT_COOLDOWN_MINUTES):
                return
        except Exception:
            pass
    print("[DEBUG] SENDING ALERT TO:", to)

    send_sms(to, name, qty, shop)

    conn = get_db()
    conn.execute(
        "UPDATE products SET last_alert_at=? WHERE sku=?",
        (now.isoformat(timespec="seconds"), sku)
    )
    conn.commit()
    conn.close()


# ---------------- FRONTEND ROUTES ----------------

@app.route("/")
def home():
    return send_from_directory(".", "shop.html")


@app.route("/stationary")
def stationary_page():
    return send_from_directory(".", "stationary.html")


@app.route("/app.js")
def serve_js():
    return send_from_directory(".", "app.js")


@app.route("/<path:filename>")
def serve_static(filename):
    return send_from_directory(".", filename)


# ---------------- API ROUTES ----------------

@app.route("/api/products", methods=["GET"])
def list_products():
    conn = get_db()
    rows = conn.execute(
        "SELECT shop_name, sku, name, quantity, reorder_threshold, last_alert_at FROM products ORDER BY name"
    ).fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


@app.route("/api/products", methods=["POST"])
def create_product():
    data = request.get_json(force=True)

    required = ["shop_name", "sku", "name", "quantity", "reorder_threshold"]
    for field in required:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    try:
        conn = get_db()
        conn.execute(
            """
            INSERT INTO products (shop_name, sku, name, quantity, reorder_threshold, last_alert_at)
            VALUES (?, ?, ?, ?, ?, NULL)
            """,
            (
                data["shop_name"],
                data["sku"],
                data["name"],
                int(data["quantity"]),
                int(data["reorder_threshold"]),
            ),
        )
        conn.commit()

        row = conn.execute(
            "SELECT * FROM products WHERE sku=?",
            (data["sku"],)
        ).fetchone()

        conn.close()
        maybe_alert_low_stock(dict(row))

        return jsonify({"status": "ok"}), 201

    except sqlite3.IntegrityError:
        return jsonify({"error": "SKU already exists"}), 409


@app.route("/api/products/<sku>/adjust", methods=["POST"])
def adjust_quantity(sku):
    data = request.get_json(force=True)
    delta = int(data.get("delta", 0))

    conn = get_db()
    row = conn.execute(
        "SELECT * FROM products WHERE sku=?",
        (sku,)
    ).fetchone()

    if not row:
        conn.close()
        return jsonify({"error": "SKU not found"}), 404

    new_qty = max(row["quantity"] + delta, 0)

    conn.execute(
        "UPDATE products SET quantity=? WHERE sku=?",
        (new_qty, sku)
    )
    conn.commit()
    print("[DEBUG] Adjusted", sku, "→", new_qty)   # <---

    row = conn.execute(
        "SELECT * FROM products WHERE sku=?",
        (sku,)
    ).fetchone()

    conn.close()
    maybe_alert_low_stock(dict(row))

    return jsonify({"status": "ok", "sku": sku, "quantity": new_qty})

@app.route("/api/products/<sku>/update", methods=["POST"])
def update_product(sku):
    data = request.get_json(force=True)

    conn = get_db()
    conn.execute(
        "UPDATE products SET name=?, reorder_threshold=? WHERE sku=?",
        (data.get("name"), int(data.get("reorder_threshold", 5)), sku)
    )
    conn.commit()
    conn.close()

    return jsonify({"status": "updated"})

@app.route("/api/close-shop", methods=["POST"])
def close_shop():
    data = request.get_json(force=True)

    shop_name = data.get("shop_name", "unknown")
    revenue = data.get("revenue", 0)

    history = data.get("aadhaar_history", [])

    # Build Aadhaar lines
    aadhaar_lines = "\n".join([
        f"{h.get('type')} | ₹{h.get('amount')} | {h.get('employee')}"
        for h in history
    ]) or "No Aadhaar payments"

    to_number = SHOP_ALERT_NUMBERS.get(shop_name, "")

    message = (
        "🛍 SHOP CLOSED SUMMARY\n"
        f"Shop: {shop_name}\n"
        f"Revenue: ₹{revenue}\n\n"
        "🆔 Aadhaar Payments\n"
        f"{aadhaar_lines}"
    )

    if to_number and TWILIO_SID and TWILIO_TOKEN and TWILIO_FROM:
        try:
            client = Client(TWILIO_SID, TWILIO_TOKEN)
            client.messages.create(
                to=to_number,
                from_=TWILIO_FROM,
                body=message
            )
            print("[SMS] Close-shop SMS sent")
        except Exception as e:
            print("[SMS ERROR]", e)

    return jsonify({"status":"ok"})

# ---------------- MAIN (Railway) ----------------

if __name__ == "__main__":
    init_db()
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port)
