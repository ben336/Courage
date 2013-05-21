button = $ "#newmosaicbutton"

button.click ->
  # this really should be knockout
  # but this is fine for now till we solidify the backend
  mosaicData =
    name: $("#mosaicname").val()
    description: $("#mosaicdescription").text()
    target:
      name:
        givenName:$("#targetfname").val()
        familyName:$("#targetlname").val()
      emails:[{value:$("#targetemail").val()}]
  $.post("/createmosaic",mosaicData).done( handleNewMosaic )

# handles the ajax response when a new mosaic is created
handleNewMosaic = (data) ->
  #should handle an error case here at some point
  name = data.name
  message = "Mosaic created for #{name}"
  $("#message").html(message)