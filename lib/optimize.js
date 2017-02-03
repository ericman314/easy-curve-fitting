//var util = require('util');

/**
 * Optimize guess according to minimize objective function.
 */
module.exports = function(objective, guess) {
	
	// Parameters
	var alpha = 1.0;		// Reflection
	var gamma = 2.0;		// Expansion
	var rho = -0.5;			// Contraction
	var sigma = 0.5;		// Reduction

	// How many variables?
	var n = guess.length;
	
	// Construct the simplex
	var simplex = [];
	for(var i=0; i<n+1; i++) {
		simplex[i] = {x:[]};
		for(var j=0; j<n; j++) {
			simplex[i].x[j] = guess[j] * (1 + (Math.random() - 0.5) * 1e-6) + (Math.random() - 0.5) * 1e-9;
		}
		simplex[i].f = objective(simplex[i].x);
	}
	
	var iter = -1;

	while(iter < 1000) {
	
	  // Step 1: Order vertices
		iter++;
		simplex.sort(function(a, b) { return a.f - b.f; } );
		if(simplex[n].f - simplex[0].f < 1e-14 ) {
			break;
		}

		var diff = 0;
		for(var j=0; j<n; j++) {
			diff += (simplex[n].x[j] - simplex[0].x[j]) * (simplex[n].x[j] - simplex[0].x[j]);
		}
		if(diff < 1e-28) {
			break;
		}

		// Step 2: Compute centroid
		var centroid = [];
		for(var j=0; j<n; j++) {
			centroid[j] = 0;
			for(var i=0; i<n; i++) {		// Iterate only over the first n simplex points (not the last one)
				centroid[j] += simplex[i].x[j];
			}
			centroid[j] /= n;
		}

		// Step 3: Reflection
		var reflected = [];
		for(var j=0; j<n; j++) {
			reflected[j] = centroid[j] + alpha * (centroid[j] - simplex[n].x[j]);
		}
		var fReflected = objective(reflected);
		if (fReflected < simplex[n-1].f && fReflected >= simplex[0].f) {
			// Replace worst point with reflected point
			simplex[n] = {f: fReflected, x:reflected};
			continue;
		}

		// Step 4: Expansion
		if (fReflected < simplex[0].f) {
			var expanded = [];
			for(var j=0; j<n; j++) {
				expanded[j] = centroid[j] + gamma * (centroid[j] - simplex[n].x[j]);
			}
			var fExpanded = objective(expanded);
			if (fExpanded < fReflected) {
				// Replace worst point with expanded point
				simplex[n] = {f: fExpanded, x:expanded};
				continue;
			}
			else {
				// Replace worst point with reflected point
				simplex[n] = {f: fReflected, x:reflected};
				continue;
			}
		}

		// Step 5: Contraction
		var contracted = [];
		for(var j=0; j<n; j++) {
			contracted[j] = centroid[j] + rho * (centroid[j] - simplex[n].x[j]);
		}
		var fContracted = objective(contracted);
		if (fContracted < simplex[n].f) {
			// Replace worst point with contracted point
			simplex[n] = {f: fContracted, x:contracted};
			continue;
		}

		// Step 6: Reduction
		for(var i=1; i<n+1; i++) {
			for(var j=0; j<n; j++) {
				simplex[i].x[j] = simplex[0].x[j] + sigma * (simplex[i].x[j] - simplex[0].x[j]);
			}
			simplex[i].f = objective(simplex[i].x);
		}
	}

	return simplex[0].x;
}

// Generate some random data
/*
var data = [];
for(var i=0; i<100; i++) {
	data[i] = {};
	data[i].x = i * 0.1;
	data[i].y = 2 * data[i].x / (data[i].x + 4);
}

function test(c) {
	var SSE = 0;
	for(var i=0; i<data.length; i++) {
		var x = data[i].x;
		var y = data[i].y;
		var pred = c[0] * x / (x + c[1]) + c[2];
		SSE += (y-pred) * (y-pred);
	}
	return SSE;
}

var guess = [0, 0, 0];

optimize(test, guess);
*/