"""
RiverBird Blog Database Repair & Seeding Script.
Ensures image_data persistence, repairs legacy blog entries, and seeds demo posts.
"""

import sys
import os
import io
from PIL import Image, ImageDraw, ImageFont

def generate_sample_cover_image(title_text, category_text, color_primary=(245, 93, 45), color_bg=(15, 23, 42)):
    """Generates a high-quality JPEG binary blob for blog seeding."""
    img = Image.new('RGB', (800, 450), color=color_bg)
    draw = ImageDraw.Draw(img)
    
    # Background accent pattern
    draw.ellipse([350, 150, 450, 250], fill=(color_primary[0], color_primary[1], color_primary[2]))
    
    # Simple overlay text rendering
    try:
        font_large = ImageFont.load_default()
    except Exception:
        font_large = None
        
    draw.text((400, 200), title_text[:35], fill=(248, 250, 252), anchor="ms")
    draw.text((400, 240), f"CATEGORY: {category_text.upper()}", fill=(245, 93, 45), anchor="ms")
    draw.text((400, 280), "RIVERBIRD PRODUCTION INSIGHTS", fill=(148, 163, 184), anchor="ms")
    
    output = io.BytesIO()
    img.save(output, format='JPEG', quality=90)
    return output.getvalue()


def seed_and_repair():
    from app import create_app
    from models import db, Blog, Admin, utc_now

    app = create_app()
    with app.app_context():
        print("[1/3] Verifying database schema and connectivity...")
        db.create_all()

        existing_count = Blog.query.count()
        print(f"[2/3] Current blog count in DB: {existing_count}")

        if existing_count == 0:
            print("[3/3] Seeding initial production-quality blog posts with persistent DB image blobs...")
            demo_posts = [
                {
                    "title": "Scaling Web Applications for High Traffic & Global Performance",
                    "slug": "scaling-web-applications-high-traffic-performance",
                    "category": "Web Engineering",
                    "short_description": "Discover how modern tech stacks and resilient cloud architectures power hyper-scalable, lightning-fast web applications.",
                    "content": "<p>Building software for millions of users requires a fundamental shift in architecture. From database connection pooling and CDN caching to async worker queues, modern application development demands end-to-end performance engineering.</p><h3>Key Pillars of Scalable Web Architecture:</h3><ul><li>Microservices & API Decoupling</li><li>Edge Caching & CDN Distribution</li><li>Automated Database Indexing & Failover</li></ul>",
                    "author": "RiverBird Tech Team",
                    "primary_color": (245, 93, 45)
                },
                {
                    "title": "Mastering SEO & Search Intent to Drive High-Converting Organic Leads",
                    "slug": "mastering-seo-search-intent-organic-leads",
                    "category": "SEO & Growth",
                    "short_description": "Learn the step-by-step strategies behind ranking #1 on Google and turning organic search traffic into high-value clients.",
                    "content": "<p>Search Engine Optimization is no longer just about keyword stuffing. It is about understanding human search intent, optimizing core web vitals, and producing authoritative technical content that solves user problems.</p><h3>Our Proven Growth Framework:</h3><ol><li>Technical Core Web Vitals Audit</li><li>High-Intent Keyword Cluster Analysis</li><li>Authority Link Building & Content Promotion</li></ol>",
                    "author": "RiverBird Growth Lead",
                    "primary_color": (14, 165, 233)
                },
                {
                    "title": "Building a Modern Brand Identity: Strategy, Visuals & Digital Presence",
                    "slug": "building-modern-brand-identity-strategy-visuals",
                    "category": "Brand & Design",
                    "short_description": "How a unified visual brand identity, modern UI/UX design, and compelling video production transform customer perception.",
                    "content": "<p>Your brand identity is the emotional bridge between your vision and your audience. A cohesive design system elevates trust, accelerates user conversion, and establishes market leadership.</p><p>RiverBird crafts full visual ecosystems tailored for corporate scaling and digital growth.</p>",
                    "author": "RiverBird Creative Director",
                    "primary_color": (168, 85, 247)
                }
            ]

            for post in demo_posts:
                img_bytes = generate_sample_cover_image(post["title"], post["category"], color_primary=post["primary_color"])
                
                # Save initial static cache file
                upload_folder = os.path.join(app.root_path, 'static', 'uploads')
                os.makedirs(upload_folder, exist_ok=True)
                filename = f"blog_{post['slug'][:20]}.jpg"
                filepath = os.path.join(upload_folder, filename)
                with open(filepath, 'wb') as f:
                    f.write(img_bytes)

                blog = Blog(
                    title=post["title"],
                    slug=post["slug"],
                    short_description=post["short_description"],
                    content=post["content"],
                    featured_image=f"static/uploads/{filename}",
                    image_data=img_bytes,
                    image_mimetype="image/jpeg",
                    category=post["category"],
                    author=post["author"],
                    published=True,
                    published_at=utc_now()
                )
                db.session.add(blog)

            db.session.commit()
            print(f"[SUCCESS] Seeded {len(demo_posts)} blog posts with persistent DB image blobs.")
        else:
            # Repair existing blogs if image_data is missing but disk file exists
            blogs = Blog.query.all()
            repaired = 0
            for b in blogs:
                if not b.image_data and b.featured_image:
                    img_rel = b.featured_image.lstrip('/')
                    local_path = os.path.join(app.root_path, img_rel)
                    if os.path.exists(local_path) and os.path.isfile(local_path):
                        with open(local_path, 'rb') as f:
                            b.image_data = f.read()
                        ext = local_path.rsplit('.', 1)[-1].lower()
                        b.image_mimetype = f"image/{ext}" if ext != 'jpg' else 'image/jpeg'
                        repaired += 1
            if repaired > 0:
                db.session.commit()
                print(f"[REPAIR SUCCESS] Backfilled image_data for {repaired} existing blog records.")

        print("\n=== SYSTEM HEALTH CHECK ===")
        all_blogs = Blog.query.all()
        for b in all_blogs:
            print(f"ID {b.id} | Slug: {b.slug} | Image URL: {b.get_image_url()} | Image Data Size: {len(b.image_data) if b.image_data else 0} bytes")

if __name__ == '__main__':
    seed_and_repair()
