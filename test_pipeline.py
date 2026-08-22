"""
Comprehensive Production Audit & Test Suite for RiverBird.in.
Tests Database Persistence, Image API Delivery, Ephemeral Wipe Resilience, Admin CRUD, and Static Asset Links.
"""

import unittest
import os
import io
from app import create_app
from models import db, Blog, Admin

class TestRiverBirdPipeline(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.app = create_app()
        cls.app.config['TESTING'] = True
        cls.app.config['WTF_CSRF_ENABLED'] = False
        cls.client = cls.app.test_client()

    def setUp(self):
        with self.app.app_context():
            db.create_all()

    def test_01_api_blogs_and_image_endpoint(self):
        """Verify public blog list API and image endpoint serve valid data."""
        res = self.client.get('/api/blogs')
        self.assertEqual(res.status_code, 200)
        blogs = res.get_json()
        self.assertIsInstance(blogs, list)
        self.assertGreater(len(blogs), 0, "Should have blog entries in DB")

        first_blog = blogs[0]
        self.assertIn('image', first_blog)
        self.assertIn('title', first_blog)
        
        image_url = first_blog['image']
        img_res = self.client.get(image_url)
        self.assertEqual(img_res.status_code, 200)
        self.assertIn('image', img_res.content_type)
        self.assertGreater(len(img_res.data), 10)

    def test_02_ephemeral_disk_wipe_resilience(self):
        """Verify blog image endpoint delivers image from DB after local disk wipe."""
        with self.app.app_context():
            blog = Blog.query.filter(Blog.image_data != None).first()
            self.assertIsNotNone(blog, "Should have a blog with DB image_data")
            blog_id = blog.id

        # Wipe local upload directory
        upload_folder = os.path.join(self.app.root_path, 'static', 'uploads')
        if os.path.exists(upload_folder):
            for f in os.listdir(upload_folder):
                try:
                    os.remove(os.path.join(upload_folder, f))
                except OSError:
                    pass

        # Request image via API after disk wipe
        img_res = self.client.get(f'/api/blogs/{blog_id}/image')
        self.assertEqual(img_res.status_code, 200)
        self.assertIn('image', img_res.content_type)
        self.assertGreater(len(img_res.data), 100)

    def test_03_admin_blog_crud(self):
        """Test admin login, blog creation with image, editing, and deletion."""
        # 1. Login
        login_res = self.client.post('/admin/login', data={
            'username_or_email': 'riverbird_admin',
            'password': 'riverbird@admin2026'
        }, follow_redirects=True)
        self.assertEqual(login_res.status_code, 200)

        # 2. Create Blog with fake image
        fake_png_data = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15c4\x00\x00\x00\rIDATx\x9cc\xf8\xff\xff?\x03\x00\x05\xfe\x02\xfe\xa7\x96"\xca\x00\x00\x00\x00IEND\xaeB`\x82'
        fake_img = (io.BytesIO(fake_png_data), 'test_image.png')
        create_res = self.client.post('/admin/blog/create', data={
            'title': 'Automated Test Blog Post',
            'slug': 'automated-test-blog-post',
            'description': 'Short description for automated test blog.',
            'content': '<p>Full content for test post.</p>',
            'category': 'Technology',
            'published': 'y',
            'image': fake_img
        }, follow_redirects=True)
        self.assertEqual(create_res.status_code, 200)

        with self.app.app_context():
            created_blog = Blog.query.filter_by(slug='automated-test-blog-post').first()
            self.assertIsNotNone(created_blog)
            self.assertIsNotNone(created_blog.image_data)
            created_id = created_blog.id

        # 3. Test image endpoint for created blog
        img_res = self.client.get(f'/api/blogs/{created_id}/image')
        self.assertEqual(img_res.status_code, 200)

        # 4. Edit Blog without changing image
        edit_res = self.client.post(f'/admin/blog/edit/{created_id}', data={
            'title': 'Automated Test Blog Post Updated',
            'slug': 'automated-test-blog-post',
            'description': 'Updated short description.',
            'content': '<p>Updated content.</p>',
            'category': 'Technology',
            'published': 'y'
        }, follow_redirects=True)
        self.assertEqual(edit_res.status_code, 200)

        with self.app.app_context():
            updated_blog = db.session.get(Blog, created_id)
            self.assertEqual(updated_blog.title, 'Automated Test Blog Post Updated')
            self.assertIsNotNone(updated_blog.image_data, "Image data should persist on edit without new file")

        # 5. Delete Blog
        del_res = self.client.post(f'/admin/blog/delete/{created_id}', follow_redirects=True)
        self.assertEqual(del_res.status_code, 200)

        with self.app.app_context():
            deleted_blog = db.session.get(Blog, created_id)
            self.assertIsNone(deleted_blog)

    def test_04_section_route_aliases(self):
        """Verify section routing aliases work seamlessly."""
        alias_routes = [
            '/company/index.html',
            '/digital-marketing/index.html',
            '/digital-marketing/video-production.html',
            '/contact/index.html',
            '/staffing/hire-talent.html',
            '/product/index.html',
            '/careers/index.html'
        ]
        for route in alias_routes:
            res = self.client.get(route)
            self.assertEqual(res.status_code, 200, f"Route {route} failed with status {res.status_code}")
            res.close()

    def test_05_static_file_links_audit(self):
        """Scan all HTML files in workspace and confirm 0 broken static links or images."""
        import re
        html_files = [f for f in os.listdir(self.app.root_path) if f.endswith('.html')]
        broken_links = []
        broken_imgs = []

        for hf in html_files:
            file_path = os.path.join(self.app.root_path, hf)
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()

            links = re.findall(r'href=[\x22\x27]([^\x22\x27#]+)[\x22\x27]', content)
            imgs = re.findall(r'src=[\x22\x27]([^\x22\x27#]+)[\x22\x27]', content)

            for ref in links:
                if ref.startswith(('http', 'https', 'mailto:', 'tel:', 'wa.me', '//', 'javascript:')):
                    continue
                if '$' in ref or '{' in ref:
                    continue
                clean = ref.lstrip('/')
                if not os.path.exists(os.path.join(self.app.root_path, clean)):
                    broken_links.append((hf, ref))

            for ref in imgs:
                if ref.startswith(('http', 'https', 'data:', '//')):
                    continue
                if '$' in ref or '{' in ref:
                    continue
                clean = ref.lstrip('/')
                if not os.path.exists(os.path.join(self.app.root_path, clean)):
                    broken_imgs.append((hf, ref))

        self.assertEqual(len(broken_links), 0, f"Found broken links: {broken_links}")
        self.assertEqual(len(broken_imgs), 0, f"Found broken images: {broken_imgs}")

    def test_06_etag_and_caching(self):
        """Verify image endpoint returns ETag header and 304 Not Modified when cached."""
        res1 = self.client.get('/api/blogs/1/image')
        self.assertEqual(res1.status_code, 200)
        etag = res1.headers.get('ETag')
        self.assertIsNotNone(etag, "ETag header must be present")

        # Request again with If-None-Match header
        res2 = self.client.get('/api/blogs/1/image', headers={'If-None-Match': etag})
        self.assertEqual(res2.status_code, 304, "Cached request should return 304 Not Modified")

if __name__ == '__main__':
    unittest.main()
