var fire_container;  // initialised in page.js

function clear_fire_container() {
	fire_container.html('');
}

function add_fire_line(fire) {
	fire_id = fire['id'];
	// pixel_id = fire['pixel_id'];
	newline = $(document).find('#fire_template').clone().attr('id', 'fire_row' + id);
	newline.find('.fire_id').html(fire_id); 
	newline.find('.fires').html(fire['fires']); 
	newline.find('.date').html(new Date(fire['date']).toUTCString()); 
	// newline.find('.advertiser_id').html(advertisers[advertiser_id]['name']); 
	fire_container.append(newline);
}

function update_fires(json) {
	var fires = {};

	for (var a in json.data.fires) {
		fires[json.data.fires[a]['id']] = json.data.fires[a];
	}

	clear_fire_container();

	var empty = true;
	for (var f in fires) {
		add_fire_line(fires[f]);
		empty = false;
	}
	if (empty) {
		fire_container.html($(document).find('#no_fires_notice').clone());		
	}
}

function get_fires(pixel_id) {
	$.ajax({
		type: 'GET',
		url: '/pixels/' + pixel_id,
	    dataType: 'json',
		success: update_fires,
	});
}