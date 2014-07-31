<?php
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
			foreach ($items as $it){
                $tm=time();
				$url = $it['url'];
				$dt = $it['datetime'];
				$labels = $it['labels'];
				$probability = $it['confidence'];
				$dominant_category_index= array_keys($probability, max($probability));
				if (count($dominant_category_index)>1){
					$dominat_category='uncategorised';
				}
				else{
					$dominat_category=labels[dominat_category_index];
				}
				$fname=$dominat_category.".png";
				$url_parts=explode('/',$url);
				$iId=end(explode('_',end($url_parts)));
				$visited=0;
				//file_put_contents("data/upd_$c"."_$userID.txt","$url,$dt,$labels,$probability");
				$this_new_item=array (
				"fname"=>$fname,
				"iId"=>$iId,
				"dominant_category"=>$dominat_category,
				"url"=>$url,
				"dt"=>$dt,
				"labels"=>$labels,
				"probability"=>$probability,
				"visited"=>$visited,				
				);
				array_push($new_items,$this_new_item);
				$c++;
			}
			$contents=file_get_contents($userID.'/skyline.json');
			$existing_items=json_decode($contents,true);
			$final_items=array_merge($existing_items,$new_items);
			file_put_contents($userID.'/skyline.json',json_encode($final_items));
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
?>