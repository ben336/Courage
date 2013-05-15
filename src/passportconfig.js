var passport = require("passport"), 
  GoogleStrategy = require("passport-google").Strategy,
  db = require("./databaseconnect"),
  dbsettings= require("../config/dbsettings");

var dbconfig = dbsettings.config;



//temporary error handling till I make it a system component
function handleError (err){
  console.warn(err);
}

db.initializeDB(dbconfig,function(result){
  handleError(result);
});


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session. Typically,
//   this will be as simple as storing the user ID when serializing, 
//   and finding the user by ID when deserializing.  
//   However, since this example does not have a database of user records, 
//   the complete Google profile is serialized and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  db.getUserByID(id,function(success,result) {
    if(success) {
      done(null,result);
    }
    else {
      handleError(result);
    }
  });
});


// Use the GoogleStrategy within Passport.
//   Strategies in passport require a `validate` function, which accept
//   credentials (in this case, an OpenID identifier and profile), and invoke 
//   a callback with a user object.
passport.use(new GoogleStrategy({
    returnURL: "http://localhost:3000/auth/google/return",
    realm: "http://localhost:3000/"
  },
  function(id, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's Google profile is returned to
      // represent the logged-in user.  In a typical application, you would 
      // want to associate the Google account with a user record in your 
      // database, and return that user instead.
      profile.id = id;
      db.getUserByID(id, function(success,result) {
        if (success && result) {
          done(null,result);
        }
        else if (result && result.error) { 
          handleError(result);
        }
        else {
          db.addUserToDB(profile,function(success,result){
            if(success){
              done(null,result);
            }
            else {
              //error handling here
              handleError(result);
            }
          });
        }
      });
    });
  }
));

exports.configuredpassport = passport;
