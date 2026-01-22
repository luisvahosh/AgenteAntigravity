import os
import sys

# Get the absolute path to the project root
# __file__ = api/index.py -> dirname = api -> dirname = root
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Add 'backend' directory to sys.path so 'app' module can be found
# The application code uses "from app.core import..." so 'app' must be top-level
sys.path.append(os.path.join(project_root, 'backend'))

from app.main import app
