
var mosaic = require("../mosaic");
var security = require("../util/security");

/**
## Model Routes

These are the routes related to the model concepts. They're mostly ajax routes
to return json data after making a call to the db.
**/
function addModelRoutes(app) {
  /*
  Mosaic Page route
  */
  app.get("/mosaicpage/:key/", function(req, res) {
    mosaic.getPage(req.params.key, req, res);
  });

  /*
  new mosaic route
  */
  app.get("/mosaic", security.ensureAuthenticated, function(req, res) {
    res.render("mosaic", {
      user: req.user
    });
  });

  /*
  create mosaic route
  */
  app.post("/createmosaic", security.ensureAuthenticated, function(req, res) {
    mosaic.create(req.body, req.user, function(mosaicData) {
      res.send(mosaicData);
    });
  });

  /*
  new message route
  */
  app.post("/newmessage", security.ensureAuthenticated, function(req, res) {
    mosaic.newMessage(req.body, req.user, function(err) {
      res.send(err);
    });
  });

  /*
  List Messages
  */
  app.post("/getmessages", function(req,res) {
    mosaic.getMessages(req.body, function(messages){
      res.send(messages);
    });
  });

}


exports.addModelRoutes = addModelRoutes;