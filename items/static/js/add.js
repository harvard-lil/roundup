var gallery_id;
var displayed_image_ids = [];
var gallery_polls = 0;

$(document).ready(function() {
    setMaxLength();
    $("#id_description").bind("click mouseover keyup change", function(){checkMaxLength(this.id); } )
    
    // Check our status service to see if we have archiving jobs pending
	var request = $.ajax({
	    type: "POST",
		url: settings.gallery_create_url,
		data: { target_url: $("#id_link").val()},
		cache: false
	});

    request.done(function( msg ) {
      gallery_id = String(msg.gallery_id);
      check_status();
    });

    request.fail(function( jqXHR, textStatus ) {
      alert( "Request failed: " + textStatus );
    });
    
});

function setMaxLength() {
  $("#id_description").each(function(i){
    intMax = $(this).attr("maxlength");
    $(this).after("<div><span id='"+this.id+"Counter'>"+intMax+"</span> remaining</div>");
  });
}

function checkMaxLength(strID){
  intCount = $("#"+strID).val().length;
  intMax = $("#"+strID).attr("maxlength");
  strID = "#"+strID+"Counter";
  $(strID).text(parseInt(intMax) - parseInt(intCount));
  if (intCount < (intMax * .8)) {$(strID).css("color", "#006600"); } //Good
  if (intCount > (intMax * .8)) { $(strID).css("color", "#FF9933"); } //Warning at 80%
  if (intCount > (intMax)) { $(strID).text(0).css("color", "#990000"); } //Over
}

function check_status() {
    // Check our status service to see if we have any new images in our gallery
	var request = $.ajax({
		url: settings.gallery_url + gallery_id,
		type: "GET",
		dataType: "json",
		cache: false
	});

	request.done(function(data) {            
        $.each(data, function(index, value) {
            console.log(value.id);
            if ($.inArray(value.id, displayed_image_ids) == -1) {
                console.log('hassdvcsd');
                // TODO: we shouldn't be compiling this template every time
                var source = $("#image-template").html();
                var template = Handlebars.compile(source);
                $('#gallery-container').append(template({'path': value.path}));

                displayed_image_ids.push(value.id);
            }
        });
        
        // Let's poll for 20 seconds.
        gallery_polls += 1;
        if (gallery_polls < 40) {
            window.setTimeout(check_status, 1000);
        }
	});
}

/* Our polling function for the thumbnail completion - end */