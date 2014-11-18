var pixels = {};
var pixel_container;

function clear_pixel_container() {
	pixel_container.html('');
}

function add_pixel_line(pixel) {
	pixel_id = pixel['id'];
	// advertiser_id = pixel['advertiser_id'];
	newline = $(document).find('#pixel_row_template').clone().attr('id', 'pixel_row' + id);
	newline.find('.pixel_id').html(pixel_id); 
	newline.find('.pixel_name').html(pixel['name']); 
	// newline.find('.advertiser_id').html(advertisers[advertiser_id]['name']); 
	pixel_container.append(newline);
}

// Takes the element that made the request in order to identify which advertiser it belongs to
function display_fires(href) {
	pixel_id = $(href).parent().find('.pixel_id')[0].innerHTML;

	get_fires(pixel_id);
}

function update_pixels(json) {
	// clear_pixel_container();

	for (var p in json.data) {
		var pixel_id = json.data[p]['id'];
		var advertiser_id = json.data[p]['advertiser_id'];
		
		if (pixels[advertiser_id] == undefined) pixels[advertiser_id] = {};

		pixels[advertiser_id][pixel_id] = json.data[p];
	}
}

function get_pixels() {
	$.ajax({
		type: 'GET',
		url: '/pixels',
	    dataType: 'json',
		success: update_pixels,
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
		success: update_pixels,
	});
}

