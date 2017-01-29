<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Shapes</title>
<script src="js/fabric.js"></script>
<script src="js/jquery-3.1.1.min.js" type="text/javascript"></script>
<link rel = "stylesheet" type = "text/css" href = "css/style.css" />
</head>
<body>
<!-- <form action="PilotController" method="post"> -->

<table>
<tr>
<td><canvas id="canvas" width="500" height="500" style="border:1px solid #000000"></canvas>
Desired no of Blocks: <input type="text" id="arrayNumber" class="input-box" placeholder="Enter a number" />
<button onclick="reInit()" id="grid_btn">
Create Grid
</button>
</td>
<td><canvas id="canvas1" width="500" height="500" style="border:1px solid #000000"></canvas>
X: <input type="text" id="cursorx" class="input-box" placeholder="Click on canvas" />
Y: <input type="text" id="cursory" class="input-box" placeholder="Click on canvas" />
<select id="objectSelect">
  <option value="Sink" selected>Sink</option>
  <option value="Table">Table</option>
</select>
<button onClick="addObject()">Add</button>
<button onClick="deleteObject()">Delete</button>
</td>
<td>
<h1 id="messageDialog" style="margin-left:30%;margin-right:auto;display:block;margin-top:0%;margin-bottom:0%"></h1>
<h2 id="messageDialog1" style="margin-left:30%;margin-right:auto;display:block;margin-top:0%;margin-bottom:0%"></h2>
</td>
</tr>
</table>

<div style="width:100%;height:100%;position:absolute;vertical-align:middle;text-align:center;">
    <button type="submit" style="margin-left:30%;margin-right:auto;display:block;margin-top:2%;margin-bottom:0%"
    onClick="sychro()">Synchronize</button> 
</div>​

<script src="js/logic.js"></script>

<!-- </form> -->
</body>
</html>