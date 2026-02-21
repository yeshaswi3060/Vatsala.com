import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import fs from 'fs'
import path from 'path'

// Custom plugin to run Vercel API routes locally in Vite
const vercelApiMock = () => ({
  name: 'vercel-api-mock',
  configureServer(server: any) {
    server.middlewares.use(async (req: any, res: any, next: any) => {
      if (req.url && req.url.startsWith('/api/')) {
        const [urlPath] = req.url.split('?');
        const filePath = path.join(process.cwd(), urlPath + '.js');

        if (!fs.existsSync(filePath)) {
          return next();
        }

        // Add Vercel response helpers
        res.status = (code: number) => {
          res.statusCode = code;
          return res;
        };
        res.json = (data: any) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
        };

        const executeApiModule = async () => {
          try {
            const mod = await server.ssrLoadModule(urlPath + '.js');
            await mod.default(req, res);
          } catch (error: any) {
            console.error('API Error:', error);
            if (!res.headersSent) {
              res.status(500).json({ error: error.message });
            }
          }
        };

        // If it's a file upload (multipart), do NOT consume the request stream here!
        // Vercel Formidable needs the raw active stream to calculate the files.
        if (req.headers['content-type']?.includes('multipart/form-data')) {
          return executeApiModule();
        }

        let body = '';
        req.on('data', (chunk: any) => { body += chunk; });
        req.on('end', async () => {
          if (body) {
            try { req.body = JSON.parse(body); } catch (e) { }
          } else {
            req.body = {};
          }
          await executeApiModule();
        });
      } else {
        next();
      }
    });
  }
});

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // Inject all .env variables into process.env so Vercel hooks can read them locally
  Object.assign(process.env, env);

  const storeDomain = env.VITE_SHOPIFY_STORE_DOMAIN || env.VITE_SHOPIFY_SHOP_DOMAIN || 'your-shop.myshopify.com';

  return {
    plugins: [react(), vercelApiMock()],
    server: {
      proxy: {
        '/api/shopify/admin': {
          target: `https://${storeDomain}/admin/api`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/shopify\/admin/, ''),
          secure: true,
          headers: {
            'Origin': `https://${storeDomain}`
          }
        }
      }
    }
  }
})
