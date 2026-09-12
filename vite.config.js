import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import { localApiMiddleware } from './vite-plugins/localApiMiddleware.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Server-only env vars (ADMIN_PASSWORD, FIREBASE_ADMIN_*, CLOUDINARY_*, ...)
  // aren't picked up by Node automatically the way Vercel's runtime does it —
  // load them from .env into process.env so the /api handlers (run locally
  // via localApiMiddleware) can read them exactly as they do in production.
  const env = loadEnv(mode, process.cwd(), '')
  Object.assign(process.env, env)

  return {
    plugins: [react(), tailwindcss(), localApiMiddleware()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/firebase') || id.includes('node_modules/@firebase')) return 'firebase';
            if (id.includes('node_modules/gsap')) return 'gsap';
            if (id.includes('node_modules/framer-motion') || id.includes('node_modules/motion-dom')) return 'framer-motion';
          },
        },
      },
    },
  }
})
