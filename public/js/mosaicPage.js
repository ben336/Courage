(function() {

  var button, handleNewMessage, messageData,urlParts,mosaicKey,messageList;

  urlParts = document.URL.split("/");
  mosaicKey = urlParts[urlParts.length - 2];

  messageData = {
    message: ko.observable(),
    snippet: ko.observable(),
    mosaic: {
      key: mosaicKey
    }
  };
  $.post("/getmessages",{key:mosaicKey}).done(function(messages) {
    var returnedMessages = messages.messages;
    messageList = ko.mapping.fromJS({
      messages: returnedMessages
    });
    ko.applyBindings(messageList,document.getElementById("messageList"));
  });


  $("#newmessagebutton").click(showMessageDialog);

  function showMessageDialog() {
    var dialog = $("<div id='messagedialog'></div>");
    dialog.load("/newmessage/",function(){
      /**
      After we load the template, we bind it to the form div, to set up the
      knockout 2-way binding and add it to the DOM
      **/
      ko.applyBindings(messageData,dialog[0]);
      $("body").append(dialog);
      /**
      Finally we set the button to send the data to the server
      and create the new mosaic
      **/
      button = $("#submitmessage");
      button.click(function() {
        $.post("/newmessage", ko.toJS(messageData)).done(handleNewMessage);
        messageData.message("");
        messageData.snippet("");
        dialog.remove();
      });
      $(".closebutton").click(function(){
        dialog.remove();
      });
    });
  }

  handleNewMessage = function(data) {
    $.post("/getmessages", {key:mosaicKey}).done(function(returnedmessages) {
      ko.mapping.fromJS(returnedmessages, messageList);
    });
    if(!data){
      console.log("Problem adding message");
    }
  };

}).call(this);