
/*
This is the main class for handling incoming requests.

It initializes and configures the server `app`, then adds a series of routes
to the server to handle different URL paths.

### Get imports
*/
var app, passport, express,modelRoutes,authRoutes,pageRoutes;

express = require("express");
modelRoutes = require("./src/routes/modelRoutes");
authRoutes = require("./src/routes/authRoutes");
pageRoutes = require("./src/routes/pageRoutes");
passport = require("./src/passportconfig").configuredpassport;

/*
### Initialize & Configure Express
*/
app = express.createServer();
app.configure( function() {
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
    secret: "this is just a random string"
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  //files in public are served as public files
  app.use(express.static(__dirname + "/public"));
});

/*
### Add the routes and then start listening on port 3000
*/
modelRoutes.addModelRoutes(app);
authRoutes.addAuthRoutes(app,passport);
pageRoutes.addPageRoutes(app);

app.listen(3000);
