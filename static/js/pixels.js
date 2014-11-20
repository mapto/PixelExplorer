var pixels = {};
var pixel_container;  // initialised in page.js
var selected_pixel = null;

function clear_pixel_container() {
	pixel_container.html('');
	seleted_pixel = null;
}

function add_pixel_line(pixel) {
	pixel_id = pixel['id'];
	newline = $(document).find('#pixel_template').clone().attr('id', 'pixel' + pixel_id);
	newline.find('.pixel_id').html(pixel_id); 
	newline.find('.pixel_name').html(pixel['name']); 
	pixel_container.append(newline);
}

function deselect_pixels() {
	clear_fire_container();
	if (selected_pixel != null) {
		$('#pixel' + selected_pixel).removeClass('colour-fire selected');
		$('#pixel' + selected_pixel).addClass('colour-pixel');
	}
}

// Takes the element that made the request in order to identify which advertiser it belongs to
function select_pixel(href) {
	deselect_pixels();

	// dependency on DOM
	selected_pixel = $(href).parent().find('.pixel_id')[0].innerHTML;
	$('#pixel' + selected_pixel).removeClass('colour-pixel');
	$('#pixel' + selected_pixel).addClass('colour-fire selected');

	get_fires(selected_pixel);
}

// Gets from server
function fetch_pixels(json) {
	if (json.success != true) alert('Warning: Pixels server request failed!');

	for (var p in json.data) {
		var pixel_id = json.data[p]['id'];
		var advertiser_id = json.data[p]['advertiser_id'];
		
		if (pixels[advertiser_id] == undefined) {
			pixels[advertiser_id] = {};
		}

		pixels[advertiser_id][pixel_id] = json.data[p];
	}
}

// Updates display
function show_pixels() {
	clear_pixel_container();

	var empty = true;
	for (var p in pixels[selected_advertiser]) {
		add_pixel_line(pixels[selected_advertiser][p]);
		empty = false;
	}
	if (empty) {
		pixel_container.html($(document).find('#no_pixels_notice').clone());		
	}

	$('#pixel_add').show();
	fire_container.html($(document).find('#select_pixel_notice').clone());		
}

function update_pixels() {
	get_pixels();
	show_pixels();
}

function get_pixels() {
	$.ajax({
		type: 'GET',
		url: '/pixels',
	    dataType: 'json',
		success: fetch_pixels,
	});
}

// Takes the element that made the request in order to identify which pixel it belongs to
function delete_pixel(href) {

	ref_id = $(href).parent().find('.pixel_id')[0].innerHTML;
	result = confirm('This will remove pixel ' + pixels[ref_id]['name'] + ' (id=' + pixels[ref_id]['id'] + '). Are you sure?');
	if (!result) return;

	$.ajax({
		type: 'DELETE',
		url: '/pixels/' + ref_id,
	    dataType: 'json',
		success: handle_pixel_response,
	});
}

function edit_pixel(href) {
	var pixel_root = $(href).parent();
	var pixel_id = pixel_root.find('.pixel_id')[0].innerHTML;
	var form_id = 'pixel_form' + pixel_id;
	var replica = null

	if ($(pixel_root).find('#' + form_id).length == 0) {
		replica = $('#pixel_form').clone();
		replica.attr('id', form_id);
		pixel_root.append(replica);		
	} else {
		replica = $(pixel_root).find('#' + form_id);
	}

	form = replica[0];

	$(form).attr('method', 'PUT');

	form.id.value = pixel_id;
	form.name.value = pixels[selected_advertiser][pixel_id].name;  // currently visible pixels belong to the selected advertiser
	form.advertiser.value = selected_advertiser;
}

function add_pixel(href) {
	var pixel_root = $(href).parent();
	var pixel_id = '_new';
	var form_id = 'pixel_form' + pixel_id
	var replica = null;

	if ($(pixel_root).find('#' + form_id).length == 0) {
		replica = $('#pixel_form').clone();
		replica.attr('id', form_id);
		pixel_root.append(replica);
	} else {
		replica = $(pixel_root).find('#' + form_id);
	}

	form = replica[0];

	form.advertiser.value = selected_advertiser;
	$(form).attr('method', 'POST');
	$('#pixel_submit').html('Add');
}

function handle_pixel_response(json) {
	if (json.success != true) alert('Warning: Pixels server request failed!');

	get_pixels();
}

function submit_pixel(form) {
	// Upon PUT server does not read post code

	if ($(form).attr('method') == 'PUT') {
		$.ajax({
			type: 'PUT',
			url: '/pixels/' + form.id.value,
		    dataType: 'json',
		    data: {id: form.id.value, name: form.name.value, advertiser_id: form.advertiser.value},
			success: handle_pixel_response
		});	
	} else {
		$.ajax({
			type: 'POST',
			url: '/pixels',
		    dataType: 'json',
		    data: {name: form.name.value, advertiser_id: form.advertiser.value},
			success: update_pixels
		});	
	}
}