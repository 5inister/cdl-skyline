$( document ).ready(function() {
	var sort_type = 1;
	var position_index =0;
	var is_moving = false;
	var num_elements = 0;
	var num_visible_elements = 6;
	//make ajax call - run php script which will return contents of our json file into array called data

	

		//alert("Hello, " + response);

	var useLogIn = true;

	var thisUId;

	if(useLogIn){
		var response = prompt("What is your userID?");
		thisUId = response;
	}
	else{
		thisUId = "USER000";
	}
	var imageSource0 ="../"+thisUId+"/images/dudeSprite.png"
	console.log(thisUId);
	$.post( "../get_skyline.php", {  uId: thisUId } , function( data ) {
		var found_start_pos = false;
		//console.log(data);
		for (var i = 0; i < data.length; i++) {				
		//if this picture is the first to be flagged as not yet visited set the start position to the picture left of it

			if(data[i].visited ==0 && !found_start_pos){
				position_index = i-1;
				found_start_pos = true;
			}
		}

		for (var i = 0; i < data.length; i++) {
			//console.log(data[i]);
			//a global to tell us how many divs we have
			num_elements = data.length;
			var dir_plus_name ="../"+thisUId+"/images/"+data[i].fname;
			//console.log(dir_plus_name);
			var new_element = "<div id='tile_"+i+"' class='tile'>"+" <img src='"+dir_plus_name+"  '</div>" ;
			//var new_element = "<div id='tile_"+i+"' class='tile'><p>"+ data[i].dominant_category+ " </p>  <img src='"+dir_plus_name+"  '</div>" ;
			//var new_element = "<div id='new"+i+"' class='book'><p> <img src='"+dir_plus_name+"' width = '200'>" + "</p></div>" ;
			var spacing = 300;

			left_shift = -spacing*position_index;
			threshold_index = position_index;
	 		
	 		$("#container").append(new_element);// "<p>Test</p>" );
			$("#tile_"+i).css("left",(left_shift +(i*spacing))+"px");
			$("#tile_"+i).data("iId", data[i].iId);
			if(i>=num_visible_elements+2+threshold_index){
				$("#tile_"+i).css("visibility","hidden");
			}
		};
		var first_iId=$("#tile_"+position_index).data('iId');
		$.post( "../update_skyline.php", {uId: thisUId, iId: first_iId}, function(data) { //Mark the first tile visited
			console.log("updated skyline with this iId ",first_iId);
		});
		
	}, "json");

	var speed = 1000;
	var distance = 300;

	$(document).keypress(function(e) {
		
		//console.log(e.which);

		if(e.which == 13) {
			toggleShowPhoto(position_index);
    	}
		//go right with the tiles
  		if(e.which == 97) {
  			console.log('is_moving ',is_moving)
  			if(!is_moving){
  				is_moving = true;
				if(position_index>0){
					hidePhoto();
					//console.log("press");
					position_index--;
					animateBackwards();//Animate the character walking left to right
					$(".tile").animate({
						left: "+="+distance
					}, speed, function() {
						// Animation complete.
						//this conditional counts how many animated elements there are in this class, if there are none all animation is finished
						if ($(".tile:animated").length === 0){
							console.log("gone right: position_index ",position_index);
							$(".tile").css("background-color","black");
							$("#tile_"+position_index).css("background-color","red");
							manageVisibility(position_index, num_visible_elements, num_elements);
							//console.log($("#tile_"+position_index).data('iId'));
							var thisIId = $("#tile_"+position_index).data('iId');//"3669";
							$.post( "../update_skyline.php", {  uId: thisUId, iId:thisIId } , function( data ) {
								console.log("updated skyline with this iId ",thisIId);
							});
							is_moving = false;
						}
					});
				}
			
				else{
					$("#dude").css("left",0);
					$("#dude").css("top",-151);
					is_moving= false;
				}
			}
			
  		}
  		//go left with the tiles
  		if(e.which == 100) {
  			console.log('is_moving ',is_moving)
  			if(!is_moving){
  				is_moving = true;
				if(position_index<num_elements-1){
					hidePhoto();
					position_index++;
					animateForward();//Animate the character walking right to left
					$(".tile").animate({
						left: "-="+distance
						}, speed, function() {
					// Animation complete.
						if ($(".tile:animated").length === 0){
							console.log("gone left . position_index ",position_index);
							$(".tile").css("background-color","black");
							$("#tile_"+position_index).css("background-color","red");
				    		manageVisibility(position_index, num_visible_elements, num_elements);
							var thisIId = $("#tile_"+position_index).data('iId');//"3669";

							$.post( "../update_skyline.php", {  uId: thisUId, iId:thisIId } , function( data ) {
								console.log("updated skyline with this iId ",thisIId);
							});
				    		is_moving = false;
						}
					});
				}
				else{
					$("#dude").css("left",-82);
					$("#dude").css("top",-151);
					is_moving= false;
				}
				
			}
  		}
	});
	$("#leftArrow").click(function(){
	  			console.log('is_moving ',is_moving)
  			if(!is_moving){
  				is_moving = true;
				if(position_index>0){
					hidePhoto();
					//console.log("press");
					position_index--;
					animateBackwards();//Animate the character walking left to right
					$(".tile").animate({
						left: "+="+distance
					}, speed, function() {
						// Animation complete.
						//this conditional counts how many animated elements there are in this class, if there are none all animation is finished
						if ($(".tile:animated").length === 0){
							console.log("gone right: position_index ",position_index);
							$(".tile").css("background-color","black");
							$("#tile_"+position_index).css("background-color","red");
							manageVisibility(position_index, num_visible_elements, num_elements);
							//console.log($("#tile_"+position_index).data('iId'));
							var thisIId = $("#tile_"+position_index).data('iId');//"3669";
							$.post( "../update_skyline.php", {  uId: thisUId, iId:thisIId } , function( data ) {
								console.log("updated skyline with this iId ",thisIId);
							});
							is_moving = false;
						}
					});
				}
			
				else{
					$("#dude").css("left",0);
					$("#dude").css("top",-151);
				}
			}
	});
	$("#rightArrow").click(function(){
		console.log('is_moving ',is_moving)
		var startLeft=parseInt($(".tile").css("left"));
		var tick=0;
  		if(!is_moving){
  			is_moving = true;
			if(position_index<num_elements-1){
				hidePhoto();
				position_index++;
				$("#dude").css("left",0);
				$("#dude").css("top",-76);
				//animateForward();//Animate the character walking left to right
				$(".tile").animate({
					left: "-="+distance
					}, {
						duration:speed,
						progress:function(promise,prog,remain){
							var currentLeft=parseInt($(".tile").css("left"));
							var travelled=startLeft-currentLeft;
							if (travelled>tick*25){
								var x = parseInt($("#dude").css("left"));
								//console.log("dudex="+x);
								if (x > -824){
									$("#dude").css("left",x-82);
								}
								else{
									$("#dude").css("left",0);
									$("#dude").css("top",-151);
								}
								tick++;
									
							}
						},					
						complete:function() {
						// Animation complete.
							if ($(".tile:animated").length === 0){
								console.log("gone left . position_index ",position_index);
								$(".tile").css("background-color","black");
								$("#tile_"+position_index).css("background-color","red");
								manageVisibility(position_index, num_visible_elements, num_elements);
								var thisIId = $("#tile_"+position_index).data('iId');//"3669";
								$.post( "../update_skyline.php", {  uId: thisUId, iId:thisIId } , function( data ) {
									console.log("updated skyline with this iId ",thisIId);
								});
								is_moving = false;
							}
						}
					});
			}
			else{
				$("#dude").css("left",-82);
				$("#dude").css("top",-151);
			}
				
		}			
	});
	function toggleShowPhoto(div_index){
		var visibility = $("#secret").css("visibility");

		if(visibility=='hidden'){
			var url = $("#tile_"+div_index).data("url");
			console.log(url);

			//for now use a spoof url
			url = "images/face.jpg";
			$("#secret").find("img").attr("src", url)
			$("#secret").css("visibility","visible");
		}
		else if (visibility=='visible'){
			$("#secret").css("visibility","hidden");
		}

	}
	function hidePhoto(){
		
		$("#secret").css("visibility","hidden");

	}
	function getIDofClosestTile(){
		var id=0;
		//console.log(id);
		return  id;
	}
	function manageVisibility(position_index, num_visible_elements, num_elements){
		//console.log("position_index ",position_index ," num_visible_elements ",num_visible_elements," num_elements ",num_elements);
		for(var i = position_index+num_visible_elements; i<num_elements;i++){
		    		$("#tile_"+i).css("visibility","hidden");
		    		//console.log("setting ")
    	}

    	for(var i = position_index-num_visible_elements; i>=0;i--){
    		$("#tile_"+i).css("visibility","hidden");
    	}
    	//$("#tile_"+(position_index-1)).css("visibility","visible");

    	for(var i = (position_index-num_visible_elements); i<=(position_index+num_visible_elements);i++){
		    $("#tile_"+i).css("visibility","visible");
    	}


    	// $("#tile_"+(position_index)).css("visibility","visible");
    	// $("#tile_"+(position_index+1)).css("visibility","visible");
    	// $("#tile_"+(position_index-1)).css("visibility","visible");
	}
	
	$("#dude").attr("src",imageSource0);
	function animateForward(){
		$("#dude").css("left",0);
		$("#dude").css("top",-76);
		var animation = setInterval(function(){
			var x = parseInt($("#dude").css("left"));
			//console.log(x);
			if (x > -824){
				$("#dude").css("left",x-82);
			}
			else{
				clearInterval(animation);
				$("#dude").css("left",0);
				$("#dude").css("top",-151);
				
			}
		},83);
	}		
	function animateBackwards(){
		$("#dude").css("left",0);
		$("#dude").css("top",0);
		var animation = setInterval(function(){
			var x = parseInt($("#dude").css("left"));
			//console.log(x);
			if (x > -824){
				$("#dude").css("left",x-82);
			}
			else{
				clearInterval(animation);
				$("#dude").css("left",-82);
				$("#dude").css("top",-151);
				
			}
		},83);
	}

});


 