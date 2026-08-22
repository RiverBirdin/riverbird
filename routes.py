"""
RiverBird Flask Routes & Blueprints:
Serves public static pages, public blog API & detail pages, and protected admin CMS routes.
"""

import os
import re
import uuid
import hashlib
import csv
import io
from datetime import datetime, timedelta
from werkzeug.utils import secure_filename
from flask import Blueprint, render_template, redirect, url_for, request, flash, jsonify, send_from_directory, current_app, Response
from flask_login import login_user, logout_user, login_required, current_user

from models import db, Admin, Blog, PasswordResetToken, ChatbotLead, utc_now
from forms import LoginForm, BlogForm, ForgotPasswordForm, ResetPasswordForm, ChangePasswordForm, ALLOWED_EXTENSIONS
from auth import admin_required
from email_utils import send_password_reset_email
from chatbot_engine import generate_bot_response

routes = Blueprint('routes', __name__)



# ── Helper Functions ──

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def generate_unique_slug(title, current_id=None):
    slug = re.sub(r'[^\w\s-]', '', title.lower()).strip()
    slug = re.sub(r'[-\s]+', '-', slug)
    if not slug:
        slug = 'blog-post'
    
    original_slug = slug
    counter = 1
    while True:
        query = Blog.query.filter_by(slug=slug)
        if current_id:
            query = query.filter(Blog.id != current_id)
        existing = query.first()
        if not existing:
            return slug
        slug = f"{original_slug}-{counter}"
        counter += 1


# ── Admin Authentication Routes ──

@routes.route('/admin')
def admin_root():
    """Automatic redirection based on authentication state."""
    if current_user.is_authenticated:
        return redirect(url_for('routes.admin_dashboard'))
    return redirect(url_for('routes.admin_login'))


@routes.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    if current_user.is_authenticated:
        return redirect(url_for('routes.admin_dashboard'))

    form = LoginForm()
    if form.validate_on_submit():
        identifier = form.username_or_email.data.strip()
        password = form.password.data

        # Query by username or email
        admin = Admin.query.filter(
            (Admin.username == identifier) | (Admin.email == identifier)
        ).first()

        if admin and admin.check_password(password):
            login_user(admin, remember=form.remember_me.data)
            admin.last_login = utc_now()
            db.session.commit()
            flash('Logged in successfully.', 'success')
            next_page = request.args.get('next')
            if next_page and next_page.startswith('/admin'):
                return redirect(next_page)
            return redirect(url_for('routes.admin_dashboard'))
        else:
            flash('Invalid username/email or password.', 'error')

    return render_template('admin/login.html', form=form)


@routes.route('/admin/logout')
@admin_required
def admin_logout():
    logout_user()
    flash('You have been logged out.', 'info')
    return redirect(url_for('routes.admin_login'))


@routes.route('/admin/forgot-password', methods=['GET', 'POST'])
def admin_forgot_password():
    if current_user.is_authenticated:
        return redirect(url_for('routes.admin_dashboard'))

    form = ForgotPasswordForm()
    if request.method == 'GET':
        form.email.data = os.environ.get('ADMIN_EMAIL', 'julius2000trichy@gmail.com')

    if form.validate_on_submit():
        email = form.email.data.strip().lower()
        admin = Admin.query.filter_by(email=email).first()

        if admin:
            # Generate unguessable token
            raw_token = uuid.uuid4().hex + uuid.uuid4().hex
            token_hash = hashlib.sha256(raw_token.encode('utf-8')).hexdigest()
            expires_at = utc_now() + timedelta(hours=1)

            # Invalidate any old tokens for this admin
            PasswordResetToken.query.filter_by(admin_id=admin.id, used=False).update({'used': True})

            # Save new reset token
            reset_record = PasswordResetToken(
                admin_id=admin.id,
                token_hash=token_hash,
                expires_at=expires_at,
                used=False
            )
            db.session.add(reset_record)
            db.session.commit()

            # Construct reset URL using SERVER_BASE_URL if configured
            server_base_url = os.environ.get('SERVER_BASE_URL', '').rstrip('/')
            if server_base_url:
                reset_url = f"{server_base_url}/admin/reset-password/{raw_token}"
            else:
                reset_url = url_for('routes.admin_reset_password', token=raw_token, _external=True)

            # Send email
            sent, msg = send_password_reset_email(admin.email, reset_url)
            flash('Instructions to reset your password have been sent to your email.', 'info')
            return redirect(url_for('routes.admin_login'))
        else:
            # Avoid exposing registered emails for security
            flash('Instructions to reset your password have been sent to your email.', 'info')
            return redirect(url_for('routes.admin_login'))

    return render_template('admin/forgot_password.html', form=form)


@routes.route('/admin/reset-password/<token>', methods=['GET', 'POST'])
def admin_reset_password(token):
    if current_user.is_authenticated:
        return redirect(url_for('routes.admin_dashboard'))

    token_hash = hashlib.sha256(token.encode('utf-8')).hexdigest()
    record = PasswordResetToken.query.filter_by(token_hash=token_hash, used=False).first()

    if not record or not record.is_valid():
        flash('Password reset token is invalid or has expired. Please request a new one.', 'error')
        return redirect(url_for('routes.admin_forgot_password'))

    form = ResetPasswordForm()
    if form.validate_on_submit():
        admin = record.admin
        admin.set_password(form.password.data)
        record.used = True
        db.session.commit()

        flash('Your password has been successfully updated. You can now log in.', 'success')
        return redirect(url_for('routes.admin_login'))

    return render_template('admin/reset_password.html', form=form, token=token)


@routes.route('/admin/change-password', methods=['GET', 'POST'])
@admin_required
def admin_change_password():
    form = ChangePasswordForm()
    if form.validate_on_submit():
        if not current_user.check_password(form.current_password.data):
            flash('Current password is incorrect.', 'error')
        else:
            current_user.set_password(form.new_password.data)
            db.session.commit()
            flash('Password changed successfully!', 'success')
            return redirect(url_for('routes.admin_dashboard'))

    return render_template('admin/change_password.html', form=form)


# ── Admin Dashboard & Management Routes ──

@routes.route('/admin/dashboard')
@admin_required
def admin_dashboard():
    all_blogs = Blog.query.order_by(Blog.created_at.desc()).all()
    all_leads = ChatbotLead.query.order_by(ChatbotLead.created_at.desc()).all()

    total_count = len(all_blogs)
    published_count = sum(1 for b in all_blogs if b.published)
    draft_count = total_count - published_count
    latest_blog = all_blogs[0] if all_blogs else None

    counts = {
        'total': total_count,
        'published': published_count,
        'drafts': draft_count,
        'leads': len(all_leads)
    }

    return render_template(
        'admin/dashboard.html',
        blogs=all_blogs,
        leads=all_leads,
        counts=counts,
        latest=latest_blog
    )


@routes.route('/admin/leads/export-csv')
@admin_required
def admin_leads_export_csv():
    leads = ChatbotLead.query.order_by(ChatbotLead.created_at.desc()).all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(['Lead ID', 'Name', 'Email', 'Phone Number', 'Interested Service', 'Message / Query', 'Timestamp'])
    
    for lead in leads:
        writer.writerow([
            lead.id,
            lead.name or 'N/A',
            lead.email,
            lead.phone,
            lead.service_interest or 'General Inquiry',
            lead.message or '',
            lead.created_at.strftime('%Y-%m-%d %H:%M:%S') if lead.created_at else ''
        ])
        
    output.seek(0)
    filename = f"riverbird_leads_{utc_now().strftime('%Y%m%d_%H%M%S')}.csv"
    
    return Response(
        output.getvalue(),
        mimetype='text/csv',
        headers={
            'Content-Disposition': f'attachment; filename={filename}'
        }
    )


@routes.route('/admin/leads/delete/<int:lead_id>', methods=['POST'])
@admin_required
def admin_lead_delete(lead_id):
    lead = db.get_or_404(ChatbotLead, lead_id)
    db.session.delete(lead)
    db.session.commit()
    flash('Lead record removed successfully.', 'info')
    return redirect(url_for('routes.admin_dashboard'))


# ── Public AI Chatbot API Endpoints ──

@routes.route('/api/chatbot/message', methods=['POST'])
def api_chatbot_message():
    data = request.get_json(silent=True) or {}
    user_msg = data.get('message', '').strip()
    history = data.get('history', [])

    if not user_msg:
        return jsonify({'error': 'Message cannot be empty.'}), 400

    bot_response = generate_bot_response(user_msg, history)
    return jsonify(bot_response)


@routes.route('/api/chatbot/submit-lead', methods=['POST'])
def api_chatbot_submit_lead():
    data = request.get_json(silent=True) or {}
    email = data.get('email', '').strip()
    phone = data.get('phone', '').strip()
    name = data.get('name', '').strip()
    service = data.get('service', 'General Inquiry').strip()
    message = data.get('message', '').strip()

    if not email or not phone:
        return jsonify({'success': False, 'error': 'Both Email and Phone Number are required.'}), 400

    email_regex = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    if not re.match(email_regex, email):
        return jsonify({'success': False, 'error': 'Please enter a valid email address.'}), 400

    clean_phone = re.sub(r'[^\d+]', '', phone)
    if len(clean_phone) < 7:
        return jsonify({'success': False, 'error': 'Please enter a valid phone number.'}), 400

    new_lead = ChatbotLead(
        name=name if name else 'Website Visitor',
        email=email,
        phone=phone,
        service_interest=service if service else 'General Inquiry',
        message=message
    )

    db.session.add(new_lead)
    db.session.commit()

    return jsonify({
        'success': True,
        'message': 'Thank you! Your details have been stored. Our team will contact you shortly.'
    })



# ── Public Blog & Image API Endpoints ──

@routes.route('/api/blogs')
def api_blogs():
    """Public JSON API returning published blogs ordered by publication date descending."""
    published_blogs = Blog.query.filter_by(published=True).order_by(
        Blog.published_at.desc(), Blog.created_at.desc()
    ).all()
    return jsonify([blog.to_dict() for blog in published_blogs])


@routes.route('/api/blogs/<int:blog_id>/image')
@routes.route('/api/blogs/<int:blog_id>/image/<path:filename>')
def api_blog_image(blog_id, filename=None):
    """
    Delivers a blog post's featured image seamlessly across production deployments.
    Guarantees image availability even when local filesystem is reset.
    """
    blog = db.session.get(Blog, blog_id)
    if not blog:
        return _serve_fallback_image("Blog Not Found")

    # 1. External URL
    if blog.featured_image:
        img_str = blog.featured_image.strip()
        if img_str.startswith(('http://', 'https://')):
            return redirect(img_str, code=302)

    # 2. Database Persistent Image Data
    if blog.image_data:
        mimetype = blog.image_mimetype or 'image/jpeg'
        etag = f'"{hashlib.md5(blog.image_data).hexdigest()}"'
        if request.headers.get('If-None-Match') == etag:
            return Response(status=304)
        response = Response(blog.image_data, mimetype=mimetype)
        response.headers['ETag'] = etag
        response.headers['Cache-Control'] = 'public, max-age=31536000, immutable'
        response.headers['Access-Control-Allow-Origin'] = '*'
        return response

    # 3. Disk Storage Fallback
    if blog.featured_image:
        img_rel = blog.featured_image.lstrip('/')
        local_path = os.path.join(current_app.root_path, img_rel)
        if os.path.exists(local_path) and os.path.isfile(local_path):
            directory, name = os.path.split(local_path)
            return send_from_directory(directory, name)

    # 4. Branded SVG Fallback
    return _serve_fallback_image(blog.title if blog else "RiverBird Blog")


def _serve_fallback_image(title_text="RiverBird Blog"):
    clean_title = (title_text[:32] + '...') if len(title_text) > 32 else title_text
    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
  </defs>
  <rect width="800" height="450" fill="url(#bg)"/>
  <circle cx="400" cy="190" r="44" fill="#f55d2d" opacity="0.25"/>
  <path d="M400 162 L422 208 L378 208 Z" fill="#f55d2d"/>
  <text x="400" y="265" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="600" fill="#f8fafc" text-anchor="middle">{clean_title}</text>
  <text x="400" y="300" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="500" letter-spacing="2" fill="#94a3b8" text-anchor="middle">RIVERBIRD INSIGHTS</text>
</svg>'''
    res = Response(svg_content, mimetype='image/svg+xml')
    res.headers['Cache-Control'] = 'public, max-age=86400'
    res.headers['Access-Control-Allow-Origin'] = '*'
    return res


@routes.route('/admin/blog/create', methods=['GET', 'POST'])
@admin_required
def admin_blog_create():
    form = BlogForm()
    if form.validate_on_submit():
        raw_slug = form.slug.data.strip() if form.slug.data else ''
        if raw_slug:
            slug = generate_unique_slug(raw_slug)
        else:
            slug = generate_unique_slug(form.title.data)

        # Handle Featured Image Upload
        image_path = None
        image_bytes = None
        image_mimetype = None

        if form.image.data:
            file = form.image.data
            if file and allowed_file(file.filename):
                try:
                    file_data = file.read()
                    if len(file_data) > 10 * 1024 * 1024:
                        flash('File size exceeds maximum allowed 10 MB limit.', 'error')
                        return render_template('admin/blog_form.html', form=form, editing=False)

                    ext = file.filename.rsplit('.', 1)[1].lower()
                    filename = f"blog_{uuid.uuid4().hex[:12]}.{ext}"
                    upload_folder = os.path.join(current_app.root_path, 'static', 'uploads')
                    os.makedirs(upload_folder, exist_ok=True)
                    
                    with open(os.path.join(upload_folder, filename), 'wb') as f:
                        f.write(file_data)

                    image_path = f"static/uploads/{filename}"
                    image_bytes = file_data
                    image_mimetype = file.mimetype or f"image/{ext}"
                except Exception as e:
                    current_app.logger.error(f"Upload error: {e}")
                    flash(f"Image upload failed: {e}", 'error')
                    return render_template('admin/blog_form.html', form=form, editing=False)

        published = form.published.data
        new_blog = Blog(
            title=form.title.data.strip(),
            slug=slug,
            short_description=form.description.data.strip(),
            content=form.content.data,
            featured_image=image_path,
            image_data=image_bytes,
            image_mimetype=image_mimetype,
            category=form.category.data,
            author=current_user.username,
            published=published,
            published_at=utc_now() if published else None
        )

        db.session.add(new_blog)
        db.session.commit()

        flash('Blog post created successfully!', 'success')
        return redirect(url_for('routes.admin_dashboard'))

    return render_template('admin/blog_form.html', form=form, editing=False)


@routes.route('/admin/blog/edit/<int:blog_id>', methods=['GET', 'POST'])
@admin_required
def admin_blog_edit(blog_id):
    blog = db.get_or_404(Blog, blog_id)
    form = BlogForm(obj=blog)

    if form.validate_on_submit():
        blog.title = form.title.data.strip()
        
        raw_slug = form.slug.data.strip() if form.slug.data else ''
        if raw_slug and raw_slug != blog.slug:
            blog.slug = generate_unique_slug(raw_slug, current_id=blog.id)
        elif not raw_slug:
            blog.slug = generate_unique_slug(blog.title, current_id=blog.id)

        blog.short_description = form.description.data.strip()
        blog.content = form.content.data
        blog.category = form.category.data

        was_published = blog.published
        blog.published = form.published.data

        if blog.published and not was_published:
            blog.published_at = utc_now()

        # Handle image update if new file uploaded
        if form.image.data:
            file = form.image.data
            if file and allowed_file(file.filename):
                try:
                    file_data = file.read()
                    if len(file_data) > 10 * 1024 * 1024:
                        flash('File size exceeds maximum allowed 10 MB limit.', 'error')
                        return render_template('admin/blog_form.html', form=form, editing=True, blog=blog)

                    ext = file.filename.rsplit('.', 1)[1].lower()
                    filename = f"blog_{uuid.uuid4().hex[:12]}.{ext}"
                    upload_folder = os.path.join(current_app.root_path, 'static', 'uploads')
                    os.makedirs(upload_folder, exist_ok=True)
                    
                    # Clean up old local image file if present
                    if blog.featured_image and blog.featured_image.startswith('static/uploads/'):
                        old_path = os.path.join(current_app.root_path, blog.featured_image)
                        if os.path.exists(old_path):
                            try:
                                os.remove(old_path)
                            except OSError:
                                pass

                    with open(os.path.join(upload_folder, filename), 'wb') as f:
                        f.write(file_data)

                    blog.featured_image = f"static/uploads/{filename}"
                    blog.image_data = file_data
                    blog.image_mimetype = file.mimetype or f"image/{ext}"
                except Exception as e:
                    current_app.logger.error(f"Image update error: {e}")
                    flash(f"Failed to update image: {e}", 'error')
                    return render_template('admin/blog_form.html', form=form, editing=True, blog=blog)

        blog.updated_at = utc_now()
        db.session.commit()

        flash('Blog post updated successfully!', 'success')
        return redirect(url_for('routes.admin_dashboard'))

    # Pre-populate description field for WTF form
    if request.method == 'GET':
        form.description.data = blog.short_description
        form.content.data = blog.content

    return render_template('admin/blog_form.html', form=form, editing=True, blog=blog)


@routes.route('/admin/blog/delete/<int:blog_id>', methods=['POST'])
@admin_required
def admin_blog_delete(blog_id):
    blog = db.get_or_404(Blog, blog_id)
    
    # Remove image file from static/uploads if exists
    if blog.featured_image and blog.featured_image.startswith('static/uploads/'):
        filepath = os.path.join(current_app.root_path, blog.featured_image)
        if os.path.exists(filepath):
            try:
                os.remove(filepath)
            except OSError:
                pass

    db.session.delete(blog)
    db.session.commit()

    flash(f'Blog post "{blog.title}" deleted.', 'info')
    return redirect(url_for('routes.admin_dashboard'))


@routes.route('/blog/<slug>')
def public_blog_detail(slug):
    """Renders single blog detail page."""
    blog = Blog.query.filter_by(slug=slug, published=True).first_or_404()
    
    # Related posts in same category or recent
    related = Blog.query.filter(
        Blog.published == True,
        Blog.id != blog.id
    ).order_by(Blog.published_at.desc()).limit(3).all()

    return render_template('blog_detail.html', blog=blog, related=related)


# ── Public Static File & Page Serving ──

@routes.route('/')
def serve_index():
    safe_root = os.path.abspath(current_app.root_path)
    return send_from_directory(safe_root, 'index.html')


@routes.route('/<path:path>')
def serve_static_page(path):
    """
    Serves static HTML files or static assets from root directory securely.
    Supports directory routing aliases and path normalizations.
    """
    safe_root = os.path.abspath(current_app.root_path)
    target_path = os.path.abspath(os.path.join(safe_root, path))
    
    # Prevent Directory Traversal outside application root
    if not target_path.startswith(safe_root):
        return send_from_directory(safe_root, 'index.html')

    # Direct match for actual existing files
    if os.path.exists(target_path) and os.path.isfile(target_path):
        return send_from_directory(safe_root, path)

    clean_path = path.strip('/')

    # Alias mapping for section directories to root HTML files
    alias_map = {
        'company/index.html': 'company_index.html',
        'company': 'company_index.html',
        'digital-marketing/index.html': 'digital_marketing_index.html',
        'digital-marketing': 'digital_marketing_index.html',
        'staffing/index.html': 'staffing_index.html',
        'staffing': 'staffing_index.html',
        'contact/index.html': 'contact_index.html',
        'contact': 'contact_index.html',
        'product/index.html': 'product_index.html',
        'product': 'product_index.html',
        'careers/index.html': 'careers_index.html',
        'careers': 'careers_index.html',
    }
    if clean_path in alias_map:
        mapped_file = alias_map[clean_path]
        if os.path.exists(os.path.join(safe_root, mapped_file)):
            return send_from_directory(safe_root, mapped_file)

    # Check sub-page file name resolution (e.g. digital-marketing/video-production.html -> video-production.html)
    if '/' in clean_path:
        filename_only = clean_path.rsplit('/', 1)[1]
        file_candidate = os.path.join(safe_root, filename_only)
        if os.path.exists(file_candidate) and os.path.isfile(file_candidate):
            return send_from_directory(safe_root, filename_only)

    # Check appending .html extension
    if not path.endswith('.html') and os.path.exists(target_path + '.html'):
        return send_from_directory(safe_root, path + '.html')

    return send_from_directory(safe_root, 'index.html')
