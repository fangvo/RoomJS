var gridLen = 10;
var conerRadius = 4;
var conerRadiusInv = 12;
var midRadius = 2;
var midRadiusInv = 10;
var debug = false;
var canvas = document.getElementById('canvas'), ctx = canvas.getContext("2d");
var canvasjq = document.getElementById('canvasjq'), ctxjq = canvasjq.getContext("2d"), canvasOffset = $('#canvas').offset();
var drag = null, notFinished = true, points = new Array(), midPoints, pointsDC, tableArray, diaganalsArray, lArray, relArray, triangle, triangleDC;
// canvas.onclick = onClick;
var cw = window.innerWidth - 10, ch = window.innerHeight - 111;
var cwjq = window.innerWidth - 10, chjq = window.innerHeight - 111;

function redrawScene() {
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, canvas.width - 10, canvas.height - 111);
	ctxjq.fillStyle = "white";
	ctxjq.fillRect(0, 0, canvas.width - 10, canvas.height - 111);
}

window.onload = function () {
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext("2d");
	canvas.width = window.innerWidth - 10;
	canvas.height = window.innerHeight - 111;
	canvasjq.width = window.innerWidth - 10;
	canvasjq.height = window.innerHeight - 111;
	// redrawScene();
	drawGrid();
}

function drawGrid() {
	var path = new Path2D();
	for (var i = gridLen; i < cw; i += gridLen) {
		path.moveTo(i, 0);
		path.lineTo(i, ch);
	}
	for (var j = gridLen; j < ch; j += gridLen) {
		path.moveTo(0, j);
		path.lineTo(cw, j);
	}
	path.closePath();
	ctx.strokeStyle = "rgba(220,220,220,0.7)";
	ctx.stroke(path);
}
function jsPoint(x, y) {
	this.x = 0;
	this.y = 0;
	if (arguments.length == 2) {
		this.x = x;
		this.y = y;
	}
}
function MousePos(event) {
	event = (event ? event : window.event);
	return {
		x : event.pageX - canvas.offsetLeft,
		y : event.pageY - canvas.offsetTop
	}
}
// function onClick(e) {
	// e = MousePos(e),
	// x = Math.round(e.x / gridLen) * gridLen,
	// y = Math.round(e.y / gridLen) * gridLen,
	// cp = new jsPoint(x, y);
	// if (drag != undefined) {
		// if (inCircleCheck(points, conerRadius, e)) {
			// points.splice(drag, 1);
			// SortAndDraw();
			// drag = null;
			// return;
		// }
		// points[drag].xy.x = x;
		// points[drag].xy.y = y;
		// SortAndDraw();
		// drag = null;
		// return;
	// }
	// if (notFinished) {
		// if (points.length > 2 && points[0].xy.x == cp.x && points[0].xy.y == cp.y) {
			// notFinished = false;
			// SortAndDraw();
			// addTable();
			// return;
		// }
		// for (var i = 0; i < points.length; i++) {
			// if (points[i].xy.x == cp.x && points[i].xy.y == cp.y) {
				// return;
			// }
		// }
		// points.push({
			// colour : "red",
			// xy : cp
		// });
		// var path = new Path2D();
		// if (points.length == 1) {
			// ctx.fillStyle = 'rgb(215, 44, 44)';
			// path.arc(cp.x, cp.y, 3, 0, Math.PI * 2, true);
			// ctx.fill(path);
			// return;
		// }
		// ctx.fillStyle = 'rgb(0, 0, 0)';
		// path.arc(cp.x, cp.y, 2, 0, Math.PI * 2, true);
		// ctx.fill(path);
		// if (points.length == 1) {}

	// } else {
		// drag = inCircleCheck(points, conerRadiusInv, e);
		// if (drag) {
			// return;
		// }
		// mid = inCircleCheck(midPoints, midRadiusInv, e)
			// if (mid != undefined) {
				// points.splice(mid + 1, 0, {
					// colour : "red",
					// xy : midPoints[mid].xy
				// });
				// SortAndDraw();
				// return;
			// }
	// }
// }

var offsetX = canvasOffset.left;
var offsetY = canvasOffset.top;
var storedLines = [];
var startX = 0;
var startY = 0;
var isDown;
var rare = 0;
var nap;

// var first = 1;
ctxjq.strokeStyle = "blue";
ctxjq.lineWidth = 3;
$("#canvasjq").mousedown(function (e) {
	handleMouseDown(e);
});
$("#canvasjq").mousemove(function (e) {
	// if (notFinished) {return;}
	handleMouseMove(e);
});
$("#canvasjq").mouseup(function (e) {
	// if (notFinished) {return;}
	handleMouseUp(e);
});
$("#clear").click(function () {
	if (notFinished) {
		return;
	}
	storedLines.length = 0;
	redrawStoredLines();
});

function handleMouseDown(e) {}

function handleMouseMove(e) {
	// e.preventDefault();
	//e.stopPropagation();

	if (!isDown) {
		return;
	}

	if (drag != undefined) {
		
		ctxjq.clearRect(0, 0, canvasjq.width, canvasjq.height);
		
		p = MousePos(e);
		
		ctxjq.beginPath();
		ctxjq.moveTo(points[nap.p].xy.x, points[nap.p].xy.y);
		ctxjq.lineTo(p.x, p.y);
		ctxjq.lineTo(points[nap.n].xy.x, points[nap.n].xy.y);
		ctxjq.stroke();
		
	}

	if (notFinished) {
		redrawStoredLines();

		var mouseX = parseInt(e.clientX - offsetX);
		var mouseY = parseInt(e.clientY - offsetY);

		// draw the current line
		ctxjq.beginPath();
		ctxjq.moveTo(startX, startY);
		ctxjq.lineTo(mouseX, mouseY);
		ctxjq.stroke();
	}

}

function handleMouseUp(e) {

	e = MousePos(e),
	x = Math.round(e.x / gridLen) * gridLen,
	y = Math.round(e.y / gridLen) * gridLen,
	cp = new jsPoint(x, y);

	if (drag != undefined) {
		if (inCircleCheck(points, conerRadius, e)) {
			points.splice(drag, 1);
			SortAndDraw();
			drag = null;
			return;
		}
		points[drag].xy.x = x;
		points[drag].xy.y = y;
		SortAndDraw();
		drag = null;
		isDown = false;
		ctxjq.clearRect(0, 0, canvasjq.width, canvasjq.height);
		return;
	}

	if (notFinished) {
		if (points.length > 2 && points[0].xy.x == cp.x && points[0].xy.y == cp.y) {
			notFinished = false;
			isDown = false;
			rare = 0;
			ctxjq.clearRect(0, 0, canvasjq.width, canvasjq.height);
			storedLines.length = 0;
			SortAndDraw();
			addTable();
			return;
		}
		for (var i = 0; i < points.length; i++) {
			if (points[i].xy.x == cp.x && points[i].xy.y == cp.y) {
				return;
			}
		}
		points.push({
			colour : "red",
			xy : cp
		});
		var path = new Path2D();
		if (points.length == 1) {
			ctx.fillStyle = 'rgb(215, 44, 44)';
			path.arc(cp.x, cp.y, 3, 0, Math.PI * 2, true);
			ctx.fill(path);
			// return;
		} else {
			ctx.fillStyle = 'rgb(0, 0, 0)';
			path.arc(cp.x, cp.y, 2, 0, Math.PI * 2, true);
			ctx.fill(path);
		}

	} else {
		drag = inCircleCheck(points, conerRadiusInv, e);
		if (drag != undefined) {
			nap = getNAP(drag);
			isDown = true;
			return;
		}
		mid = inCircleCheck(midPoints, midRadiusInv, e)
			if (mid != undefined) {
				points.splice(mid + 1, 0, {
					colour : "red",
					xy : midPoints[mid].xy
				});
				SortAndDraw();
				return;
			}
	}

	if (rare == 1) {
		// e.preventDefault();
		//e.stopPropagation();

		//isDown = false;

		var mouseX = cp.x,
		mouseY = cp.y;

		storedLines.push({
			x1 : startX,
			y1 : startY,
			x2 : mouseX,
			y2 : mouseY
		});

		redrawStoredLines();
		startX = mouseX;
		startY = mouseY;
		// rare = 0;
	}

	if (rare == 0 && notFinished) {
		//e.preventDefault();
		//e.stopPropagation();
		var mouseX = cp.x;
		var mouseY = cp.y;

		isDown = true;
		startX = mouseX;
		startY = mouseY;
		rare = 1;
	}
}

function getNAP(n) {
	if (n == points.length - 1) {
		return {
			p : n - 1,
			n : 0
		}
	} else
		if (n == 0) {
			return {
				p : points.length - 1,
				n : n + 1
			}
		} else {
			return {
				p : n - 1,
				n : n + 1
			}
		}
}

function redrawStoredLines() {

	ctxjq.clearRect(0, 0, canvasjq.width, canvasjq.height);

	if (storedLines.length == 0) {
		return;
	}

	// redraw each stored line
	if (notFinished) {
		for (var i = 0; i < storedLines.length; i++) {
			ctxjq.beginPath();
			ctxjq.moveTo(storedLines[i].x1, storedLines[i].y1);
			ctxjq.lineTo(storedLines[i].x2, storedLines[i].y2);
			ctxjq.stroke();
		}
	} else {
		for (var i = 0; i < storedLines.length; i++) {
			ctxjq.beginPath();
			ctxjq.moveTo(storedLines[i].x1, storedLines[i].y1);
			ctxjq.lineTo(storedLines[i].x2, storedLines[i].y2);
			ctxjq.stroke();

		}
	}
}

function SortAndDraw() {
	points = clockwiseNameSort(points);
	Draw();
}
function clockwiseNameSort(pa) {
	p_id = 0;
	for (var i = 1; i < pa.length; i++) {
		if (pa[i].xy.x + pa[i].xy.y < pa[p_id].xy.x + pa[p_id].xy.y) {
			p_id = i;
		}
	}
	pa[p_id].name = "A";
	nameId = 2;
	var p1,
	p2;
	if (p_id + 1 < pa.length) {
		p1 = p_id + 1
	} else {
		p1 = 0
	}
	if (p_id - 1 >= 0) {
		p2 = p_id - 1
	} else {
		p2 = pa.length - 1
	}
	var order = 1;
	dx1 = pa[p_id].xy.x - pa[p1].xy.x;
	dx2 = pa[p2].xy.x - pa[p_id].xy.x;
	dy1 = pa[p_id].xy.y - pa[p1].xy.y;
	dy2 = pa[p2].xy.y - pa[p_id].xy.y;
	r = dx1 * dy2 - dx2 * dy1;
	if (r > 0) {
		order = -1;
	} else {
		order = 1;
	}
	curid = p_id + (1 * order);
	if (order == 1) {
		if (curid == pa.length) {
			curid = 0;
		}
	} else {
		if (curid == -1) {
			curid = pa.length - 1;
		}
	}
	sa = new Array();
	sa.push(pa[p_id]);
	while (curid != p_id) {
		pa[curid].name = getName(nameId);
		sa.push(pa[curid]);
		nameId++;
		curid += 1 * order;
		if (order == 1) {
			if (curid == pa.length) {
				curid = 0;
			}
		} else {
			if (curid == -1) {
				curid = pa.length - 1;
			}
		}
	}
	sa[sa.length - 1].name = "Z100";
	return sa;
}
function inCircleCheck(pa, radius, click_p) {
	for (k = 0; k < pa.length; k++) {
		dx = pa[k].xy.x - click_p.x;
		dy = pa[k].xy.y - click_p.y;
		if ((dx * dx) + (dy * dy) < radius * radius) {
			return k;
		}
	}
	return null;
}
function Draw(nclear, color) {

	if (!nclear) {
		clearCanvas();
	}
	var lineColor;
	if (!color) {
		lineColor = 'rgb(201, 44, 44)'
	} else {
		lineColor = color
	}
	midPoints = new Array();
	drawArray = getLineArray();
	var lPath = new Path2D();
	var conerDots = new Path2D();
	var midDots = new Path2D();
	for (var i = 0; i < drawArray.length; i++) {
		conerDots.moveTo(drawArray[i].Points.Start.x, drawArray[i].Points.Start.y);
		conerDots.arc(drawArray[i].Points.Start.x, drawArray[i].Points.Start.y, conerRadius, 0, Math.PI * 2, true);
		lPath.moveTo(drawArray[i].Points.Start.x, drawArray[i].Points.Start.y);
		lPath.lineTo(drawArray[i].Points.End.x, drawArray[i].Points.End.y)
		tp = {
			xy : new jsPoint((drawArray[i].Points.Start.x + drawArray[i].Points.End.x) / 2, (drawArray[i].Points.Start.y + drawArray[i].Points.End.y) / 2)
		}
		midDots.moveTo(tp.xy.x, tp.xy.y);
		midDots.arc(tp.xy.x, tp.xy.y, midRadius, 0, Math.PI * 2, true);
		midPoints.push(tp);
	}
	ctx.strokeStyle = lineColor;
	lPath.closePath();
	ctx.stroke(lPath);
	ctx.fillStyle = 'rgb(215, 44, 44)';
	ctx.fill(conerDots);
	ctx.fillStyle = 'rgb(43, 44, 201)';
	ctx.fill(midDots);

	drawText();
}
function drawDia(color, clear) {

	if (notFinished) {
		alert("Завершите фигуру. (щелчок по первой 'Большая красная' точке фигуры) ");
		return;
	}

	if (!clear) {
		clearCanvas();
	}
	// var myCB = document.getElementById('myCB')
	// if (myCB.checked){
	// drawGrid();
	// }


	var lPath = new Path2D();
	for (var i = 0; i < diaganalsArray.length; i++) {

		var x1 = points[getIdByName(diaganalsArray[i].PName.Start)].xy.x,
		y1 = points[getIdByName(diaganalsArray[i].PName.Start)].xy.y,
		x2 = points[getIdByName(diaganalsArray[i].PName.End)].xy.x,
		y2 = points[getIdByName(diaganalsArray[i].PName.End)].xy.y;

		lPath.moveTo(x1, y1);
		lPath.lineTo(x2, y2)
		ctx.strokeStyle = 'rgb(116, 13, 201)';
		lPath.closePath();
		ctx.stroke(lPath);
	}
	Draw(true, color);
}
function clearCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawGrid();

}
function getLineArray() {
	if (notFinished) {
		alert(" Proverka ");
		notFinished = false;
		SortAndDraw();
		addTable();
		return;
	}
	var lar = new Array();
	for (var i = 0; i < points.length - 1; i++) {
		var point1 = points[i],
		point2 = points[i + 1];
		lar.push({
			PName : {
				Start : point1.name,
				End : point2.name
			},
			Points : {
				Start : point1.xy,
				End : point2.xy
			},
			Len : lineLen(point1.xy, point2.xy),
			Colour : point1.colour
		});
	}
	point1 = points[points.length - 1],
	point2 = points[0];
	lar.push({
		PName : {
			Start : point1.name,
			End : point2.name
		},
		Points : {
			Start : point1.xy,
			End : point2.xy
		},
		Len : lineLen(point1.xy, point2.xy),
		Colour : point1.colour
	});
	lArray = lar;

	//relArray = JSON.parse(lArray);
	$.get(
		'Save.php', {
		lar : lArray
	});
	return lar;
}
function Set(data) {
	if (notFinished) {
		alert(" Proverka ");
		notFinished = false;
		SortAndDraw();
		addTable();
		return;
	}
	points = new Array();
	for (var i = 0; i < lArray.length; i++) {
		points.push({
			colour : "black",
			xy : lArray[i].Points.Start,
			name : lArray[i].PName.Start
		});
	}
	notFinished = false;
	Draw();
}
function findDiaganals2() {
	diaganalsArray = new Array();
	triangle = new Array();
	var lineArray = getLineArray();
	var polygon = deepCopy(points);
	while (polygon.length > 3) {
		if (isLeft(polygon[0].xy, polygon[1].xy, polygon[2].xy) && !hasPointOfPolygin(polygon)) {
			diaganalsArray.push({
				Points : {
					Start : polygon[0].xy,
					End : polygon[2].xy
				},
				PName : {
					Start : polygon[0].name,
					End : polygon[2].name
				},
				Len : lineLen(polygon[0].xy, polygon[2].xy),
				Type : 1
			});
			triangle.push([{
						Points : {
							Start : polygon[0].xy,
							End : polygon[1].xy
						},
						PName : {
							Start : polygon[0].name,
							End : polygon[1].name
						},
						Len : lineLen(polygon[0].xy, polygon[1].xy)
					}, {
						Points : {
							Start : polygon[1].xy,
							End : polygon[2].xy
						},
						PName : {
							Start : polygon[1].name,
							End : polygon[2].name
						},
						Len : lineLen(polygon[1].xy, polygon[2].xy)
					}, {
						Points : {
							Start : polygon[2].xy,
							End : polygon[0].xy
						},
						PName : {
							Start : polygon[2].name,
							End : polygon[0].name
						},
						Len : lineLen(polygon[2].xy, polygon[0].xy)
					}
				]);
			polygon.splice(1, 1);
		} else {
			var tmp = polygon.shift();
			polygon.push(tmp);
		}
	}
	triangle.push([{
				Points : {
					Start : polygon[0].xy,
					End : polygon[1].xy
				},
				PName : {
					Start : polygon[0].name,
					End : polygon[1].name
				},
				Len : lineLen(polygon[0].xy, polygon[1].xy)
			}, {
				Points : {
					Start : polygon[1].xy,
					End : polygon[2].xy
				},
				PName : {
					Start : polygon[1].name,
					End : polygon[2].name
				},
				Len : lineLen(polygon[1].xy, polygon[2].xy)
			}, {
				Points : {
					Start : polygon[2].xy,
					End : polygon[0].xy
				},
				PName : {
					Start : polygon[2].name,
					End : polygon[0].name
				},
				Len : lineLen(polygon[2].xy, polygon[0].xy)
			}
		]);
	lineArray = lineArray.concat(diaganalsArray);
	return lineArray;
}
function isLeft(A, B, C) {
	var AB = {
		x : B.x - A.x,
		y : B.y - A.y
	},
	AC = {
		x : C.x - A.x,
		y : C.y - A.y
	}
	return AB.x * AC.y - AC.x * AB.y > 0;
}
function hasPointOfPolygin(points) {
	var A = points[0].xy,
	B = points[1].xy,
	C = points[2].xy;
	for (var p = 3; p < points.length; p++) {
		if (inTriangle(A, B, C, points[p].xy))
			return true;
	}
	return false;
}
function calculateSqure(A, B, C) {
	return 1 / 2 * Math.abs((B.x - A.x) * (C.y - A.y) - (C.x - A.x) * (B.y - A.y));
}
function inTriangle(A, B, C, D) {
	return calculateSqure(A, B, C) === calculateSqure(A, B, D) + calculateSqure(A, C, D) + calculateSqure(B, D, C);
}
function lineLen(p1, p2) {
	return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}
function clearCanvasM() {

	var myTableDiv = document.getElementById("dTable");
	if (myTableDiv.hasChildNodes()) {
		myTableDiv.removeChild(myTableDiv.firstChild);
	}
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawGrid();
	points = new Array();
	midPoints = new Array();
	firstPoint = null;
	notFinished = true;
	drag = null;
}
function addTable() {
	if (notFinished) {
		alert(" Proverka ");
		notFinished = false;
		SortAndDraw();
		addTable();
		return;
	}
	tableArray = findDiaganals2();
	drawDia();
	var tbindex = 0;
	triangleDC = deepCopy(triangle);
	pointsDC = deepCopy(points)
		var myTableDiv = document.getElementById("dTable");
	if (myTableDiv.hasChildNodes()) {
		myTableDiv.removeChild(myTableDiv.firstChild);
	}
	var table = document.createElement('TABLE');
	var tableBody = document.createElement('TBODY');
	table.appendChild(tableBody);
	rows = Math.ceil(tableArray.length / 2)
		for (var i = 0; i <= rows; i++) {
			var tr = document.createElement('TR');
			tableBody.appendChild(tr);
			for (var j = 0; j < Math.round((window.innerWidth / 110)); j++) {
				if (tbindex == tableArray.length) {
					break;
				}
				var td = document.createElement('TD');
				var innerTR = document.createElement('TR');
				var td1 = document.createElement('TD');
				var td2 = document.createElement('TD');
				textname = document.createTextNode(tableArray[tbindex].PName.Start + tableArray[tbindex].PName.End + "=");
				td1.width = "50px";
				td1.appendChild(textname);
				var text = document.createElement("input");
				text.type = "text";
				text.size = "1";
				// text.value = Math.round(tableArray[tbindex].Len);
				text.id = "txtName-" + tbindex;
				text.onkeypress = function setBlur(event) {
					if (event.keyCode == 13)
						this.blur();
				}
				text.addEventListener("blur", function changeCordsOfLine() {
					var textid = this.id.split("-");
					if (Math.round(tableArray[textid[1]].Len) == this.value) {
						return;
					}
					// var tta = deepCopy(triangle);
					tableArray[textid[1]].Len = this.value
						updateLen(tableArray[textid[1]].PName, triangleDC, this.value);
					// update2(tableArray[textid[1]].PName, triangle, this.value);
					return;
				});
				td2.appendChild(text)
				innerTR.appendChild(td1);
				innerTR.appendChild(td2);
				td.appendChild(innerTR);
				tr.appendChild(td);
				tbindex++
			}
		}
		myTableDiv.appendChild(table);
}
function ChangeCoords(name, X, Y, Colour) {
	if (name == "Z100") {
		var cid = points.length - 1;
	} else {
		var cid = getIdByName(name);
	}
	if (Colour) {
		points[cid].colour = Colour;
	}
	points[cid].xy.x = X;
	points[cid].xy.y = Y;
}
function getIdByName(name) {
	if (name == "Z100") {
		return points.length - 1;
	}
	letter = name.slice(0, 1);
	var num,
	num2 = parseInt(name.slice(1, -1));
	switch (letter) {
	case "A":
		num = 1;
		break;
	case "B":
		num = 2;
		break;
	case "C":
		num = 3;
		break;
	case "D":
		num = 4;
		break;
	case "E":
		num = 5;
		break;
	case "F":
		num = 6;
		break;
	case "G":
		num = 7;
		break;
	case "H":
		num = 8;
		break;
	case "I":
		num = 9;
		break;
	case "J":
		num = 10;
		break;
	case "K":
		num = 11;
		break;
	case "L":
		num = 12;
		break;
	case "M":
		num = 13;
		break;
	case "N":
		num = 14;
		break;
	case "O":
		num = 15;
		break;
	case "P":
		num = 16;
		break;
	case "Q":
		num = 17;
		break;
	case "R":
		num = 18;
		break;
	case "S":
		num = 19;
		break;
	case "T":
		num = 20;
		break;
	case "U":
		num = 21;
		break;
	case "V":
		num = 22;
		break;
	case "W":
		num = 23;
		break;
	case "X":
		num = 24;
		break;
	case "Y":
		num = 25;
		break;
	case "Z":
		num = 26;
		break;
	}
	if (num2) {
		return num + num2 - 1;
	}
	return num - 1;
}
function getName(num) {
	var times = 0,
	string;
	if (num > 26) {
		times = Math.floor(num / 26);
		num = num - 26 * times;
	}
	switch (num) {
	case 1:
		string = "A";
		break;
	case 2:
		string = "B";
		break;
	case 3:
		string = "C";
		break;
	case 4:
		string = "D";
		break;
	case 5:
		string = "E";
		break;
	case 6:
		string = "F";
		break;
	case 7:
		string = "G";
		break;
	case 8:
		string = "H";
		break;
	case 9:
		string = "I";
		break;
	case 10:
		string = "J";
		break;
	case 11:
		string = "K";
		break;
	case 12:
		string = "L";
		break;
	case 13:
		string = "M";
		break;
	case 14:
		string = "N";
		break;
	case 15:
		string = "O";
		break;
	case 16:
		string = "P";
		break;
	case 17:
		string = "Q";
		break;
	case 18:
		string = "R";
		break;
	case 19:
		string = "S";
		break;
	case 20:
		string = "T";
		break;
	case 21:
		string = "U";
		break;
	case 22:
		string = "V";
		break;
	case 23:
		string = "W";
		break;
	case 24:
		string = "X";
		break;
	case 25:
		string = "Y";
		break;
	case 26:
		string = "Z";
		break;
	}
	if (times != 0) {
		string += times.toString()
	}
	return string;
}
function deleteLastPoint() {
	if (notFinished) {
		alert(" Proverka ");
		notFinished = false;
		SortAndDraw();
		addTable();
		return;
	}
	points.pop();
	points[points.length - 1].name = "Z100"
		if (!notFinished) {
			Draw();
		}
}
function elementIsInArray(element, _i, _array) {
	return this == element;
}
function deepCopy(obj) {
	if (Object.prototype.toString.call(obj) === '[object Array]') {
		var out = [],
		i = 0,
		len = obj.length;
		for (; i < len; i++) {
			out[i] = arguments.callee(obj[i]);
		}
		return out;
	}
	if (typeof obj === 'object') {
		var out = {},
		i;
		for (i in obj) {
			out[i] = arguments.callee(obj[i]);
		}
		return out;
	}
	return obj;
}
function update2(_name, _ta, len) {
	drawTriangle(_name, _ta, len);
	addTable();
}

function updateLen(_name, _ta, _len) {

	var name = [_name.Start, _name.End];

	for (var i = 0; i < _ta.length; i++) {
		var count = 0;
		if (name.some(elementIsInArray, _ta[i][1].PName.Start)) {
			count++;
		}
		if (name.some(elementIsInArray, _ta[i][2].PName.Start)) {
			count++;
		}
		if (name.some(elementIsInArray, _ta[i][0].PName.Start)) {
			count++;
		}
		if (count == 2) {
			for (var l = 0; l < 3; l++) {
				if ((_ta[i][l].PName.Start == name[0] || _ta[i][l].PName.Start == name[1]) && (_ta[i][l].PName.End == name[0] || _ta[i][l].PName.End == name[1])) {
					_ta[i][l].Len = _len;
				}
			}
		}

	}

}

function reDrawAll() {
	if (notFinished) {
		alert(" Proverka ");
		notFinished = false;
		SortAndDraw();
		addTable();
		return;
	}
	// var tta = deepCopy(triangle);
	var tmp = deepCopy(triangleDC);
	drawTriangle(triangleDC[0][0].PName, triangleDC, triangleDC[0][0].Len)
	triangleDC = tmp;
	drawDia('rgb(0, 0, 0)');
}

function drawTriangle(_name, _ta, len) {
	var tra = _ta;
	var name = [_name.Start, _name.End];
	var tLen = len;
	console.log("Cheking: " + name[0] + name[1])
	for (var i = 0; i < tra.length; ) {
		var count = 0;
		if (name.some(elementIsInArray, tra[i][1].PName.Start)) {
			count++;
		}
		if (name.some(elementIsInArray, tra[i][2].PName.Start)) {
			count++;
		}
		if (name.some(elementIsInArray, tra[i][0].PName.Start)) {
			count++;
		}
		if (count == 2) {
			var tr = tra.splice(i, 1);
			var tt = tr[0];
			var lineid;
			for (var l = 0; l < 3; l++) {
				if ((tt[l].PName.Start == name[0] || tt[l].PName.Start == name[1]) && (tt[l].PName.End == name[0] || tt[l].PName.End == name[1])) {
					lineid = l;
					break;
				}
			}
			var x1,
			y1,
			x2,
			y2,
			a,
			b;
			switch (lineid) {
			case 0:
				x1 = points[getIdByName(tt[0].PName.Start)].xy.x;
				y1 = points[getIdByName(tt[0].PName.Start)].xy.y;
				x2 = points[getIdByName(tt[0].PName.End)].xy.x;
				y2 = points[getIdByName(tt[0].PName.End)].xy.y;
				a = tt[2].Len;
				b = tt[1].Len;
				break;
			case 1:
				x1 = points[getIdByName(tt[1].PName.Start)].xy.x;
				y1 = points[getIdByName(tt[1].PName.Start)].xy.y;
				x2 = points[getIdByName(tt[1].PName.End)].xy.x;
				y2 = points[getIdByName(tt[1].PName.End)].xy.y;
				a = tt[0].Len;
				b = tt[2].Len;
				break;
			case 2:
				x1 = points[getIdByName(tt[2].PName.Start)].xy.x;
				y1 = points[getIdByName(tt[2].PName.Start)].xy.y;
				x2 = points[getIdByName(tt[2].PName.End)].xy.x;
				y2 = points[getIdByName(tt[2].PName.End)].xy.y;
				a = tt[1].Len;
				b = tt[0].Len;
				break;
			}
			if (tLen) {
				var mc = new jsPoint((x1 + x2) / 2, (y1 + y2) / 2);
				var mL = tLen / 2;
				var ma = Math.atan2((y2 - mc.y), (x2 - mc.x)),
				mb = Math.atan2((y1 - mc.y), (x1 - mc.x));
				x1 = mc.x + mL * Math.cos(mb);
				y1 = mc.y + mL * Math.sin(mb);
				x2 = mc.x + mL * Math.cos(ma);
				y2 = mc.y + mL * Math.sin(ma);
				ChangeCoords(tt[lineid].PName.Start, x1, y1);
				ChangeCoords(tt[lineid].PName.End, x2, y2);
				tLen = null;
			}
			var tResult = getCrossPoints({
					x : x1,
					y : y1,
					radius : a
				}, {
					x : x2,
					y : y2,
					radius : b
				});

			if (tResult.count == 0) {
				alert("Ошибка построения фигуры");
				points = pointsDC;
				addTable();
				return;
			}
			if (isLeft(tt[0].Points.Start, tt[1].Points.Start, tt[2].Points.Start) == isLeft(new jsPoint(x1, y1), new jsPoint(x2, y2), tResult.pos1)) {
				result = tResult.pos1
			} else {
				result = tResult.pos2
			}
			var trname = [tt[0].PName.Start, tt[1].PName.Start, tt[2].PName.Start]
			for (var tn in trname) {
				if (trname[tn] != name[0] && trname[tn] != name[1]) {
					console.log("найденая вершина = " + trname[tn])
					ChangeCoords(trname[tn], result.x, result.y);
					break;
				}
			}
			console.log("Found Triangle:" + trname.join())
			for (var j = 0; j < tt.length; j++) {
				tra = drawTriangle(tt[j].PName, tra);
			}
			return tra;
		}
		i++;
	}
	console.log("Nothing Found")
	return tra;
}
function getCrossPoints(oCircle1, oCircle2) {
	var nMargin = 10;
	var obj = new Object();
	obj.count = 0;
	obj.pos1 = null;
	obj.pos2 = null;
	var d = lineLen(oCircle1, oCircle2);
	if (Math.abs(d - Math.abs(oCircle1.radius - oCircle2.radius)) < nMargin / 2) {
		var nSign = sgn(oCircle1.radius - oCircle2.radius);
		var nDelta = (d - Math.abs(oCircle1.radius - oCircle2.radius)) / 2;
		obj.count = 1;
		obj.pos1 = new jsPoint(oCircle1.x + (oCircle1.radius - nDelta) * (oCircle2.x - oCircle1.x) / d * nSign, oCircle1.y + (oCircle1.radius - nDelta) * (oCircle2.y - oCircle1.y) / d * nSign);
	} else if (Math.abs(d - (oCircle1.radius + oCircle2.radius)) < nMargin / 2) {
		obj.count = 1;
		var nDelta = (d - Math.abs(oCircle1.radius + oCircle2.radius)) / 2;
		obj.pos1 = new jsPoint(oCircle1.x + (oCircle1.radius + nDelta) * (oCircle2.x - oCircle1.x) / d, oCircle1.y + (oCircle1.radius + nDelta) * (oCircle2.y - oCircle1.y) / d);
	} else if (d < oCircle1.radius + oCircle2.radius && d > Math.abs(oCircle1.radius - oCircle2.radius)) {
		obj.count = 2;
		var b = (oCircle2.radius * oCircle2.radius - oCircle1.radius * oCircle1.radius + d * d) / (2 * d);
		var a = d - b;
		var h = Math.sqrt(oCircle1.radius * oCircle1.radius - a * a);
		var oPos0 = new jsPoint(oCircle1.x + a / d * (oCircle2.x - oCircle1.x), oCircle1.y + a / d * (oCircle2.y - oCircle1.y));
		obj.pos1 = new jsPoint(oPos0.x + h / d * (oCircle2.y - oCircle1.y), oPos0.y - h / d * (oCircle2.x - oCircle1.x));
		obj.pos2 = new jsPoint(oPos0.x - h / d * (oCircle2.y - oCircle1.y), oPos0.y + h / d * (oCircle2.x - oCircle1.x));
	}
	return obj;
}
function sgn(x) {
	return (x > 0) - (x < 0);
}

function rl() {
	var c = centroid(points);

	for (var i in points) {
		var p = points[i].xy;
		var dx = p.x - c.x,
		dy = p.y - c.y;
		var angle = Math.PI / 72;
		var dx2 = dx * Math.cos(angle) - dy * Math.sin(angle);
		var dy2 = dx * Math.sin(angle) + dy * Math.cos(angle);
		points[i].xy.x = dx2 + c.x;
		points[i].xy.y = dy2 + c.y;

	}

	drawDia();

	// clearCanvas();
	// ctx.translate(cw/2, ch/2);
	// ctx.rotate(10 * Math.PI / 180);
	// ctx.translate(-cw/2, -ch/2);
	// drawDia('rgb(0, 0, 0)',true);
}

function rr(int1, int2) {
	movePoints(int1, int2);
	drawDia();
}

function movePoints(x, y) {
	for (var i in points) {
		points[i].xy.x += x;
		points[i].xy.y += y;
	}
}

function centroid(pA) {
	var centroidX = 0,
	centroidY = 0;

	for (var p in pA) {
		centroidX += pA[p].xy.x;
		centroidY += pA[p].xy.y;
	}
	return {
		x : centroidX / pA.length,
		y : centroidY / pA.length
	};
}

function toImage() {

	var dataURL = canvas.toDataURL();
	document.getElementById('canvasImg').src = dataURL;

}

function drawText() {

	ctx.font = "14px serif";
	ctx.fillStyle = 'rgb(0,0,0)';
	if (tableArray) {
		for (var i in midPoints) {
			ctx.fillText(Math.round(tableArray[i].Len), midPoints[i].xy.x, midPoints[i].xy.y + 10);
		}
	}

	for (var i in points) {

		ctx.fillText(points[i].name, points[i].xy.x, points[i].xy.y + 15);
	}
}
