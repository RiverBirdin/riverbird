"""
Database models using Flask-SQLAlchemy for Neon PostgreSQL & SQLite compatibility.
"""

from datetime import datetime, timezone
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import deferred
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

def utc_now():
    return datetime.now(timezone.utc).replace(tzinfo=None)

class Admin(db.Model, UserMixin):
    __tablename__ = 'admin'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=utc_now)
    last_login = db.Column(db.DateTime, nullable=True)

    def __init__(self, username=None, email=None, **kwargs):
        super().__init__(**kwargs)
        if username is not None:
            self.username = username
        if email is not None:
            self.email = email

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<Admin {self.username}>'


class Blog(db.Model):
    __tablename__ = 'blogs'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    slug = db.Column(db.String(200), unique=True, nullable=False)
    short_description = db.Column(db.Text, nullable=False)
    content = db.Column(db.Text, nullable=False)
    featured_image = db.Column(db.Text, nullable=True)
    image_data = deferred(db.Column(db.LargeBinary, nullable=True))
    image_mimetype = db.Column(db.String(50), nullable=True)
    category = db.Column(db.String(100), default='General')
    author = db.Column(db.String(100), default='RiverBird Admin')
    published = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=utc_now)
    updated_at = db.Column(db.DateTime, default=utc_now, onupdate=utc_now)
    published_at = db.Column(db.DateTime, nullable=True)

    def __init__(self, title=None, slug=None, short_description=None, content=None, featured_image=None, image_data=None, image_mimetype=None, category=None, author=None, published=None, published_at=None, **kwargs):
        super().__init__(**kwargs)
        if title is not None: self.title = title
        if slug is not None: self.slug = slug
        if short_description is not None: self.short_description = short_description
        if content is not None: self.content = content
        if featured_image is not None: self.featured_image = featured_image
        if image_data is not None: self.image_data = image_data
        if image_mimetype is not None: self.image_mimetype = image_mimetype
        if category is not None: self.category = category
        if author is not None: self.author = author
        if published is not None: self.published = published
        if published_at is not None: self.published_at = published_at

    def get_image_url(self):
        if not self.featured_image and not self.image_data:
            return None
        if self.featured_image:
            img = self.featured_image.strip()
            if img.startswith(('http://', 'https://', 'data:image/')):
                return img
        return f"/api/blogs/{self.id}/image"

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'slug': self.slug,
            'description': self.short_description,
            'content': self.content,
            'image': self.get_image_url(),
            'featured_image': self.featured_image,
            'category': self.category,
            'author': self.author,
            'published': self.published,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'published_at': self.published_at.isoformat() if self.published_at else None,
        }

    def __repr__(self):
        return f'<Blog {self.title}>'


class PasswordResetToken(db.Model):
    __tablename__ = 'password_reset_tokens'

    id = db.Column(db.Integer, primary_key=True)
    admin_id = db.Column(db.Integer, db.ForeignKey('admin.id'), nullable=False)
    token_hash = db.Column(db.String(255), nullable=False)
    expires_at = db.Column(db.DateTime, nullable=False)
    used = db.Column(db.Boolean, default=False)

    admin = db.relationship('Admin', backref=db.backref('reset_tokens', lazy=True))

    def __init__(self, admin_id=None, token_hash=None, expires_at=None, used=False, **kwargs):
        super().__init__(**kwargs)
        if admin_id is not None: self.admin_id = admin_id
        if token_hash is not None: self.token_hash = token_hash
        if expires_at is not None: self.expires_at = expires_at
        if used is not None: self.used = used

    def is_valid(self):
        return not self.used and self.expires_at > utc_now()


class ChatbotLead(db.Model):
    __tablename__ = 'chatbot_leads'
    __bind_key__ = 'local'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=True)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(30), nullable=False)
    service_interest = db.Column(db.String(150), nullable=True, default='General Inquiry')
    message = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=utc_now)

    def __init__(self, name=None, email=None, phone=None, service_interest=None, message=None, **kwargs):
        super().__init__(**kwargs)
        if name is not None: self.name = name
        if email is not None: self.email = email
        if phone is not None: self.phone = phone
        if service_interest is not None: self.service_interest = service_interest
        if message is not None: self.message = message

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name or 'N/A',
            'email': self.email,
            'phone': self.phone,
            'service_interest': self.service_interest or 'General Inquiry',
            'message': self.message or '',
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S') if self.created_at else ''
        }

    def __repr__(self):
        return f'<ChatbotLead {self.email} - {self.phone}>'

