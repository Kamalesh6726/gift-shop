import os
import sqlite3
from datetime import datetime, timedelta
from flask import Flask, request, jsonify
from flask_cors import CORS

# Optional: Twilio for SMS
# pip install twilio
from twilio.rest import Client

DB_PATH = os.environ.get("DB_PATH", "inventory.db")

# --- SMS config ---
TWILIO_SID = os.environ.get("TWILIO_ACCOUNT_SID", "")
TWILIO_TOKEN = os.environ.get("TWILIO_AUTH_TOKEN", "")
TWILIO_FROM = os.environ.get("TWILIO_FROM_NUMBER", "")

# Per-shop recipient numbers (edit to your needs)
SHOP_ALERT_NUMBERS = {
    "glory": os.environ.get("SHOP_GLORY_TO", ""),     # e.g. +91XXXXXXXXXX
    "footwear": os.environ.get("SHOP_FOOTWEAR_TO", "")# e.g. +91XXXXXXXXXX
}

# throttle alerts to avoid spam (per SKU)
ALERT_COOLDOWN_MINUTES = int(os.environ.get("ALERT_COOLDOWN_MINUTES", "60"))

app = Flask(__name__)
CORS(app)


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
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


from twilio.rest import Client

def send_sms(to_number: str, product_name: str, current_qty: int):
    """
    Sends low stock SMS alert.
    Requires TWILIO_* env vars and 'to_number' to be set.
    """

    if not (TWILIO_SID and TWILIO_TOKEN and TWILIO_FROM and to_number):
        # Skip safely if misconfigured
        print("[SMS] Skipped: Twilio/recipient not configured.")
        return

    # ✅ Final SMS message format
    message = (
        "⚠️ Low Stock Alert\n\n"
        f"Product: {product_name}\n"
        f"Available Quantity: {current_qty}\n\n"
        "Please restock soon."
    )

    try:
        client = Client(TWILIO_SID, TWILIO_TOKEN)
        client.messages.create(
            to=to_number,
            from_=TWILIO_FROM,
            body=message
        )
        print("[SMS] Sent successfully")

    except Exception as e:
        print("[SMS] Error:", e)



def maybe_alert_low_stock(product):
    """
    Send low-stock SMS if quantity <= threshold and we haven't alerted recently.
    """
    qty = product["quantity"]
    thr = product["reorder_threshold"]
    shop = product["shop_name"]
    sku = product["sku"]
    name = product["name"]
    to = SHOP_ALERT_NUMBERS.get(shop)
    if to is None:
        to = ""  # no number configured

    if qty <= thr:
        # check cooldown
        last = product["last_alert_at"]
        now = datetime.utcnow()
        should_send = True
        if last:
            try:
                last_dt = datetime.fromisoformat(last)
                if now - last_dt < timedelta(minutes=ALERT_COOLDOWN_MINUTES):
                    should_send = False
            except Exception:
                pass

        if should_send:
            send_sms(to, name, qty)


            # update last_alert_at
            conn = get_db()
            conn.execute(
                "UPDATE products SET last_alert_at=? WHERE sku=?",
                (now.isoformat(timespec="seconds"), sku),
            )
            conn.commit()
            conn.close()


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
    # expected by your front-end: shop_name, sku, name, quantity, reorder_threshold
    # (matches the fetch body in app.js addProduct) :contentReference[oaicite:1]{index=1}
    required = ["shop_name", "sku", "name", "quantity", "reorder_threshold"]
    for k in required:
        if k not in data:
            return jsonify({"error": f"Missing field: {k}"}), 400

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
        # fetch back the product for alert logic
        row = conn.execute(
            "SELECT shop_name, sku, name, quantity, reorder_threshold, last_alert_at FROM products WHERE sku=?",
            (data["sku"],),
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
        "SELECT shop_name, sku, name, quantity, reorder_threshold, last_alert_at FROM products WHERE sku=?",
        (sku,),
    ).fetchone()
    if not row:
        conn.close()
        return jsonify({"error": "SKU not found"}), 404

    new_qty = row["quantity"] + delta
    if new_qty < 0:
        new_qty = 0

    conn.execute("UPDATE products SET quantity=? WHERE sku=?", (new_qty, sku))
    conn.commit()
    row = conn.execute(
        "SELECT shop_name, sku, name, quantity, reorder_threshold, last_alert_at FROM products WHERE sku=?",
        (sku,),
    ).fetchone()
    conn.close()

    maybe_alert_low_stock(dict(row))
    return jsonify({"status": "ok", "sku": sku, "quantity": row["quantity"]})


if __name__ == "__main__":
    init_db()
    port = int(os.environ.get("PORT", "5000"))
    app.run(host="0.0.0.0", port=port, debug=True)
