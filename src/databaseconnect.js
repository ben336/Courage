
var addMessageToDB, addMosaicToDB, addQueryEvents, addUserToDB,
client, dbconfig, dbsettings, getMessageByID, getMessagesForMosaicKey,
getMosaicByKey, getUserByEmail, getUserByID, initializeDB, initialized, pg,
removeMessageByID, removeMosaicByKey, removeUserByID,getUserOrCreate;

/*
This class serves as an abstraction layer over the DB, and holds
the queries for acessing and modifying data
*/

/*
 We use the pg postgres module for connecting to the DB
*/

pg = require("pg");

dbsettings = require("./config/dbsettings");

dbconfig = dbsettings.config;

client = null;

initialized = false;

/*
Attaches callbacks to the different query related events
*/
addQueryEvents = function(exec, success, error) {
  var results;
  results = [];
  exec.on("row", function(row) {
    results.push(row);
  });
  exec.on("error", function(err) {
    error(err);
  });
  exec.on("end", function() {
    success(results);
  });
};

/*
 Start up the Database connection
 use the cfg param for config if provided, otherwise use the defaults
 if the db is already initialized it returns false
 may want to add a way to override or uninitialize if we need multiple
 configurations.  Not an issue for now
*/
initializeDB = function(cfg, callback) {
  var conn;
  if (initialized) {
    return false;
  }
  if (cfg == null) {
    cfg = dbconfig;
  }
  conn = "tcp://" + cfg.role + ":" + cfg.password +
    "@" + cfg.address + "/" + cfg.db;
  client = new pg.Client(conn);
  client.connect(callback);
};

/*
 Add a user object to the DB
 at least for now this is added in the form of google's profile object
*/
addUserToDB = function(user, success, error) {
  var email, exec, fname, id, lname, query;
  id = user.id;
  fname = user.name.givenName;
  lname = user.name.familyName;
  email = user.emails[0].value;
  query = "INSERT INTO people(googleid,firstname,lastname,email) " +
    "values($1,$2,$3,$4) RETURNING *";
  exec = client.query(query, [id, fname, lname, email]);
  addQueryEvents(exec, success, error);
};
/*
 Get the user from the DB based on their userID
*/
getUserByID = function(id, success, error) {
  var exec, query;
  query = "SELECT * FROM people where googleid = $1";
  exec = client.query(query, [id]);
  addQueryEvents(exec, success, error);
};
/*
 Get the user from the DB based on their email
*/
getUserByEmail = function(email, success, error) {
  var exec, query;
  query = "SELECT * FROM people where email = $1";
  exec = client.query(query, [email]);
  addQueryEvents(exec, success, error);
};

getUserOrCreate = function(user,success,error) {
  getUserByEmail(user.emails[0].value,function(users){
    if(users.length) {
      success(users[0]);
    } else {
      addUserToDB(user,function(users){
        success(users[0]);
      },error);
    }
  },error);
};

/*
 Remove the user from their DB by their ID
*/
removeUserByID = function(id, success, error) {
  var exec, query;
  query = "Delete FROM people where googleid = $1 RETURNING *";
  exec = client.query(query, [id]);
  addQueryEvents(exec, success, error);
};

/*
 Add a new Mosaic to the Database
*/
addMosaicToDB = function(mosaic, success, error) {
  var description, exec, key, name, owner, query, target;
  key = mosaic.key;
  name = mosaic.name;
  description = mosaic.description;
  owner = mosaic.owner.id;
  target = mosaic.target.id;
  query = "INSERT INTO mosaic(key,name,description,owner,target) " +
    "values($1,$2,$3,$4,$5) RETURNING *";
  exec = client.query(query, [key, name, description, owner, target]);
  addQueryEvents(exec, success, error);
};

/*
 Get the mosaic from the DB based on their key
*/
getMosaicByKey = function(key, success, error) {
  var exec, query;
  query = "SELECT * FROM mosaic_view where key = $1";
  exec = client.query(query, [key]);
  addQueryEvents(exec, success, error);
};

/*
 Remove the mosaic from the DB based on their key
*/
removeMosaicByKey = function(key, success, error) {
  var exec, query;
  query = "Delete FROM mosaic where key = $1 RETURNING *";
  exec = client.query(query, [key]);
  addQueryEvents(exec, success, error);
};

/*
 Add a new message to the Database
 Takes a message in the form
     {
        writer:{
          id:"",
        },
        message: "",
        snippet: "",
        mosaic{
          key:""
        }
     }
*/
addMessageToDB = function(message, success, error) {
  var exec, mosaic, msg, query, snippet, writer;
  writer = message.writer.id;
  msg = message.message;
  mosaic = message.mosaic.key;
  snippet = message.snippet;
  query = "INSERT INTO message(writer,message,snippet,mosaic) " +
  "values($1,$2,$3,$4) RETURNING *";
  exec = client.query(query, [writer, msg, snippet, mosaic]);
  addQueryEvents(exec, success, error);
};

/*
 Get the message from the DB based on their id
*/
getMessageByID = function(id, success, error) {
  var exec, query;
  query = "SELECT * FROM message where id = $1";
  exec = client.query(query, [id]);
  addQueryEvents(exec, success, error);
};

/*
 get all the messages for a given mosaic
*/
getMessagesForMosaicKey = function(key, success, error) {
  var exec, query;
  query = "SELECT * FROM message where mosaic = $1";
  exec = client.query(query, [key]);
  addQueryEvents(exec, success, error);
};

/*
 Remove the message from the DB based on their id
*/
removeMessageByID = function(id, success, error) {
  var exec, query;
  query = "Delete FROM message where id = $1 RETURNING *";
  exec = client.query(query, [id]);
  addQueryEvents(exec, success, error);
};

exports.initializeDB = initializeDB;

exports.addUserToDB = addUserToDB;

exports.getUserByID = getUserByID;

exports.getUserByEmail = getUserByEmail;

exports.removeUserByID = removeUserByID;

exports.addMosaicToDB = addMosaicToDB;

exports.getMosaicByKey = getMosaicByKey;

exports.removeMosaicByKey = removeMosaicByKey;

exports.addMessageToDB = addMessageToDB;

exports.getMessageByID = getMessageByID;

exports.getMessagesForMosaicKey = getMessagesForMosaicKey;

exports.removeMessageByID = removeMessageByID;

exports.getUserOrCreate = getUserOrCreate;

