var math = require('./math-custom.js');
var optimize = require('./optimize.js');



var easyCurveFitting = function () {};

easyCurveFitting.prototype.log = function (obj) {
  console.log(util.inspect(obj));
};


easyCurveFitting.prototype.doLeastSquares = function(modelStr, data, guessStr) {
  
  var model = parseModel(modelStr);
    
  var guess = parseGuesses(guessStr);
  
  // Initialize any unspecified guess values to 0
  for(var param in model.params) {
    if(model.params.hasOwnProperty(param) && !guess.hasOwnProperty(param)) {
      guess[param] = 0;
    }
  }
    
  // Compile the parsed expression tree
  var code = model.node.compile();


  // Build the guess arrays
  var guessCoeff = [];
  var guessValue = [];
  for(var key in guess) {
    if(guess.hasOwnProperty(key) && key !== 'x') {
      guessCoeff.push(key);
      guessValue.push(guess[key]);
    }
  }

  // Build the objective function
  var objective = function(c) {
    var SSE = 0;
    var scope = {};
    for(var j=0; j<c.length; j++) {
      scope[guessCoeff[j]] = c[j];
    }
    for(var i=0; i<data.length; i++) {
      var x = data[i].x;
      var y = data[i].y;
      scope.x = x;
      
      var pred = code.eval(scope);
      SSE += (y - pred) * (y - pred);
    }
    return SSE;
  };


  var result = optimize(objective, guessValue);

  
  // Display the results
  var guessStr = "";
  var optimized = {};
  for(var i=0; i<result.length; i++) {
    optimized[guessCoeff[i]] = result[i];
  }
      
    
      
  return {
    guesses: guess,
    modelStr: modelStr,
    data: data,
    optimized: optimized,
    pred: function(x) {
      var scope = {x:x};
      for(var j=0; j<guessCoeff.length; j++) {
        scope[guessCoeff[j]] = optimized[guessCoeff[j]];
      }
      return code.eval(scope);
    }
  };
      
      /*
      $('#guess').val(guessStr);

			var dataStr = "x\ty\tpred\tsq.err\n";
			var SSE = 0;
			var minX = data[0].x;
			var maxX = data[0].x;
			for(var i=0; i<data.length; i++) {
				var x = data[i].x;
				var y = data[i].y;
				if(x > maxX)
					maxX = x;
				if(x < minX)
					minX = x;
				coeffs.x = x;
				var pred = code.eval(coeffs);
				data[i].pred = pred;
				var SE = (pred-y);
				SE = SE * SE;
				SSE += SE;
				dataStr += x.toString() + "\t" + y.toString() + "\t" + pred.toString() + "\t" + SE.toString() + "\n";
			}
			dataStr = "Sum of squared errors:\t" + SSE.toString() + "\n" + dataStr;
			$('#data').val(dataStr);

			
			var domain = maxX - minX;
			minX = minX - domain * 0.1;
			maxX = maxX + domain * 0.1;
			var smooth = [];
			for(var x = minX; x<maxX; x += domain * 0.002) {
				coeffs.x = x;
				var pred = code.eval(coeffs);
				smooth.push({x: x, y: pred});
			}

			plotter.setData(data, smooth);
			plotter.draw();
*/
  
}


function parseModel(modelStr) {
  
  if(typeof(modelStr) !== "string") {
    throw new TypeError("parseModel expected parameter 1 (modelStr) to be of type 'String'");
  }
 
  var node = math.parse(modelStr);
  
  // Find the SymbolNodes
  var params = {};
  var hasx = false;
  var hasParams = false;
  var symbols = node.filter(function(node) {
    return node.isSymbolNode;
  });

  symbols.forEach(function(node) {
    if(node.name === 'x') {
      hasx = true;
    }
    else {
      params[node.name] = 0;
      hasParams = true;
    }
  });
  
  if(!hasx) {
    throw new Error("Model does not contain 'x'.");
  }
  if(!hasParams) {
    throw new Error("Model does not contain any parameters.");
  }
  
  return {
    node: node,
    params: params
  };
}

function parseGuesses(lines) {
  if(!lines) {
    return {};
  }
  
  lines = lines.split('\n');
  
  // Get the guess values
  var guess = {};
  
  for(var i=0; i<lines.length; i++) {
    if(lines[i].trim().length === 0) {
      continue;
    }
    var parts = lines[i].split('=');
    if(parts.length !== 2) {
      throw new Error("Guess values must be one value on each line, like this: \"a = 2\"");
    }
    var g = parseFloat(parts[1]);
    if(isNaN(g)) {
      alert("Invalid guess value: " + parts[1]);
      return;
    }
    guess[parts[0].trim()] = g;
  }
  
  return guess;
}
  
  

/*

$(function() {

	



		function doTheThing(fit) {

			// Save the data for later
			localStorage.curveFit_data = $('#data').val();
			localStorage.curveFit_guess = $('#guess').val();
			localStorage.curveFit_form = $('#form').val();

			// Read the data
			var lines = $('#data').val().split('\n');
			if(lines.length === 0) {
				alert("Please enter some data.");
				return;
			}
			var data = [];
			for(var i=0; i<lines.length; i++) {
				if(lines[i].trim().length === 0) {
					continue;
				}
				var xy = lines[i].split(/[\s,]+/);
				if(xy.length < 2) {
					alert("Error, only one value found on line " + (i+1).toString() + ". Please enter two columns.");
					return;
				}
				var xFloat = parseFloat(xy[0]);
				var yFloat = parseFloat(xy[1]);
				if(isNaN(xFloat) || isNaN(yFloat)) {
					continue;
				}
				data.push({x: xFloat, y: yFloat});
			}

			// Parse the form
			var form = $('#form').val();
			if(form.length === 0) {
				alert("Please enter a form of the curve to fit, such as \"a x^2 + b x + c\".");
				return;
			}
      
      

		

		}

	});
*/
  
  module.exports = new easyCurveFitting();