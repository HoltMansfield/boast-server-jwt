var Promise = require('bluebird');
var expressJwt = require('express-jwt');

var createSecret = function() {
  return 'learn-how-to-cert-gud';
};

var enforceJwtPolicy = function(app, excludeRoutes) {
  var secret = createSecret();

  if(excludeRoutes) {
    // tell express to enforceJwtPolicy but to exclude these specific routes
    app.use(expressJwt({ secret: secret }).unless(excludeRoutes));
  } else {
    // tell express to enforceJwtPolicy for each and every route
    app.use(expressJwt({ secret: secret }));
  }

  return Promise.resolve(app);
};

module.exports = {
  enforceJwtPolicy: enforceJwtPolicy
};
