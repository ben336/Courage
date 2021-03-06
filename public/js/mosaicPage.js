/**
This file handles the mosaicPage.
It sets up the knockout bindings and event handlers, and maintains the state
of the page.
**/
(function() {

  var messageData,urlParts,mosaicKey,messageList;

  /**
  ## Data
  **/

  urlParts = document.URL.split("/");
  mosaicKey = urlParts[urlParts.length - 2];

  function Message() {
    var self = this;
    self.message = ko.revertibleObservable().extend({
        required: true,
        minLength: 100
      });
    self.snippet = ko.revertibleObservable().extend({
        required: true,
        minLength: 15
      });
    self.mosaic = {
      key: mosaicKey
    };
    self.commitAll = function(){
      self.message.commit();
      self.snippet.commit();
    };
    self.resetAll = function(){
      self.message.reset();
      self.snippet.reset();
    };
    self.clearAll = function(){
      self.message("");
      self.snippet("");
    };
    self.isValid = function() {
      return self.message.isValid() &&
      self.snippet.isValid();
    };
  }
  messageData = new Message();
  /**
  ## Page Setup Logic
  **/

  $.post("/getmessages",{key:mosaicKey}).done(setUpMessageBinding);
  $("#newmessagebutton").click(showMessageDialog);

  /**
  ## Helper Functions
  **/

  /**
  This function takes messages from the server and binds them
  to the DOM, specifically the messageList object
  **/
  function setUpMessageBinding (messages) {
    var returnedMessages = messages.messages;
    messageList = ko.mapping.fromJS({
      messages: returnedMessages
    });
    ko.applyBindings(messageList,document.getElementById("messageList"));
  }

  /**
    This function displays the New Message Dialog
  **/
  function showMessageDialog() {
    var dialog = $("<div id='messagedialog'></div>");
    dialog.load("/newmessage/",function() {
      //After we load the template, we bind it to the form div, to set up the
      //knockout 2-way binding and add it to the DOM
      ko.applyBindings(messageData,dialog[0]);
      $("body").append(dialog);
      initMessageDialogButtons(dialog);
    });
  }

  /**
    Creates a new message based on input from the
    dialog box
  **/
  function createNewMessage(){
    if(messageData.isValid()){
      var dialog = this.dialog;
      $.post("/newmessage", ko.toJS(messageData)).done(handleNewMessage);
      messageData.clearAll();
      dialog.remove();
    }
  }

  /**
    Sets up the buttons to create a message and close the dialog
  **/
  function initMessageDialogButtons(dialog) {
    $ ("#submitmessage").click( createNewMessage.bind({dialog:dialog}) );
    $ (".closebutton").click( function(){
        dialog.remove();
        //messageData.resetAll();
      });
  }

  /**
    Handles the response from the server after adding a new message
  **/
  function handleNewMessage (success) {
    $.post("/getmessages", {key:mosaicKey}).done(bindNewMessages);

    messageData.resetAll();
    if(!success){
      console.log("Problem adding message");
    }
  }

  /**
    Bind a new set of messages to the DOM with knockout
  **/
  function bindNewMessages (returnedmessages) {
    ko.mapping.fromJS(returnedmessages, messageList);
  }

  /**
    Sets up the button to  close the dialog
  **/
  function initViewMessageDialogButtons(dialog) {
    $ (".closebutton").click( function(){ dialog.remove();} );
  }

  /**
  ## Global functions
  **/


  /**
    Displays a message in a dialog box. This is set as a global so that
    it can be bound to the click handler with knockout
  **/
  window.displayMessage = function (message) {
      var dialog = $("<div id='viewmessagedialog'></div>");
      dialog.load("/viewmessage/",function() {
        //After we load the template, we bind it to the form div, to set up the
        //knockout 2-way binding and add it to the DOM
        $("body").append(dialog);
        ko.applyBindings(message,dialog[0]);
        initViewMessageDialogButtons(dialog);
      });
    };

}).call(this);