const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = app => {
  app.use(
    ['/api', '/socket.io'],
    createProxyMiddleware({
      target: 'http://localhost:3100',
      xfwd: true,
      changeOrigin: true,
      ws: true,
    }),
  );
};
