// Lets `npm run dev` alone serve the /api/*.js serverless functions locally,
// without needing the Vercel CLI (which — as of this Vite version's very new
// Rolldown-based dev server — has a proxy incompatibility that corrupts
// non-ASCII characters in index.html mid-request). This middleware emulates
// just enough of Vercel's Node function runtime (req.body parsing, the
// res.status()/res.json()/res.send() helpers) for our handlers to run
// unmodified — the same files deploy to Vercel as-is in production.

const ROUTES = {
  '/api/admin-login': '/api/admin-login.js',
  '/api/contact': '/api/contact.js',
  '/api/upload-signature': '/api/upload-signature.js',
  '/api/sitemap.xml': '/api/sitemap.xml.js',
};

function readJsonBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

function enhanceResponse(res) {
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (body) => {
    if (!res.getHeader('Content-Type')) res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(body));
  };
  res.send = (body) => {
    if (typeof body === 'object' && body !== null) return res.json(body);
    res.end(body);
  };
  return res;
}

export function localApiMiddleware() {
  return {
    name: 'local-api-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const urlPath = req.url.split('?')[0];
        const modulePath = ROUTES[urlPath];
        if (!modulePath) return next();

        try {
          if (req.method !== 'GET' && req.method !== 'HEAD') {
            req.body = await readJsonBody(req);
          }
          enhanceResponse(res);
          const mod = await server.ssrLoadModule(modulePath);
          await mod.default(req, res);
        } catch (err) {
          console.error(`[local-api] ${urlPath} failed:`, err);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Local dev API error — check the terminal.' }));
          }
        }
      });
    },
  };
}
