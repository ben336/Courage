//This file configures passport.  For now we are only using the google strategy

// grab passport, and the DB connection
var GoogleStrategy, db, err, googleconfig, googlehandle, passport;

passport = require("passport");

GoogleStrategy = require("passport-google").Strategy;

db = require("./databaseconnect");

err = require("./errorHandler");

// initialize the database
db.initializeDB(null, err.handle);

//Set up the serialization and Deserialization of the user.
//In this case we serialize it by returning the id, and unserialize by
//retrieving the record from the database
passport.serializeUser = function(user, done) {
  done(null, user.googleid);
};

passport.deserializeUser = function(id, done) {
  var handleResult;
  handleResult = function(success, results) {
    var user;
    user = results[0];
    if (success) {
      done(null, user);
    } else {
      err.handle(user);
    }
  };
  db.getUserByID(id, handleResult);
};

/*
Here we set up the Google strategy, with a config object and then a
handle function to take the profile information and store it in the db if
necessary before returning a db record to represent the user

this should probably be split out somewhere
*/
googleconfig = {
  returnURL: "http://localhost:3000/auth/google/return",
  realm: "http://localhost:3000/"
};

googlehandle = function(id, profile, done) {
  /* asynchronous verification*/
  process.nextTick(function() {
    profile.id = id;
    /*
    Take the id and get the user from the DB, or add it if necessary
    this got a bit confusing, but results is the returned user
    if the user is available, an empty array if not found,
    and an error message if there is a problem
    */
    db.getUserByID(id, function(success, results) {
      var user;
      user = results[0];
      if (success && user) {
        done(null, user);
      } else if (results && results.error) {
        err.handle(results);
      } else {
        db.addUserToDB(profile, function(success, results) {
          if (success) {
            done(null, results[0]);
          } else {
            err.handle(results);
          }
        });
      }
    });
  });
};

passport.use(new GoogleStrategy(googleconfig, googlehandle));

exports.configuredpassport = passport;

