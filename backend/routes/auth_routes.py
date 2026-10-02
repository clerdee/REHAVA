from datetime import datetime
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
from config.db import users_collection, baselines_collection

auth_bp = Blueprint("auth_bp", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No input data provided"}), 400

        # Step 1 Fields
        email = data.get("email", "").strip().lower()
        password = data.get("password", "")
        first_name = data.get("firstName", "").strip()
        last_name = data.get("lastName", "").strip()
        phone_number = data.get("phoneNumber", "").strip()
        relationship = data.get("relationshipToPatient", "patient_self")

        if not email or not password or not first_name or not last_name:
            return jsonify({"error": "First name, last name, email, and password are required"}), 400

        # Tiyakin kung may existing user na gamit ang email
        if users_collection.find_one({"email": email}):
            return jsonify({"error": "An account with this email already exists"}), 409

        # Step 2 Fields (Demographics)
        patient_type = data.get("patientType", "myself")
        patient_first_name = data.get("patientFirstName", first_name if patient_type == "myself" else "").strip()
        patient_last_name = data.get("patientLastName", last_name if patient_type == "myself" else "").strip()
        patient_email = data.get("patientEmail", email if patient_type == "myself" else "").strip().lower()
        patient_phone = data.get("patientPhoneNumber", phone_number if patient_type == "myself" else "").strip()
        patient_age = data.get("patientAge", "")
        patient_gender = data.get("patientGender", "")
        patient_work_status = data.get("patientWorkStatus", "unspecified")

        # Step 3 Fields (Stroke Therapy Profile)
        affected_side = data.get("affectedSide", "left")
        stroke_stage = data.get("strokeStage", "subacute")
        mobility_assistance = data.get("mobilityAssistance", "cane_walker")
        assistive_device = data.get("assistiveDevice", "none")

        hashed_password = generate_password_hash(password)
        created_at = datetime.utcnow()

        # Document 1: Users Collection (Primary Account & Patient Info)
        user_doc = {
            "firstName": first_name,
            "lastName": last_name,
            "email": email,
            "phoneNumber": phone_number,
            "relationshipToPatient": relationship,
            "password": hashed_password,
            "patientType": patient_type,
            "patient": {
                "firstName": patient_first_name,
                "lastName": patient_last_name,
                "email": patient_email,
                "phoneNumber": patient_phone,
                "age": int(patient_age) if str(patient_age).isdigit() else None,
                "gender": patient_gender,
                "workStatus": patient_work_status
            },
            "role": "patient" if patient_type == "myself" else "caregiver",
            "createdAt": created_at
        }

        user_result = users_collection.insert_one(user_doc)
        user_id = user_result.inserted_id

        # Document 2: Baselines Collection (Kinematic & Therapy Profile)
        baseline_doc = {
            "userId": user_id,
            "userEmail": email,
            "affectedSide": affected_side,
            "strokeStage": stroke_stage,
            "mobilityAssistance": mobility_assistance,
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
        print(f"❌ Registration Error: {e}")
        return jsonify({"error": "Internal server error during registration"}), 500