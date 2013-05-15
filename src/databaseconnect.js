var pg = require("pg");

var client;

function initializeDB(cfg,callback) {
	var conString,connection;
	conString = "tcp://"+cfg.role+":"+cfg.port+"@"+cfg.address+"/"+cfg.db;
	client = new pg.Client(conString);
	connection = client.connect(callback);
}

function addUserToDB(user,callback) {
	var id,fname,lname,email,newuser;
	id = user.id;
	fname = user.name.givenName;
	lname = user.name.familyName;
	email = user.emails[0].value;
	var query = "INSERT INTO people(id,firstname,lastname,email) " +
		"values($1,$2,$3,$4) RETURNING *";
	var exec = client.query(query,[id,fname,lname,email]);
  exec.on("row",function(row){
    newuser = row;
  });
	exec.on("error", function(err){
		callback(false,err);
	});
	exec.on("end", function(){
		callback(true,newuser);
	});
}

function getUserByID(id,callback) {
	var query = "SELECT * FROM people where id = $1";
	var exec = client.query(query,[id]);
	var user;
	exec.on("row",function(row){
		user = row;
	});
	exec.on("error",function(err){
		callback(false, err);
	});
	exec.on("end",function(){
		callback(true, user);
	});
}

function removeUserByID(id,callback) {
	var query = "Delete FROM people where id = $1 RETURNING *";
	var exec = client.query(query,[id]);
  var user;
	exec.on("row",function(row){
    user = row;
  });
  exec.on("error",function(err){
    callback(false, err);
  });
  exec.on("end",function(){
    callback(true, user);
  });
}


exports.initializeDB = initializeDB;
exports.addUserToDB = addUserToDB;
exports.getUserByID = getUserByID;
exports.removeUserByID = removeUserByID;

