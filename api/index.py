import os
import sys

# Add the project root to sys.path so 'backend' package is found
# __file__ is api/index.py, dirname is api/, dirname(dirname) is root/
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.app.main import app
