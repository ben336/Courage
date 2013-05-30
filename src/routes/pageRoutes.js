
var security = require("../util/security");

function addPageRoutes(app) {
  /*
  root route
  */
  app.get("/", function(req, res) {
    res.render("index", {
      user: req.user
    });
  });

  /*
  account route
  */
  app.get("/account", security.ensureAuthenticated, function(req, res) {
    res.render("account", {
      user: req.user
    });
  });
}


exports.addPageRoutes = addPageRoutes;