<?php
	$json_all = array();

  $categories = array();

  array_push($categories, 'art');
  array_push($categories, 'beliefs');
  array_push($categories, 'family');
  array_push($categories, 'food');
  array_push($categories, 'friends');
  array_push($categories, 'travel');
  array_push($categories, 'celebration');
  array_push($categories, 'style');
  // array_push($categories, 'leisure');
  // array_push($categories, 'old photos');
  // array_push($categories, 'wtf');
  $num_photos = 100;

  for ($i=0; $i <$num_photos ; $i++) { 
    $category = $categories[ rand( 0,sizeof($categories)-1 ) ];
    $photoItem = array(
      //choose a random category from the list
      
      //concatenate it with the extension
          "fname" => $category.".png",
          "iId" => rand(1000,4000),
          "dominant_category" => $category,
          "visited" => 0,
		  "url"=> "face.jpg"
    );
    # code...
    //add to our global array
    array_push($json_all, $photoItem);
  }
	

    $fs = fopen("skyline.json","w");
    //echo this out as json
    $myjson = json_encode($json_all);
    fwrite( $fs,$myjson );
	
?>