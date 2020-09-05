const express = require('express');
const proxy = require('http-proxy-middleware');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const https = require('https');

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
const PORT = process.env.PORT || 3000;
app.use('/', cors(), otProxy);
app.use('/proxy', cors(), otProxy);
//const server = app.listen(PORT, () => console.log(`Reverse proxy started.`))
//process.once('SIGINT', () => { server.close(); });

const key = fs.readFileSync(path.join(__dirname, 'selfsigned.key'));
const cert = fs.readFileSync(path.join(__dirname, 'selfsigned.crt'));
const options = {
  key: key,
  cert: cert
};
const httpsServer = https.createServer(options, app);
httpsServer.listen(PORT, () => console.log(`Reverse proxy started.`))
process.once('SIGINT', () => { httpsServer.close(); });

