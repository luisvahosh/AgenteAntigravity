from passlib.context import CryptContext
import bcrypt

print(f"Bcrypt version: {bcrypt.__version__}")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

try:
    print("Attempting to hash 'secret'...")
    hash = pwd_context.hash("secret")
    print(f"Success: {hash}")
except Exception as e:
    print(f"FAIL: {e}")
    import traceback
    traceback.print_exc()
