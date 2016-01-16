
/**
 * Module dependencies
 */

var debug = require('debug')('proxy');
var net = require('net');


module.exports = function createServer(options) {

  // check options

  if (options.filter && options.blacklist) {
    throw new Error('only one option is allowed between `filter` and `blacklist`');
  }

  if (options.filter && typeof options.filter !== 'function') {
    throw new TypeError('option `filter` must be a function');
  }

  if (options.blacklist && !Array.isArray(options.blacklist)) {
    throw new TypeError('option `blacklist` must be an Array');
  }

  if (!options.filter && !options.blacklist) {
    console.warn('No `filter` or `blacklist` option detected: \
      proxy will run without filtering anything');
  }

  // creating filter function

  var filter = options.filter || function inBlacklist(host) {
    return ~options.blacklist.indexOf(host);
  };

  // creating TCP server

  return net.createServer(function onConnection(socket) {

    var isConnected = false;
    var proxy = new net.Socket();

    // Error listeners

    function crash(err) {
      debug(err);
      socket.destroy();
      proxy.destroy();
    }

    proxy.on('error', crash);
    socket.on('error', crash);

    // Data listeners

    socket.on('data', function onData(data) {

      if (isConnected) return;

      var msg = data.toString();
      debug('client -> proxy', msg);

      debug('checking CONNECT request header');
      var request = msg.match(/CONNECT (.*):(\d{1,3})/i);

      if (!request) {
        throw new Error('Invalid CONNECT request');
      }

      var host = request[1];
      var port = +request[2];
      debug('got CONNECT', host, port);

      // filter host

      var blocked = !!filter(host);

      if (blocked) {
        debug('host blocked by filter', host);
        return socket.destroy();
      }

      // go ahead with tunneling

      proxy.connect({
        host: host,
        port: port
      }, function onConnect() {

        debug('proxy is connecting to remote');

        socket.write('HTTP/1.1 200 OK\r\n\r\n', 'utf8', function() {

          debug('proxy is allowing CONNECT tunnel');

          isConnected = true;
          var pipe = proxy.pipe(socket).pipe(proxy);

          debug('client <-> proxy tunnel start');

          pipe.on('end', function onEnd() {
            debug('client <-> proxy tunnel end');
            isConnected = false;
            socket.end();
            proxy.end();
          });

        });

      });

    });

  });

};
