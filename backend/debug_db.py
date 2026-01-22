from app.db.session import SessionLocal
from app.models.transaction import Transaction
from app.models.property import Property
from sqlalchemy import text

def debug_db():
    db = SessionLocal()
    try:
        # Check tables
        print("--- Checking Tables ---")
        tables = db.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema='public'")).fetchall()
        print(f"Tables found: {[t[0] for t in tables]}")
        
        # Check Transactions
        print("\n--- Checking Transactions ---")
        tx_count = db.query(Transaction).count()
        print(f"Transaction Count: {tx_count}")
        
        txs = db.query(Transaction).all()
        for tx in txs:
            print(f"Tx: {tx.id} | Amount: {tx.amount} | Type: {tx.type}")

        # Check Properties
        print("\n--- Checking Properties ---")
        props = db.query(Property).all()
        for p in props:
            print(f"Prop: {p.id} | Title: {p.title} | Status: {p.status}")
            
    except Exception as e:
        print(f"ERROR: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    debug_db()
