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
  aboutus: 'about.html',
  blog: 'blog_index.html',
  'development-solution': 'development_index.html',
  'best-software-solution': 'software.html',
  'best-web-development': 'web.html',
  'best-application-development': 'app.html',
  'best-digital-marketing': 'digital_marketing_index.html',
  'social-media-marketing': 'social-media.html',
  'personal-branding': 'personal-branding.html',
  'influencer-marketing': 'influencer-marketing.html',
  'search-engine-optimization': 'seo.html',
  'lead-generation': 'lead-generation.html',
  'google-and-meta-ads': 'paid-ads.html',
  'video-production-services': 'video-production.html',
  'graphic-design-services': 'graphic-design.html',
  'branding-services': 'brand-identity.html',
  'staffing-solutions': 'staffing_index.html',
  'talent-management': 'talent-management.html',
  'hire-talent': 'hire-talent.html',
  'hr-services': 'manpower.html',
  products: 'product_index.html',
  careers: 'careers_index.html',
  contact: 'contact_index.html',
  'privacy-policy': 'privacy_policy.html',
  'terms-of-service': 'terms_of_service.html',
  'refund-policy': 'refund_and_cancellation.html'
};

const legacyRoutes = Object.fromEntries(
  Object.entries(routes).map(([cleanPath, filename]) => [filename, cleanPath])
);

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
