
/**
 * Module dependencies
 */

var harrier = require('..')({
  blacklist: ['www.github.com']
});


var port = 8001;

harrier.listen(port, function() {
  console.log('Harrier is on air', port);
});
