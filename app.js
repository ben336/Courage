
/*
This is the main class for handling incoming requests, using express to
route them appropriately
*/
var app, ensureAuthenticated, express, mosaic, passport, passportconfig;

express = require("express");

passportconfig = require("./src/passportconfig");

mosaic = require("./src/mosaic");

passport = passportconfig.configuredpassport;

app = express.createServer();

/*
Simple route middleware to ensure user is authenticated.
*/
ensureAuthenticated = function(req, res, next) {
  if ( req.isAuthenticated() ) {
    return next();
  }
  res.redirect("/login");
};

/*
Configure Express
*/
app.configure(function() {
  app.set("views", __dirname + "/views");
  app.set("view engine", "jade");
  app.set("view options", {
    layout: false
  });
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({
    secret: "keyboard cat"
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + "/public"));
});

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
app.get("/account", ensureAuthenticated, function(req, res) {
  res.render("account", {
    user: req.user
  });
});

/*
Mosaic Page route
*/
app.get("/mosaicpage/:key", function(req, res) {
  mosaic.getPage(req.params.key, req, res);
});

/*
new mosaic route
*/
app.get("/mosaic", ensureAuthenticated, function(req, res) {
  res.render("mosaic", {
    user: req.user
  });
});

/*
create mosaic route
*/
app.post("/createmosaic", ensureAuthenticated, function(req, res) {
  mosaic.create(req.body, req.user, function(mosaicData) {
    res.send(mosaicData);
  });
});

/*
new message route
*/
app.post("/newmessage", ensureAuthenticated, function(req, res) {
  mosaic.newMessage(req.body, req.user, function(err) {
    res.send(err);
  });
});

/*
List Messages
*/
app.post("/getmessages", function(req,res) {
  mosaic.getMessages(req.body, function(messages){
    res.send(messages);
  });
});

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

app.listen(3000);
