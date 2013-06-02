/*
Test file for the database connect operations.
*/

var ERROR, MESSAGE, MESSAGE2, MOSAIC, SUCCESS,
  USER, USER2, db, dbconfig, dbsettings;

db = require("../src/databaseconnect");
dbsettings = require("../src/config/dbsettings");

dbconfig = dbsettings.config;

ERROR = "Error";

SUCCESS = "Success";

/*
Create the configs of 2 test users and a test mosaic
*/

USER = {
  id: "testID" + Math.floor(Math.random() * 100),
  name: {
    givenName: "John",
    familyName: "Doe"
  },
  emails: [
    {
      value: "johndoe@gmail.com"
    }
  ]
};

USER2 = {
  id: "testID2" + Math.floor(Math.random() * 100),
  name: {
    givenName: "John",
    familyName: "Doe"
  },
  emails: [
    {
      value: "johndoe2@gmail.com"
    }
  ]
};

MOSAIC = {
  key: "jsljsdlkfjdskls",
  name: "testmosaic",
  description: "This is just a test.",
  owner: {},
  target: {}
};

MESSAGE = null;

MESSAGE2 = null;


/*
### Tests

Start with testing whether connecting to the database works correctly
*/
describe("DatabaseConnection", function() {
  it("will return an error if the DB is not configured", function() {
    var baddbconfig, status, temp;
    status = null;
    baddbconfig = {
      role: "nonexistentuser",
      password: "5432",
      address: "localhost",
      db: "Courage"
    };
    runs(function() {
      db.initializeDB(baddbconfig, function(err) {
        status = err ? ERROR : SUCCESS;
      });
    });
    temp = function() {
      return status != null;
    };
    waitsFor(temp, "The Database Connection has completed", 500);
    runs(function() {
      expect(status).toBe(ERROR);
    });
  });

  it("can connect to the DB", function() {
    var status, temp;
    status = null;
    runs(function() {
      db.initializeDB(dbconfig, function(err) {
        status = err ? ERROR : SUCCESS;
      });
    });
    temp = function() {
      return status != null;
    };
    waitsFor(temp, "The Database Connection has completed", 500);
    runs(function() {
      expect(status).toBe(SUCCESS);
    });
  });

  /**
  Test whether it can manage users correctly
  **/
  it( "can insert a user record", function() {
    var mosaicsetup, record, temp, wasError;
    record = null;
    wasError = false;
    mosaicsetup = false;
    runs(function() {
      db.addUserToDB(USER, function(result) {
        record = result[0];
      } ,function(error) {
        wasError = true;
        record = error;
      });
    });
    temp = function() {
      return (record != null) || wasError;
    };
    waitsFor(temp, "The insert was attempted", 500);
    runs(function() {
      expect(record).not.toBeFalsy();
      expect(record.googleid).toBe(USER.id);
      expect(record.lastname).toBe(USER.name.familyName);
      expect(record.firstname).toBe(USER.name.givenName);
      expect(record.email).toBe(USER.emails[0].value);
      MOSAIC.owner.id = record.id;
    });
  });

  it("can check if a record exists by email and add it if not", function() {
    var mosaicsetup, record, temp, wasError;
    record = null;
    wasError = false;
    mosaicsetup = false;
    runs(function() {
      db.getUserOrCreate(USER2, function(result) {
        record = result;
        MOSAIC.target.id = record.id;
      } ,function(error) {
        wasError = true;
        record = error;
      });
    });
    temp = function() {
      return (record != null) || wasError;
    };
    waitsFor(temp, "The insert was attempted", 500);
    runs(function() {
      expect(record).not.toBeFalsy();
      expect(record.googleid).toBe(USER2.id);
      expect(record.lastname).toBe(USER2.name.familyName);
      expect(record.firstname).toBe(USER2.name.givenName);
      expect(record.email).toBe(USER2.emails[0].value);
    });
  });



  it("can read a user record using id", function() {
    var record, temp, wasError;
    record = null;
    wasError = false;
    runs(function() {
      db.getUserByID(USER.id, function(result) {
        record = result[0];
      }, function(error) {
        wasError = true;
        record = error;
      });
    });
    temp = function() {
      return (record != null) || wasError;
    };
    waitsFor(temp, "The read was attempted", 500);
    runs(function() {
      expect(record).not.toBeFalsy();
      expect(record.googleid).toBe(USER.id);
      expect(record.lastname).toBe(USER.name.familyName);
      expect(record.firstname).toBe(USER.name.givenName);
      expect(record.email).toBe(USER.emails[0].value);
    });
  });

  it("can read a user record using email", function() {
    var attempted, record, temp, wasError;
    record = null;
    wasError = false;
    attempted = false;
    runs(function() {
      db.getUserByEmail(USER.emails[0].value, function(result) {
        record = result[0];
        attempted = true;
      }, function(error) {
        wasError = true;
        record = error;
        attempted = true;
      });
    });
    temp = function() {
      return attempted;
    };
    waitsFor(temp, "The read was attempted", 500);
    runs(function() {
      expect(record).not.toBeFalsy();
      expect(record.googleid).toBe(USER.id);
      expect(record.lastname).toBe(USER.name.familyName);
      expect(record.firstname).toBe(USER.name.givenName);
      expect(record.email).toBe(USER.emails[0].value);
    });
  });
  /*
  Test that it can manage mosaic records correctly
  */
  it("can insert a mosaic record", function() {
    var record, temp, wasError;
    record = null;
    wasError = false;
    runs(function() {
      db.addMosaicToDB(MOSAIC, function(result) {
        record = result[0];
      }, function(error){
        wasError = true;
        record = error;

      });
    });
    temp = function() {
      return (record != null) || wasError;
    };
    waitsFor(temp, "The insert was attempted", 500);
    runs(function() {
      expect(record).not.toBeFalsy();
      expect(record.name).toBe(MOSAIC.name);
      expect(record.description).toBe(MOSAIC.description);
      expect(record.owner).toBe(MOSAIC.owner.id);
      expect(record.target).toBe(MOSAIC.target.id);
    });
  });

  it("can get a mosaic record by key", function() {
    var record, temp, wasError;
    record = null;
    wasError = false;
    runs(function() {
      db.getMosaicByKey(MOSAIC.key, function(result) {
        record = result[0];
      } , function(error) {
        wasError = true;
        record = error;
      });
    });
    temp = function() {
      return (record != null) || wasError;
    };
    waitsFor(temp, "The delete was attempted", 500);
    runs(function() {
      expect(record).not.toBeFalsy();
      expect(record.name).toBe(MOSAIC.name);
      expect(record.description).toBe(MOSAIC.description);
      expect(record.ownerfname).toBe(USER.name.givenName);
      expect(record.targetfname).toBe(USER2.name.givenName);
    });
  });
  /*
  Test that it can manage messages correctly
  */
  it("can insert a message for a mosaic", function() {
    var record, temp, wasError;
    record = null;
    wasError = false;
    runs(function() {
      MESSAGE = {
        message: "This is a test",
        mosaic: {
          key: MOSAIC.key
        },
        writer: {
          id: MOSAIC.target.id
        },
        snippet: "this is a test"
      };
      MESSAGE2 = {
        message: "This is another test",
        mosaic: {
          key: MOSAIC.key
        },
        writer: {
          id: MOSAIC.owner.id
        },
        snippet: "this is another test"
      };
      //don't bother with errors here
      db.addMessageToDB(MESSAGE2, function(result) {
        MESSAGE2.id = result[0].id;
      });
      db.addMessageToDB(MESSAGE, function(result) {
        record = result[0];
      } , function(error) {
        wasError = true;
        record = error;
      });
    });
    temp = function() {
      return (record != null) || wasError;
    };
    waitsFor(temp, "The insert was attempted", 500);
    runs(function() {
      expect(record).not.toBeFalsy();
      expect(record.message).toBe(MESSAGE.message);
      expect(record.mosaic).toBe(MESSAGE.mosaic.key);
      expect(record.writer).toBe(MESSAGE.writer.id);
      expect(record.snippet).toBe(MESSAGE.snippet);
      MESSAGE.id = record.id;
    });
  });

  it("can get a message by id", function() {
    var record, temp, wasError;
    record = null;
    wasError = false;
    runs(function() {
      db.getMessageByID(MESSAGE.id, function(result) {
        record = result[0];
      } , function(error) {
        wasError = true;
        record = error;
      });
    });
    temp = function() {
      return (record != null) || wasError;
    };
    waitsFor(temp, "The select was attempted", 500);
    runs(function() {
      expect(record).not.toBeFalsy();
      expect(record.message).toBe(MESSAGE.message);
      expect(record.mosaic).toBe(MESSAGE.mosaic.key);
      expect(record.writer).toBe(MESSAGE.writer.id);
      expect(record.snippet).toBe(MESSAGE.snippet);
    });
  });

  it("can get a group of messages by Mosaic", function() {
    var attempted, records, temp, wasError;
    records = null;
    wasError = false;
    attempted = false;
    runs(function() {
      db.getMessagesForMosaicKey(MOSAIC.key, function(result) {
        records = result;
        attempted = true;
      }, function(error) {
        wasError = true;
        records = error;
      });
    });
    temp = function() {
      return attempted || wasError;
    };
    waitsFor(temp, "The aggregation was attempted", 500);
    runs(function() {
      expect(records).not.toBeFalsy();
      expect(records.length).toBe(2);
      expect(records[0].snippet).not.toBeFalsy();
    });
  });
  /*
  Make sure it can clear out records correctly
  */
  it("can get delete message by id", function() {
    var record, temp, wasError;
    record = null;
    wasError = false;
    runs(function() {
      db.removeMessageByID(MESSAGE2.id, function() {});
      db.removeMessageByID(MESSAGE.id, function(result) {
        record = result[0];
      }, function(error) {
        wasError = true;
        record = error;
      });
    });
    temp = function() {
      return (record != null) || wasError;
    };
    waitsFor(temp, "The select was attempted", 500);
    runs(function() {
      expect(record).not.toBeFalsy();
      expect(record.message).toBe(MESSAGE.message);
      expect(record.mosaic).toBe(MESSAGE.mosaic.key);
      expect(record.writer).toBe(MESSAGE.writer.id);
      expect(record.snippet).toBe(MESSAGE.snippet);
    });
  });

  it("can delete a mosaic record", function() {
    var record, temp, wasError;
    record = null;
    wasError = false;
    runs(function() {
      db.removeMosaicByKey(MOSAIC.key, function(result) {
        record = result[0];
      }, function(error) {
        wasError = true;
        record = error;
      });
    });
    temp = function() {
      return (record != null) || wasError;
    };
    waitsFor(temp, "The delete was attempted", 500);
    runs(function() {
      expect(record).not.toBeFalsy();
      expect(record.name).toBe(MOSAIC.name);
      expect(record.description).toBe(MOSAIC.description);
      expect(record.owner).toBe(MOSAIC.owner.id);
      expect(record.target).toBe(MOSAIC.target.id);
    });
  });

  it("can delete a user record (or two)", function() {
    var attempt, record, wasError;
    record = null;
    attempt = null;
    wasError = false;
    runs(function() {
      db.removeUserByID(USER.id, function(result) {
        record = result[0];
      } , function(error) {
        wasError = true;
        record = error;
      });
      db.removeUserByID(USER2.id, function() {});
    });
    waitsFor(function() {
      return (record != null) || wasError;
    }, "The delete was attempted", 500);
    runs(function() {
      expect(record).not.toBeFalsy();
      expect(record.googleid).toBe(USER.id);
      expect(record.lastname).toBe(USER.name.familyName);
      expect(record.firstname).toBe(USER.name.givenName);
      expect(record.email).toBe(USER.emails[0].value);
      record = null;
      db.getUserByID(USER.id, function(result) {
        attempt = true;
        record = result[0];
      }, function(error) {
        wasError = true;
        record = error;
      });
    });
    waitsFor(function() {
      return attempt || wasError;
    }, "The second read was attempted", 500);
    runs(function() {
      expect(record).toBeFalsy();
    });
  });
});

