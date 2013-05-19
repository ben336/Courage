#
# This is the main class for handling incoming requests, using express to
# route them appropriately
#

require "coffee-script"
express = require "express"
passportconfig = require "./src/passportconfig"

passport = passportconfig.configuredpassport
app = express.createServer()

# Simple route middleware to ensure user is authenticated.
ensureAuthenticated = (req, res, next) ->
  if req.isAuthenticated()
    return next()
  res.redirect "/login"

# configure Express
app.configure ->
  app.set "views", __dirname + "/views"
  app.set "view engine", "jade"
  app.set "view options", {layout: false}
  app.use express.logger()
  app.use express.cookieParser()
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use(express.session({ secret: "keyboard cat" }))
  # Initialize Passport!  Also use passport.session() middleware, to support
  # persistent login sessions (recommended).
  app.use passport.initialize()
  app.use passport.session()
  app.use app.router
  app.use(express.static(__dirname + "/public"))
  app.use(express.static(__dirname + "/app"))


# root route
app.get "/", (req, res) ->
  res.render "index", { user: req.user }

# account route
app.get "/account", ensureAuthenticated, (req, res) ->
  res.render "account", { user: req.user }

# new campaign route
app.get "/mosaic", ensureAuthenticated, (req, res) ->
  res.render "campaign", {user: req.user}

#createcampaignroute

app.get "/createmosaic", ensureAuthenticated, (req, res) ->
  name = req.query.name
  res.send {name:name}

# login route
app.get "/login", (req, res) ->
  res.render "login", { user: req.user }


# Google authentication
app.get "/auth/google",
  passport.authenticate("google", { failureRedirect: "/login" }), (req, res) ->
    res.redirect("/")

# Google Auth II
# this may be unecessary
app.get "/auth/google/return",
  passport.authenticate("google", { failureRedirect: "/login" }), (req, res) ->
    res.redirect("/")

# logout route
app.get "/logout", (req, res) ->
  req.logout()
  res.redirect "/"

# listen on port 3000
app.listen 3000