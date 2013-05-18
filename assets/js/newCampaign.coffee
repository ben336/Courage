button = $ "#newcampbutton"

button.click ->
  name = $(campaignname).val()
  $.ajax({url:"/createcampaign?name=#{name}"}).done(handleNewCampaign)


handleNewCampaign = (data) ->
  #should handle an error case here at some point
  name = data.name
  message = "Campaign created for #{name}"
  $("#message").html(message)