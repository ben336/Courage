#For right now just check that it passes an object along acceptably
db = require "../src/databaseconnect"
dbsettings = require "../src/config/dbsettings"
dbconfig = dbsettings.config

ERROR = "Error"
SUCCESS = "Success"

USER =
  id: "testID" + Math.floor(Math.random() * 100)
  name:
    givenName: "John"
    familyName: "Doe"
  emails: [{value: "johndoe@gmail.com"}]

describe "DatabaseConnection", ->

  it "will return an error if the DB is not configured", ->

    status = null
    baddbconfig =
      role : "nonexistentuser"
      port : "5432"
      address :"localhost"
      db : "Courage"

    runs( ()->
      db.initializeDB baddbconfig, (err) ->
        status = if err then ERROR else SUCCESS
    )
    temp = ()-> status?
    waitsFor( temp, "The Database Connection has completed", 500 )

    runs ( () -> expect(status).toBe(ERROR) )


  it "can connect to the DB", ->
    status = null

    runs ( ->
      db.initializeDB dbconfig, (err) ->
        status = if err then ERROR else SUCCESS
    )
    temp = ()-> status?
    waitsFor( temp, "The Database Connection has completed", 500 )

    runs ( () -> expect(status).toBe(SUCCESS) )



  it "can insert a user record", ->
    record = null
    wasError = false

    runs ( ->
      db.addUserToDB USER, (success,result) ->
        if success
          record = result[0]
        else
          wasError = true
          record = result[0]
    )
    temp = () -> (record? or wasError)
    waitsFor( temp, "The insert was attempted", 500 )

    runs ( ->
      expect(record).not.toBeFalsy()
      expect(record.googleid).toBe(USER.id)
      expect(record.lastname).toBe(USER.name.familyName)
      expect(record.firstname).toBe(USER.name.givenName)
      expect(record.email).toBe(USER.emails[0].value)
    )

  it "can read a user record", ->

    record = null
    wasError = false

    runs ( ->
      db.getUserByID USER.id, (success,result) ->
        if success
          record = result[0]
        else
          wasError = true
          record = result
    )
    temp = () -> record? or wasError
    waitsFor( temp, "The read was attempted",  500)

    runs ( ->
      expect(record).not.toBeFalsy()
      expect(record.googleid).toBe(USER.id)
      expect(record.lastname).toBe(USER.name.familyName)
      expect(record.firstname).toBe(USER.name.givenName)
      expect(record.email).toBe(USER.emails[0].value)
    )


  it "can delete a user record", ->

    record = null
    attempt = null
    wasError = false

    runs ( ->
      db.removeUserByID USER.id, (success,result) ->
        if success
          record = result[0]
        else
          wasError = true
          record = result
    )

    waitsFor( ->
      record? or wasError
    "The delete was attempted"
    500)

    runs ( ->
      expect(record).not.toBeFalsy()
      expect(record.googleid).toBe(USER.id)
      expect(record.lastname).toBe(USER.name.familyName)
      expect(record.firstname).toBe(USER.name.givenName)
      expect(record.email).toBe(USER.emails[0].value)
      record = null
      db.getUserByID USER.id, (success,result) ->
        if success
          attempt = true
          record = result[0]
        else
          wasError = true
          record = result
    )

    waitsFor( ->
      attempt or wasError
    "The second read was attempted"
    500
    )

    runs ( () -> expect(record).toBeFalsy() )
