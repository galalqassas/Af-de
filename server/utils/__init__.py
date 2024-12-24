import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# utils/__init__.py
from utils.db import singleton_db  # Import the singleton_db instance
