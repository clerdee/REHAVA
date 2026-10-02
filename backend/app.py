import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

from config.db import db
from routes.auth_routes import auth_bp

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# API Routes
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