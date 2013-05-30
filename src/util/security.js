/*
Simple route middleware to ensure user is authenticated.
*/
var ensureAuthenticated;

ensureAuthenticated = function(req, res, next) {
  if ( req.isAuthenticated() ) {
    return next();
  }
  res.redirect("/login");
};

exports.ensureAuthenticated = ensureAuthenticated;


