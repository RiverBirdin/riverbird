"""
Passenger WSGI entry point for Hostinger / cPanel deployment.
"""
import sys
import os

# Ensure the root project directory is in the Python search path
sys.path.insert(0, os.path.dirname(__file__))

from app import create_app

# Phusion Passenger looks for the 'application' callable
application = create_app()
