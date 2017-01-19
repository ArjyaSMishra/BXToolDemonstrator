/**
 * 
 */

var canvas = new fabric.Canvas('canvas');
var canvas1 = new fabric.Canvas('canvas1');
var object_counter = 0;
var x = 512;
var y = 12;

window.onload = init;

function init(){
	console.log("gggg11");
	var initGridNo = 5;
	$.ajax({
      url: 'InitController',
      type: 'GET',
      dataType: 'json',
      success: function(data){
      	console.log(data);
//      	var Layout = new fabric.Canvas('Layout');
//      	var Workspace = new fabric.Canvas('Workspace');
      	
      	drawGrid(3);
      }
       });
}

function drawGrid(noofgrid){
	var noOfBlocks = noofgrid;
	//var noOfBlocks = $("#arrayNumber").val();
	var blockHeight = canvas.height/noOfBlocks;
	var blockWidth = canvas.width/noOfBlocks;
	for (var i = 0; i < noOfBlocks; i++) {
	    for (var j = 0; j < noOfBlocks; j++) {
	        var gOptions = {
	            width: blockWidth,
	            height: blockHeight,
	            top: blockHeight * j,
	            left: blockWidth * i,
	            hasControls: false,
	            stroke: '#000000',
	            fill: 'transparent',
	            lockMovementX: true,
	            lockMovementY: true,
	            borderColor: 'transparent',
	        };
	        var rOptions = {
	            width: blockWidth,
	            height: blockHeight,
	            top: blockHeight * j,
	            left: blockWidth * i,
	            //rx: 10,
	            //ry: 10,
	            hasControls: false,
	            stroke: '#000000',
	            fill: 'transparent',
	            lockMovementX: true,
	            lockMovementY: true,
	            borderColor: 'transparent',
	            subType: 'button',
	            id: 'button_' + i + '_' + j
	    };
	        //var c = new fabric.Rect(gOptions);
	        var r = new fabric.Rect(rOptions);
	        
	        //canvas.add(c);
	        canvas.add(r);
	    }
	}
	$("#grid_btn").disabled = false;
	$("#arrayNumber").attr("disabled", "disabled");
}

function addObject() {
	var object= $("#objectSelect").val();
	canvas1.add(new fabric.Circle({ radius: 10, fill: '#f55', left:x-510, top:y-10, id: object+"_"+ object_counter }));
	object_counter++;
}

function showInfo(val) {
	$('#messageDialog').text(val);
}

function deleteObject() {
    canvas1.getActiveObject().remove();
}

function synchroTransform() {
	
	var jsonObj = {
			id: canvas1.getObjects()[0].get('id'),
		    posX:canvas1.getObjects()[0].get('left'),
		    posY:canvas1.getObjects()[0].get('top'),
		    fillColor: canvas1.getObjects()[0].get('fill')
			}

	$.ajax({
        url: 'PilotController',
        type: 'POST',
        dataType: 'json',
        data: { 
            loadProds: 1,
            jsonData: JSON.stringify(jsonObj) 
          },
        success: function(data){
            for(var i= 0; i< canvas.getObjects().length; i++){
            	if(canvas.getObjects()[i].get('id') === data.id){
            		canvas.getObjects()[i].setFill(data.fillColor);
            		canvas.renderAll();
            	}
            		
            }
        }
         });
	//console.log(JSON.stringify(canvas));
}

function createProg(){
	$.ajax({
        url: 'PilotController',
        type: 'GET',
        dataType: 'json',
        success: function(data){
            canvas1.add(new fabric.Circle({ radius: 10, fill: data[0].fillColor, left:data[0].posX, top:data[0].posY, id: data[0].id }));
        }
         });
}

canvas.hoverCursor = 'pointer';
canvas1.hoverCursor = 'pointer';

canvas1.on('mouse:down', function(options){
	$("#cursorx").val(options.e.clientX);
	$("#cursory").val(options.e.clientY);
	x = options.e.clientX;
	y = options.e.clientY;
	});
	
canvas1.on('mouse:move',function(options){
    var pt = { x: options.e.clientX, y: options.e.clientY };
    
    if(options.target!= null) {
    	showInfo(options.target.id);
    }  
});

canvas1.on('mouse:out', function(e) {
	$('#messageDialog').text("");
  });
  
canvas1.on('object:added', function(e) {
    if(e.target!= null) {
    	console.log(e.target.id + " created");
    } 
 });
 
canvas1.on('object:removed', function(e) {
    if(e.target!= null) {
    	console.log(e.target.id + " deleted");
    } 
 });
 
canvas1.on('object:moving', function(e) {
    console.log("object moved to Y: " + e.e.clientY);
 });

canvas.on('mouse:down', function (e) {
        if (e.target.get('subType') == 'button') {
        	
            console.log('button ' + e.target.id + ' was clicked');
            var currentColor = e.target.fill;
             
            e.target.setFill("#cc0000");
            switch (currentColor) {
            case 'transparent':
              e.target.setFill("#000");
              break;
            case '#000':
              e.target.setFill("#cc0000");
              break;
            case '#cc0000':
                e.target.setFill("#ffff00");
                break;
            case '#ffff00':
                e.target.setFill("#008000");
                break;
            case '#008000':
              e.target.setFill("transparent");
              break;
          }
            canvas.renderAll();
        }
});

canvas1.renderAll();