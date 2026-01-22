import sys
import os

# Add the current directory to sys.path so we can import app modules if needed
sys.path.append(os.getcwd())

from dotenv import load_dotenv

# Load env vars from backend/.env explicitly to mimic app startup
load_dotenv("backend/.env")

try:
    from app.core.config import settings
    print(f"TYPE: {type(settings.BACKEND_CORS_ORIGINS)}")
    print(f"VALUE: {settings.BACKEND_CORS_ORIGINS}")
    
    for origin in settings.BACKEND_CORS_ORIGINS:
        print(f"ORIGIN: '{origin}' type: {type(origin)}")

except Exception as e:
    print(f"Error loading settings: {e}")
