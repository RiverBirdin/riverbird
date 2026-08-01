"""
RiverBird Blog Management System — Flask Application Factory & Entry Point.
"""

import os
import secrets
from flask import Flask
from dotenv import load_dotenv

from models import db, Admin
from auth import login_manager
from email_utils import init_mail
from routes import routes

from flask_wtf.csrf import CSRFProtect

csrf = CSRFProtect()

# Load environment variables from .env file
load_dotenv()

def create_app():
    app = Flask(
        __name__,
        static_folder='.',
        static_url_path='',
        template_folder='templates'
    )

    # ── Security Configuration ──
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY') or secrets.token_hex(32)
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB upload limit

    # ── Database Configuration (Neon for Auth/Reset, SQLite for Blogs) ──
    db_path = os.path.join(app.root_path, 'database.db')
    database_url = os.environ.get('DATABASE_URL')
    
    if database_url:
        if database_url.startswith('postgres://'):
            database_url = database_url.replace('postgres://', 'postgresql://', 1)
        app.config['SQLALCHEMY_DATABASE_URI'] = database_url
    else:
        app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{db_path}"

    app.config['SQLALCHEMY_BINDS'] = {
        'local': f"sqlite:///{db_path}"
    }

    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
        'pool_pre_ping': True,
        'pool_recycle': 280,
    }

    # ── Ensure uploads directory exists ──
    uploads_dir = os.path.join(app.root_path, 'static', 'uploads')
    os.makedirs(uploads_dir, exist_ok=True)

    # ── Initialize Extensions ──
    db.init_app(app)
    login_manager.init_app(app)
    init_mail(app)
    csrf.init_app(app)

    # ── Register Blueprints ──
    app.register_blueprint(routes)

    # ── Exempt Public Chatbot APIs from CSRF ──
    from routes import api_chatbot_message, api_chatbot_submit_lead
    csrf.exempt(api_chatbot_message)
    csrf.exempt(api_chatbot_submit_lead)

    # ── HTTP Security Headers Middleware ──
    @app.after_request
    def set_security_headers(response):
        response.headers['X-Frame-Options'] = 'SAMEORIGIN'
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['X-XSS-Protection'] = '1; mode=block'
        response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        return response

    # ── Database & Initial Admin Setup ──
    with app.app_context():
        db.create_all()

        # Ensure default Admin account exists securely
        admin_username = os.environ.get('ADMIN_USERNAME', 'riverbird_admin')
        admin_email = os.environ.get('ADMIN_EMAIL', 'admin@riverbird.in')
        admin_password = os.environ.get('ADMIN_PASSWORD', 'riverbird@admin2026')

        existing_admin = Admin.query.filter_by(username=admin_username).first()
        if not existing_admin:
            existing_admin = Admin.query.filter_by(email=admin_email).first()

        if not existing_admin:
            admin = Admin(username=admin_username, email=admin_email)
            admin.set_password(admin_password)
            db.session.add(admin)
            db.session.commit()
            print(f"[INIT] Secure Admin account active: '{admin_username}'")
        else:
            if existing_admin.email != admin_email:
                existing_admin.email = admin_email
                db.session.commit()
                print(f"[INIT] Updated Admin email to: '{admin_email}'")

    return app


if __name__ == '__main__':
    app = create_app()
    debug_mode = os.environ.get('FLASK_DEBUG', 'False').lower() in ('true', '1')
    port = int(os.environ.get('PORT', 5000))
    print("\n  ==================================================")
    print("  |  RiverBird System Server Active                |")
    print(f"  |  Local:   http://127.0.0.1:{port}                |")
    print(f"  |  Admin:   http://127.0.0.1:{port}/admin          |")
    print("  ==================================================\n")
    app.run(debug=debug_mode, host='0.0.0.0', port=port)
