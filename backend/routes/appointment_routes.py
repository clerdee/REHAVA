from datetime import datetime
from bson.objectid import ObjectId
from flask import Blueprint, request, jsonify
from config.db import db

appointment_bp = Blueprint("appointment_bp", __name__)
appointments_collection = db["appointments"]

@appointment_bp.route("", methods=["GET"])
def get_appointments():
    try:
        email = request.args.get("email", "").strip().lower()
        query = {"patientEmail": email} if email else {}

        cursor = appointments_collection.find(query).sort("appointment_date", -1)
        results = []
        for doc in cursor:
            results.append({
                "_id": str(doc["_id"]),
                "therapy_type": doc.get("therapy_type"),
                "therapy_title": doc.get("therapy_title"),
                "appointment_date": doc.get("appointment_date"),
                "duration": doc.get("duration", 60),
                "therapist_name": doc.get("therapist_name"),
                "status": doc.get("status", "pending"),
                "notes": doc.get("notes", ""),
                "created_at": doc.get("created_at")
            })

        return jsonify(results), 200
    except Exception as e:
        return jsonify({"error": f"Failed to fetch appointments: {str(e)}"}), 500

@appointment_bp.route("/book", methods=["POST"])
def book_appointment():
    try:
        data = request.get_json(silent=True)
        if not data:
            return jsonify({"error": "No input payload provided"}), 400

        email = data.get("email", "").strip().lower()
        therapy_type = data.get("therapy_type")
        therapy_title = data.get("therapy_title", "Physical Therapy Session")
        date_str = data.get("preferred_date", "").strip()
        time_str = data.get("preferred_time", "").strip()
        clinician = data.get("clinician_preference")
        notes = data.get("notes", "").strip()

        if not date_str or not time_str:
            return jsonify({"error": "Preferred clinic date and time are required"}), 400

        booking_dt = datetime.strptime(date_str, "%Y-%m-%d")
        if booking_dt.weekday() in [5, 6]:
            return jsonify({"error": "The clinic is closed on Saturdays and Sundays"}), 400

        apt_doc = {
            "patientEmail": email,
            "therapy_type": therapy_type,
            "therapy_title": therapy_title,
            "appointment_date": f"{date_str}T{time_str}",
            "duration": int(data.get("duration", 60)),
            "therapist_name": None if clinician == "auto_assign" else clinician,
            "status": "pending",
            "notes": notes,
            "created_at": datetime.utcnow().isoformat()
        }

        result = appointments_collection.insert_one(apt_doc)
        apt_doc["_id"] = str(result.inserted_id)

        return jsonify({
            "message": "Appointment booked successfully. Awaiting clinician validation.",
            "appointment": apt_doc
        }), 201
    except Exception as e:
        return jsonify({"error": f"Failed to book appointment: {str(e)}"}), 500

@appointment_bp.route("/cancel/<apt_id>", methods=["PUT"])
def cancel_appointment(apt_id):
    try:
        if not ObjectId.is_valid(apt_id):
            return jsonify({"error": "Invalid appointment ID"}), 400

        result = appointments_collection.update_one(
            {"_id": ObjectId(apt_id)},
            {"$set": {"status": "cancelled", "cancelled_at": datetime.utcnow().isoformat()}}
        )

        if result.matched_count == 0:
            return jsonify({"error": "Appointment not found"}), 404

        return jsonify({"message": "Appointment cancelled successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to cancel appointment: {str(e)}"}), 500