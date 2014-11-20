var advertisers = {};
var advertiser_container;  // initialised in page.js
var selected_advertiser = null;

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
	selected_advertiser = null;
}

function add_advertiser_line(advertiser) {
	id = advertiser['id'];
	newline = $(document).find('#advertiser_template').clone().attr('id', 'advertiser' + id);
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

function deselect_advertisers() {
	reset_pixels();
	if (selected_advertiser != null) {
		$('#advertiser' + selected_advertiser).removeClass('selected');
	}
}

// Takes the element that made the request in order to identify which advertiser it belongs to
function select_advertiser(href) {
	deselect_advertisers();

	// dependency on DOM
	var advertiser_root = $(href).parent();
	selected_advertiser = $(advertiser_root).find('.advertiser_id')[0].innerHTML;
	$(advertiser_root).parent().addClass('selected');

	clear_pixel_container();

	if (pixels[selected_advertiser] == undefined || pixels[selected_advertiser].length == 0) {
		pixel_container.html($(document).find('#no_pixels_notice').clone());
		return;
	} 

	for (var p in pixels[selected_advertiser]) {
		add_pixel_line(pixels[selected_advertiser][p]);
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
		success: handle_advertiser_response,
	});
}

function edit_advertiser(href) {
	var advertiser_root = $(href).parent();
	var advertiser_id = advertiser_root.find('.advertiser_id')[0].innerHTML;
	var form_id = 'advertiser_form' + advertiser_id;
	var replica = null

	if ($(advertiser_root).find('#' + form_id).length == 0) {
		replica = $('#advertiser_form').clone();
		replica.attr('id', form_id);
		advertiser_root.append(replica);		
	} else {
		replica = $(advertiser_root).find('#' + form_id);
	}

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
	var form_id = 'advertiser_form' + advertiser_id
	var replica = null;

	if ($(advertiser_root).find('#' + form_id).length == 0) {
		replica = $('#advertiser_form').clone();
		replica.attr('id', form_id);
		advertiser_root.append(replica);
	} else {
		replica = $(advertiser_root).find('#' + form_id);
	}

	form = replica[0];

	$(form).attr('method', 'POST');
	$('#advertiser_submit').html('Add');
}

function handle_advertiser_response(json) {
	if (json.success != true) alert('Warning: Advertisers server request failed!');

	get_advertisers();
}

function submit_advertiser(form) {
	// Upon PUT server does not read post code

	if ($(form).attr('method') == 'PUT') {
		$.ajax({
			type: 'PUT',
			url: '/advertisers/' + form.id.value,
		    dataType: 'json',
		    data: {id: form.id.value, name: form.name.value, address: form.address.value, city: form.city.value, post_code: form.post_code.value, tel: form.phone.value},
			success: handle_advertiser_response
		});	
	} else {
		$.ajax({
			type: 'POST',
			url: '/advertisers',
		    dataType: 'json',
		    data: {name: form.name.value, address: form.address.value, city: form.city.value, post_code: form.post_code.value, tel: form.phone.value},
			success: update_advertisers
		});	
	}
}