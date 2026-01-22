import sys
import os

# Add backend directory to sys.path
sys.path.append(os.getcwd())

from app.db.session import SessionLocal
from app.models.transaction import Transaction
from app.models.property import Property
from sqlalchemy import text, func

def debug_tx():
    db = SessionLocal()
    try:
        print("\n=== DIAGNOSTICO DE BASE DE DATOS ===")
        
        # 1. Check Properties Status
        sold_props = db.query(Property).filter(Property.status == 'sold').all()
        print(f"\n[Propiedades Vendidas]: {len(sold_props)}")
        for p in sold_props:
            print(f" - ID: {p.id} | Titulo: {p.title} | Precio: {p.price}")

        # 2. Check Transactions Table
        tx_count = db.query(Transaction).count()
        print(f"\n[Transacciones Totales]: {tx_count}")
        
        txs = db.query(Transaction).all()
        for tx in txs:
            print(f" - UUID: {tx.id} | PropID: {tx.property_id} | Monto: {tx.amount}")

        # 3. Check Sum Query (wht Reports uses)
        total_revenue = db.query(func.sum(Transaction.amount)).scalar()
        print(f"\n[Ingresos Totales (Query)]: {total_revenue}")

    except Exception as e:
        print(f"\nERROR FATAL: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    debug_tx()
