<?php
	//open the json, find the iId we have landed on in the javascript and update the 'visited variable. then write out the json again'
	$dir = $_POST["uId"];//'USER000';//
	$iId = $_POST["iId"];//'3698';
	$file = $dir .'/'. 'skyline.json';
	echo $file;
	//get the json from the file
	$existingJson = json_decode(file_get_contents($file), true);
	while ($existingJson[0]==null){
		$existingJson = json_decode(file_get_contents($file), true);
	}
	//go through it hunting for this iId
	for ($i=0; $i <sizeof($existingJson) ; $i++) { 
		//when we find it update the visited flag
		if($existingJson[$i]["iId"] ==$iId){
			//make a new buffer object
			$bufferItem = array(
	          "iId" => $existingJson[$i]["iId"],
	          "fname" => $existingJson[$i]["fname"],
	          "timeStamp" => date('Y-m-d H:i:s')
		    );

			if($existingJson[$i]["visited"] ==0){
				//write to buffer file
				//load the buffer
				$bufferFile = $dir .'/'. 'buffer.json';
				$bufferJson = json_decode(file_get_contents($bufferFile), true);
				//if this is the first time then declare an array to push in to.
				if(sizeof($bufferJson)==0)$bufferJson = array();
				array_push($bufferJson, $bufferItem);
				$fs1 = fopen($bufferFile,"w");
				//rencode the json and write back
				fwrite( $fs1, json_encode($bufferJson));
				fclose($fs1);
				
				//Load the category histogram
				$histogramFile = $dir .'/'. 'histogram.json';
				$histogramJson = json_decode(file_get_contents($histogramFile), true);
				//Add one to this tile's category
				$histogramJson[$existingJson[$i]["dominant_category"]] += 1;
				//Re-write json
				$fs2 = fopen($histogramFile,"w");
				fwrite( $fs2, json_encode($histogramJson));
				fclose($fs2);
				$existingJson[$i]["visited"] =1;
			}

			
		}
	}
	//open the file as write over
	//echo json_encode($existingJson);
	$fs = fopen($file,"w");
	//rencode the json and write back
	fwrite( $fs, json_encode($existingJson));
	fclose($fs);
	$just_written_json=json_decode(file_get_contents($file), true);
	while($just_written_json[0] == null){
		$fs = fopen($file,"w");
		fwrite( $fs, json_encode($existingJson));
		fclose($fs);
		$just_written_json=json_decode(file_get_contents($file), true);
	}
?>