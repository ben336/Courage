require "coffee-script"
express = require "express"
passportconfig = require "./src/passportconfig"

passport = passportconfig.configuredpassport
app = express.createServer()

# Simple route middleware to ensure user is authenticated.
#   Use this route middleware on any resource that needs to be protected.  If
#   the request is authenticated (typically via a persistent login session),
#   the request will proceed.  Otherwise, the user will be redirected to the
#   login page.
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
  app.use(express.static(__dirname + "/../../public"))



app.get "/", (req, res) ->
  res.render "index", { user: req.user }

app.get "/account", ensureAuthenticated, (req, res) ->
  res.render "account", { user: req.user }

app.get "/login", (req, res) ->
  res.render "login", { user: req.user }


# GET /auth/google
#   Use passport.authenticate() as route middleware to authenticate the
#   request.  The first step in Google authentication will involve redirecting
#   the user to google.com.  After authenticating, Google will redirect the
#   user's db entry back to this application at /auth/google/return
app.get "/auth/google",
  passport.authenticate("google", { failureRedirect: "/login" }), (req, res) ->
    res.redirect("/")

# GET /auth/google/return
#   Use passport.authenticate() as route middleware to authenticate the
#   request.  If authentication fails, the user will be redirected back to the
#   login page.  Otherwise, the primary route function function will be called,
#   which, in this example, will redirect the user to the home page.
app.get "/auth/google/return",
  passport.authenticate("google", { failureRedirect: "/login" }), (req, res) ->
    res.redirect("/")

app.get "/logout", (req, res) ->
  req.logout()
  res.redirect "/"

app.listen 3000



