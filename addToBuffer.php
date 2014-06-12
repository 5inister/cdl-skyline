<?php
//Get user Id (uId) from arguments
$uId=$_GET["uId"];
//Get item Id (iId) from arguments
$iId=$_GET["iId"];
echo "$uId"."<br>";
echo "$iId"."<br>";
echo "$uId"."/"."buffer.json"."<br>";
//Define the buffer file
$buffer_file=$uId."/"."buffer.json";
//Open and read the print buffer data
$str_data=file_get_contents($buffer_file);
$data=json_decode($str_data,true);

//Find the number of elements in the buffer
$elements=count($data);
echo $elements;
if ($elements==0){
	$out_buffer = fopen($buffer_file, 'w')
	      or die("Error opening output file");
	//TODO get $category from skyline.json iId
	fwrite($out_buffer, json_encode("{[iId:"."$iId".",dominat_category:"."$category".",time_added:".date('Y-m-d H:i:s')."]}",JSON_UNESCAPED_UNICODE));
	fclose($out_buffer);

?>
