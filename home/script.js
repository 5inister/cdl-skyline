$( document ).ready(function() {

	function detectmob() { 
	    if( navigator.userAgent.match(/Android/i)
	       || navigator.userAgent.match(/webOS/i)
	       || navigator.userAgent.match(/iPhone/i)
	       //|| navigator.userAgent.match(/iPad/i)
	       || navigator.userAgent.match(/iPod/i)
	       || navigator.userAgent.match(/BlackBerry/i)
	       || navigator.userAgent.match(/Windows Phone/i)
	     ){
	     	console.log('found mobile');
	        return true;
	      }
	     else {
	     	console.log('found desktop');
	        return false;
	      }
    }

	
	var spacing;
	var categories = ['art','beliefs','celebration','family','food','friends','style','travel'];
	var fontSize;
	
	if(detectmob()){
		spacing = window.innerWidth;
		fontSize =36;
	}
	else{
		spacing = window.innerHeight*0.3;
		fontSize =12;
		
	}
	//set up the proportions of everything with respect to the variable 'spacing'
	var dwidth = window.innerWidth;
	var margin= spacing*0.02;
	var padding= spacing*0.02;

	var sort_type = 1;
	var position_index =0;
	var is_moving = false;
	var num_elements = 0;
	var num_visible_elements = 6;
	//make ajax call - run php script which will return contents of our json file into array called data
		//alert("Hello, " + response);
	var useLogIn = false;
	var thisUId;

	var cellWidth = spacing*0.3;


	var cellProportion = 76/82;
	var cellHeight = cellWidth*cellProportion;

	var imageWidth = cellWidth*12;
	var imageHeight = cellHeight*3;

	var singleRowHeight = cellWidth*cellProportion;
	var doubleRowHeight = singleRowHeight*2;

	
	
	var imageWidthMinus2CellWidths = imageWidth-(2*cellWidth);

	//container has the tiles inside
	$('#container').css('width',dwidth +'px');
	$('#container').css('height',window.innerHeight+'px');
	
	
	$('#secret').css('width',spacing).css('height',spacing);
	$('#secret').find('img').click(function(){
		toggleShowPhoto(position_index);
	});

	for (var i = 0; i < categories.length; i++) {
		categories[i];
		var new_element = "<div class='category'>"+categories[i]+"</div>" ;
		$("#secret").append(new_element);
	};
	$('.category').css('font-size',fontSize+'pt');
	$('.category').data('color','white');
	$('.category').on('mouseenter', function(){
		// console.log('mouse');
		$(this).css('color','gray');
	});
	//bind the events to the elements we have just created
	$('.category').on('mouseleave', function(){
		// console.log('mouse');
		$(this).css('color',$(this).data('color'));
	});
	

	$('#controls').css('left','0px').css('top',spacing +'px');
	
	$('.control').css('font-size',(spacing*0.1)+'pt');
	$('.control').css('margin',(margin)+'px');
	$('.control').css('padding',padding+'px');
	
	$('#rightArrow').css('left',(spacing-($('#rightArrow').width()+(2*(padding+margin))) )).css('top',(margin+padding)+'px');
	$('#leftArrow').css('left',margin+'px').css('top',(margin+padding)+'px');
	
	$("#leftArrow").click(animateBackwards);
	$("#rightArrow").click(animateForward);
	

	// $("#categoryBtn").click(function(){toggleShowPhoto(position_index)});


	if(useLogIn){
		var response = prompt("What is your userID?");
		thisUId = response;
	}
	else{
		thisUId = "USER000";
	}

	$('#mask').css('width',cellWidth+'px').css('height',singleRowHeight+'px').css('top',(spacing-cellHeight)+'px' );
	$('#mask').find('img').css('width',imageWidth+'px').css('height',imageHeight+'px');
	var imageSource0 ="../"+thisUId+"/images/dudeSprite.png"
	
	
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
			// console.log(data[i]);
			//a global to tell us how many divs we have
			num_elements = data.length;
			var dir_plus_name ="../"+thisUId+"/images/"+data[i].fname;
			//console.log(dir_plus_name);
			var new_element = "<div id='tile_"+i+"' class='tile'>"+" <img src='"+dir_plus_name+"  '</div>" ;
			//var new_element = "<div id='tile_"+i+"' class='tile'><p>"+ data[i].dominant_category+ " </p>  <img src='"+dir_plus_name+"  '</div>" ;
			//var new_element = "<div id='new"+i+"' class='book'><p> <img src='"+dir_plus_name+"' width = '200'>" + "</p></div>" ;
			

			left_shift = -spacing*position_index;
			threshold_index = position_index;

	 		$("#container").append(new_element);// "<p>Test</p>" );
			$("#tile_"+i).css("left",(left_shift +(i*spacing))+"px");
			$("#tile_"+i).find('img').css("width",(spacing)+"px");
			$("#tile_"+i).data("iId", data[i].iId);
			//TODO change to real URL
			$("#tile_"+i).data("url", "../"+thisUId+"/images/"+data[i].url);
			$("#tile_"+i).data("dominant_category", data[i].dominant_category);

			//bind our click event
			$("#tile_"+i).on('click', function(){
				toggleShowPhoto(position_index);
			});
			//hide the far away elements
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
	var distance = spacing;

	//TODO this should probably be removed - at least for the mobile version
	$(document).keypress(function(e) {
		// if(e.which == 13) {
		// 	toggleShowPhoto(position_index);
  //   	}
		//go right with the tiles
  		if(e.which == 97) {
			animateBackwards();}
  		//go left with the tiles
  		if(e.which == 100) {
			animateForward();
  		}
	});
	
	
	function hidePhoto(){
		$("#secret").css("visibility","hidden");
	}
	
	function toggleShowPhoto(div_index){
		
		var visibility = $("#secret").css("visibility");
		if(visibility=='hidden'){
			//hide the buttons
			$("#controls").css('visibility','hidden');


			//get the data we need from the data attributed of the dom element
			var url = $("#tile_"+div_index).data("url");
			
			//TODO revise when we are sure how the categories are coming out of the json - ie with or without a file extension
			var categoryFname = $("#tile_"+div_index).data("dominant_category");
			var category =categoryFname.split('.')[0];
			console.log('dominant_category ',category);
			
			$('.category').each(function( index ) {
				console.log($(this).text());
				$(this).data('color','white');
				$(this).css('color','white');
				if($(this).text()==category){
					$(this).css('color','red');
					$(this).data('color','red');
				}
			});
			//for now use a spoof url
			url = '../'+thisUId+'/images/photo.jpg';

			//we need to make sure the new source image has loaded before we check the dimensions: hence this callback
			$("#secret").find("img").attr("src", url).load(function() {

				//now what's the maximum dimension of the image?
				var photoWidth = $("#secret").find("img").width();
				var photoHeight = $("#secret").find("img").height();
				// $('.category').width(photoWidth);
				//if landscape
				if(photoWidth>photoHeight){
					console.log('landscape');
					$("#secret").find("img").width(spacing+'px');
					$("#secret").find("img").height('auto');
				}
				//if portrait
				else if(photoHeight>photoWidth){
					console.log('portrait');
					$("#secret").find("img").height(spacing+'px');
					$("#secret").find("img").width('auto');
				}
				//if even dimensions
				else{
					$("#secret").find("img").width(spacing+'px');
					$("#secret").find("img").height('auto');
				}
				$('.category').width($("#secret").find("img").width());
			});

			$("#secret").css("visibility","visible");
			$("#secret").css('display','none').fadeIn( "slow");
			// $("#categoryMenu").find("span").text(category);

		}
		else if (visibility=='visible'){
			$("#secret").css("visibility","hidden");
			$("#controls").css('visibility','visible');
		}
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
	}
	$("#dude").attr("src",imageSource0);

	function animateForward(){
		console.log('is_moving ',is_moving)
		var startLeft=parseInt($(".tile").css("left"));
		var tick=0;

  		if(!is_moving){
  			is_moving = true;
			if(position_index<num_elements-1){
				hidePhoto();
				position_index++;
				
				$("#dude").css("left",0);
				$("#dude").css("top",-singleRowHeight);

				$(".tile").animate({
					left: "-="+distance
					}, {
						duration:speed,
						progress:function(promise,prog,remain){
							//var currentLeft=parseInt($(".tile").css("left"));
							//var travelled=startLeft-currentLeft;
							if (prog>tick*.08){
								var x = $("#dude").position().left;
								//console.log("dudex="+x);

								//if the image is shifted to the left less than the image width minus the size of one cell
								if (x > -imageWidthMinus2CellWidths){
									//then shift over by 82
									$("#dude").css("left",x-cellWidth);
								}
								else{
									//otherwise 
									$("#dude").css("left",0);
									$("#dude").css("top",-doubleRowHeight);
									tick=12;
								}
								tick++;	
							}
						},					
						complete:function() {
						// Animation complete.
							$("#dude").css("left",0);
							$("#dude").css("top",-doubleRowHeight);
							
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
				console.log("End of screen");
				$("#dude").css("left",-cellWidth);
				$("#dude").css("top",-doubleRowHeight);
				is_moving=false;
			}	
		}			
	}		
	function animateBackwards(){
		console.log('is_moving ',is_moving)
		var startLeft=parseInt($(".tile").css("left"));
		var tick=0;
  		if(!is_moving){
  			is_moving = true;
			if(position_index>0){
				hidePhoto();
				position_index--;
				$("#dude").css("left",0);
				$("#dude").css("top",0);
				$(".tile").animate({
					left: "+="+distance
					}, {
						duration:speed,
						progress:function(promise,prog,remain){
							//var currentLeft=parseInt($(".tile").css("left"));
							//var travelled=startLeft-currentLeft;
							if (prog>tick*.08){
								var x = $("#dude").position().left;
								//console.log("dudex="+x);
								if (x > -imageWidthMinus2CellWidths){
									$("#dude").css("left",x-cellWidth);
								}
								else{
									$("#dude").css("left",-cellWidth);
									$("#dude").css("top",-doubleRowHeight);
									tick=12;
								}
								tick++;	
							}
						},					
						complete:function() {
						// Animation complete.
							$("#dude").css("left",-cellWidth);
							$("#dude").css("top",-doubleRowHeight);
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
				console.log("End of screen");
				$("#dude").css("left",0);
				$("#dude").css("top",-doubleRowHeight);
				is_moving=false;
			}	
		}
	}
});