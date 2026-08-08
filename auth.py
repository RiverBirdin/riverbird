"""
Flask-Login user loader and admin protection decorator.
"""

from functools import wraps
from flask import redirect, url_for, flash
from flask_login import LoginManager, current_user
from models import Admin

login_manager = LoginManager()
login_manager.login_view = 'routes.admin_login'
login_manager.login_message = 'Please log in to access the admin panel.'
login_manager.login_message_category = 'warning'

@login_manager.user_loader
def load_user(user_id):
    return db_get_admin(user_id)

def db_get_admin(user_id):
    try:
        return Admin.query.get(int(user_id))
    except Exception:
        return None

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated:
            flash('Please log in to access the admin panel.', 'warning')
            return redirect(url_for('routes.admin_login'))
        return f(*args, **kwargs)
    return decorated_function
