Harrier
======

[![Build Status](https://travis-ci.org/mpangrazzi/harrier.svg?branch=master)](https://travis-ci.org/mpangrazzi/cidr-grep)

Harrier is a simple HTTPS proxy based on [CONNECT tunneling technique](https://en.wikipedia.org/wiki/HTTP_tunnel) with **host-based filtering capabilities**.


## Install

With [npm](http://www.npmjs.org):

```bash
npm install harrier
```

## Usage

Look at `/examples` folder. Usage is pretty straightforward:

```js
var harrier = require('harrier')({
  blacklist: ['www.github.com']
});

var port = 8001;

harrier.listen(port, function() {
  console.log('Harrier is listening', port);
});
```

## var harrier = require('harrier')(options)

Available `options` are:

- `blacklist` (array): an array of hosts that you want to block
- `filter` (function): a filtering function with `function(host)` signature. It will be cached and called on every request with the `host` parameter parsed from the CONNECT request as the only argument.

**NOTE**: You can specify only **one** option between `blacklist` and `filter`.


## Test

```bash
npm test
```

## Live testing

You can also do some live-testing with CLI tools like [curl](http://curl.haxx.se). For example, you can *run* the example above and then run:

```bash
curl 'https://www.github.com' -x 127.0.0.1:8001
```

You will see something like:

```bash
curl: (56) Proxy CONNECT aborted
```

If you try with a non-blacklisted url, you will see the HTML body, which basically means that the tunnel is correctly working.


## Transparent proxing

You **can't** run this proxy transparently, so forget about routing HTTPS (SSL or TLS) packets with `iptables` to proxy's host/port.

Client must be *aware* of the proxy, otherwise they will NOT do the CONNECT tunnel.


## License

The MIT License (MIT)

Copyright (c) 2015 Michele Pangrazzi <<xmikex83@gmail.com>>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
