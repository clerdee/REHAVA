import os
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017/rehava_db")

try:
    # 5 seconds timeout para mabilis mag-report kung sakaling offline ang MongoDB
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    
    # Ping test para masiguro ang koneksyon
    client.admin.command('ping')
    print("✅ Successfully connected to MongoDB!")

    db = client["rehava_db"]

    # REHAVA Collections
    users_collection = db["users"]                  # Patient at Caregiver records
    baselines_collection = db["profile_baselines"]  # Symmetry targets, hemiparesis side, orthosis
    appointments_collection = db["appointments"]    # Clinic rehabilitation schedules
    session_logs_collection = db["session_logs"]    # Recorded gait telemetry (FSR & MPU-6050)
    exercise_targets_collection = db["exercises"]   # Daily prescribed motor exercises

except ConnectionFailure as e:
    print(f"❌ Failed to connect to MongoDB: {e}")
    db = None