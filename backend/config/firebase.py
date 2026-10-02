import os
import firebase_admin
from firebase_admin import credentials, auth

# Hanapin ang serviceAccountKey.json sa root ng backend folder
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
cred_path = os.path.join(base_dir, "serviceAccountKey.json")

if not os.path.exists(cred_path):
    print("⚠️ WARNING: serviceAccountKey.json not found in backend folder!")
else:
    try:
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
        print("✅ Firebase Admin SDK initialized successfully!")
    except ValueError:
        # Kapag initialized na ang app (in case of reloads)
        pass

def verify_firebase_token(id_token):
    """
    Bine-verify ang Google/Firebase Bearer token mula sa Frontend.
    Nagbabalik ng decoded dictionary (uid, email, name) kung valid, o None kung invalid.
    """
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except Exception as e:
        print(f"❌ Firebase Token Verification Error: {e}")
        return None