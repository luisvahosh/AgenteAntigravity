import sys
import os
import random
from datetime import datetime

# Add project root to sys.path
sys.path.append(os.getcwd())

from app.db.session import SessionLocal
from app.models.client import Client
from app.models.property import Property
from app.models.transaction import Transaction

# Data Source
first_names = ["Juan", "Maria", "Carlos", "Ana", "Luis", "Elena", "Pedro", "Sofia", "Miguel", "Lucia", "Jorge", "Laura", "Andres", "Valentina", "Diego"]
last_names = ["Garcia", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Perez", "Sanchez", "Ramirez", "Torres", "Flores", "Rivera", "Gomez", "Diaz"]
locations = ["Poblado", "Envigado", "Laureles", "Sabaneta", "Bello", "Centro", "Belén", "Robledo", "Itagüí", "Rionegro", "Llanogrande"]
prop_types_adj = ["Hermoso Apartamento", "Casa Amplia", "Penthouse de Lujo", "Oficina Moderna", "Local Comercial", "Casa Campestre", "Apartaestudio"]

def create_random_clients(db, count=30):
    print(f"Creating {count} clients...")
    clients = []
    for _ in range(count):
        fname = random.choice(first_names)
        lname = random.choice(last_names)
        email = f"{fname.lower()}.{lname.lower()}{random.randint(1,999)}@example.com"
        
        client = Client(
            name=f"{fname} {lname}",
            email=email,
            phone=f"300{random.randint(1000000, 9999999)}",
            status="active",
            notes="Cliente generado automáticamente",
            created_at=datetime.now()
        )
        db.add(client)
        clients.append(client)
    
    db.commit()
    # Refresh to get IDs
    for c in clients:
        db.refresh(c)
    return clients

def create_random_properties(db, clients, count=40):
    print(f"Creating {count} properties...")
    
    for i in range(count):
        is_rent = random.random() < 0.35 # ~35% rentals (interpreting '30 5' as ~35%)
        
        prop_type = "rent" if is_rent else "sale"
        location = random.choice(locations)
        title = f"{random.choice(prop_types_adj)} en {location}"
        
        # Price 100M - 700M
        price = random.randint(100, 700) * 1_000_000
        if is_rent:
             # Rent price usually 0.5% - 1% of value. Let's say 2M - 10M for realism if it were rent,
             # BUT user asked for "average price of 100M to 700M". 
             # Usually 'price' field for rent is monthly rent. 100M rent is crazy.
             # However, assuming the user meant ASSET VALUE. 
             # I will store the Logical Price. If it's rent, maybe reasonable rent between 1M and 5M.
             price = random.randint(1500000, 8000000)
        
        owner = random.choice(clients)
        
        prop = Property(
            title=title,
            description=f"Espectacular propiedad ubicada en la exclusiva zona de {location}. Cuenta con excelentes acabados y vista panorámica.",
            price=price,
            address=f"Calle {random.randint(1, 100)} # {random.randint(1, 100)} - {random.randint(1, 100)}, {location}",
            bedrooms=random.randint(1, 5),
            bathrooms=random.randint(1, 4),
            area_sqm=random.randint(40, 300),
            type=prop_type,
            status="available", # All start available so user can sell them
            owner_id=owner.id
        )
        db.add(prop)
    
    db.commit()

def main():
    db = SessionLocal()
    try:
        clients = create_random_clients(db, 30)
        create_random_properties(db, clients, 40)
        print("SUCCESS: Database populated successfully!")
    except Exception as e:
        print(f"ERROR: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    main()
