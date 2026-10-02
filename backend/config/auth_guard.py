from functools import wraps
from flask import request, jsonify
from config.firebase import verify_firebase_token

def require_auth(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"error": "Unauthorized: Missing or invalid Authorization header"}), 401
        
        token = auth_header.split("Bearer ")[1]
        decoded_user = verify_firebase_token(token)
        
        if not decoded_user:
            return jsonify({"error": "Unauthorized: Invalid or expired Firebase token"}), 401
        
        # Ipapasa ang authenticated user data sa endpoint
        return f(decoded_user, *args, **kwargs)
    
    return decorated_function