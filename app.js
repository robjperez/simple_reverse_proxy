const express = require('express');
const proxy = require('http-proxy-middleware');
const cors = require('cors');

const processUrl = (originalUrl) => {
  const urlRegExp = new RegExp(`^/([a-zA-Z0-9:.-]+.(?:opentok.com|tokbox.com)[:0-9]*)/(.*)$`);
  const matches = originalUrl.match(urlRegExp);
  if (!matches || matches.length < 3) {
    return 'https://tokbox.com';
  }
  const returnUrl = `https://${matches[1]}/${matches[2]}`;
  console.log(`${originalUrl} -> ${returnUrl}`)
  return returnUrl;
};

const proxyRouter = (req) => {
  if (!req.originalUrl && !req.url) {
    return '';
  }
  return processUrl(req.originalUrl || req.url);
};

const otProxy = proxy({
  target: 'https://tokbox.com', // Not really used since we are changing the target with router function
  router: proxyRouter,
  changeOrigin: true,
  ignorePath: true,
  ws: true,
});

const app = express()
const PORT = 3000;
app.use(`/`, cors(), otProxy);
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
process.once('SIGINT', () => { server.close(); });
