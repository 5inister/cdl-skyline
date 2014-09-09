<?php
ini_set("log_errors" , "1");
ini_set("error_log" , "newUser_errors.log.txt");
$CHALLENGE = '2YvNhgv1EaPBa6wc7BMGWVaPk6MqpKeRpgO6RWmUlvXbrcmSNXR1FePPkJev';

try{
if (isset($_GET['challenge'])){
	$TEST = $_GET['challenge'];
	if (strcmp($CHALLENGE,$TEST ) == 0){
		$post_body = file_get_contents('php://input');
		if ($post_body){
			$jsobj = json_decode($post_body,true);
			$userID = $jsobj['uid'];
			$items = $jsobj['items'];
			$c = 0;
			$new_items=array();
			$category_list=array('art','beliefs','family','food','friends','travel','celebration','style','leisure');
			foreach ($items as $it){
				if (property_exists($it,'id')){
					$tm=time();
					$post_id = $it['id'];
					$url = $it['PictureURL'];
					$url_comment = $it['CommentURL'];
					$dt = $it['UpdatedTime'];
					$dt_create = $it['Date'];
					$labels = $it['Classification'];
					$probability = $it['ClassificationProbability'];
					$probability_img = $it['PictureClassification'];
					$probability_cmt = $it['CommentClassification'];
					$probability_post = $it['PostClassificationProbability'];
					$probability_gallery = $it['GalleryClassificationProbability'];
					$dominant_category_index= array_keys($probability, max($probability));
					if (count($dominant_category_index)>1){
						$dominant_category='uncategorised';
					}
					else{
						$dominant_category=$category_list[$dominant_category_index[0]];
					}
					$fname=$dominant_category.".png";
					$url_parts=explode('/',$url);
					$iId=end(explode('_',end($url_parts)));
					$visited=0;
					//file_put_contents("data/upd_$c"."_$userID.txt","$url,$dt,$labels,$probability");
					$this_new_item=array (
						"fname"=>$fname,
						"iId"=>$iId,
						"dominant_category"=>$dominant_category,
						"url"=>$url,
						"dt"=>$dt,
						"labels"=>$labels,
						"probability"=>$probability,
						"visited"=>$visited,
						"hasBeenViewed"=>false,
						"hasBeenCategorised"=>false
					);
					array_push($new_items,$this_new_item);
					$c++;
				}
				else{
					file_put_contents('noId.log.txt',json_encode($it));
				}
			}
			file_put_contents($userID.'/skyline.json',json_encode($new_items,'JSON_UNESCAPED_SLASHES'));
			echo "1";
		}else{
			echo "2";
		}
	}else{
		echo "3";
	}
}
}catch (Exception $e){
	file_put_contents($userID.'/skyline.json',$e->getMessage());
	echo "-1";
}
/*
try{
if (isset($_GET['challenge'])){
	$TEST = $_GET['challenge'];
	if (strcmp($CHALLENGE,$TEST ) == 0){
		$post_body = file_get_contents('php://input');
		if ($post_body){
			$jsobj = json_decode($post_body,true);
			$userID = $jsobj['uid'];
			$items = $jsobj['items'];
			$c = 0;
			foreach ($items as $it){
                $tm=time();
				$url = $it['url'];
				$dt = $it['datetime'];
				$labels=$it['labels'];
				$probability=$it['probability'];
				file_put_contents("data/new_$c"."_$userID.txt","$url,$dt,$labels,$probability");
				$c++;
			}
			echo "1";
		}else{ 
			echo "2";
		}
	}else{
		echo "3";
	}
}
}catch (Exception $e){
	file_put_contents('data/log_recieve.log',$e->getMessage());
	echo "-1";
}*/
?>
