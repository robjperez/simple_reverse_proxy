# Simple Reverse Proxy for Opentok services

This proxy will forward all requests to it to opentok.com or tokbox.com

If you do a request to `https://PROXY_IP_ADDRESS/subdomain.tokbox.com/foo/bar?a=b`, It will forward it to `https://subdomain.tokbox.com/foo/bar?a=b`

## Running

```
$ npm install
$ npm start
```


