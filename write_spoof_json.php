<?php
  $json_all = array();
  $categories = array();
  //add out categoires
  array_push($categories, 'art');
  array_push($categories, 'beliefs');
  array_push($categories, 'celebration');
  array_push($categories, 'family');
  array_push($categories, 'food');
  array_push($categories, 'friends');
  array_push($categories, 'leisure');
  array_push($categories, 'old photos');
  array_push($categories, 'style');
  array_push($categories, 'travel');
  // array_push($categories, 'wtf');

  //how many do we want?
  $num_photos = 100;

  //default for dominant category
  $dominant_category='uncategorised';

//for each photo
  for ($i=0; $i <$num_photos; $i++) {
  	//probability stores the list of pretend probabilites, 1 for each category
    $probabilities=array();
  	
    //lets make a notional amount of probability to start with
    $remaining_prob=100;

    //for each of our categories
  	for ($j=0; $j<sizeof($categories)-1; $j++){
      //take a chunk of what's left
  		$current_prob=rand(0,$remaining_prob);
  		$remaining_prob -= $current_prob;
  		array_push($probabilities,$current_prob/100);
  	}
    //the final one is the left overs
  	array_push($probabilities,$remaining_prob/100);
  	
    //find the most probably category . it may be more than one and will defo be an array
    $dominant_category_index=array_keys($probabilities, max($probabilities));
  	
    //if there are several best categories, lets call it uncategorised
    if (count($dominant_category_index)>1){
  		$dominant_category='uncategorised';
  	}
  	else{
  		$dominant_category=$categories[$dominant_category_index[0]];
  	}
 
    //here's our new photo object
    $photoItem = array(
      //choose a random category from the list
      //concatenate it with the extension
          "fname" => $dominant_category.".png",
          "iId" => rand(1000,4000),
		      "probabilities" =>$probabilities,
          "dominant_category" => $dominant_category,
          "visited" => 0,
		      "url"=> "face.jpg"
    );
    # code...
    //add to our global array
    array_push($json_all, $photoItem);
  }
	print_r($json_all);

    $fs = fopen("skyline.json","w");
    //echo this out as json
    $myjson = json_encode($json_all);
    fwrite( $fs,$myjson );
	
?>