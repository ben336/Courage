db = require "./databaseconnect"
err = require "./errorHandler"




# initialize the database
db.initializeDB null, err.handle

class Mosaic
  constructor (@key) ->
    db.getMosaicByKey @key, (results) =>
      # should add error handling here for 0 or too many records
      mosaic = results[0]
