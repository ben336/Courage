/**
## Auth Routes

These are the routes related to  authentication. they use passport to
authenticate the user and manage sessions
**/
function addAuthRoutes(app,passport) {
  /*
  login route
  */
  app.get("/login", function(req, res) {
    res.render("login", {
      user: req.user
    });
  });

  /*
  google authentication
  */
  app.get("/auth/google", passport.authenticate("google", {
    failureRedirect: "/login"
  }), function(req, res) {
    res.redirect("/");
  });

  /*
  google authentication 2 (this may not be necessary)
  */
  app.get("/auth/google/return", passport.authenticate("google", {
    failureRedirect: "/login"
  }), function(req, res) {
    res.redirect("/");
  });

  /*
  logout route
  */
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

}

exports.addAuthRoutes = addAuthRoutes;