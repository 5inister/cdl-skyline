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

	//spacing is the main variable defining the width and height of one category image
	var spacing;
	var categories = ['art','beliefs','celebration','family','food','friends','leisure','old photos' ,'style','travel','uncategorised'];
	//should be set according to the user agent
	var fontSize;
	//this is the main index defining which tile is currently active
	var position_index =0;

	var userNameMap = [];
	var useMobile = false;
	var thisUId;
	var useLogIn = false;
	var user_0 = []
	userNameMap['5inister']='USER000';
	userNameMap['5555555inister']='USER000jalskdghaklsjdlkajhsdlkgfhjadlk';

	
	if(detectmob()){
		useMobile = true;
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
	
	var is_moving = false;
	var num_elements = 0;
	var num_visible_elements = 6;
	//make ajax call - run php script which will return contents of our json file into array called data
		//alert("Hello, " + response);
	
	

	var cellWidth = spacing*0.3;


	var cellProportion = 76/82;
	var bleed = 1;
	var cellHeight = (cellWidth*cellProportion)-bleed;

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
		$("#categoryMenu").append(new_element);
	};
	$('.category').css('font-size',fontSize+'pt');
	$('.category').css('color','gray');
	$('.category').on('click', function(){
		console.log('$("#tile_"+position_index).data id ' ,$("#tile_"+position_index).data('iId'));
		var newDominantCategory = $(this).text();
		 $.post( "../update_dominant_category.php", { uId: thisUId, newDominantCategory: $(this).text(), iId: $("#tile_"+position_index).data('iId') } , function( data ) {
		 	console.log(data);

		 	
		 	$("#tile_"+position_index).data("dominant_category", newDominantCategory);
		 	$('.category').css('color','gray');
		 	
		 	$('.category').each(function( index ) {	
		 		
		 		console.log(categories[index], newDominantCategory);

				 if( $(this).data('category')==newDominantCategory){
				 	
				 	$(this).css('color','white');
				// 	$(this).data('color','red');
				 }
				 else{
				 	$(this).css('color','gray');
				 }

			});


		 }, "json");

		 $.post( "../update_categorised.php", { uId: thisUId, iId: $("#tile_"+position_index).data('iId') } , function( data ) {
		 //	console.log(data);

		 }, "json");
		var newUrl = "../"+thisUId+"/images/"+newDominantCategory+".png";
		$("#tile_"+position_index).data("url", newUrl);
		$("#tile_"+position_index).find('img').attr('src', newUrl);
	});

	$('#controls').css('left','0px').css('top',spacing +'px');
	
	$('.control').css('font-size',(spacing*0.1)+'pt');
	$('.control').css('margin',(margin)+'px');
	$('.control').css('padding',padding+'px');
	

	$('#rightArrow').find('img').load(function(){
		console.log('loaded');
		var offset = $('#rightArrow').width();
		console.log('offset ',offset);
		var rightArrow =spacing - ((2*padding)+offset+(2*margin)); 
		$('#rightArrow').css('left',rightArrow).css('top',(margin+padding)+'px');
		$('#leftArrow').css('left',margin+'px').css('top',(margin+padding)+'px');
		}
	);
	
	$("#leftArrow").click(animateBackwards);
	$("#rightArrow").click(animateForward);


	$("#dude").css("left",0);
	$("#dude").css("top",-doubleRowHeight);
	// $("#categoryBtn").click(function(){toggleShowPhoto(position_index)});

	///TODO add mapping from easy username
	if(useLogIn){
		var response = prompt("What is your userID?");
		thisUId = userNameMap[response];
	}
	else{
		thisUId = userNameMap["5inister"];
	}

	$('#mask').css('width',cellWidth+'px').css('height',singleRowHeight+'px').css('top',(spacing-cellHeight)+'px' );
	$('#mask').find('img').css('width',imageWidth+'px').css('height',imageHeight+'px');
	var imageSource0 ="../"+thisUId+"/images/dudeSprite.png"
	
	var logInSuccess = false;
	
	$.post( "../get_skyline.php", {  uId: thisUId } , function( data ) {
		var found_start_pos = false;

		console.log(data);
		if(data!==null) {
			logInSuccess = true;
			console.log('login success');
		}
		else{
			console.log('login failure');
			$('#body_container').remove();
			$('#controls').remove();
			$('#secret').remove();
			$('#dudeContainer').remove();

			var new_element = "<div id='failureMessage' > Your login was not correct. Please try again</div>" ;
			$("body").append(new_element).css('color','white');
		}
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
			// $("#tile_"+i).css("border-left","solid 2px");
			// $("#tile_"+i).css("border-right","solid 2px");
			// $("#tile_"+i).css("border-color","white");

			$("#tile_"+i).find('img').css("width",(spacing+1)+"px");
			$("#tile_"+i).data("iId", data[i].iId);
			$("#tile_"+i).data("index",i);
			$("#tile_"+i).data("probabilities", data[i].probabilities);
			//TODO change to real URL
			$("#tile_"+i).data("url", "../"+thisUId+"/images/"+data[i].url);
			$("#tile_"+i).data("dominant_category", data[i].dominant_category);

			//bind our click event
			$("#tile_"+i).on('click', function(){
				console.log('index is ',$(this).data('index'));//
				if($(this).data('index')==position_index){
					toggleShowPhoto(position_index);
				}
				
		
				$.post( "../update_viewed.php", { uId: thisUId,  iId: $("#tile_"+position_index).data('iId') } , function( data ) {
				 //	console.log(data);
				 	}, "json");
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
	function compare(a,b) {
		  if (a.probability > b.probability)
		     return -1;
		  if (a.probability < b.probability)
		    return 1;
		  return 0;
		}
	
	function toggleShowPhoto(div_index){
		
		var visibility = $("#secret").css("visibility");
		//if it's hidden then show it
		if(visibility=='hidden'){
			//hide the buttons
			$("#controls").css('visibility','hidden');
			$("#dudeContainer").css('visibility','hidden');
			$("#tile"+div_index).css('visibility','hidden');

			//get the data we need from the data attributed of the dom element
			var url = $("#tile_"+div_index).data("url");
			
			//TODO revise when we are sure how the categories are coming out of the json - ie with or without a file extension
			var categoryFname = $("#tile_"+div_index).data("dominant_category");
			var category =categoryFname.split('.')[0];

			//console.log('dominant_category ',category);
			

			var probabilities = $("#tile_"+div_index).data("probabilities");
			
			var menuList = [];
			//make an array of objects which we can then sort by key
			for (var i = 0; i < categories.length; i++) {
				probabilities[i];
				var o = [];//{probabilities[i],categories[i]};
				
				o['probability']=probabilities[i];
	   		 	o['category']= categories[i];
	   		 	menuList.push(o);
			};
			//console.log(menuList);
			menuList.sort(compare);
			
			//console.log(menuList);
			
			$('.category').each(function( index ) {
				console.log(menuList[index]['category'],menuList[index]['probability']);
				// console.log($(this).text());
				$(this).text(menuList[index]['category']);
				$(this).data('category',menuList[index]['category'] );
				// $(this).data('color','white');
				// $(this).css('color','white');
				 if(menuList[index]['category']==category){
				 	$(this).css('color','white');
				// 	$(this).data('color','red');
				 }
				 else{
				 	$(this).css('color','gray');
				 }

			});
			
			var menuHeight = (window.innerHeight - spacing);
			//console.log(menuHeight);
			$("#categoryMenu").css('height',menuHeight+'px');
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
				//	console.log('landscape');
					$("#secret").find("img").width(spacing+'px');
					$("#secret").find("img").height('auto');
				}
				//if portrait
				else if(photoHeight>photoWidth){
				//	console.log('portrait');
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

			setTimeout(setVisibility, 500);
			
			//$("#secret").css('display','none');//.fadeIn( "fast");
			// $("#categoryMenu").find("span").text(category);

		}
		//otherwise hide it
		else if (visibility=='visible'){
			$("#secret").css("visibility","hidden");
			$("#controls").css('visibility','visible');
			$("#dudeContainer").css('visibility','visible');
			$("#tile"+div_index).css('visibility','visible');
		}
	}
	function setVisibility(){
				$("#secret").css("visibility","visible")
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