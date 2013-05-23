
var create, crypto, db, err, getPage;

db = require("./databaseconnect");

err = require("./errorHandler");

crypto = require("crypto");

// initialize the database
db.initializeDB(null, err.handle);

// Create a new mosaic from the basic data
create = function(mosaicData, user, callback) {
  var email;
  mosaicData.owner = user;
  mosaicData.key = crypto.randomBytes(20).toString("hex");
  email = mosaicData.target.emails[0].value;
  db.getUserByEmail(email , function(success, results) {
    if (results && !results.error) {
      if (results.length) {
        mosaicData.target = results[0];
        db.addMosaicToDB(mosaicData, callback);
      } else {
        db.addUserToDB(mosaicData.target, function(success, results) {
          if (results && !results.error && results.length) {
            mosaicData.target = results[0];
            db.addMosaicToDB(mosaicData, function(success, results) {
              if (results && !results.error) {
                callback(results[0]);
              } else {
                err.handle("Something went wrong creating a mosaic");
              }
            });
          } else {
            err.handle("Something went wrong creating a new user");
          }
        });
      }
    } else {
      err.handle("something went wrong getting a user for a new mosaic");
    }
  });
};

// Get the information for the current mosaic, then render the page
getPage = function(key, req, res) {
  db.getMosaicByKey(key, function(success, results) {
    var gotData, mosaicData;
    gotData = results && !results.error && results.length;
    mosaicData = gotData ? results[0] : {};
    res.render("mosaicpage", {
      user: req.user,
      mosaic: mosaicData
    });
  });
};

// export the functions
exports.create = create;

exports.getPage = getPage;


