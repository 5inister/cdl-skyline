<?php
	//open buffer.json, belonging to uId and clear all the elements in it.
	$dir = /*$_POST["uId"];*/'USER000';
	echo $dir;
	//Get existing buffer file
	$bufferFile = $dir .'/'. 'buffer.json';
	//Define an empty output array to overwrite the curent json
	$out_buffer = array();
	//One the buffer file
	$fs1 = fopen($bufferFile,"w");
	//encode the json and re-write back
	fwrite($fs1, json_encode($out_buffer));
	fclose($fs1);
?>