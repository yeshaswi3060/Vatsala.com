import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // Prefer STORE_DOMAIN but fallback to SHOP_DOMAIN for compatibility
  const storeDomain = env.VITE_SHOPIFY_STORE_DOMAIN || env.VITE_SHOPIFY_SHOP_DOMAIN || 'your-shop.myshopify.com';

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/shopify/admin': {
          target: `https://${storeDomain}/admin/api`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/shopify\/admin/, ''),
          secure: true,
          headers: {
            'Origin': `https://${storeDomain}` // Spoof origin to satisfy Shopify
          }
        }
      }
    }
  }
})
