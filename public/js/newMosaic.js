(function() {
  var button, handleNewMosaic, mosaicData;

  /* this should really be replaced with a knockout solution */
  mosaicData = {
    name: ko.observable(),
    description: ko.observable(),
    target: {
      name: {
        givenName: ko.observable(),
        familyName: ko.observable()
      },
      emails: [{value:ko.observable()}]
    }
  };
  ko.applyBindings(mosaicData,document.getElementById("mosaicform"));

  button = $("#newmosaicbutton");




  button.click(function() {
    $.post("/createmosaic", ko.toJS(mosaicData)).done(handleNewMosaic);
  });

  handleNewMosaic = function(data) {
    var message, name;
    name = data.name;
    message = "Mosaic created for " + name;
    return $("#message").html(message);
  };

}).call(this);