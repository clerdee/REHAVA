import re
from datetime import datetime
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from config.db import users_collection, baselines_collection

auth_bp = Blueprint("auth_bp", __name__)

EMAIL_REGEX = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
PHONE_REGEX = re.compile(r"^(09|\+639|639)\d{9}$")

@auth_bp.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json(silent=True)
        if not data:
            return jsonify({"error": "No input payload provided"}), 400

        email = data.get("email", "").strip().lower()
        password = data.get("password", "")
        first_name = data.get("firstName", "").strip()
        last_name = data.get("lastName", "").strip()
        phone_number = data.get("phoneNumber", "").strip().replace(" ", "").replace("-", "")
        relationship = data.get("relationshipToPatient", "patient_self")

        if not email or not password or not first_name or not last_name:
            return jsonify({"error": "Required fields are missing"}), 400

        if not EMAIL_REGEX.match(email):
            return jsonify({"error": "Invalid email address format"}), 400

        if not PHONE_REGEX.match(phone_number):
            return jsonify({"error": "Invalid mobile phone format"}), 400

        if len(password) < 6:
            return jsonify({"error": "Password must be at least 6 characters"}), 400

        if users_collection.find_one({"email": email}):
            return jsonify({"error": "An account with this email already exists"}), 409

        patient_type = data.get("patientType", "myself")
        patient_first = first_name if patient_type == "myself" else data.get("patientFirstName", "").strip()
        patient_last = last_name if patient_type == "myself" else data.get("patientLastName", "").strip()
        patient_email = email if patient_type == "myself" else data.get("patientEmail", "").strip().lower()
        patient_phone = phone_number if patient_type == "myself" else data.get("patientPhoneNumber", "").strip()
        patient_age = data.get("patientAge", "")
        patient_gender = data.get("patientGender", "")
        patient_work = data.get("patientWorkStatus", "unspecified")

        affected_side = data.get("affectedSide", "left")
        stroke_stage = data.get("strokeStage", "subacute")
        mobility_assist = data.get("mobilityAssistance", "cane_walker")
        assistive_device = data.get("assistiveDevice", "none")

        hashed_password = generate_password_hash(password)
        created_at = datetime.utcnow()

        user_doc = {
            "firstName": first_name,
            "lastName": last_name,
            "email": email,
            "phoneNumber": phone_number,
            "relationshipToPatient": relationship,
            "password": hashed_password,
            "patientType": patient_type,
            "patient": {
                "firstName": patient_first,
                "lastName": patient_last,
                "email": patient_email,
                "phoneNumber": patient_phone,
                "age": int(patient_age) if str(patient_age).isdigit() else None,
                "gender": patient_gender,
                "workStatus": patient_work
            },
            "role": "patient" if patient_type == "myself" else "caregiver",
            "createdAt": created_at
        }

        user_result = users_collection.insert_one(user_doc)
        user_id = user_result.inserted_id

        baseline_doc = {
            "userId": user_id,
            "userEmail": email,
            "affectedSide": affected_side,
            "strokeStage": stroke_stage,
            "mobilityAssistance": mobility_assist,
            "assistiveDevice": assistive_device,
            "targetSymmetryPercentage": 85.0,
            "cadenceTargetBpm": 90,
            "fsrThresholds": {
                "heelMinAdc": 200,
                "midMinAdc": 150,
                "toeMinAdc": 250
            },
            "createdAt": created_at
        }
        baselines_collection.insert_one(baseline_doc)

        return jsonify({
            "message": "Registration successful",
            "userId": str(user_id),
            "role": user_doc["role"]
        }), 201

    except Exception as e:
        print(f"Registration Error: {e}")
        return jsonify({"error": "Internal server error during registration"}), 500

@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json(silent=True)
        if not data:
            return jsonify({"error": "No input payload provided"}), 400

        email = data.get("email", "").strip().lower()
        password = data.get("password", "")

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        if not EMAIL_REGEX.match(email):
            return jsonify({"error": "Invalid email address format"}), 400

        user = users_collection.find_one({"email": email})
        if not user:
            return jsonify({"error": "No account found with this email"}), 404

        if not check_password_hash(user.get("password", ""), password):
            return jsonify({"error": "Wrong password. Please try again."}), 401

        return jsonify({
            "message": "Login successful",
            "user": {
                "id": str(user["_id"]),
                "email": user["email"],
                "firstName": user.get("firstName", ""),
                "lastName": user.get("lastName", ""),
                "role": user.get("role", "patient")
            }
        }), 200

    except Exception as e:
        print(f"Login Error: {e}")
        return jsonify({"error": "Internal server error during login"}), 500