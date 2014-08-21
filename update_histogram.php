<?php
	//open category histogram json add one to the category we landed on, then write out the json again'
	$dir = $_POST['uId'];
	//$dir = "USER000";
	$tileCategory = $_POST['tileCategory'];
	//$tileCategory='family';
	$file = $dir .'/'. 'histogram.json';
	//get the json from the file
	$existingJson = json_decode(file_get_contents($file), true);
	echo $existingJson[$tileCategory];
	//Make sure it loaded properly
	/*while ($existingJson[0]==null){
		$existingJson = json_decode(file_get_contents($file), true);
	}*/
	$existingJson[$tileCategory] += 1;
	//open the file as write over
	echo json_encode($existingJson);
	$fs = fopen($file,"w");
	//rencode the json and write back
	fwrite( $fs, json_encode($existingJson));
	fclose($fs);
	//Verify that it got properly written
	$just_written_json=json_decode(file_get_contents($file), true);
	echo $just_written_json;
	/*while($just_written_json[0] == null){
		$fs = fopen($file,"w");
		fwrite( $fs, json_encode($existingJson));
		fclose($fs);
		$just_written_json=json_decode(file_get_contents($file), true);
	}*/
?>