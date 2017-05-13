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
var GuiUserChoice = null;
var x = 584;
var y = 92;
var scenarioLinks = $("a");
$('[data-toggle="tooltip"]').tooltip({
    trigger : 'hover'
}) 
var scenario0= new Array("Info 1: 1 item in Kitchen = 1 group in Grid",
		"Info 2: 1 group in Grid = one or more same colored blocks",
		"Info 3: Sink can be created on the Water Outlet wall and signifies 2 horizontal same colored blocks",
		"Info 4: Fridge can be created on the Electrical fitting wall and signifies 2 vertical same colored blocks",
		"Info 5: Table can be created anywhere and signifies 2 horizontal/vertical same colored blocks",
		"Info 6: To start fresh, click on Start Fresh button",
		"Info 7: To increase the number of blocks in Grid, enter a number between 5 - 10 and click on Start Fresh button",
		"Kitchen - Add Item: Click anywhere on the canvas >> select the item to be added from dropdown >> click Add >> click Sync", 
		"Kitchen - Delete Item: Click on the item >> click Delete >> click Sync", 
		"Kitchen - Move Item: Click on the item >> drag to a new position >> click Sync",
		"Grid - Add Item: Click on any white block. You will get a new color. Now, same color can be applied on any other white block with a click. For a new color, click thrice on any white block.>> Same colored blocks signifies one group >> click Sync",
		"Grid - Delete Item: Click on one colored block and all the similar colored blocks will be blurred >> click Sync" );
var scenario1= new Array("Create 2 sink in Kitchen", "Sync", "Move one sink to a different location(l1)", "Delete the other sink", "Sync", "Compare groups for both sinks in Grid");
var scenario2= new Array("Fill 2 vertical blocks on northen wall with same color in Grid", "Sync", "UI will ask the user to choose bw the fitting rules","Enter the desired item number and press OK","Desired item will be created in Kitchen");
var scenario3= new Array("Create a fridge on northen wall in Kitchen", "Sync", "Delete the fridge", "Create another fridge at the same location in Kitchen", "Sync", "Color changes of the newly created item (creation and deletion of the same item doesn't preserve the same state)");
var scenario4= new Array("Create a fridge on the northen wall of the Kitchen", "Sync", "Fill a few different blocks with unique colors in Grid", "Sync", "Blocks will be preserved without transforming to any items also fridge will remain intact");
var scenario5= new Array("Create a sink and a fridge in Kitchen", "Sync", "Move the sink away fron the wall", "Sync", "Change will be discarded and old consistent state will be restored"); 

window.onload = init;

function init() {
	object_counter = 0;
	KitItemsCreated.length = 0;
	KitItemsDeleted.length = 0;
	KitItemsMoved.length = 0;
	LayoutBlocksCreated.length = 0;
	LayoutBlocksDeleted.length = 0;
	if (isNaN($("#arrayNumber").val()) || $("#arrayNumber").val() < 5 || $("#arrayNumber").val() > 10 ){
		$("#arrayNumber").val("");
	}
	noOfBlocks = ($("#arrayNumber").val() === "") ? 5 : $("#arrayNumber").val();
	previousClickedBlock = null;
	lastAssignedColor = null;
	GuiUserChoice = null;
	$('#messageDialog').text("");
	$('#divItemList').hide();
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

function drawBorder() {

	Workspace.add(new fabric.Rect({
		width : 5,
		height : 500,
		left : 0,
		top : 0,
		hasControls : false,
		stroke : '#000000',
		fill : 'blue',
		lockMovementX : true,
		lockMovementY : true,
		borderColor : 'transparent',
		subType : 'fitting'
	}));    

	Workspace.add(new fabric.Rect({
		width : 500,
		height : 5,
		left : 0,
		top : 0,
		hasControls : false,
		stroke : '#000000',
		fill : 'red',
		lockMovementX : true,
		lockMovementY : true,
		borderColor : 'transparent',
		subType : 'fitting'
	}));
}

function undo() {
	KitItemsCreated.length = 0;
	KitItemsDeleted.length = 0;
	KitItemsMoved.length = 0;
	LayoutBlocksCreated.length = 0;
	LayoutBlocksDeleted.length = 0;
	previousClickedBlock = null;
	lastAssignedColor = null;
	GuiUserChoice = null;
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
		GuiUserChoice = null;
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
			BlocksDeleted: JSON.stringify(LayoutBlocksDeleted)
		},
		success : function(data) {
			if(data.userChoices.length > 0){
				userChoiceVisualize(data);
			}
			else{
				changeVisualize(data);
			}
			
		}
	});

	KitItemsCreated.length = 0;
	KitItemsDeleted.length = 0;
	KitItemsMoved.length = 0;
	LayoutBlocksCreated.length = 0;
	LayoutBlocksDeleted.length = 0;
	previousClickedBlock = null;
	lastAssignedColor = null;
	GuiUserChoice = null;
}

function propagateUserChoices(){
	$.ajax({
		url : 'InitController',
		type : 'POST',
		dataType : 'json',
		data : {
			userChoice : 1,
			UserChoice : JSON.stringify(GuiUserChoice),
		},
		success : function(data) {
			if(data.userChoices.length > 0){
				userChoiceVisualize(data);
			}
			else{
				changeVisualize(data);
			}
		}
	});
	
	GuiUserChoice = null;
}

function userChoiceVisualize(uiModels) {
	var options = "";
	var selection = 0;
	for (var i = 0; i < uiModels.userChoices.length; i++) {
		if(i < uiModels.userChoices.length - 1)
		options = options + " " + i + " to " + uiModels.userChoices[i] + ", or";
		else 
			options = options + " " + i + " to " + uiModels.userChoices[i] + ".";
	}
	selection = prompt("Please enter" + options);
	
	if(selection === null || selection > (uiModels.userChoices.length - 1) || isNaN(selection) || selection === "")
		GuiUserChoice = uiModels.userChoices[0];
	else
	    GuiUserChoice = uiModels.userChoices[selection];
	
	propagateUserChoices();
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
	drawBorder();
	console.log("Visualization done after initialization");
}

function changeVisualize(uiModels) {

	//Visualize Kitchen
	Workspace.clear();
	drawBorder();
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
	if (uiModels!= null && uiModels.failedDeltas!= null && (uiModels.failedDeltas.created.length > 0 
			|| uiModels.failedDeltas.deleted.length > 0 
			|| uiModels.failedDeltas.moved.length > 0
			|| uiModels.failedDeltas.groupCreated.length > 0
			|| uiModels.failedDeltas.groupDeleted.length > 0) ) {
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
		
		if(uiModels.failedDeltas.groupCreated.length > 0){
			for(var i = 0; i < uiModels.failedDeltas.groupCreated.length; i++) {
				failedDeltaMsg = failedDeltaMsg + " Creation of Group";
			}	
		}
		
		if(uiModels.failedDeltas.groupDeleted.length > 0){
			for(var i = 0; i < uiModels.failedDeltas.groupDeleted.length; i++) {
				failedDeltaMsg = failedDeltaMsg + " Deletion of Group";
			}	
		}
		$('#messageDialog').text(failedDeltaMsg);
	}
	
	console.log("Visualization done after change propagation");

}

function addSink(objectType, object_counter){
	fabric.Image.fromURL('assets/sink.jpg', function(img) {
		var oImg = img.set({ left: x - 584, top: y - 92, subType: objectType, id: objectType + "_" + object_counter}).scale(0.1);
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
		var oImg = img.set({ left: x - 584, top: y - 92, subType: objectType, id: objectType + "_" + object_counter}).scale(0.15);
        Workspace.add(oImg);
        });
}

function addTableVisualize(uiModels, val){
	fabric.Image.fromURL('assets/table.jpg', function(img) {
		var oImg = img.set({ left: uiModels.workspace.objects[val].posX, top: uiModels.workspace.objects[val].posY, subType: uiModels.workspace.objects[val].type, id: uiModels.workspace.objects[val].id}).scale(0.15);
        Workspace.add(oImg);
        });
}

function addFridge(objectType, object_counter){
	fabric.Image.fromURL('assets/fridge.jpg', function(img) {
		var oImg = img.set({ left: x - 584, top: y - 92, subType: objectType, id: objectType + "_" + object_counter}).scale(0.1);
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
		posX : x - 584,
		posY : y - 92
	});
	object_counter++;
}

function deleteObject() {
	if(Workspace.getActiveObject() == null)
		$('#messageDialog').text("Nothing to delete. Please select an item to delete.");
	else{
		handleDelete();
		Workspace.getActiveObject().remove();
	}
	
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
		if (options.target.get('subType') == 'fitting' && options.target.get('fill') == 'blue') {
			showInfo('western wall with water outlet');
		}
		else if (options.target.get('subType') == 'fitting' && options.target.get('fill') == 'red') {
			showInfo('northern wall with electrical outlet');
		}
		else
		showInfo(options.target.subType);
	}
});

Workspace.on('mouse:out', function(e) {
	$('#messageHover').text("");
});

Workspace.on('object:added', function(e) {
	if (e.target != null) {
		console.log(e.target.subType + " created");
	}
});

Workspace.on('object:removed', function(e) {
	if (e.target != null) {
		console.log(e.target.subType + " deleted");
	}
});

Workspace.on('object:moving', function(e) {
	handleMove();
	
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

function loadScenario(header, scenario){
	var scenarioElement;
	$('#divItemList').show();
	$('#itemHeader').text("");
	$('#itemList').text("");
	$('#itemHeader').append(header);
    for (i = 0; i < scenario.length; i++ ) {
        // Create the <LI> element
    	scenarioElement = document.createElement("LI");
        // Add the array values between the <LI> tags
    	scenarioElement.innerHTML = scenario[i];
        // Append the <LI> to the bottom of the <UL> element
        $('#itemList').append(scenarioElement);
    }
}

function clearInstruction(){
	$('#divItemList').hide();
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