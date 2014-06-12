<?php
	//$dir will be replaced by a post variable
	$dir = $_POST["uId"];
	$file = $dir .'/'. 'skyline.json';
	//load the python created from the scrape
	$tiles = json_decode(file_get_contents($file), true);

	echo json_encode($tiles);
	
?>