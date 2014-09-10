<?php
	//Eneable error logging to php_errors.log.txt
	date_default_timezone_set('Europe/London');
	ini_set("log_errors" , "1");
	ini_set("error_log" , "php_errors.log.txt");
	//open the json, find the iId we have landed on in the javascript and update the 'visited variable. then write out the json again'
		// $dir = "100002179985407";
		// $iId = "10151744582222895.jpg";
		// $newDominantCategory = "travel";
	
	$dir = $_POST['uId'];
	$iId = $_POST["iId"];//'3698';
	$newDominantCategory = $_POST['newDominantCategory'];


	//$newDominantCategory = "family";
	$file = $dir .'/'. 'skyline.json';
	$histogramFile = $dir .'/'. 'histogram.json';
	//echo $file;
	//get the json from the file
	$existingJson = json_decode(file_get_contents($file), true);
	$histogramJson = json_decode(file_get_contents($histogramFile), true);
	//Make sure that the read json files aren't null
	while ($existingJson[0]==null){
		$existingJson = json_decode(file_get_contents($file), true);
	}
	while ($histogramJson==null){
		$histogramJson = json_decode(file_get_contents($histogramFile), true);
	}
	//go through it hunting for this iId
	for ($i=0; $i <sizeof($existingJson) ; $i++) { 
		//when we find it update the dominant category and histogram
		if($existingJson[$i]["iId"] ==$iId){
			$currentCategory=$existingJson[$i]["dominant_category"];
			$existingJson[$i]["dominant_category"] = $newDominantCategory;
			if ($currentCategory != $newDominantCategory){
				//substract one from current category on histogram and...
				$histogramJson[$currentCategory] -= 1;
				//..add one to the new category
				$histogramJson[$newDominantCategory] += 1;
			}
			//update the category
			$existingJson[$i]["fname"] = $newDominantCategory.'.png';
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
	//Write updated histogram
	$fs1 = fopen($histogramFile,"w");
	fwrite($fs1,json_encode($histogramJson));
	fclose($fs1);
	//Make sure json doesn't get written as null
	$just_written_json=json_decode(file_get_contents($histogramFile), true);

	while($just_written_json == null){
		$fs1 = fopen($histogramFile,"w");
		fwrite($fs1, json_encode($histogramJson));
		fclose($fs1);
		$just_written_json=json_decode(file_get_contents($histogramFile), true);
	}
	$response = array();
	array_push($response,$newDominantCategory);
	echo json_encode($response);

?>