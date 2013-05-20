button = $ "#newmosaicbutton"

button.click ->
  # this really should be knockout
  # but this is fine for now till we solidify the backend
  mosaicData =
    name: $("#mosaicname").val()
    description: $("#mosaicname").text()
    target:
      fname:$("#targetfname").val()
      lname:$("#targetlname").val()
      email:$("#targetemail").val()
  $.post("/createmosaic",mosaicData).done( handleNewMosaic )


handleNewMosaic = (data) ->
  #should handle an error case here at some point
  name = data.name
  message = "Mosaic created for #{name}"
  $("#message").html(message)