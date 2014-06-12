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
			foreach ($items as $it){
                $tm=time();
				$url = $it['url'];
				$dt = $it['datetime'];
				$labels = $it['labels'];
				$probability = $it['probability'];
				file_put_contents("data/upd_$c"."_$userID.txt","$url,$dt,$labels,$probability");
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
}
?>
