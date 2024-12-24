from flask import Blueprint

dashboard_bp = Blueprint('dashboard', __name__)

from . import row1
from . import row3