(function() {

  var button, handleNewMosaic, mosaicData;

  /**
  ### Creating a new Mosaic

  First we create an object to represent the form data.  We're using knockout
  to represent the model and bind that model to the input fields on the page.
  The object containts the name and description of the mosaic, and info about
  the target person, structured to match google's "person" data structure.
  Info about the owner and other metadata will be added on the server
  **/
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
  /**
  After we create the object, we bind it to the form div, to set up the knockout
  2-way binding.
  **/
  ko.applyBindings(mosaicData,document.getElementById("mosaicform"));


  /**
  Finally we set the button to send the data to the server and create the new
  mosaic
  **/
  button = $("#newmosaicbutton");
  button.click(function() {
    $.post("/createmosaic", ko.toJS(mosaicData)).done(handleNewMosaic);
  });

  handleNewMosaic = function(data) {
    var message;
    if(data && data.key){
      document.location.href = "/mosaicpage/"+data.key+"/";
    }
    else{
      message = "Failed to create mosaic" + mosaicData.name;
      $("#message").html(message);
    }
  };

}).call(this);