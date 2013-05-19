button = $ "#newmosaicbutton"

button.click ->
  name = $("#mosaicname").val()
  $.ajax({url:"/createmosaic?name=#{name}"}).done(handleNewMosaic)


handleNewMosaic = (data) ->
  #should handle an error case here at some point
  name = data.name
  message = "Mosaic created for #{name}"
  $("#message").html(message)