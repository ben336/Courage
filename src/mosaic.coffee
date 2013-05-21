db = require "./databaseconnect"
err = require "./errorHandler"
crypto = require "crypto"

# initialize the database
db.initializeDB null, err.handle

# Create a new mosaic from the basic data
create = (mosaicData,user,callback)->
  mosaicData.owner = user
  mosaicData.key = crypto.randomBytes(20).toString("hex")
  db.getUserByEmail mosaicData.target.emails[0].value, (success,results) ->
    if results and !results.error
      if results.length
        mosaicData.target = results[0]
        db.addMosaicToDB mosaicData, callback
      else
        db.addUserToDB mosaicData.target, (success,results) ->
          if results and !results.error and results.length
            mosaicData.target = results[0]
            db.addMosaicToDB mosaicData, (success,results) ->
              if results and !results.error
                callback results[0]
              else
                err.handle "Something went wrong creating a mosaic"
          else
            err.handle "Something went wrong creating a new user"
    else
      err.handle "something went wrong getting a user for a new mosaic"

# Get the information for the current mosaic, then render the page
getPage = (key, req,res) ->
  db.getMosaicByKey key, (success, results)->
    gotData =  results and !results.error and results.length
    mosaicData = if gotData then results[0] else {}
    res.render "mosaicpage", {user:req.user,mosaic:mosaicData}



#export the functions

exports.create = create
exports.getPage = getPage
