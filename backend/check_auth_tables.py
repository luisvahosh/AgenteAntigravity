import sys
import os
from sqlalchemy import text

sys.path.append(os.getcwd())

from app.db.session import SessionLocal
from app.models.user import User
from app.models.tenant import Tenant

def check_tables():
    db = SessionLocal()
    try:
        print("Checking tables...")
        # Check Tenant
        try:
            tenants = db.query(Tenant).all()
            print(f"Tenants table exists. Count: {len(tenants)}")
            if len(tenants) > 0:
                print(f"Tenant 1: {tenants[0].name} (ID: {tenants[0].id})")
            else:
                print("WARNING: Tenants table is EMPTY.")
        except Exception as e:
            print(f"ERROR querying Tenants: {e}")

        # Check User
        try:
            users = db.query(User).all()
            print(f"Users table exists. Count: {len(users)}")
        except Exception as e:
            print(f"ERROR querying Users: {e}")

    finally:
        db.close()

if __name__ == "__main__":
    check_tables()
