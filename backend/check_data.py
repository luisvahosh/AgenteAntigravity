import sys
import os

sys.path.append(os.getcwd())

from app.db.session import SessionLocal
from app.models.transaction import Transaction
from app.models.property import Property
from app.models.client import Client
from sqlalchemy import text

def check_data():
    db = SessionLocal()
    with open("db_status.txt", "w") as f:
        try:
            f.write("=== DATABASE STATUS ===\n")
            
            # Count Properties
            props = db.query(Property).all()
            f.write(f"PROPERTIES COUNT: {len(props)}\n")
            for p in props:
                f.write(f" - Prop {p.id}: {p.title} | Status: {p.status}\n")
            
            # Count Transactions
            txs = db.query(Transaction).all()
            f.write(f"\nTRANSACTIONS COUNT: {len(txs)}\n")
            for t in txs:
                f.write(f" - Tx {t.id}: Amount={t.amount} | Type={t.type} | PropID={t.property_id}\n")
                
            if len(txs) == 0:
                f.write("\nWARNING: No transactions found despite property updates!\n")
                
        except Exception as e:
            f.write(f"\nERROR: {str(e)}\n")
        finally:
            db.close()

if __name__ == "__main__":
    check_data()
