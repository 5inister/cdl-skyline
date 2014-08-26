<!DOCTYPE html>
<html>
<head>
	<link rel='stylesheet' type='text/css' href='stylesheet.css'/>
	<script src="jquery-1.10.2.min.js"></script>
	<script src="script.js"></script>
	<div id="fbidDiv" style="display:none;">
		<?php 
			$output = $_GET['fbid'];
			echo $output;
		?>
	</div>
</head>
	<body>
		<div id="body_container">
			<div id= "container">
				<div id= "secret"> 
					<img  src=""></img> 
					<div id="categoryMenu">
					</div>
				</div>
			</div>
			<div id="dudeContainer">
				<div id="mask">
					<img id="dude" src="./images/dudeSprite.png" </img>
				</div>
			</div>
		</div>
		<div id="controls" class="mobile">
			<div class="control" id="leftArrow"><img src="./images/leftArrow.png" alt="left"></div>
			<div class="control" id="rightArrow"><img src="./images/rightArrow.png" alt="right"></div>
		</div>	
	</body>
</html>