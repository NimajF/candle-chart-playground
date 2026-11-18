import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, type Plugin } from 'vite';

// Production serves /app from app.html via Vercel's cleanUrls. This does the same in `vite dev`.
function appRoute(): Plugin {
  return {
    name: 'app-route',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (req.url === '/app' || req.url?.startsWith('/app?')) req.url = '/app.html';
        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), appRoute()],
  build: {
    rollupOptions: {
      // Two pages: the landing at / (index.html) and the playground at /app (app.html).
      input: {
        landing: fileURLToPath(new URL('./index.html', import.meta.url)),
        app: fileURLToPath(new URL('./app.html', import.meta.url)),
      },
    },
  },
});
