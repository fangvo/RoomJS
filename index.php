
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" >
<script src="js/jquery-2.1.4.js" type="text/javascript"></script>
</head>
<body style='margin: 0'>
<canvas id="canvas" style="overflow:hidden;position:relative;border:#999999 1px solid;z-index: 0;"></canvas>
<canvas id="canvasjq" style="overflow:hidden;position:absolute;top:0;left:0;z-index: 1;"></canvas>
<br>
<div class="section">
<table>
<tr><td>
<table align="center" style="overflow:hidden;position:absolute;top:10;left:10;z-index: 5;">
  <tr align="center">
    <td></td>
    <td><input style="font-weight:bold;" src="img/upx.png" type="image" onclick="rr(0,-10);"/></td>
    <td></td>
  </tr>
  <tr align="center">
    <td><input style="font-weight:bold;" src="img/lpx.png" type="image" onclick="rr(-10,0);"/></td>
    <td><input style="font-weight:bold;" src="img/22px.png" type="image" onclick="rl();"/></td>
    <td><input style="font-weight:bold;" src="img/rpx.png" type="image" onclick="rr(10,0);"/></td>
  </tr>
  <tr align="center">
    <td><input style="font-weight:bold;" src="img/bpx.png" type="image" width="25" onclick="deleteLastPoint();"/></td>
    <td><input style="font-weight:bold;" src="img/dpx.png" type="image" onclick="rr(0,10);"/></td>
    <td><input style="font-weight:bold;" src="img/cpx.png" type="image" width="25" height="25" onclick="clearCanvasM();"/></td>
  </tr>
</table>

</td>
</table>

<table>

<tr><td>
<input style="font-weight:bold;width:100px;" type="button" value="Провести диагонали" onclick="addTable();"/><br><br>
<input style="font-weight:bold;width:100px;" type="button" value="Обновить длину линии" onclick="reDrawAll()"/><br><br>
</td><td>
<input style="font-weight:bold;width:100px;" type="button" value="Сохранить" onclick="getLineArray();alert(JSON.stringify(lArray));"/><br><br>
<input style="font-weight:bold;width:100px;" type="button" value="Вставить" onclick="Set();"/><br><br>
</td><td>
<div id="dTable">
</div>
</td></tr>
</table>

</div>
<script src="js/drawRoom.js" type="text/javascript"></script>
</body>
</html>