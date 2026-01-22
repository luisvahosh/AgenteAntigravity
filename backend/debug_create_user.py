import sys
import os
from passlib.context import CryptContext

sys.path.append(os.getcwd())

from app.db.session import SessionLocal
from app.models.user import User
from app.models.tenant import Tenant

# Mimic the logic in endpoints/users.py
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def debug_create_user():
    print("Starting debug_create_user...")
    db = SessionLocal()
    try:
        # 1. Get tenant
        tenant = db.query(Tenant).first()
        if not tenant:
            print("ERROR: No tenant found!")
            return
        
        print(f"Using tenant: {tenant.name} (ID: {tenant.id})")

        # 2. Prepare user data
        email = "debug_user@example.com"
        password = "debugpassword123"
        
        # Check if exists
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            print(f"User {email} already exists. Deleting for test...")
            db.delete(existing)
            db.commit()

        print("Hashing password...")
        hashed_pw = get_password_hash(password)
        print(f"Password hashed successfully: {hashed_pw[:10]}...")

        # 3. Create user
        print("Creating user object...")
        new_user = User(
            email=email,
            hashed_password=hashed_pw,
            role="agent",
            is_active=True,
            tenant_id=tenant.id
        )
        
        print("Adding to DB...")
        db.add(new_user)
        db.commit()
        print("Committed.")
        
        db.refresh(new_user)
        print(f"SUCCESS! User created with ID: {new_user.id}")

    except Exception as e:
        print("\n!!! EXCEPTION CAUGHT !!!")
        print(e)
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    debug_create_user()
