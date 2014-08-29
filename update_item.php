<?php
	//open the json, find the iId we are looking for and update the probability. then write out the json again'
	$dir = $_POST['uId'];
	$iId = $_POST["iId"];
	$newProbabilities; = $_POST['new_probabilities'];
	$file = $dir .'/'. 'skyline.json';
	//get the json from the file
	$existingJson = json_decode(file_get_contents($file), true);
	//Make sure that the read json file isn't null
	while ($existingJson[0]==null){
		$existingJson = json_decode(file_get_contents($file), true);
	}
	//go through it hunting for this iId
	for ($i=0; $i <sizeof($existingJson) ; $i++) { 
		//when we find it update the probability
		if($existingJson[$i]["iId"] ==$iId){
			$existingJson[$i]["probabilities"] = $newProbabilities;
		}
	}
	//open the file as write over
	//echo json_encode($existingJson);
	$fs = fopen($file,"w");
	//rencode the json and write back
	fwrite( $fs, json_encode($existingJson));
	fclose($fs);
	//Make sure json doesn't get written as null
	$just_written_json=json_decode(file_get_contents($file), true);
	while($just_written_json[0] == null){
		$fs = fopen($file,"w");
		fwrite( $fs, json_encode($existingJson));
		fclose($fs);
		$just_written_json=json_decode(file_get_contents($file), true);
	}
	/*array_push($response,$newDominantCategory);
	echo json_encode($response);*/
?>