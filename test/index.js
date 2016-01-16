
/**
 * Module dependencies
 */

const test = require('tape');
const net = require('net');
const wally = require('..');

const PORT = 8001;

const request = require('request').defaults({
  proxy: 'http://localhost:' + PORT,
  tunnel: true
});


test('Should throw if no options are passed', function(t) {

  t.throws(function() {
    var proxy = wally();
  });

  t.end();

});


test('Should throw if both `filter` and `blacklist` options are passed', function(t) {

  t.throws(function() {
    var proxy = wally({
      filter: function() { return true; },
      blacklist: ['www.github.com']
    });
  });

  t.end();

});


test('Should get an instance of Wally with blacklist', function(t) {

  var proxy = wally({
    blacklist: ['www.github.com']
  });

  t.ok(proxy instanceof net.Server, 'proxy is a net.Server instance');
  t.end();

});


test('Clients should NOT connect to an host present in `blacklist` option', function(t) {

  var proxy = wally({
    blacklist: ['www.github.com']
  });

  proxy.listen(PORT, function() {

    request('https://www.github.com', function(err, res, body) {
      proxy.close();
      t.equal(err.code, 'ECONNRESET', 'Error should be ECONNRESET');
      t.end();
    });

  });

});


test('Clients should connect to a non-blacklisted host', function(t) {

  var proxy = wally({
    blacklist: ['www.github.com']
  });

  proxy.listen(PORT, function() {

    request('https://www.trello.com', function(err, res, body) {
      proxy.close();
      t.ok(body.length > 0, 'HTTPS received body should be not null');
      t.ok(~body.indexOf('</body>'), 'HTTPS received body should be NOT encrypted');
      t.end();
    });

  });

});


test('Clients should NOT connect to an host blocked by `filter` function', function(t) {

  var proxy = wally({
    filter: function(host) {
      if (host === 'www.github.com') return true;
    }
  });

  proxy.listen(PORT, function() {

    request('https://www.github.com', function(err, res, body) {
      proxy.close();
      t.equal(err.code, 'ECONNRESET', 'Error should be ECONNRESET');
      t.end();
    });

  });

});


test('Clients should NOT connect to an host blocked by `filter` function', function(t) {

  var proxy = wally({
    filter: function(host) {
      if (host === 'www.github.com') return true;
    }
  });

  proxy.listen(PORT, function() {

    request('https://www.trello.com', function(err, res, body) {
      proxy.close();
      t.ok(body.length > 0, 'HTTPS received body should be not null');
      t.ok(~body.indexOf('</body>'), 'HTTPS received body should be NOT encrypted');
      t.end();
    });

  });

});

