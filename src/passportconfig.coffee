passport = require("passport")
GoogleStrategy = require("passport-google").Strategy
db = require("./databaseconnect")
dbsettings= require("../config/dbsettings")

dbconfig = dbsettings.config

# temporary error handling till I make it a system component
handleError =  (err) ->
  console.warn err

db.initializeDB dbconfig, (result) ->
  handleError result

# Passport session setup.
#   To support persistent login sessions, Passport needs to be able to
#   serialize users into and deserialize users out of the session. Typically,
#   this will be as simple as storing the user ID when serializing,
#   and finding the user by ID when deserializing.
#   However, since this example does not have a database of user records,
#   the complete Google profile is serialized and deserialized.
passport.serializeUser = (user, done) ->
  done null, user.id

passport.deserializeUser = (id, done) ->
  handleResult = (success,result) ->
    if success
      done null, result
    else
      handleError result

  db.getUserByID id, handleResult



# Use the GoogleStrategy within Passport.
#   Strategies in passport require a `validate` function, which accept
#   credentials (in this case, an OpenID identifier and profile), and invoke
#   a callback with a user object.

googleconfig =
  returnURL: "http://localhost:3000/auth/google/return"
  realm: "http://localhost:3000/"


googlehandle = (id, profile, done) ->
  # asynchronous verification
  process.nextTick ->
    # Take the id and get the user from the DB, or add it if necessary
    profile.id = id
    db.getUserByID id, (success,result) ->
      if success and result
        done null, result
      else if result and result.error
        handleError result
      else
        db.addUserToDB profile, (success,result) ->
          if success
            done null, result
          else
            handleError result

passport.use new GoogleStrategy( googleconfig , googlehandle)
exports.configuredpassport = passport
