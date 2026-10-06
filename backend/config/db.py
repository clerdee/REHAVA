import os
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017/rehava_db")
DB_NAME = os.getenv("DB_NAME", "rehava_db")

try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    client.admin.command("ping")
    print("✅ Successfully connected to MongoDB!")

    db = client.get_database(DB_NAME)

    users_collection = db["users"]
    baselines_collection = db["profile_baselines"]
    appointments_collection = db["appointments"]
    session_logs_collection = db["session_logs"]
    exercise_targets_collection = db["exercises"]

except ConnectionFailure as e:
    print(f"❌ Failed to connect to MongoDB: {e}")
    db = None
    users_collection = None
    baselines_collection = None
    appointments_collection = None
    session_logs_collection = None
    exercise_targets_collection = None