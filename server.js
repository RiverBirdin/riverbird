/**
 * Local development server for Riverbird's clean URLs.
 *
 * Run: node server.js
 * Then open: http://127.0.0.1:5501/best-web-development
 *
 * Production uses the matching Apache rules in .htaccess.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT) || 5501;
const ROOT = __dirname;

const routes = {
  home: 'index.html',
  aboutus: 'about-us.html',
  blog: 'blog.html',
  'development-solution': 'development-solution.html',
  'best-software-solution': 'software-solution.html',
  'best-web-development': 'web-development.html',
  'best-application-development': 'application-development.html',
  'best-digital-marketing': 'digital-marketing.html',
  'social-media-marketing': 'social-media-marketing.html',
  'personal-branding': 'personal-branding.html',
  'influencer-marketing': 'influencer-marketing.html',
  'search-engine-optimization': 'search-engine-optimization.html',
  'lead-generation': 'lead-generation.html',
  'google-and-meta-ads': 'google-and-meta-ads.html',
  'video-production-services': 'video-production-services.html',
  'graphic-design-services': 'graphic-design-services.html',
  'branding-services': 'branding-services.html',
  'staffing-solutions': 'staffing-solutions.html',
  'talent-management': 'talent-management.html',
  'hire-talent': 'hire-talent.html',
  'hr-services': 'hr-services.html',
  products: 'products.html',
  careers: 'careers.html',
  contact: 'contact.html',
  'privacy-policy': 'privacy-policy.html',
  'terms-of-service': 'terms-of-service.html',
  'refund-policy': 'refund-policy.html'
};

const legacyRoutes = {
  ...Object.fromEntries(Object.entries(routes).map(([cleanPath, filename]) => [filename, cleanPath])),
  'index.html': 'home',
  'about.html': 'aboutus',
  'blog_index.html': 'blog',
  'development_index.html': 'development-solution',
  'software.html': 'best-software-solution',
  'web.html': 'best-web-development',
  'app.html': 'best-application-development',
  'digital_marketing_index.html': 'best-digital-marketing',
  'social-media.html': 'social-media-marketing',
  'seo.html': 'search-engine-optimization',
  'paid-ads.html': 'google-and-meta-ads',
  'video-production.html': 'video-production-services',
  'graphic-design.html': 'graphic-design-services',
  'brand-identity.html': 'branding-services',
  'staffing_index.html': 'staffing-solutions',
  'manpower.html': 'hr-services',
  'product_index.html': 'products',
  'careers_index.html': 'careers',
  'contact_index.html': 'contact',
  'privacy_policy.html': 'privacy-policy',
  'terms_of_service.html': 'terms-of-service',
  'refund_and_cancellation.html': 'refund-policy',
  'thank.html': 'thanks.html'
};

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8'
};

function sendNotFound(response) {
  response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  response.end('Not found');
}

http.createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host || '127.0.0.1'}`);
  const pathname = decodeURIComponent(url.pathname).replace(/^\/+|\/+$/g, '');

  if (!pathname) {
    response.writeHead(302, { Location: '/home' });
    response.end();
    return;
  }

  if (legacyRoutes[pathname]) {
    response.writeHead(301, { Location: `/${legacyRoutes[pathname]}${url.search}` });
    response.end();
    return;
  }

  const requestedFile = routes[pathname] || pathname;
  const filePath = path.resolve(ROOT, requestedFile);
  if (!filePath.startsWith(`${ROOT}${path.sep}`)) {
    sendNotFound(response);
    return;
  }

  fs.stat(filePath, (error, stats) => {
    if (error || !stats.isFile()) {
      sendNotFound(response);
      return;
    }

    response.writeHead(200, {
      'Content-Type': mimeTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-cache'
    });
    fs.createReadStream(filePath).pipe(response);
  });
}).listen(PORT, '127.0.0.1', () => {
  console.log(`Riverbird local server: http://127.0.0.1:${PORT}/home`);
});
