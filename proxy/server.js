const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  // TODO: There might be a better way to do this
  const { url }  = req.query;
  console.log(url)

  if (!url) {
    res.status(400).json({ error: 'URL parameter is missing.' });
    return;
  }

  const proxy = createProxyMiddleware({
    target: url,
    changeOrigin: true,
    followRedirects: true,
    pathRewrite: function (path, req) { 
      return '' 
    },
  });

  // Use the proxy middleware
  proxy(req, res, () => {});
});

app.listen(port, () => {
  console.log(`Proxy server is running on port ${port}`);
});
