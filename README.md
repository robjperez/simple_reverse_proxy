# Simple Reverse Proxy for Opentok services

This proxy will forward all requests to it to opentok.com or tokbox.com

If you do a request to `https://PROXY_IP_ADDRESS/tokbox.com/foo/bar?a=b`, It will forward it to `https://tokbox.com/foo/bar?a=b`

By default, uses key and cerfificate from selfsigned.key and selfsigned.crt files

## Running

```
$ npm install
$ npm start
```

### Create self-signed certificates
```
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./selfsigned.key -out selfsigned.crt
```



