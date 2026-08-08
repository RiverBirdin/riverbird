"""
Configurable Email Utility for Password Resets.
Supports Async Background Sending & Configurable Server Domain.
"""

import os
import threading
from flask import current_app
from flask_mailman import Mail, EmailMessage

mail = Mail()

def init_mail(app):
    app.config.setdefault('MAIL_SERVER', os.environ.get('MAIL_SERVER', 'localhost'))
    app.config.setdefault('MAIL_PORT', int(os.environ.get('MAIL_PORT', 587)))
    app.config.setdefault('MAIL_USE_TLS', os.environ.get('MAIL_USE_TLS', 'true').lower() == 'true')
    app.config.setdefault('MAIL_USERNAME', os.environ.get('MAIL_USERNAME', ''))
    app.config.setdefault('MAIL_PASSWORD', os.environ.get('MAIL_PASSWORD', ''))
    app.config.setdefault('MAIL_DEFAULT_SENDER', os.environ.get('MAIL_DEFAULT_SENDER', 'julius2000trichy@gmail.com'))
    mail.init_app(app)


def _send_async_email(app, msg, to_email, reset_url):
    """Executes email send in a background thread to prevent UI slowness."""
    with app.app_context():
        try:
            msg.send()
            print(f"\n[EMAIL SENT SUCCESSFUL] Reset email delivered to: {to_email}\n")
        except Exception as e:
            app.logger.error(f"Failed to send email: {e}")
            print(f"\n[PASSWORD RESET EMAIL FALLBACK FOR {to_email}]:\nReset Link: {reset_url}\nError: {e}\n")


def send_password_reset_email(to_email, reset_url):
    """
    Sends password reset link to admin email address asynchronously.
    """
    subject = "Password Reset Request — RiverBird Admin"
    body = f"""Hello,

We received a request to reset your password for the RiverBird Admin Panel.

Click the link below to set a new password (valid for 1 hour):
{reset_url}

If you did not request a password reset, please ignore this email.

Best regards,
RiverBird System Admin
"""
    app = current_app._get_current_object()
    mail_username = app.config.get('MAIL_USERNAME')
    mail_server = app.config.get('MAIL_SERVER')

    if mail_username and mail_server != 'localhost':
        msg = EmailMessage(
            subject=subject,
            body=body,
            from_email=app.config.get('MAIL_DEFAULT_SENDER'),
            to=[to_email]
        )
        # Dispatch in background thread for instantaneous web response
        thread = threading.Thread(target=_send_async_email, args=(app, msg, to_email, reset_url))
        thread.daemon = True
        thread.start()
        return True, f"Password reset email sent to {to_email}."
    else:
        print(f"\n==================================================")
        print(f"[PASSWORD RESET LINK FOR {to_email}]")
        print(f"{reset_url}")
        print(f"==================================================\n")
        return True, "Password reset link generated."
