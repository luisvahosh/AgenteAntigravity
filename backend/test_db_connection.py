import sys
import os
from sqlalchemy import create_engine, text

# Add the current directory to sys.path so we can import app modules if needed
sys.path.append(os.getcwd())

from dotenv import load_dotenv

# Load env vars from backend/.env
load_dotenv("backend/.env")

database_url = os.getenv("DATABASE_URL")

if not database_url:
    print("Error: DATABASE_URL not found in .env")
    sys.exit(1)

print(f"Attempting to connect to: {database_url.split('@')[-1]}") # Hide password

try:
    engine = create_engine(database_url)
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        print("Connection successful! Result:", result.scalar())
        
        # Optional: Check if tables exist
        result = connection.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"))
        tables = [row[0] for row in result]
        print("Found tables:", tables)

except Exception as e:
    with open("backend/connection_log.txt", "w") as f:
        f.write(str(e))
    print(f"Connection failed: {e}")
    sys.exit(1)
