$(function(){

	$(document).ajaxComplete(queryCompleted);

	// Get tasks list
	getTasksList();

	// Add new task to list
	addNewTask();
});


/**
 * Get tasks list
 */
function getTasksList() {
	$.ajax({
		url: '/php/ajax.php',
		dataType: "json",
		type: "GET",
		cache: false,
		data : {action: 'view'},

		success: function(data) {
			var arr = [],
				tasks = $.parseJSON(data.tasks);

			if (tasks && tasks.length) {

				for (var i=0; i<tasks.length; ++i) {
					arr.push(getViewTask(tasks[i].id, tasks[i].status, tasks[i].text));
				}

				$('#end_list').before(arr);

				addHandlersTask($('li[id_task]'));

			} else if (data.err) {
				alert(data.message);
			}
		}
	});
}


/**
 * Add new task to list
 */
function addNewTask() {
	$('#add_task').on('click', function(){
		var new_task = $('#new_task');

		if ($.trim(new_task.val()) == '') {
			return false;
		}

		$.ajax({
			url: '/php/ajax.php',
			dataType: "json",
			type: "GET",
			cache: false,
			data: {
				action: 'add',
				data: {text: new_task.val()}
			},

			beforeSend: function() {
				new_task.val('');
			},

			success: function(data) {
				if (!data.err) {
					$('#end_list').before(getViewTask(data.id, data.status, data.text));
					addHandlersTask($("li[id_task="+data.id+"]"));

				} else {
					alert(data.message);
				}
			}
		});
	});

	// Sending by pressing key "Enter"
	$('#new_task').keyup(function(e){
		var charCode = (e.which) ? e.which : event.keyCode;

		if (charCode == 13) {
			$('#add_task').click();
		}
	});
}


/**
 * Building list task
 *
 * @param id
 * @param status
 * @param text
 * @returns {string} html string task
 */
function getViewTask(id, status, text) {

	var checked = status ? 'checked' : '',
		title = text.length > 19 ? text.substr(0, 19) + '...' : text;

	return "<li id_task=" + id +">" +
				"<div>" +
					"<label>" +
						"<input type='checkbox' class='check' "+ checked +">" +
						"<span title=\""+ text +"\">" + title + "</span>" +
					"</label>" +
					"<input type='image' src='/img/remove.png' class='destroy'>" +
				"</div>" +
			"</li>";
}


/**
 * Add handlers to the tasks list
 *
 * @param object
 */
function addHandlersTask(object) {

	deleteTask(object);

	showHideButtonDestroy(object);

	changeStatusTask(object);
}


/**
 * Adding handlers for showing remove icon
 *
 * @param object
 */
function showHideButtonDestroy(object) {
	object.hover(
		function() {
			$(this).find('.destroy').css('display', 'block');
		},

		function() {
			$(this).find('.destroy').css('display', 'none');
		}
	);
}


/**
 * Adding handlers for remove
 *
 * @param object
 */
function deleteTask(object) {
	object.find('.destroy').click(function() {

		$.ajax({
			url: '/php/ajax.php',
			dataType: "json",
			type: "GET",
			cache: false,
			data: {
				action: 'delete',
				data: {id: $(this).parents('li[id_task]').attr('id_task')}
			},

			success: function(data) {
				if (!data.err) {
					$("[id_task="+ data.id +"]").remove();

				} else {
					alert(data.message);
				}
			}
		 });
	});
}


/**
 * Adding handlers for update status
 *
 * @param object
 */
function changeStatusTask(object) {
	object.find('[type=checkbox]').change(function() {

		var self = $(this);

		$.ajax({
			url: '/php/ajax.php',
			dataType: "json",
			type: "GET",
			cache: false,
			data: {
				action: 'update',
				data: {
					id: $(this).parents('li[id_task]').attr('id_task'),
					status: self.prop('checked') ? true : false
				}
			},

			success: function(data) {
				if (data.err) {
					if (self.prop('checked')) {
						self.prop('checked', false);

					} else {
						self.prop('checked', true);
					}

					alert(data.message);
				}
			}
		});
	});
}


function queryCompleted(e, xhr) {

	if (typeof xhr.responseJSON.err == 'undefined') {
		alert('Invalid data');
	}
}
