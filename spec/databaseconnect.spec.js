//For right now just check that it passes an object along acceptably
var db = require("../src/databaseconnect");
var dbsettings = require("../config/dbsettings");
var dbconfig = dbsettings.config;

var ERROR = "Error",
  SUCCESS = "Success";

var USER = {
  id: "testID"+Math.floor(Math.random()*100),
  name: {
    givenName: "John",
    familyName: "Doe"
  },
  emails: [{value:"johndoe@gmail.com"}]
};

describe ("DatabaseConnection", function() {
  
  it ("will return an error if the DB is not configured", function() {
    
    var status;
    var baddbconfig = {
      role : "nonexistentuser",
      port : "5432",
      address :"localhost",
      db : "Courage"
    };

    runs ( function() {    
    
      db.initializeDB(baddbconfig,function(err){
        status = err ? ERROR : SUCCESS;
      });
    
    });

    waitsFor ( function() {
      return !!status;
    }, "The Database Connection has completed",500);

    runs ( function() {
      expect(status).toBe(ERROR);
    });

  });


  it ("can connect to the DB", function() {
    var status;

    runs ( function() {    
      db.initializeDB(dbconfig,function(err){
        status = err ? ERROR : SUCCESS;
      });
    });

    waitsFor ( function() {
      return !!status;
    }, "The Database Connection has completed",500);

    runs ( function() {
      expect(status).toBe(SUCCESS);
    });

  });

  it ("can insert a user record", function() {
    
    var record,wasError =false;
    
    runs ( function() {    
      
      db.addUserToDB(USER,function(success,result){
        if(success){
          record = result;
        }
        else {
          wasError = true;
          record = result;
        }

      });
    
    });

    waitsFor ( function() {
      return !!record || wasError;
    }, "The insert was attempted",500);

    runs ( function() {
      expect(record).not.toBeFalsy();
      expect(record.id).toBe(USER.id);
      expect(record.lastname).toBe(USER.name.familyName);
      expect(record.firstname).toBe(USER.name.givenName);
      expect(record.email).toBe(USER.emails[0].value);
    });

  });

  it ("can read a user record", function() {
    
    var record,wasError =false;
    
    runs ( function() {    
      
      db.getUserByID(USER.id,function(success,result){
        if(success){
          record = result;
        }
        else {
          wasError = true;
          record = result;
        }

      });
    
    });

    waitsFor ( function() {
      return !!record || wasError;
    }, "The read was attempted",500);

    runs ( function() {
      expect(record).not.toBeFalsy();
      expect(record.id).toBe(USER.id);
      expect(record.lastname).toBe(USER.name.familyName);
      expect(record.firstname).toBe(USER.name.givenName);
      expect(record.email).toBe(USER.emails[0].value);
    });

  });

  it ("can delete a user record", function() {
    
    var record,wasError =false,attempt;
    
    runs ( function() {    
      
      db.removeUserByID(USER.id,function(success,result){
        if(success){
          record = result;
        }
        else {
          wasError = true;
          record = result;
        }

      });
    
    });

    waitsFor ( function() {
      return !!record || wasError;
    }, "The delete was attempted",500);

    runs ( function() {
      expect(record).not.toBeFalsy();
      expect(record.id).toBe(USER.id);
      expect(record.lastname).toBe(USER.name.familyName);
      expect(record.firstname).toBe(USER.name.givenName);
      expect(record.email).toBe(USER.emails[0].value);
      record = null;
      db.getUserByID(USER.id,function(success,result){
        if(success){
          attempt = true;
          record = result;
        }
        else {
          wasError = true;
          record = result;
        }

      });

      waitsFor ( function() {
        return attempt || wasError;
      }, "The second read was attempted",500);

      runs ( function() {
        expect(record).toBeFalsy();
      });

    });

  });

  

});