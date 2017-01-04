/**
 * 
 */

var canvas = new fabric.Canvas('canvas');
var canvas1 = new fabric.Canvas('canvas1');
var object_counter = 0;
var x = 510;
var y = 10;

function drawGrid(){
	var noOfBlocks = $("#arrayNumber").val();
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
	        var c = new fabric.Rect(gOptions);
	        var r = new fabric.Rect(rOptions);
	        
	        canvas.add(c);
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