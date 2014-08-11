<?php
	//open the json, find the iId we have landed on in the javascript and update the 'visited variable. then write out the json again'
	$dir = $_POST['uId'];
	$iId = $_POST["iId"];//'3698';
	//$dir = "USER000";
	//$iId = 2025;//2910;
	//$newDominantCategory = $_POST['newDominantCategory'];

	$file = $dir .'/'. 'skyline.json';

	//echo $file;
	//get the json from the file
	$existingJson = json_decode(file_get_contents($file), true);

	//go through it hunting for this iId
	for ($i=0; $i <sizeof($existingJson) ; $i++) { 
		//when we find it update the visited flag
		if($existingJson[$i]["iId"] ==$iId){
			//make a new buffer object
			$existingJson[$i]["hasBeenViewed"] = true;
			
		}
	}
	//open the file as write over
	//echo json_encode($existingJson);
	$fs = fopen($file,"w");
	//rencode the json and write back
	fwrite( $fs, json_encode($existingJson));
	fclose($fs);
	// $response = array();
	// array_push($response,$newDominantCategory);
	// echo json_encode($response);
	
?>