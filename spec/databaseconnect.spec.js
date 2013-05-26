
var ERROR, MESSAGE, MESSAGE2, MOSAIC, SUCCESS,
  USER, USER2, db, dbconfig, dbsettings;

db = require("../src/databaseconnect");

dbsettings = require("../src/config/dbsettings");

dbconfig = dbsettings.config;

ERROR = "Error";

SUCCESS = "Success";

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
      return db.initializeDB(dbconfig, function(err) {
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
  it("can insert a user record", function() {
    var mosaicsetup, record, temp, wasError;
    record = null;
    wasError = false;
    mosaicsetup = false;
    runs(function() {
      return db.addUserToDB(USER, function(success, result) {
        if (success) {
          record = result[0];
        } else {
          wasError = true;
          record = result[0];
        }
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
      return db.addUserToDB(USER2, function(success, result) {
        if (success && result) {
          MOSAIC.target.id = result[0].id;
          mosaicsetup = true;
        }
      });
    });
    temp = function() {
      return mosaicsetup;
    };
    return waitsFor(temp, "Mosaic is set up", 500);
  });
  it("can read a user record using id", function() {
    var record, temp, wasError;
    record = null;
    wasError = false;
    runs(function() {
      return db.getUserByID(USER.id, function(success, result) {
        if (success) {
          record = result[0];
        } else {
          wasError = true;
          record = result;
        }
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
      return db.getUserByEmail(USER.emails[0].value, function(success, result) {
        if (success) {
          record = result[0];
        } else {
          wasError = true;
          record = result;
        }
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
  it("can insert a mosaic record", function() {
    var record, temp, wasError;
    record = null;
    wasError = false;
    runs(function() {
      return db.addMosaicToDB(MOSAIC, function(success, result) {
        if (success) {
          record = result[0];
        } else {
          wasError = true;
          record = result[0];
        }
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
      return db.getMosaicByKey(MOSAIC.key, function(success, result) {
        if (success) {
          record = result[0];
        } else {
          wasError = true;
          record = result[0];
        }
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
      db.addMessageToDB(MESSAGE2, function(success, result) {
        MESSAGE2.id = result[0].id;
      });
      return db.addMessageToDB(MESSAGE, function(success, result) {
        if (success) {
          record = result[0];
        } else {
          wasError = true;
          record = result[0];
        }
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
      return db.getMessageByID(MESSAGE.id, function(success, result) {
        if (success) {
          record = result[0];
        } else {
          wasError = true;
          record = result[0];
        }
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
      return db.getMessagesForMosaicKey(MOSAIC.key, function(success, result) {
        if (success) {
          records = result;
          attempted = true;
        } else {
          wasError = true;
          records = result;
        }
      });
    });
    temp = function() {
      return attempted || wasError;
    };
    waitsFor(temp, "The aggregation was attempted", 500);
    runs(function() {
      expect(records).not.toBeFalsy();
      expect(records.length).toBe(2);
    });
  });
  it("can get delete message by id", function() {
    var record, temp, wasError;
    record = null;
    wasError = false;
    runs(function() {
      db.removeMessageByID(MESSAGE2.id, function() {});
      return db.removeMessageByID(MESSAGE.id, function(success, result) {
        if (success) {
          record = result[0];
        } else {
          wasError = true;
          record = result[0];
        }
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
      return db.removeMosaicByKey(MOSAIC.key, function(success, result) {
        if (success) {
          record = result[0];
        } else {
          wasError = true;
          record = result[0];
        }
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
  return it("can delete a user record", function() {
    var attempt, record, wasError;
    record = null;
    attempt = null;
    wasError = false;
    runs(function() {
      db.removeUserByID(USER.id, function(success, result) {
        if (success) {
          record = result[0];
        } else {
          wasError = true;
          record = result;
        }
      });
      return db.removeUserByID(USER2.id, function() {});
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
      return db.getUserByID(USER.id, function(success, result) {
        if (success) {
          attempt = true;
          record = result[0];
        } else {
          wasError = true;
          record = result;
        }
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

