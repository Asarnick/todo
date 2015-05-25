<?php

class Todo {

	const NAME_FILE = 'data.json';

	/**
	 * Receive tasks list
	 */
	public function view()
	{
		$context = file_get_contents(self::NAME_FILE);

		if ($context === false) {
			$result = array('err'=> true, 'message' => 'Failed to get the tasks');

		} else {
			$result = array('err'=> false, 'tasks' => $context);
		}

		echo json_encode($result);
	}


	/**
	 * Add new task to list
	 *
	 * @param array $data - data task
	 */
	public function add($data)
	{
		if (isset($data['text']) and $data['text'] != '') {

			$result = array('err'=> true, 'message' => 'Could not add task');

			$contents = file_get_contents(self::NAME_FILE);

			if ($contents !== false) {

				if ($contents == '') {
					$id = 0;

				} else {
					$lines = json_decode($contents, true);
					$id = ++end($lines)['id'];
				}

				$new_task = array(
					'id'        => $id,
					'status'    => false,
					'text'      => htmlspecialchars(trim($data['text']))
				);

				$lines[] = $new_task;

				if (file_put_contents(self::NAME_FILE, json_encode($lines)) !== false) {

					$result = $new_task;
					$result['err'] = false;
				}
			}

		} else {
			$result = array('err'=> true, 'message' => 'Text is missing');
		}

		echo json_encode($result);
	}


	/**
	 * Delete task
	 *
	 * @param array $data - data task
	 */
	public function delete($data)
	{
		if (isset($data['id']) and preg_match("/^[\d]+$/", $data['id'])) {

			$result = array('err'=> true, 'message' => 'Could not delete task');

			$contents = file_get_contents(self::NAME_FILE);

			if ($contents !== false) {

				$lines = json_decode($contents, true);

				for ($i=0; $i<count($lines); ++$i) {

					if ($lines[$i]['id'] == $data['id']) {
						unset($lines[$i]);
						break;
					}
				}

				$lines = array_values($lines);

				if (file_put_contents(self::NAME_FILE, json_encode($lines)) !== false) {
					$result = array('err'=> false, 'id' => $data['id']);
				}
			}

		} else {
			$result = array('err'=> true, 'message' => 'Task not found');
		}

		echo json_encode($result);
	}


	/**
	 * Update task status
	 *
	 * @param array $data - task data
	 */
	public function update($data)
	{
		if (
			isset($data['id']) and preg_match("/^[\d]+$/", $data['id'])
			and isset($data['status'])
		) {

			$result = array('err'=> true, 'message' => 'Could not change task status');

			$contents = file_get_contents(self::NAME_FILE);

			if ($contents !== false) {

				$lines = json_decode($contents, true);

				for ($i=0; $i<count($lines); ++$i) {

					if ($lines[$i]['id'] == $data['id']) {
						$lines[$i]['status'] = !$lines[$i]['status'];
						break;
					}
				}

				if (file_put_contents(self::NAME_FILE, json_encode($lines)) !== false) {
					$result = array('err'=> false, 'id' => $data['id']);
				}
			}

		} else {
			$result = array('err'=> true, 'message' => 'Task not found');
		}

		echo json_encode($result);
	}
}
