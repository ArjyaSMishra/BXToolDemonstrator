/**
 * 
 */

var Layout = new fabric.Canvas('canvasLayout');
var Workspace = new fabric.Canvas('canvasWorkspace');
var object_counter;
var noOfBlocks;
var KitItemsCreated = [];
var KitItemsDeleted = [];
var KitItemsMoved = [];
var LayoutBlocksCreated = [];
var LayoutBlocksDeleted = [];
var previousClickedBlock = null;
var lastAssignedColor = null;
var x = 562;
var y = 28;
var scenarioLinks = $("a");
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
	previousClickedBlock = null;
	lastAssignedColor = null;
	$('#messageDialog').text("");
	$('#itemList').text("");
	scenarioLinks.removeClass("active");
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
	previousClickedBlock = null;
	lastAssignedColor = null;
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
		previousClickedBlock = null;
		lastAssignedColor = null;
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
			changeVisualize(data);
		}
	});

	KitItemsCreated.length = 0;
	KitItemsDeleted.length = 0;
	KitItemsMoved.length = 0;
	LayoutBlocksCreated.length = 0;
	LayoutBlocksDeleted.length = 0;
	previousClickedBlock = null;
	lastAssignedColor = null;
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
			else if(uiModels.workspace.objects[i].type == 'Table') {
				addTableVisualize(uiModels, i);}
			else {
				addFridgeVisualize(uiModels, i);}
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
				failedDeltaMsg = failedDeltaMsg + " Creation of " + uiModels.failedDeltas.created[i].type;
			}	
		}
		
		if(uiModels.failedDeltas.deleted.length > 0){
			for(var i = 0; i < uiModels.failedDeltas.deleted.length; i++) {
				failedDeltaMsg = failedDeltaMsg + " Deletion of " + uiModels.failedDeltas.deleted[i].type;
			}	
		}
		
		if(uiModels.failedDeltas.moved.length > 0){
			for(var i = 0; i < uiModels.failedDeltas.moved.length; i++) {
				failedDeltaMsg = failedDeltaMsg + " Movement of " + uiModels.failedDeltas.moved[i].type;
			}	
		}
		$('#messageDialog').text(failedDeltaMsg);
	}
	
	console.log("Visualization done after change propagation");

}

function addSink(objectType, object_counter){
	fabric.Image.fromURL('assets/sink.jpg', function(img) {
		var oImg = img.set({ left: x - 562, top: y - 28, subType: objectType, id: objectType + "_" + object_counter}).scale(0.1);
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
		var oImg = img.set({ left: x - 562, top: y - 28, subType: objectType, id: objectType + "_" + object_counter}).scale(0.1);
        Workspace.add(oImg);
        });
}

function addTableVisualize(uiModels, val){
	fabric.Image.fromURL('assets/table.jpg', function(img) {
		var oImg = img.set({ left: uiModels.workspace.objects[val].posX, top: uiModels.workspace.objects[val].posY, subType: uiModels.workspace.objects[val].type, id: uiModels.workspace.objects[val].id}).scale(0.1);
        Workspace.add(oImg);
        });
}

function addFridge(objectType, object_counter){
	fabric.Image.fromURL('assets/fridge.jpg', function(img) {
		var oImg = img.set({ left: x - 562, top: y - 28, subType: objectType, id: objectType + "_" + object_counter}).scale(0.1);
        Workspace.add(oImg);
        });
}

function addFridgeVisualize(uiModels, val){
	fabric.Image.fromURL('assets/fridge.jpg', function(img) {
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
	else if(objectType == "Table") {
		addTable(objectType, object_counter);}
	else {
		addFridge(objectType, object_counter);}
	
	KitItemsCreated.push({
		id : objectType + "_" + object_counter,
		type : objectType,
		posX : x - 562,
		posY : y - 28
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

function handleCreateGroup(e) {

	// check if block already exists
	for (var i = 0; i < LayoutBlocksCreated.length; i++) {
		if (LayoutBlocksCreated[i].xIndex == e.target.xPos && LayoutBlocksCreated[i].yIndex == e.target.yPos) {
			LayoutBlocksCreated.splice(i, 1);
			break;
		}
	}
	
    //add new entry
	LayoutBlocksCreated.push({
		// id : objectType + "_" + object_counter,
		xIndex : e.target.xPos,
		yIndex : e.target.yPos,
		fillColor : e.target.fill
	});
}

function showInfo(val) {
	$('#messageHover').text(val);
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
	$('#messageHover').text("");
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

Workspace.on('object:moving', function(e) {
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
	var noOfClick = 1;
	var newGeneratedColor = null;
	if (e.target.get('subType') == 'block') {
		var currentClickedBlock = e.target.id;
		var colorBeforeChange = e.target.fill;
		console.log('block ' + e.target.id + ' was clicked');
		
		if(previousClickedBlock != null && currentClickedBlock == previousClickedBlock )
			noOfClick = 2;
		
		if (noOfClick == 1){
			if(colorBeforeChange == 'transparent'){
				newGeneratedColor = lastAssignedColor != null ? lastAssignedColor : genColor();
				e.target.setFill(newGeneratedColor);
				addToCreateGroup(e);
			}
			else if (colorBeforeChange != 'transparent' && blockExistinCreateGroup(e)){
				e.target.setFill("transparent");
				removeFromCreateGroup(e);
			}
			else if (colorBeforeChange != 'transparent' && e.target.opacity < 1){
				removeGroupFromDeleteGroup(colorBeforeChange);
			}
			else if (colorBeforeChange != 'transparent' && !blockExistinCreateGroup(e)){
				addGroupToDeleteGroup(colorBeforeChange);
			}
		}
		else if (noOfClick == 2){
			if(colorBeforeChange == 'transparent'){
				newGeneratedColor =  genColor();
				e.target.setFill(newGeneratedColor);
		       handleCreateGroup(e);   
			}
			else if (colorBeforeChange != 'transparent' && blockExistinCreateGroup(e)){
				e.target.setFill("transparent");
				removeFromCreateGroup(e);
			}
			else if (colorBeforeChange != 'transparent' && e.target.opacity < 1){
				removeGroupFromDeleteGroup(colorBeforeChange);
			}
			else if (colorBeforeChange != 'transparent' && !blockExistinCreateGroup(e)) {
				addGroupToDeleteGroup(colorBeforeChange);
			}
			noOfClick = 1;
		}
			
		Layout.renderAll();
		
		previousClickedBlock = e.target.id;
		lastAssignedColor = newGeneratedColor;
		
		console.log("created len "+ KitItemsCreated.length );
		console.log("deleted len "+ KitItemsDeleted.length);
		console.log("moved len "+ KitItemsMoved.length);
		console.log("blocks created array length "+ LayoutBlocksCreated.length);
		console.log("blocks deleted array length "+ LayoutBlocksDeleted.length);
	}
});

function blockExistinCreateGroup(e){
	
	//check if block already exists
	for(var i = 0; i < LayoutBlocksCreated.length; i++) {
	    if(LayoutBlocksCreated[i].xIndex == e.target.xPos && LayoutBlocksCreated[i].yIndex == e.target.yPos) {
	    	return true;
	    }
	}
	return false;
}

function addToCreateGroup(e){
	
	// add block
	LayoutBlocksCreated.push({
		//id : objectType + "_" + object_counter,
		xIndex : e.target.xPos,
		yIndex : e.target.yPos,
		fillColor : e.target.fill
	});
}

function removeFromCreateGroup(e){
	
	//remove block
	if(LayoutBlocksCreated.length > 0){
		for(var i = 0; i < LayoutBlocksCreated.length; i++) {
		    if(LayoutBlocksCreated[i].xIndex == e.target.xPos && LayoutBlocksCreated[i].yIndex == e.target.yPos) {
		    	LayoutBlocksCreated.splice(i, 1);
		        break;
		    }
		}
	}
}

function genColor(){
	return '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
}

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

scenarioLinks.on("click",function(){
	scenarioLinks.removeClass("active");
  $(this).toggleClass("active");
});

function addGroupToDeleteGroup(colorBeforeChange){
	
	for(var i = 0; i < Layout._objects.length; i++) {
		if (Layout._objects[i].fill == colorBeforeChange){
			Layout._objects[i].set({
		        opacity: 0.5
		    });
			
			LayoutBlocksDeleted.push({
				//id : objectType + "_" + object_counter,
				xIndex : Layout._objects[i].xPos,
				yIndex : Layout._objects[i].yPos,
				fillColor : colorBeforeChange
			});	
		}
	}
}

function removeGroupFromDeleteGroup(colorBeforeChange){
	
	for(var i = 0; i < Layout._objects.length; i++) {
		if (Layout._objects[i].fill == colorBeforeChange){
			Layout._objects[i].set({
	        opacity: 1
	    });
			
			//remove block
			if(LayoutBlocksDeleted.length > 0){
				for(var j = 0; j < LayoutBlocksDeleted.length; j++) {
				    if(LayoutBlocksDeleted[j].xIndex == Layout._objects[i].xPos && LayoutBlocksDeleted[j].yIndex == Layout._objects[i].yPos) {
				    	LayoutBlocksDeleted.splice(j, 1);
				        break;
				    }
				}
			}	
		}
	}
}

Workspace.renderAll();