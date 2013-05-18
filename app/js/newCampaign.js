(function() {
  var button, handleNewCampaign;

  button = $("#newcampbutton");

  button.click(function() {
    var name;

    name = $(campaignname).val();
    return $.ajax({
      url: "/createcampaign?name=" + name
    }).done(handleNewCampaign);
  });

  handleNewCampaign = function(data) {
    var message, name;

    name = data.name;
    message = "Campaign created for " + name;
    return $("#message").html(message);
  };

}).call(this);

/*
//@ sourceMappingURL=newCampaign.js.map
*/