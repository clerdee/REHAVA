import re
from flask import Blueprint, request, jsonify
from config.db import users_collection, baselines_collection

profile_bp = Blueprint("profile_bp", __name__)

PHONE_REGEX = re.compile(r"^(09|\+639|639)\d{9}$")

@profile_bp.route("", methods=["GET"])
def get_profile():
    try:
        email = request.args.get("email", "").strip().lower()
        if not email:
            return jsonify({"error": "Email parameter required"}), 400

        user = users_collection.find_one({"email": email})
        if not user:
            return jsonify({"error": "User not found"}), 404

        baseline = baselines_collection.find_one({"userEmail": email}) or {}
        patient_obj = user.get("patient", {})

        return jsonify({
            "firstName": user.get("firstName", ""),
            "lastName": user.get("lastName", ""),
            "email": user.get("email", ""),
            "phoneNumber": user.get("phoneNumber", ""),
            "relationshipToPatient": user.get("relationshipToPatient", "patient_self"),
            "patientType": user.get("patientType", "myself"),
            "patientFirstName": patient_obj.get("firstName", ""),
            "patientLastName": patient_obj.get("lastName", ""),
            "patientEmail": patient_obj.get("email", ""),
            "patientPhone": patient_obj.get("phoneNumber", ""),
            "patientAge": patient_obj.get("age"),
            "patientGender": patient_obj.get("gender", ""),
            "patientWorkStatus": patient_obj.get("workStatus", "unspecified"),
            "affectedSide": baseline.get("affectedSide", "left"),
            "strokeStage": baseline.get("strokeStage", "subacute"),
            "mobilityAssistance": baseline.get("mobilityAssistance", "cane_walker"),
            "assistiveDevice": baseline.get("assistiveDevice", "none"),
            "targetSymmetryPercentage": baseline.get("targetSymmetryPercentage", 0),
            "cadenceTargetBpm": baseline.get("cadenceTargetBpm", 0),
            "fsrThresholds": baseline.get("fsrThresholds", {})
        }), 200
    except Exception as e:
        print(f"Fetch Profile Error: {e}")
        return jsonify({"error": "Internal server error while fetching profile"}), 500

@profile_bp.route("/update", methods=["PUT"])
def update_profile():
    try:
        data = request.get_json(silent=True)
        if not data:
            return jsonify({"error": "No payload provided"}), 400

        email = data.get("email", "").strip().lower()
        if not email:
            return jsonify({"error": "Email identifier is required"}), 400

        first_name = data.get("firstName", "").strip()
        last_name = data.get("lastName", "").strip()
        phone_number = data.get("phoneNumber", "").strip().replace(" ", "").replace("-", "")

        if not first_name or not last_name:
            return jsonify({"error": "Name fields cannot be empty"}), 400

        if phone_number and not PHONE_REGEX.match(phone_number):
            return jsonify({"error": "Invalid Philippine mobile phone format"}), 400

        mobility_assist = data.get("mobilityAssistance", "cane_walker")
        assistive_device = data.get("assistiveDevice", "none")

        user_update_payload = {
            "firstName": first_name,
            "lastName": last_name,
            "phoneNumber": phone_number
        }

        user = users_collection.find_one({"email": email})
        if not user:
            return jsonify({"error": "Account not found"}), 404

        if user.get("patientType") == "myself":
            user_update_payload["patient.firstName"] = first_name
            user_update_payload["patient.lastName"] = last_name
            user_update_payload["patient.phoneNumber"] = phone_number

        users_collection.update_one({"email": email}, {"$set": user_update_payload})

        baselines_collection.update_one(
            {"userEmail": email},
            {"$set": {
                "mobilityAssistance": mobility_assist,
                "assistiveDevice": assistive_device
            }}
        )

        return jsonify({"message": "Profile and baseline configuration updated successfully"}), 200
    except Exception as e:
        print(f"Update Profile Error: {e}")
        return jsonify({"error": "Internal server error while updating profile"}), 500