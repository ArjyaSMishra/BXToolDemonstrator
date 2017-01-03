/**
 * 
 */

var canvas = new fabric.Canvas('canvas');
var canvas1 = new fabric.Canvas('canvas1');
var sink_No = 0;
var table_No = 0;

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
 
function addCircle() {
    canvas1.add(new fabric.Circle({ radius: 30, fill: '#f55', top: 100, left: 100 }));
    canvas1.selectionColor = 'rgba(0,255,0,0.3)';
    canvas1.selectionBorderColor = 'red';
    canvas1.selectionLineWidth = 5;
}

function addRect() {
	var rect = new fabric.Rect({ width: 100, height: 50, fill: 'green' });
	canvas1.add(rect);
	rect.on('selected', function() {
	  console.log('selected a rectangle');
	}); 
}
	
function addSink() {
    canvas1.add(new fabric.Circle({ radius: 10, fill: '#f55', left: x-500, top: y, id: 'sink_' + sink_No })); 
    sink_No++;
}

function addTable() {
	canvas1.add(new fabric.Circle({ radius: 10, fill: '#000', left:x-500, top: y, id: 'table_' + table_No }));
	table_No++;
}

function showImageTools (val) {
    if (!$('#imageDialog').length) {
    	$('body').append("<div id='imageDialog' style='position: absolute; top: y; left: x'><h1></h1></div>");
    	$('h1').append(val);
    }
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
    	/* if(options.target.radius == 10 && options.target.fill == "#f55"){
    		showImageTools ("Sink");
    	}
    	if(options.target.radius == 10 && options.target.fill == "#000"){
    		showImageTools ("Dining Table");
    	} */
    	
    	showImageTools (options.target.id);
    }  
});

canvas1.on('mouse:out', function(e) {
     $('#imageDialog').remove();
  });
  
canvas1.on('object:added', function(e) {
    if(e.target!= null) {
    	/* if(e.target.radius == 10 && e.target.fill == "#f55"){
    		console.log("Sink created");
    	}
    	if(e.target.radius == 10 && e.target.fill == "#000"){
    		console.log("Dining Table created");
    	} */
    	
    	console.log(e.target.id + " created");
    } 
 });
 
canvas1.on('object:removed', function(e) {
    if(e.target!= null) {
    	/* if(e.target.radius == 10 && e.target.fill == "#f55"){
    		console.log("Sink deleted");
    	}
    	if(e.target.radius == 10 && e.target.fill == "#000"){
    		console.log("Dining Table deleted");
    	} */
    	
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