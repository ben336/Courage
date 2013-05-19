#
# This class serves as an abstraction layer over the DB, and holds
# the queries for acessing and modifying data
#

# We use the pg postgres module for connecting to the DB
pg = require "pg"
dbsettings= require("./config/dbsettings")
dbconfig = dbsettings.config
client = null
initialized = false


# Attaches callbacks to the different query related events
addQueryEvents = (exec, callback) ->
  results = []
  exec.on "row", (row) ->
    results.push row

  exec.on "error", (err) ->
    callback false, err

  exec.on "end", ->
    callback true, results

# Start up the Database connection
# use the cfg param for config if provided, otherwise use the defaults
# if the db is already initialized it returns false
# may want to add a way to override or uninitialize if we need multiple
# configurations.  Not an issue for now
initializeDB = (cfg,callback) ->
  if initialized then return false
  cfg ?= dbconfig
  conn = "tcp://#{cfg.role}:#{cfg.port}@#{cfg.address}/#{cfg.db}"
  client = new pg.Client(conn)
  client.connect(callback)

# Add a user object to the DB
# at least for now this is added in the form of google's profile object
addUserToDB = (user,callback) ->
  id = user.id
  fname = user.name.givenName
  lname = user.name.familyName
  email = user.emails[0].value
  query = "INSERT INTO people(googleid,firstname,lastname,email) " +
    "values($1,$2,$3,$4) RETURNING *"
  exec = client.query query, [id, fname, lname, email]
  addQueryEvents exec, callback

# Get the user from the DB based on their userID
getUserByID = (id,callback) ->
  query = "SELECT * FROM people where googleid = $1"
  exec = client.query(query,[id])
  addQueryEvents exec, callback

# Remove the user from their DB by their ID
removeUserByID = (id,callback) ->
  query = "Delete FROM people where googleid = $1 RETURNING *"
  exec = client.query(query,[id])
  addQueryEvents exec, callback

# export the functions
exports.initializeDB = initializeDB
exports.addUserToDB = addUserToDB
exports.getUserByID = getUserByID
exports.removeUserByID = removeUserByID

