
/*
This is the main class for handling incoming requests, using express to
route them appropriately
*/
var app, passport, express,modelRoutes,authRoutes,pageRoutes;

express = require("express");

modelRoutes = require("./src/routes/modelRoutes");
authRoutes = require("./src/routes/authRoutes");
pageRoutes = require("./src/routes/pageRoutes");
passport = require("./src/passportconfig").configuredpassport;

app = express.createServer();

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

/* Add the routes */
modelRoutes.addModelRoutes(app);
authRoutes.addAuthRoutes(app,passport);
pageRoutes.addPageRoutes(app);


app.listen(3000);
