const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://api.eaglevisionmri.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
    })
  );
};