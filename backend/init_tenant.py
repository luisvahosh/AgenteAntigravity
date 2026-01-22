import sys
import os
from datetime import datetime

sys.path.append(os.getcwd())

from app.db.session import SessionLocal
from app.models.tenant import Tenant

def create_tenant():
    db = SessionLocal()
    try:
        tenant = db.query(Tenant).first()
        if tenant:
            print(f"Tenant already exists: {tenant.name}")
            return

        print("Creating default tenant...")
        new_tenant = Tenant(
            name="Inmobiliaria Demo",
            subdomain="demo",
            subscription_plan="PRO",
            is_active=True,
            created_at=datetime.now()
        )
        db.add(new_tenant)
        db.commit()
        print("Success! Default tenant created.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_tenant()
