# Simple Reverse Proxy for Opentok services

This proxy will forward all requests to it to opentok.com or tokbox.com

If you do a request to `https://PROXY_IP_ADDRESS/subdomain.tokbox.com/foo/bar?a=b`, It will forward it to `https://subdomain.tokbox.com/foo/bar?a=b`

## Running

By default the server will start on http

```
$ npm install
$ node app.js
```

### Using HTTPS

First, if you don't have already a key and a certificate you need to create one by running

```
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./selfsigned.key -out selfsigned.crt
```

By default, uses key and cerfificate from selfsigned.key and selfsigned.crt files

Then you can run:

```
USE_SSL=1; node app.js

-- or --

node app.js -use-ssl
```

