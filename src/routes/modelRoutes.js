
var mosaic = require("../mosaic");
var security = require("../util/security");

function addModelRoutes(app) {
  /*
  Mosaic Page route
  */
  app.get("/mosaicpage/:key", function(req, res) {
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

}


exports.addModelRoutes = addModelRoutes;