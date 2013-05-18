#
# This file configures passport.  For now we are only using the google strategy
#

# grab passport, and the DB connection
passport = require("passport")
GoogleStrategy = require("passport-google").Strategy
db = require("./databaseconnect")
dbsettings= require("../config/dbsettings")

dbconfig = dbsettings.config

# temporary error handling till I make it a system component
handleError =  (err) ->
  console.warn err

# initialize the database
db.initializeDB dbconfig, (err) ->
  handleError err

# Set up the serialization and Deserialization of the user.
# In this case we serialize it by returning the id, and unserialize by
# retrieving the record from the database


passport.serializeUser = (user, done) ->
  done null, user.googleid

passport.deserializeUser = (id, done) ->
  handleResult = (success,result) ->
    if success
      done null, result
    else
      handleError result
  db.getUserByID id, handleResult


# Here we set up the Google strategy, with a config object and then a
# handle function to take the profile information and store it in the db if
# necessary before returning a db record to represent the user

# this should probably be split out somewhere
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


# export the configured passport object
exports.configuredpassport = passport
