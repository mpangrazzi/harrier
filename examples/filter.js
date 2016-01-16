
/**
 * Module dependencies
 */

var harrier = require('..')({

  filter: function filter(host) {
    if (host === 'www.github.com') return true;
  }

});


var port = 8001;

harrier.listen(port, function() {
  console.log('Harrier is on air', port);
});
