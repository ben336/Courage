(function() {
  var button, handleNewMosaic;

  button = $("#newmosaicbutton");

  button.click(function() {
    var mosaicData;

    /* this should really be replaced with a knockout solution */
    mosaicData = {
      name: $("#mosaicname").val(),
      description: $("#mosaicname").text(),
      target: {
        name: {
          givenName: $("#targetfname").val(),
          familyName: $("#targetlname").val()
        },
        emails: [
          {
            value: $("#targetemail").val()
          }
        ]
      }
    };
    return $.post("/createmosaic", mosaicData).done(handleNewMosaic);
  });

  handleNewMosaic = function(data) {
    var message, name;

    name = data.name;
    message = "Mosaic created for " + name;
    return $("#message").html(message);
  };

}).call(this);