import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# I-load ang db at firebase
from config.db import db
import config.firebase
from routes.auth_routes import auth_bp

load_dotenv()

app = Flask(__name__)
CORS(app, origins=[os.getenv("FRONTEND_URL", "http://localhost:5173")])

# Blueprint registration
app.register_blueprint(auth_bp, url_prefix="/api/auth")

@app.route("/api/health", methods=["GET"])
def health_check():
    db_status = "connected" if db is not None else "disconnected"
    return jsonify({
        "status": "online",
        "system": "REHAVA Flask Backend",
        "database": db_status
    }), 200

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)