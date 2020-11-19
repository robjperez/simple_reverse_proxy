const express = require('express');
const proxy = require('http-proxy-middleware');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

const processUrl = (originalUrl) => {
  const urlRegExp = new RegExp(`^/([a-zA-Z0-9:.-]+.(?:opentok.com|tokbox.com|t|o)[:0-9]*)/(.*)$`);
  const matches = originalUrl.match(urlRegExp);
  if (!matches || matches.length < 3) {
    return 'https://tokbox.com';
  }

  let domain = matches[1];
  const splitter = matches[1].split(":");
  if(domain.startsWith("eh.t")) domain = "enterprise.hlg.tokbox.com";
  if(domain.startsWith("h.t")) domain = "hlg.tokbox.com";
  if(domain.startsWith("as.o")) domain = "api-standard.opentok.com";
  if(domain.startsWith("c.o")) domain = "config.opentok.com";
  if(splitter.length > 1) {
    domain = domain + ":" + splitter[1];
  }

  const returnUrl = `https://${domain}/${matches[2]}`;
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
const USE_SSL = process.env.USE_SSL
  || process.argv.indexOf('-use-ssl') > -1;

app.use('/', cors(), otProxy);
app.use('/proxy', cors(), otProxy);
let server;

if (!USE_SSL) {
  console.log("Starting over HTTP");
  server = http.createServer(app);
}
else {
  console.log("Starting over HTTPS");
  const key = fs.readFileSync(path.join(__dirname, 'selfsigned.key'));
  const cert = fs.readFileSync(path.join(__dirname, 'selfsigned.crt'));
  const options = {
    key: key,
    cert: cert
  };
  server = https.createServer(options, app);
}
server.listen(PORT, () => console.log(`Reverse proxy started.`))
process.once('SIGINT', () => { server.close(); });

