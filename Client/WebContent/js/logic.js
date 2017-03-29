/**
 * 
 */

var Layout = new fabric.Canvas('canvas');
var Workspace = new fabric.Canvas('canvas1');
var object_counter;
var noOfBlocks;
var KitItemsCreated = [];
var KitItemsDeleted = [];
var KitItemsMoved = [];
var x = 510;
var y = 10;

window.onload = init;

function init() {
	object_counter = 0;
	KitItemsCreated.length = 0;
	KitItemsDeleted.length = 0;
	KitItemsMoved.length = 0;
	noOfBlocks = ($("#arrayNumber").val() === "") ? 5 : $("#arrayNumber").val();
	$.ajax({
		url : 'InitController',
		type : 'POST',
		dataType : 'json',
		data : {
			initCanvas : 1,
			blockArrayNo : noOfBlocks
		},
		success : function(data) {
			initVisualize(data);
		}
	});
}

function reInit() {
	init();
	Layout.clear();
	Workspace.clear();
	drawGrid();
}

function sychro() {
	if(KitItemsCreated.length <= 0 && KitItemsDeleted.length <= 0 && KitItemsMoved.length <= 0){
		$('#messageDialog').text("Nothing to propagate. Please make some changes that can be synchronised.");
	}
	else{
		$('#messageDialog').text("");
		propagateChanges();
	}
	
}

function propagateChanges(){
	$.ajax({
		url : 'InitController',
		type : 'POST',
		dataType : 'json',
		data : {
			loadChanges : 1,
			ItemsCreated : JSON.stringify(KitItemsCreated),
			ItemsDeleted : JSON.stringify(KitItemsDeleted),
			ItemsMoved : JSON.stringify(KitItemsMoved),
		},
		success : function(data) {
			changeVisualize(data)
		}
	});

	KitItemsCreated.length = 0;
	KitItemsDeleted.length = 0;
	KitItemsMoved.length = 0;
}

function initVisualize(uiModels) {

	Layout.setDimensions({
		width : uiModels.layout.width,
		height : uiModels.layout.height
	});
	Workspace.setDimensions({
		width : uiModels.workspace.width,
		height : uiModels.workspace.width
	});
	drawGrid();
	console.log("Visualization done after initialization");
}

function changeVisualize(uiModels) {

	//Visualize Kitchen
	Workspace.clear();
	if (uiModels!= null && uiModels.workspace.objects.length > 0) {
		 //create items 
//		for (var i = 0; i < uiModels.workspace.objects.length; i++) {
//			Workspace.add(new fabric.Circle({
//				radius : 10,
//				fill : '#f55',
//				left : uiModels.workspace.objects[i].posX,
//				top : uiModels.workspace.objects[i].posY,
//				subType: uiModels.workspace.objects[i].id.split('_')[0],
//				id : uiModels.workspace.objects[i].id
//			}));
//		}
		for (var i = 0; i < uiModels.workspace.objects.length; i++) {
			if(uiModels.workspace.objects[i].type == 'Sink'){
			    addSinkVisualize(uiModels, i);}
			else if(uiModels.workspace.objects[i].type == 'Window')
				addWindowVisualize(uiModels, i);
			else if((uiModels.workspace.objects[i].type == 'Door'))
				addDoorVisualize(uiModels, i)
			else {
				addTableVisualize(uiModels, i);}
		}
	}
	
	//Visualize Grid
	Layout.clear();
	drawGrid();

	if (uiModels!= null && uiModels.layout.groups.length > 0) {
		// fillColor into blocks for groups
		for (var i = 0; i < uiModels.layout.groups.length; i++) {
			for (var j = 0; j < uiModels.layout.groups[i].blocks.length; j++) {
				for (var k = 0; k < Layout.getObjects().length; k++) {
					if (Layout.getObjects()[k].get('id') === uiModels.layout.groups[i].blocks[j].id) {
						Layout.getObjects()[k].setFill(uiModels.layout.groups[i].fillColor);
						Layout.renderAll();
					}

				}
			}
		}
	}
	
	//Visualize Failed Deltas
	if (uiModels!= null && uiModels.failedDeltas!= null && (uiModels.failedDeltas.created.length > 0 || uiModels.failedDeltas.deleted.length > 0 || uiModels.failedDeltas.moved.length > 0) ) {
		var failedDeltaMsg = "Not Propagated changes are: ";
		if(uiModels.failedDeltas.created.length > 0){
			for(var i = 0; i < uiModels.failedDeltas.created.length; i++) {
				failedDeltaMsg = failedDeltaMsg + " Creation of " + uiModels.failedDeltas.created[i].id;
			}	
		}
		
		if(uiModels.failedDeltas.deleted.length > 0){
			for(var i = 0; i < uiModels.failedDeltas.deleted.length; i++) {
				failedDeltaMsg = failedDeltaMsg + " Deletion of " + uiModels.failedDeltas.deleted[i].id;
			}	
		}
		
		if(uiModels.failedDeltas.moved.length > 0){
			for(var i = 0; i < uiModels.failedDeltas.moved.length; i++) {
				failedDeltaMsg = failedDeltaMsg + " Movement of " + uiModels.failedDeltas.moved[i].id;
			}	
		}
		$('#messageDialog').text(failedDeltaMsg);
	}
	
	console.log("Visualization done after change propagation");

}

function addSink(objectType, object_counter){
	fabric.Image.fromURL('assets/sink.jpg', function(img) {
		var oImg = img.set({ left: x - 510, top: y - 10, subType: objectType, id: objectType + "_" + object_counter}).scale(0.1);
        Workspace.add(oImg);
        });
}

function addSinkVisualize(uiModels, val){
	fabric.Image.fromURL('assets/sink.jpg', function(img) {
		var oImg = img.set({ left: uiModels.workspace.objects[val].posX, top: uiModels.workspace.objects[val].posY, subType: uiModels.workspace.objects[val].id.split('_')[0], id: uiModels.workspace.objects[val].id}).scale(0.1);
        Workspace.add(oImg);
        });
}

function addTable(objectType, object_counter){
	fabric.Image.fromURL('assets/table.jpg', function(img) {
		var oImg = img.set({ left: x - 510, top: y - 10, subType: objectType, id: objectType + "_" + object_counter}).scale(0.1);
        Workspace.add(oImg);
        });
}

function addTableVisualize(uiModels, val){
	fabric.Image.fromURL('assets/table.jpg', function(img) {
		var oImg = img.set({ left: uiModels.workspace.objects[val].posX, top: uiModels.workspace.objects[val].posY, subType: uiModels.workspace.objects[val].id.split('_')[0], id: uiModels.workspace.objects[val].id}).scale(0.1);
        Workspace.add(oImg);
        });
}

function addWindow(objectType, object_counter){
	fabric.Image.fromURL('assets/window.png', function(img) {
		var oImg = img.set({ left: x - 510, top: y - 10, subType: objectType, id: objectType + "_" + object_counter}).scale(0.1);
        Workspace.add(oImg);
        });
}

function addWindowVisualize(uiModels, val){
	fabric.Image.fromURL('assets/window.png', function(img) {
		var oImg = img.set({ left: uiModels.workspace.objects[val].posX, top: uiModels.workspace.objects[val].posY, subType: uiModels.workspace.objects[val].id.split('_')[0], id: uiModels.workspace.objects[val].id}).scale(0.1);
        Workspace.add(oImg);
        });
}

function addDoor(objectType, object_counter){
	fabric.Image.fromURL('assets/door.png', function(img) {
		var oImg = img.set({ left: x - 510, top: y - 10, subType: objectType, id: objectType + "_" + object_counter}).scale(0.1);
        Workspace.add(oImg);
        });
}

function addDoorVisualize(uiModels, val){
	fabric.Image.fromURL('assets/door.png', function(img) {
		var oImg = img.set({ left: uiModels.workspace.objects[val].posX, top: uiModels.workspace.objects[val].posY, subType: uiModels.workspace.objects[val].id.split('_')[0], id: uiModels.workspace.objects[val].id}).scale(0.1);
        Workspace.add(oImg);
        });
}

function drawGrid() {

	var noOfBlocks = ($("#arrayNumber").val() === "") ? 5 : $("#arrayNumber")
			.val();
	var blockHeight = Layout.height / noOfBlocks;
	var blockWidth = Layout.width / noOfBlocks;
	for (var i = 0; i < noOfBlocks; i++) {
		for (var j = 0; j < noOfBlocks; j++) {
			var gOptions = {
				width : blockWidth,
				height : blockHeight,
				top : blockHeight * j,
				left : blockWidth * i,
				hasControls : false,
				stroke : '#000000',
				fill : 'transparent',
				lockMovementX : true,
				lockMovementY : true,
				borderColor : 'transparent',
			};
			var rOptions = {
				width : blockWidth,
				height : blockHeight,
				top : blockHeight * j,
				left : blockWidth * i,
				//rx: 10,
				//ry: 10,
				hasControls : false,
				stroke : '#000000',
				fill : 'transparent',
				lockMovementX : true,
				lockMovementY : true,
				borderColor : 'transparent',
				subType : 'block',
				id : 'block_' + i + '_' + j
			};
			//var c = new fabric.Rect(gOptions);
			var r = new fabric.Rect(rOptions);

			//canvas.add(c);
			Layout.add(r);
		}
	}
	//	$("#grid_btn").disabled = false;
	//	$("#arrayNumber").attr("disabled", "disabled");
}

function addObject() {
	var objectType = $("#objectSelect").val();
//	Workspace.add(new fabric.Circle({
//		radius : 10,
//		fill : '#f55',
//		left : x - 510,
//		top : y - 10,
//		subType: objectType,
//		id : objectType + "_" + object_counter
//	}));
	if(objectType == "Sink"){
	    addSink(objectType, object_counter);}
	else if(objectType == "Window")
		addWindow(objectType, object_counter);
	else if(objectType == "Door")
		addDoor(objectType, object_counter);
	else {
		addTable(objectType, object_counter);}
	
	KitItemsCreated.push({
		id : objectType + "_" + object_counter,
		type : objectType,
		posX : x - 510,
		posY : y - 10
	});
	object_counter++;
	
	console.log("created array length "+ KitItemsCreated.length );
	console.log("deleted array length "+ KitItemsDeleted.length);
	console.log("moved array length "+ KitItemsMoved.length);
}

function deleteObject() {
	
	handleDelete();
	Workspace.getActiveObject().remove();
	
	console.log("created array len "+ KitItemsCreated.length );
	console.log("deleted array len "+ KitItemsDeleted.length);
	console.log("moved array len "+ KitItemsMoved.length);
}

function handleDelete(){
	var itemCreated = false;
	var itemMoved = false;
	
	//Check the item in Created array
	if(KitItemsCreated.length > 0){
		for(var i = 0; i < KitItemsCreated.length; i++) {
		    if(KitItemsCreated[i].id == Workspace.getActiveObject().id) {
		    	KitItemsCreated.splice(i, 1);
		    	itemCreated = true;
		        break;
		    }
		}
	}
	
	//Check the item in Moved array
	if(KitItemsMoved.length > 0){
		for(var i = 0; i < KitItemsMoved.length; i++) {
		    if(KitItemsMoved[i].id == Workspace.getActiveObject().id) {
		    	KitItemsMoved.splice(i, 1);
		    	itemMoved = true;
		        break;
		    }
		}
	}
	
	if(!itemCreated && !itemMoved){
		KitItemsDeleted.push({
			id : Workspace.getActiveObject().id,
			type : Workspace.getActiveObject().subType
		});
	}
}

function handleMove(){
	var itemCreated = false;
	var itemMoved = false;
	
	//Check the item in Created array
	if(KitItemsCreated.length > 0){
		for(var i = 0; i < KitItemsCreated.length; i++) {
		    if(KitItemsCreated[i].id == Workspace.getActiveObject().id) {
		    	KitItemsCreated[i].posX = Math.ceil(Workspace.getActiveObject().left);
		    	KitItemsCreated[i].posY = Math.ceil(Workspace.getActiveObject().top);
		    	itemCreated = true;
		        break;
		    }
		}
	}
	
	//Check the item in Moved array
	if(KitItemsMoved.length > 0){
		for(var i = 0; i < KitItemsMoved.length; i++) {
		    if(KitItemsMoved[i].id == Workspace.getActiveObject().id) {
		    	KitItemsMoved[i].posX = Math.ceil(Workspace.getActiveObject().left);
		    	KitItemsMoved[i].posY = Math.ceil(Workspace.getActiveObject().top);
		    	itemMoved = true;
		        break;
		    }
		}
	}
	
	if(!itemCreated && !itemMoved){
		KitItemsMoved.push({
			id : Workspace.getActiveObject().id,
			type : Workspace.getActiveObject().subType,
			posX : Math.ceil(Workspace.getActiveObject().left),
			posY : Math.ceil(Workspace.getActiveObject().top)
		});
	}
}

function showInfo(val) {
	$('#messageDialog').text(val);
}

Layout.hoverCursor = 'pointer';
Workspace.hoverCursor = 'pointer';

Workspace.on('mouse:down', function(options) {
	$("#cursorx").val(options.e.clientX);
	$("#cursory").val(options.e.clientY);
	x = options.e.clientX;
	y = options.e.clientY;
});

Workspace.on('mouse:move', function(options) {
	var pt = {
		x : options.e.clientX,
		y : options.e.clientY
	};

	if (options.target != null) {
		showInfo(options.target.id);
	}
});

Workspace.on('mouse:out', function(e) {
	$('#messageDialog').text("");
});

Workspace.on('object:added', function(e) {
	if (e.target != null) {
		console.log(e.target.id + " created");
	}
});

Workspace.on('object:removed', function(e) {
	if (e.target != null) {
		console.log(e.target.id + " deleted");
	}
});

Workspace.on('object:modified', function(e) {
	handleMove();
	console.log(e.target);
	console.log(Workspace.getActiveObject());
	
	console.log("created len "+ KitItemsCreated.length );
	console.log("deleted len "+ KitItemsDeleted.length);
	console.log("moved len "+ KitItemsMoved.length);
	
});

Layout.on('mouse:down', function(e) {
	if (e.target.get('subType') == 'block') {

		console.log('block ' + e.target.id + ' was clicked');
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