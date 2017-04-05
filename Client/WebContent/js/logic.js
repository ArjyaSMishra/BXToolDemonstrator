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
var LayoutBlocksCreated = [];
var LayoutBlocksDeleted = [];
var x = 562;
var y = 10;
var scenario1= new Array("do 1", "do 2");
var scenario2= new Array("do 3", "do 4");


window.onload = init;

function init() {
	object_counter = 0;
	KitItemsCreated.length = 0;
	KitItemsDeleted.length = 0;
	KitItemsMoved.length = 0;
	LayoutBlocksCreated.length = 0;
	LayoutBlocksDeleted.length = 0;
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

function undo() {
	KitItemsCreated.length = 0;
	KitItemsDeleted.length = 0;
	KitItemsMoved.length = 0;
	LayoutBlocksCreated.length = 0;
	LayoutBlocksDeleted.length = 0;
	propagateChanges();
	$('#messageDialog').text("Changes undone.");
}

function sychro() {
	if((KitItemsCreated.length > 0 || KitItemsDeleted.length > 0 || KitItemsMoved.length > 0) && (LayoutBlocksCreated.length > 0 || LayoutBlocksDeleted.length > 0)){
		KitItemsCreated.length = 0;
		KitItemsDeleted.length = 0;
		KitItemsMoved.length = 0;
		LayoutBlocksCreated.length = 0;
		LayoutBlocksDeleted.length = 0;
		propagateChanges();
		$('#messageDialog').text("You cannot make changes on both side.");
		
	}
	else if(KitItemsCreated.length <= 0 && KitItemsDeleted.length <= 0 && KitItemsMoved.length <= 0 && LayoutBlocksCreated.length <= 0 && LayoutBlocksDeleted.length <= 0 ){
		$('#messageDialog').text("Nothing to propagate. Please Make some changes for the synchronization to happen.");
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
			BlocksCreated: JSON.stringify(LayoutBlocksCreated),
			BlocksDeleted: JSON.stringify(LayoutBlocksDeleted),
		},
		success : function(data) {
			changeVisualize(data)
		}
	});

	KitItemsCreated.length = 0;
	KitItemsDeleted.length = 0;
	KitItemsMoved.length = 0;
	LayoutBlocksCreated.length = 0;
	LayoutBlocksDeleted.length = 0;
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
		for (var i = 0; i < uiModels.workspace.objects.length; i++) {
			if(uiModels.workspace.objects[i].type == 'Sink'){
			    addSinkVisualize(uiModels, i);}
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
		var oImg = img.set({ left: x - 562, top: y - 10, subType: objectType, id: objectType + "_" + object_counter}).scale(0.1);
        Workspace.add(oImg);
        });
}

function addSinkVisualize(uiModels, val){
	fabric.Image.fromURL('assets/sink.jpg', function(img) {
		var oImg = img.set({ left: uiModels.workspace.objects[val].posX, top: uiModels.workspace.objects[val].posY, subType: uiModels.workspace.objects[val].type, id: uiModels.workspace.objects[val].id}).scale(0.1);
        Workspace.add(oImg);
        });
}

function addTable(objectType, object_counter){
	fabric.Image.fromURL('assets/table.jpg', function(img) {
		var oImg = img.set({ left: x - 562, top: y - 10, subType: objectType, id: objectType + "_" + object_counter}).scale(0.1);
        Workspace.add(oImg);
        });
}

function addTableVisualize(uiModels, val){
	fabric.Image.fromURL('assets/table.jpg', function(img) {
		var oImg = img.set({ left: uiModels.workspace.objects[val].posX, top: uiModels.workspace.objects[val].posY, subType: uiModels.workspace.objects[val].type, id: uiModels.workspace.objects[val].id}).scale(0.1);
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
				xPos: i,
				yPos: j,
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

	if(objectType == "Sink"){
	    addSink(objectType, object_counter);}
	else {
		addTable(objectType, object_counter);}
	
	KitItemsCreated.push({
		id : objectType + "_" + object_counter,
		type : objectType,
		posX : x - 562,
		posY : y - 10
	});
	object_counter++;
	
	console.log("created array length "+ KitItemsCreated.length );
	console.log("deleted array length "+ KitItemsDeleted.length);
	console.log("moved array length "+ KitItemsMoved.length);
	console.log("blocks created array length "+ LayoutBlocksCreated.length);
	console.log("blocks deleted array length "+ LayoutBlocksDeleted.length);
}

function deleteObject() {
	
	handleDelete();
	Workspace.getActiveObject().remove();
	
	console.log("created array len "+ KitItemsCreated.length );
	console.log("deleted array len "+ KitItemsDeleted.length);
	console.log("moved array len "+ KitItemsMoved.length);
	console.log("blocks created array length "+ LayoutBlocksCreated.length);
	console.log("blocks deleted array length "+ LayoutBlocksDeleted.length);
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

function handleCreateGroup(e, currentColor){
	var blockExist = false;
	
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
	
	//check if block already exists
	for(var i = 0; i < LayoutBlocksCreated.length; i++) {
	    if(LayoutBlocksCreated[i].xIndex == e.target.xPos && LayoutBlocksCreated[i].yIndex == e.target.yPos) {
	    	blockExist = true;
	        break;
	    }
	}
	
	if(!blockExist){
		LayoutBlocksCreated.push({
			//id : objectType + "_" + object_counter,
			xIndex : e.target.xPos,
			yIndex : e.target.yPos,
			fillColor : e.target.fill
		});
	}
}

function handleDeleteGroup(e, currentColor){
	var blockExist = false;
	
	//check if block already exists
	for(var i = 0; i < LayoutBlocksDeleted.length; i++) {
	    if(LayoutBlocksDeleted[i].xIndex == e.target.xPos && LayoutBlocksDeleted[i].yIndex == e.target.yPos) {
	    	blockExist = true;
	        break;
	    }
	}
	
	if(!blockExist){
		e.target.set({
	        opacity: 0.9
	    });
		LayoutBlocksDeleted.push({
			//id : objectType + "_" + object_counter,
			xIndex : e.target.xPos,
			yIndex : e.target.yPos,
			fillColor : currentColor
		});
	}
}

function showInfo(val) {
	$('#messageDialog').text(val);
}

Layout.hoverCursor = 'pointer';
Workspace.hoverCursor = 'pointer';

Workspace.on('mouse:down', function(options) {
//	$("#cursorx").val(options.e.clientX);
//	$("#cursory").val(options.e.clientY);
	x = options.e.clientX;
	y = options.e.clientY;
});

Workspace.on('mouse:move', function(options) {
	var pt = {
		x : options.e.clientX,
		y : options.e.clientY
	};

	if (options.target != null) {
		showInfo(options.target.subType);
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
	console.log("blocks created array length "+ LayoutBlocksCreated.length);
	console.log("blocks deleted array length "+ LayoutBlocksDeleted.length);
	
});

Layout.on('mouse:down', function(e) {
	console.log('current color: ' + e.target.fill );
	var currentColor = e.target.fill;
	if (e.target.get('subType') == 'block') {

		console.log('block ' + e.target.id + ' was clicked');
		//var currentColor = e.target.fill;

		//e.target.setFill("#cc0000");
//		switch (currentColor) {
//		case 'transparent':
//			e.target.setFill("#000");
//			break;
//		case '#000':
//			e.target.setFill("#cc0000");
//			break;
//		case '#cc0000':
//			e.target.setFill("#ffff00");
//			break;
//		case '#ffff00':
//			e.target.setFill("#008000");
//			break;
//		case '#008000':
//			e.target.setFill("transparent");
//			break;
//		}
		
		if(currentColor == 'transparent') {
			handleCreateGroup(e, currentColor);
		}
		else {
			handleDeleteGroup(e, currentColor);
		}
			
		Layout.renderAll();
		
		console.log("created len "+ KitItemsCreated.length );
		console.log("deleted len "+ KitItemsDeleted.length);
		console.log("moved len "+ KitItemsMoved.length);
		console.log("blocks created array length "+ LayoutBlocksCreated.length);
		console.log("blocks deleted array length "+ LayoutBlocksDeleted.length);
	}
});

function loadScenario(scenario){
	var scenarioElement;
	$('#itemList').text("");
    for (i = 0; i < scenario.length; i++ ) {
        // Create the <LI> element
    	scenarioElement = document.createElement("LI");
        // Add the array values between the <LI> tags
    	scenarioElement.innerHTML = scenario[i];
        // Append the <LI> to the bottom of the <UL> element
        $('#itemList').append(scenarioElement);
    }
}

Workspace.renderAll();