<?php

function __autoload($class_name) {
	$file_name =  $class_name . '.php';
	include_once($file_name);
}


if (isset($_GET['action'])) {

	$todo_object = new Todo();

	$class_methods = get_class_methods($todo_object);

	if (in_array($_GET['action'], $class_methods)) {

		$data = isset($_GET['data']) ? $_GET['data'] : array();

		$todo_object->$_GET['action']($data);
	}
}