import { createProxyMiddleware } from 'http-proxy-middleware';

export default function setupProxy(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://raw.githubusercontent.com/MwauraPatrick/Data-Visualization-Project',
      changeOrigin: true,
    })
  );
}
