
/*
This is the main file for handling mosaics.
*/
var create, crypto, db, err, getPage, newMessage, getMessages;

db = require("./databaseconnect");
err = require("./errorHandler");
crypto = require("crypto");

/*
initialize the database
*/
db.initializeDB(null, err.handle);

/*
Create a new mosaic from the basic data
*/
create = function(mosaicData, user, callback) {
  mosaicData.owner = user;
  mosaicData.key = generateKey();

  //get the user and then create the mosaic with it
  db.getUserOrCreate(mosaicData.target,createMosaic, function() {
    err.handle("something went wrong getting a user for a new mosaic");
  });

  // function to create mosaic
  function createMosaic(targetuser) {

    mosaicData.target = targetuser;
    db.addMosaicToDB(mosaicData, function(results) {

      callback(results[0]);
    }, function() {

      err.handle("Something went wrong creating a mosaic");
    });

  }
};

/*
Get the information for the current mosaic, then render the page
*/
getPage = function(key, req, res) {
  db.getMosaicByKey(key, function(results) {
    var gotData, mosaicData;
    gotData = results && !results.error && results.length;
    mosaicData = gotData ? results[0] : {};
    res.render("mosaicpage", {
      user: req.user,
      mosaic: mosaicData
    });
  },
  function() {
    err.handle("Something went wrong looking up the mosaic");
  });
};

/*
Create a new message
*/

newMessage = function(messageData,user,callback){
  messageData.writer = user;
  db.addMessageToDB(messageData,function(){
    callback(true);
  },function() {
    err.handle("Problem adding message to db");
    callback(false);
  });
};

/**
Get a list of the messages for the mosaic
**/
getMessages = function(data, callback) {
  db.getMessagesForMosaicKey(data.key,function(results){
    callback({
      messages:results
    });
  }, function(){
    err.handle("Can't get messages for Key");
    callback({
      messages: []
    });
  });
};

/**
Creates a hash key to serve as a unique identifier for the mosaic
**/
function generateKey() {
  return crypto.randomBytes(20).toString("hex");
}

/*
export the functions
*/
exports.create = create;

exports.getPage = getPage;
exports.newMessage = newMessage;
exports.getMessages = getMessages;


