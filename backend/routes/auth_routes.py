from flask import Blueprint, request, jsonify
from config.db import users_collection
from config.auth_guard import require_auth

auth_bp = Blueprint("auth_bp", __name__)

@auth_bp.route("/verify-user", methods=["POST"])
@require_auth
def verify_and_sync_user(decoded_user):
    """
    Tinatanggap ang Google token, iberipika, at ise-save/update ang profile sa MongoDB.
    """
    uid = decoded_user.get("uid")
    email = decoded_user.get("email")
    name = decoded_user.get("name", "")
    
    data = request.get_json() or {}

    # Hanapin kung existing na ang user sa MongoDB
    existing_user = users_collection.find_one({"firebase_uid": uid})

    if not existing_user:
        new_user = {
            "firebase_uid": uid,
            "email": email,
            "fullName": name,
            "role": data.get("role", "patient"),
            "phoneNumber": data.get("phoneNumber", ""),
            "relationshipToPatient": data.get("relationshipToPatient", "patient_self"),
            "createdAt": decoded_user.get("auth_time")
        }
        users_collection.insert_one(new_user)
        return jsonify({"message": "New user registered in MongoDB", "user": new_user}), 201

    return jsonify({"message": "User authenticated", "user": existing_user}), 200