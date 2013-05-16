pg = require "pg"
client = null

addUserEvents = (exec, callback) ->
  user = null
  exec.on "row", (row) ->
    user = row

  exec.on "error", (err) ->
    callback false, err

  exec.on "end", ->
    callback true, user

initializeDB = (cfg,callback) ->
  conn = "tcp://" + cfg.role + ":" + cfg.port + "@" + cfg.address + "/" + cfg.db
  client = new pg.Client(conn)
  client.connect(callback)

addUserToDB = (user,callback) ->
  id = user.id
  fname = user.name.givenName
  lname = user.name.familyName
  email = user.emails[0].value
  query = "INSERT INTO people(id,firstname,lastname,email) " +
    "values($1,$2,$3,$4) RETURNING *"
  exec = client.query query, [id, fname, lname, email]
  addUserEvents exec, callback


getUserByID = (id,callback) ->
  query = "SELECT * FROM people where id = $1"
  exec = client.query(query,[id])
  addUserEvents exec, callback

removeUserByID = (id,callback) ->
  query = "Delete FROM people where id = $1 RETURNING *"
  exec = client.query(query,[id])
  addUserEvents exec, callback


exports.initializeDB = initializeDB
exports.addUserToDB = addUserToDB
exports.getUserByID = getUserByID
exports.removeUserByID = removeUserByID

