<?php
	//open the json, find the iId that has just printed and remove it from the buffer.
	$dir = $_POST["uId"];
	$iId = $_POST["iId"];
	//Get existing buffer file
	$bufferFile = $dir .'/'. 'buffer.json';
	//Define an empty output array to push instances to be kept
	$out_buffer = array();
	//Convert to array by decoding the json
	$existing_buffer = json_decode(file_get_contents($bufferFile), true);
	for ($i=0; $i <sizeof($existing_buffer) ; $i++) { 
		if ($existing_buffer[$i]['iId']!=$iId){
			array_push($out_buffer, $existing_buffer[$i]);
		}
	}
	$fs1 = fopen($bufferFile,"w");
	//rencode the json and write back
	fwrite($fs1, json_encode($out_buffer));
	fclose($fs1);
	//echo 1 if there are any elements left in buffer
	if (0!=sizeOf($out_buffer)){
		echo 1;
	}
	//else echo 0
	else{
		echo 0;
	}
	
?>