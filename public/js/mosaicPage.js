(function() {

  var button, handleNewMessage, messageData,urlParts,mosaicKey,messageList;

  urlParts = document.URL.split("/");
  mosaicKey = urlParts[urlParts.length - 1];

  messageData = {
    message: ko.observable(),
    snippet: ko.observable(),
    mosaic: {
      key: mosaicKey
    }
  };
  $.post("/getmessages",{key:mosaicKey}).done(function(messages) {
    var returnedMessages = messages.messages;
    messageList = {
      messages: ko.observableArray(returnedMessages)
    };
    ko.applyBindings(messageList,document.getElementById("messageList"));
  });
  /**
  After we create the object, we bind it to the form div, to set up the knockout
  2-way binding.
  **/
  ko.applyBindings(messageData,document.getElementById("messageform"));


  /**
  Finally we set the button to send the data to the server and create the new
  mosaic
  **/
  button = $("#submitmessage");
  button.click(function() {
    $.post("/newmessage", ko.toJS(messageData)).done(handleNewMessage);
  });

  handleNewMessage = function(data) {
    $.post("/getmessages", {key:mosaicKey}).done(function(messages) {
      ko.mapping.fromJS(messages, messageList);
    });
    if(!data){
      console.log("Problem adding message");
    }
  };

}).call(this);