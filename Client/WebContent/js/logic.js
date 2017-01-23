/**
 * 
 */

//var canvas = new fabric.Canvas('canvas');
//var canvas1 = new fabric.Canvas('canvas1');
var object_counter = 0;
var x = 512;
var y = 12;
var Layout = new fabric.Canvas('canvas');
var Workspace= new fabric.Canvas('canvas1');

window.onload = init;

function init(){
	$.ajax({
      url: 'InitController',
      type: 'GET',
      dataType: 'json',
      success: function(data){
      	initVisualize(data);
      }
       });
}

function initVisualize(uiModels){
	Layout.setDimensions({width:uiModels.layout.width, height:uiModels.layout.height});
  	Workspace.setDimensions({width:uiModels.workspace.width, height:uiModels.workspace.width});
  	
  	drawGrid(5);
}

function changeVisualize(uiModels){
	Layout.setDimensions({width:uiModels.layout.width, height:uiModels.layout.height});
  	Workspace.setDimensions({width:uiModels.workspace.width, height:uiModels.workspace.width});
}

function drawGrid(noofgrid){
	var noOfBlocks = noofgrid;
	//var noOfBlocks = $("#arrayNumber").val();
	var blockHeight = Layout.height/noOfBlocks;
	var blockWidth = Layout.width/noOfBlocks;
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
	        Layout.add(r);
	    }
	}
	$("#grid_btn").disabled = false;
	$("#arrayNumber").attr("disabled", "disabled");
}

function addObject() {
	var object= $("#objectSelect").val();
	Workspace.add(new fabric.Circle({ radius: 10, fill: '#f55', left:x-510, top:y-10, id: object+"_"+ object_counter }));
	object_counter++;
}

function showInfo(val) {
	$('#messageDialog').text(val);
}

function deleteObject() {
    Workspace.getActiveObject().remove();
}

function synchroTransform() {
	
	var jsonObj = {
			id: Workspace.getObjects()[0].get('id'),
		    posX:Workspace.getObjects()[0].get('left'),
		    posY:Workspace.getObjects()[0].get('top'),
		    fillColor: Workspace.getObjects()[0].get('fill')
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
            for(var i= 0; i< Layout.getObjects().length; i++){
            	if(Layout.getObjects()[i].get('id') === data.id){
            		Layout.getObjects()[i].setFill(data.fillColor);
            		Layout.renderAll();
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
            Workspace.add(new fabric.Circle({ radius: 10, fill: data[0].fillColor, left:data[0].posX, top:data[0].posY, id: data[0].id }));
        }
         });
}

Layout.hoverCursor = 'pointer';
Workspace.hoverCursor = 'pointer';

Workspace.on('mouse:down', function(options){
	$("#cursorx").val(options.e.clientX);
	$("#cursory").val(options.e.clientY);
	x = options.e.clientX;
	y = options.e.clientY;
	});
	
Workspace.on('mouse:move',function(options){
    var pt = { x: options.e.clientX, y: options.e.clientY };
    
    if(options.target!= null) {
    	showInfo(options.target.id);
    }  
});

Workspace.on('mouse:out', function(e) {
	$('#messageDialog').text("");
  });
  
Workspace.on('object:added', function(e) {
    if(e.target!= null) {
    	console.log(e.target.id + " created");
    } 
 });
 
Workspace.on('object:removed', function(e) {
    if(e.target!= null) {
    	console.log(e.target.id + " deleted");
    } 
 });
 
Workspace.on('object:moving', function(e) {
    console.log("object moved to Y: " + e.e.clientY);
 });

Layout.on('mouse:down', function (e) {
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
            Layout.renderAll();
        }
});

Workspace.renderAll();