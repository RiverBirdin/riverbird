"""
WSGI entry point for standard WSGI servers (Gunicorn, uWSGI, etc.).
"""
from app import create_app

app = create_app()

if __name__ == "__main__":
    app.run()
