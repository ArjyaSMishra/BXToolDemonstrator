/**
 * 
 */

var Layout = new fabric.Canvas('canvas');
var Workspace = new fabric.Canvas('canvas1');
var object_counter;
var noOfBlocks;
var KitItemsCreated = [];
var KitItemsDeleted = [];
var x = 512;
var y = 12;

window.onload = init;

function init() {
	object_counter = 0;
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
			console.log(data);
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
	$.ajax({
		url : 'InitController',
		type : 'POST',
		dataType : 'json',
		data : {
			loadChanges : 1,
			ItemsCreated : JSON.stringify(KitItemsCreated),
			ItemsDeleted : JSON.stringify(KitItemsDeleted)
		},
		success : function(data) {
			console.log(data);
			changeVisualize(data)
		}
	});

	KitItemsCreated.length = 0;
	KitItemsDeleted.length = 0;
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
}

function changeVisualize(uiModels) {

	Layout.clear();
	drawGrid();

	console.log("Layout noofblocks: "+Layout.getObjects().length);
	for (var i = 0; i < uiModels.layout.groups.length; i++) {
		for (var j = 0; j < uiModels.layout.groups[i].blocks.length; j++) {
			for (var k = 0; k < Layout.getObjects().length; k++) {
				if (Layout.getObjects()[k].get('id') === uiModels.layout.groups[i].blocks[j].id) {
					Layout.getObjects()[k].setFill('#ffff00');
					Layout.renderAll();
				}

			}
		}
	}

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
				subType : 'button',
				id : 'button_' + i + '_' + j
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
	Workspace.add(new fabric.Circle({
		radius : 10,
		fill : '#f55',
		left : x - 510,
		top : y - 10,
		id : objectType + "_" + object_counter
	}));
	KitItemsCreated.push({
		id : objectType + "_" + object_counter,
		type : objectType,
		posX : x - 510,
		posY : y - 10
	});
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
		id : Workspace.getObjects()[0].get('id'),
		posX : Workspace.getObjects()[0].get('left'),
		posY : Workspace.getObjects()[0].get('top'),
		fillColor : Workspace.getObjects()[0].get('fill')
	}

	$.ajax({
		url : 'PilotController',
		type : 'POST',
		dataType : 'json',
		data : {
			loadProds : 1,
			jsonData : JSON.stringify(jsonObj)
		},
		success : function(data) {
			for (var i = 0; i < Layout.getObjects().length; i++) {
				if (Layout.getObjects()[i].get('id') === data.id) {
					Layout.getObjects()[i].setFill(data.fillColor);
					Layout.renderAll();
				}

			}
		}
	});
	//console.log(JSON.stringify(canvas));
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
		KitItemsDeleted.push({
			id : e.target.id
		});
	}
});

Workspace.on('object:moving', function(e) {
	console.log("object moved to Y: " + e.e.clientY);
});

Layout.on('mouse:down', function(e) {
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