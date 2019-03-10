var rideInfoJsonLookup = null;

var sortClickHandler = function(event) {
    //We have to hide the exposed route when we sort, otherwise strange things occur
    hidden_elem = $("div#hiddenInfo");
    data_elem = $("div#rideInfo");

    if (data_elem.parent()!=hidden_elem) {
	hidden_elem.append(data_elem);
    }	
    $("tr[class=routeInfo]").remove();
}


var closeHandler = sortClickHandler

    
var selectionHandler = function(event) {
    hidden_elem = $("div#hiddenInfo");
    data_elem = $("div#rideInfo");

    if (data_elem.parent()!=hidden_elem) {
	hidden_elem.append(data_elem);
    }	
    $("tr[class=routeInfo]").remove();

    //Now retrieve the JSON data for the clicked route
    ride_id = $(this).val();
    ride_info = rideInfoJsonLookup[ride_id];

    if (ride_info) {
	//Populate our ride detail element
	//https://stackoverflow.com/questions/819416/adjust-width-and-height-of-iframe-to-fit-with-content-in-it (potentail solution to resizing issue)
	$("iframe#mapmyfitness_route").attr("src", "http://snippets.mapmycdn.com/routes/view/embedded/"+ride_info.map_my_ride_id+"?width=600&height=400&elevation=true&info=true&line_color=E60f0bdb&rgbhex=DB0B0E&distance_markers=0&unit_type=metric&map_mode=ROADMAP");
				       
//	$("p#ride_description").text(ride_info.description);
//	$("td#ride_distance").text(ride_info.distance_miles);
//	$("td#ride_ascent").text(ride_info.ascent_metres);
//	$("td#ride_start").text(ride_info.start_point);
	$("a#ride_link").attr("href", "https://www.mapmyride.com/routes/view/"+ride_info.map_my_ride_id);
	$("div#ride_images").empty();

	  
	$("div#ride_images").html($.map(ride_info.photos, function (image) {
	    return "<img src=\""+image+"\" class=\"ridephoto\" />";
	}).join("")); 
	
	//and make it visible under our current row
	source_row=$(this).parents("tr");
	source_row.after("<tr class=\"routeInfo\"><td colspan=\"6\"></td></tr>");
	$("tr[class=routeInfo]>td").append(data_elem);
    } else {
	console.log("No such ride: "+ride_id);
    }
};

$(document).ready(function() {
    $.getJSON("rideInfo.json", function (data) {
	var table_rows = [];
	rideInfoJsonLookup = data;
	$.each(data, function(route_id, route_info) {
	    route_info.route_id = route_id;
	    rideInfoJsonLookup[route_id]=route_info;
	    var row = "<tr><td><button class=\"routeSelector\" value=\""+route_id+"\">"+
		route_info.route_name+"</button></td>"+
		"<td>"+route_info.distance_miles+"</td>"+
		"<td>"+route_info.ascent_metres+"</td>"+
		"<td>"+route_info.start_point+"</td>"+
		"<td>"+route_info.description+"</td>"+
		"<td><a href="+route_info.url+" target=\"_blank\">mapmyride.com</a></td></tr>";
	    table_rows.push(row);
	});
	$("table#rideTable tr:last").after( table_rows.join(""));
    }).error(function(err) {
	console.log("JSON parsing error");
	console.log(err)
    }).complete(function() {
	sorttable.makeSortable($("table#rideTable").get(0));
	$("table#rideTable th").click(sortClickHandler);
	$("button[class=routeSelector]").click(selectionHandler);
	$("button#closeButton").click(closeHandler);
    });
    
    
});
