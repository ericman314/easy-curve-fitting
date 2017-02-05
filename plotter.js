var Plotter = function(canvas) {

var data;
var smooth;
var plotWidth;
var marginLeft, marginRight, marginTop, marginBottom;
var xAxis;
var yAxis;
var xBegin;
var yBegin;
var xEnd;
var yEnd;

marginTop = 10;
marginBottom = 30;
marginLeft = 10;
marginRight = 10;

function computeXAxis() {

  plotWidth = canvas.Width - marginLeft - marginRight;

	xAxis = {};
	xAxis.xBegin = xBegin;
	xAxis.xEnd = xEnd;

	var maxNumIntervals = plotWidth / 100;
	var predInterval = (xAxis.xEnd - xAxis.xBegin) / maxNumIntervals;

	var e = Math.floor(Math.log(predInterval) / Math.LN10);
	var m = predInterval / Math.pow(10, e);

	if(m < 1) {
		m = 1;
	} else if(m < 2) {
		m = 2;
	} else if (m < 5) {
		m = 5
	} else {
		m = 1
		e = e + 1;
	}

	xAxis.major = m * Math.pow(10, e);
	xAxis.decs = Math.max(0, -e);

	if(m === 1) {
		xAxis.minor = xAxis.major / 5;
	} else if(m === 2) {
		xAxis.minor = xAxis.major / 2;
	} else if (m === 5) {
		xAxis.minor = xAxis.major / 5;
	}

	var remainder = xAxis.xBegin % xAxis.major;
	if(remainder < 0) remainder += xAxis.major;
	xAxis.majorBegin = xAxis.xBegin - remainder + xAxis.major;

	var remainder = xAxis.xBegin % xAxis.minor;
	if(remainder < 0) remainder += xAxis.minor;
	xAxis.minorBegin = xAxis.xBegin - remainder + xAxis.minor;

  xAxis.unitsPerPixel = (xAxis.xEnd - xAxis.xBegin) / plotWidth;

}

function autoXAxis() {

  var minX;
  var maxX;


	for(var i=0; i<data.length; i++) {
		var x = data[i].x;
		if(x < minX || typeof(minX) === "undefined")
			minX = x;
		if(x > maxX || typeof(maxX) === "undefined")
			maxX = x;
	}

  if(typeof(minX) === "undefined") {
    minX = 0;
    maxX = 0;
  }

  if(minX === maxX) {
    minX -= 10;
    maxX += 10;
  }

  xBegin = (minX - maxX) * 1.1 + maxX;
  xEnd = (maxX - minX) * 1.1 + minX;

  computeYAxis();
  computeXAxis();
}

function autoYAxis() {

  var minY;
  var maxY;


	for(var i=0; i<data.length; i++) {
		var y = data[i].y;
		if(y < minY || typeof(minY) === "undefined")
			minY = y;
		if(y > maxY || typeof(maxY) === "undefined")
			maxY = y;

		var y = data[i].pred;
		if(y < minY || typeof(minY) === "undefined")
			minY = y;
		if(y > maxY || typeof(maxY) === "undefined")
			maxY = y;
	}

  if(typeof(minY) === "undefined") {
    minY = 0;
    maxY = 0;
  }

  if(minY === maxY) {
    minY -= 10;
    maxY += 10;
  }

  yBegin = (minY - maxY) * 1.1 + maxY;
  yEnd = (maxY - minY) * 1.1 + minY;

  computeYAxis();
  computeXAxis();
}


function computeYAxis() {

  marginRight = 30;

	yAxis = {};
	yAxis.yBegin = yBegin;
	yAxis.yEnd = yEnd;

	var maxNumIntervals = (canvas.Height - marginTop - marginBottom) / 40;
	var predInterval = (yAxis.yEnd - yAxis.yBegin) / maxNumIntervals;

	var e = Math.floor(Math.log(predInterval) / Math.LN10);
	var m = predInterval / Math.pow(10, e);

	if(m < 1) {
		m = 1;
	} else if(m < 2) {
		m = 2;
	} else if (m < 5) {
		m = 5
	} else {
		m = 1
		e = e + 1;
	}

	yAxis.major = m * Math.pow(10, e);

	if(m === 1) {
		yAxis.minor = yAxis.major / 5;
	} else if(m === 2) {
		yAxis.minor = yAxis.major / 2;
	} else if (m === 5) {
		yAxis.minor = yAxis.major / 5;
	}

	yAxis.decs = Math.max(0, -e);
var remainder = yAxis.yBegin % yAxis.major;
	if(remainder < 0) remainder += yAxis.major;
	yAxis.majorBegin = yAxis.yBegin - remainder + yAxis.major;

	var remainder = yAxis.yBegin % yAxis.minor;
	if(remainder < 0) remainder += yAxis.minor;
	yAxis.minorBegin = yAxis.yBegin - remainder + yAxis.minor;

	if(yAxis.decs < 20) {
		marginRight = Math.max(8.0 * Math.max(yAxis.yEnd.toFixed(yAxis.decs).length, yAxis.yBegin.toFixed(yAxis.decs).length) + 40, marginRight);
	}

	yAxis.unitsPerPixel = (yAxis.yEnd - yAxis.yBegin) / (canvas.Height - marginTop - marginBottom);
}


Plotter.prototype.draw = function(quick) {

		autoXAxis();
		autoYAxis();

    var ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.beginPath();
    ctx.rect(0, 0, canvas.Width, canvas.Height);
    ctx.fillStyle = 'white';
    ctx.fill();



    /* X-AXIS */
    // Minor Gridlines
    ctx.beginPath();
    for(var x = xAxis.minorBegin; x<=xAxis.xEnd+1e-6; x+=xAxis.minor) {
      var xScr = marginLeft + (x - xAxis.xBegin) * (canvas.Width - marginLeft - marginRight) / (xEnd - xBegin);
      ctx.moveTo(xScr, marginTop);
      ctx.lineTo(xScr, canvas.Height-marginBottom);
    }
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#bbb';
    ctx.stroke();


    /* Y-AXIS */
    // Minor Gridlines
    ctx.beginPath();
 for(var y = yAxis.minorBegin; y <= yAxis.yEnd+1e-6; y += yAxis.minor) {
      if(Math.abs(y - yAxis.yBegin) / yAxis.unitsPerPixel < 1 || Math.abs(y - yAxis.yEnd) / yAxis.unitsPerPixel < 1) {
        continue;
      }
      var yScr = marginTop + (1 - (y - yAxis.yBegin) / (yAxis.yEnd - yAxis.yBegin)) * (canvas.Height - marginTop - marginBottom);
      ctx.moveTo(marginLeft, yScr);
      ctx.lineTo(canvas.Width-marginRight, yScr);
    }
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#bbb';
    ctx.stroke();

    // Major Gridlines
    for(var y = yAxis.majorBegin; y <= yAxis.yEnd+1e-6; y += yAxis.major) {
      if(Math.abs(y - yAxis.yBegin) / yAxis.unitsPerPixel < 1 || Math.abs(y - yAxis.yEnd) / yAxis.unitsPerPixel < 1) {
        continue;
      }

      var yScr = marginTop + (1 - (y - yAxis.yBegin) / (yAxis.yEnd - yAxis.yBegin)) * (canvas.Height - marginTop - marginBottom);
      ctx.beginPath();
      ctx.moveTo(marginLeft, yScr);
      ctx.lineTo(canvas.Width-marginRight, yScr);
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#777';
      ctx.stroke();
    }

    // Major Gridlines
    for(var x = xAxis.majorBegin; x<=xAxis.xEnd+1e-6; x+=xAxis.major) {
      ctx.beginPath();
      var xScr = marginLeft + (x - xAxis.xBegin) * (canvas.Width - marginLeft - marginRight) / (xEnd - xBegin);
      ctx.moveTo(xScr, marginTop);
      ctx.lineTo(xScr, canvas.Height-marginBottom);
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#777';
      ctx.stroke();
    }

	 // Data
		var lastXscr = null;
		var minYscr = null;
		var maxYscr = null;


		// Precompute units-to-screen mapping
		var xSlope = (canvas.Width - marginLeft - marginRight) / (xEnd - xBegin);
		var xIcp = marginLeft - xAxis.xBegin * xSlope;
		var ySlope = -(canvas.Height - marginTop - marginBottom) / (yAxis.yEnd - yAxis.yBegin);
		var yIcp = (canvas.Height-marginBottom) - yAxis.yBegin * ySlope;

		ctx.strokeStyle = "Red";
		ctx.fillStyle = "Red";
		ctx.beginPath();

		for(var i=0; i<data.length; i++) {
			var x = data[i].x;
			var y = data[i].y;

			var xScr = xIcp + x * xSlope;
			var yScr = yIcp + y * ySlope;

			ctx.fillRect(xScr-3, yScr-3, 6, 6);

		}
		ctx.stroke();



		ctx.strokeStyle = "Blue";
		ctx.beginPath();

		for(var i=0; i<smooth.length; i++) {
			var x = smooth[i].x;
			var y = smooth[i].y;

			var xScr = xIcp + x * xSlope;
			var yScr = yIcp + y * ySlope;

			ctx.lineTo(xScr, yScr);

		}
		ctx.stroke();




    // Clip data that is out-of-bounds (this is probably much faster than interpolating all points top and bottom)
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.rect(0, 0, canvas.Width, marginTop);
    ctx.fill();
    ctx.beginPath();
    ctx.rect(0, canvas.Height - marginBottom, canvas.Width, marginBottom);
    ctx.fill();

    // Plot area

 ctx.beginPath();
    ctx.rect(marginLeft, marginTop, canvas.Width-marginRight-marginLeft, canvas.Height-marginTop-marginBottom);
		ctx.strokeStyle = '#777';
    ctx.lineWidth = 2;
    ctx.stroke();


    // Major Gridlines labels
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.font = "14px Open Sans";
    ctx.fillStyle = 'black';
    for(var x = xAxis.majorBegin; x<=xAxis.xEnd+1e-6; x+=xAxis.major) {
      var xScr = marginLeft + (x - xAxis.xBegin) * (canvas.Width - marginLeft - marginRight) / (xEnd - xBegin);
      ctx.fillText(x.toFixed(xAxis.decs), xScr, canvas.Height - marginBottom);
    }

    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.font = "14px Open Sans";
    ctx.fillStyle = 'black';
    for(var y = yAxis.majorBegin; y <= yAxis.yEnd+1e-6; y += yAxis.major) {
      var yScr = marginTop + (1 - (y - yAxis.yBegin) / (yAxis.yEnd - yAxis.yBegin)) * (canvas.Height - marginTop - marginBottom);
      ctx.fillText(y.toFixed(yAxis.decs), canvas.Width - marginRight + 4, yScr);
    }


};

Plotter.prototype.setData = function(userData, userSmooth) {

	data = userData;
	smooth = userSmooth;

}

function doResize() {
	canvas.Width = canvas.width;
	canvas.Height = canvas.height;

  computeYAxis();
  computeXAxis();
}

doResize();

};
