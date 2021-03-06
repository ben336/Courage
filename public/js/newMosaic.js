(function() {

  var mosaicData;

  /**
  ## Data
  **/

  /**
  ### Creating a new Mosaic

  First we create an object to represent the form data.  We're using knockout
  to represent the model and bind that model to the input fields on the page.
  The object containts the name and description of the mosaic, and info about
  the target person, structured to match google's "person" data structure.
  Info about the owner and other metadata will be added on the server
  **/
  function Mosaic(){
    var self = this;
    self.name= ko.revertibleObservable().extend({ required: true });
    self.description= ko.revertibleObservable().extend({ required: true });
    self.target= {
      name : {
        givenName : ko.revertibleObservable().extend({ required: true }),
        familyName : ko.revertibleObservable().extend({ required: true })
      },
      emails: [{
        value:ko.revertibleObservable().extend({
          required: true,
          email: true
        })
      }]
    };
    self.errorMessage = ko.observable();
    self.commitAll = function() {
      self.name.commit();
      self.description.commit();
      self.target.name.givenName.commit();
      self.target.name.familyName.commit();
      self.target.emails[0].value.commit();
    };
    self.resetAll = function() {
      self.name.reset();
      self.description.reset();
      self.target.name.givenName.reset();
      self.target.name.familyName.reset();
      self.target.emails[0].value.reset();
    };

    self.isValid = function() {
      return self.name.isValid() &&
      self.description.isValid() &&
      self.target.name.givenName.isValid() &&
      self.target.name.familyName.isValid() &&
      self.target.emails[0].value.isValid();
    };

  }
  mosaicData = new Mosaic();
  /**
  ## Initial Setup
  **/

  ko.validation.configure({
    decorateElement: true,
    errorElementClass:"inputerror",
    messagesOnModified: true,
    insertMessages: false,
    parseInputAttributes: true,
    messageTemplate: null
  });


  $("#newmosaic").click(openMosaicDialog);

  /**
  ## Helper functions
  **/


  function openMosaicDialog() {
    var dialog = $("<div id='mosaicdialog'></div>");
    dialog.load("/mosaic/ #mosaicform",setUpMosaicDialog.bind({
      dialog:dialog
    }));
  }

  /**
    Sets up the dialog that the function is being called on
  **/
  function setUpMosaicDialog() {
    /**
    After we load the template, we bind it to the form div, to set up the
    knockout 2-way binding and add it to the DOM
    **/
    var dialog = this.dialog;
    ko.applyBindings(mosaicData,dialog[0]);
    $("body").append(dialog);
    /**
    Finally we set the button to send the data to the server and create the
    new mosaic
    **/
    $ ("#newmosaicbutton").click(createNewMosaic);
    $ ("#mosaicdialog .closebutton").click(function() {
      mosaicData.resetAll();
      dialog.remove();
    });
  }

  /**
  Create a new mosaic based on the knockout data
  **/
  function createNewMosaic() {
    if( mosaicData.isValid() ) {
      $.post("/createmosaic", ko.toJS(mosaicData)).done(handleNewMosaic);
    }
  }

  /**
    Process the new mosaic after its been passed to the server
  **/
  function handleNewMosaic (data) {
    var message;
    if (data && data.key) {
      document.location.href = "/mosaicpage/"+data.key+"/";
    }
    else {
      message = "Failed to create mosaic" + mosaicData.name;
      $("#message").html(message);
    }
  }

}).call(this);