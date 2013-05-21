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

USER2 =
  id: "testID2" + Math.floor(Math.random() * 100)
  name:
    givenName: "John"
    familyName: "Doe"
  emails: [{value: "johndoe2@gmail.com"}]

MOSAIC =
    key: "jsljsdlkfjdskls"
    name: "testmosaic"
    description: "This is just a test."
    owner: {}
    target: {}

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
    waitsFor temp, "The Database Connection has completed", 500

    runs () -> expect(status).toBe(ERROR)


  it "can connect to the DB", ->
    status = null

    runs ( ->
      db.initializeDB dbconfig, (err) ->
        status = if err then ERROR else SUCCESS
    )
    temp = () -> status?
    waitsFor temp, "The Database Connection has completed", 500

    runs () -> expect(status).toBe(SUCCESS)



  it "can insert a user record", ->
    record = null
    wasError = false
    mosaicsetup = false

    runs ( ->
      db.addUserToDB USER, (success,result) ->
        if success
          record = result[0]
        else
          wasError = true
          record = result[0]
    )

    temp = () -> record? or wasError
    waitsFor(temp, "The insert was attempted", 500)

    runs ( ->
      expect(record).not.toBeFalsy()
      expect(record.googleid).toBe(USER.id)
      expect(record.lastname).toBe(USER.name.familyName)
      expect(record.firstname).toBe(USER.name.givenName)
      expect(record.email).toBe(USER.emails[0].value)
      #add users to mosaic
      MOSAIC.owner.id = record.id
      db.addUserToDB USER2, (success,result) ->
        if success and result
          MOSAIC.target.id = result[0].id
          mosaicsetup = true
    )

    temp = () -> mosaicsetup
    waitsFor(temp,"Mosaic is set up", 500)



  it "can read a user record using id", ->

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

  it "can read a user record using email", ->

    record = null
    wasError = false
    attempted = false
    runs ( ->
      db.getUserByEmail USER.emails[0].value, (success,result) ->
        if success
          record = result[0]
        else
          wasError = true
          record = result
        attempted = true
    )
    temp = () -> attempted
    waitsFor( temp, "The read was attempted",  500)

    runs ( ->
      expect(record).not.toBeFalsy()
      expect(record.googleid).toBe(USER.id)
      expect(record.lastname).toBe(USER.name.familyName)
      expect(record.firstname).toBe(USER.name.givenName)
      expect(record.email).toBe(USER.emails[0].value)
    )


  it "can insert a mosaic record", ->
    record = null
    wasError = false
    runs ( ->
      db.addMosaicToDB MOSAIC, (success,result) ->
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
      expect(record.name).toBe(MOSAIC.name)
      expect(record.description).toBe(MOSAIC.description)
      expect(record.owner).toBe(MOSAIC.owner.id)
      expect(record.target).toBe(MOSAIC.target.id)
    )

  it "can get a mosaic record by key", ->
    record = null
    wasError = false
    runs ( ->
      db.getMosaicByKey MOSAIC.key, (success,result) ->
        if success
          record = result[0]
        else
          wasError = true
          record = result[0]
    )
    temp = () -> (record? or wasError)
    waitsFor( temp, "The delete was attempted", 500 )

    runs ( ->
      expect(record).not.toBeFalsy()
      expect(record.name).toBe(MOSAIC.name)
      expect(record.description).toBe(MOSAIC.description)
      expect(record.ownerfname).toBe(USER.name.givenName)
      expect(record.targetfname).toBe(USER2.name.givenName)
    )

  it "can delete a mosaic record", ->
    record = null
    wasError = false
    runs ( ->
      db.removeMosaicByKey MOSAIC.key, (success,result) ->
        if success
          record = result[0]
        else
          wasError = true
          record = result[0]
    )
    temp = () -> (record? or wasError)
    waitsFor( temp, "The delete was attempted", 500 )

    runs ( ->
      expect(record).not.toBeFalsy()
      expect(record.name).toBe(MOSAIC.name)
      expect(record.description).toBe(MOSAIC.description)
      expect(record.owner).toBe(MOSAIC.owner.id)
      expect(record.target).toBe(MOSAIC.target.id)
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

      db.removeUserByID USER2.id, ->
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
