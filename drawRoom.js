var gridLen = 10;
var conerRadius = 4;
var conerRadiusInv = 12;
var midRadius = 2;
var midRadiusInv = 10;
var debug = false;

var canvasDiv = document.getElementById("canvas");
var gr = new jsGraphics(canvasDiv);
gr.showGrid(gridLen, false);

var drag = null,
notFinished = true,
points = new Array(),
tableArray,
diaganalsArray,
lArray,
triangle;

canvasDiv.onclick = onClick;

function MousePos(event) {
	event = (event ? event : window.event);
	return {
		x : event.pageX - canvasDiv.offsetLeft,
		y : event.pageY - canvasDiv.offsetTop
	}
}

function onClick(e) {
	e = MousePos(e);
	x = Math.round(e.x / gridLen) * gridLen
		y = Math.round(e.y / gridLen) * gridLen
		cp = new jsPoint(x, y)

		if (drag != undefined) {

			if (inCircleCheck(points, conerRadiusInv, e)) {
				points.splice(drag, 1);
				SortAndDraw();
				drag = null;
				return;
			}

			points[drag].xy.x = x;
			points[drag].xy.y = y;
			SortAndDraw();
			drag = null;
			return;
		}

		if (notFinished) {
			if (points.length > 2 && points[0].xy.x == cp.x && points[0].xy.y == cp.y) {

				notFinished = false;
				SortAndDraw();
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
			if (points.length == 1) {
				gr.fillCircle(new jsColor("Red"), cp, 3);
				return;
			}
			gr.fillCircle(new jsColor("Black"), cp, 1);

			if (points.length == 1) {}
		} else {
			drag = inCircleCheck(points, conerRadiusInv, e);
			if (drag) {
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

function Draw() {

	if (points.length < 2) {
		alert("min 2 points");
		return false;
	}

	clearCanvas();
	midPoints = new Array();

	drawArray = getLineArray();

	for (var i = 0; i < drawArray.length; i++) {

		gr.fillCircle(new jsColor("red"), drawArray[i].Points.Start, conerRadius);
		gr.drawLine(new jsPen(new jsColor(drawArray[i].Colour), 2), drawArray[i].Points.Start, drawArray[i].Points.End)
		if (debug) {
			var t = "(" + drawArray[i].Points.Start.x + ":" + drawArray[i].Points.Start.y + ")"
				gr.drawText(t, new jsPoint(drawArray[i].Points.Start.x, drawArray[i].Points.Start.y + 10));
		} else {
			gr.drawText(drawArray[i].PName.Start, new jsPoint(drawArray[i].Points.Start.x, drawArray[i].Points.Start.y + 10));
		}

		tp = {
			xy : new jsPoint((drawArray[i].Points.Start.x + drawArray[i].Points.End.x) / 2, (drawArray[i].Points.Start.y + drawArray[i].Points.End.y) / 2)
		}
		gr.fillCircle(new jsColor("Blue"), tp.xy, midRadius);
		midPoints.push(tp)
	}

}

function drawDia() {

	Draw();
	for (var i = 0; i < diaganalsArray.length; i++) {

		gr.drawLine(new jsPen(new jsColor("purple"), 2), diaganalsArray[i].Points.Start, diaganalsArray[i].Points.End)
	}
}

function clearCanvas() {

	gr.clear();
	gr = new jsGraphics(canvasDiv);
	gr.showGrid(gridLen, false);
}

function getLineArray() {

	if (notFinished) {
		alert(" Завершите фигуру. (щелчок по первой 'Большая красная' точке фигуры) ");
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
	return lar;
}

function Set(data) {
	if (notFinished) {
		alert(" Завершите фигуру. (щелчок по первой 'Большая красная' точке фигуры) ");
		return;
	}
	points = new Array();
	for (var i = 0; i < lArray.length; i++) {

		// s1 = getIdByName(lArray[i].PName.Start);
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

	lineArray = getLineArray();

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

			var c = lineLen(polygon[0].xy, polygon[1].xy),
			a = lineLen(polygon[1].xy, polygon[2].xy),
			b = lineLen(polygon[2].xy, polygon[0].xy)

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

function findDiaganals() {

	var prevIndex,
	nextIndex;

	var diagArray = new Array(),
	lenArray = getClosestToCenterPoints(),
	lineArray = getLineArray();

	var index,
	temp,
	exludePoints = new Array();

	var rv;
	while (lenArray.length) {

		index = (lenArray.shift()).index;
		temp = getNextAndPrev(index, points);
		prevIndex = temp.prev;
		nextIndex = temp.next;
		exludePoints = [prevIndex, index, nextIndex];

		rv = addDiag(exludePoints, diagArray, lineArray, index);

		exludePoints = rv.exp;
		diagArray = rv.diaa;

	}

	diaganalsArray = diagArray;

	lineArray = lineArray.concat(diagArray);
	drawDia();
	return lineArray;
}

function addDiag(exp, diaa, la, idx) {

	var allLines = la.concat(diaa);

	for (var i = 0; i < points.length; i++) {

		if (!exp.some(elementIsInArray, i)) {

			var p1 = points[idx].xy,
			p2 = points[i].xy;
			var interCount = 0;

			for (var j = 0; j < allLines.length; j++) {

				var p3 = allLines[j].Points.Start,
				p4 = allLines[j].Points.End;

				if (intersectionCheck(p1, p2, p3, p4)) {
					interCount++;
				}

			}

			if (!interCount) {

				var itCount = 0;

				var p1t = new jsPoint((p1.x + p2.x) / 2, (p1.y + p2.y) / 2),
				p2t = new jsPoint(1000, p1t.y);

				for (var l = 0; l < la.length; l++) {

					var p3t = la[l].Points.Start,
					p4t = la[l].Points.End;

					if (intersectionCheck(p1t, p2t, p3t, p4t)) {
						itCount++;
					}
				}

				var isEven = itCount % 2;

				if (isEven != 0 && itCount != 0) {

					diaa.push({
						Points : {
							Start : p1,
							End : p2
						},
						PName : {
							Start : points[idx].name,
							End : points[i].name
						},
						Len : lineLen(p1, p2),
						Type : 1
					});

					exp.push(i);

				}

			}
		}
	}

	return {
		exp : exp,
		diaa : diaa
	}
}

function intersectionCheck(p1, p2, p3, p4) {

	var x1,
	x2,
	x3,
	x4,
	y1,
	y2,
	y3,
	y4

	if (p1.x > p2.x) {
		x1 = p2.x;
		y1 = p2.y;

		x2 = p1.x;
		y2 = p1.y;
	} else {
		x1 = p1.x;
		y1 = p1.y;

		x2 = p2.x;
		y2 = p2.y;
	}

	if (p3.x > p4.x) {
		x3 = p4.x;
		y3 = p4.y;

		x4 = p3.x;
		y4 = p3.y;
	} else {
		x3 = p3.x;
		y3 = p3.y;

		x4 = p4.x;
		y4 = p4.y;
	}

	if (x3 == x4) {
		var tempx1 = x3,
		tempy1 = y3,

		tempx2 = x4,
		tempy2 = y4;

		x3 = x1;
		y3 = y1;

		x4 = x2;
		y4 = y2;

		x1 = tempx1;
		y1 = tempy1;

		x2 = tempx2;
		y2 = tempy2;

	}

	if (x1 == x3 && x2 == x4 & y1 == y3 && y2 == y4) {
		return true;
	}
	if (x1 == x4 && x2 == x3 & y1 == y4 && y2 == y3) {
		return true;
	}

	if (x1 == x2) {
		if (y3 == y4) {

			if (between(y3, y1, y2) && between(x1, x3, x4)) {
				return true;
			} else {
				return false;
			}
		}
		if (x3 == x4) {
			return false;
		}
		// y = Math.abs(((y3 - y4) * x1 - (x3 * y4 - x4 * y3)) / (x4 - x3));
		Ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
		y = y1 + Ua * (y2 - y1);
		if (between(y, y1, y2) && between(y, y3, y4) && between(x1, x3, x4)) {
			return true;
		} else {
			return false;
		}
	}

	k1 = (x2 - x1) / (y2 - y1);
	k2 = (x4 - x3) / (y4 - y3);

	if (Math.abs(k1) != Math.abs(k2)) {

		x = ((x1 * y2 - x2 * y1) * (x4 - x3) - (x3 * y4 - x4 * y3) * (x2 - x1)) / ((y1 - y2) * (x4 - x3) - (y3 - y4) * (x2 - x1));
		y = ((y3 - y4) * x - (x3 * y4 - x4 * y3)) / (x4 - x3);

		x = Math.abs(x);

		// if (Math.abs(x)==x1||Math.abs(x)==x2||Math.abs(x)==x3||Math.abs(x)==x4){return false;}

		if (y1 == y2) {
			if (between(x, x1, x2) && between(x, x3, x4) && between(y, y3, y4)) {
				return true;
			}
		} else {

			if (y3 == y4) {
				if (between(x, x1, x2) && between(x, x3, x4) && between(y, y1, y2)) {
					return true;
				}
			} else {

				if (x1 == x2) {
					if (between(x, x3, x4) && between(y, y1, y2) && between(y, y3, y4)) {
						return true;
					}
				} else {
					if (x3 == x4) {
						if (between(x, x1, x2) && between(y, y1, y2) && between(y, y3, y4)) {
							return true;
						}
					} else {
						if (between(x, x1, x2) && between(x, x3, x4) && between(y, y1, y2) && between(y, y3, y4)) {
							return true;
						}
					}
				}
			}
		}

	} else {

		if (x1 == x2 && x3 == x4 & x1 == x3) {

			var miny1 = Math.min(y1, y2),
			maxy1 = Math.max(y1, y2),

			miny2 = Math.min(y3, y4),
			maxy2 = Math.max(y3, y4);

			return Math.max(miny1, miny2) < Math.min(maxy1, maxy2);

		}

		if (y1 == y2 && y3 == y4 && y1 == y3) {

			var minx1 = Math.min(x1, x2),
			maxx1 = Math.max(x1, x2),

			minx2 = Math.min(x3, x4),
			maxx2 = Math.max(x3, x4);

			return Math.max(minx1, minx2) < Math.min(maxx1, maxx2);

		}

	}

	return false;
}

function getClosestToCenterPoints() {
	var c = getCenterPointOfPoints(points);
	var lenar = new Array();

	for (var i = 0; i < points.length; i++) {
		lenar.push({
			index : i,
			Len : lineLen(c, points[i].xy)
		});
	}

	lenar.sort(compareLen);
	return lenar;
}

function getCenterPointOfPoints(points_array) {
	var xSum = 0,
	ySum = 0;
	for (var i = 0; i < points_array.length; i++) {
		xSum += points_array[i].xy.x;
		ySum += points_array[i].xy.y;
	}

	centerPoint = new jsPoint(xSum / points_array.length, ySum / points_array.length);

	return centerPoint;
}

function getNextAndPrev(number, arr) {
	var i1,
	i2

	if (number + 1 < arr.length) {
		i1 = number + 1
	} else {
		i1 = 0
	}
	if (number - 1 >= 0) {
		i2 = number - 1
	} else {
		i2 = arr.length - 1
	}
	return {
		prev : i2,
		next : i1
	}
}

function compareLen(a, b) {
	return a.Len - b.Len;
}

function lineLen(p1, p2) {
	return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

function between(number, a, b) {
	var min = Math.min(a, b),
	max = Math.max(a, b);

	return number > min && number < max;
}

function clearCanvasM() {
	gr.clear();
	points = new Array();
	midPoints = new Array();
	firstPoint = null;
	gr = new jsGraphics(canvasDiv);
	gr.showGrid(gridLen, false);
	notFinished = true;
	drag = null;

}

function addTable() {

	if (notFinished) {
		alert(" Завершите фигуру. (щелчок по первой 'Большая красная' точке фигуры) ");
		return;
	}

	tableArray = findDiaganals2();

	drawDia();

	var tbindex = 0;

	var myTableDiv = document.getElementById("dTable");

	if (myTableDiv.hasChildNodes()) {
		myTableDiv.removeChild(myTableDiv.firstChild);
	}

	var table = document.createElement('TABLE');
	// table.border='1';

	var tableBody = document.createElement('TBODY');
	table.appendChild(tableBody);

	rows = Math.ceil(tableArray.length / 2)
		for (var i = 0; i <= rows; i++) {
			var tr = document.createElement('TR');
			tableBody.appendChild(tr);

			for (var j = 0; j < 2; j++) {
				if (tbindex == tableArray.length) {
					break;
				}
				var td = document.createElement('TD');
				var innerTR = document.createElement('TR');

				var td1 = document.createElement('TD');
				var td2 = document.createElement('TD');
				// td.width='200';
				// td.cellpadding = "5";
				textname = document.createTextNode(tableArray[tbindex].PName.Start + "-" + tableArray[tbindex].PName.End);
				td1.width = "50"
					td1.appendChild(textname);

				var text = document.createElement("input");

				text.type = "text";
				// text.width='200';
				text.value = Math.round(tableArray[tbindex].Len);
				text.id = "txtName-" + tbindex;
				text.onkeypress = function setBlur(event) {
					if (event.keyCode == 13)
						this.blur(); //"Enter"
				}

				text.addEventListener("blur", function changeCordsOfLine() {

					var textid = this.id.split("-");

					if (tableArray[textid[1]].Len == this.value) {
						return;
					}

					var tta = deepCopy(triangle);
					update2(tableArray[textid[1]].PName, tta, this.value);

					return;

					var mp1 = tableArray[textid[1]].Points.Start,
					mp2 = tableArray[textid[1]].Points.End;

					var mc = new jsPoint((mp1.x + mp2.x) / 2, (mp1.y + mp2.y) / 2);

					var mL = this.value / 2;

					var ma = Math.atan2((mp2.y - mc.y), (mp2.x - mc.x)),
					mb = Math.atan2((mp1.y - mc.y), (mp1.x - mc.x));

					var startx = mc.x + mL * Math.cos(mb),
					starty = mc.y + mL * Math.sin(mb);

					var endx = mc.x + mL * Math.cos(ma),
					endy = mc.y + mL * Math.sin(ma);

					// var temp2 = tableArray[temp[1]].Name.split("-");

					// var id1 = getIdByName(temp2[0]),
					// id2 = getIdByName(temp2[1]);
					// tableArray[temp[1]].Colour = "black";
					ChangeCoords(tableArray[textid[1]].PName.Start, startx, starty, "red");
					ChangeCoords(tableArray[textid[1]].PName.End, endx, endy, "red");
					// points[id1].xy = new jsPoint(startx,starty);
					// points[id2].xy = new jsPoint(endx,endy);

					// drawLineArray(tableArray);
					// addTable();
					updateTable();

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
	// Draw();
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
		alert(" Завершите фигуру. (щелчок по первой 'Большая красная' точке фигуры) ");
		return;
	}
	points.pop();
	points[points.length - 1].name = "Z100"
		Draw();
}

function updateTable() {

	lineArray = getLineArray();

	for (var i = 0; i < diaganalsArray.length; i++) {

		var tidx1 = getIdByName(diaganalsArray[i].PName.Start),
		tidx2 = getIdByName(diaganalsArray[i].PName.End);

		if (tidx1 > points.length) {
			tidx1 = points.length - 1
		}
		if (tidx2 > points.length) {
			tidx2 = points.length - 1
		}

		diaganalsArray[i].Points.Start = points[tidx1].xy;
		diaganalsArray[i].Points.End = points[tidx2].xy;

		diaganalsArray[i].Len = lineLen(points[tidx1].xy, points[tidx2].xy)

	}

	tableArray = lineArray.concat(diaganalsArray);

	for (var j = 0; j < tableArray.length; j++) {
		var el = document.getElementById("txtName-" + j);
		el.value = Math.round(tableArray[j].Len);
	}

	drawDia();

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

	// clearCanvas();
	drawTriangle(_name, _ta, len);
	
	addTable();

}

function drawTriangle(_name, _ta, len) {

	var tra = _ta;
	var name = [_name.Start, _name.End];

	console.log("Cheking: " + name[0] + name[1])

	for (var i = 0; i < tra.length; i++) {
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

				// b = lineLen(points[getIdByName(tt[1].PName.Start)].xy,points[getIdByName(tt[1].PName.End)].xy);
				// a = lineLen(points[getIdByName(tt[2].PName.Start)].xy,points[getIdByName(tt[2].PName.End)].xy);
				break;
			case 1:
				x1 = points[getIdByName(tt[1].PName.Start)].xy.x;
				y1 = points[getIdByName(tt[1].PName.Start)].xy.y;
				x2 = points[getIdByName(tt[1].PName.End)].xy.x;
				y2 = points[getIdByName(tt[1].PName.End)].xy.y;

				a = tt[0].Len;
				b = tt[2].Len;

				// b = lineLen(points[getIdByName(tt[2].PName.Start)].xy,points[getIdByName(tt[2].PName.End)].xy);
				// a = lineLen(points[getIdByName(tt[0].PName.Start)].xy,points[getIdByName(tt[0].PName.End)].xy);
				break;
			case 2:
				x1 = points[getIdByName(tt[2].PName.Start)].xy.x;
				y1 = points[getIdByName(tt[2].PName.Start)].xy.y;
				x2 = points[getIdByName(tt[2].PName.End)].xy.x;
				y2 = points[getIdByName(tt[2].PName.End)].xy.y;

				a = tt[1].Len;
				b = tt[0].Len;
				// b = lineLen(points[getIdByName(tt[2].PName.Start)].xy,points[getIdByName(tt[2].PName.End)].xy);
				// a = lineLen(points[getIdByName(tt[1].PName.Start)].xy,points[getIdByName(tt[1].PName.End)].xy);
				break;
			}

			if (len) {

				var mc = new jsPoint((x1 + x2) / 2, (y1 + y2) / 2);

				var mL = len / 2;

				var ma = Math.atan2((y2 - mc.y), (x2 - mc.x)),
				mb = Math.atan2((y1 - mc.y), (x1 - mc.x));

				x1 = mc.x + mL * Math.cos(mb);
				y1 = mc.y + mL * Math.sin(mb);

				x2 = mc.x + mL * Math.cos(ma);
				y2 = mc.y + mL * Math.sin(ma);

				ChangeCoords(tt[lineid].PName.Start, x1, y1);
				ChangeCoords(tt[lineid].PName.End, x2, y2);

			}

			var tResult = getCrossPoints({
					x : x1,
					y,
					y1,
					radius : a
				}, {
					x : x2,
					y : y2,
					radius : b
				});
			// рисование треугольника tt


			if (isLeft(tt[0].Points.Start, tt[1].Points.Start, tt[2].Points.Start) == isLeft(new jsPoint(x1, y1), new jsPoint(x2, y2), tResult.pos1)) {
				result = tResult.pos1
			} else {
				result = tResult.pos2
			}

			//времено
			// var result;

			var trname = [tt[0].PName.Start, tt[1].PName.Start, tt[2].PName.Start]

			for (var tn in trname) {
				if (trname[tn] != name[0] && trname[tn] != name[1]) {
					console.log("найденая вершина = " + trname[tn])

					ChangeCoords(trname[tn], result.x, result.y);

					//времено
					// result = {
					// x: points[getIdByName(trname[tn])].xy.x,
					// y: points[getIdByName(trname[tn])].xy.y
					// }
					break;
				}
			}

			// drawTr(x1,x2,result.x,y1,y2,result.y);

			console.log("Found Triangle:" + trname.join())

			for (var j = 0; j < tt.length; j++) {
				tra = drawTriangle(tt[j].PName, tra);
			}

			return tra;
		}
	}
	console.log("Nothing Found")

	return tra;

}

function getXY1(x1, x2, y1, y2, a, b) {

	x = (1 / 2) * ((y1 - y2) * Math.sqrt( - (-x1 * x1 + 2 * x2 * x1 - x2 * x2 + (-b + a - y1 + y2) * (-b + a + y1 - y2)) * (-x1 * x1 + 2 * x2 * x1 - x2 * x2 + (b + a - y1 + y2) * (b + a + y1 - y2)) * ((x1 - x2) * (x1 - x2))) + (x1 * x1 * x1 - x1 * x1 * x2 + (y2 * y2 - 2 * y1 * y2 - b * b + y1 * y1 + a * a - x2 * x2) * x1 - x2 * (a * a - b * b - x2 * x2 - y2 * y2 + 2 * y1 * y2 - y1 * y1)) * (x1 - x2)) / ((x1 - x2) * (x1 * x1 - 2 * x2 * x1 + x2 * x2 + ((y1 - y2) * (y1 - y2))));

	y = (-Math.sqrt( - (-x1 * x1 + 2 * x2 * x1 - x2 * x2 + (-b + a - y1 + y2) * (-b + a + y1 - y2)) * (-x1 * x1 + 2 * x2 * x1 - x2 * x2 + (b + a - y1 + y2) * (b + a + y1 - y2)) * ((x1 - x2) * (x1 - x2))) + y1 * y1 * y1 - y1 * y1 * y2 + (a * a + x1 * x1 - b * b + x2 * x2 - 2 * x2 * x1 - y2 * y2) * y1 + y2 * y2 * y2 + (x2 * x2 - 2 * x2 * x1 + b * b - a * a + x1 * x1) * y2) / (2 * y1 * y1 - 4 * y1 * y2 + 2 * y2 * y2 + 2 * ((x1 - x2) * (x1 - x2)));

	return {
		x : x,
		y : y
	};
}

function getXY2(x1, x2, y1, y2, a, b) {

	x = (1 / 2) * ((-y1 + y2) * Math.sqrt( - (-x1 * x1 + 2 * x2 * x1 - x2 * x2 + (-b + a - y1 + y2) * (-b + a + y1 - y2)) * ((x1 - x2) * (x1 - x2)) * (-x1 * x1 + 2 * x2 * x1 - x2 * x2 + (b + a - y1 + y2) * (b + a + y1 - y2))) + (x1 - x2) * (x1 * x1 * x1 - x1 * x1 * x2 + (y1 * y1 - 2 * y1 * y2 + y2 * y2 + a * a - b * b - x2 * x2) * x1 - x2 * (-b * b - x2 * x2 + a * a - y1 * y1 + 2 * y1 * y2 - y2 * y2))) / ((x1 * x1 - 2 * x2 * x1 + x2 * x2 + ((y1 - y2) * (y1 - y2))) * (x1 - x2));

	y = (Math.sqrt( - ((x1 - x2) * (x1 - x2)) * (-x1 * x1 + 2 * x2 * x1 - x2 * x2 + (b + a + y1 - y2) * (b + a - y1 + y2)) * (-x1 * x1 + 2 * x2 * x1 - x2 * x2 + (-b + a + y1 - y2) * (-b + a - y1 + y2))) + y1 * y1 - y1 * y1 * y2 + (a * a + x1 * x1 - b * b + x2 * x2 - 2 * x2 * x1 - y2 * y2) * y1 + y2 * y2 * y2 + (x2 * x2 - 2 * x2 * x1 + b * b - a * a + x1 * x1) * y2) / (2 * y1 * y1 - 4 * y1 * y2 + 2 * y2 * y2 + 2 * ((x1 - x2) * (x1 - x2)));

	return {
		x : x,
		y : y
	};
}

function drawTr(x1, x2, x3, y1, y2, y3) {

	gr.drawLine(new jsPen(new jsColor("black"), 2), new jsPoint(x1, y1), new jsPoint(x2, y2))
	gr.drawLine(new jsPen(new jsColor("black"), 2), new jsPoint(x2, y2), new jsPoint(x3, y3))
	gr.drawLine(new jsPen(new jsColor("black"), 2), new jsPoint(x1, y1), new jsPoint(x3, y3))

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
		obj.pos1 = new jsPoint(oCircle1.x + (oCircle1.radius - nDelta) * (oCircle2.x - oCircle1.x) / d * nSign,
				oCircle1.y + (oCircle1.radius - nDelta) * (oCircle2.y - oCircle1.y) / d * nSign);
	} else if (Math.abs(d - (oCircle1.radius + oCircle2.radius)) < nMargin / 2) {
		obj.count = 1;
		var nDelta = (d - Math.abs(oCircle1.radius + oCircle2.radius)) / 2;
		obj.pos1 = new jsPoint(oCircle1.x + (oCircle1.radius + nDelta) * (oCircle2.x - oCircle1.x) / d,
				oCircle1.y + (oCircle1.radius + nDelta) * (oCircle2.y - oCircle1.y) / d);
	} else if (d < oCircle1.radius + oCircle2.radius && d > Math.abs(oCircle1.radius - oCircle2.radius)) {
		obj.count = 2;
		var b = (oCircle2.radius * oCircle2.radius - oCircle1.radius * oCircle1.radius + d * d) / (2 * d);
		var a = d - b;
		var h = Math.sqrt(oCircle1.radius * oCircle1.radius - a * a);
		var oPos0 = new jsPoint(oCircle1.x + a / d * (oCircle2.x - oCircle1.x),
				oCircle1.y + a / d * (oCircle2.y - oCircle1.y));
		obj.pos1 = new jsPoint(oPos0.x + h / d * (oCircle2.y - oCircle1.y),
				oPos0.y - h / d * (oCircle2.x - oCircle1.x));
		obj.pos2 = new jsPoint(oPos0.x - h / d * (oCircle2.y - oCircle1.y),
				oPos0.y + h / d * (oCircle2.x - oCircle1.x));
	}
	return obj;
}

function sgn(x) {
	return (x > 0) - (x < 0);
}
