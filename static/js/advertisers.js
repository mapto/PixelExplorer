var advertisers = {};
var advertiser_container;

function update_advertisers(json) {
	if (json.success != true) alert('Warning: Advertisers server request failed!');

	clear_advertiser_container();

	for (var a in json.data) {
		add_advertiser_line(json.data[a]);
		advertisers[json.data[a]['id']] = json.data[a];
	}
}

function clear_advertiser_container() {
	advertisers = {};
	advertiser_container.html('');
}

function add_advertiser_line(advertiser) {
	id = advertiser['id'];
	newline = $(document).find('#advertiser_row_template').clone().attr('id', 'advertiser_row' + id);
	newline.find('.advertiser_id').html(id); 
	newline.find('.advertiser_name').html(advertiser['name']); 
	var address = advertiser['address'];
	
	if (advertiser['city'] != null && advertiser['city'].trim() != "") {
		address += ", " + advertiser['city'];
	}

	if (advertiser['post_code'] != null && advertiser['post_code'].trim() != "") {
		address += ", " + advertiser['post_code'];
	}

	if (advertiser['tel'] != null && advertiser['tel'].trim() != "") {
		address += "<br/>phone: " + advertiser['tel'];
	}

	newline.find('.advertiser_contact').html(address); 
	advertiser_container.append(newline);
}

function get_advertisers() {
	$.ajax({
		type: 'GET',
		url: '/advertisers',
	    dataType: 'json',
		success: update_advertisers,
	});
}

// Takes the element that made the request in order to identify which advertiser it belongs to
function display_pixels(href) {
	advertiser_id = $(href).parent().find('.advertiser_id')[0].innerHTML;

	clear_pixel_container();

	if (pixels[advertiser_id] == undefined || pixels[advertiser_id].length == 0) {
		pixel_container.html($(document).find('#no_pixels_notice').clone());
		return;
	} 

	for (var p in pixels[advertiser_id]) {
		add_pixel_line(pixels[advertiser_id][p]);
	}
}

// Takes the element that made the request in order to identify which advertiser it belongs to
function delete_advertiser(href) {

	ref_id = $(href).parent().find('.advertiser_id')[0].innerHTML;
	result = confirm('This will remove advertiser ' + advertisers[ref_id]['name'] + ' (id=' + advertisers[ref_id]['id'] + '). Are you sure?');
	if (!result) return;

	$.ajax({
		type: 'DELETE',
		url: '/advertisers/' + ref_id,
	    dataType: 'json',
		success: update_advertisers,
	});
}

function edit_advertiser(href) {
	var advertiser_root = $(href).parent();
	var advertiser_id = advertiser_root.find('.advertiser_id')[0].innerHTML;

	var replica = $('#advertiser_form').clone();
	replica.attr('id', 'advertiser_form' + advertiser_id);
	advertiser_root.append(replica);

	form = replica[0];

	$(form).attr('method', 'PUT');
	// form.action = "/advertisers/" + advertiser_id;
	$('#advertiser_submit').html('Update');
	//$('#advertiser_submit').click('form.submit()');	

	form.id.value = advertiser_id;
	form.name.value = advertisers[advertiser_id].name;
	form.address.value = advertisers[advertiser_id].address;
	form.city.value = advertisers[advertiser_id].city;
	form.phone.value = advertisers[advertiser_id].tel;
	form.post_code.value = advertisers[advertiser_id].post_code;
}

function add_advertiser(href) {
	var advertiser_root = $(href).parent();
	var advertiser_id = '_new';

	var replica = $('#advertiser_form').clone();
	replica.attr('id', 'advertiser_form' + advertiser_id);
	advertiser_root.append(replica);

	form = replica[0];

	$(form).attr('method', 'POST');
	$('#advertiser_submit').html('Add');
}

function submit_advertiser(form) {
	// Upon PUT server does not read post code

	$.ajax({
		type: $(form).attr('method'),
		url: '/advertisers' + ($(form).attr('method') == 'PUT' ? '/' + form.id.value : ''),
	    dataType: 'json',
	    data: {id: form.id.value, name: form.name.value, address: form.address.value, city: form.city.value, post_code: form.post_code.value, tel: form.phone.value},
		success: update_advertisers
	});	
}