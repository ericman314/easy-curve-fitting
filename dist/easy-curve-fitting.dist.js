(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],3:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],4:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./support/isBuffer":3,"_process":1,"inherits":2}],5:[function(require,module,exports){
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
    optimized: optimized
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
  
  // Get the guess values
  var guess = {};
  
  for(var i=0; i<lines.length; i++) {
    if(lines[i].trim().length === 0) {
      continue;
    }
    var parts = lines[i].split('=');
    if(parts.length !== 2) {
      throw new ParseError("Guess values must be one value on each line, like this: \"a = 2\"");
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
},{"./math-custom.js":7,"./optimize.js":8}],6:[function(require,module,exports){
curve = require('./easy-curve-fitting.js');

},{"./easy-curve-fitting.js":5}],7:[function(require,module,exports){
var core = require('../node_modules/mathjs/core.js');

var math = core.create();

math.import(require('../node_modules/mathjs/lib/type/number.js'));
math.import(require('../node_modules/mathjs/lib/function/arithmetic'));
math.import(require('../node_modules/mathjs/lib/function/trigonometry'));
math.import(require('../node_modules/mathjs/lib/expression'));

module.exports = math;
},{"../node_modules/mathjs/core.js":9,"../node_modules/mathjs/lib/expression":206,"../node_modules/mathjs/lib/function/arithmetic":257,"../node_modules/mathjs/lib/function/trigonometry":314,"../node_modules/mathjs/lib/type/number.js":342}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
module.exports = require('./lib/core/core');
},{"./lib/core/core":10}],10:[function(require,module,exports){
var isFactory = require('./../utils/object').isFactory;
var deepExtend = require('./../utils/object').deepExtend;
var typedFactory = require('./typed');
var emitter = require('./../utils/emitter');

var importFactory = require('./function/import');
var configFactory = require('./function/config');

/**
 * Math.js core. Creates a new, empty math.js instance
 * @param {Object} [options] Available options:
 *                            {number} epsilon
 *                              Minimum relative difference between two
 *                              compared values, used by all comparison functions.
 *                            {string} matrix
 *                              A string 'Matrix' (default) or 'Array'.
 *                            {string} number
 *                              A string 'number' (default), 'BigNumber', or 'Fraction'
 *                            {number} precision
 *                              The number of significant digits for BigNumbers.
 *                              Not applicable for Numbers.
 *                            {boolean} predictable
 *                              Predictable output type of functions. When true,
 *                              output type depends only on the input types. When
 *                              false (default), output type can vary depending
 *                              on input values. For example `math.sqrt(-2)`
 *                              returns `NaN` when predictable is false, and
 *                              returns `complex('2i')` when true.
 * @returns {Object} Returns a bare-bone math.js instance containing
 *                   functions:
 *                   - `import` to add new functions
 *                   - `config` to change configuration
 *                   - `on`, `off`, `once`, `emit` for events
 */
exports.create = function create (options) {
  // simple test for ES5 support
  if (typeof Object.create !== 'function') {
    throw new Error('ES5 not supported by this JavaScript engine. ' +
    'Please load the es5-shim and es5-sham library for compatibility.');
  }

  // cached factories and instances
  var factories = [];
  var instances = [];

  // create a namespace for the mathjs instance, and attach emitter functions
  var math = emitter.mixin({});
  math.type = {};
  math.expression = {
    transform: Object.create(math)
  };
  math.algebra = {};

  // create a new typed instance
  math.typed = typedFactory.create(math.type);

  // create configuration options. These are private
  var _config = {
    // minimum relative difference between two compared values,
    // used by all comparison functions
    epsilon: 1e-12,

    // type of default matrix output. Choose 'matrix' (default) or 'array'
    matrix: 'Matrix',

    // type of default number output. Choose 'number' (default) 'BigNumber', or 'Fraction
    number: 'number',

    // number of significant digits in BigNumbers
    precision: 64,

    // predictable output type of functions. When true, output type depends only
    // on the input types. When false (default), output type can vary depending
    // on input values. For example `math.sqrt(-2)` returns `NaN` when
    // predictable is false, and returns `complex('2i')` when true.
    predictable: false
  };

  /**
   * Load a function or data type from a factory.
   * If the function or data type already exists, the existing instance is
   * returned.
   * @param {{type: string, name: string, factory: Function}} factory
   * @returns {*}
   */
  function load (factory) {
    if (!isFactory(factory)) {
      throw new Error('Factory object with properties `type`, `name`, and `factory` expected');
    }

    var index = factories.indexOf(factory);
    var instance;
    if (index === -1) {
      // doesn't yet exist
      if (factory.math === true) {
        // pass with math namespace
        instance = factory.factory(math.type, _config, load, math.typed, math);
      }
      else {
        instance = factory.factory(math.type, _config, load, math.typed);
      }

      // append to the cache
      factories.push(factory);
      instances.push(instance);
    }
    else {
      // already existing function, return the cached instance
      instance = instances[index];
    }

    return instance;
  }

  // load the import and config functions
  math['import'] = load(importFactory);
  math['config'] = load(configFactory);

  // apply options
  if (options) {
    math.config(options);
  }

  return math;
};

},{"./../utils/emitter":357,"./../utils/object":362,"./function/config":11,"./function/import":12,"./typed":13}],11:[function(require,module,exports){
'use strict';

var object = require('../../utils/object');

function factory (type, config, load, typed, math) {
  var MATRIX = ['Matrix', 'Array'];                   // valid values for option matrix
  var NUMBER = ['number', 'BigNumber', 'Fraction'];   // valid values for option number

  /**
   * Set configuration options for math.js, and get current options.
   * Will emit a 'config' event, with arguments (curr, prev).
   *
   * Syntax:
   *
   *     math.config(config: Object): Object
   *
   * Examples:
   *
   *     math.config().number;                // outputs 'number'
   *     math.eval('0.4');                    // outputs number 0.4
   *     math.config({number: 'Fraction'});
   *     math.eval('0.4');                    // outputs Fraction 2/5
   *
   * @param {Object} [options] Available options:
   *                            {number} epsilon
   *                              Minimum relative difference between two
   *                              compared values, used by all comparison functions.
   *                            {string} matrix
   *                              A string 'Matrix' (default) or 'Array'.
   *                            {string} number
   *                              A string 'number' (default), 'BigNumber', or 'Fraction'
   *                            {number} precision
   *                              The number of significant digits for BigNumbers.
   *                              Not applicable for Numbers.
   *                            {string} parenthesis
   *                              How to display parentheses in LaTeX and string
   *                              output.
   * @return {Object} Returns the current configuration
   */
  function _config(options) {
    if (options) {
      var prev = object.clone(config);

      // validate some of the options
      validateOption(options, 'matrix', MATRIX);
      validateOption(options, 'number', NUMBER);

      // merge options
      object.deepExtend(config, options);

      var curr = object.clone(config);

      // emit 'config' event
      math.emit('config', curr, prev);

      return curr;
    }
    else {
      return object.clone(config);
    }
  }

  // attach the valid options to the function so they can be extended
  _config.MATRIX = MATRIX;
  _config.NUMBER = NUMBER;

  return _config;
}

/**
 * Test whether an Array contains a specific item.
 * @param {Array.<string>} array
 * @param {string} item
 * @return {boolean}
 */
function contains (array, item) {
  return array.indexOf(item) !== -1;
}

/**
 * Find a string in an array. Case insensitive search
 * @param {Array.<string>} array
 * @param {string} item
 * @return {number} Returns the index when found. Returns -1 when not found
 */
function findIndex (array, item) {
  return array
      .map(function (i) {
        return i.toLowerCase();
      })
      .indexOf(item.toLowerCase());
}

/**
 * Validate an option
 * @param {Object} options         Object with options
 * @param {string} name            Name of the option to validate
 * @param {Array.<string>} values  Array with valid values for this option
 */
function validateOption(options, name, values) {
  if (options[name] !== undefined && !contains(values, options[name])) {
    var index = findIndex(values, options[name]);
    if (index !== -1) {
      // right value, wrong casing
      // TODO: lower case values are deprecated since v3, remove this warning some day.
      console.warn('Warning: Wrong casing for configuration option "' + name + '", should be "' + values[index] + '" instead of "' + options[name] + '".');

      options[name] = values[index]; // change the option to the right casing
    }
    else {
      // unknown value
      console.warn('Warning: Unknown value "' + options[name] + '" for configuration option "' + name + '". Available options: ' + values.map(JSON.stringify).join(', ') + '.');
    }
  }
}

exports.name = 'config';
exports.math = true; // request the math namespace as fifth argument
exports.factory = factory;

},{"../../utils/object":362}],12:[function(require,module,exports){
'use strict';

var lazy = require('../../utils/object').lazy;
var isFactory = require('../../utils/object').isFactory;
var traverse = require('../../utils/object').traverse;
var extend = require('../../utils/object').extend;
var ArgumentsError = require('../../error/ArgumentsError');

function factory (type, config, load, typed, math) {
  /**
   * Import functions from an object or a module
   *
   * Syntax:
   *
   *    math.import(object)
   *    math.import(object, options)
   *
   * Where:
   *
   * - `object: Object`
   *   An object with functions to be imported.
   * - `options: Object` An object with import options. Available options:
   *   - `override: boolean`
   *     If true, existing functions will be overwritten. False by default.
   *   - `silent: boolean`
   *     If true, the function will not throw errors on duplicates or invalid
   *     types. False by default.
   *   - `wrap: boolean`
   *     If true, the functions will be wrapped in a wrapper function
   *     which converts data types like Matrix to primitive data types like Array.
   *     The wrapper is needed when extending math.js with libraries which do not
   *     support these data type. False by default.
   *
   * Examples:
   *
   *    // define new functions and variables
   *    math.import({
   *      myvalue: 42,
   *      hello: function (name) {
   *        return 'hello, ' + name + '!';
   *      }
   *    });
   *
   *    // use the imported function and variable
   *    math.myvalue * 2;               // 84
   *    math.hello('user');             // 'hello, user!'
   *
   *    // import the npm module 'numbers'
   *    // (must be installed first with `npm install numbers`)
   *    math.import(require('numbers'), {wrap: true});
   *
   *    math.fibonacci(7); // returns 13
   *
   * @param {Object | Array} object   Object with functions to be imported.
   * @param {Object} [options]        Import options.
   */
  function math_import(object, options) {
    var num = arguments.length;
    if (num != 1 && num != 2) {
      throw new ArgumentsError('import', num, 1, 2);
    }

    if (!options) {
      options = {};
    }

    if (isFactory(object)) {
      _importFactory(object, options);
    }
    // TODO: allow a typed-function with name too
    else if (Array.isArray(object)) {
      object.forEach(function (entry) {
        math_import(entry, options);
      });
    }
    else if (typeof object === 'object') {
      // a map with functions
      for (var name in object) {
        if (object.hasOwnProperty(name)) {
          var value = object[name];
          if (isSupportedType(value)) {
            _import(name, value, options);
          }
          else if (isFactory(object)) {
            _importFactory(object, options);
          }
          else {
            math_import(value, options);
          }
        }
      }
    }
    else {
      if (!options.silent) {
        throw new TypeError('Factory, Object, or Array expected');
      }
    }
  }

  /**
   * Add a property to the math namespace and create a chain proxy for it.
   * @param {string} name
   * @param {*} value
   * @param {Object} options  See import for a description of the options
   * @private
   */
  function _import(name, value, options) {
    if (options.wrap && typeof value === 'function') {
      // create a wrapper around the function
      value = _wrap(value);
    }

    if (isTypedFunction(math[name]) && isTypedFunction(value)) {
      if (options.override) {
        // give the typed function the right name
        value = typed(name, value.signatures);
      }
      else {
        // merge the existing and typed function
        value = typed(math[name], value);
      }

      math[name] = value;
      _importTransform(name, value);
      math.emit('import', name, function resolver() {
        return value;
      });
      return;
    }

    if (math[name] === undefined || options.override) {
      math[name] = value;
      _importTransform(name, value);
      math.emit('import', name, function resolver() {
        return value;
      });
      return;
    }

    if (!options.silent) {
      throw new Error('Cannot import "' + name + '": already exists');
    }
  }

  function _importTransform (name, value) {
    if (value && typeof value.transform === 'function') {
      math.expression.transform[name] = value.transform;
    }
  }

  /**
   * Create a wrapper a round an function which converts the arguments
   * to their primitive values (like convert a Matrix to Array)
   * @param {Function} fn
   * @return {Function} Returns the wrapped function
   * @private
   */
  function _wrap (fn) {
    var wrapper = function wrapper () {
      var args = [];
      for (var i = 0, len = arguments.length; i < len; i++) {
        var arg = arguments[i];
        args[i] = arg && arg.valueOf();
      }
      return fn.apply(math, args);
    };

    if (fn.transform) {
      wrapper.transform = fn.transform;
    }

    return wrapper;
  }

  /**
   * Import an instance of a factory into math.js
   * @param {{factory: Function, name: string, path: string, math: boolean}} factory
   * @param {Object} options  See import for a description of the options
   * @private
   */
  function _importFactory(factory, options) {
    if (typeof factory.name === 'string') {
      var name = factory.name;
      var namespace = factory.path ? traverse(math, factory.path) : math;
      var existing = namespace.hasOwnProperty(name) ? namespace[name] : undefined;

      var resolver = function () {
        var instance = load(factory);
        if (instance && typeof instance.transform === 'function') {
          throw new Error('Transforms cannot be attached to factory functions. ' +
              'Please create a separate function for it with exports.path="expression.transform"');
        }

        if (isTypedFunction(existing) && isTypedFunction(instance)) {
          if (options.override) {
            // replace the existing typed function (nothing to do)
          }
          else {
            // merge the existing and new typed function
            instance = typed(existing, instance);
          }

          return instance;
        }

        if (existing === undefined || options.override) {
          return instance;
        }

        if (!options.silent) {
          throw new Error('Cannot import "' + name + '": already exists');
        }
      };

      if (factory.lazy !== false) {
        lazy(namespace, name, resolver);
      }
      else {
        namespace[name] = resolver();
      }

      math.emit('import', name, resolver, factory.path);
    }
    else {
      // unnamed factory.
      // no lazy loading
      load(factory);
    }
  }

  /**
   * Check whether given object is a type which can be imported
   * @param {Function | number | string | boolean | null | Unit | Complex} object
   * @return {boolean}
   * @private
   */
  function isSupportedType(object) {
    return typeof object == 'function'
        || typeof object === 'number'
        || typeof object === 'string'
        || typeof object === 'boolean'
        || object === null
        || (object && object.isUnit === true)
        || (object && object.isComplex === true)
        || (object && object.isBigNumber === true)
        || (object && object.isFraction === true)
        || (object && object.isMatrix === true)
        || (object && Array.isArray(object) === true)
  }

  /**
   * Test whether a given thing is a typed-function
   * @param {*} fn
   * @return {boolean} Returns true when `fn` is a typed-function
   */
  function isTypedFunction (fn) {
    return typeof fn === 'function' && typeof fn.signatures === 'object';
  }

  return math_import;
}

exports.math = true; // request access to the math namespace as 5th argument of the factory function
exports.name = 'import';
exports.factory = factory;
exports.lazy = true;

},{"../../error/ArgumentsError":14,"../../utils/object":362}],13:[function(require,module,exports){
var typedFunction = require('typed-function');
var digits = require('./../utils/number').digits;

// returns a new instance of typed-function
var createTyped = function () {
  // initially, return the original instance of typed-function
  // consecutively, return a new instance from typed.create.
  createTyped = typedFunction.create;
  return typedFunction;
};

/**
 * Factory function for creating a new typed instance
 * @param {Object} type   Object with data types like Complex and BigNumber
 * @returns {Function}
 */
exports.create = function create(type) {
  // TODO: typed-function must be able to silently ignore signatures with unknown data types

  // get a new instance of typed-function
  var typed = createTyped();

  // define all types. The order of the types determines in which order function
  // arguments are type-checked (so for performance it's important to put the
  // most used types first).
  typed.types = [
    { name: 'number',          test: function (x) { return typeof x === 'number' } },
    { name: 'Complex',         test: function (x) { return x && x.isComplex } },
    { name: 'BigNumber',       test: function (x) { return x && x.isBigNumber } },
    { name: 'Fraction',        test: function (x) { return x && x.isFraction } },
    { name: 'Unit',            test: function (x) { return x && x.isUnit } },
    { name: 'string',          test: function (x) { return typeof x === 'string' } },
    { name: 'Array',           test: Array.isArray },
    { name: 'Matrix',          test: function (x) { return x && x.isMatrix } },
    { name: 'DenseMatrix',     test: function (x) { return x && x.isDenseMatrix } },
    { name: 'SparseMatrix',    test: function (x) { return x && x.isSparseMatrix } },
    { name: 'Range',           test: function (x) { return x && x.isRange } },
    { name: 'Index',           test: function (x) { return x && x.isIndex } },
    { name: 'boolean',         test: function (x) { return typeof x === 'boolean' } },
    { name: 'ResultSet',       test: function (x) { return x && x.isResultSet } },
    { name: 'Help',            test: function (x) { return x && x.isHelp } },
    { name: 'function',        test: function (x) { return typeof x === 'function'} },
    { name: 'Date',            test: function (x) { return x instanceof Date } },
    { name: 'RegExp',          test: function (x) { return x instanceof RegExp } },
    { name: 'Object',          test: function (x) { return typeof x === 'object' } },
    { name: 'null',            test: function (x) { return x === null } },
    { name: 'undefined',       test: function (x) { return x === undefined } },
    
    { name: 'OperatorNode',    test: function (x) { return x && x.isOperatorNode } },
    { name: 'ConstantNode',    test: function (x) { return x && x.isConstantNode } },
    { name: 'SymbolNode',      test: function (x) { return x && x.isSymbolNode } },
    { name: 'ParenthesisNode', test: function (x) { return x && x.isParenthesisNode } },
    { name: 'FunctionNode',    test: function (x) { return x && x.isFunctionNode } },
    { name: 'FunctionAssignmentNode',    test: function (x) { return x && x.isFunctionAssignmentNode } },
    { name: 'ArrayNode',                 test: function (x) { return x && x.isArrayNode } },
    { name: 'AssignmentNode',            test: function (x) { return x && x.isAssignmentNode } },
    { name: 'BlockNode',                 test: function (x) { return x && x.isBlockNode } },
    { name: 'ConditionalNode',           test: function (x) { return x && x.isConditionalNode } },
    { name: 'IndexNode',                 test: function (x) { return x && x.isIndexNode } },
    { name: 'RangeNode',                 test: function (x) { return x && x.isRangeNode } },
    { name: 'UpdateNode',                test: function (x) { return x && x.isUpdateNode } },
    { name: 'Node',                      test: function (x) { return x && x.isNode } }
  ];

  // TODO: add conversion from BigNumber to number?
  typed.conversions = [
    {
      from: 'number',
      to: 'BigNumber',
      convert: function (x) {
        // note: conversion from number to BigNumber can fail if x has >15 digits
        if (digits(x) > 15) {
          throw new TypeError('Cannot implicitly convert a number with >15 significant digits to BigNumber ' +
          '(value: ' + x + '). ' +
          'Use function bignumber(x) to convert to BigNumber.');
        }
        return new type.BigNumber(x);
      }
    }, {
      from: 'number',
      to: 'Complex',
      convert: function (x) {
        return new type.Complex(x, 0);
      }
    }, {
      from: 'number',
      to: 'string',
      convert: function (x) {
        return x + '';
      }
    }, {
      from: 'BigNumber',
      to: 'Complex',
      convert: function (x) {
        return new type.Complex(x.toNumber(), 0);
      }
    }, {
      from: 'Fraction',
      to: 'BigNumber',
      convert: function (x) {
        throw new TypeError('Cannot implicitly convert a Fraction to BigNumber or vice versa. ' +
            'Use function bignumber(x) to convert to BigNumber or fraction(x) to convert to Fraction.');
      }
    }, {
      from: 'Fraction',
      to: 'Complex',
      convert: function (x) {
        return new type.Complex(x.valueOf(), 0);
      }
    }, {
      from: 'number',
      to: 'Fraction',
      convert: function (x) {
        if (digits(x) > 15) {
          throw new TypeError('Cannot implicitly convert a number with >15 significant digits to Fraction ' +
              '(value: ' + x + '). ' +
              'Use function fraction(x) to convert to Fraction.');
        }
        return new type.Fraction(x);
      }
    }, {
    // FIXME: add conversion from Fraction to number, for example for `sqrt(fraction(1,3))`
    //  from: 'Fraction',
    //  to: 'number',
    //  convert: function (x) {
    //    return x.valueOf();
    //  }
    //}, {
      from: 'string',
      to: 'number',
      convert: function (x) {
        var n = Number(x);
        if (isNaN(n)) {
          throw new Error('Cannot convert "' + x + '" to a number');
        }
        return n;
      }
    }, {
      from: 'boolean',
      to: 'number',
      convert: function (x) {
        return +x;
      }
    }, {
      from: 'boolean',
      to: 'BigNumber',
      convert: function (x) {
        return new type.BigNumber(+x);
      }
    }, {
      from: 'boolean',
      to: 'Fraction',
      convert: function (x) {
        return new type.Fraction(+x);
      }
    }, {
      from: 'boolean',
      to: 'string',
      convert: function (x) {
        return +x;
      }
    }, {
      from: 'null',
      to: 'number',
      convert: function () {
        return 0;
      }
    }, {
      from: 'null',
      to: 'string',
      convert: function () {
        return 'null';
      }
    }, {
      from: 'null',
      to: 'BigNumber',
      convert: function () {
        return new type.BigNumber(0);
      }
    }, {
      from: 'null',
      to: 'Fraction',
      convert: function () {
        return new type.Fraction(0);
      }
    }, {
      from: 'Array',
      to: 'Matrix',
      convert: function (array) {
        // TODO: how to decide on the right type of matrix to create?
        return new type.DenseMatrix(array);
      }
    }, {
      from: 'Matrix',
      to: 'Array',
      convert: function (matrix) {
        return matrix.valueOf();
      }
    }
  ];

  return typed;
};

},{"./../utils/number":361,"typed-function":367}],14:[function(require,module,exports){
'use strict';

/**
 * Create a syntax error with the message:
 *     'Wrong number of arguments in function <fn> (<count> provided, <min>-<max> expected)'
 * @param {string} fn     Function name
 * @param {number} count  Actual argument count
 * @param {number} min    Minimum required argument count
 * @param {number} [max]  Maximum required argument count
 * @extends Error
 */
function ArgumentsError(fn, count, min, max) {
  if (!(this instanceof ArgumentsError)) {
    throw new SyntaxError('Constructor must be called with the new operator');
  }

  this.fn = fn;
  this.count = count;
  this.min = min;
  this.max = max;

  this.message = 'Wrong number of arguments in function ' + fn +
      ' (' + count + ' provided, ' +
      min + ((max != undefined) ? ('-' + max) : '') + ' expected)';

  this.stack = (new Error()).stack;
}

ArgumentsError.prototype = new Error();
ArgumentsError.prototype.constructor = Error;
ArgumentsError.prototype.name = 'ArgumentsError';
ArgumentsError.prototype.isArgumentsError = true;

module.exports = ArgumentsError;

},{}],15:[function(require,module,exports){
'use strict';

/**
 * Create a range error with the message:
 *     'Dimension mismatch (<actual size> != <expected size>)'
 * @param {number | number[]} actual        The actual size
 * @param {number | number[]} expected      The expected size
 * @param {string} [relation='!=']          Optional relation between actual
 *                                          and expected size: '!=', '<', etc.
 * @extends RangeError
 */
function DimensionError(actual, expected, relation) {
  if (!(this instanceof DimensionError)) {
    throw new SyntaxError('Constructor must be called with the new operator');
  }

  this.actual   = actual;
  this.expected = expected;
  this.relation = relation;

  this.message = 'Dimension mismatch (' +
      (Array.isArray(actual) ? ('[' + actual.join(', ') + ']') : actual) +
      ' ' + (this.relation || '!=') + ' ' +
      (Array.isArray(expected) ? ('[' + expected.join(', ') + ']') : expected) +
      ')';

  this.stack = (new Error()).stack;
}

DimensionError.prototype = new RangeError();
DimensionError.prototype.constructor = RangeError;
DimensionError.prototype.name = 'DimensionError';
DimensionError.prototype.isDimensionError = true;

module.exports = DimensionError;

},{}],16:[function(require,module,exports){
'use strict';

/**
 * Create a range error with the message:
 *     'Index out of range (index < min)'
 *     'Index out of range (index < max)'
 *
 * @param {number} index     The actual index
 * @param {number} [min=0]   Minimum index (included)
 * @param {number} [max]     Maximum index (excluded)
 * @extends RangeError
 */
function IndexError(index, min, max) {
  if (!(this instanceof IndexError)) {
    throw new SyntaxError('Constructor must be called with the new operator');
  }

  this.index = index;
  if (arguments.length < 3) {
    this.min = 0;
    this.max = min;
  }
  else {
    this.min = min;
    this.max = max;
  }

  if (this.min !== undefined && this.index < this.min) {
    this.message = 'Index out of range (' + this.index + ' < ' + this.min + ')';
  }
  else if (this.max !== undefined && this.index >= this.max) {
    this.message = 'Index out of range (' + this.index + ' > ' + (this.max - 1) + ')';
  }
  else {
    this.message = 'Index out of range (' + this.index + ')';
  }

  this.stack = (new Error()).stack;
}

IndexError.prototype = new RangeError();
IndexError.prototype.constructor = RangeError;
IndexError.prototype.name = 'IndexError';
IndexError.prototype.isIndexError = true;

module.exports = IndexError;

},{}],17:[function(require,module,exports){
'use strict';

var object = require('../utils/object');
var string = require('../utils/string');

function factory (type, config, load, typed) {
  var parser = load(require('./function/parser'))();

  /**
   * Documentation object
   * @param {Object} doc  Object containing properties:
   *                      {string} name
   *                      {string} category
   *                      {string} description
   *                      {string[]} syntax
   *                      {string[]} examples
   *                      {string[]} seealso
   * @constructor
   */
  function Help(doc) {
    if (!(this instanceof Help)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }

    if (!doc)  throw new Error('Argument "doc" missing');

    this.doc = doc;
  }

  /**
   * Attach type information
   */
  Help.prototype.type = 'Help';
  Help.prototype.isHelp = true;

  /**
   * Generate a string representation of the Help object
   * @return {string} Returns a string
   * @private
   */
  Help.prototype.toString = function () {
    var doc = this.doc || {};
    var desc = '\n';

    if (doc.name) {
      desc += 'Name: ' + doc.name + '\n\n';
    }
    if (doc.category) {
      desc += 'Category: ' + doc.category + '\n\n';
    }
    if (doc.description) {
      desc += 'Description:\n    ' + doc.description + '\n\n';
    }
    if (doc.syntax) {
      desc += 'Syntax:\n    ' + doc.syntax.join('\n    ') + '\n\n';
    }
    if (doc.examples) {
      desc += 'Examples:\n';
      for (var i = 0; i < doc.examples.length; i++) {
        var expr = doc.examples[i];
        desc += '    ' + expr + '\n';

        var res;
        try {
          res = parser.eval(expr);
        }
        catch (e) {
          res = e;
        }
        if (res && !res.isHelp) {
          desc += '        ' + string.format(res, {precision: 14}) + '\n';
        }
      }
      desc += '\n';
    }
    if (doc.seealso) {
      desc += 'See also: ' + doc.seealso.join(', ') + '\n';
    }

    return desc;
  };

  /**
   * Export the help object to JSON
   */
  Help.prototype.toJSON = function () {
    var obj = object.clone(this.doc);
    obj.mathjs = 'Help';
    return obj;
  };

  /**
   * Instantiate a Help object from a JSON object
   * @param {Object} json
   * @returns {Help} Returns a new Help object
   */
  Help.fromJSON = function (json) {
    var doc = {};
    for (var prop in json) {
      if (prop !== 'mathjs') { // ignore mathjs field
        doc[prop] = json[prop];
      }
    }
    return new Help(doc);
  };

  /**
   * Returns a string representation of the Help object
   */
  Help.prototype.valueOf = Help.prototype.toString;

  return Help;
}

exports.name = 'Help';
exports.path = 'type';
exports.factory = factory;

},{"../utils/object":362,"../utils/string":363,"./function/parser":205}],18:[function(require,module,exports){
'use strict';

var extend = require('../utils/object').extend;

function factory (type, config, load, typed, math) {
  var _parse = load(require('./parse'));

  /**
   * @constructor Parser
   * Parser contains methods to evaluate or parse expressions, and has a number
   * of convenience methods to get, set, and remove variables from memory. Parser
   * keeps a scope containing variables in memory, which is used for all
   * evaluations.
   *
   * Methods:
   *    var result = parser.eval(expr);    // evaluate an expression
   *    var value = parser.get(name);      // retrieve a variable from the parser
   *    var values = parser.getAll();      // retrieve all defined variables
   *    parser.set(name, value);           // set a variable in the parser
   *    parser.remove(name);               // clear a variable from the
   *                                       // parsers scope
   *    parser.clear();                    // clear the parsers scope
   *
   * Example usage:
   *    var parser = new Parser();
   *    // Note: there is a convenience method which can be used instead:
   *    // var parser = new math.parser();
   *
   *    // evaluate expressions
   *    parser.eval('sqrt(3^2 + 4^2)');         // 5
   *    parser.eval('sqrt(-4)');                // 2i
   *    parser.eval('2 inch in cm');            // 5.08 cm
   *    parser.eval('cos(45 deg)');             // 0.7071067811865476
   *
   *    // define variables and functions
   *    parser.eval('x = 7 / 2');               // 3.5
   *    parser.eval('x + 3');                   // 6.5
   *    parser.eval('function f(x, y) = x^y');  // f(x, y)
   *    parser.eval('f(2, 3)');                 // 8
   *
   *    // get and set variables and functions
   *    var x = parser.get('x');                // 7
   *    var f = parser.get('f');                // function
   *    var g = f(3, 2);                        // 9
   *    parser.set('h', 500);
   *    var i = parser.eval('h / 2');           // 250
   *    parser.set('hello', function (name) {
   *        return 'hello, ' + name + '!';
   *    });
   *    parser.eval('hello("user")');           // "hello, user!"
   *
   *    // clear defined functions and variables
   *    parser.clear();
   *
   */
  function Parser() {
    if (!(this instanceof Parser)) {
      throw new SyntaxError(
          'Constructor must be called with the new operator');
    }
    this.scope = {};
  }

  /**
   * Attach type information
   */
  Parser.prototype.type = 'Parser';
  Parser.prototype.isParser = true;

  /**
   * Parse an expression and return the parsed function node.
   * The node tree can be compiled via `code = node.compile(math)`,
   * and the compiled code can be executed as `code.eval([scope])`
   * @param {string} expr
   * @return {Node} node
   * @throws {Error}
   */
  Parser.prototype.parse = function (expr) {
    throw new Error('Parser.parse is deprecated. Use math.parse instead.');
  };

  /**
   * Parse and compile an expression, return the compiled javascript code.
   * The node can be evaluated via code.eval([scope])
   * @param {string} expr
   * @return {{eval: function}} code
   * @throws {Error}
   */
  Parser.prototype.compile = function (expr) {
    throw new Error('Parser.compile is deprecated. Use math.compile instead.');
  };

  /**
   * Parse and evaluate the given expression
   * @param {string} expr   A string containing an expression, for example "2+3"
   * @return {*} result     The result, or undefined when the expression was empty
   * @throws {Error}
   */
  Parser.prototype.eval = function (expr) {
    // TODO: validate arguments
    return _parse(expr)
        .compile()
        .eval(this.scope);
  };

  /**
   * Get a variable (a function or variable) by name from the parsers scope.
   * Returns undefined when not found
   * @param {string} name
   * @return {* | undefined} value
   */
  Parser.prototype.get = function (name) {
    // TODO: validate arguments
    return this.scope[name];
  };

  /**
   * Get a map with all defined variables
   * @return {Object} values
   */
  Parser.prototype.getAll = function () {
    return extend({}, this.scope);
  };

  /**
   * Set a symbol (a function or variable) by name from the parsers scope.
   * @param {string} name
   * @param {* | undefined} value
   */
  Parser.prototype.set = function (name, value) {
    // TODO: validate arguments
    return this.scope[name] = value;
  };

  /**
   * Remove a variable from the parsers scope
   * @param {string} name
   */
  Parser.prototype.remove = function (name) {
    // TODO: validate arguments
    delete this.scope[name];
  };

  /**
   * Clear the scope with variables and functions
   */
  Parser.prototype.clear = function () {
    for (var name in this.scope) {
      if (this.scope.hasOwnProperty(name)) {
        delete this.scope[name];
      }
    }
  };

  return Parser;
}

exports.name = 'Parser';
exports.path = 'expression';
exports.factory = factory;
exports.math = true; // requires the math namespace as 5th argument

},{"../utils/object":362,"./parse":228}],19:[function(require,module,exports){
module.exports = {
  'name': 'Infinity',
  'category': 'Constants',
  'syntax': [
    'Infinity'
  ],
  'description': 'Infinity, a number which is larger than the maximum number that can be handled by a floating point number.',
  'examples': [
    'Infinity',
    '1 / 0'
  ],
  'seealso': []
};

},{}],20:[function(require,module,exports){
module.exports = {
  'name': 'LN10',
  'category': 'Constants',
  'syntax': [
    'LN10'
  ],
  'description': 'Returns the natural logarithm of 10, approximately equal to 2.302',
  'examples': [
    'LN10',
    'log(10)'
  ],
  'seealso': []
};

},{}],21:[function(require,module,exports){
module.exports = {
  'name': 'LN2',
  'category': 'Constants',
  'syntax': [
    'LN2'
  ],
  'description': 'Returns the natural logarithm of 2, approximately equal to 0.693',
  'examples': [
    'LN2',
    'log(2)'
  ],
  'seealso': []
};

},{}],22:[function(require,module,exports){
module.exports = {
  'name': 'LOG10E',
  'category': 'Constants',
  'syntax': [
    'LOG10E'
  ],
  'description': 'Returns the base-10 logarithm of E, approximately equal to 0.434',
  'examples': [
    'LOG10E',
    'log(e, 10)'
  ],
  'seealso': []
};

},{}],23:[function(require,module,exports){
module.exports = {
  'name': 'LOG2E',
  'category': 'Constants',
  'syntax': [
    'LOG2E'
  ],
  'description': 'Returns the base-2 logarithm of E, approximately equal to 1.442',
  'examples': [
    'LOG2E',
    'log(e, 2)'
  ],
  'seealso': []
};

},{}],24:[function(require,module,exports){
module.exports = {
  'name': 'NaN',
  'category': 'Constants',
  'syntax': [
    'NaN'
  ],
  'description': 'Not a number',
  'examples': [
    'NaN',
    '0 / 0'
  ],
  'seealso': []
};

},{}],25:[function(require,module,exports){
module.exports = {
  'name': 'SQRT1_2',
  'category': 'Constants',
  'syntax': [
    'SQRT1_2'
  ],
  'description': 'Returns the square root of 1/2, approximately equal to 0.707',
  'examples': [
    'SQRT1_2',
    'sqrt(1/2)'
  ],
  'seealso': []
};

},{}],26:[function(require,module,exports){
module.exports = {
  'name': 'SQRT2',
  'category': 'Constants',
  'syntax': [
    'SQRT2'
  ],
  'description': 'Returns the square root of 2, approximately equal to 1.414',
  'examples': [
    'SQRT2',
    'sqrt(2)'
  ],
  'seealso': []
};

},{}],27:[function(require,module,exports){
module.exports = {
  'name': 'e',
  'category': 'Constants',
  'syntax': [
    'e'
  ],
  'description': 'Euler\'s number, the base of the natural logarithm. Approximately equal to 2.71828',
  'examples': [
    'e',
    'e ^ 2',
    'exp(2)',
    'log(e)'
  ],
  'seealso': ['exp']
};

},{}],28:[function(require,module,exports){
module.exports = {
  'name': 'false',
  'category': 'Constants',
  'syntax': [
    'false'
  ],
  'description': 'Boolean value false',
  'examples': [
    'false'
  ],
  'seealso': ['true']
};

},{}],29:[function(require,module,exports){
module.exports = {
  'name': 'i',
  'category': 'Constants',
  'syntax': [
    'i'
  ],
  'description': 'Imaginary unit, defined as i*i=-1. A complex number is described as a + b*i, where a is the real part, and b is the imaginary part.',
  'examples': [
    'i',
    'i * i',
    'sqrt(-1)'
  ],
  'seealso': []
};

},{}],30:[function(require,module,exports){
module.exports = {
  'name': 'null',
  'category': 'Constants',
  'syntax': [
    'null'
  ],
  'description': 'Value null',
  'examples': [
    'null'
  ],
  'seealso': ['true', 'false']
};

},{}],31:[function(require,module,exports){
module.exports = {
  'name': 'phi',
  'category': 'Constants',
  'syntax': [
    'phi'
  ],
  'description': 'Phi is the golden ratio. Two quantities are in the golden ratio if their ratio is the same as the ratio of their sum to the larger of the two quantities. Phi is defined as `(1 + sqrt(5)) / 2` and is approximately 1.618034...',
  'examples': [
    'tau'
  ],
  'seealso': []
};

},{}],32:[function(require,module,exports){
module.exports = {
  'name': 'pi',
  'category': 'Constants',
  'syntax': [
    'pi'
  ],
  'description': 'The number pi is a mathematical constant that is the ratio of a circle\'s circumference to its diameter, and is approximately equal to 3.14159',
  'examples': [
    'pi',
    'sin(pi/2)'
  ],
  'seealso': ['tau']
};

},{}],33:[function(require,module,exports){
module.exports = {
  'name': 'tau',
  'category': 'Constants',
  'syntax': [
    'tau'
  ],
  'description': 'Tau is the ratio constant of a circle\'s circumference to radius, equal to 2 * pi, approximately 6.2832.',
  'examples': [
    'tau',
    '2 * pi'
  ],
  'seealso': ['pi']
};

},{}],34:[function(require,module,exports){
module.exports = {
  'name': 'true',
  'category': 'Constants',
  'syntax': [
    'true'
  ],
  'description': 'Boolean value true',
  'examples': [
    'true'
  ],
  'seealso': ['false']
};

},{}],35:[function(require,module,exports){
module.exports = {
  'name': 'version',
  'category': 'Constants',
  'syntax': [
    'version'
  ],
  'description': 'A string with the version number of math.js',
  'examples': [
    'version'
  ],
  'seealso': []
};

},{}],36:[function(require,module,exports){
module.exports = {
  'name': 'bignumber',
  'category': 'Construction',
  'syntax': [
    'bignumber(x)'
  ],
  'description':
      'Create a big number from a number or string.',
  'examples': [
    '0.1 + 0.2',
    'bignumber(0.1) + bignumber(0.2)',
    'bignumber("7.2")',
    'bignumber("7.2e500")',
    'bignumber([0.1, 0.2, 0.3])'
  ],
  'seealso': [
    'boolean', 'complex', 'fraction', 'index', 'matrix', 'string', 'unit'
  ]
};

},{}],37:[function(require,module,exports){
module.exports = {
  'name': 'boolean',
  'category': 'Construction',
  'syntax': [
    'x',
    'boolean(x)'
  ],
  'description':
      'Convert a string or number into a boolean.',
  'examples': [
    'boolean(0)',
    'boolean(1)',
    'boolean(3)',
    'boolean("true")',
    'boolean("false")',
    'boolean([1, 0, 1, 1])'
  ],
  'seealso': [
    'bignumber', 'complex', 'index', 'matrix', 'number', 'string', 'unit'
  ]
};

},{}],38:[function(require,module,exports){
module.exports = {
  'name': 'complex',
  'category': 'Construction',
  'syntax': [
    'complex()',
    'complex(re, im)',
    'complex(string)'
  ],
  'description':
      'Create a complex number.',
  'examples': [
    'complex()',
    'complex(2, 3)',
    'complex("7 - 2i")'
  ],
  'seealso': [
    'bignumber', 'boolean', 'index', 'matrix', 'number', 'string', 'unit'
  ]
};

},{}],39:[function(require,module,exports){
module.exports = {
  'name': 'createUnit',
  'category': 'Construction',
  'syntax': [
    'createUnit(definitions)',
    'createUnit(name, definition)'
  ],
  'description':
      'Create a user-defined unit and register it with the Unit type.',
  'examples': [
    'createUnit("foo")',
    'createUnit("knot", {definition: "0.514444444 m/s", aliases: ["knots", "kt", "kts"]})',
    'createUnit("mph", "1 mile/hour")'
  ],
  'seealso': [
    'unit', 'splitUnit'
  ]
};

},{}],40:[function(require,module,exports){
module.exports = {
  'name': 'fraction',
  'category': 'Construction',
  'syntax': [
    'fraction(num)',
    'fraction(num,den)'
  ],
  'description':
    'Create a fraction from a number or from a numerator and denominator.',
  'examples': [
    'fraction(0.125)',
    'fraction(1, 3) + fraction(2, 5)'
  ],
  'seealso': [
    'bignumber', 'boolean', 'complex', 'index', 'matrix', 'string', 'unit'
  ]
};

},{}],41:[function(require,module,exports){
module.exports = {
  'name': 'index',
  'category': 'Construction',
  'syntax': [
    '[start]',
    '[start:end]',
    '[start:step:end]',
    '[start1, start 2, ...]',
    '[start1:end1, start2:end2, ...]',
    '[start1:step1:end1, start2:step2:end2, ...]'
  ],
  'description':
      'Create an index to get or replace a subset of a matrix',
  'examples': [
    '[]',
    '[1, 2, 3]',
    'A = [1, 2, 3; 4, 5, 6]',
    'A[1, :]',
    'A[1, 2] = 50',
    'A[0:2, 0:2] = ones(2, 2)'
  ],
  'seealso': [
    'bignumber', 'boolean', 'complex', 'matrix,', 'number', 'range', 'string', 'unit'
  ]
};

},{}],42:[function(require,module,exports){
module.exports = {
  'name': 'matrix',
  'category': 'Construction',
  'syntax': [
    '[]',
    '[a1, b1, ...; a2, b2, ...]',
    'matrix()',
    'matrix("dense")',
    'matrix([...])'
  ],
  'description':
      'Create a matrix.',
  'examples': [
    '[]',
    '[1, 2, 3]',
    '[1, 2, 3; 4, 5, 6]',
    'matrix()',
    'matrix([3, 4])',
    'matrix([3, 4; 5, 6], "sparse")',
    'matrix([3, 4; 5, 6], "sparse", "number")'
  ],
  'seealso': [
    'bignumber', 'boolean', 'complex', 'index', 'number', 'string', 'unit', 'sparse'
  ]
};

},{}],43:[function(require,module,exports){
module.exports = {
  'name': 'number',
  'category': 'Construction',
  'syntax': [
    'x',
    'number(x)'
  ],
  'description':
      'Create a number or convert a string or boolean into a number.',
  'examples': [
    '2',
    '2e3',
    '4.05',
    'number(2)',
    'number("7.2")',
    'number(true)',
    'number([true, false, true, true])',
    'number("52cm", "m")'
  ],
  'seealso': [
    'bignumber', 'boolean', 'complex', 'fraction', 'index', 'matrix', 'string', 'unit'
  ]
};

},{}],44:[function(require,module,exports){
module.exports = {
  'name': 'sparse',
  'category': 'Construction',
  'syntax': [
    'sparse()',
    'sparse([a1, b1, ...; a1, b2, ...])',
    'sparse([a1, b1, ...; a1, b2, ...], "number")'
  ],
  'description':
  'Create a sparse matrix.',
  'examples': [
    'sparse()',
    'sparse([3, 4; 5, 6])',
    'sparse([3, 0; 5, 0], "number")'
  ],
  'seealso': [
    'bignumber', 'boolean', 'complex', 'index', 'number', 'string', 'unit', 'matrix'
  ]
};

},{}],45:[function(require,module,exports){
module.exports = {
  'name': 'splitUnit',
  'category': 'Construction',
  'syntax': [
    'splitUnit(unit: Unit, parts: Unit[])'
  ],
  'description':
      'Split a unit in an array of units whose sum is equal to the original unit.',
  'examples': [
    'splitUnit(1 m, ["feet", "inch"])'
  ],
  'seealso': [
    'unit', 'createUnit'
  ]
};

},{}],46:[function(require,module,exports){
module.exports = {
  'name': 'string',
  'category': 'Construction',
  'syntax': [
    '"text"',
    'string(x)'
  ],
  'description':
      'Create a string or convert a value to a string',
  'examples': [
    '"Hello World!"',
    'string(4.2)',
    'string(3 + 2i)'
  ],
  'seealso': [
    'bignumber', 'boolean', 'complex', 'index', 'matrix', 'number', 'unit'
  ]
};

},{}],47:[function(require,module,exports){
module.exports = {
  'name': 'unit',
  'category': 'Construction',
  'syntax': [
    'value unit',
    'unit(value, unit)',
    'unit(string)'
  ],
  'description':
      'Create a unit.',
  'examples': [
    '5.5 mm',
    '3 inch',
    'unit(7.1, "kilogram")',
    'unit("23 deg")'
  ],
  'seealso': [
    'bignumber', 'boolean', 'complex', 'index', 'matrix', 'number', 'string'
  ]
};

},{}],48:[function(require,module,exports){
module.exports = {
  'name': 'config',
  'category': 'Core',
  'syntax': [
    'config()',
    'config(options)'
  ],
  'description': 'Get configuration or change configuration.',
  'examples': [
    'config()',
    '1/3 + 1/4',
    'config({number: "Fraction"})',
    '1/3 + 1/4'
  ],
  'seealso': []
};

},{}],49:[function(require,module,exports){
module.exports = {
  'name': 'import',
  'category': 'Core',
  'syntax': [
    'import(functions)',
    'import(functions, options)'
  ],
  'description': 'Import functions or constants from an object.',
  'examples': [
    'import({myFn: f(x)=x^2, myConstant: 32 })',
    'myFn(2)',
    'myConstant'
  ],
  'seealso': []
};

},{}],50:[function(require,module,exports){
module.exports = {
  'name': 'typed',
  'category': 'Core',
  'syntax': [
    'typed(signatures)',
    'typed(name, signatures)'
  ],
  'description': 'Create a typed function.',
  'examples': [
    'double = typed({ "number, number": f(x)=x+x })',
    'double(2)',
    'double("hello")'
  ],
  'seealso': []
};

},{}],51:[function(require,module,exports){
module.exports = {
  'name': 'derivative',
  'category': 'Algebra',
  'syntax': [
    'derivative(expr)',
    'derivative(expr, {simplify: boolean})'
  ],
  'description': 'Takes the derivative of an expression expressed in parser Nodes. The derivative will be taken over the supplied variable in the second parameter. If there are multiple variables in the expression, it will return a partial derivative.',
  'examples': [
    'derivative("2x^3", "x")',
    'derivative("2x^3", "x", {simplify: false})',
    'derivative("2x^2 + 3x + 4", "x")',
    'derivative("sin(2x)", "x")',
    'f = parse("x^2 + x")',
    'x = parse("x")',
    'df = derivative(f, x)',
    'df.eval({x: 3})'
  ],
  'seealso': [
    'simplify', 'parse', 'eval'
  ]
};

},{}],52:[function(require,module,exports){
module.exports = {
  'name': 'lsolve',
  'category': 'Algebra',
  'syntax': [
    'x=lsolve(L, b)'
  ],
  'description':
  'Solves the linear system L * x = b where L is an [n x n] lower triangular matrix and b is a [n] column vector.',
  'examples': [
    'a = [-2, 3; 2, 1]',
    'b = [11, 9]',
    'x = lsolve(a, b)'
  ],
  'seealso': [
    'lup', 'lusolve', 'usolve', 'matrix', 'sparse'
  ]
};

},{}],53:[function(require,module,exports){
module.exports = {
  'name': 'lup',
  'category': 'Algebra',
  'syntax': [
    'lup(m)'
  ],
  'description':
  'Calculate the Matrix LU decomposition with partial pivoting. Matrix A is decomposed in three matrices (L, U, P) where P * A = L * U',
  'examples': [
    'lup([[2, 1], [1, 4]])',
    'lup(matrix([[2, 1], [1, 4]]))',
    'lup(sparse([[2, 1], [1, 4]]))'
  ],
  'seealso': [
    'lusolve', 'lsolve', 'usolve', 'matrix', 'sparse', 'slu'
  ]
};

},{}],54:[function(require,module,exports){
module.exports = {
  'name': 'lusolve',
  'category': 'Algebra',
  'syntax': [
    'x=lusolve(A, b)',
    'x=lusolve(lu, b)'
  ],
  'description': 'Solves the linear system A * x = b where A is an [n x n] matrix and b is a [n] column vector.',
  'examples': [
    'a = [-2, 3; 2, 1]',
    'b = [11, 9]',
    'x = lusolve(a, b)'
  ],
  'seealso': [
    'lup', 'slu', 'lsolve', 'usolve', 'matrix', 'sparse'
  ]
};

},{}],55:[function(require,module,exports){
module.exports = {
  'name': 'simplify',
  'category': 'Algebra',
  'syntax': [
    'simplify(expr)',
    'simplify(expr, rules)'
  ],
  'description': 'Simplify an expression tree.',
  'examples': [
    'simplify("3 + 2 / 4")',
    'simplify("2x + x")',
    'f = parse("x * (x + 2 + x)")',
    'simplified = simplify(f)',
    'simplified.eval({x: 2})'
  ],
  'seealso': [
    'derivative', 'parse', 'eval'
  ]
};

},{}],56:[function(require,module,exports){
module.exports = {
  'name': 'slu',
  'category': 'Algebra',
  'syntax': [
    'slu(A, order, threshold)'
  ],
  'description': 'Calculate the Matrix LU decomposition with full pivoting. Matrix A is decomposed in two matrices (L, U) and two permutation vectors (pinv, q) where P * A * Q = L * U',
  'examples': [
    'slu(sparse([4.5, 0, 3.2, 0; 3.1, 2.9, 0, 0.9; 0, 1.7, 3, 0; 3.5, 0.4, 0, 1]), 1, 0.001)'
  ],
  'seealso': [
    'lusolve', 'lsolve', 'usolve', 'matrix', 'sparse', 'lup'
  ]
};

},{}],57:[function(require,module,exports){
module.exports = {
  'name': 'usolve',
  'category': 'Algebra',
  'syntax': [
    'x=usolve(U, b)'
  ],
  'description':
  'Solves the linear system U * x = b where U is an [n x n] upper triangular matrix and b is a [n] column vector.',
  'examples': [
    'x=usolve(sparse([1, 1, 1, 1; 0, 1, 1, 1; 0, 0, 1, 1; 0, 0, 0, 1]), [1; 2; 3; 4])'
  ],
  'seealso': [
    'lup', 'lusolve', 'lsolve', 'matrix', 'sparse'
  ]
};

},{}],58:[function(require,module,exports){
module.exports = {
  'name': 'abs',
  'category': 'Arithmetic',
  'syntax': [
    'abs(x)'
  ],
  'description': 'Compute the absolute value.',
  'examples': [
    'abs(3.5)',
    'abs(-4.2)'
  ],
  'seealso': ['sign']
};

},{}],59:[function(require,module,exports){
module.exports = {
  'name': 'add',
  'category': 'Operators',
  'syntax': [
    'x + y',
    'add(x, y)'
  ],
  'description': 'Add two values.',
  'examples': [
    'a = 2.1 + 3.6',
    'a - 3.6',
    '3 + 2i',
    '3 cm + 2 inch',
    '"2.3" + "4"'
  ],
  'seealso': [
    'subtract'
  ]
};

},{}],60:[function(require,module,exports){
module.exports = {
  'name': 'cbrt',
  'category': 'Arithmetic',
  'syntax': [
    'cbrt(x)',
    'cbrt(x, allRoots)'
  ],
  'description':
      'Compute the cubic root value. If x = y * y * y, then y is the cubic root of x. When `x` is a number or complex number, an optional second argument `allRoots` can be provided to return all three cubic roots. If not provided, the principal root is returned',
  'examples': [
    'cbrt(64)',
    'cube(4)',
    'cbrt(-8)',
    'cbrt(2 + 3i)',
    'cbrt(8i)',
    'cbrt(8i, true)',
    'cbrt(27 m^3)'
  ],
  'seealso': [
    'square',
    'sqrt',
    'cube',
    'multiply'
  ]
};

},{}],61:[function(require,module,exports){
module.exports = {
  'name': 'ceil',
  'category': 'Arithmetic',
  'syntax': [
    'ceil(x)'
  ],
  'description':
      'Round a value towards plus infinity. If x is complex, both real and imaginary part are rounded towards plus infinity.',
  'examples': [
    'ceil(3.2)',
    'ceil(3.8)',
    'ceil(-4.2)'
  ],
  'seealso': ['floor', 'fix', 'round']
};

},{}],62:[function(require,module,exports){
module.exports = {
  'name': 'cube',
  'category': 'Arithmetic',
  'syntax': [
    'cube(x)'
  ],
  'description': 'Compute the cube of a value. The cube of x is x * x * x.',
  'examples': [
    'cube(2)',
    '2^3',
    '2 * 2 * 2'
  ],
  'seealso': [
    'multiply',
    'square',
    'pow'
  ]
};

},{}],63:[function(require,module,exports){
module.exports = {
  'name': 'divide',
  'category': 'Operators',
  'syntax': [
    'x / y',
    'divide(x, y)'
  ],
  'description': 'Divide two values.',
  'examples': [
    'a = 2 / 3',
    'a * 3',
    '4.5 / 2',
    '3 + 4 / 2',
    '(3 + 4) / 2',
    '18 km / 4.5'
  ],
  'seealso': [
    'multiply'
  ]
};

},{}],64:[function(require,module,exports){
module.exports = {
  'name': 'dotDivide',
  'category': 'Operators',
  'syntax': [
    'x ./ y',
    'dotDivide(x, y)'
  ],
  'description': 'Divide two values element wise.',
  'examples': [
    'a = [1, 2, 3; 4, 5, 6]',
    'b = [2, 1, 1; 3, 2, 5]',
    'a ./ b'
  ],
  'seealso': [
    'multiply',
    'dotMultiply',
    'divide'
  ]
};

},{}],65:[function(require,module,exports){
module.exports = {
  'name': 'dotMultiply',
  'category': 'Operators',
  'syntax': [
    'x .* y',
    'dotMultiply(x, y)'
  ],
  'description': 'Multiply two values element wise.',
  'examples': [
    'a = [1, 2, 3; 4, 5, 6]',
    'b = [2, 1, 1; 3, 2, 5]',
    'a .* b'
  ],
  'seealso': [
    'multiply',
    'divide',
    'dotDivide'
  ]
};

},{}],66:[function(require,module,exports){
module.exports = {
  'name': 'dotpow',
  'category': 'Operators',
  'syntax': [
    'x .^ y',
    'dotpow(x, y)'
  ],
  'description':
      'Calculates the power of x to y element wise.',
  'examples': [
    'a = [1, 2, 3; 4, 5, 6]',
    'a .^ 2'
  ],
  'seealso': [
    'pow'
  ]
};

},{}],67:[function(require,module,exports){
module.exports = {
  'name': 'exp',
  'category': 'Arithmetic',
  'syntax': [
    'exp(x)'
  ],
  'description': 'Calculate the exponent of a value.',
  'examples': [
    'exp(1.3)',
    'e ^ 1.3',
    'log(exp(1.3))',
    'x = 2.4',
    '(exp(i*x) == cos(x) + i*sin(x))   # Euler\'s formula'
  ],
  'seealso': [
    'pow',
    'log'
  ]
};

},{}],68:[function(require,module,exports){
module.exports = {
  'name': 'fix',
  'category': 'Arithmetic',
  'syntax': [
    'fix(x)'
  ],
  'description':
      'Round a value towards zero. If x is complex, both real and imaginary part are rounded towards zero.',
  'examples': [
    'fix(3.2)',
    'fix(3.8)',
    'fix(-4.2)',
    'fix(-4.8)'
  ],
  'seealso': ['ceil', 'floor', 'round']
};

},{}],69:[function(require,module,exports){
module.exports = {
  'name': 'floor',
  'category': 'Arithmetic',
  'syntax': [
    'floor(x)'
  ],
  'description':
      'Round a value towards minus infinity.If x is complex, both real and imaginary part are rounded towards minus infinity.',
  'examples': [
    'floor(3.2)',
    'floor(3.8)',
    'floor(-4.2)'
  ],
  'seealso': ['ceil', 'fix', 'round']
};

},{}],70:[function(require,module,exports){
module.exports = {
  'name': 'gcd',
  'category': 'Arithmetic',
  'syntax': [
    'gcd(a, b)',
    'gcd(a, b, c, ...)'
  ],
  'description': 'Compute the greatest common divisor.',
  'examples': [
    'gcd(8, 12)',
    'gcd(-4, 6)',
    'gcd(25, 15, -10)'
  ],
  'seealso': [ 'lcm', 'xgcd' ]
};

},{}],71:[function(require,module,exports){
module.exports = {
  'name': 'hypot',
  'category': 'Arithmetic',
  'syntax': [
    'hypot(a, b, c, ...)',
    'hypot([a, b, c, ...])'
  ],
  'description': 'Calculate the hypotenusa of a list with values. ',
  'examples': [
    'hypot(3, 4)',
    'sqrt(3^2 + 4^2)',
    'hypot(-2)',
    'hypot([3, 4, 5])'
  ],
  'seealso': [ 'abs', 'norm' ]
};

},{}],72:[function(require,module,exports){
module.exports = {
  'name': 'lcm',
  'category': 'Arithmetic',
  'syntax': [
    'lcm(x, y)'
  ],
  'description': 'Compute the least common multiple.',
  'examples': [
    'lcm(4, 6)',
    'lcm(6, 21)',
    'lcm(6, 21, 5)'
  ],
  'seealso': [ 'gcd' ]
};

},{}],73:[function(require,module,exports){
module.exports = {
  'name': 'log',
  'category': 'Arithmetic',
  'syntax': [
    'log(x)',
    'log(x, base)'
  ],
  'description': 'Compute the logarithm of a value. If no base is provided, the natural logarithm of x is calculated. If base if provided, the logarithm is calculated for the specified base. log(x, base) is defined as log(x) / log(base).',
  'examples': [
    'log(3.5)',
    'a = log(2.4)',
    'exp(a)',
    '10 ^ 4',
    'log(10000, 10)',
    'log(10000) / log(10)',
    'b = log(1024, 2)',
    '2 ^ b'
  ],
  'seealso': [
    'exp',
    'log10'
  ]
};
},{}],74:[function(require,module,exports){
module.exports = {
  'name': 'log10',
  'category': 'Arithmetic',
  'syntax': [
    'log10(x)'
  ],
  'description': 'Compute the 10-base logarithm of a value.',
  'examples': [
    'log10(0.00001)',
    'log10(10000)',
    '10 ^ 4',
    'log(10000) / log(10)',
    'log(10000, 10)'
  ],
  'seealso': [
    'exp',
    'log'
  ]
};

},{}],75:[function(require,module,exports){
module.exports = {
  'name': 'mod',
  'category': 'Operators',
  'syntax': [
    'x % y',
    'x mod y',
    'mod(x, y)'
  ],
  'description':
      'Calculates the modulus, the remainder of an integer division.',
  'examples': [
    '7 % 3',
    '11 % 2',
    '10 mod 4',
    'function isOdd(x) = x % 2',
    'isOdd(2)',
    'isOdd(3)'
  ],
  'seealso': ['divide']
};

},{}],76:[function(require,module,exports){
module.exports = {
  'name': 'multiply',
  'category': 'Operators',
  'syntax': [
    'x * y',
    'multiply(x, y)'
  ],
  'description': 'multiply two values.',
  'examples': [
    'a = 2.1 * 3.4',
    'a / 3.4',
    '2 * 3 + 4',
    '2 * (3 + 4)',
    '3 * 2.1 km'
  ],
  'seealso': [
    'divide'
  ]
};

},{}],77:[function(require,module,exports){
module.exports = {
  'name': 'norm',
  'category': 'Arithmetic',
  'syntax': [
    'norm(x)',
    'norm(x, p)'
  ],
  'description': 'Calculate the norm of a number, vector or matrix.',
  'examples': [
    'abs(-3.5)',
    'norm(-3.5)',
    'norm(3 - 4i))',
    'norm([1, 2, -3], Infinity)',
    'norm([1, 2, -3], -Infinity)',
    'norm([3, 4], 2)',
    'norm([[1, 2], [3, 4]], 1)',
    'norm([[1, 2], [3, 4]], \'inf\')',
    'norm([[1, 2], [3, 4]], \'fro\')'
  ]
};

},{}],78:[function(require,module,exports){
module.exports = {
  'name': 'nthRoot',
  'category': 'Arithmetic',
  'syntax': [
    'nthRoot(a)',
    'nthRoot(a, root)'
  ],
  'description': 'Calculate the nth root of a value. ' +
      'The principal nth root of a positive real number A, ' +
      'is the positive real solution of the equation "x^root = A".',
  'examples': [
    '4 ^ 3',
    'nthRoot(64, 3)',
    'nthRoot(9, 2)',
    'sqrt(9)'
  ],
  'seealso': [
    'sqrt',
    'pow'
  ]
};
},{}],79:[function(require,module,exports){
module.exports = {
  'name': 'pow',
  'category': 'Operators',
  'syntax': [
    'x ^ y',
    'pow(x, y)'
  ],
  'description':
      'Calculates the power of x to y, x^y.',
  'examples': [
    '2^3 = 8',
    '2*2*2',
    '1 + e ^ (pi * i)'
  ],
  'seealso': [ 'multiply' ]
};

},{}],80:[function(require,module,exports){
module.exports = {
  'name': 'round',
  'category': 'Arithmetic',
  'syntax': [
    'round(x)',
    'round(x, n)'
  ],
  'description':
      'round a value towards the nearest integer.If x is complex, both real and imaginary part are rounded towards the nearest integer. When n is specified, the value is rounded to n decimals.',
  'examples': [
    'round(3.2)',
    'round(3.8)',
    'round(-4.2)',
    'round(-4.8)',
    'round(pi, 3)',
    'round(123.45678, 2)'
  ],
  'seealso': ['ceil', 'floor', 'fix']
};

},{}],81:[function(require,module,exports){
module.exports = {
  'name': 'sign',
  'category': 'Arithmetic',
  'syntax': [
    'sign(x)'
  ],
  'description':
      'Compute the sign of a value. The sign of a value x is 1 when x>1, -1 when x<0, and 0 when x=0.',
  'examples': [
    'sign(3.5)',
    'sign(-4.2)',
    'sign(0)'
  ],
  'seealso': [
    'abs'
  ]
};

},{}],82:[function(require,module,exports){
module.exports = {
  'name': 'sqrt',
  'category': 'Arithmetic',
  'syntax': [
    'sqrt(x)'
  ],
  'description':
      'Compute the square root value. If x = y * y, then y is the square root of x.',
  'examples': [
    'sqrt(25)',
    '5 * 5',
    'sqrt(-1)'
  ],
  'seealso': [
    'square',
    'multiply'
  ]
};

},{}],83:[function(require,module,exports){
module.exports = {
  'name': 'square',
  'category': 'Arithmetic',
  'syntax': [
    'square(x)'
  ],
  'description':
      'Compute the square of a value. The square of x is x * x.',
  'examples': [
    'square(3)',
    'sqrt(9)',
    '3^2',
    '3 * 3'
  ],
  'seealso': [
    'multiply',
    'pow',
    'sqrt',
    'cube'
  ]
};

},{}],84:[function(require,module,exports){
module.exports = {
  'name': 'subtract',
  'category': 'Operators',
  'syntax': [
    'x - y',
    'subtract(x, y)'
  ],
  'description': 'subtract two values.',
  'examples': [
    'a = 5.3 - 2',
    'a + 2',
    '2/3 - 1/6',
    '2 * 3 - 3',
    '2.1 km - 500m'
  ],
  'seealso': [
    'add'
  ]
};

},{}],85:[function(require,module,exports){
module.exports = {
  'name': 'unaryMinus',
  'category': 'Operators',
  'syntax': [
    '-x',
    'unaryMinus(x)'
  ],
  'description':
      'Inverse the sign of a value. Converts booleans and strings to numbers.',
  'examples': [
    '-4.5',
    '-(-5.6)',
    '-"22"'
  ],
  'seealso': [
    'add', 'subtract', 'unaryPlus'
  ]
};

},{}],86:[function(require,module,exports){
module.exports = {
  'name': 'unaryPlus',
  'category': 'Operators',
  'syntax': [
    '+x',
    'unaryPlus(x)'
  ],
  'description':
      'Converts booleans and strings to numbers.',
  'examples': [
    '+true',
    '+"2"'
  ],
  'seealso': [
    'add', 'subtract', 'unaryMinus'
  ]
};

},{}],87:[function(require,module,exports){
module.exports = {
  'name': 'xgcd',
  'category': 'Arithmetic',
  'syntax': [
    'xgcd(a, b)'
  ],
  'description': 'Calculate the extended greatest common divisor for two values',
  'examples': [
    'xgcd(8, 12)',
    'gcd(8, 12)',
    'xgcd(36163, 21199)'
  ],
  'seealso': [ 'gcd', 'lcm' ]
};

},{}],88:[function(require,module,exports){
module.exports = {
  'name': 'bitAnd',
  'category': 'Bitwise',
  'syntax': [
    'x & y',
    'bitAnd(x, y)'
  ],
  'description': 'Bitwise AND operation. Performs the logical AND operation on each pair of the corresponding bits of the two given values by multiplying them. If both bits in the compared position are 1, the bit in the resulting binary representation is 1, otherwise, the result is 0',
  'examples': [
    '5 & 3',
    'bitAnd(53, 131)',
    '[1, 12, 31] & 42'
  ],
  'seealso': [
    'bitNot', 'bitOr', 'bitXor', 'leftShift', 'rightArithShift', 'rightLogShift'
  ]
};

},{}],89:[function(require,module,exports){
module.exports = {
  'name': 'bitNot',
  'category': 'Bitwise',
  'syntax': [
    '~x',
    'bitNot(x)'
  ],
  'description': 'Bitwise NOT operation. Performs a logical negation on each bit of the given value. Bits that are 0 become 1, and those that are 1 become 0.',
  'examples': [
    '~1',
    '~2',
    'bitNot([2, -3, 4])'
  ],
  'seealso': [
    'bitAnd', 'bitOr', 'bitXor', 'leftShift', 'rightArithShift', 'rightLogShift'
  ]
};

},{}],90:[function(require,module,exports){
module.exports = {
  'name': 'bitOr',
  'category': 'Bitwise',
  'syntax': [
    'x | y',
    'bitOr(x, y)'
  ],
  'description': 'Bitwise OR operation. Performs the logical inclusive OR operation on each pair of corresponding bits of the two given values. The result in each position is 1 if the first bit is 1 or the second bit is 1 or both bits are 1, otherwise, the result is 0.',
  'examples': [
    '5 | 3',
    'bitOr([1, 2, 3], 4)'
  ],
  'seealso': [
    'bitAnd', 'bitNot', 'bitXor', 'leftShift', 'rightArithShift', 'rightLogShift'
  ]
};

},{}],91:[function(require,module,exports){
module.exports = {
  'name': 'bitXor',
  'category': 'Bitwise',
  'syntax': [
    'bitXor(x, y)'
  ],
  'description': 'Bitwise XOR operation, exclusive OR. Performs the logical exclusive OR operation on each pair of corresponding bits of the two given values. The result in each position is 1 if only the first bit is 1 or only the second bit is 1, but will be 0 if both are 0 or both are 1.',
  'examples': [
    'bitOr(1, 2)',
    'bitXor([2, 3, 4], 4)'
  ],
  'seealso': [
    'bitAnd', 'bitNot', 'bitOr', 'leftShift', 'rightArithShift', 'rightLogShift'
  ]
};

},{}],92:[function(require,module,exports){
module.exports = {
  'name': 'leftShift',
  'category': 'Bitwise',
  'syntax': [
    'x << y',
    'leftShift(x, y)'
  ],
  'description': 'Bitwise left logical shift of a value x by y number of bits.',
  'examples': [
    '4 << 1',
    '8 >> 1'
  ],
  'seealso': [
    'bitAnd', 'bitNot', 'bitOr', 'bitXor', 'rightArithShift', 'rightLogShift'
  ]
};

},{}],93:[function(require,module,exports){
module.exports = {
  'name': 'rightArithShift',
  'category': 'Bitwise',
  'syntax': [
    'x >> y',
    'leftShift(x, y)'
  ],
  'description': 'Bitwise right arithmetic shift of a value x by y number of bits.',
  'examples': [
    '8 >> 1',
    '4 << 1',
    '-12 >> 2'
  ],
  'seealso': [
    'bitAnd', 'bitNot', 'bitOr', 'bitXor', 'leftShift', 'rightLogShift'
  ]
};

},{}],94:[function(require,module,exports){
module.exports = {
  'name': 'rightLogShift',
  'category': 'Bitwise',
  'syntax': [
    'x >> y',
    'leftShift(x, y)'
  ],
  'description': 'Bitwise right logical shift of a value x by y number of bits.',
  'examples': [
    '8 >>> 1',
    '4 << 1',
    '-12 >>> 2'
  ],
  'seealso': [
    'bitAnd', 'bitNot', 'bitOr', 'bitXor', 'leftShift', 'rightArithShift'
  ]
};

},{}],95:[function(require,module,exports){
module.exports = {
  'name': 'bellNumbers',
  'category': 'Combinatorics',
  'syntax': [
    'bellNumbers(n)'
  ],
  'description': 'The Bell Numbers count the number of partitions of a set. A partition is a pairwise disjoint subset of S whose union is S. `bellNumbers` only takes integer arguments. The following condition must be enforced: n >= 0.',
  'examples': [
    'bellNumbers(3)',
    'bellNumbers(8)'
  ],
  'seealso': ['stirlingS2']
};
},{}],96:[function(require,module,exports){
module.exports = {
  'name': 'catalan',
  'category': 'Combinatorics',
  'syntax': [
    'catalan(n)'
  ],
  'description': 'The Catalan Numbers enumerate combinatorial structures of many different types. catalan only takes integer arguments. The following condition must be enforced: n >= 0.',
  'examples': [
    'catalan(3)',
    'catalan(8)'
  ],
  'seealso': ['bellNumbers']
};
},{}],97:[function(require,module,exports){
module.exports = {
  'name': 'composition',
  'category': 'Combinatorics',
  'syntax': [
    'composition(n, k)'
  ],
  'description': 'The composition counts of n into k parts. composition only takes integer arguments. The following condition must be enforced: k <= n.',
  'examples': [
    'composition(5, 3)'
  ],
  'seealso': ['combinations']
};
},{}],98:[function(require,module,exports){
module.exports = {
  'name': 'stirlingS2',
  'category': 'Combinatorics',
  'syntax': [
    'stirlingS2(n, k)'
  ],
  'description': 'he Stirling numbers of the second kind, counts the number of ways to partition a set of n labelled objects into k nonempty unlabelled subsets. `stirlingS2` only takes integer arguments. The following condition must be enforced: k <= n. If n = k or k = 1, then s(n,k) = 1.',
  'examples': [
    'stirlingS2(5, 3)'
  ],
  'seealso': ['bellNumbers']
};

},{}],99:[function(require,module,exports){
module.exports = {
  'name': 'arg',
  'category': 'Complex',
  'syntax': [
    'arg(x)'
  ],
  'description':
      'Compute the argument of a complex value. If x = a+bi, the argument is computed as atan2(b, a).',
  'examples': [
    'arg(2 + 2i)',
    'atan2(3, 2)',
    'arg(2 + 3i)'
  ],
  'seealso': [
    're',
    'im',
    'conj',
    'abs'
  ]
};

},{}],100:[function(require,module,exports){
module.exports = {
  'name': 'conj',
  'category': 'Complex',
  'syntax': [
    'conj(x)'
  ],
  'description':
      'Compute the complex conjugate of a complex value. If x = a+bi, the complex conjugate is a-bi.',
  'examples': [
    'conj(2 + 3i)',
    'conj(2 - 3i)',
    'conj(-5.2i)'
  ],
  'seealso': [
    're',
    'im',
    'abs',
    'arg'
  ]
};

},{}],101:[function(require,module,exports){
module.exports = {
  'name': 'im',
  'category': 'Complex',
  'syntax': [
    'im(x)'
  ],
  'description': 'Get the imaginary part of a complex number.',
  'examples': [
    'im(2 + 3i)',
    're(2 + 3i)',
    'im(-5.2i)',
    'im(2.4)'
  ],
  'seealso': [
    're',
    'conj',
    'abs',
    'arg'
  ]
};

},{}],102:[function(require,module,exports){
module.exports = {
  'name': 're',
  'category': 'Complex',
  'syntax': [
    're(x)'
  ],
  'description': 'Get the real part of a complex number.',
  'examples': [
    're(2 + 3i)',
    'im(2 + 3i)',
    're(-5.2i)',
    're(2.4)'
  ],
  'seealso': [
    'im',
    'conj',
    'abs',
    'arg'
  ]
};

},{}],103:[function(require,module,exports){
module.exports = {
  'name': 'eval',
  'category': 'Expression',
  'syntax': [
    'eval(expression)',
    'eval([expr1, expr2, expr3, ...])'
  ],
  'description': 'Evaluate an expression or an array with expressions.',
  'examples': [
    'eval("2 + 3")',
    'eval("sqrt(" + 4 + ")")'
  ],
  'seealso': []
};

},{}],104:[function(require,module,exports){
module.exports = {
  'name': 'help',
  'category': 'Expression',
  'syntax': [
    'help(object)',
    'help(string)'
  ],
  'description': 'Display documentation on a function or data type.',
  'examples': [
    'help(sqrt)',
    'help("complex")'
  ],
  'seealso': []
};

},{}],105:[function(require,module,exports){
module.exports = {
  'name': 'distance',
  'category': 'Geometry',
  'syntax': [
    'distance([x1, y1], [x2, y2])',
    'distance([[x1, y1], [x2, y2])'
  ],
  'description': 'Calculates the Euclidean distance between two points.',
  'examples': [
    'distance([0,0], [4,4])',
    'distance([[0,0], [4,4]])'
  ],
  'seealso': []
};

},{}],106:[function(require,module,exports){
module.exports = {
  'name': 'intersect',
  'category': 'Geometry',
  'syntax': [
    'intersect(expr1, expr2, expr3, expr4)',
    'intersect(expr1, expr2, expr3)'
  ],
  'description': 'Computes the intersection point of lines and/or planes.',
  'examples': [
    'intersect([0, 0], [10, 10], [10, 0], [0, 10])',
    'intersect([1, 0, 1],  [4, -2, 2], [1, 1, 1, 6])'
  ],
  'seealso': []
};

},{}],107:[function(require,module,exports){
module.exports = {
  'name': 'and',
  'category': 'Logical',
  'syntax': [
    'x and y',
    'and(x, y)'
  ],
  'description': 'Logical and. Test whether two values are both defined with a nonzero/nonempty value.',
  'examples': [
    'true and false',
    'true and true',
    '2 and 4'
  ],
  'seealso': [
    'not', 'or', 'xor'
  ]
};

},{}],108:[function(require,module,exports){
module.exports = {
  'name': 'not',
  'category': 'Logical',
  'syntax': [
    'not x',
    'not(x)'
  ],
  'description': 'Logical not. Flips the boolean value of given argument.',
  'examples': [
    'not true',
    'not false',
    'not 2',
    'not 0'
  ],
  'seealso': [
    'and', 'or', 'xor'
  ]
};

},{}],109:[function(require,module,exports){
module.exports = {
  'name': 'or',
  'category': 'Logical',
  'syntax': [
    'x or y',
    'or(x, y)'
  ],
  'description': 'Logical or. Test if at least one value is defined with a nonzero/nonempty value.',
  'examples': [
    'true or false',
    'false or false',
    '0 or 4'
  ],
  'seealso': [
    'not', 'and', 'xor'
  ]
};

},{}],110:[function(require,module,exports){
module.exports = {
  'name': 'xor',
  'category': 'Logical',
  'syntax': [
    'x or y',
    'or(x, y)'
  ],
  'description': 'Logical exclusive or, xor. Test whether one and only one value is defined with a nonzero/nonempty value.',
  'examples': [
    'true xor false',
    'false xor false',
    'true xor true',
    '0 or 4'
  ],
  'seealso': [
    'not', 'and', 'or'
  ]
};

},{}],111:[function(require,module,exports){
module.exports = {
  'name': 'concat',
  'category': 'Matrix',
  'syntax': [
    'concat(A, B, C, ...)',
    'concat(A, B, C, ..., dim)'
  ],
  'description': 'Concatenate matrices. By default, the matrices are concatenated by the last dimension. The dimension on which to concatenate can be provided as last argument.',
  'examples': [
    'A = [1, 2; 5, 6]',
    'B = [3, 4; 7, 8]',
    'concat(A, B)',
    'concat(A, B, 1)',
    'concat(A, B, 2)'
  ],
  'seealso': [
    'det', 'diag', 'eye', 'inv', 'ones', 'range', 'size', 'squeeze', 'subset', 'trace', 'transpose', 'zeros'
  ]
};

},{}],112:[function(require,module,exports){
module.exports = {
  'name': 'cross',
  'category': 'Matrix',
  'syntax': [
    'cross(A, B)'
  ],
  'description': 'Calculate the cross product for two vectors in three dimensional space.',
  'examples': [
    'cross([1, 1, 0],  [0, 1, 1])',
    'cross([3, -3, 1], [4, 9, 2])',
    'cross([2, 3, 4],  [5, 6, 7])'
  ],
  'seealso': [
    'multiply',
    'dot'
  ]
};

},{}],113:[function(require,module,exports){
module.exports = {
  'name': 'det',
  'category': 'Matrix',
  'syntax': [
    'det(x)'
  ],
  'description': 'Calculate the determinant of a matrix',
  'examples': [
    'det([1, 2; 3, 4])',
    'det([-2, 2, 3; -1, 1, 3; 2, 0, -1])'
  ],
  'seealso': [
    'concat', 'diag', 'eye', 'inv', 'ones', 'range', 'size', 'squeeze', 'subset', 'trace', 'transpose', 'zeros'
  ]
};

},{}],114:[function(require,module,exports){
module.exports = {
  'name': 'diag',
  'category': 'Matrix',
  'syntax': [
    'diag(x)',
    'diag(x, k)'
  ],
  'description': 'Create a diagonal matrix or retrieve the diagonal of a matrix. When x is a vector, a matrix with the vector values on the diagonal will be returned. When x is a matrix, a vector with the diagonal values of the matrix is returned. When k is provided, the k-th diagonal will be filled in or retrieved, if k is positive, the values are placed on the super diagonal. When k is negative, the values are placed on the sub diagonal.',
  'examples': [
    'diag(1:3)',
    'diag(1:3, 1)',
    'a = [1, 2, 3; 4, 5, 6; 7, 8, 9]',
    'diag(a)'
  ],
  'seealso': [
    'concat', 'det', 'eye', 'inv', 'ones', 'range', 'size', 'squeeze', 'subset', 'trace', 'transpose', 'zeros'
  ]
};

},{}],115:[function(require,module,exports){
module.exports = {
  'name': 'dot',
  'category': 'Matrix',
  'syntax': [
    'dot(A, B)'
  ],
  'description': 'Calculate the dot product of two vectors. ' +
      'The dot product of A = [a1, a2, a3, ..., an] and B = [b1, b2, b3, ..., bn] ' +
      'is defined as dot(A, B) = a1 * b1 + a2 * b2 + a3 * b3 + ... + an * bn',
  'examples': [
    'dot([2, 4, 1], [2, 2, 3])',
    '[2, 4, 1] * [2, 2, 3]'
  ],
  'seealso': [
    'multiply',
    'cross'
  ]
};

},{}],116:[function(require,module,exports){
module.exports = {
  'name': 'eye',
  'category': 'Matrix',
  'syntax': [
    'eye(n)',
    'eye(m, n)',
    'eye([m, n])',
    'eye'
  ],
  'description': 'Returns the identity matrix with size m-by-n. The matrix has ones on the diagonal and zeros elsewhere.',
  'examples': [
    'eye(3)',
    'eye(3, 5)',
    'a = [1, 2, 3; 4, 5, 6]',
    'eye(size(a))'
  ],
  'seealso': [
    'concat', 'det', 'diag', 'inv', 'ones', 'range', 'size', 'squeeze', 'subset', 'trace', 'transpose', 'zeros'
  ]
};

},{}],117:[function(require,module,exports){
module.exports = {
  'name': 'filter',
  'category': 'Matrix',
  'syntax': [
    'filter(x, test)'
  ],
  'description': 'Filter items in a matrix.',
  'examples': [
    'isPositive(x) = x > 0',
    'filter([6, -2, -1, 4, 3], isPositive)',
    'filter([6, -2, 0, 1, 0], x != 0)'
  ],
  'seealso': ['sort', 'map', 'forEach']
};

},{}],118:[function(require,module,exports){
module.exports = {
  'name': 'flatten',
  'category': 'Matrix',
  'syntax': [
    'flatten(x)'
  ],
  'description': 'Flatten a multi dimensional matrix into a single dimensional matrix.',
  'examples': [
    'a = [1, 2, 3; 4, 5, 6]',
    'size(a)',
    'b = flatten(a)',
    'size(b)'
  ],
  'seealso': [
    'concat', 'resize', 'size', 'squeeze'
  ]
};

},{}],119:[function(require,module,exports){
module.exports = {
  'name': 'forEach',
  'category': 'Matrix',
  'syntax': [
    'forEach(x, callback)'
  ],
  'description': 'Iterates over all elements of a matrix/array, and executes the given callback function.',
  'examples': [
    'forEach([1, 2, 3], function(val) { console.log(val) })'
  ],
  'seealso': ['map', 'sort', 'filter']
};

},{}],120:[function(require,module,exports){
module.exports = {
  'name': 'inv',
  'category': 'Matrix',
  'syntax': [
    'inv(x)'
  ],
  'description': 'Calculate the inverse of a matrix',
  'examples': [
    'inv([1, 2; 3, 4])',
    'inv(4)',
    '1 / 4'
  ],
  'seealso': [
    'concat', 'det', 'diag', 'eye', 'ones', 'range', 'size', 'squeeze', 'subset', 'trace', 'transpose', 'zeros'
  ]
};

},{}],121:[function(require,module,exports){
module.exports = {
  'name': 'kron',
  'category': 'Matrix',
  'syntax': [
    'math.kron(x, y)'
  ],
  'description': 'Calculates the kronecker product of 2 matrices or vectors.',
  'examples': [
    'kron([[1, 0], [0, 1]], [[1, 2], [3, 4]])',
    'kron([1,1], [2,3,4])'
  ],
  'seealso': [
    'multiply', 'dot', 'cross'
  ]
};

},{}],122:[function(require,module,exports){
module.exports = {
  'name': 'map',
  'category': 'Matrix',
  'syntax': [
    'map(x, callback)'
  ],
  'description': 'Create a new matrix or array with the results of the callback function executed on each entry of the matrix/array.',
  'examples': [
    'map([1, 2, 3], function(val) { return value * value })'
  ],
  'seealso': ['filter', 'forEach']
};

},{}],123:[function(require,module,exports){
module.exports = {
  'name': 'ones',
  'category': 'Matrix',
  'syntax': [
    'ones(m)',
    'ones(m, n)',
    'ones(m, n, p, ...)',
    'ones([m])',
    'ones([m, n])',
    'ones([m, n, p, ...])',
    'ones'
  ],
  'description': 'Create a matrix containing ones.',
  'examples': [
    'ones(3)',
    'ones(3, 5)',
    'ones([2,3]) * 4.5',
    'a = [1, 2, 3; 4, 5, 6]',
    'ones(size(a))'
  ],
  'seealso': [
    'concat', 'det', 'diag', 'eye', 'inv', 'range', 'size', 'squeeze', 'subset', 'trace', 'transpose', 'zeros'
  ]
};

},{}],124:[function(require,module,exports){
module.exports = {
  'name': 'partitionSelect',
  'category': 'Matrix',
  'syntax': [
    'partitionSelect(x, k)',
    'partitionSelect(x, k, compare)'
  ],
  'description': 'Partition-based selection of an array or 1D matrix. Will find the kth smallest value, and mutates the input array. Uses Quickselect.',
  'examples': [
    'partitionSelect([5, 10, 1], 2)',
    'partitionSelect(["C", "B", "A", "D"], 1)'
  ],
  'seealso': ['sort']
};

},{}],125:[function(require,module,exports){
module.exports = {
  'name': 'range',
  'category': 'Type',
  'syntax': [
    'start:end',
    'start:step:end',
    'range(start, end)',
    'range(start, end, step)',
    'range(string)'
  ],
  'description':
      'Create a range. Lower bound of the range is included, upper bound is excluded.',
  'examples': [
    '1:5',
    '3:-1:-3',
    'range(3, 7)',
    'range(0, 12, 2)',
    'range("4:10")',
    'a = [1, 2, 3, 4; 5, 6, 7, 8]',
    'a[1:2, 1:2]'
  ],
  'seealso': [
    'concat', 'det', 'diag', 'eye', 'inv', 'ones', 'size', 'squeeze', 'subset', 'trace', 'transpose', 'zeros'
  ]
};

},{}],126:[function(require,module,exports){
module.exports = {
  'name': 'resize',
  'category': 'Matrix',
  'syntax': [
    'resize(x, size)',
    'resize(x, size, defaultValue)'
  ],
  'description': 'Resize a matrix.',
  'examples': [
    'resize([1,2,3,4,5], [3])',
    'resize([1,2,3], [5])',
    'resize([1,2,3], [5], -1)',
    'resize(2, [2, 3])',
    'resize("hello", [8], "!")'
  ],
  'seealso': [
    'size', 'subset', 'squeeze'
  ]
};

},{}],127:[function(require,module,exports){
module.exports = {
  'name': 'size',
  'category': 'Matrix',
  'syntax': [
    'size(x)'
  ],
  'description': 'Calculate the size of a matrix.',
  'examples': [
    'size(2.3)',
    'size("hello world")',
    'a = [1, 2; 3, 4; 5, 6]',
    'size(a)',
    'size(1:6)'
  ],
  'seealso': [
    'concat', 'det', 'diag', 'eye', 'inv', 'ones', 'range', 'squeeze', 'subset', 'trace', 'transpose', 'zeros'
  ]
};

},{}],128:[function(require,module,exports){
module.exports = {
  'name': 'sort',
  'category': 'Matrix',
  'syntax': [
    'sort(x)',
    'sort(x, compare)'
  ],
  'description': 'Sort the items in a matrix. Compare can be a string "asc" or "desc", or a custom sort function.',
  'examples': [
    'sort([5, 10, 1])',
    'sort(["C", "B", "A", "D"])',
    'sortByLength(a, b) = size(a)[1] - size(b)[1]',
    'sort(["Langdon", "Tom", "Sara"], sortByLength)'
  ],
  'seealso': ['map', 'filter', 'forEach']
};

},{}],129:[function(require,module,exports){
module.exports = {
  'name': 'squeeze',
  'category': 'Matrix',
  'syntax': [
    'squeeze(x)'
  ],
  'description': 'Remove inner and outer singleton dimensions from a matrix.',
  'examples': [
    'a = zeros(3,2,1)',
    'size(squeeze(a))',
    'b = zeros(1,1,3)',
    'size(squeeze(b))'
  ],
  'seealso': [
    'concat', 'det', 'diag', 'eye', 'inv', 'ones', 'range', 'size', 'subset', 'trace', 'transpose', 'zeros'
  ]
};

},{}],130:[function(require,module,exports){
module.exports = {
  'name': 'subset',
  'category': 'Matrix',
  'syntax': [
    'value(index)',
    'value(index) = replacement',
    'subset(value, [index])',
    'subset(value, [index], replacement)'
  ],
  'description': 'Get or set a subset of a matrix or string. ' +
      'Indexes are one-based. ' +
      'Both the ranges lower-bound and upper-bound are included.',
  'examples': [
    'd = [1, 2; 3, 4]',
    'e = []',
    'e[1, 1:2] = [5, 6]',
    'e[2, :] = [7, 8]',
    'f = d * e',
    'f[2, 1]',
    'f[:, 1]'
  ],
  'seealso': [
    'concat', 'det', 'diag', 'eye', 'inv', 'ones', 'range', 'size', 'squeeze', 'trace', 'transpose', 'zeros'
  ]
};

},{}],131:[function(require,module,exports){
module.exports = {
  'name': 'trace',
  'category': 'Matrix',
  'syntax': [
    'trace(A)'
  ],
  'description': 'Calculate the trace of a matrix: the sum of the elements on the main diagonal of a square matrix.',
  'examples': [
    'A = [1, 2, 3; -1, 2, 3; 2, 0, 3]',
    'trace(A)'
  ],
  'seealso': [
    'concat', 'det', 'diag', 'eye', 'inv', 'ones', 'range', 'size', 'squeeze', 'subset', 'transpose', 'zeros'
  ]
};

},{}],132:[function(require,module,exports){
module.exports = {
  'name': 'transpose',
  'category': 'Matrix',
  'syntax': [
    'x\'',
    'transpose(x)'
  ],
  'description': 'Transpose a matrix',
  'examples': [
    'a = [1, 2, 3; 4, 5, 6]',
    'a\'',
    'transpose(a)'
  ],
  'seealso': [
    'concat', 'det', 'diag', 'eye', 'inv', 'ones', 'range', 'size', 'squeeze', 'subset', 'trace', 'zeros'
  ]
};

},{}],133:[function(require,module,exports){
module.exports = {
  'name': 'zeros',
  'category': 'Matrix',
  'syntax': [
    'zeros(m)',
    'zeros(m, n)',
    'zeros(m, n, p, ...)',
    'zeros([m])',
    'zeros([m, n])',
    'zeros([m, n, p, ...])',
    'zeros'
  ],
  'description': 'Create a matrix containing zeros.',
  'examples': [
    'zeros(3)',
    'zeros(3, 5)',
    'a = [1, 2, 3; 4, 5, 6]',
    'zeros(size(a))'
  ],
  'seealso': [
    'concat', 'det', 'diag', 'eye', 'inv', 'ones', 'range', 'size', 'squeeze', 'subset', 'trace', 'transpose'
  ]
};

},{}],134:[function(require,module,exports){
module.exports = {
  'name': 'combinations',
  'category': 'Probability',
  'syntax': [
    'combinations(n, k)'
  ],
  'description': 'Compute the number of combinations of n items taken k at a time',
  'examples': [
    'combinations(7, 5)'
  ],
  'seealso': ['permutations', 'factorial']
};

},{}],135:[function(require,module,exports){
module.exports = {
  'name': 'factorial',
  'category': 'Probability',
  'syntax': [
    'kldivergence(x, y)'
  ],
  'description': 'Compute the factorial of a value',
  'examples': [
    '5!',
    '5 * 4 * 3 * 2 * 1',
    '3!'
  ],
  'seealso': ['combinations', 'permutations', 'gamma']
};

},{}],136:[function(require,module,exports){
module.exports = {
  'name': 'gamma',
  'category': 'Probability',
  'syntax': [
    'gamma(n)'
  ],
  'description': 'Compute the gamma function. For small values, the Lanczos approximation is used, and for large values the extended Stirling approximation.',
  'examples': [
    'gamma(4)',
    '3!',
    'gamma(1/2)',
    'sqrt(pi)'
  ],
  'seealso': ['factorial']
};

},{}],137:[function(require,module,exports){
module.exports = {
  'name': 'kldivergence',
  'category': 'Probability',
  'syntax': [
    'n!',
    'factorial(n)'
  ],
  'description': 'Calculate the Kullback-Leibler (KL) divergence  between two distributions.',
  'examples': [
    'math.kldivergence([0.7,0.5,0.4], [0.2,0.9,0.5])'
  ],
  'seealso': []
};

},{}],138:[function(require,module,exports){
module.exports = {
  'name': 'multinomial',
  'category': 'Probability',
  'syntax': [
    'multinomial(A)'
  ],
  'description': 'Multinomial Coefficients compute the number of ways of picking a1, a2, ..., ai unordered outcomes from `n` possibilities. multinomial takes one array of integers as an argument. The following condition must be enforced: every ai <= 0.',
  'examples': [
    'multinomial([1, 2, 1])'
  ],
  'seealso': ['combinations', 'factorial']
};
},{}],139:[function(require,module,exports){
module.exports = {
  'name': 'permutations',
  'category': 'Probability',
  'syntax': [
    'permutations(n)',
    'permutations(n, k)'
  ],
  'description': 'Compute the number of permutations of n items taken k at a time',
  'examples': [
    'permutations(5)',
    'permutations(5, 3)'
  ],
  'seealso': ['combinations', 'factorial']
};

},{}],140:[function(require,module,exports){
module.exports = {
  'name': 'pickRandom',
  'category': 'Probability',
  'syntax': [
    'pickRandom(array)',
    'pickRandom(array, number)',
    'pickRandom(array, weights)',
    'pickRandom(array, number, weights)',
    'pickRandom(array, weights, number)'
  ],
  'description':
      'Pick a random entry from a given array.',
  'examples': [
    'pickRandom(0:10)',
    'pickRandom([1, 3, 1, 6])',
    'pickRandom([1, 3, 1, 6], 2)',
    'pickRandom([1, 3, 1, 6], [2, 3, 2, 1])',
    'pickRandom([1, 3, 1, 6], 2, [2, 3, 2, 1])',
    'pickRandom([1, 3, 1, 6], [2, 3, 2, 1], 2)'
  ],
  'seealso': ['random', 'randomInt']
};

},{}],141:[function(require,module,exports){
module.exports = {
  'name': 'random',
  'category': 'Probability',
  'syntax': [
    'random()',
    'random(max)',
    'random(min, max)',
    'random(size)',
    'random(size, max)',
    'random(size, min, max)'
  ],
  'description':
      'Return a random number.',
  'examples': [
    'random()',
    'random(10, 20)',
    'random([2, 3])'
  ],
  'seealso': ['pickRandom', 'randomInt']
};

},{}],142:[function(require,module,exports){
module.exports = {
  'name': 'randInt',
  'category': 'Probability',
  'syntax': [
    'randInt(max)',
    'randInt(min, max)',
    'randInt(size)',
    'randInt(size, max)',
    'randInt(size, min, max)'
  ],
  'description':
      'Return a random integer number',
  'examples': [
    'randInt(10, 20)',
    'randInt([2, 3], 10)'
  ],
  'seealso': ['pickRandom', 'random']
};
},{}],143:[function(require,module,exports){
module.exports = {
  'name': 'compare',
  'category': 'Relational',
  'syntax': [
    'compare(x, y)'
  ],
  'description':
      'Compare two values. Returns 1 if x is larger than y, -1 if x is smaller than y, and 0 if x and y are equal.',
  'examples': [
    'compare(2, 3)',
    'compare(3, 2)',
    'compare(2, 2)',
    'compare(5cm, 40mm)',
    'compare(2, [1, 2, 3])'
  ],
  'seealso': [
    'equal', 'unequal', 'smaller', 'smallerEq', 'largerEq'
  ]
};

},{}],144:[function(require,module,exports){
module.exports = {
  'name': 'deepEqual',
  'category': 'Relational',
  'syntax': [
    'deepEqual(x, y)'
  ],
  'description':
      'Check equality of two matrices element wise. Returns true if the size of both matrices is equal and when and each of the elements are equal.',
  'examples': [
    '[1,3,4] == [1,3,4]',
    '[1,3,4] == [1,3]'
  ],
  'seealso': [
    'equal', 'unequal', 'smaller', 'larger', 'smallerEq', 'largerEq', 'compare'
  ]
};

},{}],145:[function(require,module,exports){
module.exports = {
  'name': 'equal',
  'category': 'Relational',
  'syntax': [
    'x == y',
    'equal(x, y)'
  ],
  'description':
      'Check equality of two values. Returns true if the values are equal, and false if not.',
  'examples': [
    '2+2 == 3',
    '2+2 == 4',
    'a = 3.2',
    'b = 6-2.8',
    'a == b',
    '50cm == 0.5m'
  ],
  'seealso': [
    'unequal', 'smaller', 'larger', 'smallerEq', 'largerEq', 'compare', 'deepEqual'
  ]
};

},{}],146:[function(require,module,exports){
module.exports = {
  'name': 'larger',
  'category': 'Relational',
  'syntax': [
    'x > y',
    'larger(x, y)'
  ],
  'description':
      'Check if value x is larger than y. Returns true if x is larger than y, and false if not.',
  'examples': [
    '2 > 3',
    '5 > 2*2',
    'a = 3.3',
    'b = 6-2.8',
    '(a > b)',
    '(b < a)',
    '5 cm > 2 inch'
  ],
  'seealso': [
    'equal', 'unequal', 'smaller', 'smallerEq', 'largerEq', 'compare'
  ]
};

},{}],147:[function(require,module,exports){
module.exports = {
  'name': 'largerEq',
  'category': 'Relational',
  'syntax': [
    'x >= y',
    'largerEq(x, y)'
  ],
  'description':
      'Check if value x is larger or equal to y. Returns true if x is larger or equal to y, and false if not.',
  'examples': [
    '2 > 1+1',
    '2 >= 1+1',
    'a = 3.2',
    'b = 6-2.8',
    '(a > b)'
  ],
  'seealso': [
    'equal', 'unequal', 'smallerEq', 'smaller', 'largerEq', 'compare'
  ]
};

},{}],148:[function(require,module,exports){
module.exports = {
  'name': 'smaller',
  'category': 'Relational',
  'syntax': [
    'x < y',
    'smaller(x, y)'
  ],
  'description':
      'Check if value x is smaller than value y. Returns true if x is smaller than y, and false if not.',
  'examples': [
    '2 < 3',
    '5 < 2*2',
    'a = 3.3',
    'b = 6-2.8',
    '(a < b)',
    '5 cm < 2 inch'
  ],
  'seealso': [
    'equal', 'unequal', 'larger', 'smallerEq', 'largerEq', 'compare'
  ]
};

},{}],149:[function(require,module,exports){
module.exports = {
  'name': 'smallerEq',
  'category': 'Relational',
  'syntax': [
    'x <= y',
    'smallerEq(x, y)'
  ],
  'description':
      'Check if value x is smaller or equal to value y. Returns true if x is smaller than y, and false if not.',
  'examples': [
    '2 < 1+1',
    '2 <= 1+1',
    'a = 3.2',
    'b = 6-2.8',
    '(a < b)'
  ],
  'seealso': [
    'equal', 'unequal', 'larger', 'smaller', 'largerEq', 'compare'
  ]
};

},{}],150:[function(require,module,exports){
module.exports = {
  'name': 'unequal',
  'category': 'Relational',
  'syntax': [
    'x != y',
    'unequal(x, y)'
  ],
  'description':
      'Check unequality of two values. Returns true if the values are unequal, and false if they are equal.',
  'examples': [
    '2+2 != 3',
    '2+2 != 4',
    'a = 3.2',
    'b = 6-2.8',
    'a != b',
    '50cm != 0.5m',
    '5 cm != 2 inch'
  ],
  'seealso': [
    'equal', 'smaller', 'larger', 'smallerEq', 'largerEq', 'compare', 'deepEqual'
  ]
};

},{}],151:[function(require,module,exports){
module.exports = {
  'name': 'erf',
  'category': 'Special',
  'syntax': [
    'erf(x)'
  ],
  'description': 'Compute the erf function of a value using a rational Chebyshev approximations for different intervals of x',
  'examples': [
    'erf(0.2)',
    'erf(-0.5)',
    'erf(4)'
  ],
  'seealso': []
};

},{}],152:[function(require,module,exports){
module.exports = {
  'name': 'mad',
  'category': 'Statistics',
  'syntax': [
    'mad(a, b, c, ...)',
    'mad(A)'
  ],
  'description': 'Compute the median absolute deviation of a matrix or a list with values. The median absolute deviation is defined as the median of the absolute deviations from the median.',
  'examples': [
    'mad(10, 20, 30)',
    'mad([1, 2, 3])',
    'mad(10, 20, 30)'
  ],
  'seealso': [
    'mean',
    'median',
    'std',
    'abs'
  ]
};

},{}],153:[function(require,module,exports){
module.exports = {
  'name': 'max',
  'category': 'Statistics',
  'syntax': [
    'max(a, b, c, ...)',
    'max(A)',
    'max(A, dim)'
  ],
  'description': 'Compute the maximum value of a list of values.',
  'examples': [
    'max(2, 3, 4, 1)',
    'max([2, 3, 4, 1])',
    'max([2, 5; 4, 3])',
    'max([2, 5; 4, 3], 1)',
    'max([2, 5; 4, 3], 2)',
    'max(2.7, 7.1, -4.5, 2.0, 4.1)',
    'min(2.7, 7.1, -4.5, 2.0, 4.1)'
  ],
  'seealso': [
    'mean',
    'median',
    'min',
    'prod',
    'std',
    'sum',
    'var'
  ]
};

},{}],154:[function(require,module,exports){
module.exports = {
  'name': 'mean',
  'category': 'Statistics',
  'syntax': [
    'mean(a, b, c, ...)',
    'mean(A)',
    'mean(A, dim)'
  ],
  'description': 'Compute the arithmetic mean of a list of values.',
  'examples': [
    'mean(2, 3, 4, 1)',
    'mean([2, 3, 4, 1])',
    'mean([2, 5; 4, 3])',
    'mean([2, 5; 4, 3], 1)',
    'mean([2, 5; 4, 3], 2)',
    'mean([1.0, 2.7, 3.2, 4.0])'
  ],
  'seealso': [
    'max',
    'median',
    'min',
    'prod',
    'std',
    'sum',
    'var'
  ]
};

},{}],155:[function(require,module,exports){
module.exports = {
  'name': 'median',
  'category': 'Statistics',
  'syntax': [
    'median(a, b, c, ...)',
    'median(A)'
  ],
  'description': 'Compute the median of all values. The values are sorted and the middle value is returned. In case of an even number of values, the average of the two middle values is returned.',
  'examples': [
    'median(5, 2, 7)',
    'median([3, -1, 5, 7])'
  ],
  'seealso': [
    'max',
    'mean',
    'min',
    'prod',
    'std',
    'sum',
    'var'
  ]
};

},{}],156:[function(require,module,exports){
module.exports = {
  'name': 'min',
  'category': 'Statistics',
  'syntax': [
    'min(a, b, c, ...)',
    'min(A)',
    'min(A, dim)'
  ],
  'description': 'Compute the minimum value of a list of values.',
  'examples': [
    'min(2, 3, 4, 1)',
    'min([2, 3, 4, 1])',
    'min([2, 5; 4, 3])',
    'min([2, 5; 4, 3], 1)',
    'min([2, 5; 4, 3], 2)',
    'min(2.7, 7.1, -4.5, 2.0, 4.1)',
    'max(2.7, 7.1, -4.5, 2.0, 4.1)'
  ],
  'seealso': [
    'max',
    'mean',
    'median',
    'prod',
    'std',
    'sum',
    'var'
  ]
};

},{}],157:[function(require,module,exports){
module.exports = {
  'name': 'mode',
  'category': 'Statistics',
  'syntax': [
    'mode(a, b, c, ...)',
    'mode(A)',
    'mode(A, a, b, B, c, ...)'
  ],
  'description': 'Computes the mode of all values as an array. In case mode being more than one, multiple values are returned in an array.',
  'examples': [
    'mode(5, 2, 7)',
    'mode([3, -1, 5, 7])'
  ],
  'seealso': [
    'max',
    'mean',
    'min',
    'median',
    'prod',
    'std',
    'sum',
    'var'
  ]
};

},{}],158:[function(require,module,exports){
module.exports = {
  'name': 'prod',
  'category': 'Statistics',
  'syntax': [
    'prod(a, b, c, ...)',
    'prod(A)'
  ],
  'description': 'Compute the product of all values.',
  'examples': [
    'prod(2, 3, 4)',
    'prod([2, 3, 4])',
    'prod([2, 5; 4, 3])'
  ],
  'seealso': [
    'max',
    'mean',
    'min',
    'median',
    'min',
    'std',
    'sum',
    'var'
  ]
};

},{}],159:[function(require,module,exports){
module.exports = {
  'name': 'quantileSeq',
  'category': 'Statistics',
  'syntax': [
    'quantileSeq(A, prob[, sorted])',
    'quantileSeq(A, [prob1, prob2, ...][, sorted])',
    'quantileSeq(A, N[, sorted])'
  ],
  'description': 'Compute the prob order quantile of a matrix or a list with values. The sequence is sorted and the middle value is returned. Supported types of sequence values are: Number, BigNumber, Unit Supported types of probablity are: Number, BigNumber. \n\nIn case of a (multi dimensional) array or matrix, the prob order quantile of all elements will be calculated.',
  'examples': [
    'quantileSeq([3, -1, 5, 7], 0.5)',
    'quantileSeq([3, -1, 5, 7], [1/3, 2/3])',
    'quantileSeq([3, -1, 5, 7], 2)',
    'quantileSeq([-1, 3, 5, 7], 0.5, true)'
  ],
  'seealso': [
    'mean',
    'median',
    'min',
    'max',
    'prod',
    'std',
    'sum',
    'var'
  ]
};
},{}],160:[function(require,module,exports){
module.exports = {
  'name': 'std',
  'category': 'Statistics',
  'syntax': [
    'std(a, b, c, ...)',
    'std(A)',
    'std(A, normalization)'
  ],
  'description': 'Compute the standard deviation of all values, defined as std(A) = sqrt(var(A)). Optional parameter normalization can be "unbiased" (default), "uncorrected", or "biased".',
  'examples': [
    'std(2, 4, 6)',
    'std([2, 4, 6, 8])',
    'std([2, 4, 6, 8], "uncorrected")',
    'std([2, 4, 6, 8], "biased")',
    'std([1, 2, 3; 4, 5, 6])'
  ],
  'seealso': [
    'max',
    'mean',
    'min',
    'median',
    'min',
    'prod',
    'sum',
    'var'
  ]
};

},{}],161:[function(require,module,exports){
module.exports = {
  'name': 'sum',
  'category': 'Statistics',
  'syntax': [
    'sum(a, b, c, ...)',
    'sum(A)'
  ],
  'description': 'Compute the sum of all values.',
  'examples': [
    'sum(2, 3, 4, 1)',
    'sum([2, 3, 4, 1])',
    'sum([2, 5; 4, 3])'
  ],
  'seealso': [
    'max',
    'mean',
    'median',
    'min',
    'prod',
    'std',
    'sum',
    'var'
  ]
};

},{}],162:[function(require,module,exports){
module.exports = {
  'name': 'var',
  'category': 'Statistics',
  'syntax': [
    'var(a, b, c, ...)',
    'var(A)',
    'var(A, normalization)'
  ],
  'description': 'Compute the variance of all values. Optional parameter normalization can be "unbiased" (default), "uncorrected", or "biased".',
  'examples': [
    'var(2, 4, 6)',
    'var([2, 4, 6, 8])',
    'var([2, 4, 6, 8], "uncorrected")',
    'var([2, 4, 6, 8], "biased")',
    'var([1, 2, 3; 4, 5, 6])'
  ],
  'seealso': [
    'max',
    'mean',
    'min',
    'median',
    'min',
    'prod',
    'std',
    'sum'
  ]
};

},{}],163:[function(require,module,exports){
module.exports = {
  'name': 'acos',
  'category': 'Trigonometry',
  'syntax': [
    'acos(x)'
  ],
  'description': 'Compute the inverse cosine of a value in radians.',
  'examples': [
    'acos(0.5)',
    'acos(cos(2.3))'
  ],
  'seealso': [
    'cos',
    'atan',
    'asin'
  ]
};

},{}],164:[function(require,module,exports){
module.exports = {
  'name': 'acosh',
  'category': 'Trigonometry',
  'syntax': [
    'acosh(x)'
  ],
  'description': 'Calculate the hyperbolic arccos of a value, defined as `acosh(x) = ln(sqrt(x^2 - 1) + x)`.',
  'examples': [
    'acosh(1.5)'
  ],
  'seealso': [
    'cosh',
    'asinh',
    'atanh'
  ]
};
},{}],165:[function(require,module,exports){
module.exports = {
  'name': 'acot',
  'category': 'Trigonometry',
  'syntax': [
    'acot(x)'
  ],
  'description': 'Calculate the inverse cotangent of a value.',
  'examples': [
    'acot(0.5)',
    'acot(cot(0.5))',
    'acot(2)'
  ],
  'seealso': [
    'cot',
    'atan'
  ]
};

},{}],166:[function(require,module,exports){
module.exports = {
  'name': 'acoth',
  'category': 'Trigonometry',
  'syntax': [
    'acoth(x)'
  ],
  'description': 'Calculate the hyperbolic arccotangent of a value, defined as `acoth(x) = (ln((x+1)/x) + ln(x/(x-1))) / 2`.',
  'examples': [
    'acoth(0.5)'
  ],
  'seealso': [
    'acsch',
    'asech'
  ]
};
},{}],167:[function(require,module,exports){
module.exports = {
  'name': 'acsc',
  'category': 'Trigonometry',
  'syntax': [
    'acsc(x)'
  ],
  'description': 'Calculate the inverse cotangent of a value.',
  'examples': [
    'acsc(0.5)',
    'acsc(csc(0.5))',
    'acsc(2)'
  ],
  'seealso': [
    'csc',
    'asin',
    'asec'
  ]
};

},{}],168:[function(require,module,exports){
module.exports = {
  'name': 'acsch',
  'category': 'Trigonometry',
  'syntax': [
    'acsch(x)'
  ],
  'description': 'Calculate the hyperbolic arccosecant of a value, defined as `acsch(x) = ln(1/x + sqrt(1/x^2 + 1))`.',
  'examples': [
    'acsch(0.5)'
  ],
  'seealso': [
    'asech',
    'acoth'
  ]
};

},{}],169:[function(require,module,exports){
module.exports = {
  'name': 'asec',
  'category': 'Trigonometry',
  'syntax': [
    'asec(x)'
  ],
  'description': 'Calculate the inverse secant of a value.',
  'examples': [
    'asec(0.5)',
    'asec(sec(0.5))',
    'asec(2)'
  ],
  'seealso': [
    'acos',
    'acot',
    'acsc'
  ]
};

},{}],170:[function(require,module,exports){
module.exports = {
  'name': 'asech',
  'category': 'Trigonometry',
  'syntax': [
    'asech(x)'
  ],
  'description': 'Calculate the inverse secant of a value.',
  'examples': [
    'asech(0.5)'
  ],
  'seealso': [
    'acsch',
    'acoth'
  ]
};

},{}],171:[function(require,module,exports){
module.exports = {
  'name': 'asin',
  'category': 'Trigonometry',
  'syntax': [
    'asin(x)'
  ],
  'description': 'Compute the inverse sine of a value in radians.',
  'examples': [
    'asin(0.5)',
    'asin(sin(2.3))'
  ],
  'seealso': [
    'sin',
    'acos',
    'atan'
  ]
};

},{}],172:[function(require,module,exports){
module.exports = {
  'name': 'asinh',
  'category': 'Trigonometry',
  'syntax': [
    'asinh(x)'
  ],
  'description': 'Calculate the hyperbolic arcsine of a value, defined as `asinh(x) = ln(x + sqrt(x^2 + 1))`.',
  'examples': [
    'asinh(0.5)'
  ],
  'seealso': [
    'acosh',
    'atanh'
  ]
};

},{}],173:[function(require,module,exports){
module.exports = {
  'name': 'atan',
  'category': 'Trigonometry',
  'syntax': [
    'atan(x)'
  ],
  'description': 'Compute the inverse tangent of a value in radians.',
  'examples': [
    'atan(0.5)',
    'atan(tan(2.3))'
  ],
  'seealso': [
    'tan',
    'acos',
    'asin'
  ]
};

},{}],174:[function(require,module,exports){
module.exports = {
  'name': 'atan2',
  'category': 'Trigonometry',
  'syntax': [
    'atan2(y, x)'
  ],
  'description':
      'Computes the principal value of the arc tangent of y/x in radians.',
  'examples': [
    'atan2(2, 2) / pi',
    'angle = 60 deg in rad',
    'x = cos(angle)',
    'y = sin(angle)',
    'atan2(y, x)'
  ],
  'seealso': [
    'sin',
    'cos',
    'tan'
  ]
};

},{}],175:[function(require,module,exports){
module.exports = {
  'name': 'atanh',
  'category': 'Trigonometry',
  'syntax': [
    'atanh(x)'
  ],
  'description': 'Calculate the hyperbolic arctangent of a value, defined as `atanh(x) = ln((1 + x)/(1 - x)) / 2`.',
  'examples': [
    'atanh(0.5)'
  ],
  'seealso': [
    'acosh',
    'asinh'
  ]
};

},{}],176:[function(require,module,exports){
module.exports = {
  'name': 'cos',
  'category': 'Trigonometry',
  'syntax': [
    'cos(x)'
  ],
  'description': 'Compute the cosine of x in radians.',
  'examples': [
    'cos(2)',
    'cos(pi / 4) ^ 2',
    'cos(180 deg)',
    'cos(60 deg)',
    'sin(0.2)^2 + cos(0.2)^2'
  ],
  'seealso': [
    'acos',
    'sin',
    'tan'
  ]
};

},{}],177:[function(require,module,exports){
module.exports = {
  'name': 'cosh',
  'category': 'Trigonometry',
  'syntax': [
    'cosh(x)'
  ],
  'description': 'Compute the hyperbolic cosine of x in radians.',
  'examples': [
    'cosh(0.5)'
  ],
  'seealso': [
    'sinh',
    'tanh',
    'coth'
  ]
};

},{}],178:[function(require,module,exports){
module.exports = {
  'name': 'cot',
  'category': 'Trigonometry',
  'syntax': [
    'cot(x)'
  ],
  'description': 'Compute the cotangent of x in radians. Defined as 1/tan(x)',
  'examples': [
    'cot(2)',
    '1 / tan(2)'
  ],
  'seealso': [
    'sec',
    'csc',
    'tan'
  ]
};

},{}],179:[function(require,module,exports){
module.exports = {
  'name': 'coth',
  'category': 'Trigonometry',
  'syntax': [
    'coth(x)'
  ],
  'description': 'Compute the hyperbolic cotangent of x in radians.',
  'examples': [
    'coth(2)',
    '1 / tanh(2)'
  ],
  'seealso': [
    'sech',
    'csch',
    'tanh'
  ]
};

},{}],180:[function(require,module,exports){
module.exports = {
  'name': 'csc',
  'category': 'Trigonometry',
  'syntax': [
    'csc(x)'
  ],
  'description': 'Compute the cosecant of x in radians. Defined as 1/sin(x)',
  'examples': [
    'csc(2)',
    '1 / sin(2)'
  ],
  'seealso': [
    'sec',
    'cot',
    'sin'
  ]
};

},{}],181:[function(require,module,exports){
module.exports = {
  'name': 'csch',
  'category': 'Trigonometry',
  'syntax': [
    'csch(x)'
  ],
  'description': 'Compute the hyperbolic cosecant of x in radians. Defined as 1/sinh(x)',
  'examples': [
    'csch(2)',
    '1 / sinh(2)'
  ],
  'seealso': [
    'sech',
    'coth',
    'sinh'
  ]
};

},{}],182:[function(require,module,exports){
module.exports = {
  'name': 'sec',
  'category': 'Trigonometry',
  'syntax': [
    'sec(x)'
  ],
  'description': 'Compute the secant of x in radians. Defined as 1/cos(x)',
  'examples': [
    'sec(2)',
    '1 / cos(2)'
  ],
  'seealso': [
    'cot',
    'csc',
    'cos'
  ]
};

},{}],183:[function(require,module,exports){
module.exports = {
  'name': 'sech',
  'category': 'Trigonometry',
  'syntax': [
    'sech(x)'
  ],
  'description': 'Compute the hyperbolic secant of x in radians. Defined as 1/cosh(x)',
  'examples': [
    'sech(2)',
    '1 / cosh(2)'
  ],
  'seealso': [
    'coth',
    'csch',
    'cosh'
  ]
};

},{}],184:[function(require,module,exports){
module.exports = {
  'name': 'sin',
  'category': 'Trigonometry',
  'syntax': [
    'sin(x)'
  ],
  'description': 'Compute the sine of x in radians.',
  'examples': [
    'sin(2)',
    'sin(pi / 4) ^ 2',
    'sin(90 deg)',
    'sin(30 deg)',
    'sin(0.2)^2 + cos(0.2)^2'
  ],
  'seealso': [
    'asin',
    'cos',
    'tan'
  ]
};

},{}],185:[function(require,module,exports){
module.exports = {
  'name': 'sinh',
  'category': 'Trigonometry',
  'syntax': [
    'sinh(x)'
  ],
  'description': 'Compute the hyperbolic sine of x in radians.',
  'examples': [
    'sinh(0.5)'
  ],
  'seealso': [
    'cosh',
    'tanh'
  ]
};

},{}],186:[function(require,module,exports){
module.exports = {
  'name': 'tan',
  'category': 'Trigonometry',
  'syntax': [
    'tan(x)'
  ],
  'description': 'Compute the tangent of x in radians.',
  'examples': [
    'tan(0.5)',
    'sin(0.5) / cos(0.5)',
    'tan(pi / 4)',
    'tan(45 deg)'
  ],
  'seealso': [
    'atan',
    'sin',
    'cos'
  ]
};

},{}],187:[function(require,module,exports){
module.exports = {
  'name': 'tanh',
  'category': 'Trigonometry',
  'syntax': [
    'tanh(x)'
  ],
  'description': 'Compute the hyperbolic tangent of x in radians.',
  'examples': [
    'tanh(0.5)',
    'sinh(0.5) / cosh(0.5)'
  ],
  'seealso': [
    'sinh',
    'cosh'
  ]
};

},{}],188:[function(require,module,exports){
module.exports = {
  'name': 'to',
  'category': 'Units',
  'syntax': [
    'x to unit',
    'to(x, unit)'
  ],
  'description': 'Change the unit of a value.',
  'examples': [
    '5 inch to cm',
    '3.2kg to g',
    '16 bytes in bits'
  ],
  'seealso': []
};

},{}],189:[function(require,module,exports){
module.exports = {
  'name': 'clone',
  'category': 'Utils',
  'syntax': [
    'clone(x)'
  ],
  'description': 'Clone a variable. Creates a copy of primitive variables,and a deep copy of matrices',
  'examples': [
    'clone(3.5)',
    'clone(2 - 4i)',
    'clone(45 deg)',
    'clone([1, 2; 3, 4])',
    'clone("hello world")'
  ],
  'seealso': []
};

},{}],190:[function(require,module,exports){
module.exports = {
  'name': 'format',
  'category': 'Utils',
  'syntax': [
    'format(value)',
    'format(value, precision)'
  ],
  'description': 'Format a value of any type as string.',
  'examples': [
    'format(2.3)',
    'format(3 - 4i)',
    'format([])',
    'format(pi, 3)'
  ],
  'seealso': ['print']
};

},{}],191:[function(require,module,exports){
module.exports = {
  'name': 'isInteger',
  'category': 'Utils',
  'syntax': [
    'isInteger(x)'
  ],
  'description': 'Test whether a value is an integer number.',
  'examples': [
    'isInteger(2)',
    'isInteger(3.5)',
    'isInteger([3, 0.5, -2])'
  ],
  'seealso': ['isNegative', 'isNumeric', 'isPositive', 'isZero']
};

},{}],192:[function(require,module,exports){
module.exports = {
  'name': 'isNaN',
  'category': 'Utils',
  'syntax': [
    'isNaN(x)'
  ],
  'description': 'Test whether a value is NaN (not a number)',
  'examples': [
    'isNaN(2)',
    'isNaN(0 / 0)',
    'isNaN(NaN)',
    'isNaN(Infinity)'
  ],
  'seealso': ['isNegative', 'isNumeric', 'isPositive', 'isZero']
};

},{}],193:[function(require,module,exports){
module.exports = {
  'name': 'isNegative',
  'category': 'Utils',
  'syntax': [
    'isNegative(x)'
  ],
  'description': 'Test whether a value is negative: smaller than zero.',
  'examples': [
    'isNegative(2)',
    'isNegative(0)',
    'isNegative(-4)',
    'isNegative([3, 0.5, -2])'
  ],
  'seealso': ['isInteger', 'isNumeric', 'isPositive', 'isZero']
};

},{}],194:[function(require,module,exports){
module.exports = {
  'name': 'isNumeric',
  'category': 'Utils',
  'syntax': [
    'isNumeric(x)'
  ],
  'description': 'Test whether a value is a numeric value. ' +
    'Returns true when the input is a number, BigNumber, Fraction, or boolean.',
  'examples': [
    'isNumeric(2)',
    'isNumeric(0)',
    'isNumeric(bignumber(500))',
    'isNumeric(fraction(0.125))',
    'isNumeric("3")',
    'isNumeric(2 + 3i)',
    'isNumeric([2.3, "foo", false])'
  ],
  'seealso': ['isInteger', 'isZero', 'isNegative', 'isPositive', 'isNaN']
};

},{}],195:[function(require,module,exports){
module.exports = {
  'name': 'isPositive',
  'category': 'Utils',
  'syntax': [
    'isPositive(x)'
  ],
  'description': 'Test whether a value is positive: larger than zero.',
  'examples': [
    'isPositive(2)',
    'isPositive(0)',
    'isPositive(-4)',
    'isPositive([3, 0.5, -2])'
  ],
  'seealso': ['isInteger', 'isNumeric', 'isNegative', 'isZero']
};

},{}],196:[function(require,module,exports){
module.exports = {
  'name': 'isPrime',
  'category': 'Utils',
  'syntax': [
    'isPrime(x)'
  ],
  'description': 'Test whether a value is prime: has no divisors other than itself and one.',
  'examples': [
    'isPrime(3)',
    'isPrime(-2)',
    'isPrime([2, 17, 100])'
  ],
  'seealso': ['isInteger', 'isNumeric', 'isNegative', 'isZero']
};
},{}],197:[function(require,module,exports){
module.exports = {
  'name': 'isZero',
  'category': 'Utils',
  'syntax': [
    'isZero(x)'
  ],
  'description': 'Test whether a value is zero.',
  'examples': [
    'isZero(2)',
    'isZero(0)',
    'isZero(-4)',
    'isZero([3, 0, -2, 0])'
  ],
  'seealso': ['isInteger', 'isNumeric', 'isNegative', 'isPositive']
};

},{}],198:[function(require,module,exports){
module.exports = {
  'name': 'typeof',
  'category': 'Utils',
  'syntax': [
    'typeof(x)'
  ],
  'description': 'Get the type of a variable.',
  'examples': [
    'typeof(3.5)',
    'typeof(2 - 4i)',
    'typeof(45 deg)',
    'typeof("hello world")'
  ],
  'seealso': []
};

},{}],199:[function(require,module,exports){
function factory (construction, config, load, typed) {
  var docs = {};


  // construction functions
  docs.bignumber = require('./construction/bignumber');
  docs['boolean'] = require('./construction/boolean');
  docs.complex = require('./construction/complex');
  docs.createUnit = require('./construction/createUnit');
  docs.fraction = require('./construction/fraction');
  docs.index = require('./construction/index');
  docs.matrix = require('./construction/matrix');
  docs.number = require('./construction/number');
  docs.sparse = require('./construction/sparse');
  docs.splitUnit = require('./construction/splitUnit');
  docs.string = require('./construction/string');
  docs.unit = require('./construction/unit');

  // constants
  docs.e = require('./constants/e');
  docs.E = require('./constants/e');
  docs['false'] = require('./constants/false');
  docs.i = require('./constants/i');
  docs['Infinity'] = require('./constants/Infinity');
  docs.LN2 = require('./constants/LN2');
  docs.LN10 = require('./constants/LN10');
  docs.LOG2E = require('./constants/LOG2E');
  docs.LOG10E = require('./constants/LOG10E');
  docs.NaN = require('./constants/NaN');
  docs['null'] = require('./constants/null');
  docs.pi = require('./constants/pi');
  docs.PI = require('./constants/pi');
  docs.phi = require('./constants/phi');
  docs.SQRT1_2 = require('./constants/SQRT1_2');
  docs.SQRT2 = require('./constants/SQRT2');
  docs.tau = require('./constants/tau');
  docs['true'] = require('./constants/true');
  docs.version = require('./constants/version');

  // physical constants
  // TODO: more detailed docs for physical constants
  docs.speedOfLight = {description: 'Speed of light in vacuum', examples: ['speedOfLight']};
  docs.gravitationConstant = {description: 'Newtonian constant of gravitation', examples: ['gravitationConstant']};
  docs.planckConstant = {description: 'Planck constant', examples: ['planckConstant']};
  docs.reducedPlanckConstant = {description: 'Reduced Planck constant', examples: ['reducedPlanckConstant']};

  docs.magneticConstant = {description: 'Magnetic constant (vacuum permeability)', examples: ['magneticConstant']};
  docs.electricConstant = {description: 'Electric constant (vacuum permeability)', examples: ['electricConstant']};
  docs.vacuumImpedance = {description: 'Characteristic impedance of vacuum', examples: ['vacuumImpedance']};
  docs.coulomb = {description: 'Coulomb\'s constant', examples: ['coulomb']};
  docs.elementaryCharge = {description: 'Elementary charge', examples: ['elementaryCharge']};
  docs.bohrMagneton = {description: 'Borh magneton', examples: ['bohrMagneton']};
  docs.conductanceQuantum = {description: 'Conductance quantum', examples: ['conductanceQuantum']};
  docs.inverseConductanceQuantum = {description: 'Inverse conductance quantum', examples: ['inverseConductanceQuantum']};
  //docs.josephson = {description: 'Josephson constant', examples: ['josephson']};
  docs.magneticFluxQuantum = {description: 'Magnetic flux quantum', examples: ['magneticFluxQuantum']};
  docs.nuclearMagneton = {description: 'Nuclear magneton', examples: ['nuclearMagneton']};
  docs.klitzing = {description: 'Von Klitzing constant', examples: ['klitzing']};

  docs.bohrRadius = {description: 'Borh radius', examples: ['bohrRadius']};
  docs.classicalElectronRadius = {description: 'Classical electron radius', examples: ['classicalElectronRadius']};
  docs.electronMass = {description: 'Electron mass', examples: ['electronMass']};
  docs.fermiCoupling = {description: 'Fermi coupling constant', examples: ['fermiCoupling']};
  docs.fineStructure = {description: 'Fine-structure constant', examples: ['fineStructure']};
  docs.hartreeEnergy = {description: 'Hartree energy', examples: ['hartreeEnergy']};
  docs.protonMass = {description: 'Proton mass', examples: ['protonMass']};
  docs.deuteronMass = {description: 'Deuteron Mass', examples: ['deuteronMass']};
  docs.neutronMass = {description: 'Neutron mass', examples: ['neutronMass']};
  docs.quantumOfCirculation = {description: 'Quantum of circulation', examples: ['quantumOfCirculation']};
  docs.rydberg = {description: 'Rydberg constant', examples: ['rydberg']};
  docs.thomsonCrossSection = {description: 'Thomson cross section', examples: ['thomsonCrossSection']};
  docs.weakMixingAngle = {description: 'Weak mixing angle', examples: ['weakMixingAngle']};
  docs.efimovFactor = {description: 'Efimov factor', examples: ['efimovFactor']};

  docs.atomicMass = {description: 'Atomic mass constant', examples: ['atomicMass']};
  docs.avogadro = {description: 'Avogadro\'s number', examples: ['avogadro']};
  docs.boltzmann = {description: 'Boltzmann constant', examples: ['boltzmann']};
  docs.faraday = {description: 'Faraday constant', examples: ['faraday']};
  docs.firstRadiation = {description: 'First radiation constant', examples: ['firstRadiation']};
  docs.loschmidt = {description: 'Loschmidt constant at T=273.15 K and p=101.325 kPa', examples: ['loschmidt']};
  docs.gasConstant = {description: 'Gas constant', examples: ['gasConstant']};
  docs.molarPlanckConstant = {description: 'Molar Planck constant', examples: ['molarPlanckConstant']};
  docs.molarVolume = {description: 'Molar volume of an ideal gas at T=273.15 K and p=101.325 kPa', examples: ['molarVolume']};
  docs.sackurTetrode = {description: 'Sackur-Tetrode constant at T=1 K and p=101.325 kPa', examples: ['sackurTetrode']};
  docs.secondRadiation = {description: 'Second radiation constant', examples: ['secondRadiation']};
  docs.stefanBoltzmann = {description: 'Stefan-Boltzmann constant', examples: ['stefanBoltzmann']};
  docs.wienDisplacement = {description: 'Wien displacement law constant', examples: ['wienDisplacement']};
  //docs.spectralRadiance = {description: 'First radiation constant for spectral radiance', examples: ['spectralRadiance']};

  docs.molarMass = {description: 'Molar mass constant', examples: ['molarMass']};
  docs.molarMassC12 = {description: 'Molar mass constant of carbon-12', examples: ['molarMassC12']};
  docs.gravity = {description: 'Standard acceleration of gravity (standard acceleration of free-fall on Earth)', examples: ['gravity']};

  docs.planckLength = {description: 'Planck length', examples: ['planckLength']};
  docs.planckMass = {description: 'Planck mass', examples: ['planckMass']};
  docs.planckTime = {description: 'Planck time', examples: ['planckTime']};
  docs.planckCharge = {description: 'Planck charge', examples: ['planckCharge']};
  docs.planckTemperature = {description: 'Planck temperature', examples: ['planckTemperature']};

  // functions - algebra
  docs.derivative = require('./function/algebra/derivative');
  docs.lsolve = require('./function/algebra/lsolve');
  docs.lup = require('./function/algebra/lup');
  docs.lusolve = require('./function/algebra/lusolve');
  docs.simplify = require('./function/algebra/simplify');
  docs.slu = require('./function/algebra/slu');
  docs.usolve = require('./function/algebra/usolve');

  // functions - arithmetic
  docs.abs = require('./function/arithmetic/abs');
  docs.add = require('./function/arithmetic/add');
  docs.cbrt = require('./function/arithmetic/cbrt');
  docs.ceil = require('./function/arithmetic/ceil');
  docs.cube = require('./function/arithmetic/cube');
  docs.divide = require('./function/arithmetic/divide');
  docs.dotDivide = require('./function/arithmetic/dotDivide');
  docs.dotMultiply = require('./function/arithmetic/dotMultiply');
  docs.dotPow = require('./function/arithmetic/dotPow');
  docs.exp = require('./function/arithmetic/exp');
  docs.fix = require('./function/arithmetic/fix');
  docs.floor = require('./function/arithmetic/floor');
  docs.gcd = require('./function/arithmetic/gcd');
  docs.hypot = require('./function/arithmetic/hypot');
  docs.lcm = require('./function/arithmetic/lcm');
  docs.log = require('./function/arithmetic/log');
  docs.log10 = require('./function/arithmetic/log10');
  docs.mod = require('./function/arithmetic/mod');
  docs.multiply = require('./function/arithmetic/multiply');
  docs.norm = require('./function/arithmetic/norm');
  docs.nthRoot = require('./function/arithmetic/nthRoot');
  docs.pow = require('./function/arithmetic/pow');
  docs.round = require('./function/arithmetic/round');
  docs.sign = require('./function/arithmetic/sign');
  docs.sqrt = require('./function/arithmetic/sqrt');
  docs.square = require('./function/arithmetic/square');
  docs.subtract = require('./function/arithmetic/subtract');
  docs.unaryMinus = require('./function/arithmetic/unaryMinus');
  docs.unaryPlus = require('./function/arithmetic/unaryPlus');
  docs.xgcd = require('./function/arithmetic/xgcd');

  // functions - bitwise
  docs.bitAnd = require('./function/bitwise/bitAnd');
  docs.bitNot = require('./function/bitwise/bitNot');
  docs.bitOr = require('./function/bitwise/bitOr');
  docs.bitXor = require('./function/bitwise/bitXor');
  docs.leftShift = require('./function/bitwise/leftShift');
  docs.rightArithShift = require('./function/bitwise/rightArithShift');
  docs.rightLogShift = require('./function/bitwise/rightLogShift');

  // functions - combinatorics
  docs.bellNumbers = require('./function/combinatorics/bellNumbers');
  docs.catalan = require('./function/combinatorics/catalan');
  docs.composition = require('./function/combinatorics/composition');
  docs.stirlingS2 = require('./function/combinatorics/stirlingS2');

  // functions - core
  docs['config'] =  require('./core/config');
  docs['import'] =  require('./core/import');
  docs['typed'] =  require('./core/typed');

  // functions - complex
  docs.arg = require('./function/complex/arg');
  docs.conj = require('./function/complex/conj');
  docs.re = require('./function/complex/re');
  docs.im = require('./function/complex/im');

  // functions - expression
  docs['eval'] =  require('./function/expression/eval');
  docs.help =  require('./function/expression/help');

  // functions - geometry
  docs.distance = require('./function/geometry/distance');
  docs.intersect = require('./function/geometry/intersect');

  // functions - logical
  docs['and'] = require('./function/logical/and');
  docs['not'] = require('./function/logical/not');
  docs['or'] = require('./function/logical/or');
  docs['xor'] = require('./function/logical/xor');

  // functions - matrix
  docs['concat'] = require('./function/matrix/concat');
  docs.cross = require('./function/matrix/cross');
  docs.det = require('./function/matrix/det');
  docs.diag = require('./function/matrix/diag');
  docs.dot = require('./function/matrix/dot');
  docs.eye = require('./function/matrix/eye');
  docs.filter =  require('./function/matrix/filter');
  docs.flatten = require('./function/matrix/flatten');
  docs.forEach =  require('./function/matrix/forEach');
  docs.inv = require('./function/matrix/inv');
  docs.kron = require('./function/matrix/kron');
  docs.map =  require('./function/matrix/map');
  docs.ones = require('./function/matrix/ones');
  docs.partitionSelect =  require('./function/matrix/partitionSelect');
  docs.range = require('./function/matrix/range');
  docs.resize = require('./function/matrix/resize');
  docs.size = require('./function/matrix/size');
  docs.sort =  require('./function/matrix/sort');
  docs.squeeze = require('./function/matrix/squeeze');
  docs.subset = require('./function/matrix/subset');
  docs.trace = require('./function/matrix/trace');
  docs.transpose = require('./function/matrix/transpose');
  docs.zeros = require('./function/matrix/zeros');

  // functions - probability
  docs.combinations = require('./function/probability/combinations');
  //docs.distribution = require('./function/probability/distribution');
  docs.factorial = require('./function/probability/factorial');
  docs.gamma = require('./function/probability/gamma');
  docs.kldivergence = require('./function/probability/kldivergence');
  docs.multinomial = require('./function/probability/multinomial');
  docs.permutations = require('./function/probability/permutations');
  docs.pickRandom = require('./function/probability/pickRandom');
  docs.random = require('./function/probability/random');
  docs.randomInt = require('./function/probability/randomInt');

  // functions - relational
  docs.compare = require('./function/relational/compare');
  docs.deepEqual = require('./function/relational/deepEqual');
  docs['equal'] = require('./function/relational/equal');
  docs.larger = require('./function/relational/larger');
  docs.largerEq = require('./function/relational/largerEq');
  docs.smaller = require('./function/relational/smaller');
  docs.smallerEq = require('./function/relational/smallerEq');
  docs.unequal = require('./function/relational/unequal');

  // functions - special
  docs.erf = require('./function/special/erf');

  // functions - statistics
  docs.mad = require('./function/statistics/mad');
  docs.max = require('./function/statistics/max');
  docs.mean = require('./function/statistics/mean');
  docs.median = require('./function/statistics/median');
  docs.min = require('./function/statistics/min');
  docs.mode = require('./function/statistics/mode');
  docs.prod = require('./function/statistics/prod');
  docs.quantileSeq = require('./function/statistics/quantileSeq');
  docs.std = require('./function/statistics/std');
  docs.sum = require('./function/statistics/sum');
  docs['var'] = require('./function/statistics/var');

  // functions - trigonometry
  docs.acos = require('./function/trigonometry/acos');
  docs.acosh = require('./function/trigonometry/acosh');
  docs.acot = require('./function/trigonometry/acot');
  docs.acoth = require('./function/trigonometry/acoth');
  docs.acsc = require('./function/trigonometry/acsc');
  docs.acsch = require('./function/trigonometry/acsch');
  docs.asec = require('./function/trigonometry/asec');
  docs.asech = require('./function/trigonometry/asech');
  docs.asin = require('./function/trigonometry/asin');
  docs.asinh = require('./function/trigonometry/asinh');
  docs.atan = require('./function/trigonometry/atan');
  docs.atanh = require('./function/trigonometry/atanh');
  docs.atan2 = require('./function/trigonometry/atan2');
  docs.cos = require('./function/trigonometry/cos');
  docs.cosh = require('./function/trigonometry/cosh');
  docs.cot = require('./function/trigonometry/cot');
  docs.coth = require('./function/trigonometry/coth');
  docs.csc = require('./function/trigonometry/csc');
  docs.csch = require('./function/trigonometry/csch');
  docs.sec = require('./function/trigonometry/sec');
  docs.sech = require('./function/trigonometry/sech');
  docs.sin = require('./function/trigonometry/sin');
  docs.sinh = require('./function/trigonometry/sinh');
  docs.tan = require('./function/trigonometry/tan');
  docs.tanh = require('./function/trigonometry/tanh');

  // functions - units
  docs.to = require('./function/units/to');

  // functions - utils
  docs.clone = require('./function/utils/clone');
  docs.format = require('./function/utils/format');
  docs.isNaN = require('./function/utils/isNaN');
  docs.isInteger = require('./function/utils/isInteger');
  docs.isNegative = require('./function/utils/isNegative');
  docs.isNumeric = require('./function/utils/isNumeric');
  docs.isPositive = require('./function/utils/isPositive');
  docs.isPrime = require('./function/utils/isPrime');
  docs.isZero = require('./function/utils/isZero');
  // docs.print = require('./function/utils/print'); // TODO: add documentation for print as soon as the parser supports objects.
  docs['typeof'] =  require('./function/utils/typeof');

  return docs;
}

exports.name = 'docs';
exports.path = 'expression';
exports.factory = factory;

},{"./constants/Infinity":19,"./constants/LN10":20,"./constants/LN2":21,"./constants/LOG10E":22,"./constants/LOG2E":23,"./constants/NaN":24,"./constants/SQRT1_2":25,"./constants/SQRT2":26,"./constants/e":27,"./constants/false":28,"./constants/i":29,"./constants/null":30,"./constants/phi":31,"./constants/pi":32,"./constants/tau":33,"./constants/true":34,"./constants/version":35,"./construction/bignumber":36,"./construction/boolean":37,"./construction/complex":38,"./construction/createUnit":39,"./construction/fraction":40,"./construction/index":41,"./construction/matrix":42,"./construction/number":43,"./construction/sparse":44,"./construction/splitUnit":45,"./construction/string":46,"./construction/unit":47,"./core/config":48,"./core/import":49,"./core/typed":50,"./function/algebra/derivative":51,"./function/algebra/lsolve":52,"./function/algebra/lup":53,"./function/algebra/lusolve":54,"./function/algebra/simplify":55,"./function/algebra/slu":56,"./function/algebra/usolve":57,"./function/arithmetic/abs":58,"./function/arithmetic/add":59,"./function/arithmetic/cbrt":60,"./function/arithmetic/ceil":61,"./function/arithmetic/cube":62,"./function/arithmetic/divide":63,"./function/arithmetic/dotDivide":64,"./function/arithmetic/dotMultiply":65,"./function/arithmetic/dotPow":66,"./function/arithmetic/exp":67,"./function/arithmetic/fix":68,"./function/arithmetic/floor":69,"./function/arithmetic/gcd":70,"./function/arithmetic/hypot":71,"./function/arithmetic/lcm":72,"./function/arithmetic/log":73,"./function/arithmetic/log10":74,"./function/arithmetic/mod":75,"./function/arithmetic/multiply":76,"./function/arithmetic/norm":77,"./function/arithmetic/nthRoot":78,"./function/arithmetic/pow":79,"./function/arithmetic/round":80,"./function/arithmetic/sign":81,"./function/arithmetic/sqrt":82,"./function/arithmetic/square":83,"./function/arithmetic/subtract":84,"./function/arithmetic/unaryMinus":85,"./function/arithmetic/unaryPlus":86,"./function/arithmetic/xgcd":87,"./function/bitwise/bitAnd":88,"./function/bitwise/bitNot":89,"./function/bitwise/bitOr":90,"./function/bitwise/bitXor":91,"./function/bitwise/leftShift":92,"./function/bitwise/rightArithShift":93,"./function/bitwise/rightLogShift":94,"./function/combinatorics/bellNumbers":95,"./function/combinatorics/catalan":96,"./function/combinatorics/composition":97,"./function/combinatorics/stirlingS2":98,"./function/complex/arg":99,"./function/complex/conj":100,"./function/complex/im":101,"./function/complex/re":102,"./function/expression/eval":103,"./function/expression/help":104,"./function/geometry/distance":105,"./function/geometry/intersect":106,"./function/logical/and":107,"./function/logical/not":108,"./function/logical/or":109,"./function/logical/xor":110,"./function/matrix/concat":111,"./function/matrix/cross":112,"./function/matrix/det":113,"./function/matrix/diag":114,"./function/matrix/dot":115,"./function/matrix/eye":116,"./function/matrix/filter":117,"./function/matrix/flatten":118,"./function/matrix/forEach":119,"./function/matrix/inv":120,"./function/matrix/kron":121,"./function/matrix/map":122,"./function/matrix/ones":123,"./function/matrix/partitionSelect":124,"./function/matrix/range":125,"./function/matrix/resize":126,"./function/matrix/size":127,"./function/matrix/sort":128,"./function/matrix/squeeze":129,"./function/matrix/subset":130,"./function/matrix/trace":131,"./function/matrix/transpose":132,"./function/matrix/zeros":133,"./function/probability/combinations":134,"./function/probability/factorial":135,"./function/probability/gamma":136,"./function/probability/kldivergence":137,"./function/probability/multinomial":138,"./function/probability/permutations":139,"./function/probability/pickRandom":140,"./function/probability/random":141,"./function/probability/randomInt":142,"./function/relational/compare":143,"./function/relational/deepEqual":144,"./function/relational/equal":145,"./function/relational/larger":146,"./function/relational/largerEq":147,"./function/relational/smaller":148,"./function/relational/smallerEq":149,"./function/relational/unequal":150,"./function/special/erf":151,"./function/statistics/mad":152,"./function/statistics/max":153,"./function/statistics/mean":154,"./function/statistics/median":155,"./function/statistics/min":156,"./function/statistics/mode":157,"./function/statistics/prod":158,"./function/statistics/quantileSeq":159,"./function/statistics/std":160,"./function/statistics/sum":161,"./function/statistics/var":162,"./function/trigonometry/acos":163,"./function/trigonometry/acosh":164,"./function/trigonometry/acot":165,"./function/trigonometry/acoth":166,"./function/trigonometry/acsc":167,"./function/trigonometry/acsch":168,"./function/trigonometry/asec":169,"./function/trigonometry/asech":170,"./function/trigonometry/asin":171,"./function/trigonometry/asinh":172,"./function/trigonometry/atan":173,"./function/trigonometry/atan2":174,"./function/trigonometry/atanh":175,"./function/trigonometry/cos":176,"./function/trigonometry/cosh":177,"./function/trigonometry/cot":178,"./function/trigonometry/coth":179,"./function/trigonometry/csc":180,"./function/trigonometry/csch":181,"./function/trigonometry/sec":182,"./function/trigonometry/sech":183,"./function/trigonometry/sin":184,"./function/trigonometry/sinh":185,"./function/trigonometry/tan":186,"./function/trigonometry/tanh":187,"./function/units/to":188,"./function/utils/clone":189,"./function/utils/format":190,"./function/utils/isInteger":191,"./function/utils/isNaN":192,"./function/utils/isNegative":193,"./function/utils/isNumeric":194,"./function/utils/isPositive":195,"./function/utils/isPrime":196,"./function/utils/isZero":197,"./function/utils/typeof":198}],200:[function(require,module,exports){
'use strict';

var deepMap = require('../../utils/collection/deepMap');

function factory (type, config, load, typed) {
  var parse = load(require('../parse'));

  /**
   * Parse and compile an expression.
   * Returns a an object with a function `eval([scope])` to evaluate the
   * compiled expression.
   *
   * Syntax:
   *
   *     math.compile(expr)                       // returns one node
   *     math.compile([expr1, expr2, expr3, ...]) // returns an array with nodes
   *
   * Examples:
   *
   *     var code = math.compile('sqrt(3^2 + 4^2)');
   *     code.eval(); // 5
   *
   *     var scope = {a: 3, b: 4}
   *     var code = math.compile('a * b'); // 12
   *     code.eval(scope); // 12
   *     scope.a = 5;
   *     code.eval(scope); // 20
   *
   *     var nodes = math.compile(['a = 3', 'b = 4', 'a * b']);
   *     nodes[2].eval(); // 12
   *
   * See also:
   *
   *    parse, eval
   *
   * @param {string | string[] | Array | Matrix} expr
   *            The expression to be compiled
   * @return {{eval: Function} | Array.<{eval: Function}>} code
   *            An object with the compiled expression
   * @throws {Error}
   */
  return typed('compile', {
    'string': function (expr) {
      return parse(expr).compile();
    },

    'Array | Matrix': function (expr) {
      return deepMap(expr, function (entry) {
        return parse(entry).compile();
      });
    }
  });
}

exports.name = 'compile';
exports.factory = factory;

},{"../../utils/collection/deepMap":353,"../parse":228}],201:[function(require,module,exports){
'use strict';

var deepMap = require('../../utils/collection/deepMap');

function factory (type, config, load, typed) {
  var parse = load(require('../parse'));

  /**
   * Evaluate an expression.
   *
   * Syntax:
   *
   *     math.eval(expr)
   *     math.eval(expr, scope)
   *     math.eval([expr1, expr2, expr3, ...])
   *     math.eval([expr1, expr2, expr3, ...], scope)
   *
   * Example:
   *
   *     math.eval('(2+3)/4');                // 1.25
   *     math.eval('sqrt(3^2 + 4^2)');        // 5
   *     math.eval('sqrt(-4)');               // 2i
   *     math.eval(['a=3', 'b=4', 'a*b']);,   // [3, 4, 12]
   *
   *     var scope = {a:3, b:4};
   *     math.eval('a * b', scope);           // 12
   *
   * See also:
   *
   *    parse, compile
   *
   * @param {string | string[] | Matrix} expr   The expression to be evaluated
   * @param {Object} [scope]                    Scope to read/write variables
   * @return {*} The result of the expression
   * @throws {Error}
   */
  return typed('compile', {
    'string': function (expr) {
      var scope = {};
      return parse(expr).compile().eval(scope);
    },

    'string, Object': function (expr, scope) {
      return parse(expr).compile().eval(scope);
    },

    'Array | Matrix': function (expr) {
      var scope = {};
      return deepMap(expr, function (entry) {
        return parse(entry).compile().eval(scope);
      });
    },

    'Array | Matrix, Object': function (expr, scope) {
      return deepMap(expr, function (entry) {
        return parse(entry).compile().eval(scope);
      });
    }
  });
}

exports.name = 'eval';
exports.factory = factory;
},{"../../utils/collection/deepMap":353,"../parse":228}],202:[function(require,module,exports){
'use strict';

function factory (type, config, load, typed, math) {
  var docs = load(require('../docs'));

  /**
   * Retrieve help on a function or data type.
   * Help files are retrieved from the documentation in math.expression.docs.
   *
   * Syntax:
   *
   *    math.help(search)
   *
   * Examples:
   *
   *    console.log(math.help('sin').toString());
   *    console.log(math.help(math.add).toString());
   *    console.log(math.help(math.add).toJSON());
   *
   * @param {Function | string | Object} search   A function or function name
   *                                              for which to get help
   * @return {Help} A help object
   */
  return typed('help', {
    'any': function (search) {
      var prop;
      var name = search;

      if (typeof search !== 'string') {
        for (prop in math) {
          // search in functions and constants
          if (math.hasOwnProperty(prop) && (search === math[prop])) {
            name = prop;
            break;
          }
        }

        /* TODO: implement help for data types
         if (!text) {
         // search data type
         for (prop in math.type) {
         if (math.type.hasOwnProperty(prop)) {
         if (search === math.type[prop]) {
         text = prop;
         break;
         }
         }
         }
         }
         */
      }

      var doc = docs[name];
      if (!doc) {
        throw new Error('No documentation found on "' + name + '"');
      }
      return new type.Help(doc);
    }
  });
}

exports.math = true; // request access to the math namespace as 5th argument of the factory function
exports.name = 'help';
exports.factory = factory;

},{"../docs":199}],203:[function(require,module,exports){
module.exports = [
  require('./compile'),
  require('./eval'),
  require('./help'),
  require('./parse'),
  require('./parser')
];

},{"./compile":200,"./eval":201,"./help":202,"./parse":204,"./parser":205}],204:[function(require,module,exports){
'use strict';

function factory (type, config, load, typed) {
  var parse = load(require('../parse'));

  /**
   * Parse an expression. Returns a node tree, which can be evaluated by
   * invoking node.eval();
   *
   * Syntax:
   *
   *     math.parse(expr)
   *     math.parse(expr, options)
   *     math.parse([expr1, expr2, expr3, ...])
   *     math.parse([expr1, expr2, expr3, ...], options)
   *
   * Example:
   *
   *     var node = math.parse('sqrt(3^2 + 4^2)');
   *     node.compile().eval(); // 5
   *
   *     var scope = {a:3, b:4}
   *     var node = math.parse('a * b'); // 12
   *     var code = node.compile();
   *     code.eval(scope); // 12
   *     scope.a = 5;
   *     code.eval(scope); // 20
   *
   *     var nodes = math.parse(['a = 3', 'b = 4', 'a * b']);
   *     nodes[2].compile().eval(); // 12
   *
   * See also:
   *
   *     eval, compile
   *
   * @param {string | string[] | Matrix} expr          Expression to be parsed
   * @param {{nodes: Object<string, Node>}} [options]  Available options:
   *                                                   - `nodes` a set of custom nodes
   * @return {Node | Node[]} node
   * @throws {Error}
   */
  return typed('parse', {
    'string | Array | Matrix': parse,
    'string | Array | Matrix, Object': parse
  });
}

exports.name = 'parse';
exports.factory = factory;

},{"../parse":228}],205:[function(require,module,exports){
'use strict';

function factory (type, config, load, typed, math) {
  var Parser = load(require('../Parser'));

  /**
   * Create a parser. The function creates a new `math.expression.Parser` object.
   *
   * Syntax:
   *
   *    math.parser()
   *
   * Examples:
   *
   *     var parser = new math.parser();
   *
   *     // evaluate expressions
   *     var a = parser.eval('sqrt(3^2 + 4^2)'); // 5
   *     var b = parser.eval('sqrt(-4)');        // 2i
   *     var c = parser.eval('2 inch in cm');    // 5.08 cm
   *     var d = parser.eval('cos(45 deg)');     // 0.7071067811865476
   *
   *     // define variables and functions
   *     parser.eval('x = 7 / 2');               // 3.5
   *     parser.eval('x + 3');                   // 6.5
   *     parser.eval('function f(x, y) = x^y');  // f(x, y)
   *     parser.eval('f(2, 3)');                 // 8
   *
   *     // get and set variables and functions
   *     var x = parser.get('x');                // 7
   *     var f = parser.get('f');                // function
   *     var g = f(3, 2);                        // 9
   *     parser.set('h', 500);
   *     var i = parser.eval('h / 2');           // 250
   *     parser.set('hello', function (name) {
   *       return 'hello, ' + name + '!';
   *     });
   *     parser.eval('hello("user")');           // "hello, user!"
   *
   *     // clear defined functions and variables
   *     parser.clear();
   *
   * See also:
   *
   *    eval, compile, parse
   *
   * @return {Parser} Parser
   */
  return typed('parser', {
    '': function () {
      return new Parser(math);
    }
  });
}

exports.name = 'parser';
exports.factory = factory;
exports.math = true; // requires the math namespace as 5th argument

},{"../Parser":18}],206:[function(require,module,exports){
module.exports = [
  require('./docs'),
  require('./function'),
  require('./node'),
  require('./transform'),

  require('./Help'),
  require('./parse'),
  require('./Parser')
];

},{"./Help":17,"./Parser":18,"./docs":199,"./function":203,"./node":224,"./parse":228,"./transform":233}],207:[function(require,module,exports){
'use strict';

// Reserved keywords not allowed to use in the parser
module.exports = {
  end: true
};

},{}],208:[function(require,module,exports){
'use strict';

function factory (type, config, load, typed) {
  var Node = load(require('./Node'));
  var access = load(require('./utils/access'));

  /**
   * @constructor AccessorNode
   * @extends {Node}
   * Access an object property or get a matrix subset
   *
   * @param {Node} object                 The object from which to retrieve
   *                                      a property or subset.
   * @param {IndexNode} index             IndexNode containing ranges
   */
  function AccessorNode(object, index) {
    if (!(this instanceof AccessorNode)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }

    if (!(object && object.isNode)) {
      throw new TypeError('Node expected for parameter "object"');
    }
    if (!(index && index.isIndexNode)) {
      throw new TypeError('IndexNode expected for parameter "index"');
    }

    this.object = object || null;
    this.index = index;

    // readonly property name
    Object.defineProperty(this, 'name', {
      get: function () {
        if (this.index) {
          return (this.index.isObjectProperty())
              ? this.index.getObjectProperty()
              : '';
        }
        else {
          return this.object.name || '';
        }
      }.bind(this),
      set: function () {
        throw new Error('Cannot assign a new name, name is read-only');
      }
    });
  }

  AccessorNode.prototype = new Node();

  AccessorNode.prototype.type = 'AccessorNode';

  AccessorNode.prototype.isAccessorNode = true;

  /**
   * Compile the node to javascript code
   * @param {Object} defs     Object which can be used to define functions
   *                          or constants globally available for the compiled
   *                          expression
   * @param {Object} args     Object with local function arguments, the key is
   *                          the name of the argument, and the value is `true`.
   *                          The object may not be mutated, but must be
   *                          extended instead.
   * @return {string} js
   * @private
   */
  AccessorNode.prototype._compile = function (defs, args) {
    defs.access = access;

    var object = this.object._compile(defs, args);
    var index = this.index._compile(defs, args);

    if (this.index.isObjectProperty()) {
      return object + '["' + this.index.getObjectProperty() + '"]';
    }
    else if (this.index.needsSize()) {
      // if some parameters use the 'end' parameter, we need to calculate the size
      return '(function () {' +
          '  var object = ' + object + ';' +
          '  var size = math.size(object).valueOf();' +
          '  return access(object, ' + index + ');' +
          '})()';
    }
    else {
      return 'access(' + object + ', ' + index + ')';
    }
  };

  /**
   * Execute a callback for each of the child nodes of this node
   * @param {function(child: Node, path: string, parent: Node)} callback
   */
  AccessorNode.prototype.forEach = function (callback) {
    callback(this.object, 'object', this);
    callback(this.index, 'index', this);
  };

  /**
   * Create a new AccessorNode having it's childs be the results of calling
   * the provided callback function for each of the childs of the original node.
   * @param {function(child: Node, path: string, parent: Node): Node} callback
   * @returns {AccessorNode} Returns a transformed copy of the node
   */
  AccessorNode.prototype.map = function (callback) {
    return new AccessorNode(
        this._ifNode(callback(this.object, 'object', this)),
        this._ifNode(callback(this.index, 'index', this))
    );
  };

  /**
   * Create a clone of this node, a shallow copy
   * @return {AccessorNode}
   */
  AccessorNode.prototype.clone = function () {
    return new AccessorNode(this.object, this.index);
  };

  /**
   * Get string representation
   * @param {Object} options
   * @return {string}
   */
  AccessorNode.prototype._toString = function (options) {
    var object = this.object.toString(options);
    if (needParenthesis(this.object)) {
      object = '(' + object + ')';
    }

    return object + this.index.toString(options);
  };

  /**
   * Get LaTeX representation
   * @param {Object} options
   * @return {string}
   */
  AccessorNode.prototype._toTex = function (options) {
    var object = this.object.toTex(options);
    if (needParenthesis(this.object)) {
      object = '\\left(' + object + '\\right)';
    }

    return object + this.index.toTex(options);
  };

  /**
   * Are parenthesis needed?
   * @private
   */
  function needParenthesis(node) {
    // TODO: maybe make a method on the nodes which tells whether they need parenthesis?
    return !(node.isAccessorNode || node.isArrayNode || node.isConstantNode
        || node.isFunctionNode || node.isObjectNode || node.isParenthesisNode
        || node.isSymbolNode);
  }

  return AccessorNode;
}

exports.name = 'AccessorNode';
exports.path = 'expression.node';
exports.factory = factory;

},{"./Node":217,"./utils/access":225}],209:[function(require,module,exports){
'use strict';

function factory (type, config, load, typed) {
  var Node = load(require('./Node'));

  /**
   * @constructor ArrayNode
   * @extends {Node}
   * Holds an 1-dimensional array with items
   * @param {Node[]} [items]   1 dimensional array with items
   */
  function ArrayNode(items) {
    if (!(this instanceof ArrayNode)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }

    this.items = items || [];

    // validate input
    if (!Array.isArray(this.items)
        || !this.items.every(function (item) {return item && item.isNode;})) {
      throw new TypeError('Array containing Nodes expected');
    }

    // TODO: deprecated since v3, remove some day
    var deprecated = function () {
      throw new Error('Property `ArrayNode.nodes` is deprecated, use `ArrayNode.items` instead');
    };
    Object.defineProperty(this, 'nodes', { get: deprecated, set: deprecated });
  }

  ArrayNode.prototype = new Node();

  ArrayNode.prototype.type = 'ArrayNode';

  ArrayNode.prototype.isArrayNode = true;

  /**
   * Compile the node to javascript code
   * @param {Object} defs     Object which can be used to define functions
   *                          or constants globally available for the compiled
   *                          expression
   * @param {Object} args     Object with local function arguments, the key is
   *                          the name of the argument, and the value is `true`.
   *                          The object may not be mutated, but must be
   *                          extended instead.
   * @private
   */
  ArrayNode.prototype._compile = function (defs, args) {
    var asMatrix = (defs.math.config().matrix !== 'Array');

    var items = this.items.map(function (node) {
      return node._compile(defs, args);
    });

    return (asMatrix ? 'math.matrix([' : '[') +
        items.join(',') +
        (asMatrix ? '])' : ']');
  };

  /**
   * Execute a callback for each of the child nodes of this node
   * @param {function(child: Node, path: string, parent: Node)} callback
   */
  ArrayNode.prototype.forEach = function (callback) {
    for (var i = 0; i < this.items.length; i++) {
      var node = this.items[i];
      callback(node, 'items[' + i + ']', this);
    }
  };

  /**
   * Create a new ArrayNode having it's childs be the results of calling
   * the provided callback function for each of the childs of the original node.
   * @param {function(child: Node, path: string, parent: Node): Node} callback
   * @returns {ArrayNode} Returns a transformed copy of the node
   */
  ArrayNode.prototype.map = function (callback) {
    var items = [];
    for (var i = 0; i < this.items.length; i++) {
      items[i] = this._ifNode(callback(this.items[i], 'items[' + i + ']', this));
    }
    return new ArrayNode(items);
  };

  /**
   * Create a clone of this node, a shallow copy
   * @return {ArrayNode}
   */
  ArrayNode.prototype.clone = function() {
    return new ArrayNode(this.items.slice(0));
  };

  /**
   * Get string representation
   * @param {Object} options
   * @return {string} str
   * @override
   */
  ArrayNode.prototype._toString = function(options) {
    var items = this.items.map(function (node) {
      return node.toString(options);
    });
    return '[' + items.join(', ') + ']';
  };

  /**
   * Get LaTeX representation
   * @param {Object} options
   * @return {string} str
   */
  ArrayNode.prototype._toTex = function(options) {
    var s = '\\begin{bmatrix}';

    this.items.forEach(function(node) {
      if (node.items) {
        s += node.items.map(function(childNode) {
          return childNode.toTex(options);
        }).join('&');
      }
      else {
        s += node.toTex(options);
      }

      // new line
      s += '\\\\';
    });
    s += '\\end{bmatrix}';
    return s;
  };

  return ArrayNode;
}

exports.name = 'ArrayNode';
exports.path = 'expression.node';
exports.factory = factory;

},{"./Node":217}],210:[function(require,module,exports){
'use strict';

var latex = require('../../utils/latex');

function factory (type, config, load, typed) {
  var Node = load(require('./Node'));
  var ArrayNode = load(require('./ArrayNode'));
  var matrix = load(require('../../type/matrix/function/matrix'));
  var assign = load(require('./utils/assign'));
  var access = load(require('./utils/access'));

  var keywords = require('../keywords');
  var operators = require('../operators');

  /**
   * @constructor AssignmentNode
   * @extends {Node}
   *
   * Define a symbol, like `a=3.2`, update a property like `a.b=3.2`, or
   * replace a subset of a matrix like `A[2,2]=42`.
   *
   * Syntax:
   *
   *     new AssignmentNode(symbol, value)
   *     new AssignmentNode(object, index, value)
   *
   * Usage:
   *
   *    new AssignmentNode(new SymbolNode('a'), new ConstantNode(2));                      // a=2
   *    new AssignmentNode(new SymbolNode('a'), new IndexNode('b'), new ConstantNode(2))   // a.b=2
   *    new AssignmentNode(new SymbolNode('a'), new IndexNode(1, 2), new ConstantNode(3))  // a[1,2]=3
   *
   * @param {SymbolNode | AccessorNode} object  Object on which to assign a value
   * @param {IndexNode} [index=null]            Index, property name or matrix
   *                                            index. Optional. If not provided
   *                                            and `object` is a SymbolNode,
   *                                            the property is assigned to the
   *                                            global scope.
   * @param {Node} value                        The value to be assigned
   */
  function AssignmentNode(object, index, value) {
    if (!(this instanceof AssignmentNode)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }

    this.object = object;
    this.index = value ? index : null;
    this.value = value ? value : index;

    // validate input
    if (!object || !(object.isSymbolNode || object.isAccessorNode)) {
      throw new TypeError('SymbolNode or AccessorNode expected as "object"');
    }
    if (object && object.isSymbolNode && object.name === 'end') {
      throw new Error('Cannot assign to symbol "end"');
    }
    if (this.index && !this.index.isIndexNode) {
      throw new TypeError('IndexNode expected as "index"');
    }
    if (!this.value || !this.value.isNode) {
      throw new TypeError('Node expected as "value"');
    }

    // readonly property name
    Object.defineProperty(this, 'name', {
      get: function () {
        if (this.index) {
          return (this.index.isObjectProperty())
              ? this.index.getObjectProperty()
              : '';
        }
        else {
          return this.object.name || '';
        }
      }.bind(this),
      set: function () {
        throw new Error('Cannot assign a new name, name is read-only');
      }
    });
  }

  AssignmentNode.prototype = new Node();

  AssignmentNode.prototype.type = 'AssignmentNode';

  AssignmentNode.prototype.isAssignmentNode = true;

  /**
   * Compile the node to javascript code
   * @param {Object} defs     Object which can be used to define functions
   *                          or constants globally available for the compiled
   *                          expression
   * @param {Object} args     Object with local function arguments, the key is
   *                          the name of the argument, and the value is `true`.
   *                          The object may not be mutated, but must be
   *                          extended instead.
   * @private
   */
  AssignmentNode.prototype._compile = function (defs, args) {
    defs.assign = assign;
    defs.access = access;

    var size;
    var object = this.object._compile(defs, args);
    var index = this.index ? this.index._compile(defs, args) : null;
    var value = this.value._compile(defs, args);

    if (!this.index) {
      // apply a variable to the scope, for example `a=2`
      if (!this.object.isSymbolNode) {
        throw new TypeError('SymbolNode expected as object');
      }

      return 'scope["' + this.object.name + '"] = ' + value;
    }
    else if (this.index.isObjectProperty()) {
      // apply an object property for example `a.b=2`
      return object + '["' + this.index.getObjectProperty() + '"] = ' + value;
    }
    else if (this.object.isSymbolNode) {
      // update a matrix subset, for example `a[2]=3`
      size = this.index.needsSize() ? 'var size = math.size(object).valueOf();' : '';

      // apply updated object to scope
      return '(function () {' +
          '  var object = ' + object + ';' +
          '  var value = ' + value + ';' +
          '  ' + size +
          '  scope["' + this.object.name + '"] = assign(object, ' + index + ', value);' +
          '  return value;' +
          '})()';
    }
    else { // this.object.isAccessorNode === true
      // update a matrix subset, for example `a.b[2]=3`
      size = this.index.needsSize() ? 'var size = math.size(object).valueOf();' : '';

      // we will not use the _compile of the AccessorNode, but compile it
      // ourselves here as we need the parent object of the AccessorNode:
      // wee need to apply the updated object to parent object
      var parentObject = this.object.object._compile(defs, args);

      if (this.object.index.isObjectProperty()) {
        var parentProperty = '["' + this.object.index.getObjectProperty() + '"]';
        return '(function () {' +
            '  var parent = ' + parentObject + ';' +
            '  var object = parent' + parentProperty + ';' + // parentIndex is a property
            '  var value = ' + value + ';' +
            size +
            '  parent' + parentProperty + ' = assign(object, ' + index + ', value);' +
            '  return value;' +
            '})()';
      }
      else {
        // if some parameters use the 'end' parameter, we need to calculate the size
        var parentSize = this.object.index.needsSize() ? 'var size = math.size(parent).valueOf();' : '';
        var parentIndex = this.object.index._compile(defs, args);

        return '(function () {' +
            '  var parent = ' + parentObject + ';' +
            '  ' + parentSize +
            '  var parentIndex = ' + parentIndex + ';' +
            '  var object = access(parent, parentIndex);' +
            '  var value = ' + value + ';' +
            '  ' + size +
            '  assign(parent, parentIndex, assign(object, ' + index + ', value));' +
            '  return value;' +
            '})()';
      }
    }
  };


  /**
   * Execute a callback for each of the child nodes of this node
   * @param {function(child: Node, path: string, parent: Node)} callback
   */
  AssignmentNode.prototype.forEach = function (callback) {
    callback(this.object, 'object', this);
    if (this.index) {
      callback(this.index, 'index', this);
    }
    callback(this.value, 'value', this);
  };

  /**
   * Create a new AssignmentNode having it's childs be the results of calling
   * the provided callback function for each of the childs of the original node.
   * @param {function(child: Node, path: string, parent: Node): Node} callback
   * @returns {AssignmentNode} Returns a transformed copy of the node
   */
  AssignmentNode.prototype.map = function (callback) {
    var object = this._ifNode(callback(this.object, 'object', this));
    var index = this.index
        ? this._ifNode(callback(this.index, 'index', this))
        : null;
    var value = this._ifNode(callback(this.value, 'value', this));

    return new AssignmentNode(object, index, value);
  };

  /**
   * Create a clone of this node, a shallow copy
   * @return {AssignmentNode}
   */
  AssignmentNode.prototype.clone = function() {
    return new AssignmentNode(this.object, this.index, this.value);
  };

  /*
   * Is parenthesis needed?
   * @param {node} node
   * @param {string} [parenthesis='keep']
   * @private
   */
  function needParenthesis(node, parenthesis) {
    if (!parenthesis) {
      parenthesis = 'keep';
    }

    var precedence = operators.getPrecedence(node, parenthesis);
    var exprPrecedence = operators.getPrecedence(node.value, parenthesis);
    return (parenthesis === 'all')
      || ((exprPrecedence !== null) && (exprPrecedence <= precedence));
  }

  /**
   * Get string representation
   * @param {Object} options
   * @return {string}
   */
  AssignmentNode.prototype._toString = function(options) {
    var object = this.object.toString(options);
    var index = this.index ? this.index.toString(options) : '';
    var value = this.value.toString(options);
    if (needParenthesis(this, options && options.parenthesis)) {
      value = '(' + value + ')';
    }

    return object + index + ' = ' + value;
  };

  /**
   * Get LaTeX representation
   * @param {Object} options
   * @return {string}
   */
  AssignmentNode.prototype._toTex = function(options) {
    var object = this.object.toTex(options);
    var index = this.index ? this.index.toTex(options) : '';
    var value = this.value.toTex(options);
    if (needParenthesis(this, options && options.parenthesis)) {
      value = '\\left(' + value + '\\right)';
    }

    return object + index + ':=' + value;
  };

  return AssignmentNode;
}

exports.name = 'AssignmentNode';
exports.path = 'expression.node';
exports.factory = factory;

},{"../../type/matrix/function/matrix":328,"../../utils/latex":360,"../keywords":207,"../operators":227,"./ArrayNode":209,"./Node":217,"./utils/access":225,"./utils/assign":226}],211:[function(require,module,exports){
'use strict';

function factory (type, config, load, typed) {
  var Node = load(require('./Node'));
  var ResultSet = load(require('../../type/resultset/ResultSet'));

  /**
   * @constructor BlockNode
   * @extends {Node}
   * Holds a set with blocks
   * @param {Array.<{node: Node} | {node: Node, visible: boolean}>} blocks
   *            An array with blocks, where a block is constructed as an Object
   *            with properties block, which is a Node, and visible, which is
   *            a boolean. The property visible is optional and is true by default
   */
  function BlockNode(blocks) {
    if (!(this instanceof BlockNode)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }

    // validate input, copy blocks
    if (!Array.isArray(blocks)) throw new Error('Array expected');
    this.blocks = blocks.map(function (block) {
      var node = block && block.node;
      var visible = block && block.visible !== undefined ? block.visible : true;

      if (!(node && node.isNode))      throw new TypeError('Property "node" must be a Node');
      if (typeof visible !== 'boolean') throw new TypeError('Property "visible" must be a boolean');

      return {
        node: node,
        visible: visible
      }
    });
  }

  BlockNode.prototype = new Node();

  BlockNode.prototype.type = 'BlockNode';

  BlockNode.prototype.isBlockNode = true;

  /**
   * Compile the node to javascript code
   * @param {Object} defs     Object which can be used to define functions
   *                          or constants globally available for the compiled
   *                          expression
   * @param {Object} args     Object with local function arguments, the key is
   *                          the name of the argument, and the value is `true`.
   *                          The object may not be mutated, but must be
   *                          extended instead.
   * @return {string} js
   * @private
   */
  BlockNode.prototype._compile = function (defs, args) {
    defs.ResultSet = ResultSet;
    var blocks = this.blocks.map(function (param) {
      var js = param.node._compile(defs, args);
      if (param.visible) {
        return 'results.push(' + js + ');';
      }
      else {
        return js + ';';
      }
    });

    return '(function () {' +
        'var results = [];' +
        blocks.join('') +
        'return new ResultSet(results);' +
        '})()';
  };

  /**
   * Execute a callback for each of the child blocks of this node
   * @param {function(child: Node, path: string, parent: Node)} callback
   */
  BlockNode.prototype.forEach = function (callback) {
    for (var i = 0; i < this.blocks.length; i++) {
      callback(this.blocks[i].node, 'blocks[' + i + '].node', this);
    }
  };

  /**
   * Create a new BlockNode having it's childs be the results of calling
   * the provided callback function for each of the childs of the original node.
   * @param {function(child: Node, path: string, parent: Node): Node} callback
   * @returns {BlockNode} Returns a transformed copy of the node
   */
  BlockNode.prototype.map = function (callback) {
    var blocks = [];
    for (var i = 0; i < this.blocks.length; i++) {
      var block = this.blocks[i];
      var node = this._ifNode(callback(block.node, 'blocks[' + i + '].node', this));
      blocks[i] = {
        node: node,
        visible: block.visible
      };
    }
    return new BlockNode(blocks);
  };

  /**
   * Create a clone of this node, a shallow copy
   * @return {BlockNode}
   */
  BlockNode.prototype.clone = function () {
    var blocks = this.blocks.map(function (block) {
      return {
        node: block.node,
        visible: block.visible
      };
    });

    return new BlockNode(blocks);
  };

  /**
   * Get string representation
   * @param {Object} options
   * @return {string} str
   * @override
   */
  BlockNode.prototype._toString = function (options) {
    return this.blocks.map(function (param) {
      return param.node.toString(options) + (param.visible ? '' : ';');
    }).join('\n');
  };

  /**
   * Get LaTeX representation
   * @param {Object} options
   * @return {string} str
   */
  BlockNode.prototype._toTex = function (options) {
    return this.blocks.map(function (param) {
      return param.node.toTex(options) + (param.visible ? '' : ';');
    }).join('\\;\\;\n');
  };

  return BlockNode;
}

exports.name = 'BlockNode';
exports.path = 'expression.node';
exports.factory = factory;

},{"../../type/resultset/ResultSet":343,"./Node":217}],212:[function(require,module,exports){
'use strict';

var latex = require('../../utils/latex');
var operators = require('../operators');

function factory (type, config, load, typed) {
  var Node = load(require('./Node'));

  /**
   * A lazy evaluating conditional operator: 'condition ? trueExpr : falseExpr'
   *
   * @param {Node} condition   Condition, must result in a boolean
   * @param {Node} trueExpr    Expression evaluated when condition is true
   * @param {Node} falseExpr   Expression evaluated when condition is true
   *
   * @constructor ConditionalNode
   * @extends {Node}
   */
  function ConditionalNode(condition, trueExpr, falseExpr) {
    if (!(this instanceof ConditionalNode)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }
    if (!(condition && condition.isNode)) throw new TypeError('Parameter condition must be a Node');
    if (!(trueExpr && trueExpr.isNode))  throw new TypeError('Parameter trueExpr must be a Node');
    if (!(falseExpr && falseExpr.isNode)) throw new TypeError('Parameter falseExpr must be a Node');

    this.condition = condition;
    this.trueExpr = trueExpr;
    this.falseExpr = falseExpr;
  }

  ConditionalNode.prototype = new Node();

  ConditionalNode.prototype.type = 'ConditionalNode';

  ConditionalNode.prototype.isConditionalNode = true;

  /**
   * Compile the node to javascript code
   * @param {Object} defs     Object which can be used to define functions
   *                          or constants globally available for the compiled
   *                          expression
   * @param {Object} args     Object with local function arguments, the key is
   *                          the name of the argument, and the value is `true`.
   *                          The object may not be mutated, but must be
   *                          extended instead.
   * @return {string} js
   * @private
   */
  ConditionalNode.prototype._compile = function (defs, args) {
    /**
     * Test whether a condition is met
     * @param {*} condition
     * @returns {boolean} true if condition is true or non-zero, else false
     */
    defs.testCondition = function (condition) {
      if (typeof condition === 'number'
          || typeof condition === 'boolean'
          || typeof condition === 'string') {
        return condition ? true : false;
      }

      if (condition) {
        if (condition.isBigNumber === true) {
          return condition.isZero() ? false : true;
        }

        if (condition.isComplex === true) {
          return (condition.re || condition.im) ? true : false;
        }

        if (condition.isUnit === true) {
          return condition.value ? true : false;
        }
      }

      if (condition === null || condition === undefined) {
        return false;
      }

      throw new TypeError('Unsupported type of condition "' + defs.math['typeof'](condition) + '"');
    };

    return (
      'testCondition(' + this.condition._compile(defs, args) + ') ? ' +
      '( ' + this.trueExpr._compile(defs, args) + ') : ' +
      '( ' + this.falseExpr._compile(defs, args) + ')'
    );
  };

  /**
   * Execute a callback for each of the child nodes of this node
   * @param {function(child: Node, path: string, parent: Node)} callback
   */
  ConditionalNode.prototype.forEach = function (callback) {
    callback(this.condition, 'condition', this);
    callback(this.trueExpr, 'trueExpr', this);
    callback(this.falseExpr, 'falseExpr', this);
  };

  /**
   * Create a new ConditionalNode having it's childs be the results of calling
   * the provided callback function for each of the childs of the original node.
   * @param {function(child: Node, path: string, parent: Node): Node} callback
   * @returns {ConditionalNode} Returns a transformed copy of the node
   */
  ConditionalNode.prototype.map = function (callback) {
    return new ConditionalNode(
        this._ifNode(callback(this.condition, 'condition', this)),
        this._ifNode(callback(this.trueExpr, 'trueExpr', this)),
        this._ifNode(callback(this.falseExpr, 'falseExpr', this))
    );
  };

  /**
   * Create a clone of this node, a shallow copy
   * @return {ConditionalNode}
   */
  ConditionalNode.prototype.clone = function () {
    return new ConditionalNode(this.condition, this.trueExpr, this.falseExpr);
  };

  /**
   * Get string representation
   * @param {Object} options
   * @return {string} str
   */
  ConditionalNode.prototype._toString = function (options) {
    var parenthesis = (options && options.parenthesis) ? options.parenthesis : 'keep';
    var precedence = operators.getPrecedence(this, parenthesis);

    //Enclose Arguments in parentheses if they are an OperatorNode
    //or have lower or equal precedence
    //NOTE: enclosing all OperatorNodes in parentheses is a decision
    //purely based on aesthetics and readability
    var condition = this.condition.toString(options);
    var conditionPrecedence = operators.getPrecedence(this.condition, parenthesis);
    if ((parenthesis === 'all')
        || (this.condition.type === 'OperatorNode')
        || ((conditionPrecedence !== null) && (conditionPrecedence <= precedence))) {
      condition = '(' + condition + ')';
    }

    var trueExpr = this.trueExpr.toString(options);
    var truePrecedence = operators.getPrecedence(this.trueExpr, parenthesis);
    if ((parenthesis === 'all')
        || (this.trueExpr.type === 'OperatorNode')
        || ((truePrecedence !== null) && (truePrecedence <= precedence))) {
      trueExpr = '(' + trueExpr + ')';
    }

    var falseExpr = this.falseExpr.toString(options);
    var falsePrecedence = operators.getPrecedence(this.falseExpr, parenthesis);
    if ((parenthesis === 'all')
        || (this.falseExpr.type === 'OperatorNode')
        || ((falsePrecedence !== null) && (falsePrecedence <= precedence))) {
      falseExpr = '(' + falseExpr + ')';
    }
    return condition + ' ? ' + trueExpr + ' : ' + falseExpr;
  };

  /**
   * Get LaTeX representation
   * @param {Object} options
   * @return {string} str
   */
  ConditionalNode.prototype._toTex = function (options) {
    return '\\begin{cases} {'
        + this.trueExpr.toTex(options) + '}, &\\quad{\\text{if }\\;'
        + this.condition.toTex(options)
        + '}\\\\{' + this.falseExpr.toTex(options)
        + '}, &\\quad{\\text{otherwise}}\\end{cases}';
  };

  return ConditionalNode;
}

exports.name = 'ConditionalNode';
exports.path = 'expression.node';
exports.factory = factory;

},{"../../utils/latex":360,"../operators":227,"./Node":217}],213:[function(require,module,exports){
'use strict';

var getType = require('../../utils/types').type;

function factory (type, config, load, typed) {
  var Node = load(require('./Node'));

  /**
   * A ConstantNode holds a constant value like a number or string. A ConstantNode
   * stores a stringified version of the value and uses this to compile to
   * JavaScript.
   *
   * In case of a stringified number as input, this may be compiled to a BigNumber
   * when the math instance is configured for BigNumbers.
   *
   * Usage:
   *
   *     // stringified values with type
   *     new ConstantNode('2.3', 'number');
   *     new ConstantNode('true', 'boolean');
   *     new ConstantNode('hello', 'string');
   *
   *     // non-stringified values, type will be automatically detected
   *     new ConstantNode(2.3);
   *     new ConstantNode('hello');
   *
   * @param {string | number | boolean | null | undefined} value
   *                            When valueType is provided, value must contain
   *                            an uninterpreted string representing the value.
   *                            When valueType is undefined, value can be a
   *                            number, string, boolean, null, or undefined, and
   *                            the type will be determined automatically.
   * @param {string} [valueType]  The type of value. Choose from 'number', 'string',
   *                              'boolean', 'undefined', 'null'
   * @constructor ConstantNode
   * @extends {Node}
   */
  function ConstantNode(value, valueType) {
    if (!(this instanceof ConstantNode)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }

    if (valueType) {
      if (typeof valueType !== 'string') {
        throw new TypeError('String expected for parameter "valueType"');
      }
      if (typeof value !== 'string') {
        throw new TypeError('String expected for parameter "value"');
      }

      this.value = value;
      this.valueType = valueType;
    }
    else {
      // stringify the value and determine the type
      this.value = value + '';
      this.valueType = getType(value);
    }

    if (!SUPPORTED_TYPES[this.valueType]) {
      throw new TypeError('Unsupported type of value "' + this.valueType + '"');
    }
  }

  var SUPPORTED_TYPES = {
    'number': true,
    'string': true,
    'boolean': true,
    'undefined': true,
    'null': true
  };

  ConstantNode.prototype = new Node();

  ConstantNode.prototype.type = 'ConstantNode';

  ConstantNode.prototype.isConstantNode = true;

  /**
   * Compile the node to javascript code
   * @param {Object} defs     Object which can be used to define functions
   *                          or constants globally available for the compiled
   *                          expression
   * @param {Object} args     Object with local function arguments, the key is
   *                          the name of the argument, and the value is `true`.
   *                          The object may not be mutated, but must be
   *                          extended instead.
   * @return {string} js
   * @private
   */
  ConstantNode.prototype._compile = function (defs, args) {
    switch (this.valueType) {
      case 'number':
        // TODO: replace this with using config.number
        var numConfig = defs.math.config().number;
        if (numConfig === 'BigNumber') {
          return 'math.bignumber("' + this.value + '")';
        }
        else if (numConfig === 'Fraction') {
          return 'math.fraction("' + this.value + '")';
        }
        else {
          // remove leading zeros like '003.2' which are not allowed by JavaScript
          return this.value.replace(/^(0*)[0-9]/, function (match, zeros) {
            return match.substring(zeros.length);
          });
        }

      case 'string':
        return '"' + this.value + '"';

      case 'boolean':
        return this.value;

      case 'undefined':
        return this.value;

      case 'null':
        return this.value;

      default:
        // TODO: move this error to the constructor?
        throw new TypeError('Unsupported type of constant "' + this.valueType + '"');
    }
  };

  /**
   * Execute a callback for each of the child nodes of this node
   * @param {function(child: Node, path: string, parent: Node)} callback
   */
  ConstantNode.prototype.forEach = function (callback) {
    // nothing to do, we don't have childs
  };


  /**
   * Create a new ConstantNode having it's childs be the results of calling
   * the provided callback function for each of the childs of the original node.
   * @param {function(child: Node, path: string, parent: Node) : Node} callback
   * @returns {ConstantNode} Returns a clone of the node
   */
  ConstantNode.prototype.map = function (callback) {
    return this.clone();
  };

  /**
   * Create a clone of this node, a shallow copy
   * @return {ConstantNode}
   */
  ConstantNode.prototype.clone = function () {
    return new ConstantNode(this.value, this.valueType);
  };

  /**
   * Get string representation
   * @param {Object} options
   * @return {string} str
   */
  ConstantNode.prototype._toString = function (options) {
    switch (this.valueType) {
      case 'string':
        return '"' + this.value + '"';

      default:
        return this.value;
    }
  };

  /**
   * Get LaTeX representation
   * @param {Object} options
   * @return {string} str
   */
  ConstantNode.prototype._toTex = function (options) {
    var value = this.value,
        index;
    switch (this.valueType) {
      case 'string':
        return '\\mathtt{"' + value + '"}';

      case 'number':
        index = value.toLowerCase().indexOf('e');
        if (index !== -1) {
          return value.substring(0, index) + '\\cdot10^{' +
              value.substring(index + 1) + '}';
        }
        return value;

      default:
        return value;
    }
  };

  return ConstantNode;
}

exports.name = 'ConstantNode';
exports.path = 'expression.node';
exports.factory = factory;

},{"../../utils/types":364,"./Node":217}],214:[function(require,module,exports){
'use strict';

var keywords = require('../keywords');
var latex = require('../../utils/latex');
var operators = require('../operators');

function isString (x) {
  return typeof x === 'string';
}

function factory (type, config, load, typed) {
  var Node = load(require('./Node'));

  /**
   * @constructor FunctionAssignmentNode
   * @extends {Node}
   * Function assignment
   *
   * @param {string} name           Function name
   * @param {string[] | Array.<{name: string, type: string}>} params
   *                                Array with function parameter names, or an
   *                                array with objects containing the name
   *                                and type of the parameter
   * @param {Node} expr             The function expression
   */
  function FunctionAssignmentNode(name, params, expr) {
    if (!(this instanceof FunctionAssignmentNode)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }

    // validate input
    if (typeof name !== 'string') throw new TypeError('String expected for parameter "name"');
    if (!Array.isArray(params))  throw new TypeError('Array containing strings or objects expected for parameter "params"');
    if (!(expr && expr.isNode)) throw new TypeError('Node expected for parameter "expr"');
    if (name in keywords) throw new Error('Illegal function name, "' + name + '" is a reserved keyword');

    this.name = name;
    this.params = params.map(function (param) {
      return param && param.name || param;
    });
    this.types = params.map(function (param) {
      return param && param.type || 'any'
    });
    this.expr = expr;
  }

  FunctionAssignmentNode.prototype = new Node();

  FunctionAssignmentNode.prototype.type = 'FunctionAssignmentNode';

  FunctionAssignmentNode.prototype.isFunctionAssignmentNode = true;

  /**
   * Compile the node to javascript code
   * @param {Object} defs     Object which can be used to define functions
   *                          or constants globally available for the compiled
   *                          expression
   * @param {Object} args     Object with local function arguments, the key is
   *                          the name of the argument, and the value is `true`.
   *                          The object may not be mutated, but must be
   *                          extended instead.
   * @return {string} js
   * @private
   */
  FunctionAssignmentNode.prototype._compile = function (defs, args) {
    defs.typed = typed;

    // we extend the original args and add the args to the child object
    var childArgs = Object.create(args);
    this.params.forEach(function (variable) {
      childArgs[variable] = true;
    });

    // compile the function expression with the child args
    var jsExpr = this.expr._compile(defs, childArgs);

    return 'scope["' + this.name + '"] = ' +
        '  (function () {' +
        '    var fn = typed("' + this.name + '", {' +
        '      "' + this.types.join(',') + '": function (' + this.params.join(',') + ') {' +
        '        return ' + jsExpr + '' +
        '      }' +
        '    });' +
        '    fn.syntax = "' + this.name + '(' + this.params.join(', ') + ')";' +
        '    return fn;' +
        '  })()';
  };

  /**
   * Execute a callback for each of the child nodes of this node
   * @param {function(child: Node, path: string, parent: Node)} callback
   */
  FunctionAssignmentNode.prototype.forEach = function (callback) {
    callback(this.expr, 'expr', this);
  };

  /**
   * Create a new FunctionAssignmentNode having it's childs be the results of calling
   * the provided callback function for each of the childs of the original node.
   * @param {function(child: Node, path: string, parent: Node): Node} callback
   * @returns {FunctionAssignmentNode} Returns a transformed copy of the node
   */
  FunctionAssignmentNode.prototype.map = function (callback) {
    var expr = this._ifNode(callback(this.expr, 'expr', this));

    return new FunctionAssignmentNode(this.name, this.params.slice(0), expr);
  };

  /**
   * Create a clone of this node, a shallow copy
   * @return {FunctionAssignmentNode}
   */
  FunctionAssignmentNode.prototype.clone = function () {
    return new FunctionAssignmentNode(this.name, this.params.slice(0), this.expr);
  };

  /**
   * Is parenthesis needed?
   * @param {Node} node
   * @param {Object} parenthesis
   * @private
   */
  function needParenthesis(node, parenthesis) {
    var precedence = operators.getPrecedence(node, parenthesis);
    var exprPrecedence = operators.getPrecedence(node.expr, parenthesis);

    return (parenthesis === 'all')
      || ((exprPrecedence !== null) && (exprPrecedence <= precedence));
  }

  /**
   * get string representation
   * @param {Object} options
   * @return {string} str
   */
  FunctionAssignmentNode.prototype._toString = function (options) {
    var parenthesis = (options && options.parenthesis) ? options.parenthesis : 'keep';
    var expr = this.expr.toString(options);
    if (needParenthesis(this, parenthesis)) {
      expr = '(' + expr + ')';
    }
    return this.name + '(' + this.params.join(', ') + ') = ' + expr;
  };

  /**
   * get LaTeX representation
   * @param {Object} options
   * @return {string} str
   */
  FunctionAssignmentNode.prototype._toTex = function (options) {
    var parenthesis = (options && options.parenthesis) ? options.parenthesis : 'keep';
    var expr = this.expr.toTex(options);
    if (needParenthesis(this, parenthesis)) {
      expr = '\\left(' + expr + '\\right)';
    }

    return '\\mathrm{' + this.name
        + '}\\left(' + this.params.map(latex.toSymbol).join(',') + '\\right):=' + expr;
  };

  return FunctionAssignmentNode;
}
exports.name = 'FunctionAssignmentNode';
exports.path = 'expression.node';
exports.factory = factory;

},{"../../utils/latex":360,"../keywords":207,"../operators":227,"./Node":217}],215:[function(require,module,exports){
'use strict';

var latex = require('../../utils/latex');

function factory (type, config, load, typed, math) {
  var Node = load(require('./Node'));
  var SymbolNode = load(require('./SymbolNode'));

  /**
   * @constructor FunctionNode
   * @extends {./Node}
   * invoke a list with arguments on a node
   * @param {./Node | string} fn Node resolving with a function on which to invoke
   *                             the arguments, typically a SymboNode or AccessorNode
   * @param {./Node[]} args
   */
  function FunctionNode(fn, args) {
    if (!(this instanceof FunctionNode)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }

    if (typeof fn === 'string') {
      fn = new SymbolNode(fn);
    }

    // validate input
    if (!fn || !fn.isNode) throw new TypeError('Node expected as parameter "fn"');
    if (!Array.isArray(args)
        || !args.every(function (arg) {return arg && arg.isNode;})) {
      throw new TypeError('Array containing Nodes expected for parameter "args"');
    }

    this.fn = fn;
    this.args = args || [];

    // readonly property name
    Object.defineProperty(this, 'name', {
      get: function () {
        return this.fn.name || '';
      }.bind(this),
      set: function () {
        throw new Error('Cannot assign a new name, name is read-only');
      }
    });

    // TODO: deprecated since v3, remove some day
    var deprecated = function () {
      throw new Error('Property `FunctionNode.object` is deprecated, use `FunctionNode.fn` instead');
    };
    Object.defineProperty(this, 'object', { get: deprecated, set: deprecated });
  }

  FunctionNode.prototype = new Node();

  FunctionNode.prototype.type = 'FunctionNode';

  FunctionNode.prototype.isFunctionNode = true;

  /**
   * Compile the node to javascript code
   * @param {Object} defs     Object which can be used to define functions
   *                          or constants globally available for the compiled
   *                          expression
   * @param {Object} args     Object with local function arguments, the key is
   *                          the name of the argument, and the value is `true`.
   *                          The object may not be mutated, but must be
   *                          extended instead.
   * @return {string} js
   * @private
   */
  FunctionNode.prototype._compile = function (defs, args) {
    // compile fn and arguments
    var jsFn = this.fn._compile(defs, args);
    var jsArgs = this.args.map(function (arg) {
      return arg._compile(defs, args);
    });
    var argsName;

    if (this.fn.isSymbolNode) {
      // we can statically determine whether the function has an rawArgs property
      var name = this.fn.name;
      var fn = defs.math[name];
      var isRaw = (typeof fn === 'function') && (fn.rawArgs == true);

      if (isRaw) {
        // pass unevaluated parameters (nodes) to the function
        argsName = this._getUniqueArgumentsName(defs);
        defs[argsName] = this.args;

        return jsFn + '(' + argsName + ', math, scope)';
      }
      else {
        // "regular" evaluation
        return jsFn + '(' + jsArgs.join(', ') + ')';
      }
    }
    else if (this.fn.isAccessorNode && this.fn.index.isObjectProperty()) {
      // execute the function with the right context: the object of the AccessorNode
      argsName = this._getUniqueArgumentsName(defs);
      defs[argsName] = this.args;

      var jsObject = this.fn.object._compile(defs, args);
      var prop = this.fn.index.getObjectProperty();

      return '(function () {' +
          'var object = ' + jsObject + ';' +
          'return (object["' + prop + '"] && object["' + prop + '"].rawArgs) ' +
          ' ? object["' + prop + '"](' + argsName + ', math, scope)' +
          ' : object["' + prop + '"](' + jsArgs.join(', ') + ')' +
          '})()';
    }
    else { // this.fn.isAccessorNode && !this.fn.index.isObjectProperty()
      // we have to dynamically determine whether the function has a rawArgs property
      argsName = this._getUniqueArgumentsName(defs);
      defs[argsName] = this.args;

      return '(function () {' +
          'var fn = ' + jsFn + ';' +
          'return (fn && fn.rawArgs) ' +
          ' ? fn(' + argsName + ', math, scope)' +
          ' : fn(' + jsArgs.join(', ') + ')' +
          '})()';
    }
  };

  /**
   * Get a unique name for a arguments to store in defs
   * @param {Object} defs
   * @return {string} A string like 'args1', 'args2', ...
   * @private
   */
  FunctionNode.prototype._getUniqueArgumentsName = function (defs) {
    var argsName;
    var i = 0;

    do {
      argsName = 'args' + i;
      i++;
    }
    while (argsName in defs);

    return argsName;
  };

  /**
   * Execute a callback for each of the child nodes of this node
   * @param {function(child: Node, path: string, parent: Node)} callback
   */
  FunctionNode.prototype.forEach = function (callback) {
    for (var i = 0; i < this.args.length; i++) {
      callback(this.args[i], 'args[' + i + ']', this);
    }
  };

  /**
   * Create a new FunctionNode having it's childs be the results of calling
   * the provided callback function for each of the childs of the original node.
   * @param {function(child: Node, path: string, parent: Node): Node} callback
   * @returns {FunctionNode} Returns a transformed copy of the node
   */
  FunctionNode.prototype.map = function (callback) {
    var fn = this.fn.map(callback);
    var args = [];
    for (var i = 0; i < this.args.length; i++) {
      args[i] = this._ifNode(callback(this.args[i], 'args[' + i + ']', this));
    }
    return new FunctionNode(fn, args);
  };

  /**
   * Create a clone of this node, a shallow copy
   * @return {FunctionNode}
   */
  FunctionNode.prototype.clone = function () {
    return new FunctionNode(this.fn, this.args.slice(0));
  };

  //backup Node's toString function
  //@private
  var nodeToString = FunctionNode.prototype.toString;

  /**
   * Get string representation. (wrapper function)
   * This overrides parts of Node's toString function.
   * If callback is an object containing callbacks, it
   * calls the correct callback for the current node,
   * otherwise it falls back to calling Node's toString
   * function.
   *
   * @param {Object} options
   * @return {string} str
   * @override
   */
  FunctionNode.prototype.toString = function (options) {
    var customString;
    var name = this.fn.toString(options);
    if (options && (typeof options.handler === 'object') && options.handler.hasOwnProperty(name)) {
      //callback is a map of callback functions
      customString = options.handler[name](this, options);
    }

    if (typeof customString !== 'undefined') {
      return customString;
    }

    //fall back to Node's toString
    return nodeToString.call(this, options);
  };

  /**
   * Get string representation
   * @param {Object} options
   * @return {string} str
   */
  FunctionNode.prototype._toString = function (options) {
    var args = this.args.map(function (arg) {
      return arg.toString(options);
    });

    // format the arguments like "add(2, 4.2)"
    return this.fn.toString(options) + '(' + args.join(', ') + ')';
  };

  /*
   * Expand a LaTeX template
   *
   * @param {string} template
   * @param {Node} node
   * @param {Object} options
   * @private
   **/
  function expandTemplate(template, node, options) {
    var latex = '';

    // Match everything of the form ${identifier} or ${identifier[2]} or $$
    // while submatching identifier and 2 (in the second case)
    var regex = new RegExp('\\$(?:\\{([a-z_][a-z_0-9]*)(?:\\[([0-9]+)\\])?\\}|\\$)', 'ig');

    var inputPos = 0;   //position in the input string
    var match;
    while ((match = regex.exec(template)) !== null) {   //go through all matches
      // add everything in front of the match to the LaTeX string
      latex += template.substring(inputPos, match.index);
      inputPos = match.index;

      if (match[0] === '$$') { // escaped dollar sign
        latex += '$';
        inputPos++;
      }
      else { // template parameter
        inputPos += match[0].length;
        var property = node[match[1]];
        if (!property) {
          throw new ReferenceError('Template: Property ' + match[1] + ' does not exist.');
        }
        if (match[2] === undefined) { //no square brackets
          switch (typeof property) {
            case 'string':
              latex += property;
              break;
            case 'object':
              if (property.isNode) {
                latex += property.toTex(options);
              }
              else if (Array.isArray(property)) {
                //make array of Nodes into comma separated list
                latex += property.map(function (arg, index) {
                  if (arg && arg.isNode) {
                    return arg.toTex(options);
                  }
                  throw new TypeError('Template: ' + match[1] + '[' + index + '] is not a Node.');
                }).join(',');
              }
              else {
                throw new TypeError('Template: ' + match[1] + ' has to be a Node, String or array of Nodes');
              }
              break;
            default:
              throw new TypeError('Template: ' + match[1] + ' has to be a Node, String or array of Nodes');
          }
        }
        else { //with square brackets
          if (property[match[2]] && property[match[2]].isNode) {
            latex += property[match[2]].toTex(options);
          }
          else {
            throw new TypeError('Template: ' + match[1] + '[' + match[2] + '] is not a Node.');
          }
        }
      }
    }
    latex += template.slice(inputPos);  //append rest of the template

    return latex;
  }

  //backup Node's toTex function
  //@private
  var nodeToTex = FunctionNode.prototype.toTex;

  /**
   * Get LaTeX representation. (wrapper function)
   * This overrides parts of Node's toTex function.
   * If callback is an object containing callbacks, it
   * calls the correct callback for the current node,
   * otherwise it falls back to calling Node's toTex
   * function.
   *
   * @param {Object} options
   * @return {string}
   */
  FunctionNode.prototype.toTex = function (options) {
    var customTex;
    if (options && (typeof options.handler === 'object') && options.handler.hasOwnProperty(this.name)) {
      //callback is a map of callback functions
      customTex = options.handler[this.name](this, options);
    }

    if (typeof customTex !== 'undefined') {
      return customTex;
    }

    //fall back to Node's toTex
    return nodeToTex.call(this, options);
  };

  /**
   * Get LaTeX representation
   * @param {Object} options
   * @return {string} str
   */
  FunctionNode.prototype._toTex = function (options) {
    var args = this.args.map(function (arg) { //get LaTeX of the arguments
      return arg.toTex(options);
    });

    var latexConverter;

    if (math[this.name] && ((typeof math[this.name].toTex === 'function') || (typeof math[this.name].toTex === 'object') || (typeof math[this.name].toTex === 'string'))) {
      //.toTex is a callback function
      latexConverter = math[this.name].toTex;
    }

    var customToTex;
    switch (typeof latexConverter) {
      case 'function': //a callback function
        customToTex = latexConverter(this, options);
        break;
      case 'string': //a template string
        customToTex = expandTemplate(latexConverter, this, options);
        break;
      case 'object': //an object with different "converters" for different numbers of arguments
        switch (typeof latexConverter[args.length]) {
          case 'function':
            customToTex = latexConverter[args.length](this, options);
            break;
          case 'string':
            customToTex = expandTemplate(latexConverter[args.length], this, options);
            break;
        }
    }

    if (typeof customToTex !== 'undefined') {
      return customToTex;
    }

    return expandTemplate(latex.defaultTemplate, this, options);
  };

  /**
   * Get identifier.
   * @return {string}
   */
  FunctionNode.prototype.getIdentifier = function () {
    return this.type + ':' + this.name;
  };

  return FunctionNode;
}

exports.name = 'FunctionNode';
exports.path = 'expression.node';
exports.math = true; // request access to the math namespace as 5th argument of the factory function
exports.factory = factory;

},{"../../utils/latex":360,"./Node":217,"./SymbolNode":222}],216:[function(require,module,exports){
'use strict';

function factory (type, config, load, typed) {
  var Node = load(require('./Node'));
  var RangeNode = load(require('./RangeNode'));
  var SymbolNode = load(require('./SymbolNode'));

  var Range = load(require('../../type/matrix/Range'));

  var isArray = Array.isArray;

  /**
   * @constructor IndexNode
   * @extends Node
   *
   * Describes a subset of a matrix or an object property.
   * Cannot be used on its own, needs to be used within an AccessorNode or
   * AssignmentNode.
   *
   * @param {Node[]} dimensions
   * @param {boolean} [dotNotation=false]  Optional property describing whether
   *                                       this index was written using dot
   *                                       notation like `a.b`, or using bracket
   *                                       notation like `a["b"]` (default).
   *                                       Used to stringify an IndexNode.
   */
  function IndexNode(dimensions, dotNotation) {
    if (!(this instanceof IndexNode)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }

    this.dimensions = dimensions;
    this.dotNotation = dotNotation || false;

    // validate input
    if (!isArray(dimensions)
        || !dimensions.every(function (range) {return range && range.isNode;})) {
      throw new TypeError('Array containing Nodes expected for parameter "dimensions"');
    }
    if (this.dotNotation && !this.isObjectProperty()) {
      throw new Error('dotNotation only applicable for object properties');
    }

    // TODO: deprecated since v3, remove some day
    var deprecated = function () {
      throw new Error('Property `IndexNode.object` is deprecated, use `IndexNode.fn` instead');
    };
    Object.defineProperty(this, 'object', { get: deprecated, set: deprecated });
  }

  IndexNode.prototype = new Node();

  IndexNode.prototype.type = 'IndexNode';

  IndexNode.prototype.isIndexNode = true;

  /**
   * Compile all range nodes
   *
   * When some of the dimensions has `end` defined, the IndexNode requires
   * a variable `size` to be defined in the current closure, and must contain
   * the size of the matrix that's being handled. To check whether the `size`
   * variable is needed, call IndexNode.needsSize().
   *
   * @param {Object} defs           Object which can be used to define functions
   *                                or constants globally available for the
   *                                compiled expression
   * @param {Object} args           Object with local function arguments, the key is
   *                                the name of the argument, and the value is `true`.
   *                                The object may not be mutated, but must be
   *                                extended instead.
   * @return {string} code
   */
  IndexNode.prototype._compile = function (defs, args) {
    // args can be mutated by IndexNode, when dimensions use `end`
    var childArgs = Object.create(args);

    // helper function to create a Range from start, step and end
    defs.range = function (start, end, step) {
      return new Range(
          (start && start.isBigNumber === true) ? start.toNumber() : start,
          (end   && end.isBigNumber === true)   ? end.toNumber()   : end,
          (step  && step.isBigNumber === true)  ? step.toNumber()  : step
      );
    };

    // TODO: implement support for bignumber (currently bignumbers are silently
    //       reduced to numbers when changing the value to zero-based)

    // TODO: Optimization: when the range values are ConstantNodes,
    //       we can beforehand resolve the zero-based value

    // optimization for a simple object property
    var dimensions = this.dimensions.map(function (range, i) {
      if (range && range.isRangeNode) {
        if (range.needsEnd()) {
          childArgs.end = true;

          // resolve end and create range
          return '(function () {' +
              'var end = size[' + i + ']; ' +
              'return range(' +
              range.start._compile(defs, childArgs) + ', ' +
              range.end._compile(defs, childArgs) + ', ' +
              (range.step ? range.step._compile(defs, childArgs) : '1') +
              '); ' +
              '})()';
        }
        else {
          // create range
          return 'range(' +
              range.start._compile(defs, childArgs) + ', ' +
              range.end._compile(defs, childArgs) + ', ' +
              (range.step ? range.step._compile(defs, childArgs) : '1') +
              ')';
        }
      }
      if (range.isSymbolNode && range.name === 'end') {
        childArgs.end = true;

        // resolve the parameter 'end'
        return '(function () {' +
            'var end = size[' + i + ']; ' +
            'return ' + range._compile(defs, childArgs) + '; ' +
            '})()'
      }
      else { // ConstantNode
        return range._compile(defs, childArgs);
      }
    });

    return 'math.index(' + dimensions.join(', ') + ')';
  };

  /**
   * Execute a callback for each of the child nodes of this node
   * @param {function(child: Node, path: string, parent: Node)} callback
   */
  IndexNode.prototype.forEach = function (callback) {
    for (var i = 0; i < this.dimensions.length; i++) {
      callback(this.dimensions[i], 'dimensions[' + i + ']', this);
    }
  };

  /**
   * Create a new IndexNode having it's childs be the results of calling
   * the provided callback function for each of the childs of the original node.
   * @param {function(child: Node, path: string, parent: Node): Node} callback
   * @returns {IndexNode} Returns a transformed copy of the node
   */
  IndexNode.prototype.map = function (callback) {
    var dimensions = [];
    for (var i = 0; i < this.dimensions.length; i++) {
      dimensions[i] = this._ifNode(callback(this.dimensions[i], 'dimensions[' + i + ']', this));
    }

    return new IndexNode(dimensions);
  };

  /**
   * Create a clone of this node, a shallow copy
   * @return {IndexNode}
   */
  IndexNode.prototype.clone = function () {
    return new IndexNode(this.dimensions.slice(0));
  };

  /**
   * Test whether this IndexNode contains a single property name
   * @return {boolean}
   */
  IndexNode.prototype.isObjectProperty = function () {
    return this.dimensions.length === 1 &&
        this.dimensions[0].isConstantNode &&
        this.dimensions[0].valueType === 'string';
  };

  /**
   * Returns the property name if IndexNode contains a property.
   * If not, returns null.
   * @return {string | null}
   */
  IndexNode.prototype.getObjectProperty = function () {
    return this.isObjectProperty() ? this.dimensions[0].value : null;
  };

  /**
   * Get string representation
   * @param {Object} options
   * @return {string} str
   */
  IndexNode.prototype._toString = function (options) {
    // format the parameters like "[1, 0:5]"
    return this.dotNotation
        ? ('.' + this.getObjectProperty())
        : ('[' + this.dimensions.join(', ') + ']');
  };

  /**
   * Get LaTeX representation
   * @param {Object} options
   * @return {string} str
   */
  IndexNode.prototype._toTex = function (options) {
    var dimensions = this.dimensions.map(function (range) {
      return range.toTex(options);
    });

    return this.dotNotation
        ? ('.' + this.getObjectProperty() + '')
        : ('_{' + dimensions.join(',') + '}');
  };

  /**
   * Test whether this IndexNode needs the object size, size of the Matrix
   * @return {boolean}
   */
  IndexNode.prototype.needsSize = function () {
    return this.dimensions.some(function (range) {
      return (range.isRangeNode && range.needsEnd()) ||
          (range.isSymbolNode && range.name === 'end');
    });
  };

  return IndexNode;
}

exports.name = 'IndexNode';
exports.path = 'expression.node';
exports.factory = factory;

},{"../../type/matrix/Range":327,"./Node":217,"./RangeNode":221,"./SymbolNode":222}],217:[function(require,module,exports){
'use strict';

var keywords = require('../keywords');
var extend = require('../../utils/object').extend;
var deepEqual= require('../../utils/object').deepEqual;

function factory (type, config, load, typed, math) {
  /**
   * Node
   */
  function Node() {
    if (!(this instanceof Node)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }
  }

  /**
   * Evaluate the node
   * @param {Object} [scope]  Scope to read/write variables
   * @return {*}              Returns the result
   */
  Node.prototype.eval = function(scope) {
    return this.compile().eval(scope);
  };

  Node.prototype.type = 'Node';

  Node.prototype.isNode = true;

  Node.prototype.comment = '';

  /**
   * Compile the node to javascript code
   * @return {{eval: function}} expr  Returns an object with a function 'eval',
   *                                  which can be invoked as expr.eval([scope]),
   *                                  where scope is an optional object with
   *                                  variables.
   */
  Node.prototype.compile = function () {
    // TODO: calling compile(math) is deprecated since version 2.0.0. Remove this warning some day
    if (arguments.length > 0) {
      throw new Error('Calling compile(math) is deprecated. Call the function as compile() instead.');
    }

    // definitions globally available inside the closure of the compiled expressions
    var defs = {
      math: math.expression.transform,
      args: {}, // can be filled with names of FunctionAssignment arguments
      _validateScope: _validateScope
    };

    // will be used to put local function arguments
    var args = {};

    var code = this._compile(defs, args);

    var defsCode = Object.keys(defs).map(function (name) {
      return '    var ' + name + ' = defs["' + name + '"];';
    });

    var factoryCode =
        defsCode.join(' ') +
        'return {' +
        '  "eval": function (scope) {' +
        '    if (scope) _validateScope(scope);' +
        '    scope = scope || {};' +
        '    return ' + code + ';' +
        '  }' +
        '};';

    var factory = new Function('defs', factoryCode);
    return factory(defs);
  };

  /**
   * Compile the node to javascript code
   * @param {Object} defs     Object which can be used to define functions
   *                          and constants globally available inside the closure
   *                          of the compiled expression
   * @param {Object} args     Object with local function arguments, the key is
   *                          the name of the argument, and the value is `true`.
   *                          The object may not be mutated, but must be
   *                          extended instead.
   * @return {string} js
   * @private
   */
  Node.prototype._compile = function (defs, args) {
    // must be implemented by each of the Node implementations
    throw new Error('Cannot compile a Node interface');
  };

  /**
   * Execute a callback for each of the child nodes of this node
   * @param {function(child: Node, path: string, parent: Node)} callback
   */
  Node.prototype.forEach = function (callback) {
    // must be implemented by each of the Node implementations
    throw new Error('Cannot run forEach on a Node interface');
  };

  /**
   * Create a new Node having it's childs be the results of calling
   * the provided callback function for each of the childs of the original node.
   * @param {function(child: Node, path: string, parent: Node): Node} callback
   * @returns {OperatorNode} Returns a transformed copy of the node
   */
  Node.prototype.map = function (callback) {
    // must be implemented by each of the Node implementations
    throw new Error('Cannot run map on a Node interface');
  };

  /**
   * Validate whether an object is a Node, for use with map
   * @param {Node} node
   * @returns {Node} Returns the input if it's a node, else throws an Error
   * @protected
   */
  Node.prototype._ifNode = function (node) {
    if (!(node && node.isNode)) {
      throw new TypeError('Callback function must return a Node');
    }

    return node;
  };

  /**
   * Recursively traverse all nodes in a node tree. Executes given callback for
   * this node and each of its child nodes.
   * @param {function(node: Node, path: string, parent: Node)} callback
   *          A callback called for every node in the node tree.
   */
  Node.prototype.traverse = function (callback) {
    // execute callback for itself
    callback(this, null, null);

    // recursively traverse over all childs of a node
    function _traverse(node, callback) {
      node.forEach(function (child, path, parent) {
        callback(child, path, parent);
        _traverse(child, callback);
      });
    }

    _traverse(this, callback);
  };

  /**
   * Recursively transform a node tree via a transform function.
   *
   * For example, to replace all nodes of type SymbolNode having name 'x' with a
   * ConstantNode with value 2:
   *
   *     var res = Node.transform(function (node, path, parent) {
   *       if (node && node.isSymbolNode) && (node.name == 'x')) {
   *         return new ConstantNode(2);
   *       }
   *       else {
   *         return node;
   *       }
   *     });
   *
   * @param {function(node: Node, path: string, parent: Node) : Node} callback
   *          A mapping function accepting a node, and returning
   *          a replacement for the node or the original node.
   *          Signature: callback(node: Node, index: string, parent: Node) : Node
   * @return {Node} Returns the original node or its replacement
   */
  Node.prototype.transform = function (callback) {
    // traverse over all childs
    function _transform (node, callback) {
      return node.map(function(child, path, parent) {
        var replacement = callback(child, path, parent);
        return _transform(replacement, callback);
      });
    }

    var replacement = callback(this, null, null);
    return _transform(replacement, callback);
  };

  /**
   * Find any node in the node tree matching given filter function. For example, to
   * find all nodes of type SymbolNode having name 'x':
   *
   *     var results = Node.filter(function (node) {
   *       return (node && node.isSymbolNode) && (node.name == 'x');
   *     });
   *
   * @param {function(node: Node, path: string, parent: Node) : Node} callback
   *            A test function returning true when a node matches, and false
   *            otherwise. Function signature:
   *            callback(node: Node, index: string, parent: Node) : boolean
   * @return {Node[]} nodes       An array with nodes matching given filter criteria
   */
  Node.prototype.filter = function (callback) {
    var nodes = [];

    this.traverse(function (node, path, parent) {
      if (callback(node, path, parent)) {
        nodes.push(node);
      }
    });

    return nodes;
  };

  // TODO: deprecated since version 1.1.0, remove this some day
  Node.prototype.find = function () {
    throw new Error('Function Node.find is deprecated. Use Node.filter instead.');
  };

  // TODO: deprecated since version 1.1.0, remove this some day
  Node.prototype.match = function () {
    throw new Error('Function Node.match is deprecated. See functions Node.filter, Node.transform, Node.traverse.');
  };

  /**
   * Create a shallow clone of this node
   * @return {Node}
   */
  Node.prototype.clone = function () {
    // must be implemented by each of the Node implementations
    throw new Error('Cannot clone a Node interface');
  };

  /**
   * Create a deep clone of this node
   * @return {Node}
   */
  Node.prototype.cloneDeep = function () {
    return this.map(function (node) {
      return node.cloneDeep();
    });
  };

  /**
   * Deep compare this node with another node.
   * @param {Node} other
   * @return {boolean} Returns true when both nodes are of the same type and
   *                   contain the same values (as do their childs)
   */
  Node.prototype.equals = function (other) {
    return other
        ? deepEqual(this, other)
        : false
  };

  /**
   * Get string representation. (wrapper function)
   *
   * This function can get an object of the following form:
   * {
   *    handler: //This can be a callback function of the form
   *             // "function callback(node, options)"or
   *             // a map that maps function names (used in FunctionNodes)
   *             // to callbacks
   *    parenthesis: "keep" //the parenthesis option (This is optional)
   * }
   *
   * @param {Object} [options]
   * @return {string}
   */
  Node.prototype.toString = function (options) {
    var customString;
    if (options && typeof options == "object") {
        switch (typeof options.handler) {
          case 'object':
          case 'undefined':
            break;
          case 'function':
            customString = options.handler(this, options);
            break;
          default:
            throw new TypeError('Object or function expected as callback');
        }
    }

    if (typeof customString !== 'undefined') {
      return customString;
    }

    return this._toString(options);
  };

  /**
   * Internal function to generate the string output.
   * This has to be implemented by every Node
   *
   * @throws {Error}
   */
  Node.prototype._toString = function () {
    //must be implemented by each of the Node implementations
    throw new Error('_toString not implemented for ' + this.type);
  };

  /**
   * Get LaTeX representation. (wrapper function)
   *
   * This function can get an object of the following form:
   * {
   *    handler: //This can be a callback function of the form
   *             // "function callback(node, options)"or
   *             // a map that maps function names (used in FunctionNodes)
   *             // to callbacks
   *    parenthesis: "keep" //the parenthesis option (This is optional)
   * }
   *
   * @param {Object} [options]
   * @return {string}
   */
  Node.prototype.toTex = function (options) {
    var customTex;
    if (options && typeof options == 'object') {
      switch (typeof options.handler) {
        case 'object':
        case 'undefined':
          break;
        case 'function':
          customTex = options.handler(this, options);
          break;
        default:
          throw new TypeError('Object or function expected as callback');
      }
    }

    if (typeof customTex !== 'undefined') {
      return customTex;
    }

    return this._toTex(options);
  };

  /**
   * Internal function to generate the LaTeX output.
   * This has to be implemented by every Node
   *
   * @param {Object} [options]
   * @throws {Error}
   */
  Node.prototype._toTex = function (options) {
    //must be implemented by each of the Node implementations
    throw new Error('_toTex not implemented for ' + this.type);
  };

  /**
   * Get identifier.
   * @return {string}
   */
  Node.prototype.getIdentifier = function () {
    return this.type;
  };

  /**
   * Get the content of the current Node.
   * @return {Node} node
   **/
  Node.prototype.getContent = function () {
    return this;
  };

  /**
   * Validate the symbol names of a scope.
   * Throws an error when the scope contains an illegal symbol.
   * @param {Object} scope
   */
  function _validateScope(scope) {
    for (var symbol in scope) {
      if (scope.hasOwnProperty(symbol)) {
        if (symbol in keywords) {
          throw new Error('Scope contains an illegal symbol, "' + symbol + '" is a reserved keyword');
        }
      }
    }
  }

  return Node;
}

exports.name = 'Node';
exports.path = 'expression.node';
exports.math = true; // request access to the math namespace as 5th argument of the factory function
exports.factory = factory;

},{"../../utils/object":362,"../keywords":207}],218:[function(require,module,exports){
'use strict';

var string = require('../../utils/string');

function factory (type, config, load, typed) {
  var Node = load(require('./Node'));

  /**
   * @constructor ObjectNode
   * @extends {Node}
   * Holds an object with keys/values
   * @param {Object.<string, Node>} [properties]   array with key/value pairs
   */
  function ObjectNode(properties) {
    if (!(this instanceof ObjectNode)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }

    this.properties = properties || {};

    // validate input
    if (properties) {
      if (!(typeof properties === 'object') || Object.keys(properties).some(function (key) {
            return !properties[key] || !properties[key].isNode;
          })) {
        throw new TypeError('Object containing Nodes expected');
      }
    }
  }

  ObjectNode.prototype = new Node();

  ObjectNode.prototype.type = 'ObjectNode';

  ObjectNode.prototype.isObjectNode = true;

  /**
   * Compile the node to javascript code
   * @param {Object} defs     Object which can be used to define functions
   *                          or constants globally available for the compiled
   *                          expression
   * @param {Object} args     Object with local function arguments, the key is
   *                          the name of the argument, and the value is `true`.
   *                          The object may not be mutated, but must be
   *                          extended instead.
   * @return {string} code
   * @private
   */
  ObjectNode.prototype._compile = function (defs, args) {
    var entries = [];
    for (var key in this.properties) {
      if (this.properties.hasOwnProperty(key)) {
        entries.push('"' + key + '": ' + this.properties[key]._compile(defs, args));
      }
    }
    return '{' + entries.join(', ') + '}';
  };

  /**
   * Execute a callback for each of the child nodes of this node
   * @param {function(child: Node, path: string, parent: Node)} callback
   */
  ObjectNode.prototype.forEach = function (callback) {
    for (var key in this.properties) {
      if (this.properties.hasOwnProperty(key)) {
        callback(this.properties[key], 'properties["' + key + '"]', this);
      }
    }
  };

  /**
   * Create a new ObjectNode having it's childs be the results of calling
   * the provided callback function for each of the childs of the original node.
   * @param {function(child: Node, path: string, parent: Node): Node} callback
   * @returns {ObjectNode} Returns a transformed copy of the node
   */
  ObjectNode.prototype.map = function (callback) {
    var properties = {};
    for (var key in this.properties) {
      if (this.properties.hasOwnProperty(key)) {
        properties[key] = this._ifNode(callback(this.properties[key], 'properties["' + key + '"]', this));
      }
    }
    return new ObjectNode(properties);
  };

  /**
   * Create a clone of this node, a shallow copy
   * @return {ObjectNode}
   */
  ObjectNode.prototype.clone = function() {
    var properties = {};
    for (var key in this.properties) {
      if (this.properties.hasOwnProperty(key)) {
        properties[key] = this.properties[key];
      }
    }
    return new ObjectNode(properties);
  };

  /**
   * Get string representation
   * @param {Object} options
   * @return {string} str
   * @override
   */
  ObjectNode.prototype._toString = function(options) {
    var entries = [];
    for (var key in this.properties) {
      if (this.properties.hasOwnProperty(key)) {
        entries.push('"' + key + '": ' + this.properties[key].toString(options));
      }
    }
    return '{' + entries.join(', ') + '}';
  };

  /**
   * Get LaTeX representation
   * @param {Object} options
   * @return {string} str
   */
  ObjectNode.prototype._toTex = function(options) {
    var entries = [];
    for (var key in this.properties) {
      if (this.properties.hasOwnProperty(key)) {
        entries.push("\\mathbf{" + key + ':} & ' + this.properties[key].toTex(options) + "\\\\");
      }
    }
    return '\\left\\{\\begin{array}{ll}' + entries.join('\n') + '\\end{array}\\right\\}';
  };

  return ObjectNode;
}

exports.name = 'ObjectNode';
exports.path = 'expression.node';
exports.factory = factory;

},{"../../utils/string":363,"./Node":217}],219:[function(require,module,exports){
'use strict';

var latex = require('../../utils/latex');
var operators = require('../operators');

function factory (type, config, load, typed, math) {
  var Node         = load(require('./Node'));
  var ConstantNode = load(require('./ConstantNode'));
  var SymbolNode   = load(require('./SymbolNode'));
  var FunctionNode = load(require('./FunctionNode'));

  /**
   * @constructor OperatorNode
   * @extends {Node}
   * An operator with two arguments, like 2+3
   *
   * @param {string} op           Operator name, for example '+'
   * @param {string} fn           Function name, for example 'add'
   * @param {Node[]} args         Operator arguments
   * @param {boolean} [implicit]  Is this an implicit multiplication?
   */
  function OperatorNode(op, fn, args, implicit) {
    if (!(this instanceof OperatorNode)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }

    //validate input
    if (typeof op !== 'string') {
      throw new TypeError('string expected for parameter "op"');
    }
    if (typeof fn !== 'string') {
      throw new TypeError('string expected for parameter "fn"');
    }
    if (!Array.isArray(args)
        || !args.every(function (node) {return node && node.isNode;})) {
      throw new TypeError('Array containing Nodes expected for parameter "args"');
    }

    this.implicit = (implicit === true);
    this.op = op;
    this.fn = fn;
    this.args = args || [];
  }

  OperatorNode.prototype = new Node();

  OperatorNode.prototype.type = 'OperatorNode';

  OperatorNode.prototype.isOperatorNode = true;

  /**
   * Compile the node to javascript code
   * @param {Object} defs     Object which can be used to define functions
   *                          or constants globally available for the compiled
   *                          expression
   * @param {Object} args     Object with local function arguments, the key is
   *                          the name of the argument, and the value is `true`.
   *                          The object may not be mutated, but must be
   *                          extended instead.
   * @return {string} js
   * @private
   */
  OperatorNode.prototype._compile = function (defs, args) {
    if (!defs.math[this.fn]) {
      throw new Error('Function ' + this.fn + ' missing in provided namespace "math"');
    }

    var jsArgs = this.args.map(function (arg) {
      return arg._compile(defs, args);
    });

    return 'math.' + this.fn + '(' + jsArgs.join(', ') + ')';
  };

  /**
   * Execute a callback for each of the child nodes of this node
   * @param {function(child: Node, path: string, parent: Node)} callback
   */
  OperatorNode.prototype.forEach = function (callback) {
    for (var i = 0; i < this.args.length; i++) {
      callback(this.args[i], 'args[' + i + ']', this);
    }
  };

  /**
   * Create a new OperatorNode having it's childs be the results of calling
   * the provided callback function for each of the childs of the original node.
   * @param {function(child: Node, path: string, parent: Node): Node} callback
   * @returns {OperatorNode} Returns a transformed copy of the node
   */
  OperatorNode.prototype.map = function (callback) {
    var args = [];
    for (var i = 0; i < this.args.length; i++) {
      args[i] = this._ifNode(callback(this.args[i], 'args[' + i + ']', this));
    }
    return new OperatorNode(this.op, this.fn, args);
  };

  /**
   * Create a clone of this node, a shallow copy
   * @return {OperatorNode}
   */
  OperatorNode.prototype.clone = function () {
    return new OperatorNode(this.op, this.fn, this.args.slice(0), this.implicit);
  };

  /**
   * Calculate which parentheses are necessary. Gets an OperatorNode
   * (which is the root of the tree) and an Array of Nodes
   * (this.args) and returns an array where 'true' means that an argument
   * has to be enclosed in parentheses whereas 'false' means the opposite.
   *
   * @param {OperatorNode} root
   * @param {string} parenthesis
   * @param {Node[]} args
   * @param {boolean} latex
   * @return {boolean[]}
   * @private
   */
  function calculateNecessaryParentheses(root, parenthesis, args, latex) {
    //precedence of the root OperatorNode
    var precedence = operators.getPrecedence(root, parenthesis);
    var associativity = operators.getAssociativity(root, parenthesis);

    if ((parenthesis === 'all') || ((args.length > 2) && (root.getIdentifier() !== 'OperatorNode:add') && (root.getIdentifier() !== 'OperatorNode:multiply'))) {
      var parens = args.map(function (arg) {
        switch (arg.getContent().type) { //Nodes that don't need extra parentheses
          case 'ArrayNode':
          case 'ConstantNode':
          case 'SymbolNode':
          case 'ParenthesisNode':
            return false;
            break;
          default:
            return true;
        }
      });
      return parens;
    }

    if (args.length === 0) {
      return [];
    } else if (args.length === 1) { //unary operators
      //precedence of the operand
      var operandPrecedence = operators.getPrecedence(args[0], parenthesis);

      //handle special cases for LaTeX, where some of the parentheses aren't needed
      if (latex && (operandPrecedence !== null)) {
        var operandIdentifier;
        var rootIdentifier;
        if (parenthesis === 'keep') {
          operandIdentifier = args[0].getIdentifier();
          rootIdentifier = root.getIdentifier();
        }
        else {
          //Ignore Parenthesis Nodes when not in 'keep' mode
          operandIdentifier = args[0].getContent().getIdentifier();
          rootIdentifier = root.getContent().getIdentifier();
        }
        if (operators.properties[precedence][rootIdentifier].latexLeftParens === false) {
          return [false];
        }

        if (operators.properties[operandPrecedence][operandIdentifier].latexParens === false) {
          return [false];
        }
      }

      if (operandPrecedence === null) {
        //if the operand has no defined precedence, no parens are needed
        return [false];
      }

      if (operandPrecedence <= precedence) {
        //if the operands precedence is lower, parens are needed
        return [true];
      }

      //otherwise, no parens needed
      return [false];
    } else if (args.length === 2) { //binary operators
      var lhsParens; //left hand side needs parenthesis?
      //precedence of the left hand side
      var lhsPrecedence = operators.getPrecedence(args[0], parenthesis);
      //is the root node associative with the left hand side
      var assocWithLhs = operators.isAssociativeWith(root, args[0], parenthesis);

      if (lhsPrecedence === null) {
        //if the left hand side has no defined precedence, no parens are needed
        //FunctionNode for example
        lhsParens = false;
      }
      else if ((lhsPrecedence === precedence) && (associativity === 'right') && !assocWithLhs) {
        //In case of equal precedence, if the root node is left associative
        // parens are **never** necessary for the left hand side.
        //If it is right associative however, parens are necessary
        //if the root node isn't associative with the left hand side
        lhsParens = true;
      }
      else if (lhsPrecedence < precedence) {
        lhsParens = true;
      }
      else {
        lhsParens = false;
      }

      var rhsParens; //right hand side needs parenthesis?
      //precedence of the right hand side
      var rhsPrecedence = operators.getPrecedence(args[1], parenthesis);
      //is the root node associative with the right hand side?
      var assocWithRhs = operators.isAssociativeWith(root, args[1], parenthesis);

      if (rhsPrecedence === null) {
        //if the right hand side has no defined precedence, no parens are needed
        //FunctionNode for example
        rhsParens = false;
      }
      else if ((rhsPrecedence === precedence) && (associativity === 'left') && !assocWithRhs) {
        //In case of equal precedence, if the root node is right associative
        // parens are **never** necessary for the right hand side.
        //If it is left associative however, parens are necessary
        //if the root node isn't associative with the right hand side
        rhsParens = true;
      }
      else if (rhsPrecedence < precedence) {
        rhsParens = true;
      }
      else {
        rhsParens = false;
      }

      //handle special cases for LaTeX, where some of the parentheses aren't needed
      if (latex) {
        var rootIdentifier;
        var lhsIdentifier;
        var rhsIdentifier;
        if (parenthesis === 'keep') {
          rootIdentifier = root.getIdentifier();
          lhsIdentifier = root.args[0].getIdentifier();
          rhsIdentifier = root.args[1].getIdentifier();
        }
        else {
          //Ignore ParenthesisNodes when not in 'keep' mode
          rootIdentifier = root.getContent().getIdentifier();
          lhsIdentifier = root.args[0].getContent().getIdentifier();
          rhsIdentifier = root.args[1].getContent().getIdentifier();
        }

        if (lhsPrecedence !== null) {
          if (operators.properties[precedence][rootIdentifier].latexLeftParens === false) {
            lhsParens = false;
          }

          if (operators.properties[lhsPrecedence][lhsIdentifier].latexParens === false) {
            lhsParens = false;
          }
        }

        if (rhsPrecedence !== null) {
          if (operators.properties[precedence][rootIdentifier].latexRightParens === false) {
            rhsParens = false;
          }

          if (operators.properties[rhsPrecedence][rhsIdentifier].latexParens === false) {
            rhsParens = false;
          }
        }
      }

      return [lhsParens, rhsParens];
    } else if ((args.length > 2) && ((root.getIdentifier() === 'OperatorNode:add') || (root.getIdentifier() === 'OperatorNode:multiply'))) {
      var parensArray = args.map(function (arg) {
        var argPrecedence = operators.getPrecedence(arg, parenthesis);
        var assocWithArg = operators.isAssociativeWith(root, arg, parenthesis);
        var argAssociativity = operators.getAssociativity(arg, parenthesis);
        if (argPrecedence === null) {
          //if the argument has no defined precedence, no parens are needed
          return false;
        } else if ((precedence === argPrecedence) && (associativity === argAssociativity) && !assocWithArg) {
          return true;
        } else if (argPrecedence < precedence) {
          return true;
        }

        return false;
      });
      return parensArray;
    }
  }

  /**
   * Get string representation.
   * @param {Object} options
   * @return {string} str
   */
  OperatorNode.prototype._toString = function (options) {
    var parenthesis = (options && options.parenthesis) ? options.parenthesis : 'keep';
    var implicit = (options && options.implicit) ? options.implicit : 'hide';
    var args = this.args;
    var parens = calculateNecessaryParentheses(this, parenthesis, args, false);

    if (args.length === 1) { //unary operators
      var assoc = operators.getAssociativity(this, parenthesis);

      var operand = args[0].toString(options);
      if (parens[0]) {
        operand = '(' + operand + ')';
      }

      if (assoc === 'right') { //prefix operator
        return this.op + operand;
      }
      else if (assoc === 'left') { //postfix
        return operand + this.op;
      }

      //fall back to postfix
      return operand + this.op;
    } else if (args.length == 2) {
      var lhs = args[0].toString(options); //left hand side
      var rhs = args[1].toString(options); //right hand side
      if (parens[0]) { //left hand side in parenthesis?
        lhs = '(' + lhs + ')';
      }
      if (parens[1]) { //right hand side in parenthesis?
        rhs = '(' + rhs + ')';
      }

      if (this.implicit && (this.getIdentifier() === 'OperatorNode:multiply') && (implicit == 'hide')) {
        return lhs + ' ' + rhs;
      }

      return lhs + ' ' + this.op + ' ' + rhs;
    } else if ((args.length > 2) && ((this.getIdentifier() === 'OperatorNode:add') || (this.getIdentifier() === 'OperatorNode:multiply'))) {
      var stringifiedArgs = args.map(function (arg, index) {
        arg = arg.toString(options);
        if (parens[index]) { //put in parenthesis?
          arg = '(' + arg + ')';
        }

        return arg;
      });

      if (this.implicit && (this.getIdentifier() === 'OperatorNode:multiply') && (implicit === 'hide')) {
        return stringifiedArgs.join(' ');
      }

      return stringifiedArgs.join(' ' + this.op + ' ');
    } else {
      //fallback to formatting as a function call
      return this.fn + '(' + this.args.join(', ') + ')';
    }
  };

  /**
   * Get LaTeX representation
   * @param {Object} options
   * @return {string} str
   */
  OperatorNode.prototype._toTex = function (options) {
    var parenthesis = (options && options.parenthesis) ? options.parenthesis : 'keep';
    var implicit = (options && options.implicit) ? options.implicit : 'hide';
    var args = this.args;
    var parens = calculateNecessaryParentheses(this, parenthesis, args, true);
    var op = latex.operators[this.fn];
    op = typeof op === 'undefined' ? this.op : op; //fall back to using this.op

    if (args.length === 1) { //unary operators
      var assoc = operators.getAssociativity(this, parenthesis);

      var operand = args[0].toTex(options);
      if (parens[0]) {
        operand = '\\left(' + operand + '\\right)';
      }

      if (assoc === 'right') { //prefix operator
        return op + operand;
      }
      else if (assoc === 'left') { //postfix operator
        return operand + op;
      }

      //fall back to postfix
      return operand + op;
    } else if (args.length === 2) { //binary operators
      var lhs = args[0]; //left hand side
      var lhsTex = lhs.toTex(options);
      if (parens[0]) {
        lhsTex = '\\left(' + lhsTex + '\\right)';
      }

      var rhs = args[1]; //right hand side
      var rhsTex = rhs.toTex(options);
      if (parens[1]) {
        rhsTex = '\\left(' + rhsTex + '\\right)';
      }

      //handle some exceptions (due to the way LaTeX works)
      var lhsIdentifier;
      if (parenthesis === 'keep') {
        lhsIdentifier = lhs.getIdentifier();
      }
      else {
        //Ignore ParenthesisNodes if in 'keep' mode
        lhsIdentifier = lhs.getContent().getIdentifier();
      }
      switch (this.getIdentifier()) {
        case 'OperatorNode:divide':
          //op contains '\\frac' at this point
          return op + '{' + lhsTex + '}' + '{' + rhsTex + '}';
        case 'OperatorNode:pow':
          lhsTex = '{' + lhsTex + '}';
          rhsTex = '{' + rhsTex + '}';
          switch (lhsIdentifier) {
            case 'ConditionalNode': //
            case 'OperatorNode:divide':
              lhsTex = '\\left(' + lhsTex + '\\right)';
          }
        case 'OperatorNode:multiply':
          if (this.implicit && (implicit === 'hide')) {
            return lhsTex + '~' + rhsTex;
          }
      }
      return lhsTex + op + rhsTex;
    } else if ((args.length > 2) && ((this.getIdentifier() === 'OperatorNode:add') || (this.getIdentifier() === 'OperatorNode:multiply'))) {
      var texifiedArgs = args.map(function (arg, index) {
        arg = arg.toTex(options);
        if (parens[index]) {
          arg = '\\left(' + arg + '\\right)';
        }
        return arg;
      });

      if ((this.getIdentifier() === 'OperatorNode:multiply') && this.implicit) {
        return texifiedArgs.join('~');
      }

      return texifiedArgs.join(op)
    } else {
      //fall back to formatting as a function call
      //as this is a fallback, it doesn't use
      //fancy function names
      return '\\mathrm{' + this.fn + '}\\left('
          + args.map(function (arg) {
            return arg.toTex(options);
          }).join(',') + '\\right)';
    }
  };

  /**
   * Get identifier.
   * @return {string}
   */
  OperatorNode.prototype.getIdentifier = function () {
    return this.type + ':' + this.fn;
  };

  return OperatorNode;
}

exports.name = 'OperatorNode';
exports.path = 'expression.node';
exports.math = true; // request access to the math namespace as 5th argument of the factory function
exports.factory = factory;

},{"../../utils/latex":360,"../operators":227,"./ConstantNode":213,"./FunctionNode":215,"./Node":217,"./SymbolNode":222}],220:[function(require,module,exports){
'use strict';

function factory (type, config, load, typed) {
  var Node = load(require('./Node'));

  /**
   * @constructor ParenthesisNode
   * @extends {Node}
   * A parenthesis node describes manual parenthesis from the user input
   * @param {Node} content
   * @extends {Node}
   */
  function ParenthesisNode(content) {
    if (!(this instanceof ParenthesisNode)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }

    // validate input
    if (!(content && content.isNode)) {
      throw new TypeError('Node expected for parameter "content"');
    }

    this.content = content;
  }

  ParenthesisNode.prototype = new Node();

  ParenthesisNode.prototype.type = 'ParenthesisNode';

  ParenthesisNode.prototype.isParenthesisNode = true;

  /**
   * Compile the node to javascript code
   * @param {Object} defs     Object which can be used to define functions
   *                          or constants globally available for the compiled
   *                          expression
   * @param {Object} args     Object with local function arguments, the key is
   *                          the name of the argument, and the value is `true`.
   *                          The object may not be mutated, but must be
   *                          extended instead.
   * @return {string} js
   * @private
   */
  ParenthesisNode.prototype._compile = function (defs, args) {
    return this.content._compile(defs, args);
  };

  /**
   * Get the content of the current Node.
   * @return {Node} content
   * @override
   **/
  ParenthesisNode.prototype.getContent = function () {
    return this.content.getContent();
  };

  /**
   * Execute a callback for each of the child nodes of this node
   * @param {function(child: Node, path: string, parent: Node)} callback
   */
  ParenthesisNode.prototype.forEach = function (callback) {
    callback(this.content, 'content', this);
  };

  /**
   * Create a new ParenthesisNode having it's childs be the results of calling
   * the provided callback function for each of the childs of the original node.
   * @param {function(child: Node, path: string, parent: Node) : Node} callback
   * @returns {ParenthesisNode} Returns a clone of the node
   */
  ParenthesisNode.prototype.map = function (callback) {
    var content = callback(this.content, 'content', this);
    return new ParenthesisNode(content);
  };

  /**
   * Create a clone of this node, a shallow copy
   * @return {ParenthesisNode}
   */
  ParenthesisNode.prototype.clone = function() {
    return new ParenthesisNode(this.content);
  };

  /**
   * Get string representation
   * @param {Object} options
   * @return {string} str
   * @override
   */
  ParenthesisNode.prototype._toString = function(options) {
    if ((!options) || (options && !options.parenthesis) || (options && options.parenthesis === 'keep')) {
      return '(' + this.content.toString(options) + ')';
    }
    return this.content.toString(options);
  };

  /**
   * Get LaTeX representation
   * @param {Object} options
   * @return {string} str
   * @override
   */
  ParenthesisNode.prototype._toTex = function(options) {
    if ((!options) || (options && !options.parenthesis) || (options && options.parenthesis === 'keep')) {
      return '\\left(' + this.content.toTex(options) + '\\right)';
    }
    return this.content.toTex(options);
  };

  return ParenthesisNode;
}

exports.name = 'ParenthesisNode';
exports.path = 'expression.node';
exports.factory = factory;

},{"./Node":217}],221:[function(require,module,exports){
'use strict';

var operators = require('../operators');

function factory (type, config, load, typed) {
  var Node = load(require('./Node'));

  /**
   * @constructor RangeNode
   * @extends {Node}
   * create a range
   * @param {Node} start  included lower-bound
   * @param {Node} end    included upper-bound
   * @param {Node} [step] optional step
   */
  function RangeNode(start, end, step) {
    if (!(this instanceof RangeNode)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }

    // validate inputs
    if (!(start && start.isNode)) throw new TypeError('Node expected');
    if (!(end && end.isNode)) throw new TypeError('Node expected');
    if (step && !(step && step.isNode)) throw new TypeError('Node expected');
    if (arguments.length > 3) throw new Error('Too many arguments');

    this.start = start;         // included lower-bound
    this.end = end;           // included upper-bound
    this.step = step || null;  // optional step
  }

  RangeNode.prototype = new Node();

  RangeNode.prototype.type = 'RangeNode';

  RangeNode.prototype.isRangeNode = true;

  /**
   * Check whether the RangeNode needs the `end` symbol to be defined.
   * This end is the size of the Matrix in current dimension.
   * @return {boolean}
   */
  RangeNode.prototype.needsEnd = function () {
    // find all `end` symbols in this RangeNode
    var endSymbols = this.filter(function (node) {
      return (node && node.isSymbolNode) && (node.name == 'end');
    });

    return endSymbols.length > 0;
  };

  /**
   * Compile the node to javascript code
   *
   * When the range has a symbol `end` defined, the RangeNode requires
   * a variable `end` to be defined in the current closure, which must contain
   * the length of the of the matrix that's being handled in the range's
   * dimension. To check whether the `end` variable is needed, call
   * RangeNode.needsEnd().
   *
   * @param {Object} defs     Object which can be used to define functions
   *                          or constants globally available for the compiled
   *                          expression
   * @param {Object} args     Object with local function arguments, the key is
   *                          the name of the argument, and the value is `true`.
   *                          The object may not be mutated, but must be
   *                          extended instead.
   * @return {string} js
   * @private
   */
  RangeNode.prototype._compile = function (defs, args) {
    return 'math.range(' +
        this.start._compile(defs, args) + ', ' +
        this.end._compile(defs, args) +
        (this.step ? (', ' + this.step._compile(defs, args)) : '') +
        ')';
  };

  /**
   * Execute a callback for each of the child nodes of this node
   * @param {function(child: Node, path: string, parent: Node)} callback
   */
  RangeNode.prototype.forEach = function (callback) {
    callback(this.start, 'start', this);
    callback(this.end, 'end', this);
    if (this.step) {
      callback(this.step, 'step', this);
    }
  };

  /**
   * Create a new RangeNode having it's childs be the results of calling
   * the provided callback function for each of the childs of the original node.
   * @param {function(child: Node, path: string, parent: Node): Node} callback
   * @returns {RangeNode} Returns a transformed copy of the node
   */
  RangeNode.prototype.map = function (callback) {
    return new RangeNode(
        this._ifNode(callback(this.start, 'start', this)),
        this._ifNode(callback(this.end, 'end', this)),
        this.step && this._ifNode(callback(this.step, 'step', this))
    );
  };

  /**
   * Create a clone of this node, a shallow copy
   * @return {RangeNode}
   */
  RangeNode.prototype.clone = function () {
    return new RangeNode(this.start, this.end, this.step && this.step);
  };

  /**
   * Calculate the necessary parentheses
   * @param {Node} node
   * @param {string} parenthesis
   * @return {Object} parentheses
   * @private
   */
  function calculateNecessaryParentheses(node, parenthesis) {
    var precedence = operators.getPrecedence(node, parenthesis);
    var parens = {};

    var startPrecedence = operators.getPrecedence(node.start, parenthesis);
    parens.start = ((startPrecedence !== null) && (startPrecedence <= precedence))
      || (parenthesis === 'all');

    if (node.step) {
      var stepPrecedence = operators.getPrecedence(node.step, parenthesis);
      parens.step = ((stepPrecedence !== null) && (stepPrecedence <= precedence))
        || (parenthesis === 'all');
    }

    var endPrecedence = operators.getPrecedence(node.end, parenthesis);
    parens.end = ((endPrecedence !== null) && (endPrecedence <= precedence))
      || (parenthesis === 'all');

    return parens;
  }

  /**
   * Get string representation
   * @param {Object} options
   * @return {string} str
   */
  RangeNode.prototype._toString = function (options) {
    var parenthesis = (options && options.parenthesis) ? options.parenthesis : 'keep';
    var parens = calculateNecessaryParentheses(this, parenthesis);

    //format string as start:step:stop
    var str;

    var start = this.start.toString(options);
    if (parens.start) {
      start = '(' + start + ')';
    }
    str = start;

    if (this.step) {
      var step = this.step.toString(options);
      if (parens.step) {
        step = '(' + step + ')';
      }
      str += ':' + step;
    }

    var end = this.end.toString(options);
    if (parens.end) {
      end = '(' + end + ')';
    }
    str += ':' + end;

    return str;
  };

  /**
   * Get LaTeX representation
   * @params {Object} options
   * @return {string} str
   */
  RangeNode.prototype._toTex = function (options) {
    var parenthesis = (options && options.parenthesis) ? options.parenthesis : 'keep';
    var parens = calculateNecessaryParentheses(this, parenthesis);

    var str = this.start.toTex(options);
    if (parens.start) {
      str = '\\left(' + str + '\\right)';
    }

    if (this.step) {
      var step = this.step.toTex(options);
      if (parens.step) {
        step = '\\left(' + step + '\\right)';
      }
      str += ':' + step;
    }

    var end = this.end.toTex(options);
    if (parens.end) {
      end = '\\left(' + end + '\\right)';
    }
    str += ':' + end;

    return str;
  };

  return RangeNode;
}

exports.name = 'RangeNode';
exports.path = 'expression.node';
exports.factory = factory;

},{"../operators":227,"./Node":217}],222:[function(require,module,exports){
'use strict';

var latex = require('../../utils/latex');

function factory (type, config, load, typed, math) {
  var Node = load(require('./Node'));

  var Unit = load(require('../../type/unit/Unit'));

  /**
   * @constructor SymbolNode
   * @extends {Node}
   * A symbol node can hold and resolve a symbol
   * @param {string} name
   * @extends {Node}
   */
  function SymbolNode(name) {
    if (!(this instanceof SymbolNode)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }

    // validate input
    if (typeof name !== 'string')  throw new TypeError('String expected for parameter "name"');

    this.name = name;
  }

  SymbolNode.prototype = new Node();

  SymbolNode.prototype.type = 'SymbolNode';

  SymbolNode.prototype.isSymbolNode = true;

  /**
   * Compile the node to javascript code
   * @param {Object} defs     Object which can be used to define functions
   *                          or constants globally available for the compiled
   *                          expression
   * @param {Object} args     Object with local function arguments, the key is
   *                          the name of the argument, and the value is `true`.
   *                          The object may not be mutated, but must be
   *                          extended instead.
   * @return {string} js
   * @private
   */
  SymbolNode.prototype._compile = function (defs, args) {
    // add a function to the definitions
    defs['undef'] = undef;
    defs['Unit'] = Unit;

    if (args[this.name]) {
      // this is a FunctionAssignment argument
      // (like an x when inside the expression of a function assignment `f(x) = ...`)
      return this.name;
    }
    else if (this.name in defs.math) {
      return '("' + this.name + '" in scope ? scope["' + this.name + '"] : math["' + this.name + '"])';
    }
    else {
      return '(' +
          '"' + this.name + '" in scope ? scope["' + this.name + '"] : ' +
          (Unit.isValuelessUnit(this.name) ?
          'new Unit(null, "' + this.name + '")' :
          'undef("' + this.name + '")') +
          ')';
    }
  };

  /**
   * Execute a callback for each of the child nodes of this node
   * @param {function(child: Node, path: string, parent: Node)} callback
   */
  SymbolNode.prototype.forEach = function (callback) {
    // nothing to do, we don't have childs
  };

  /**
   * Create a new SymbolNode having it's childs be the results of calling
   * the provided callback function for each of the childs of the original node.
   * @param {function(child: Node, path: string, parent: Node) : Node} callback
   * @returns {SymbolNode} Returns a clone of the node
   */
  SymbolNode.prototype.map = function (callback) {
    return this.clone();
  };

  /**
   * Throws an error 'Undefined symbol {name}'
   * @param {string} name
   */
  function undef (name) {
    throw new Error('Undefined symbol ' + name);
  }

  /**
   * Create a clone of this node, a shallow copy
   * @return {SymbolNode}
   */
  SymbolNode.prototype.clone = function() {
    return new SymbolNode(this.name);
  };

  /**
   * Get string representation
   * @param {Object} options
   * @return {string} str
   * @override
   */
  SymbolNode.prototype._toString = function(options) {
    return this.name;
  };

  /**
   * Get LaTeX representation
   * @param {Object} options
   * @return {string} str
   * @override
   */
  SymbolNode.prototype._toTex = function(options) {
    var isUnit = false;
    if ((typeof math[this.name] === 'undefined') && Unit.isValuelessUnit(this.name)) {
      isUnit = true;
    }
    var symbol = latex.toSymbol(this.name, isUnit);
    if (symbol[0] === '\\') {
      //no space needed if the symbol starts with '\'
      return symbol;
    }
    //the space prevents symbols from breaking stuff like '\cdot' if it's written right before the symbol
    return ' ' + symbol;
  };

  return SymbolNode;
}

exports.name = 'SymbolNode';
exports.path = 'expression.node';
exports.math = true; // request access to the math namespace as 5th argument of the factory function
exports.factory = factory;

},{"../../type/unit/Unit":344,"../../utils/latex":360,"./Node":217}],223:[function(require,module,exports){
'use strict';

function factory (type, config, load, typed) {
  /**
   * @constructor UpdateNode
   */
  function UpdateNode() {
    // TODO: deprecated since v3. Cleanup some day
    throw new Error('UpdateNode is deprecated. Use AssignmentNode instead.');
  }

  return UpdateNode;
}

exports.name = 'UpdateNode';
exports.path = 'expression.node';
exports.factory = factory;

},{}],224:[function(require,module,exports){
module.exports = [
  require('./AccessorNode'),
  require('./ArrayNode'),
  require('./AssignmentNode'),
  require('./BlockNode'),
  require('./ConditionalNode'),
  require('./ConstantNode'),
  require('./IndexNode'),
  require('./FunctionAssignmentNode'),
  require('./FunctionNode'),
  require('./Node'),
  require('./ObjectNode'),
  require('./OperatorNode'),
  require('./ParenthesisNode'),
  require('./RangeNode'),
  require('./SymbolNode'),
  require('./UpdateNode')
];

},{"./AccessorNode":208,"./ArrayNode":209,"./AssignmentNode":210,"./BlockNode":211,"./ConditionalNode":212,"./ConstantNode":213,"./FunctionAssignmentNode":214,"./FunctionNode":215,"./IndexNode":216,"./Node":217,"./ObjectNode":218,"./OperatorNode":219,"./ParenthesisNode":220,"./RangeNode":221,"./SymbolNode":222,"./UpdateNode":223}],225:[function(require,module,exports){
'use strict';

var errorTransform = require('../../transform/error.transform').transform;

function factory (type, config, load, typed) {
  var subset = load(require('../../../function/matrix/subset'));
  var matrix = load(require('../../../type/matrix/function/matrix'));

  /**
   * Retrieve part of an object:
   *
   * - Retrieve a property from an object
   * - Retrieve a part of a string
   * - Retrieve a matrix subset
   *
   * @param {Object | Array | Matrix | string} object
   * @param {Index} index
   * @return {Object | Array | Matrix | string} Returns the subset
   */
  return function access(object, index) {
    try {
      if (Array.isArray(object)) {
        return matrix(object).subset(index).valueOf();
      }
      else if (object && typeof object.subset === 'function') { // Matrix
        return object.subset(index);
      }
      else if (typeof object === 'string') {
        // TODO: move getStringSubset into a separate util file, use that
        return subset(object, index);
      }
      else if (typeof object === 'object') {
        if (!index.isObjectProperty()) {
          throw TypeError('Cannot apply a numeric index as object property');
        }
        return object[index.getObjectProperty()];
      }
      else {
        throw new TypeError('Cannot apply index: unsupported type of object');
      }
    }
    catch (err) {
      throw errorTransform(err);
    }
  }
}

exports.factory = factory;

},{"../../../function/matrix/subset":283,"../../../type/matrix/function/matrix":328,"../../transform/error.transform":230}],226:[function(require,module,exports){
'use strict';

var errorTransform = require('../../transform/error.transform').transform;

function factory (type, config, load, typed) {
  var subset = load(require('../../../function/matrix/subset'));
  var matrix = load(require('../../../type/matrix/function/matrix'));

  /**
   * Replace part of an object:
   *
   * - Assign a property to an object
   * - Replace a part of a string
   * - Replace a matrix subset
   *
   * @param {Object | Array | Matrix | string} object
   * @param {Index} index
   * @param {*} value
   * @return {Object | Array | Matrix | string} Returns the original object
   *                                            except in case of a string
   */
  return function assign(object, index, value) {
    try {
      if (Array.isArray(object)) {
        return matrix(object).subset(index, value).valueOf();
      }
      else if (object && typeof object.subset === 'function') { // Matrix
        return object.subset(index, value);
      }
      else if (typeof object === 'string') {
        // TODO: move setStringSubset into a separate util file, use that
        return subset(object, index, value);
      }
      else if (typeof object === 'object') {
        if (!index.isObjectProperty()) {
          throw TypeError('Cannot apply a numeric index as object property');
        }
        object[index.getObjectProperty()] = value;
        return object;
      }
      else {
        throw new TypeError('Cannot apply index: unsupported type of object');
      }
    }
    catch (err) {
        throw errorTransform(err);
    }
  }
}

exports.factory = factory;

},{"../../../function/matrix/subset":283,"../../../type/matrix/function/matrix":328,"../../transform/error.transform":230}],227:[function(require,module,exports){
'use strict'

//list of identifiers of nodes in order of their precedence
//also contains information about left/right associativity
//and which other operator the operator is associative with
//Example:
// addition is associative with addition and subtraction, because:
// (a+b)+c=a+(b+c)
// (a+b)-c=a+(b-c)
//
// postfix operators are left associative, prefix operators 
// are right associative
//
//It's also possible to set the following properties:
// latexParens: if set to false, this node doesn't need to be enclosed
//              in parentheses when using LaTeX
// latexLeftParens: if set to false, this !OperatorNode's! 
//                  left argument doesn't need to be enclosed
//                  in parentheses
// latexRightParens: the same for the right argument
var properties = [
  { //assignment
    'AssignmentNode': {},
    'FunctionAssignmentNode': {}
  },
  { //conditional expression
    'ConditionalNode': {
      latexLeftParens: false,
      latexRightParens: false,
      latexParens: false
      //conditionals don't need parentheses in LaTeX because
      //they are 2 dimensional
    }
  },
  { //logical or
    'OperatorNode:or': {
      associativity: 'left',
      associativeWith: []
    }

  },
  { //logical xor
    'OperatorNode:xor': {
      associativity: 'left',
      associativeWith: []
    }
  },
  { //logical and
    'OperatorNode:and': {
      associativity: 'left',
      associativeWith: []
    }
  },
  { //bitwise or
    'OperatorNode:bitOr': {
      associativity: 'left',
      associativeWith: []
    }
  },
  { //bitwise xor
    'OperatorNode:bitXor': {
      associativity: 'left',
      associativeWith: []
    }
  },
  { //bitwise and
    'OperatorNode:bitAnd': {
      associativity: 'left',
      associativeWith: []
    }
  },
  { //relational operators
    'OperatorNode:equal': {
      associativity: 'left',
      associativeWith: []
    },
    'OperatorNode:unequal': {
      associativity: 'left',
      associativeWith: []
    },
    'OperatorNode:smaller': {
      associativity: 'left',
      associativeWith: []
    },
    'OperatorNode:larger': {
      associativity: 'left',
      associativeWith: []
    },
    'OperatorNode:smallerEq': {
      associativity: 'left',
      associativeWith: []
    },
    'OperatorNode:largerEq': {
      associativity: 'left',
      associativeWith: []
    }
  },
  { //bitshift operators
    'OperatorNode:leftShift': {
      associativity: 'left',
      associativeWith: []
    },
    'OperatorNode:rightArithShift': {
      associativity: 'left',
      associativeWith: []
    },
    'OperatorNode:rightLogShift': {
      associativity: 'left',
      associativeWith: []
    }
  },
  { //unit conversion
    'OperatorNode:to': {
      associativity: 'left',
      associativeWith: []
    }
  },
  { //range
    'RangeNode': {}
  },
  { //addition, subtraction
    'OperatorNode:add': {
      associativity: 'left',
      associativeWith: ['OperatorNode:add', 'OperatorNode:subtract']
    },
    'OperatorNode:subtract': {
      associativity: 'left',
      associativeWith: []
    }
  },
  { //multiply, divide, modulus
    'OperatorNode:multiply': {
      associativity: 'left',
      associativeWith: [
        'OperatorNode:multiply',
        'OperatorNode:divide',
        'Operator:dotMultiply',
        'Operator:dotDivide'
      ]
    },
    'OperatorNode:divide': {
      associativity: 'left',
      associativeWith: [],
      latexLeftParens: false,
      latexRightParens: false,
      latexParens: false
      //fractions don't require parentheses because
      //they're 2 dimensional, so parens aren't needed
      //in LaTeX
    },
    'OperatorNode:dotMultiply': {
      associativity: 'left',
      associativeWith: [
        'OperatorNode:multiply',
        'OperatorNode:divide',
        'OperatorNode:dotMultiply',
        'OperatorNode:doDivide'
      ]
    },
    'OperatorNode:dotDivide': {
      associativity: 'left',
      associativeWith: []
    },
    'OperatorNode:mod': {
      associativity: 'left',
      associativeWith: []
    }
  },
  { //unary prefix operators
    'OperatorNode:unaryPlus': {
      associativity: 'right'
    },
    'OperatorNode:unaryMinus': {
      associativity: 'right'
    },
    'OperatorNode:bitNot': {
      associativity: 'right'
    },
    'OperatorNode:not': {
      associativity: 'right'
    }
  },
  { //exponentiation
    'OperatorNode:pow': {
      associativity: 'right',
      associativeWith: [],
      latexRightParens: false
      //the exponent doesn't need parentheses in
      //LaTeX because it's 2 dimensional
      //(it's on top)
    },
    'OperatorNode:dotPow': {
      associativity: 'right',
      associativeWith: []
    }
  },
  { //factorial
    'OperatorNode:factorial': {
      associativity: 'left'
    }
  },
  { //matrix transpose
    'OperatorNode:transpose': {
      associativity: 'left'
    }
  }
];

/**
 * Get the precedence of a Node.
 * Higher number for higher precedence, starting with 0.
 * Returns null if the precedence is undefined.
 *
 * @param {Node}
 * @param {string} parenthesis
 * @return {number|null}
 */
function getPrecedence (_node, parenthesis) {
  var node = _node;
  if (parenthesis !== 'keep') {
    //ParenthesisNodes are only ignored when not in 'keep' mode
    node = _node.getContent();
  }
  var identifier = node.getIdentifier();
  for (var i = 0; i < properties.length; i++) {
    if (identifier in properties[i]) {
      return i;
    }
  }
  return null;
}

/**
 * Get the associativity of an operator (left or right).
 * Returns a string containing 'left' or 'right' or null if
 * the associativity is not defined.
 *
 * @param {Node}
 * @param {string} parenthesis
 * @return {string|null}
 * @throws {Error}
 */
function getAssociativity (_node, parenthesis) {
  var node = _node;
  if (parenthesis !== 'keep') {
    //ParenthesisNodes are only ignored when not in 'keep' mode
    node = _node.getContent();
  }
  var identifier = node.getIdentifier();
  var index = getPrecedence(node, parenthesis);
  if (index === null) {
    //node isn't in the list
    return null;
  }
  var property = properties[index][identifier];

  if (property.hasOwnProperty('associativity')) {
    if (property.associativity === 'left') {
      return 'left';
    }
    if (property.associativity === 'right') {
      return 'right';
    }
    //associativity is invalid
    throw Error('\'' + identifier + '\' has the invalid associativity \''
                + property.associativity + '\'.');
  }

  //associativity is undefined
  return null;
}

/**
 * Check if an operator is associative with another operator.
 * Returns either true or false or null if not defined.
 *
 * @param {Node} nodeA
 * @param {Node} nodeB
 * @param {string} parenthesis
 * @return {bool|null}
 */
function isAssociativeWith (nodeA, nodeB, parenthesis) {
  var a = nodeA;
  var b = nodeB;
  if (parenthesis !== 'keep') {
    //ParenthesisNodes are only ignored when not in 'keep' mode
    var a = nodeA.getContent();
    var b = nodeB.getContent();
  }
  var identifierA = a.getIdentifier();
  var identifierB = b.getIdentifier();
  var index = getPrecedence(a, parenthesis);
  if (index === null) {
    //node isn't in the list
    return null;
  }
  var property = properties[index][identifierA];

  if (property.hasOwnProperty('associativeWith')
      && (property.associativeWith instanceof Array)) {
    for (var i = 0; i < property.associativeWith.length; i++) {
      if (property.associativeWith[i] === identifierB) {
        return true;
      }
    }
    return false;
  }

  //associativeWith is not defined
  return null;
}

module.exports.properties = properties;
module.exports.getPrecedence = getPrecedence;
module.exports.getAssociativity = getAssociativity;
module.exports.isAssociativeWith = isAssociativeWith;

},{}],228:[function(require,module,exports){
'use strict';

var ArgumentsError = require('../error/ArgumentsError');
var deepMap = require('../utils/collection/deepMap');

function factory (type, config, load, typed) {
  var AccessorNode            = load(require('./node/AccessorNode'));
  var ArrayNode               = load(require('./node/ArrayNode'));
  var AssignmentNode          = load(require('./node/AssignmentNode'));
  var BlockNode               = load(require('./node/BlockNode'));
  var ConditionalNode         = load(require('./node/ConditionalNode'));
  var ConstantNode            = load(require('./node/ConstantNode'));
  var FunctionAssignmentNode  = load(require('./node/FunctionAssignmentNode'));
  var IndexNode               = load(require('./node/IndexNode'));
  var ObjectNode              = load(require('./node/ObjectNode'));
  var OperatorNode            = load(require('./node/OperatorNode'));
  var ParenthesisNode         = load(require('./node/ParenthesisNode'));
  var FunctionNode            = load(require('./node/FunctionNode'));
  var RangeNode               = load(require('./node/RangeNode'));
  var SymbolNode              = load(require('./node/SymbolNode'));


  /**
   * Parse an expression. Returns a node tree, which can be evaluated by
   * invoking node.eval();
   *
   * Syntax:
   *
   *     parse(expr)
   *     parse(expr, options)
   *     parse([expr1, expr2, expr3, ...])
   *     parse([expr1, expr2, expr3, ...], options)
   *
   * Example:
   *
   *     var node = parse('sqrt(3^2 + 4^2)');
   *     node.compile(math).eval(); // 5
   *
   *     var scope = {a:3, b:4}
   *     var node = parse('a * b'); // 12
   *     var code = node.compile(math);
   *     code.eval(scope); // 12
   *     scope.a = 5;
   *     code.eval(scope); // 20
   *
   *     var nodes = math.parse(['a = 3', 'b = 4', 'a * b']);
   *     nodes[2].compile(math).eval(); // 12
   *
   * @param {string | string[] | Matrix} expr
   * @param {{nodes: Object<string, Node>}} [options]  Available options:
   *                                                   - `nodes` a set of custom nodes
   * @return {Node | Node[]} node
   * @throws {Error}
   */
  function parse (expr, options) {
    if (arguments.length != 1 && arguments.length != 2) {
      throw new ArgumentsError('parse', arguments.length, 1, 2);
    }

    // pass extra nodes
    extra_nodes = (options && options.nodes) ? options.nodes : {};

    if (typeof expr === 'string') {
      // parse a single expression
      expression = expr;
      return parseStart();
    }
    else if (Array.isArray(expr) || expr instanceof type.Matrix) {
      // parse an array or matrix with expressions
      return deepMap(expr, function (elem) {
        if (typeof elem !== 'string') throw new TypeError('String expected');

        expression = elem;
        return parseStart();
      });
    }
    else {
      // oops
      throw new TypeError('String or matrix expected');
    }
  }

  // token types enumeration
  var TOKENTYPE = {
    NULL : 0,
    DELIMITER : 1,
    NUMBER : 2,
    SYMBOL : 3,
    UNKNOWN : 4
  };

  // map with all delimiters
  var DELIMITERS = {
    ',': true,
    '(': true,
    ')': true,
    '[': true,
    ']': true,
    '{': true,
    '}': true,
    '\"': true,
    ';': true,

    '+': true,
    '-': true,
    '*': true,
    '.*': true,
    '/': true,
    './': true,
    '%': true,
    '^': true,
    '.^': true,
    '~': true,
    '!': true,
    '&': true,
    '|': true,
    '^|': true,
    '\'': true,
    '=': true,
    ':': true,
    '?': true,

    '==': true,
    '!=': true,
    '<': true,
    '>': true,
    '<=': true,
    '>=': true,

    '<<': true,
    '>>': true,
    '>>>': true
  };

  // map with all named delimiters
  var NAMED_DELIMITERS = {
    'mod': true,
    'to': true,
    'in': true,
    'and': true,
    'xor': true,
    'or': true,
    'not': true
  };

  var extra_nodes = {};             // current extra nodes
  var expression = '';              // current expression
  var comment = '';                 // last parsed comment
  var index = 0;                    // current index in expr
  var c = '';                       // current token character in expr
  var token = '';                   // current token
  var token_type = TOKENTYPE.NULL;  // type of the token
  var nesting_level = 0;            // level of nesting inside parameters, used to ignore newline characters
  var conditional_level = null;     // when a conditional is being parsed, the level of the conditional is stored here

  /**
   * Get the first character from the expression.
   * The character is stored into the char c. If the end of the expression is
   * reached, the function puts an empty string in c.
   * @private
   */
  function first() {
    index = 0;
    c = expression.charAt(0);
    nesting_level = 0;
    conditional_level = null;
  }

  /**
   * Get the next character from the expression.
   * The character is stored into the char c. If the end of the expression is
   * reached, the function puts an empty string in c.
   * @private
   */
  function next() {
    index++;
    c = expression.charAt(index);
  }

  /**
   * Preview the previous character from the expression.
   * @return {string} cNext
   * @private
   */
  function prevPreview() {
    return expression.charAt(index - 1);
  }

  /**
   * Preview the next character from the expression.
   * @return {string} cNext
   * @private
   */
  function nextPreview() {
    return expression.charAt(index + 1);
  }

  /**
   * Preview the second next character from the expression.
   * @return {string} cNext
   * @private
   */
  function nextNextPreview() {
    return expression.charAt(index + 2);
  }

  /**
   * Get next token in the current string expr.
   * The token and token type are available as token and token_type
   * @private
   */
  function getToken() {
    token_type = TOKENTYPE.NULL;
    token = '';
    comment = '';

    // skip over whitespaces
    // space, tab, and newline when inside parameters
    while (parse.isWhitespace(c, nesting_level)) {
      next();
    }

    // skip comment
    if (c == '#') {
      while (c != '\n' && c != '') {
        comment += c;
        next();
      }
    }

    // check for end of expression
    if (c == '') {
      // token is still empty
      token_type = TOKENTYPE.DELIMITER;
      return;
    }

    // check for new line character
    if (c == '\n' && !nesting_level) {
      token_type = TOKENTYPE.DELIMITER;
      token = c;
      next();
      return;
    }

    // check for delimiters consisting of 3 characters
    var c2 = c + nextPreview();
    var c3 = c2 + nextNextPreview();
    if (c3.length == 3 && DELIMITERS[c3]) {
      token_type = TOKENTYPE.DELIMITER;
      token = c3;
      next();
      next();
      next();
      return;
    }

    // check for delimiters consisting of 2 characters
    if (c2.length == 2 && DELIMITERS[c2]) {
      token_type = TOKENTYPE.DELIMITER;
      token = c2;
      next();
      next();
      return;
    }

    // check for delimiters consisting of 1 character
    if (DELIMITERS[c]) {
      token_type = TOKENTYPE.DELIMITER;
      token = c;
      next();
      return;
    }

    // check for a number
    if (parse.isDigitDot(c)) {
      token_type = TOKENTYPE.NUMBER;

      // get number, can have a single dot
      if (c == '.') {
        token += c;
        next();

        if (!parse.isDigit(c)) {
          // this is no number, it is just a dot (can be dot notation)
          token_type = TOKENTYPE.DELIMITER;
        }
      }
      else {
        while (parse.isDigit(c)) {
          token += c;
          next();
        }
        if (parse.isDecimalMark(c, nextPreview())) {
          token += c;
          next();
        }
      }
      while (parse.isDigit(c)) {
        token += c;
        next();
      }

      // check for exponential notation like "2.3e-4", "1.23e50" or "2e+4"
      c2 = nextPreview();
      if (c == 'E' || c == 'e') {
        if (parse.isDigit(c2) || c2 == '-' || c2 == '+') {
          token += c;
          next();

          if (c == '+' || c == '-') {
            token += c;
            next();
          }

          // Scientific notation MUST be followed by an exponent
          if (!parse.isDigit(c)) {
            throw createSyntaxError('Digit expected, got "' + c + '"');
          }

          while (parse.isDigit(c)) {
            token += c;
            next();
          }

          if (parse.isDecimalMark(c, nextPreview())) {
            throw createSyntaxError('Digit expected, got "' + c + '"');
          }
        }
        else if (c2 == '.') {
          next();
          throw createSyntaxError('Digit expected, got "' + c + '"');
        }
      }

      return;
    }

    // check for variables, functions, named operators
    if (parse.isAlpha(c, prevPreview(), nextPreview())) {
      while (parse.isAlpha(c, prevPreview(), nextPreview()) || parse.isDigit(c)) {
        token += c;
        next();
      }

      if (NAMED_DELIMITERS.hasOwnProperty(token)) {
        token_type = TOKENTYPE.DELIMITER;
      }
      else {
        token_type = TOKENTYPE.SYMBOL;
      }

      return;
    }

    // something unknown is found, wrong characters -> a syntax error
    token_type = TOKENTYPE.UNKNOWN;
    while (c != '') {
      token += c;
      next();
    }
    throw createSyntaxError('Syntax error in part "' + token + '"');
  }

  /**
   * Get next token and skip newline tokens
   */
  function getTokenSkipNewline () {
    do {
      getToken();
    }
    while (token == '\n');
  }

  /**
   * Open parameters.
   * New line characters will be ignored until closeParams() is called
   */
  function openParams() {
    nesting_level++;
  }

  /**
   * Close parameters.
   * New line characters will no longer be ignored
   */
  function closeParams() {
    nesting_level--;
  }

  /**
   * Checks whether the current character `c` is a valid alpha character:
   *
   * - A latin letter (upper or lower case) Ascii: a-z, A-Z
   * - An underscore                         Ascii: _
   * - A latin letter with accents          Unicode: \u00C0 - \u02AF
   * - A greek letter                       Unicode: \u0370 - \u03FF
   * - A mathematical alphanumeric symbol   Unicode: \u{1D400} - \u{1D7FF} excluding invalid code points
   *
   * The previous and next characters are needed to determine whether
   * this character is part of a unicode surrogate pair.
   *
   * @param {string} c      Current character in the expression
   * @param {string} cPrev  Previous character
   * @param {string} cNext  Next character
   * @return {boolean}
   */
  parse.isAlpha = function isAlpha (c, cPrev, cNext) {
    return parse.isValidLatinOrGreek(c)
        || parse.isValidMathSymbol(c, cNext)
        || parse.isValidMathSymbol(cPrev, c);
  };

  /**
   * Test whether a character is a valid latin, greek, or letter-like character
   * @param {string} c
   * @return {boolean}
   */
  parse.isValidLatinOrGreek = function isValidLatinOrGreek (c) {
    return /^[a-zA-Z_\u00C0-\u02AF\u0370-\u03FF\u2100-\u214F]$/.test(c);
  };

  /**
   * Test whether two given 16 bit characters form a surrogate pair of a
   * unicode math symbol.
   *
   * http://unicode-table.com/en/
   * http://www.wikiwand.com/en/Mathematical_operators_and_symbols_in_Unicode
   *
   * Note: In ES6 will be unicode aware:
   * http://stackoverflow.com/questions/280712/javascript-unicode-regexes
   * https://mathiasbynens.be/notes/es6-unicode-regex
   *
   * @param {string} high
   * @param {string} low
   * @return {boolean}
   */
  parse.isValidMathSymbol = function isValidMathSymbol (high, low) {
    return /^[\uD835]$/.test(high) &&
        /^[\uDC00-\uDFFF]$/.test(low) &&
        /^[^\uDC55\uDC9D\uDCA0\uDCA1\uDCA3\uDCA4\uDCA7\uDCA8\uDCAD\uDCBA\uDCBC\uDCC4\uDD06\uDD0B\uDD0C\uDD15\uDD1D\uDD3A\uDD3F\uDD45\uDD47-\uDD49\uDD51\uDEA6\uDEA7\uDFCC\uDFCD]$/.test(low);
  };

  /**
   * Check whether given character c is a white space character: space, tab, or enter
   * @param {string} c
   * @param {number} nestingLevel
   * @return {boolean}
   */
  parse.isWhitespace = function isWhitespace (c, nestingLevel) {
    // TODO: also take '\r' carriage return as newline? Or does that give problems on mac?
    return c == ' ' || c == '\t' || (c == '\n' && nestingLevel > 0);
  };

  /**
   * Test whether the character c is a decimal mark (dot).
   * This is the case when it's not the start of a delimiter '.*', './', or '.^'
   * @param {string} c
   * @param {string} cNext
   * @return {boolean}
   */
  parse.isDecimalMark = function isDecimalMark (c, cNext) {
    return c == '.' && cNext !== '/' && cNext !== '*' && cNext !== '^';
  };

  /**
   * checks if the given char c is a digit or dot
   * @param {string} c   a string with one character
   * @return {boolean}
   */
  parse.isDigitDot = function isDigitDot (c) {
    return ((c >= '0' && c <= '9') || c == '.');
  };

  /**
   * checks if the given char c is a digit
   * @param {string} c   a string with one character
   * @return {boolean}
   */
  parse.isDigit = function isDigit (c) {
    return (c >= '0' && c <= '9');
  };

  /**
   * Start of the parse levels below, in order of precedence
   * @return {Node} node
   * @private
   */
  function parseStart () {
    // get the first character in expression
    first();

    getToken();

    var node = parseBlock();

    // check for garbage at the end of the expression
    // an expression ends with a empty character '' and token_type DELIMITER
    if (token != '') {
      if (token_type == TOKENTYPE.DELIMITER) {
        // user entered a not existing operator like "//"

        // TODO: give hints for aliases, for example with "<>" give as hint " did you mean != ?"
        throw createError('Unexpected operator ' + token);
      }
      else {
        throw createSyntaxError('Unexpected part "' + token + '"');
      }
    }

    return node;
  }

  /**
   * Parse a block with expressions. Expressions can be separated by a newline
   * character '\n', or by a semicolon ';'. In case of a semicolon, no output
   * of the preceding line is returned.
   * @return {Node} node
   * @private
   */
  function parseBlock () {
    var node;
    var blocks = [];
    var visible;

    if (token == '') {
      // empty expression
      node = new ConstantNode('undefined', 'undefined');
      node.comment = comment;
      return node
    }

    if (token != '\n' && token != ';') {
      node = parseAssignment();
      node.comment = comment;
    }

    // TODO: simplify this loop
    while (token == '\n' || token == ';') {
      if (blocks.length == 0 && node) {
        visible = (token != ';');
        blocks.push({
          node: node,
          visible: visible
        });
      }

      getToken();
      if (token != '\n' && token != ';' && token != '') {
        node = parseAssignment();
        node.comment = comment;

        visible = (token != ';');
        blocks.push({
          node: node,
          visible: visible
        });
      }
    }

    if (blocks.length > 0) {
      return new BlockNode(blocks);
    }
    else {
      return node;
    }
  }

  /**
   * Assignment of a function or variable,
   * - can be a variable like 'a=2.3'
   * - or a updating an existing variable like 'matrix(2,3:5)=[6,7,8]'
   * - defining a function like 'f(x) = x^2'
   * @return {Node} node
   * @private
   */
  function parseAssignment () {
    var name, args, value, valid;

    var node = parseConditional();

    if (token == '=') {
      if (node && node.isSymbolNode) {
        // parse a variable assignment like 'a = 2/3'
        name = node.name;
        getTokenSkipNewline();
        value = parseAssignment();
        return new AssignmentNode(new SymbolNode(name), value);
      }
      else if (node && node.isAccessorNode) {
        // parse a matrix subset assignment like 'A[1,2] = 4'
        getTokenSkipNewline();
        value = parseAssignment();
        return new AssignmentNode(node.object, node.index, value);
      }
      else if (node && node.isFunctionNode) {
        // parse function assignment like 'f(x) = x^2'
        valid = true;
        args = [];

        name = node.name;
        node.args.forEach(function (arg, index) {
          if (arg && arg.isSymbolNode) {
            args[index] = arg.name;
          }
          else {
            valid = false;
          }
        });

        if (valid) {
          getTokenSkipNewline();
          value = parseAssignment();
          return new FunctionAssignmentNode(name, args, value);
        }
      }

      throw createSyntaxError('Invalid left hand side of assignment operator =');
    }

    return node;
  }

  /**
   * conditional operation
   *
   *     condition ? truePart : falsePart
   *
   * Note: conditional operator is right-associative
   *
   * @return {Node} node
   * @private
   */
  function parseConditional () {
    var node = parseLogicalOr();

    while (token == '?') {
      // set a conditional level, the range operator will be ignored as long
      // as conditional_level == nesting_level.
      var prev = conditional_level;
      conditional_level = nesting_level;
      getTokenSkipNewline();

      var condition = node;
      var trueExpr = parseAssignment();

      if (token != ':') throw createSyntaxError('False part of conditional expression expected');

      conditional_level = null;
      getTokenSkipNewline();

      var falseExpr = parseAssignment(); // Note: check for conditional operator again, right associativity

      node = new ConditionalNode(condition, trueExpr, falseExpr);

      // restore the previous conditional level
      conditional_level = prev;
    }

    return node;
  }

  /**
   * logical or, 'x or y'
   * @return {Node} node
   * @private
   */
  function parseLogicalOr() {
    var node = parseLogicalXor();

    while (token == 'or') {
      getTokenSkipNewline();
      node = new OperatorNode('or', 'or', [node, parseLogicalXor()]);
    }

    return node;
  }

  /**
   * logical exclusive or, 'x xor y'
   * @return {Node} node
   * @private
   */
  function parseLogicalXor() {
    var node = parseLogicalAnd();

    while (token == 'xor') {
      getTokenSkipNewline();
      node = new OperatorNode('xor', 'xor', [node, parseLogicalAnd()]);
    }

    return node;
  }

  /**
   * logical and, 'x and y'
   * @return {Node} node
   * @private
   */
  function parseLogicalAnd() {
    var node = parseBitwiseOr();

    while (token == 'and') {
      getTokenSkipNewline();
      node = new OperatorNode('and', 'and', [node, parseBitwiseOr()]);
    }

    return node;
  }

  /**
   * bitwise or, 'x | y'
   * @return {Node} node
   * @private
   */
  function parseBitwiseOr() {
    var node = parseBitwiseXor();

    while (token == '|') {
      getTokenSkipNewline();
      node = new OperatorNode('|', 'bitOr', [node, parseBitwiseXor()]);
    }

    return node;
  }

  /**
   * bitwise exclusive or (xor), 'x ^| y'
   * @return {Node} node
   * @private
   */
  function parseBitwiseXor() {
    var node = parseBitwiseAnd();

    while (token == '^|') {
      getTokenSkipNewline();
      node = new OperatorNode('^|', 'bitXor', [node, parseBitwiseAnd()]);
    }

    return node;
  }

  /**
   * bitwise and, 'x & y'
   * @return {Node} node
   * @private
   */
  function parseBitwiseAnd () {
    var node = parseRelational();

    while (token == '&') {
      getTokenSkipNewline();
      node = new OperatorNode('&', 'bitAnd', [node, parseRelational()]);
    }

    return node;
  }

  /**
   * relational operators
   * @return {Node} node
   * @private
   */
  function parseRelational () {
    var node, operators, name, fn, params;

    node = parseShift();

    operators = {
      '==': 'equal',
      '!=': 'unequal',
      '<': 'smaller',
      '>': 'larger',
      '<=': 'smallerEq',
      '>=': 'largerEq'
    };
    while (token in operators) {
      name = token;
      fn = operators[name];

      getTokenSkipNewline();
      params = [node, parseShift()];
      node = new OperatorNode(name, fn, params);
    }

    return node;
  }

  /**
   * Bitwise left shift, bitwise right arithmetic shift, bitwise right logical shift
   * @return {Node} node
   * @private
   */
  function parseShift () {
    var node, operators, name, fn, params;

    node = parseConversion();

    operators = {
      '<<' : 'leftShift',
      '>>' : 'rightArithShift',
      '>>>' : 'rightLogShift'
    };

    while (token in operators) {
      name = token;
      fn = operators[name];

      getTokenSkipNewline();
      params = [node, parseConversion()];
      node = new OperatorNode(name, fn, params);
    }

    return node;
  }

  /**
   * conversion operators 'to' and 'in'
   * @return {Node} node
   * @private
   */
  function parseConversion () {
    var node, operators, name, fn, params;

    node = parseRange();

    operators = {
      'to' : 'to',
      'in' : 'to'   // alias of 'to'
    };

    while (token in operators) {
      name = token;
      fn = operators[name];

      getTokenSkipNewline();
      
      if (name === 'in' && token === '') {
        // end of expression -> this is the unit 'in' ('inch')
        node = new OperatorNode('*', 'multiply', [node, new SymbolNode('in')], true);
      }
      else {
        // operator 'a to b' or 'a in b'
        params = [node, parseRange()];
        node = new OperatorNode(name, fn, params);
      }
    }

    return node;
  }

  /**
   * parse range, "start:end", "start:step:end", ":", "start:", ":end", etc
   * @return {Node} node
   * @private
   */
  function parseRange () {
    var node, params = [];

    if (token == ':') {
      // implicit start=1 (one-based)
      node = new ConstantNode('1', 'number');
    }
    else {
      // explicit start
      node = parseAddSubtract();
    }

    if (token == ':' && (conditional_level !== nesting_level)) {
      // we ignore the range operator when a conditional operator is being processed on the same level
      params.push(node);

      // parse step and end
      while (token == ':' && params.length < 3) {
        getTokenSkipNewline();

        if (token == ')' || token == ']' || token == ',' || token == '') {
          // implicit end
          params.push(new SymbolNode('end'));
        }
        else {
          // explicit end
          params.push(parseAddSubtract());
        }
      }

      if (params.length == 3) {
        // params = [start, step, end]
        node = new RangeNode(params[0], params[2], params[1]); // start, end, step
      }
      else { // length == 2
        // params = [start, end]
        node = new RangeNode(params[0], params[1]); // start, end
      }
    }

    return node;
  }

  /**
   * add or subtract
   * @return {Node} node
   * @private
   */
  function parseAddSubtract ()  {
    var node, operators, name, fn, params;

    node = parseMultiplyDivide();

    operators = {
      '+': 'add',
      '-': 'subtract'
    };
    while (token in operators) {
      name = token;
      fn = operators[name];

      getTokenSkipNewline();
      params = [node, parseMultiplyDivide()];
      node = new OperatorNode(name, fn, params);
    }

    return node;
  }

  /**
   * multiply, divide, modulus
   * @return {Node} node
   * @private
   */
  function parseMultiplyDivide () {
    var node, last, operators, name, fn;

    node = parseUnary();
    last = node;

    operators = {
      '*': 'multiply',
      '.*': 'dotMultiply',
      '/': 'divide',
      './': 'dotDivide',
      '%': 'mod',
      'mod': 'mod'
    };

    while (true) {
      if (token in operators) {
        // explicit operators
        name = token;
        fn = operators[name];

        getTokenSkipNewline();

        last = parseUnary();
        node = new OperatorNode(name, fn, [node, last]);
      }
      else if ((token_type == TOKENTYPE.SYMBOL) ||
          (token == 'in' && (node && node.isConstantNode)) ||
          (token_type == TOKENTYPE.NUMBER &&
              !last.isConstantNode &&
              (!last.isOperatorNode || last.op === '!')) ||
          (token == '(')) {
        // parse implicit multiplication
        //
        // symbol:      implicit multiplication like '2a', '(2+3)a', 'a b'
        // number:      implicit multiplication like '(2+3)2'
        // parenthesis: implicit multiplication like '2(3+4)', '(3+4)(1+2)'
        last = parseUnary();
        node = new OperatorNode('*', 'multiply', [node, last], true /*implicit*/);
      }
      else {
        break;
      }
    }

    return node;
  }

  /**
   * Unary plus and minus, and logical and bitwise not
   * @return {Node} node
   * @private
   */
  function parseUnary () {
    var name, params;
    var fn = {
      '-': 'unaryMinus',
      '+': 'unaryPlus',
      '~': 'bitNot',
      'not': 'not'
    }[token];

    if (fn) {
      name = token;

      getTokenSkipNewline();
      params = [parseUnary()];

      return new OperatorNode(name, fn, params);
    }

    return parsePow();
  }

  /**
   * power
   * Note: power operator is right associative
   * @return {Node} node
   * @private
   */
  function parsePow () {
    var node, name, fn, params;

    node = parseLeftHandOperators();

    if (token == '^' || token == '.^') {
      name = token;
      fn = (name == '^') ? 'pow' : 'dotPow';

      getTokenSkipNewline();
      params = [node, parseUnary()]; // Go back to unary, we can have '2^-3'
      node = new OperatorNode(name, fn, params);
    }

    return node;
  }

  /**
   * Left hand operators: factorial x!, transpose x'
   * @return {Node} node
   * @private
   */
  function parseLeftHandOperators ()  {
    var node, operators, name, fn, params;

    node = parseCustomNodes();

    operators = {
      '!': 'factorial',
      '\'': 'transpose'
    };

    while (token in operators) {
      name = token;
      fn = operators[name];

      getToken();
      params = [node];

      node = new OperatorNode(name, fn, params);
      node = parseAccessors(node);
    }

    return node;
  }

  /**
   * Parse a custom node handler. A node handler can be used to process
   * nodes in a custom way, for example for handling a plot.
   *
   * A handler must be passed as second argument of the parse function.
   * - must extend math.expression.node.Node
   * - must contain a function _compile(defs: Object) : string
   * - must contain a function find(filter: Object) : Node[]
   * - must contain a function toString() : string
   * - the constructor is called with a single argument containing all parameters
   *
   * For example:
   *
   *     nodes = {
   *       'plot': PlotHandler
   *     };
   *
   * The constructor of the handler is called as:
   *
   *     node = new PlotHandler(params);
   *
   * The handler will be invoked when evaluating an expression like:
   *
   *     node = math.parse('plot(sin(x), x)', nodes);
   *
   * @return {Node} node
   * @private
   */
  function parseCustomNodes () {
    var params = [], handler;

    if (token_type == TOKENTYPE.SYMBOL && extra_nodes[token]) {
      handler = extra_nodes[token];

      getToken();

      // parse parameters
      if (token == '(') {
        params = [];

        openParams();
        getToken();

        if (token != ')') {
          params.push(parseAssignment());

          // parse a list with parameters
          while (token == ',') {
            getToken();
            params.push(parseAssignment());
          }
        }

        if (token != ')') {
          throw createSyntaxError('Parenthesis ) expected');
        }
        closeParams();
        getToken();
      }

      // create a new node handler
      //noinspection JSValidateTypes
      return new handler(params);
    }

    return parseSymbol();
  }

  /**
   * parse symbols: functions, variables, constants, units
   * @return {Node} node
   * @private
   */
  function parseSymbol () {
    var node, name;

    if (token_type == TOKENTYPE.SYMBOL ||
        (token_type == TOKENTYPE.DELIMITER && token in NAMED_DELIMITERS)) {
      name = token;

      getToken();

      // parse function parameters and matrix index
      node = new SymbolNode(name);
      node = parseAccessors(node);
      return node;
    }

    return parseString();
  }

  /**
   * parse accessors:
   * - function invocation in round brackets (...), for example sqrt(2)
   * - index enclosed in square brackets [...], for example A[2,3]
   * - dot notation for properties, like foo.bar
   * @param {Node} node    Node on which to apply the parameters. If there
   *                       are no parameters in the expression, the node
   *                       itself is returned
   * @param {string[]} [types]  Filter the types of notations
   *                            can be ['(', '[', '.']
   * @return {Node} node
   * @private
   */
  function parseAccessors (node, types) {
    var params;

    while ((token == '(' || token == '[' || token == '.') &&
        (!types || types.indexOf(token) !== -1)) {
      params = [];

      if (token == '(') {
        if (node.isSymbolNode || node.isAccessorNode || node.isFunctionNode) {
          // function invocation like fn(2, 3)
          openParams();
          getToken();

          if (token != ')') {
            params.push(parseAssignment());

            // parse a list with parameters
            while (token == ',') {
              getToken();
              params.push(parseAssignment());
            }
          }

          if (token != ')') {
            throw createSyntaxError('Parenthesis ) expected');
          }
          closeParams();
          getToken();

          node = new FunctionNode(node, params);
        }
        else {
          // implicit multiplication like (2+3)(4+5)
          // don't parse it here but let it be handled by parseMultiplyDivide
          // with correct precedence
          return node;
        }
      }
      else if (token == '[') {
        // index notation like variable[2, 3]
        openParams();
        getToken();

        if (token != ']') {
          params.push(parseAssignment());

          // parse a list with parameters
          while (token == ',') {
            getToken();
            params.push(parseAssignment());
          }
        }

        if (token != ']') {
          throw createSyntaxError('Parenthesis ] expected');
        }
        closeParams();
        getToken();

        node = new AccessorNode(node, new IndexNode(params));
      }
      else {
        // dot notation like variable.prop
        getToken();

        if (token_type != TOKENTYPE.SYMBOL) {
          throw createSyntaxError('Property name expected after dot');
        }
        params.push(new ConstantNode(token));
        getToken();

        var dotNotation = true;
        node = new AccessorNode(node, new IndexNode(params, dotNotation));
      }
    }

    return node;
  }

  /**
   * parse a string.
   * A string is enclosed by double quotes
   * @return {Node} node
   * @private
   */
  function parseString () {
    var node, str;

    if (token == '"') {
      str = parseStringToken();

      // create constant
      node = new ConstantNode(str, 'string');

      // parse index parameters
      node = parseAccessors(node);

      return node;
    }

    return parseMatrix();
  }

  /**
   * Parse a string surrounded by double quotes "..."
   * @return {string}
   */
  function parseStringToken () {
    var str = '';

    while (c != '' && c != '\"') {
      if (c == '\\') {
        // escape character
        str += c;
        next();
      }

      str += c;
      next();
    }

    getToken();
    if (token != '"') {
      throw createSyntaxError('End of string " expected');
    }
    getToken();

    return str;
  }

  /**
   * parse the matrix
   * @return {Node} node
   * @private
   */
  function parseMatrix () {
    var array, params, rows, cols;

    if (token == '[') {
      // matrix [...]
      openParams();
      getToken();

      if (token != ']') {
        // this is a non-empty matrix
        var row = parseRow();

        if (token == ';') {
          // 2 dimensional array
          rows = 1;
          params = [row];

          // the rows of the matrix are separated by dot-comma's
          while (token == ';') {
            getToken();

            params[rows] = parseRow();
            rows++;
          }

          if (token != ']') {
            throw createSyntaxError('End of matrix ] expected');
          }
          closeParams();
          getToken();

          // check if the number of columns matches in all rows
          cols = params[0].items.length;
          for (var r = 1; r < rows; r++) {
            if (params[r].items.length != cols) {
              throw createError('Column dimensions mismatch ' +
                  '(' + params[r].items.length + ' != ' + cols + ')');
            }
          }

          array = new ArrayNode(params);
        }
        else {
          // 1 dimensional vector
          if (token != ']') {
            throw createSyntaxError('End of matrix ] expected');
          }
          closeParams();
          getToken();

          array = row;
        }
      }
      else {
        // this is an empty matrix "[ ]"
        closeParams();
        getToken();
        array = new ArrayNode([]);
      }

      return parseAccessors(array);
    }

    return parseObject();
  }

  /**
   * Parse a single comma-separated row from a matrix, like 'a, b, c'
   * @return {ArrayNode} node
   */
  function parseRow () {
    var params = [parseAssignment()];
    var len = 1;

    while (token == ',') {
      getToken();

      // parse expression
      params[len] = parseAssignment();
      len++;
    }

    return new ArrayNode(params);
  }

  /**
   * parse an object, enclosed in angle brackets{...}, for example {value: 2}
   * @return {Node} node
   * @private
   */
  function parseObject () {
    if (token == '{') {
      var key;

      var properties = {};
      do {
        getToken();

        if (token != '}') {
          // parse key
          if (token == '"') {
            key = parseStringToken();
          }
          else if (token_type == TOKENTYPE.SYMBOL) {
            key = token;
            getToken();
          }
          else {
            throw createSyntaxError('Symbol or string expected as object key');
          }

          // parse key/value separator
          if (token != ':') {
            throw createSyntaxError('Colon : expected after object key');
          }
          getToken();

          // parse key
          properties[key] = parseAssignment();
        }
      }
      while (token == ',');

      if (token != '}') {
        throw createSyntaxError('Comma , or bracket } expected after object value');
      }
      getToken();

      var node = new ObjectNode(properties);

      // parse index parameters
      node = parseAccessors(node);

      return node;
    }

    return parseNumber();
  }

  /**
   * parse a number
   * @return {Node} node
   * @private
   */
  function parseNumber () {
    var number;

    if (token_type == TOKENTYPE.NUMBER) {
      // this is a number
      number = token;
      getToken();

      return new ConstantNode(number, 'number');
    }

    return parseParentheses();
  }

  /**
   * parentheses
   * @return {Node} node
   * @private
   */
  function parseParentheses () {
    var node;

    // check if it is a parenthesized expression
    if (token == '(') {
      // parentheses (...)
      openParams();
      getToken();

      node = parseAssignment(); // start again

      if (token != ')') {
        throw createSyntaxError('Parenthesis ) expected');
      }
      closeParams();
      getToken();

      node = new ParenthesisNode(node);
      node = parseAccessors(node);
      return node;
    }

    return parseEnd();
  }

  /**
   * Evaluated when the expression is not yet ended but expected to end
   * @return {Node} res
   * @private
   */
  function parseEnd () {
    if (token == '') {
      // syntax error or unexpected end of expression
      throw createSyntaxError('Unexpected end of expression');
    } else {
      throw createSyntaxError('Value expected');
    }
  }

  /**
   * Shortcut for getting the current row value (one based)
   * Returns the line of the currently handled expression
   * @private
   */
  /* TODO: implement keeping track on the row number
  function row () {
    return null;
  }
  */

  /**
   * Shortcut for getting the current col value (one based)
   * Returns the column (position) where the last token starts
   * @private
   */
  function col () {
    return index - token.length + 1;
  }

  /**
   * Create an error
   * @param {string} message
   * @return {SyntaxError} instantiated error
   * @private
   */
  function createSyntaxError (message) {
    var c = col();
    var error = new SyntaxError(message + ' (char ' + c + ')');
    error['char'] = c;

    return error;
  }

  /**
   * Create an error
   * @param {string} message
   * @return {Error} instantiated error
   * @private
   */
  function createError (message) {
    var c = col();
    var error = new SyntaxError(message + ' (char ' + c + ')');
    error['char'] = c;

    return error;
  }

  return parse;
}

exports.name = 'parse';
exports.path = 'expression';
exports.factory = factory;

},{"../error/ArgumentsError":14,"../utils/collection/deepMap":353,"./node/AccessorNode":208,"./node/ArrayNode":209,"./node/AssignmentNode":210,"./node/BlockNode":211,"./node/ConditionalNode":212,"./node/ConstantNode":213,"./node/FunctionAssignmentNode":214,"./node/FunctionNode":215,"./node/IndexNode":216,"./node/ObjectNode":218,"./node/OperatorNode":219,"./node/ParenthesisNode":220,"./node/RangeNode":221,"./node/SymbolNode":222}],229:[function(require,module,exports){
'use strict';

var errorTransform = require('./error.transform').transform;

/**
 * Attach a transform function to math.range
 * Adds a property transform containing the transform function.
 *
 * This transform changed the last `dim` parameter of function concat
 * from one-based to zero based
 */
function factory (type, config, load, typed) {
  var concat = load(require('../../function/matrix/concat'));

  // @see: comment of concat itself
 return typed('concat', {
    '...any': function (args) {
      // change last argument from one-based to zero-based
      var lastIndex = args.length - 1;
      var last = args[lastIndex];
      if (typeof last === 'number') {
        args[lastIndex] = last - 1;
      }
      else if (last && last.isBigNumber === true) {
        args[lastIndex] = last.minus(1);
      }

      try {
        return concat.apply(null, args);
      }
      catch (err) {
        throw errorTransform(err);
      }
    }
  });
}

exports.name = 'concat';
exports.path = 'expression.transform';
exports.factory = factory;

},{"../../function/matrix/concat":275,"./error.transform":230}],230:[function(require,module,exports){
var IndexError = require('../../error/IndexError');

/**
 * Transform zero-based indices to one-based indices in errors
 * @param {Error} err
 * @returns {Error} Returns the transformed error
 */
exports.transform = function (err) {
  if (err && err.isIndexError) {
    return new IndexError(
        err.index + 1,
        err.min + 1,
        err.max !== undefined ? err.max + 1 : undefined);
  }

  return err;
};

},{"../../error/IndexError":16}],231:[function(require,module,exports){
'use strict';

/**
 * Attach a transform function to math.filter
 * Adds a property transform containing the transform function.
 *
 * This transform adds support for equations as test function for math.filter,
 * so you can do something like 'filter([3, -2, 5], x > 0)'.
 */
function factory (type, config, load, typed) {
  var filter = load(require('../../function/matrix/filter'));
  var SymbolNode = load(require('../node/SymbolNode'));

  function filterTransform(args, math, scope) {
    var x, test;

    if (args[0]) {
      x = args[0].compile().eval(scope);
    }

    if (args[1]) {
      if (args[1] && args[1].isSymbolNode) {
        // a function pointer, like filter([3, -2, 5], myTestFunction);
        test = args[1].compile().eval(scope);
      }
      else {
        // an equation like filter([3, -2, 5], x > 0)

        // find an undefined symbol
        var _scope = scope || {};
        var symbol = args[1]
            .filter(function (node) {
              return (node && node.isSymbolNode) &&
                  !(node.name in math) &&
                  !(node.name in _scope);
            })[0];

        // create a test function for this equation
        var sub = Object.create(_scope);
        var eq = args[1].compile();
        if (symbol) {
          var name = symbol.name;
          test = function (x) {
            sub[name] = x;
            return eq.eval(sub);
          }
        }
        else {
          throw new Error('No undefined variable found in filter equation');
        }
      }
    }

    return filter(x, test);
  }

  filterTransform.rawArgs = true;

  return filterTransform;
}

exports.name = 'filter';
exports.path = 'expression.transform';
exports.factory = factory;

},{"../../function/matrix/filter":278,"../node/SymbolNode":222}],232:[function(require,module,exports){
'use strict';

var maxArgumentCount = require('../../utils/function').maxArgumentCount;

/**
 * Attach a transform function to math.forEach
 * Adds a property transform containing the transform function.
 *
 * This transform creates a one-based index instead of a zero-based index
 */
function factory (type, config, load, typed) {
  var forEach = load(require('../../function/matrix/forEach'));

  return typed('forEach', {
    'Array | Matrix, function': function (array, callback) {
      // figure out what number of arguments the callback function expects
      var args = maxArgumentCount(callback);

      var recurse = function (value, index) {
        if (Array.isArray(value)) {
          value.forEach(function (child, i) {
            // we create a copy of the index array and append the new index value
            recurse(child, index.concat(i + 1)); // one based index, hence i+1
          });
        }
        else {
          // invoke the callback function with the right number of arguments
          if (args === 1) {
            callback(value);
          }
          else if (args === 2) {
            callback(value, index);
          }
          else { // 3 or -1
            callback(value, index, array);
          }
        }
      };
      recurse(array.valueOf(), []); // pass Array
    }
  });
}

exports.name = 'forEach';
exports.path = 'expression.transform';
exports.factory = factory;

},{"../../function/matrix/forEach":279,"../../utils/function":358}],233:[function(require,module,exports){
module.exports = [
  require('./concat.transform'),
  require('./filter.transform'),
  require('./forEach.transform'),
  require('./index.transform'),
  require('./map.transform'),
  require('./max.transform'),
  require('./mean.transform'),
  require('./min.transform'),
  require('./range.transform'),
  require('./subset.transform')
];

},{"./concat.transform":229,"./filter.transform":231,"./forEach.transform":232,"./index.transform":234,"./map.transform":235,"./max.transform":236,"./mean.transform":237,"./min.transform":238,"./range.transform":239,"./subset.transform":240}],234:[function(require,module,exports){
'use strict';

/**
 * Attach a transform function to math.index
 * Adds a property transform containing the transform function.
 *
 * This transform creates a one-based index instead of a zero-based index
 */
function factory (type, config, load) {

  return function indexTransform() {
    var args = [];
    for (var i = 0, ii = arguments.length; i < ii; i++) {
      var arg = arguments[i];

      // change from one-based to zero based, and convert BigNumber to number
      if (arg && arg.isRange === true) {
        arg.start--;
        arg.end -= (arg.step > 0 ? 0 : 2);
      }
      else if (arg && arg.isSet === true) {
        arg = arg.map(function (v) { return v - 1; });
      }
      else if (arg && (arg.isArray === true || arg.isMatrix)) {
        arg = arg.map(function (v) { return v - 1; });
      }
      else if (typeof arg === 'number') {
        arg--;
      }
      else if (arg && arg.isBigNumber === true) {
        arg = arg.toNumber() - 1;
      }
      else if (typeof arg === 'string') {
        // leave as is
      }
      else {
        throw new TypeError('Dimension must be an Array, Matrix, number, string, or Range');
      }

      args[i] = arg;
    }

    var res = new type.Index();
    type.Index.apply(res, args);
    return res;
  };
}

exports.name = 'index';
exports.path = 'expression.transform';
exports.factory = factory;

},{}],235:[function(require,module,exports){
'use strict';

var maxArgumentCount = require('../../utils/function').maxArgumentCount;

/**
 * Attach a transform function to math.map
 * Adds a property transform containing the transform function.
 *
 * This transform creates a one-based index instead of a zero-based index
 */
function factory (type, config, load, typed) {
  var map = load(require('../../function/matrix/map'));
  var matrix = load(require('../../type/matrix/function/matrix'));

  return typed('max', {
    'Array, function': function (x, callback) {
      return _map(x, callback, x);
    },

    'Matrix, function': function (x, callback) {
      return matrix(_map(x.valueOf(), callback, x));
    }
  });
}

/**
 * Map for a multi dimensional array. One-based indexes
 * @param {Array} array
 * @param {function} callback
 * @param {Array} orig
 * @return {Array}
 * @private
 */
function _map (array, callback, orig) {
  // figure out what number of arguments the callback function expects
  var args = maxArgumentCount(callback);

  function recurse(value, index) {
    if (Array.isArray(value)) {
      return value.map(function (child, i) {
        // we create a copy of the index array and append the new index value
        return recurse(child, index.concat(i + 1)); // one based index, hence i + 1
      });
    }
    else {
      // invoke the callback function with the right number of arguments
      if (args === 1) {
        return callback(value);
      }
      else if (args === 2) {
        return callback(value, index);
      }
      else { // 3 or -1
        return callback(value, index, orig);
      }
    }
  }

  return recurse(array, []);
}

exports.name = 'map';
exports.path = 'expression.transform';
exports.factory = factory;

},{"../../function/matrix/map":281,"../../type/matrix/function/matrix":328,"../../utils/function":358}],236:[function(require,module,exports){
'use strict';

var errorTransform = require('./error.transform').transform;
var isCollection = require('../../utils/collection/isCollection');

/**
 * Attach a transform function to math.max
 * Adds a property transform containing the transform function.
 *
 * This transform changed the last `dim` parameter of function max
 * from one-based to zero based
 */
function factory (type, config, load, typed) {
  var max = load(require('../../function/statistics/max'));

  return typed('max', {
    '...any': function (args) {
      // change last argument dim from one-based to zero-based
      if (args.length == 2 && isCollection(args[0])) {
        var dim = args[1];
        if (typeof dim === 'number') {
          args[1] = dim - 1;
        }
        else if (dim && dim.isBigNumber === true) {
          args[1] = dim.minus(1);
        }
      }

      try {
        return max.apply(null, args);
      }
      catch (err) {
        throw errorTransform(err);
      }
    }
  });
}

exports.name = 'max';
exports.path = 'expression.transform';
exports.factory = factory;

},{"../../function/statistics/max":291,"../../utils/collection/isCollection":354,"./error.transform":230}],237:[function(require,module,exports){
'use strict';

var errorTransform = require('./error.transform').transform;
var isCollection = require('../../utils/collection/isCollection');

/**
 * Attach a transform function to math.mean
 * Adds a property transform containing the transform function.
 *
 * This transform changed the last `dim` parameter of function mean
 * from one-based to zero based
 */
function factory (type, config, load, typed) {
  var mean = load(require('../../function/statistics/mean'));

  return typed('mean', {
    '...any': function (args) {
      // change last argument dim from one-based to zero-based
      if (args.length == 2 && isCollection(args[0])) {
        var dim = args[1];
        if (typeof dim === 'number') {
          args[1] = dim - 1;
        }
        else if (dim && dim.isBigNumber === true) {
          args[1] = dim.minus(1);
        }
      }

      try {
        return mean.apply(null, args);
      }
      catch (err) {
        throw errorTransform(err);
      }
    }
  });
}

exports.name = 'mean';
exports.path = 'expression.transform';
exports.factory = factory;

},{"../../function/statistics/mean":292,"../../utils/collection/isCollection":354,"./error.transform":230}],238:[function(require,module,exports){
'use strict';

var errorTransform = require('./error.transform').transform;
var isCollection = require('../../utils/collection/isCollection');

/**
 * Attach a transform function to math.min
 * Adds a property transform containing the transform function.
 *
 * This transform changed the last `dim` parameter of function min
 * from one-based to zero based
 */
function factory (type, config, load, typed) {
  var min = load(require('../../function/statistics/min'));

  return typed('min', {
    '...any': function (args) {
      // change last argument dim from one-based to zero-based
      if (args.length == 2 && isCollection(args[0])) {
        var dim = args[1];
        if (typeof dim === 'number') {
          args[1] = dim - 1;
        }
        else if (dim && dim.isBigNumber === true) {
          args[1] = dim.minus(1);
        }
      }

      try {
        return min.apply(null, args);
      }
      catch (err) {
        throw errorTransform(err);
      }
    }
  });
}

exports.name = 'min';
exports.path = 'expression.transform';
exports.factory = factory;

},{"../../function/statistics/min":293,"../../utils/collection/isCollection":354,"./error.transform":230}],239:[function(require,module,exports){
'use strict';

/**
 * Attach a transform function to math.range
 * Adds a property transform containing the transform function.
 *
 * This transform creates a range which includes the end value
 */
function factory (type, config, load, typed) {
  var range = load(require('../../function/matrix/range'));

  return typed('range', {
    '...any': function (args) {
      var lastIndex = args.length - 1;
      var last = args[lastIndex];
      if (typeof last !== 'boolean') {
        // append a parameter includeEnd=true
        args.push(true);
      }

      return range.apply(null, args);
    }
  });
}

exports.name = 'range';
exports.path = 'expression.transform';
exports.factory = factory;

},{"../../function/matrix/range":282}],240:[function(require,module,exports){
'use strict';

var errorTransform = require('./error.transform').transform;

/**
 * Attach a transform function to math.subset
 * Adds a property transform containing the transform function.
 *
 * This transform creates a range which includes the end value
 */
function factory (type, config, load, typed) {
  var subset = load(require('../../function/matrix/subset'));

  return typed('subset', {
    '...any': function (args) {
      try {
        return subset.apply(null, args);
      }
      catch (err) {
        throw errorTransform(err);
      }
    }
  });
}

exports.name = 'subset';
exports.path = 'expression.transform';
exports.factory = factory;

},{"../../function/matrix/subset":283,"./error.transform":230}],241:[function(require,module,exports){
'use strict';

var deepMap = require('../../utils/collection/deepMap');

function factory (type, config, load, typed) {
  /**
   * Calculate the absolute value of a number. For matrices, the function is
   * evaluated element wise.
   *
   * Syntax:
   *
   *    math.abs(x)
   *
   * Examples:
   *
   *    math.abs(3.5);                // returns number 3.5
   *    math.abs(-4.2);               // returns number 4.2
   *
   *    math.abs([3, -5, -1, 0, 2]);  // returns Array [3, 5, 1, 0, 2]
   *
   * See also:
   *
   *    sign
   *
   * @param  {number | BigNumber | Fraction | Complex | Array | Matrix | Unit} x
   *            A number or matrix for which to get the absolute value
   * @return {number | BigNumber | Fraction | Complex | Array | Matrix | Unit}
   *            Absolute value of `x`
   */
  var abs = typed('abs', {
    'number': Math.abs,

    'Complex': function (x) {
      return x.abs();
    },

    'BigNumber': function (x) {
      return x.abs();
    },

    'Fraction': function (x) {
      return x.abs();
    },

    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since abs(0) = 0
      return deepMap(x, abs, true);
    },

    'Unit': function(x) {
      return x.abs();
    }
  });

  abs.toTex = {1: '\\left|${args[0]}\\right|'};

  return abs;
}

exports.name = 'abs';
exports.factory = factory;

},{"../../utils/collection/deepMap":353}],242:[function(require,module,exports){
'use strict';

var extend = require('../../utils/object').extend;

function factory (type, config, load, typed) {

  var matrix = load(require('../../type/matrix/function/matrix'));
  var addScalar = load(require('./addScalar'));
  var latex = require('../../utils/latex.js');
  
  var algorithm01 = load(require('../../type/matrix/utils/algorithm01'));
  var algorithm04 = load(require('../../type/matrix/utils/algorithm04'));
  var algorithm10 = load(require('../../type/matrix/utils/algorithm10'));
  var algorithm13 = load(require('../../type/matrix/utils/algorithm13'));
  var algorithm14 = load(require('../../type/matrix/utils/algorithm14'));

  /**
   * Add two or more values, `x + y`.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.add(x, y)
   *    math.add(x, y, z, ...)
   *
   * Examples:
   *
   *    math.add(2, 3);               // returns number 5
   *    math.add(2, 3, 4);            // returns number 9
   *
   *    var a = math.complex(2, 3);
   *    var b = math.complex(-4, 1);
   *    math.add(a, b);               // returns Complex -2 + 4i
   *
   *    math.add([1, 2, 3], 4);       // returns Array [5, 6, 7]
   *
   *    var c = math.unit('5 cm');
   *    var d = math.unit('2.1 mm');
   *    math.add(c, d);               // returns Unit 52.1 mm
   *
   *    math.add("2.3", "4");         // returns number 6.3
   *
   * See also:
   *
   *    subtract, sum
   *
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} x First value to add
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} y Second value to add
   * @return {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} Sum of `x` and `y`
   */
  var add = typed('add', extend({
    // we extend the signatures of addScalar with signatures dealing with matrices

    'Matrix, Matrix': function (x, y) {
      // result
      var c;
      
      // process matrix storage
      switch (x.storage()) {
        case 'sparse':
          switch (y.storage()) {
            case 'sparse':
              // sparse + sparse
              c = algorithm04(x, y, addScalar);
              break;
            default:
              // sparse + dense
              c = algorithm01(y, x, addScalar, true);
              break;
          }
          break;
        default:
          switch (y.storage()) {
            case 'sparse':
              // dense + sparse
              c = algorithm01(x, y, addScalar, false);
              break;
            default:
              // dense + dense
              c = algorithm13(x, y, addScalar);
              break;
          }
          break;
      }
      return c;
    },
    
    'Array, Array': function (x, y) {
      // use matrix implementation
      return add(matrix(x), matrix(y)).valueOf();
    },
    
    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return add(matrix(x), y);
    },
    
    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return add(x, matrix(y));
    },
    
    'Matrix, any': function (x, y) {
      // result
      var c;
      // check storage format
      switch (x.storage()) {
        case 'sparse':
          c = algorithm10(x, y, addScalar, false);
          break;
        default:
          c = algorithm14(x, y, addScalar, false);
          break;
      }
      return c;
    },
    
    'any, Matrix': function (x, y) {
      // result
      var c;
      // check storage format
      switch (y.storage()) {
        case 'sparse':
          c = algorithm10(y, x, addScalar, true);
          break;
        default:
          c = algorithm14(y, x, addScalar, true);
          break;
      }
      return c;
    },
    
    'Array, any': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, addScalar, false).valueOf();
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, addScalar, true).valueOf();
    },

    'any, any': addScalar,

    'any, any, ...any': function (x, y, rest) {
      var result = add(x, y);

      for (var i = 0; i < rest.length; i++) {
        result = add(result, rest[i]);
      }

      return result;
    }
  }, addScalar.signatures));

  add.toTex = {
    2: '\\left(${args[0]}' + latex.operators['add'] + '${args[1]}\\right)'
  };
  
  return add;
}

exports.name = 'add';
exports.factory = factory;

},{"../../type/matrix/function/matrix":328,"../../type/matrix/utils/algorithm01":329,"../../type/matrix/utils/algorithm04":332,"../../type/matrix/utils/algorithm10":337,"../../type/matrix/utils/algorithm13":340,"../../type/matrix/utils/algorithm14":341,"../../utils/latex.js":360,"../../utils/object":362,"./addScalar":243}],243:[function(require,module,exports){
'use strict';

function factory(type, config, load, typed) {

  /**
   * Add two scalar values, `x + y`.
   * This function is meant for internal use: it is used by the public function
   * `add`
   *
   * This function does not support collections (Array or Matrix), and does
   * not validate the number of of inputs.
   *
   * @param  {number | BigNumber | Fraction | Complex | Unit} x   First value to add
   * @param  {number | BigNumber | Fraction | Complex} y          Second value to add
   * @return {number | BigNumber | Fraction | Complex | Unit}                      Sum of `x` and `y`
   * @private
   */
  var add = typed('add', {

    'number, number': function (x, y) {
      return x + y;
    },

    'Complex, Complex': function (x, y) {
      return x.add(y);
    },

    'BigNumber, BigNumber': function (x, y) {
      return x.plus(y);
    },

    'Fraction, Fraction': function (x, y) {
      return x.add(y);
    },

    'Unit, Unit': function (x, y) {
      if (x.value == null) throw new Error('Parameter x contains a unit with undefined value');
      if (y.value == null) throw new Error('Parameter y contains a unit with undefined value');
      if (!x.equalBase(y)) throw new Error('Units do not match');

      var res = x.clone();
      res.value = add(res.value, y.value);
      res.fixPrefix = false;
      return res;
    }
  });

  return add;
}

exports.factory = factory;

},{}],244:[function(require,module,exports){
'use strict';

var deepMap = require('../../utils/collection/deepMap');

function factory (type, config, load, typed) {
  var unaryMinus = load(require('./unaryMinus'));
  var isNegative = load(require('../utils/isNegative'));
  var matrix = load(require('../../type/matrix/function/matrix'));

  /**
   * Calculate the cubic root of a value.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.cbrt(x)
   *    math.cbrt(x, allRoots)
   *
   * Examples:
   *
   *    math.cbrt(27);                  // returns 3
   *    math.cube(3);                   // returns 27
   *    math.cbrt(-64);                 // returns -4
   *    math.cbrt(math.unit('27 m^3')); // returns Unit 3 m
   *    math.cbrt([27, 64, 125]);       // returns [3, 4, 5]
   *
   *    var x = math.complex('8i');
   *    math.cbrt(x);                   // returns Complex 1.7320508075689 + i
   *    math.cbrt(x, true);             // returns Matrix [
   *                                    //    1.7320508075689 + i
   *                                    //   -1.7320508075689 + i
   *                                    //   -2i
   *                                    // ]
   *
   * See also:
   *
   *    square, sqrt, cube
   *
   * @param {number | BigNumber | Complex | Unit | Array | Matrix} x
   *            Value for which to calculate the cubic root.
   * @param {boolean} [allRoots]  Optional, false by default. Only applicable
   *            when `x` is a number or complex number. If true, all complex
   *            roots are returned, if false (default) the principal root is
   *            returned.
   * @return {number | BigNumber | Complex | Unit | Array | Matrix}
   *            Returns the cubic root of `x`
   */
  var cbrt = typed('cbrt', {
    'number': _cbrtNumber,
    // note: signature 'number, boolean' is also supported,
    //       created by typed as it knows how to convert number to Complex

    'Complex': _cbrtComplex,

    'Complex, boolean': _cbrtComplex,

    'BigNumber': function (x) {
      return x.cbrt();
    },

    'Unit': _cbrtUnit,

    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since cbrt(0) = 0
      return deepMap(x, cbrt, true);
    }
  });

  /**
   * Calculate the cubic root for a complex number
   * @param {Complex} x
   * @param {boolean} [allRoots]   If true, the function will return an array
   *                               with all three roots. If false or undefined,
   *                               the principal root is returned.
   * @returns {Complex | Array.<Complex> | Matrix.<Complex>} Returns the cubic root(s) of x
   * @private
   */
  function _cbrtComplex(x, allRoots) {
    // https://www.wikiwand.com/en/Cube_root#/Complex_numbers

    var arg_3 = x.arg() / 3;
    var abs = x.abs();

    // principal root:
    var principal = new type.Complex(_cbrtNumber(abs), 0).mul(
        new type.Complex(0, arg_3).exp());

    if (allRoots) {
      var all = [
          principal,
          new type.Complex(_cbrtNumber(abs), 0).mul(
            new type.Complex(0, arg_3 + Math.PI * 2 / 3).exp()),
          new type.Complex(_cbrtNumber(abs), 0).mul(
            new type.Complex(0, arg_3 - Math.PI * 2 / 3).exp())
      ];

      return (config.matrix === 'Array') ? all : matrix(all);
    }
    else {
      return principal;
    }
  }

  /**
   * Calculate the cubic root for a Unit
   * @param {Unit} x
   * @return {Unit} Returns the cubic root of x
   * @private
   */
  function _cbrtUnit(x) {
    if(x.value && x.value.isComplex) {
      var result = x.clone();
      result.value = 1.0;
      result = result.pow(1.0/3);           // Compute the units
      result.value = _cbrtComplex(x.value); // Compute the value
      return result;
    }
    else {
      var negate = isNegative(x.value);
      if (negate) {
        x.value = unaryMinus(x.value);
      }

      // TODO: create a helper function for this
      var third;
      if (x.value && x.value.isBigNumber) {
        third = new type.BigNumber(1).div(3);
      }
      else if (x.value && x.value.isFraction) {
        third = new type.Fraction(1, 3);
      }
      else {
        third = 1/3;
      }

      var result = x.pow(third);

      if (negate) {
        result.value = unaryMinus(result.value);
      }

      return result;
    }
  }

  cbrt.toTex = {1: '\\sqrt[3]{${args[0]}}'};

  return cbrt;
}

/**
 * Calculate cbrt for a number
 *
 * Code from es6-shim.js:
 *   https://github.com/paulmillr/es6-shim/blob/master/es6-shim.js#L1564-L1577
 *
 * @param {number} x
 * @returns {number | Complex} Returns the cubic root of x
 * @private
 */
var _cbrtNumber = Math.cbrt || function (x) {
  if (x === 0) {
    return x;
  }

  var negate = x < 0;
  var result;
  if (negate) {
    x = -x;
  }

  if (isFinite(x)) {
    result = Math.exp(Math.log(x) / 3);
    // from http://en.wikipedia.org/wiki/Cube_root#Numerical_methods
    result = (x / (result * result) + (2 * result)) / 3;
  } else {
    result = x;
  }

  return negate ? -result : result;
};

exports.name = 'cbrt';
exports.factory = factory;

},{"../../type/matrix/function/matrix":328,"../../utils/collection/deepMap":353,"../utils/isNegative":321,"./unaryMinus":272}],245:[function(require,module,exports){
'use strict';

var deepMap = require('../../utils/collection/deepMap');

function factory (type, config, load, typed) {
  /**
   * Round a value towards plus infinity
   * If `x` is complex, both real and imaginary part are rounded towards plus infinity.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.ceil(x)
   *
   * Examples:
   *
   *    math.ceil(3.2);               // returns number 4
   *    math.ceil(3.8);               // returns number 4
   *    math.ceil(-4.2);              // returns number -4
   *    math.ceil(-4.7);              // returns number -4
   *
   *    var c = math.complex(3.2, -2.7);
   *    math.ceil(c);                 // returns Complex 4 - 2i
   *
   *    math.ceil([3.2, 3.8, -4.7]);  // returns Array [4, 4, -4]
   *
   * See also:
   *
   *    floor, fix, round
   *
   * @param  {number | BigNumber | Fraction | Complex | Array | Matrix} x  Number to be rounded
   * @return {number | BigNumber | Fraction | Complex | Array | Matrix} Rounded value
   */
  var ceil = typed('ceil', {
    'number': Math.ceil,

    'Complex': function (x) {
      return x.ceil();
    },

    'BigNumber': function (x) {
      return x.ceil();
    },

    'Fraction': function (x) {
      return x.ceil();
    },

    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since ceil(0) = 0
      return deepMap(x, ceil, true);
    }
  });

  ceil.toTex = {1: '\\left\\lceil${args[0]}\\right\\rceil'};

  return ceil;
}

exports.name = 'ceil';
exports.factory = factory;

},{"../../utils/collection/deepMap":353}],246:[function(require,module,exports){
'use strict';

var deepMap = require('../../utils/collection/deepMap');

function factory (type, config, load, typed) {

  /**
   * Compute the cube of a value, `x * x * x`.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.cube(x)
   *
   * Examples:
   *
   *    math.cube(2);            // returns number 8
   *    math.pow(2, 3);          // returns number 8
   *    math.cube(4);            // returns number 64
   *    4 * 4 * 4;               // returns number 64
   *
   *    math.cube([1, 2, 3, 4]); // returns Array [1, 8, 27, 64]
   *
   * See also:
   *
   *    multiply, square, pow, cbrt
   *
   * @param  {number | BigNumber | Fraction | Complex | Array | Matrix | Unit} x  Number for which to calculate the cube
   * @return {number | BigNumber | Fraction | Complex | Array | Matrix | Unit} Cube of x
   */
  var cube = typed('cube', {
    'number': function (x) {
      return x * x * x;
    },

    'Complex': function (x) {
      return x.mul(x).mul(x); // Is faster than pow(x, 3)
    },

    'BigNumber': function (x) {
      return x.times(x).times(x);
    },

    'Fraction': function (x) {
      return x.pow(3); // Is faster than mul()mul()mul()
    },

    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since cube(0) = 0
      return deepMap(x, cube, true);
    },

    'Unit': function(x) {
      return x.pow(3);
    }
  });

  cube.toTex = {1: '\\left(${args[0]}\\right)^3'};

  return cube;
}

exports.name = 'cube';
exports.factory = factory;

},{"../../utils/collection/deepMap":353}],247:[function(require,module,exports){
'use strict';

var extend = require('../../utils/object').extend;

function factory (type, config, load, typed) {

  var divideScalar = load(require('./divideScalar'));
  var multiply     = load(require('./multiply'));
  var inv          = load(require('../matrix/inv'));
  var matrix       = load(require('../../type/matrix/function/matrix'));

  var algorithm11 = load(require('../../type/matrix/utils/algorithm11'));
  var algorithm14 = load(require('../../type/matrix/utils/algorithm14'));
  
  /**
   * Divide two values, `x / y`.
   * To divide matrices, `x` is multiplied with the inverse of `y`: `x * inv(y)`.
   *
   * Syntax:
   *
   *    math.divide(x, y)
   *
   * Examples:
   *
   *    math.divide(2, 3);            // returns number 0.6666666666666666
   *
   *    var a = math.complex(5, 14);
   *    var b = math.complex(4, 1);
   *    math.divide(a, b);            // returns Complex 2 + 3i
   *
   *    var c = [[7, -6], [13, -4]];
   *    var d = [[1, 2], [4, 3]];
   *    math.divide(c, d);            // returns Array [[-9, 4], [-11, 6]]
   *
   *    var e = math.unit('18 km');
   *    math.divide(e, 4.5);          // returns Unit 4 km
   *
   * See also:
   *
   *    multiply
   *
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} x   Numerator
   * @param  {number | BigNumber | Fraction | Complex | Array | Matrix} y          Denominator
   * @return {number | BigNumber | Fraction | Complex | Unit | Array | Matrix}                      Quotient, `x / y`
   */
  var divide = typed('divide', extend({
    // we extend the signatures of divideScalar with signatures dealing with matrices

    'Array | Matrix, Array | Matrix': function (x, y) {
      // TODO: implement matrix right division using pseudo inverse
      // http://www.mathworks.nl/help/matlab/ref/mrdivide.html
      // http://www.gnu.org/software/octave/doc/interpreter/Arithmetic-Ops.html
      // http://stackoverflow.com/questions/12263932/how-does-gnu-octave-matrix-division-work-getting-unexpected-behaviour
      return multiply(x, inv(y));
    },

    'Matrix, any': function (x, y) {
      // result
      var c;

      // process storage format
      switch (x.storage()) {
        case 'sparse':
          c = algorithm11(x, y, divideScalar, false);
          break;
        case 'dense':
          c = algorithm14(x, y, divideScalar, false);
          break;
      }
      return c;
    },
    
    'Array, any': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, divideScalar, false).valueOf();
    },

    'any, Array | Matrix': function (x, y) {
      return multiply(x, inv(y));
    }
  }, divideScalar.signatures));

  divide.toTex = {2: '\\frac{${args[0]}}{${args[1]}}'};

  return divide;
}

exports.name = 'divide';
exports.factory = factory;

},{"../../type/matrix/function/matrix":328,"../../type/matrix/utils/algorithm11":338,"../../type/matrix/utils/algorithm14":341,"../../utils/object":362,"../matrix/inv":280,"./divideScalar":248,"./multiply":262}],248:[function(require,module,exports){
'use strict';

function factory(type, config, load, typed) {
  var multiplyScalar = load(require('./multiplyScalar'));

  /**
   * Divide two scalar values, `x / y`.
   * This function is meant for internal use: it is used by the public functions
   * `divide` and `inv`.
   *
   * This function does not support collections (Array or Matrix), and does
   * not validate the number of of inputs.
   *
   * @param  {number | BigNumber | Fraction | Complex | Unit} x   Numerator
   * @param  {number | BigNumber | Fraction | Complex} y          Denominator
   * @return {number | BigNumber | Fraction | Complex | Unit}                      Quotient, `x / y`
   * @private
   */
  var divideScalar = typed('divide', {
    'number, number': function (x, y) {
      return x / y;
    },

    'Complex, Complex': function (x, y) {
      return x.div(y);
    },

    'BigNumber, BigNumber': function (x, y) {
      return x.div(y);
    },

    'Fraction, Fraction': function (x, y) {
      return x.div(y);
    },

    'Unit, number | Fraction | BigNumber': function (x, y) {
      var res = x.clone();
      // TODO: move the divide function to Unit.js, it uses internals of Unit
      res.value = divideScalar(((res.value === null) ? res._normalize(1) : res.value), y);
      return res;
    },

    'number | Fraction | BigNumber, Unit': function (x, y) {
      var res = y.pow(-1);
      // TODO: move the divide function to Unit.js, it uses internals of Unit
      res.value = multiplyScalar(((res.value === null) ? res._normalize(1) : res.value), x);
      return res;
    },

    'Unit, Unit': function (x, y) {
      return x.divide(y);
    }

  });

  return divideScalar;
}

exports.factory = factory;

},{"./multiplyScalar":263}],249:[function(require,module,exports){
'use strict';

function factory (type, config, load, typed) {

  var matrix = load(require('../../type/matrix/function/matrix'));
  var divideScalar = load(require('./divideScalar'));
  var latex = require('../../utils/latex');
  
  var algorithm02 = load(require('../../type/matrix/utils/algorithm02'));
  var algorithm03 = load(require('../../type/matrix/utils/algorithm03'));
  var algorithm07 = load(require('../../type/matrix/utils/algorithm07'));
  var algorithm11 = load(require('../../type/matrix/utils/algorithm11'));
  var algorithm12 = load(require('../../type/matrix/utils/algorithm12'));
  var algorithm13 = load(require('../../type/matrix/utils/algorithm13'));
  var algorithm14 = load(require('../../type/matrix/utils/algorithm14'));

  /**
   * Divide two matrices element wise. The function accepts both matrices and
   * scalar values.
   *
   * Syntax:
   *
   *    math.dotDivide(x, y)
   *
   * Examples:
   *
   *    math.dotDivide(2, 4);   // returns 0.5
   *
   *    a = [[9, 5], [6, 1]];
   *    b = [[3, 2], [5, 2]];
   *
   *    math.dotDivide(a, b);   // returns [[3, 2.5], [1.2, 0.5]]
   *    math.divide(a, b);      // returns [[1.75, 0.75], [-1.75, 2.25]]
   *
   * See also:
   *
   *    divide, multiply, dotMultiply
   *
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} x Numerator
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} y Denominator
   * @return {number | BigNumber | Fraction | Complex | Unit | Array | Matrix}                    Quotient, `x ./ y`
   */
  var dotDivide = typed('dotDivide', {
    
    'any, any': divideScalar,
    
    'Matrix, Matrix': function (x, y) {
      // result
      var c;

      // process matrix storage
      switch (x.storage()) {
        case 'sparse':
          switch (y.storage()) {
            case 'sparse':
              // sparse ./ sparse
              c = algorithm07(x, y, divideScalar, false);
              break;
            default:
              // sparse ./ dense
              c = algorithm02(y, x, divideScalar, true);
              break;
          }
          break;
        default:
          switch (y.storage()) {
            case 'sparse':
              // dense ./ sparse
              c = algorithm03(x, y, divideScalar, false);
              break;
            default:
              // dense ./ dense
              c = algorithm13(x, y, divideScalar);
              break;
          }
          break;
      }
      return c;
    },

    'Array, Array': function (x, y) {
      // use matrix implementation
      return dotDivide(matrix(x), matrix(y)).valueOf();
    },

    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return dotDivide(matrix(x), y);
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return dotDivide(x, matrix(y));
    },

    'Matrix, any': function (x, y) {
      // result
      var c;
      // check storage format
      switch (x.storage()) {
        case 'sparse':
          c = algorithm11(x, y, divideScalar, false);
          break;
        default:
          c = algorithm14(x, y, divideScalar, false);
          break;
      }
      return c;
    },

    'any, Matrix': function (x, y) {
      // result
      var c;
      // check storage format
      switch (y.storage()) {
        case 'sparse':
          c = algorithm12(y, x, divideScalar, true);
          break;
        default:
          c = algorithm14(y, x, divideScalar, true);
          break;
      }
      return c;
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, divideScalar, false).valueOf();
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, divideScalar, true).valueOf();
    }
  });

  dotDivide.toTex = {
    2: '\\left(${args[0]}' + latex.operators['dotDivide'] + '${args[1]}\\right)'
  };
  
  return dotDivide;
}

exports.name = 'dotDivide';
exports.factory = factory;

},{"../../type/matrix/function/matrix":328,"../../type/matrix/utils/algorithm02":330,"../../type/matrix/utils/algorithm03":331,"../../type/matrix/utils/algorithm07":335,"../../type/matrix/utils/algorithm11":338,"../../type/matrix/utils/algorithm12":339,"../../type/matrix/utils/algorithm13":340,"../../type/matrix/utils/algorithm14":341,"../../utils/latex":360,"./divideScalar":248}],250:[function(require,module,exports){
'use strict';

function factory (type, config, load, typed) {

  var matrix = load(require('../../type/matrix/function/matrix'));
  var multiplyScalar = load(require('./multiplyScalar'));
  var latex = require('../../utils/latex');

  var algorithm02 = load(require('../../type/matrix/utils/algorithm02'));
  var algorithm09 = load(require('../../type/matrix/utils/algorithm09'));
  var algorithm11 = load(require('../../type/matrix/utils/algorithm11'));
  var algorithm13 = load(require('../../type/matrix/utils/algorithm13'));
  var algorithm14 = load(require('../../type/matrix/utils/algorithm14'));

  /**
   * Multiply two matrices element wise. The function accepts both matrices and
   * scalar values.
   *
   * Syntax:
   *
   *    math.dotMultiply(x, y)
   *
   * Examples:
   *
   *    math.dotMultiply(2, 4); // returns 8
   *
   *    a = [[9, 5], [6, 1]];
   *    b = [[3, 2], [5, 2]];
   *
   *    math.dotMultiply(a, b); // returns [[27, 10], [30, 2]]
   *    math.multiply(a, b);    // returns [[52, 28], [23, 14]]
   *
   * See also:
   *
   *    multiply, divide, dotDivide
   *
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} x Left hand value
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} y Right hand value
   * @return {number | BigNumber | Fraction | Complex | Unit | Array | Matrix}                    Multiplication of `x` and `y`
   */
  var dotMultiply = typed('dotMultiply', {
    
    'any, any': multiplyScalar,
    
    'Matrix, Matrix': function (x, y) {
      // result
      var c;

      // process matrix storage
      switch (x.storage()) {
        case 'sparse':
          switch (y.storage()) {
            case 'sparse':
              // sparse .* sparse
              c = algorithm09(x, y, multiplyScalar, false);
              break;
            default:
              // sparse .* dense
              c = algorithm02(y, x, multiplyScalar, true);
              break;
          }
          break;
        default:
          switch (y.storage()) {
            case 'sparse':
              // dense .* sparse
              c = algorithm02(x, y, multiplyScalar, false);
              break;
            default:
              // dense .* dense
              c = algorithm13(x, y, multiplyScalar);
              break;
          }
          break;
      }
      return c;
    },
    
    'Array, Array': function (x, y) {
      // use matrix implementation
      return dotMultiply(matrix(x), matrix(y)).valueOf();
    },
    
    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return dotMultiply(matrix(x), y);
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return dotMultiply(x, matrix(y));
    },

    'Matrix, any': function (x, y) {
      // result
      var c;
      // check storage format
      switch (x.storage()) {
        case 'sparse':
          c = algorithm11(x, y, multiplyScalar, false);
          break;
        default:
          c = algorithm14(x, y, multiplyScalar, false);
          break;
      }
      return c;
    },

    'any, Matrix': function (x, y) {
      // result
      var c;
      // check storage format
      switch (y.storage()) {
        case 'sparse':
          c = algorithm11(y, x, multiplyScalar, true);
          break;
        default:
          c = algorithm14(y, x, multiplyScalar, true);
          break;
      }
      return c;
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, multiplyScalar, false).valueOf();
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, multiplyScalar, true).valueOf();
    }
  });

  dotMultiply.toTex = {
    2: '\\left(${args[0]}' + latex.operators['dotMultiply'] + '${args[1]}\\right)'
  };
  
  return dotMultiply;
}

exports.name = 'dotMultiply';
exports.factory = factory;

},{"../../type/matrix/function/matrix":328,"../../type/matrix/utils/algorithm02":330,"../../type/matrix/utils/algorithm09":336,"../../type/matrix/utils/algorithm11":338,"../../type/matrix/utils/algorithm13":340,"../../type/matrix/utils/algorithm14":341,"../../utils/latex":360,"./multiplyScalar":263}],251:[function(require,module,exports){
'use strict';

function factory (type, config, load, typed) {

  var matrix = load(require('../../type/matrix/function/matrix'));
  var pow = load(require('./pow'));
  var latex = require('../../utils/latex');

  var algorithm03 = load(require('../../type/matrix/utils/algorithm03'));
  var algorithm07 = load(require('../../type/matrix/utils/algorithm07'));
  var algorithm11 = load(require('../../type/matrix/utils/algorithm11'));
  var algorithm12 = load(require('../../type/matrix/utils/algorithm12'));
  var algorithm13 = load(require('../../type/matrix/utils/algorithm13'));
  var algorithm14 = load(require('../../type/matrix/utils/algorithm14'));

  /**
   * Calculates the power of x to y element wise.
   *
   * Syntax:
   *
   *    math.dotPow(x, y)
   *
   * Examples:
   *
   *    math.dotPow(2, 3);            // returns number 8
   *
   *    var a = [[1, 2], [4, 3]];
   *    math.dotPow(a, 2);            // returns Array [[1, 4], [16, 9]]
   *    math.pow(a, 2);               // returns Array [[9, 8], [16, 17]]
   *
   * See also:
   *
   *    pow, sqrt, multiply
   *
   * @param  {number | BigNumber | Complex | Unit | Array | Matrix} x  The base
   * @param  {number | BigNumber | Complex | Unit | Array | Matrix} y  The exponent
   * @return {number | BigNumber | Complex | Unit | Array | Matrix}                     The value of `x` to the power `y`
   */
  var dotPow = typed('dotPow', {
    
    'any, any': pow,
    
    'Matrix, Matrix': function (x, y) {
      // result
      var c;

      // process matrix storage
      switch (x.storage()) {
        case 'sparse':
          switch (y.storage()) {
            case 'sparse':
              // sparse .^ sparse
              c = algorithm07(x, y, pow, false);
              break;
            default:
              // sparse .^ dense
              c = algorithm03(y, x, pow, true);
              break;
          }
          break;
        default:
          switch (y.storage()) {
            case 'sparse':
              // dense .^ sparse
              c = algorithm03(x, y, pow, false);
              break;
            default:
              // dense .^ dense
              c = algorithm13(x, y, pow);
              break;
          }
          break;
      }
      return c;
    },

    'Array, Array': function (x, y) {
      // use matrix implementation
      return dotPow(matrix(x), matrix(y)).valueOf();
    },

    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return dotPow(matrix(x), y);
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return dotPow(x, matrix(y));
    },

    'Matrix, any': function (x, y) {
      // result
      var c;
      // check storage format
      switch (x.storage()) {
        case 'sparse':
          c = algorithm11(x, y, dotPow, false);
          break;
        default:
          c = algorithm14(x, y, dotPow, false);
          break;
      }
      return c;
    },

    'any, Matrix': function (x, y) {
      // result
      var c;
      // check storage format
      switch (y.storage()) {
        case 'sparse':
          c = algorithm12(y, x, dotPow, true);
          break;
        default:
          c = algorithm14(y, x, dotPow, true);
          break;
      }
      return c;
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, dotPow, false).valueOf();
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, dotPow, true).valueOf();
    }
  });

  dotPow.toTex = {
    2: '\\left(${args[0]}' + latex.operators['dotPow'] + '${args[1]}\\right)'
  };
  
  return dotPow;
}

exports.name = 'dotPow';
exports.factory = factory;

},{"../../type/matrix/function/matrix":328,"../../type/matrix/utils/algorithm03":331,"../../type/matrix/utils/algorithm07":335,"../../type/matrix/utils/algorithm11":338,"../../type/matrix/utils/algorithm12":339,"../../type/matrix/utils/algorithm13":340,"../../type/matrix/utils/algorithm14":341,"../../utils/latex":360,"./pow":266}],252:[function(require,module,exports){
'use strict';

var deepMap = require('../../utils/collection/deepMap');

function factory (type, config, load, typed) {
  /**
   * Calculate the exponent of a value.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.exp(x)
   *
   * Examples:
   *
   *    math.exp(2);                  // returns number 7.3890560989306495
   *    math.pow(math.e, 2);          // returns number 7.3890560989306495
   *    math.log(math.exp(2));        // returns number 2
   *
   *    math.exp([1, 2, 3]);
   *    // returns Array [
   *    //   2.718281828459045,
   *    //   7.3890560989306495,
   *    //   20.085536923187668
   *    // ]
   *
   * See also:
   *
   *    log, pow
   *
   * @param {number | BigNumber | Complex | Array | Matrix} x  A number or matrix to exponentiate
   * @return {number | BigNumber | Complex | Array | Matrix} Exponent of `x`
   */
  var exp = typed('exp', {
    'number': Math.exp,

    'Complex': function (x) {
      return x.exp();
    },

    'BigNumber': function (x) {
      return x.exp();
    },

    'Array | Matrix': function (x) {
      // TODO: exp(sparse) should return a dense matrix since exp(0)==1
      return deepMap(x, exp);
    }
  });

  exp.toTex = {1: '\\exp\\left(${args[0]}\\right)'};

  return exp;
}

exports.name = 'exp';
exports.factory = factory;

},{"../../utils/collection/deepMap":353}],253:[function(require,module,exports){
'use strict';

var deepMap = require('../../utils/collection/deepMap');

function factory (type, config, load, typed) {
  /**
   * Round a value towards zero.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.fix(x)
   *
   * Examples:
   *
   *    math.fix(3.2);                // returns number 3
   *    math.fix(3.8);                // returns number 3
   *    math.fix(-4.2);               // returns number -4
   *    math.fix(-4.7);               // returns number -4
   *
   *    var c = math.complex(3.2, -2.7);
   *    math.fix(c);                  // returns Complex 3 - 2i
   *
   *    math.fix([3.2, 3.8, -4.7]);   // returns Array [3, 3, -4]
   *
   * See also:
   *
   *    ceil, floor, round
   *
   * @param {number | BigNumber | Fraction | Complex | Array | Matrix} x Number to be rounded
   * @return {number | BigNumber | Fraction | Complex | Array | Matrix}            Rounded value
   */
  var fix = typed('fix', {
    'number': function (x) {
      return (x > 0) ? Math.floor(x) : Math.ceil(x);
    },

    'Complex': function (x) {
      return new type.Complex(
          (x.re > 0) ? Math.floor(x.re) : Math.ceil(x.re),
          (x.im > 0) ? Math.floor(x.im) : Math.ceil(x.im)
      );
    },

    'BigNumber': function (x) {
      return x.isNegative() ? x.ceil() : x.floor();
    },

    'Fraction': function (x) {
      return x.s < 0 ? x.ceil() : x.floor();
    },

    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since fix(0) = 0
      return deepMap(x, fix, true);
    }
  });

  fix.toTex = {1: '\\mathrm{${name}}\\left(${args[0]}\\right)'};

  return fix;
}

exports.name = 'fix';
exports.factory = factory;

},{"../../utils/collection/deepMap":353}],254:[function(require,module,exports){
'use strict';

var deepMap = require('../../utils/collection/deepMap');

function factory (type, config, load, typed) {
  /**
   * Round a value towards minus infinity.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.floor(x)
   *
   * Examples:
   *
   *    math.floor(3.2);              // returns number 3
   *    math.floor(3.8);              // returns number 3
   *    math.floor(-4.2);             // returns number -5
   *    math.floor(-4.7);             // returns number -5
   *
   *    var c = math.complex(3.2, -2.7);
   *    math.floor(c);                // returns Complex 3 - 3i
   *
   *    math.floor([3.2, 3.8, -4.7]); // returns Array [3, 3, -5]
   *
   * See also:
   *
   *    ceil, fix, round
   *
   * @param  {number | BigNumber | Fraction | Complex | Array | Matrix} x  Number to be rounded
   * @return {number | BigNumber | Fraction | Complex | Array | Matrix} Rounded value
   */
  var floor = typed('floor', {
    'number': Math.floor,

    'Complex': function (x) {
      return x.floor();
    },

    'BigNumber': function (x) {
      return x.floor();
    },

    'Fraction': function (x) {
      return x.floor();
    },

    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since floor(0) = 0
      return deepMap(x, floor, true);
    }
  });

  floor.toTex = {1: '\\left\\lfloor${args[0]}\\right\\rfloor'};

  return floor;
}

exports.name = 'floor';
exports.factory = factory;

},{"../../utils/collection/deepMap":353}],255:[function(require,module,exports){
'use strict';

var isInteger = require('../../utils/number').isInteger;

function factory (type, config, load, typed) {

  var matrix = load(require('../../type/matrix/function/matrix'));

  var algorithm01 = load(require('../../type/matrix/utils/algorithm01'));
  var algorithm04 = load(require('../../type/matrix/utils/algorithm04'));
  var algorithm10 = load(require('../../type/matrix/utils/algorithm10'));
  var algorithm13 = load(require('../../type/matrix/utils/algorithm13'));
  var algorithm14 = load(require('../../type/matrix/utils/algorithm14'));

  /**
   * Calculate the greatest common divisor for two or more values or arrays.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.gcd(a, b)
   *    math.gcd(a, b, c, ...)
   *
   * Examples:
   *
   *    math.gcd(8, 12);              // returns 4
   *    math.gcd(-4, 6);              // returns 2
   *    math.gcd(25, 15, -10);        // returns 5
   *
   *    math.gcd([8, -4], [12, 6]);   // returns [4, 2]
   *
   * See also:
   *
   *    lcm, xgcd
   *
   * @param {... number | BigNumber | Fraction | Array | Matrix} args  Two or more integer numbers
   * @return {number | BigNumber | Fraction | Array | Matrix}                           The greatest common divisor
   */
  var gcd = typed('gcd', {

    'number, number': _gcd,

    'BigNumber, BigNumber': _gcdBigNumber,

    'Fraction, Fraction': function (x, y) {
      return x.gcd(y);
    },

    'Matrix, Matrix': function (x, y) {
      // result
      var c;

      // process matrix storage
      switch (x.storage()) {
        case 'sparse':
          switch (y.storage()) {
            case 'sparse':
              // sparse + sparse
              c = algorithm04(x, y, gcd);
              break;
            default:
              // sparse + dense
              c = algorithm01(y, x, gcd, true);
              break;
          }
          break;
        default:
          switch (y.storage()) {
            case 'sparse':
              // dense + sparse
              c = algorithm01(x, y, gcd, false);
              break;
            default:
              // dense + dense
              c = algorithm13(x, y, gcd);
              break;
          }
          break;
      }
      return c;
    },

    'Array, Array': function (x, y) {
      // use matrix implementation
      return gcd(matrix(x), matrix(y)).valueOf();
    },

    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return gcd(matrix(x), y);
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return gcd(x, matrix(y));
    },
    
    'Matrix, number | BigNumber': function (x, y) {
      // result
      var c;
      // check storage format
      switch (x.storage()) {
        case 'sparse':
          c = algorithm10(x, y, gcd, false);
          break;
        default:
          c = algorithm14(x, y, gcd, false);
          break;
      }
      return c;
    },

    'number | BigNumber, Matrix': function (x, y) {
      // result
      var c;
      // check storage format
      switch (y.storage()) {
        case 'sparse':
          c = algorithm10(y, x, gcd, true);
          break;
        default:
          c = algorithm14(y, x, gcd, true);
          break;
      }
      return c;
    },

    'Array, number | BigNumber': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, gcd, false).valueOf();
    },

    'number | BigNumber, Array': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, gcd, true).valueOf();
    },

    // TODO: need a smarter notation here
    'Array | Matrix | number | BigNumber, Array | Matrix | number | BigNumber, ...Array | Matrix | number | BigNumber': function (a, b, args) {
      var res = gcd(a, b);
      for (var i = 0; i < args.length; i++) {
        res = gcd(res, args[i]);
      }
      return res;
    }
  });

  gcd.toTex = '\\gcd\\left(${args}\\right)';

  return gcd;

  /**
   * Calculate gcd for BigNumbers
   * @param {BigNumber} a
   * @param {BigNumber} b
   * @returns {BigNumber} Returns greatest common denominator of a and b
   * @private
   */
  function _gcdBigNumber(a, b) {
    if (!a.isInt() || !b.isInt()) {
      throw new Error('Parameters in function gcd must be integer numbers');
    }

    // http://en.wikipedia.org/wiki/Euclidean_algorithm
    var zero = new type.BigNumber(0);
    while (!b.isZero()) {
      var r = a.mod(b);
      a = b;
      b = r;
    }
    return a.lt(zero) ? a.neg() : a;
  }
}

/**
 * Calculate gcd for numbers
 * @param {number} a
 * @param {number} b
 * @returns {number} Returns the greatest common denominator of a and b
 * @private
 */
function _gcd(a, b) {
  if (!isInteger(a) || !isInteger(b)) {
    throw new Error('Parameters in function gcd must be integer numbers');
  }

  // http://en.wikipedia.org/wiki/Euclidean_algorithm
  var r;
  while (b != 0) {
    r = a % b;
    a = b;
    b = r;
  }
  return (a < 0) ? -a : a;
}

exports.name = 'gcd';
exports.factory = factory;

},{"../../type/matrix/function/matrix":328,"../../type/matrix/utils/algorithm01":329,"../../type/matrix/utils/algorithm04":332,"../../type/matrix/utils/algorithm10":337,"../../type/matrix/utils/algorithm13":340,"../../type/matrix/utils/algorithm14":341,"../../utils/number":361}],256:[function(require,module,exports){
'use strict';

var flatten = require('../../utils/array').flatten;

function factory (type, config, load, typed) {
  var abs = load(require('./abs'));
  var add = load(require('./addScalar'));
  var divide = load(require('./divideScalar'));
  var multiply = load(require('./multiplyScalar'));
  var sqrt = load(require('./sqrt'));
  var smaller = load(require('../relational/smaller'));
  var isPositive = load(require('../utils/isPositive'));

  /**
   * Calculate the hypotenusa of a list with values. The hypotenusa is defined as:
   *
   *     hypot(a, b, c, ...) = sqrt(a^2 + b^2 + c^2 + ...)
   *
   * For matrix input, the hypotenusa is calculated for all values in the matrix.
   *
   * Syntax:
   *
   *     math.hypot(a, b, ...)
   *     math.hypot([a, b, c, ...])
   *
   * Examples:
   *
   *     math.hypot(3, 4);      // 5
   *     math.hypot(3, 4, 5);   // 7.0710678118654755
   *     math.hypot([3, 4, 5]); // 7.0710678118654755
   *     math.hypot(-2);        // 2
   *
   * See also:
   *
   *     abs, norm
   *
   * @param {... number | BigNumber} args
   * @return {number | BigNumber} Returns the hypothenusa of the input values.
   */
  var hypot = typed('hypot', {
    '... number | BigNumber': _hypot,

    'Array': function (x) {
      return hypot.apply(hypot, flatten(x));
    },

    'Matrix': function (x) {
      return hypot.apply(hypot, flatten(x.toArray()));
    }
  });

  /**
   * Calculate the hypotenusa for an Array with values
   * @param {Array.<number | BigNumber>} args
   * @return {number | BigNumber} Returns the result
   * @private
   */
  function _hypot (args) {
    // code based on `hypot` from es6-shim:
    // https://github.com/paulmillr/es6-shim/blob/master/es6-shim.js#L1619-L1633
    var result = 0;
    var largest = 0;

    for (var i = 0; i < args.length; i++) {
      var value = abs(args[i]);
      if (smaller(largest, value)) {
        result = multiply(result, multiply(divide(largest, value), divide(largest, value)));
        result = add(result, 1);
        largest = value;
      } else {
        result = add(result, isPositive(value) ? multiply(divide(value, largest), divide(value, largest)) : value);
      }
    }

    return multiply(largest, sqrt(result));
  }

  hypot.toTex = '\\hypot\\left(${args}\\right)';

  return hypot;
}

exports.name = 'hypot';
exports.factory = factory;

},{"../../utils/array":346,"../relational/smaller":290,"../utils/isPositive":323,"./abs":241,"./addScalar":243,"./divideScalar":248,"./multiplyScalar":263,"./sqrt":269}],257:[function(require,module,exports){
module.exports = [
  require('./abs'),
  require('./add'),
  require('./addScalar'),
  require('./cbrt'),
  require('./ceil'),
  require('./cube'),
  require('./divide'),
  require('./dotDivide'),
  require('./dotMultiply'),
  require('./dotPow'),
  require('./exp'),
  require('./fix'),
  require('./floor'),
  require('./gcd'),
  require('./hypot'),
  require('./lcm'),
  require('./log'),
  require('./log10'),
  require('./mod'),
  require('./multiply'),
  require('./norm'),
  require('./nthRoot'),
  require('./pow'),
  require('./round'),
  require('./sign'),
  require('./sqrt'),
  require('./square'),
  require('./subtract'),
  require('./unaryMinus'),
  require('./unaryPlus'),
  require('./xgcd')
];

},{"./abs":241,"./add":242,"./addScalar":243,"./cbrt":244,"./ceil":245,"./cube":246,"./divide":247,"./dotDivide":249,"./dotMultiply":250,"./dotPow":251,"./exp":252,"./fix":253,"./floor":254,"./gcd":255,"./hypot":256,"./lcm":258,"./log":259,"./log10":260,"./mod":261,"./multiply":262,"./norm":264,"./nthRoot":265,"./pow":266,"./round":267,"./sign":268,"./sqrt":269,"./square":270,"./subtract":271,"./unaryMinus":272,"./unaryPlus":273,"./xgcd":274}],258:[function(require,module,exports){
'use strict';

var isInteger = require('../../utils/number').isInteger;

function factory (type, config, load, typed) {
  
  var matrix = load(require('../../type/matrix/function/matrix'));

  var algorithm02 = load(require('../../type/matrix/utils/algorithm02'));
  var algorithm06 = load(require('../../type/matrix/utils/algorithm06'));
  var algorithm11 = load(require('../../type/matrix/utils/algorithm11'));
  var algorithm13 = load(require('../../type/matrix/utils/algorithm13'));
  var algorithm14 = load(require('../../type/matrix/utils/algorithm14'));

  /**
   * Calculate the least common multiple for two or more values or arrays.
   *
   * lcm is defined as:
   *
   *     lcm(a, b) = abs(a * b) / gcd(a, b)
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.lcm(a, b)
   *    math.lcm(a, b, c, ...)
   *
   * Examples:
   *
   *    math.lcm(4, 6);               // returns 12
   *    math.lcm(6, 21);              // returns 42
   *    math.lcm(6, 21, 5);           // returns 210
   *
   *    math.lcm([4, 6], [6, 21]);    // returns [12, 42]
   *
   * See also:
   *
   *    gcd, xgcd
   *
   * @param {... number | BigNumber | Array | Matrix} args  Two or more integer numbers
   * @return {number | BigNumber | Array | Matrix}                           The least common multiple
   */
  var lcm = typed('lcm', {
    'number, number': _lcm,

    'BigNumber, BigNumber': _lcmBigNumber,

    'Fraction, Fraction': function (x, y) {

      return x.lcm(y);
    },

    'Matrix, Matrix': function (x, y) {
      // result
      var c;

      // process matrix storage
      switch (x.storage()) {
        case 'sparse':
          switch (y.storage()) {
            case 'sparse':
              // sparse + sparse
              c = algorithm06(x, y, lcm);
              break;
            default:
              // sparse + dense
              c = algorithm02(y, x, lcm, true);
              break;
          }
          break;
        default:
          switch (y.storage()) {
            case 'sparse':
              // dense + sparse
              c = algorithm02(x, y, lcm, false);
              break;
            default:
              // dense + dense
              c = algorithm13(x, y, lcm);
              break;
          }
          break;
      }
      return c;
    },

    'Array, Array': function (x, y) {
      // use matrix implementation
      return lcm(matrix(x), matrix(y)).valueOf();
    },

    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return lcm(matrix(x), y);
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return lcm(x, matrix(y));
    },

    'Matrix, number | BigNumber': function (x, y) {
      // result
      var c;
      // check storage format
      switch (x.storage()) {
        case 'sparse':
          c = algorithm11(x, y, lcm, false);
          break;
        default:
          c = algorithm14(x, y, lcm, false);
          break;
      }
      return c;
    },

    'number | BigNumber, Matrix': function (x, y) {
      // result
      var c;
      // check storage format
      switch (y.storage()) {
        case 'sparse':
          c = algorithm11(y, x, lcm, true);
          break;
        default:
          c = algorithm14(y, x, lcm, true);
          break;
      }
      return c;
    },

    'Array, number | BigNumber': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, lcm, false).valueOf();
    },

    'number | BigNumber, Array': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, lcm, true).valueOf();
    },

    // TODO: need a smarter notation here
    'Array | Matrix | number | BigNumber, Array | Matrix | number | BigNumber, ...Array | Matrix | number | BigNumber': function (a, b, args) {
      var res = lcm(a, b);
      for (var i = 0; i < args.length; i++) {
        res = lcm(res, args[i]);
      }
      return res;
    }
  });

  lcm.toTex = undefined;  // use default template

  return lcm;

  /**
   * Calculate lcm for two BigNumbers
   * @param {BigNumber} a
   * @param {BigNumber} b
   * @returns {BigNumber} Returns the least common multiple of a and b
   * @private
   */
  function _lcmBigNumber(a, b) {
    if (!a.isInt() || !b.isInt()) {
      throw new Error('Parameters in function lcm must be integer numbers');
    }

    if (a.isZero() || b.isZero()) {
      return new type.BigNumber(0);
    }

    // http://en.wikipedia.org/wiki/Euclidean_algorithm
    // evaluate lcm here inline to reduce overhead
    var prod = a.times(b);
    while (!b.isZero()) {
      var t = b;
      b = a.mod(t);
      a = t;
    }
    return prod.div(a).abs();
  }
}

/**
 * Calculate lcm for two numbers
 * @param {number} a
 * @param {number} b
 * @returns {number} Returns the least common multiple of a and b
 * @private
 */
function _lcm (a, b) {
  if (!isInteger(a) || !isInteger(b)) {
    throw new Error('Parameters in function lcm must be integer numbers');
  }

  if (a == 0 || b == 0) {
    return 0;
  }

  // http://en.wikipedia.org/wiki/Euclidean_algorithm
  // evaluate lcm here inline to reduce overhead
  var t;
  var prod = a * b;
  while (b != 0) {
    t = b;
    b = a % t;
    a = t;
  }
  return Math.abs(prod / a);
}

exports.name = 'lcm';
exports.factory = factory;

},{"../../type/matrix/function/matrix":328,"../../type/matrix/utils/algorithm02":330,"../../type/matrix/utils/algorithm06":334,"../../type/matrix/utils/algorithm11":338,"../../type/matrix/utils/algorithm13":340,"../../type/matrix/utils/algorithm14":341,"../../utils/number":361}],259:[function(require,module,exports){
'use strict';

var deepMap = require('../../utils/collection/deepMap');

function factory (type, config, load, typed) {
  var divideScalar = load(require('./divideScalar'));

  /**
   * Calculate the logarithm of a value.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.log(x)
   *    math.log(x, base)
   *
   * Examples:
   *
   *    math.log(3.5);                  // returns 1.252762968495368
   *    math.exp(math.log(2.4));        // returns 2.4
   *
   *    math.pow(10, 4);                // returns 10000
   *    math.log(10000, 10);            // returns 4
   *    math.log(10000) / math.log(10); // returns 4
   *
   *    math.log(1024, 2);              // returns 10
   *    math.pow(2, 10);                // returns 1024
   *
   * See also:
   *
   *    exp, log10
   *
   * @param {number | BigNumber | Complex | Array | Matrix} x
   *            Value for which to calculate the logarithm.
   * @param {number | BigNumber | Complex} [base=e]
   *            Optional base for the logarithm. If not provided, the natural
   *            logarithm of `x` is calculated.
   * @return {number | BigNumber | Complex | Array | Matrix}
   *            Returns the logarithm of `x`
   */
  var log = typed('log', {
    'number': function (x) {
      if (x >= 0 || config.predictable) {
        return Math.log(x);
      }
      else {
        // negative value -> complex value computation
        return new type.Complex(x, 0).log();
      }
    },

    'Complex': function (x) {
      return x.log();
    },

    'BigNumber': function (x) {
      if (!x.isNegative() || config.predictable) {
        return x.ln();
      }
      else {
        // downgrade to number, return Complex valued result
        return new type.Complex(x.toNumber(), 0).log();
      }
    },

    'Array | Matrix': function (x) {
      return deepMap(x, log);
    },

    'any, any': function (x, base) {
      // calculate logarithm for a specified base, log(x, base)
      return divideScalar(log(x), log(base));
    }
  });

  log.toTex = {
    1: '\\ln\\left(${args[0]}\\right)',
    2: '\\log_{${args[1]}}\\left(${args[0]}\\right)'
  };

  return log;
}

exports.name = 'log';
exports.factory = factory;

},{"../../utils/collection/deepMap":353,"./divideScalar":248}],260:[function(require,module,exports){
'use strict';

var deepMap = require('../../utils/collection/deepMap');

function factory (type, config, load, typed) {
  /**
   * Calculate the 10-base logarithm of a value. This is the same as calculating `log(x, 10)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.log10(x)
   *
   * Examples:
   *
   *    math.log10(0.00001);            // returns -5
   *    math.log10(10000);              // returns 4
   *    math.log(10000) / math.log(10); // returns 4
   *    math.pow(10, 4);                // returns 10000
   *
   * See also:
   *
   *    exp, log
   *
   * @param {number | BigNumber | Complex | Array | Matrix} x
   *            Value for which to calculate the logarithm.
   * @return {number | BigNumber | Complex | Array | Matrix}
   *            Returns the 10-base logarithm of `x`
   */
  var log10 = typed('log10', {
    'number': function (x) {
      if (x >= 0 || config.predictable) {
        return _log10(x);
      }
      else {
        // negative value -> complex value computation
        return new type.Complex(x, 0).log().div(Math.LN10);
      }
    },

    'Complex': function (x) {
      return new type.Complex(x).log().div(Math.LN10);
    },

    'BigNumber': function (x) {
      if (!x.isNegative() || config.predictable) {
        return x.log();
      }
      else {
        // downgrade to number, return Complex valued result
        return new type.Complex(x.toNumber(), 0).log().div(Math.LN10);
      }
    },

    'Array | Matrix': function (x) {
      return deepMap(x, log10);
    }
  });

  log10.toTex = {1: '\\log_{10}\\left(${args[0]}\\right)'};

  return log10;
}

/**
 * Calculate the 10-base logarithm of a number
 * @param {number} x
 * @return {number}
 * @private
 */
var _log10 = Math.log10 || function (x) {
  return Math.log(x) / Math.LN10;
};

exports.name = 'log10';
exports.factory = factory;


},{"../../utils/collection/deepMap":353}],261:[function(require,module,exports){
'use strict';

function factory (type, config, load, typed) {

  var matrix = load(require('../../type/matrix/function/matrix'));
  var latex = require('../../utils/latex');

  var algorithm02 = load(require('../../type/matrix/utils/algorithm02'));
  var algorithm03 = load(require('../../type/matrix/utils/algorithm03'));
  var algorithm05 = load(require('../../type/matrix/utils/algorithm05'));
  var algorithm11 = load(require('../../type/matrix/utils/algorithm11'));
  var algorithm12 = load(require('../../type/matrix/utils/algorithm12'));
  var algorithm13 = load(require('../../type/matrix/utils/algorithm13'));
  var algorithm14 = load(require('../../type/matrix/utils/algorithm14'));
  
  /**
   * Calculates the modulus, the remainder of an integer division.
   *
   * For matrices, the function is evaluated element wise.
   *
   * The modulus is defined as:
   *
   *     x - y * floor(x / y)
   *
   * See http://en.wikipedia.org/wiki/Modulo_operation.
   *
   * Syntax:
   *
   *    math.mod(x, y)
   *
   * Examples:
   *
   *    math.mod(8, 3);                // returns 2
   *    math.mod(11, 2);               // returns 1
   *
   *    function isOdd(x) {
   *      return math.mod(x, 2) != 0;
   *    }
   *
   *    isOdd(2);                      // returns false
   *    isOdd(3);                      // returns true
   *
   * See also:
   *
   *    divide
   *
   * @param  {number | BigNumber | Fraction | Array | Matrix} x Dividend
   * @param  {number | BigNumber | Fraction | Array | Matrix} y Divisor
   * @return {number | BigNumber | Fraction | Array | Matrix} Returns the remainder of `x` divided by `y`.
   */
  var mod = typed('mod', {

    'number, number': _mod,

    'BigNumber, BigNumber': function (x, y) {
      return y.isZero() ? x : x.mod(y);
    },

    'Fraction, Fraction': function (x, y) {
      return x.mod(y);
    },

    'Matrix, Matrix': function (x, y) {
      // result
      var c;

      // process matrix storage
      switch (x.storage()) {
        case 'sparse':
          switch (y.storage()) {
            case 'sparse':
              // mod(sparse, sparse)
              c = algorithm05(x, y, mod, false);
              break;
            default:
              // mod(sparse, dense)
              c = algorithm02(y, x, mod, true);
              break;
          }
          break;
        default:
          switch (y.storage()) {
            case 'sparse':
              // mod(dense, sparse)
              c = algorithm03(x, y, mod, false);
              break;
            default:
              // mod(dense, dense)
              c = algorithm13(x, y, mod);
              break;
          }
          break;
      }
      return c;
    },
    
    'Array, Array': function (x, y) {
      // use matrix implementation
      return mod(matrix(x), matrix(y)).valueOf();
    },

    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return mod(matrix(x), y);
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return mod(x, matrix(y));
    },

    'Matrix, any': function (x, y) {
      // result
      var c;
      // check storage format
      switch (x.storage()) {
        case 'sparse':
          c = algorithm11(x, y, mod, false);
          break;
        default:
          c = algorithm14(x, y, mod, false);
          break;
      }
      return c;
    },

    'any, Matrix': function (x, y) {
      // result
      var c;
      // check storage format
      switch (y.storage()) {
        case 'sparse':
          c = algorithm12(y, x, mod, true);
          break;
        default:
          c = algorithm14(y, x, mod, true);
          break;
      }
      return c;
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, mod, false).valueOf();
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, mod, true).valueOf();
    }
  });

  mod.toTex = {
    2: '\\left(${args[0]}' + latex.operators['mod'] + '${args[1]}\\right)'
  };

  return mod;

  /**
   * Calculate the modulus of two numbers
   * @param {number} x
   * @param {number} y
   * @returns {number} res
   * @private
   */
  function _mod(x, y) {
    if (y > 0) {
      // We don't use JavaScript's % operator here as this doesn't work
      // correctly for x < 0 and x == 0
      // see http://en.wikipedia.org/wiki/Modulo_operation
      return x - y * Math.floor(x / y);
    }
    else if (y === 0) {
      return x;
    }
    else { // y < 0
      // TODO: implement mod for a negative divisor
      throw new Error('Cannot calculate mod for a negative divisor');
    }
  }
}

exports.name = 'mod';
exports.factory = factory;

},{"../../type/matrix/function/matrix":328,"../../type/matrix/utils/algorithm02":330,"../../type/matrix/utils/algorithm03":331,"../../type/matrix/utils/algorithm05":333,"../../type/matrix/utils/algorithm11":338,"../../type/matrix/utils/algorithm12":339,"../../type/matrix/utils/algorithm13":340,"../../type/matrix/utils/algorithm14":341,"../../utils/latex":360}],262:[function(require,module,exports){
'use strict';

var extend = require('../../utils/object').extend;
var array = require('../../utils/array');

function factory (type, config, load, typed) {
  var latex = require('../../utils/latex');

  var matrix = load(require('../../type/matrix/function/matrix'));
  var addScalar = load(require('./addScalar'));
  var multiplyScalar = load(require('./multiplyScalar'));
  var equalScalar = load(require('../relational/equalScalar'));

  var algorithm11 = load(require('../../type/matrix/utils/algorithm11'));
  var algorithm14 = load(require('../../type/matrix/utils/algorithm14'));
  
  var DenseMatrix = type.DenseMatrix;
  var SparseMatrix = type.SparseMatrix;

  /**
   * Multiply two or more values, `x * y`.
   * For matrices, the matrix product is calculated.
   *
   * Syntax:
   *
   *    math.multiply(x, y)
   *    math.multiply(x, y, z, ...)
   *
   * Examples:
   *
   *    math.multiply(4, 5.2);        // returns number 20.8
   *    math.multiply(2, 3, 4);       // returns number 24
   *
   *    var a = math.complex(2, 3);
   *    var b = math.complex(4, 1);
   *    math.multiply(a, b);          // returns Complex 5 + 14i
   *
   *    var c = [[1, 2], [4, 3]];
   *    var d = [[1, 2, 3], [3, -4, 7]];
   *    math.multiply(c, d);          // returns Array [[7, -6, 17], [13, -4, 33]]
   *
   *    var e = math.unit('2.1 km');
   *    math.multiply(3, e);          // returns Unit 6.3 km
   *
   * See also:
   *
   *    divide, prod, cross, dot
   *
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} x First value to multiply
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} y Second value to multiply
   * @return {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} Multiplication of `x` and `y`
   */
  var multiply = typed('multiply', extend({
    // we extend the signatures of multiplyScalar with signatures dealing with matrices

    'Array, Array': function (x, y) {
      // check dimensions
      _validateMatrixDimensions(array.size(x), array.size(y));

      // use dense matrix implementation
      var m = multiply(matrix(x), matrix(y));
      // return array or scalar
      return (m && m.isMatrix === true) ? m.valueOf() : m;
    },

    'Matrix, Matrix': function (x, y) {
      // dimensions
      var xsize = x.size();
      var ysize = y.size();

      // check dimensions
      _validateMatrixDimensions(xsize, ysize);

      // process dimensions
      if (xsize.length === 1) {
        // process y dimensions
        if (ysize.length === 1) {
          // Vector * Vector
          return _multiplyVectorVector(x, y, xsize[0]);
        }
        // Vector * Matrix
        return _multiplyVectorMatrix(x, y);
      }
      // process y dimensions
      if (ysize.length === 1) {
        // Matrix * Vector
        return _multiplyMatrixVector(x, y);
      }
      // Matrix * Matrix
      return _multiplyMatrixMatrix(x, y);
    },

    'Matrix, Array': function (x, y) {
      // use Matrix * Matrix implementation
      return multiply(x, matrix(y));
    },

    'Array, Matrix': function (x, y) {
      // use Matrix * Matrix implementation
      return multiply(matrix(x, y.storage()), y);
    },

    'Matrix, any': function (x, y) {
      // result
      var c;
      
      // process storage format
      switch (x.storage()) {
        case 'sparse':
          c = algorithm11(x, y, multiplyScalar, false);
          break;
        case 'dense':
          c = algorithm14(x, y, multiplyScalar, false);
          break;
      }
      return c;
    },

    'any, Matrix': function (x, y) {
      // result
      var c;
      // check storage format
      switch (y.storage()) {
        case 'sparse':
          c = algorithm11(y, x, multiplyScalar, true);
          break;
        case 'dense':
          c = algorithm14(y, x, multiplyScalar, true);
          break;
      }
      return c;
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, multiplyScalar, false).valueOf();
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, multiplyScalar, true).valueOf();
    },

    'any, any': multiplyScalar,

    'any, any, ...any': function (x, y, rest) {
      var result = multiply(x, y);

      for (var i = 0; i < rest.length; i++) {
        result = multiply(result, rest[i]);
      }

      return result;
    }
  }, multiplyScalar.signatures));

  var _validateMatrixDimensions = function (size1, size2) {
    // check left operand dimensions
    switch (size1.length) {
      case 1:
        // check size2
        switch (size2.length) {
          case 1:
            // Vector x Vector
            if (size1[0] !== size2[0]) {
              // throw error
              throw new RangeError('Dimension mismatch in multiplication. Vectors must have the same length');
            }
            break;
          case 2:
            // Vector x Matrix
            if (size1[0] !== size2[0]) {
              // throw error
              throw new RangeError('Dimension mismatch in multiplication. Vector length (' + size1[0] + ') must match Matrix rows (' + size2[0] + ')');
            }
            break;
          default:
            throw new Error('Can only multiply a 1 or 2 dimensional matrix (Matrix B has ' + size2.length + ' dimensions)');
        }
        break;
      case 2:
        // check size2
        switch (size2.length) {
          case 1:
            // Matrix x Vector
            if (size1[1] !== size2[0]) {
              // throw error
              throw new RangeError('Dimension mismatch in multiplication. Matrix columns (' + size1[1] + ') must match Vector length (' + size2[0] + ')');
            }
            break;
          case 2:
            // Matrix x Matrix
            if (size1[1] !== size2[0]) {
              // throw error
              throw new RangeError('Dimension mismatch in multiplication. Matrix A columns (' + size1[1] + ') must match Matrix B rows (' + size2[0] + ')');
            }
            break;
          default:
            throw new Error('Can only multiply a 1 or 2 dimensional matrix (Matrix B has ' + size2.length + ' dimensions)');
        }
        break;
      default:
        throw new Error('Can only multiply a 1 or 2 dimensional matrix (Matrix A has ' + size1.length + ' dimensions)');
    }
  };

  /**
   * C = A * B
   *
   * @param {Matrix} a            Dense Vector   (N)
   * @param {Matrix} b            Dense Vector   (N)
   *
   * @return {number}             Scalar value
   */
  var _multiplyVectorVector = function (a, b, n) {
    // check empty vector
    if (n === 0)
      throw new Error('Cannot multiply two empty vectors');

    // a dense
    var adata = a._data;
    var adt = a._datatype;
    // b dense
    var bdata = b._data;
    var bdt = b._datatype;

    // datatype
    var dt;
    // addScalar signature to use
    var af = addScalar;
    // multiplyScalar signature to use
    var mf = multiplyScalar;

    // process data types
    if (adt && bdt && adt === bdt && typeof adt === 'string') {
      // datatype
      dt = adt;
      // find signatures that matches (dt, dt)
      af = typed.find(addScalar, [dt, dt]);
      mf = typed.find(multiplyScalar, [dt, dt]);
    }
    
    // result (do not initialize it with zero)
    var c = mf(adata[0], bdata[0]);
    // loop data
    for (var i = 1; i < n; i++) {
      // multiply and accumulate
      c = af(c, mf(adata[i], bdata[i]));
    }
    return c;
  };

  /**
   * C = A * B
   *
   * @param {Matrix} a            Dense Vector   (M)
   * @param {Matrix} b            Matrix         (MxN)
   *
   * @return {Matrix}             Dense Vector   (N)
   */
  var _multiplyVectorMatrix = function (a, b) {
    // process storage
    switch (b.storage()) {
      case 'dense':
        return _multiplyVectorDenseMatrix(a, b);
    }
    throw new Error('Not implemented');
  };

  /**
   * C = A * B
   *
   * @param {Matrix} a            Dense Vector   (M)
   * @param {Matrix} b            Dense Matrix   (MxN)
   *
   * @return {Matrix}             Dense Vector   (N)
   */
  var _multiplyVectorDenseMatrix = function (a, b) {
    // a dense
    var adata = a._data;
    var asize = a._size;
    var adt = a._datatype;
    // b dense
    var bdata = b._data;
    var bsize = b._size;
    var bdt = b._datatype;
    // rows & columns
    var alength = asize[0];
    var bcolumns = bsize[1];

    // datatype
    var dt;
    // addScalar signature to use
    var af = addScalar;
    // multiplyScalar signature to use
    var mf = multiplyScalar;

    // process data types
    if (adt && bdt && adt === bdt && typeof adt === 'string') {
      // datatype
      dt = adt;
      // find signatures that matches (dt, dt)
      af = typed.find(addScalar, [dt, dt]);
      mf = typed.find(multiplyScalar, [dt, dt]);
    }

    // result
    var c = [];

    // loop matrix columns
    for (var j = 0; j < bcolumns; j++) {
      // sum (do not initialize it with zero)
      var sum = mf(adata[0], bdata[0][j]);      
      // loop vector
      for (var i = 1; i < alength; i++) {
        // multiply & accumulate
        sum = af(sum, mf(adata[i], bdata[i][j]));
      }
      c[j] = sum;
    }

    // return matrix
    return new DenseMatrix({
      data: c,
      size: [bcolumns],
      datatype: dt
    });
  };

  /**
   * C = A * B
   *
   * @param {Matrix} a            Matrix         (MxN)
   * @param {Matrix} b            Dense Vector   (N)
   *
   * @return {Matrix}             Dense Vector   (M)
   */
  var _multiplyMatrixVector = function (a, b) {
    // process storage
    switch (a.storage()) {
      case 'dense':
        return _multiplyDenseMatrixVector(a, b);
      case 'sparse':
        return _multiplySparseMatrixVector(a, b);
    }
  };

  /**
   * C = A * B
   *
   * @param {Matrix} a            Matrix         (MxN)
   * @param {Matrix} b            Matrix         (NxC)
   *
   * @return {Matrix}             Matrix         (MxC)
   */
  var _multiplyMatrixMatrix = function (a, b) {
    // process storage
    switch (a.storage()) {
      case 'dense':
        // process storage
        switch (b.storage()) {
          case 'dense':
            return _multiplyDenseMatrixDenseMatrix(a, b);
          case 'sparse':
            return _multiplyDenseMatrixSparseMatrix(a, b);
        }
        break;
      case 'sparse':
        // process storage
        switch (b.storage()) {
          case 'dense':
            return _multiplySparseMatrixDenseMatrix(a, b);
          case 'sparse':
            return _multiplySparseMatrixSparseMatrix(a, b);
        }
        break;
    }
  };

  /**
   * C = A * B
   *
   * @param {Matrix} a            DenseMatrix  (MxN)
   * @param {Matrix} b            Dense Vector (N)
   *
   * @return {Matrix}             Dense Vector (M) 
   */ 
  var _multiplyDenseMatrixVector = function (a, b) {
    // a dense
    var adata = a._data;
    var asize = a._size;
    var adt = a._datatype;
    // b dense
    var bdata = b._data;
    var bdt = b._datatype;
    // rows & columns
    var arows = asize[0];
    var acolumns = asize[1];

    // datatype
    var dt;
    // addScalar signature to use
    var af = addScalar;
    // multiplyScalar signature to use
    var mf = multiplyScalar;

    // process data types
    if (adt && bdt && adt === bdt && typeof adt === 'string') {
      // datatype
      dt = adt;
      // find signatures that matches (dt, dt)
      af = typed.find(addScalar, [dt, dt]);
      mf = typed.find(multiplyScalar, [dt, dt]);
    }

    // result
    var c = [];

    // loop matrix a rows
    for (var i = 0; i < arows; i++) {
      // current row
      var row = adata[i];
      // sum (do not initialize it with zero)
      var sum = mf(row[0], bdata[0]);
      // loop matrix a columns
      for (var j = 1; j < acolumns; j++) {
        // multiply & accumulate
        sum = af(sum, mf(row[j], bdata[j]));
      }
      c[i] = sum;
    }

    // return matrix
    return new DenseMatrix({
      data: c,
      size: [arows],
      datatype: dt
    });
  };

  /**
   * C = A * B
   *
   * @param {Matrix} a            DenseMatrix    (MxN)
   * @param {Matrix} b            DenseMatrix    (NxC)
   *
   * @return {Matrix}             DenseMatrix    (MxC)
   */
  var _multiplyDenseMatrixDenseMatrix = function (a, b) {
    // a dense
    var adata = a._data;
    var asize = a._size;
    var adt = a._datatype;
    // b dense
    var bdata = b._data;
    var bsize = b._size;
    var bdt = b._datatype;
    // rows & columns
    var arows = asize[0];
    var acolumns = asize[1];
    var bcolumns = bsize[1];

    // datatype
    var dt;
    // addScalar signature to use
    var af = addScalar;
    // multiplyScalar signature to use
    var mf = multiplyScalar;

    // process data types
    if (adt && bdt && adt === bdt && typeof adt === 'string') {
      // datatype
      dt = adt;
      // find signatures that matches (dt, dt)
      af = typed.find(addScalar, [dt, dt]);
      mf = typed.find(multiplyScalar, [dt, dt]);
    }
    
    // result
    var c = [];

    // loop matrix a rows
    for (var i = 0; i < arows; i++) {
      // current row
      var row = adata[i];
      // initialize row array
      c[i] = [];
      // loop matrix b columns
      for (var j = 0; j < bcolumns; j++) {
        // sum (avoid initializing sum to zero)
        var sum = mf(row[0], bdata[0][j]);
        // loop matrix a columns
        for (var x = 1; x < acolumns; x++) {
          // multiply & accumulate
          sum = af(sum, mf(row[x], bdata[x][j]));
        }
        c[i][j] = sum;
      }
    }

    // return matrix
    return new DenseMatrix({
      data: c,
      size: [arows, bcolumns],
      datatype: dt
    });
  };

  /**
   * C = A * B
   *
   * @param {Matrix} a            DenseMatrix    (MxN)
   * @param {Matrix} b            SparseMatrix   (NxC)
   *
   * @return {Matrix}             SparseMatrix   (MxC)
   */
  var _multiplyDenseMatrixSparseMatrix = function (a, b) {
    // a dense
    var adata = a._data;
    var asize = a._size;
    var adt = a._datatype;
    // b sparse
    var bvalues = b._values;
    var bindex = b._index;
    var bptr = b._ptr;
    var bsize = b._size;
    var bdt = b._datatype;
    // validate b matrix
    if (!bvalues)
      throw new Error('Cannot multiply Dense Matrix times Pattern only Matrix');
    // rows & columns
    var arows = asize[0];
    var bcolumns = bsize[1];
    
    // datatype
    var dt;
    // addScalar signature to use
    var af = addScalar;
    // multiplyScalar signature to use
    var mf = multiplyScalar;
    // equalScalar signature to use
    var eq = equalScalar;
    // zero value
    var zero = 0;

    // process data types
    if (adt && bdt && adt === bdt && typeof adt === 'string') {
      // datatype
      dt = adt;
      // find signatures that matches (dt, dt)
      af = typed.find(addScalar, [dt, dt]);
      mf = typed.find(multiplyScalar, [dt, dt]);
      eq = typed.find(equalScalar, [dt, dt]);
      // convert 0 to the same datatype
      zero = typed.convert(0, dt);
    }

    // result
    var cvalues = [];
    var cindex = [];
    var cptr = [];
    // c matrix
    var c = new SparseMatrix({
      values : cvalues,
      index: cindex,
      ptr: cptr,
      size: [arows, bcolumns],
      datatype: dt
    });

    // loop b columns
    for (var jb = 0; jb < bcolumns; jb++) {
      // update ptr
      cptr[jb] = cindex.length;
      // indeces in column jb
      var kb0 = bptr[jb];
      var kb1 = bptr[jb + 1];
      // do not process column jb if no data exists
      if (kb1 > kb0) {
        // last row mark processed
        var last = 0;
        // loop a rows
        for (var i = 0; i < arows; i++) {
          // column mark
          var mark = i + 1;
          // C[i, jb]
          var cij;
          // values in b column j
          for (var kb = kb0; kb < kb1; kb++) {
            // row
            var ib = bindex[kb];
            // check value has been initialized
            if (last !== mark) {
              // first value in column jb
              cij = mf(adata[i][ib], bvalues[kb]);
              // update mark
              last = mark;
            }
            else {
              // accumulate value
              cij = af(cij, mf(adata[i][ib], bvalues[kb]));
            }
          }
          // check column has been processed and value != 0
          if (last === mark && !eq(cij, zero)) {
            // push row & value
            cindex.push(i);
            cvalues.push(cij);
          }
        }
      }
    }
    // update ptr
    cptr[bcolumns] = cindex.length;

    // return sparse matrix
    return c;
  };

  /**
   * C = A * B
   *
   * @param {Matrix} a            SparseMatrix    (MxN)
   * @param {Matrix} b            Dense Vector (N)
   *
   * @return {Matrix}             SparseMatrix    (M, 1) 
   */
  var _multiplySparseMatrixVector = function (a, b) {
    // a sparse
    var avalues = a._values;
    var aindex = a._index;
    var aptr = a._ptr;
    var adt = a._datatype;
    // validate a matrix
    if (!avalues)
      throw new Error('Cannot multiply Pattern only Matrix times Dense Matrix');
    // b dense
    var bdata = b._data;
    var bdt = b._datatype;
    // rows & columns
    var arows = a._size[0];
    var brows = b._size[0];
    // result
    var cvalues = [];
    var cindex = [];
    var cptr = [];
    
    // datatype
    var dt;
    // addScalar signature to use
    var af = addScalar;
    // multiplyScalar signature to use
    var mf = multiplyScalar;
    // equalScalar signature to use
    var eq = equalScalar;
    // zero value
    var zero = 0;

    // process data types
    if (adt && bdt && adt === bdt && typeof adt === 'string') {
      // datatype
      dt = adt;
      // find signatures that matches (dt, dt)
      af = typed.find(addScalar, [dt, dt]);
      mf = typed.find(multiplyScalar, [dt, dt]);
      eq = typed.find(equalScalar, [dt, dt]);
      // convert 0 to the same datatype
      zero = typed.convert(0, dt);
    }

    // workspace
    var x = [];
    // vector with marks indicating a value x[i] exists in a given column
    var w = [];

    // update ptr
    cptr[0] = 0;
    // rows in b
    for (var ib = 0; ib < brows; ib++) {
      // b[ib]
      var vbi = bdata[ib];
      // check b[ib] != 0, avoid loops
      if (!eq(vbi, zero)) {
        // A values & index in ib column
        for (var ka0 = aptr[ib], ka1 = aptr[ib + 1], ka = ka0; ka < ka1; ka++) {
          // a row
          var ia = aindex[ka];
          // check value exists in current j
          if (!w[ia]) {
            // ia is new entry in j
            w[ia] = true;
            // add i to pattern of C
            cindex.push(ia);
            // x(ia) = A
            x[ia] = mf(vbi, avalues[ka]);
          }
          else {
            // i exists in C already
            x[ia] = af(x[ia], mf(vbi, avalues[ka]));
          }
        }
      }
    }
    // copy values from x to column jb of c
    for (var p1 = cindex.length, p = 0; p < p1; p++) {
      // row
      var ic = cindex[p];
      // copy value
      cvalues[p] = x[ic];
    }
    // update ptr
    cptr[1] = cindex.length;

    // return sparse matrix
    return new SparseMatrix({
      values : cvalues,
      index: cindex,
      ptr: cptr,
      size: [arows, 1],
      datatype: dt
    });
  };

  /**
   * C = A * B
   *
   * @param {Matrix} a            SparseMatrix      (MxN)
   * @param {Matrix} b            DenseMatrix       (NxC)
   *
   * @return {Matrix}             SparseMatrix      (MxC)
   */
  var _multiplySparseMatrixDenseMatrix = function (a, b) {
    // a sparse
    var avalues = a._values;
    var aindex = a._index;
    var aptr = a._ptr;
    var adt = a._datatype;
    // validate a matrix
    if (!avalues)
      throw new Error('Cannot multiply Pattern only Matrix times Dense Matrix');
    // b dense
    var bdata = b._data;
    var bdt = b._datatype;
    // rows & columns
    var arows = a._size[0];
    var brows = b._size[0];
    var bcolumns = b._size[1];

    // datatype
    var dt;
    // addScalar signature to use
    var af = addScalar;
    // multiplyScalar signature to use
    var mf = multiplyScalar;
    // equalScalar signature to use
    var eq = equalScalar;
    // zero value
    var zero = 0;

    // process data types
    if (adt && bdt && adt === bdt && typeof adt === 'string') {
      // datatype
      dt = adt;
      // find signatures that matches (dt, dt)
      af = typed.find(addScalar, [dt, dt]);
      mf = typed.find(multiplyScalar, [dt, dt]);
      eq = typed.find(equalScalar, [dt, dt]);
      // convert 0 to the same datatype
      zero = typed.convert(0, dt);
    }

    // result
    var cvalues = [];
    var cindex = [];
    var cptr = [];
    // c matrix
    var c = new SparseMatrix({
      values : cvalues,
      index: cindex,
      ptr: cptr,
      size: [arows, bcolumns],
      datatype: dt
    });

    // workspace
    var x = [];
    // vector with marks indicating a value x[i] exists in a given column
    var w = [];

    // loop b columns
    for (var jb = 0; jb < bcolumns; jb++) {
      // update ptr
      cptr[jb] = cindex.length;
      // mark in workspace for current column
      var mark = jb + 1;
      // rows in jb
      for (var ib = 0; ib < brows; ib++) {
        // b[ib, jb]
        var vbij = bdata[ib][jb];
        // check b[ib, jb] != 0, avoid loops
        if (!eq(vbij, zero)) {
          // A values & index in ib column
          for (var ka0 = aptr[ib], ka1 = aptr[ib + 1], ka = ka0; ka < ka1; ka++) {
            // a row
            var ia = aindex[ka];
            // check value exists in current j
            if (w[ia] !== mark) {
              // ia is new entry in j
              w[ia] = mark;
              // add i to pattern of C
              cindex.push(ia);
              // x(ia) = A
              x[ia] = mf(vbij, avalues[ka]);
            }
            else {
              // i exists in C already
              x[ia] = af(x[ia], mf(vbij, avalues[ka]));
            }
          }
        }
      }
      // copy values from x to column jb of c
      for (var p0 = cptr[jb], p1 = cindex.length, p = p0; p < p1; p++) {
        // row
        var ic = cindex[p];
        // copy value
        cvalues[p] = x[ic];
      }
    }
    // update ptr
    cptr[bcolumns] = cindex.length;

    // return sparse matrix
    return c;
  };

  /**
   * C = A * B
   *
   * @param {Matrix} a            SparseMatrix      (MxN)
   * @param {Matrix} b            SparseMatrix      (NxC)
   *
   * @return {Matrix}             SparseMatrix      (MxC)
   */
  var _multiplySparseMatrixSparseMatrix = function (a, b) {
    // a sparse
    var avalues = a._values;
    var aindex = a._index;
    var aptr = a._ptr;
    var adt = a._datatype;
    // b sparse
    var bvalues = b._values;
    var bindex = b._index;
    var bptr = b._ptr;
    var bdt = b._datatype;
    
    // rows & columns
    var arows = a._size[0];
    var bcolumns = b._size[1];
    // flag indicating both matrices (a & b) contain data
    var values = avalues && bvalues;

    // datatype
    var dt;
    // addScalar signature to use
    var af = addScalar;
    // multiplyScalar signature to use
    var mf = multiplyScalar;

    // process data types
    if (adt && bdt && adt === bdt && typeof adt === 'string') {
      // datatype
      dt = adt;
      // find signatures that matches (dt, dt)
      af = typed.find(addScalar, [dt, dt]);
      mf = typed.find(multiplyScalar, [dt, dt]);
    }
    
    // result
    var cvalues = values ? [] : undefined;
    var cindex = [];
    var cptr = [];
    // c matrix
    var c = new SparseMatrix({
      values : cvalues,
      index: cindex,
      ptr: cptr,
      size: [arows, bcolumns],
      datatype: dt
    });

    // workspace
    var x = values ? [] : undefined;
    // vector with marks indicating a value x[i] exists in a given column
    var w = [];
    // variables
    var ka, ka0, ka1, kb, kb0, kb1, ia, ib;
    // loop b columns
    for (var jb = 0; jb < bcolumns; jb++) {
      // update ptr
      cptr[jb] = cindex.length;
      // mark in workspace for current column
      var mark = jb + 1;
      // B values & index in j
      for (kb0 = bptr[jb], kb1 = bptr[jb + 1], kb = kb0; kb < kb1; kb++) {
        // b row
        ib = bindex[kb];
        // check we need to process values
        if (values) {
          // loop values in a[:,ib]
          for (ka0 = aptr[ib], ka1 = aptr[ib + 1], ka = ka0; ka < ka1; ka++) {
            // row
            ia = aindex[ka];
            // check value exists in current j
            if (w[ia] !== mark) {
              // ia is new entry in j
              w[ia] = mark;
              // add i to pattern of C
              cindex.push(ia);
              // x(ia) = A
              x[ia] = mf(bvalues[kb], avalues[ka]);
            }
            else {
              // i exists in C already
              x[ia] = af(x[ia], mf(bvalues[kb], avalues[ka]));
            }
          }
        }
        else {
          // loop values in a[:,ib]
          for (ka0 = aptr[ib], ka1 = aptr[ib + 1], ka = ka0; ka < ka1; ka++) {
            // row
            ia = aindex[ka];
            // check value exists in current j
            if (w[ia] !== mark) {
              // ia is new entry in j
              w[ia] = mark;
              // add i to pattern of C
              cindex.push(ia);
            }
          }
        }
      }
      // check we need to process matrix values (pattern matrix)
      if (values) {
        // copy values from x to column jb of c
        for (var p0 = cptr[jb], p1 = cindex.length, p = p0; p < p1; p++) {
          // row
          var ic = cindex[p];
          // copy value
          cvalues[p] = x[ic];
        }
      }
    }
    // update ptr
    cptr[bcolumns] = cindex.length;

    // return sparse matrix
    return c;
  };

  multiply.toTex = {
    2: '\\left(${args[0]}' + latex.operators['multiply'] + '${args[1]}\\right)'
  };

  return multiply;
}

exports.name = 'multiply';
exports.factory = factory;

},{"../../type/matrix/function/matrix":328,"../../type/matrix/utils/algorithm11":338,"../../type/matrix/utils/algorithm14":341,"../../utils/array":346,"../../utils/latex":360,"../../utils/object":362,"../relational/equalScalar":288,"./addScalar":243,"./multiplyScalar":263}],263:[function(require,module,exports){
'use strict';

function factory(type, config, load, typed) {
  
  /**
   * Multiply two scalar values, `x * y`.
   * This function is meant for internal use: it is used by the public function
   * `multiply`
   *
   * This function does not support collections (Array or Matrix), and does
   * not validate the number of of inputs.
   *
   * @param  {number | BigNumber | Fraction | Complex | Unit} x   First value to multiply
   * @param  {number | BigNumber | Fraction | Complex} y          Second value to multiply
   * @return {number | BigNumber | Fraction | Complex | Unit}                      Multiplication of `x` and `y`
   * @private
   */
  var multiplyScalar = typed('multiplyScalar', {

    'number, number': function (x, y) {
      return x * y;
    },

    'Complex, Complex': function (x, y) {
      return x.mul(y);
    },

    'BigNumber, BigNumber': function (x, y) {
      return x.times(y);
    },

    'Fraction, Fraction': function (x, y) {
      return x.mul(y);
    },

    'number | Fraction | BigNumber | Complex, Unit': function (x, y) {
      var res = y.clone();
      res.value = (res.value === null) ? res._normalize(x) : multiplyScalar(res.value, x);
      return res;
    },

    'Unit, number | Fraction | BigNumber | Complex': function (x, y) {
      var res = x.clone();
      res.value = (res.value === null) ? res._normalize(y) : multiplyScalar(res.value, y);
      return res;
    },

    'Unit, Unit': function (x, y) {
      return x.multiply(y);
    }

  });

  return multiplyScalar;
}

exports.factory = factory;

},{}],264:[function(require,module,exports){
'use strict';

function factory (type, config, load, typed) {
  
  var abs         = load(require('../arithmetic/abs'));
  var add         = load(require('../arithmetic/add'));
  var pow         = load(require('../arithmetic/pow'));
  var sqrt        = load(require('../arithmetic/sqrt'));
  var multiply    = load(require('../arithmetic/multiply'));
  var equalScalar = load(require('../relational/equalScalar'));
  var larger      = load(require('../relational/larger'));
  var smaller     = load(require('../relational/smaller'));
  var matrix      = load(require('../../type/matrix/function/matrix'));
  var trace       = load(require('../matrix/trace'));
  var transpose   = load(require('../matrix/transpose'));


  /**
   * Calculate the norm of a number, vector or matrix.
   *
   * The second parameter p is optional. If not provided, it defaults to 2.
   *
   * Syntax:
   *
   *    math.norm(x)
   *    math.norm(x, p)
   *
   * Examples:
   *
   *    math.abs(-3.5);                         // returns 3.5
   *    math.norm(-3.5);                        // returns 3.5
   *
   *    math.norm(math.complex(3, -4));         // returns 5
   *
   *    math.norm([1, 2, -3], Infinity);        // returns 3
   *    math.norm([1, 2, -3], -Infinity);       // returns 1
   *
   *    math.norm([3, 4], 2);                   // returns 5
   *
   *    math.norm([[1, 2], [3, 4]], 1)          // returns 6
   *    math.norm([[1, 2], [3, 4]], 'inf');     // returns 7
   *    math.norm([[1, 2], [3, 4]], 'fro');     // returns 5.477225575051661
   *
   * See also:
   *
   *    abs, hypot
   *
   * @param  {number | BigNumber | Complex | Array | Matrix} x
   *            Value for which to calculate the norm
   * @param  {number | BigNumber | string} [p=2]
   *            Vector space.
   *            Supported numbers include Infinity and -Infinity.
   *            Supported strings are: 'inf', '-inf', and 'fro' (The Frobenius norm)
   * @return {number | BigNumber} the p-norm
   */
  var norm = typed('norm', {
    'number': Math.abs,

    'Complex': function (x) {
      return x.abs();
    },

    'BigNumber': function (x) {
      // norm(x) = abs(x)
      return x.abs();
    },
    
    'boolean | null' : function (x) {
      // norm(x) = abs(x)
      return Math.abs(x);
    },

    'Array': function (x) {
      return _norm(matrix(x), 2);
    },
    
    'Matrix': function (x) {
      return _norm(x, 2);
    },

    'number | Complex | BigNumber | boolean | null, number | BigNumber | string': function (x) {
      // ignore second parameter, TODO: remove the option of second parameter for these types
      return norm(x);
    },

    'Array, number | BigNumber | string': function (x, p) {
      return _norm(matrix(x), p);
    },
    
    'Matrix, number | BigNumber | string': function (x, p) {
      return _norm(x, p);
    }
  });

  /**
   * Calculate the norm for an array
   * @param {Array} x
   * @param {number | string} p
   * @returns {number} Returns the norm
   * @private
   */
  function _norm (x, p) {
    // size
    var sizeX = x.size();
    
    // check if it is a vector
    if (sizeX.length == 1) {
      // check p
      if (p === Number.POSITIVE_INFINITY || p === 'inf') {
        // norm(x, Infinity) = max(abs(x))
        var pinf = 0;
        // skip zeros since abs(0) == 0
        x.forEach(
          function (value) {
            var v = abs(value);
            if (larger(v, pinf))
              pinf = v;
          },
          true);
        return pinf;
      }
      if (p === Number.NEGATIVE_INFINITY || p === '-inf') {
        // norm(x, -Infinity) = min(abs(x))
        var ninf;
        // skip zeros since abs(0) == 0
        x.forEach(
          function (value) {
            var v = abs(value);
            if (!ninf || smaller(v, ninf))
              ninf = v;
          },
          true);
        return ninf || 0;
      }
      if (p === 'fro') {
        return _norm(x, 2);
      }
      if (typeof p === 'number' && !isNaN(p)) {
        // check p != 0
        if (!equalScalar(p, 0)) {
          // norm(x, p) = sum(abs(xi) ^ p) ^ 1/p
          var n = 0;
          // skip zeros since abs(0) == 0
          x.forEach(
            function (value) {
              n = add(pow(abs(value), p), n);
            },
            true);
          return pow(n, 1 / p);
        }
        return Number.POSITIVE_INFINITY;
      }
      // invalid parameter value
      throw new Error('Unsupported parameter value');
    }
    // MxN matrix
    if (sizeX.length == 2) {
      // check p
      if (p === 1) {
        // norm(x) = the largest column sum
        var c = [];
        // result
        var maxc = 0;
        // skip zeros since abs(0) == 0
        x.forEach(
          function (value, index) {
            var j = index[1];
            var cj = add(c[j] || 0, abs(value));
            if (larger(cj, maxc))
              maxc = cj;
            c[j] = cj;
          },
          true);
        return maxc;
      }
      if (p === Number.POSITIVE_INFINITY || p === 'inf') {
        // norm(x) = the largest row sum
        var r = [];
        // result
        var maxr = 0;
        // skip zeros since abs(0) == 0
        x.forEach(
          function (value, index) {
            var i = index[0];
            var ri = add(r[i] || 0, abs(value));
            if (larger(ri, maxr))
              maxr = ri;
            r[i] = ri;
          },
          true);
        return maxr;
      }
      if (p === 'fro') {
        // norm(x) = sqrt(sum(diag(x'x)))
        return sqrt(trace(multiply(transpose(x), x)));
      }
      if (p === 2) {
        // not implemented
        throw new Error('Unsupported parameter value, missing implementation of matrix singular value decomposition');
      }
      // invalid parameter value
      throw new Error('Unsupported parameter value');
    }
  }

  norm.toTex = {
    1: '\\left\\|${args[0]}\\right\\|',
    2: undefined  // use default template
  };

  return norm;
}

exports.name = 'norm';
exports.factory = factory;

},{"../../type/matrix/function/matrix":328,"../arithmetic/abs":241,"../arithmetic/add":242,"../arithmetic/multiply":262,"../arithmetic/pow":266,"../arithmetic/sqrt":269,"../matrix/trace":284,"../matrix/transpose":285,"../relational/equalScalar":288,"../relational/larger":289,"../relational/smaller":290}],265:[function(require,module,exports){
'use strict';

function factory (type, config, load, typed) {

  var matrix = load(require('../../type/matrix/function/matrix'));

  var algorithm01 = load(require('../../type/matrix/utils/algorithm01'));
  var algorithm02 = load(require('../../type/matrix/utils/algorithm02'));
  var algorithm06 = load(require('../../type/matrix/utils/algorithm06'));
  var algorithm11 = load(require('../../type/matrix/utils/algorithm11'));
  var algorithm13 = load(require('../../type/matrix/utils/algorithm13'));
  var algorithm14 = load(require('../../type/matrix/utils/algorithm14'));

  /**
   * Calculate the nth root of a value.
   * The principal nth root of a positive real number A, is the positive real
   * solution of the equation
   *
   *     x^root = A
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *     math.nthRoot(a)
   *     math.nthRoot(a, root)
   *
   * Examples:
   *
   *     math.nthRoot(9, 2);    // returns 3, as 3^2 == 9
   *     math.sqrt(9);          // returns 3, as 3^2 == 9
   *     math.nthRoot(64, 3);   // returns 4, as 4^3 == 64
   *
   * See also:
   *
   *     sqrt, pow
   *
   * @param {number | BigNumber | Array | Matrix | Complex} a
   *              Value for which to calculate the nth root
   * @param {number | BigNumber} [root=2]    The root.
   * @return {number | Complex | Array | Matrix} Returns the nth root of `a`
   */
  var nthRoot = typed('nthRoot', {
    
    'number': function (x) {
      return _nthRoot(x, 2);
    },
    'number, number': _nthRoot,

    'BigNumber': function (x) {
      return _bigNthRoot(x, new type.BigNumber(2));
    },
    'Complex' : function(x) {
      return _nthComplexRoot(x, 2);
    }, 
    'Complex, number' : _nthComplexRoot,
    'BigNumber, BigNumber': _bigNthRoot,

    'Array | Matrix': function (x) {
      return nthRoot(x, 2);
    },
    
    'Matrix, Matrix': function (x, y) {
      // result
      var c;

      // process matrix storage
      switch (x.storage()) {
        case 'sparse':
          switch (y.storage()) {
            case 'sparse':
              // density must be one (no zeros in matrix)
              if (y.density() === 1) {
                // sparse + sparse
                c = algorithm06(x, y, nthRoot);
              }
              else {
                // throw exception
                throw new Error('Root must be non-zero');
              }
              break;
            default:
              // sparse + dense
              c = algorithm02(y, x, nthRoot, true);
              break;
          }
          break;
        default:
          switch (y.storage()) {
            case 'sparse':
              // density must be one (no zeros in matrix)
              if (y.density() === 1) {
                // dense + sparse
                c = algorithm01(x, y, nthRoot, false);
              }
              else {
                // throw exception
                throw new Error('Root must be non-zero');
              }
              break;
            default:
              // dense + dense
              c = algorithm13(x, y, nthRoot);
              break;
          }
          break;
      }
      return c;
    },

    'Array, Array': function (x, y) {
      // use matrix implementation
      return nthRoot(matrix(x), matrix(y)).valueOf();
    },

    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return nthRoot(matrix(x), y);
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return nthRoot(x, matrix(y));
    },
    
    'Matrix, number | BigNumber': function (x, y) {
      // result
      var c;
      // check storage format
      switch (x.storage()) {
        case 'sparse':
          c = algorithm11(x, y, nthRoot, false);
          break;
        default:
          c = algorithm14(x, y, nthRoot, false);
          break;
      }
      return c;
    },

    'number | BigNumber, Matrix': function (x, y) {
      // result
      var c;
      // check storage format
      switch (y.storage()) {
        case 'sparse':
          // density must be one (no zeros in matrix)
          if (y.density() === 1) {
            // sparse - scalar
            c = algorithm11(y, x, nthRoot, true);
          }
          else {
            // throw exception
            throw new Error('Root must be non-zero');
          }
          break;
        default:
          c = algorithm14(y, x, nthRoot, true);
          break;
      }
      return c;
    },

    'Array, number | BigNumber': function (x, y) {
      // use matrix implementation
      return nthRoot(matrix(x), y).valueOf();
    },

    'number | BigNumber, Array': function (x, y) {
      // use matrix implementation
      return nthRoot(x, matrix(y)).valueOf();
    }
  });

  nthRoot.toTex = {2: '\\sqrt[${args[1]}]{${args[0]}}'};

  return nthRoot;

  /**
   * Calculate the nth root of a for BigNumbers, solve x^root == a
   * http://rosettacode.org/wiki/Nth_root#JavaScript
   * @param {BigNumber} a
   * @param {BigNumber} root
   * @private
   */
  function _bigNthRoot(a, root) {
    var precision = type.BigNumber.precision;
    var Big = type.BigNumber.clone({precision: precision + 2});
    var zero = new type.BigNumber(0);

    var one = new Big(1);
    var inv = root.isNegative();
    if (inv) {
      root = root.neg();
    }

    if (root.isZero()) {
      throw new Error('Root must be non-zero');
    }
    if (a.isNegative() && !root.abs().mod(2).equals(1)) {
      throw new Error('Root must be odd when a is negative.');
    }

    // edge cases zero and infinity
    if (a.isZero()) {
      return inv ? new Big(Infinity) : 0;
    }
    if (!a.isFinite()) {
      return inv ? zero : a;
    }

    var x = a.abs().pow(one.div(root));
    // If a < 0, we require that root is an odd integer,
    // so (-1) ^ (1/root) = -1
    x = a.isNeg() ? x.neg() : x;
    return new type.BigNumber((inv ? one.div(x) : x).toPrecision(precision));
  }
}

/**
 * Calculate the nth root of a, solve x^root == a
 * http://rosettacode.org/wiki/Nth_root#JavaScript
 * @param {number} a
 * @param {number} root
 * @private
 */
function _nthRoot(a, root) {
  var inv = root < 0;
  if (inv) {
    root = -root;
  }

  if (root === 0) {
    throw new Error('Root must be non-zero');
  }
  if (a < 0 && (Math.abs(root) % 2 != 1)) {
    throw new Error('Root must be odd when a is negative.');
  }

  // edge cases zero and infinity
  if (a == 0) {
    return inv ? Infinity : 0;
  }
  if (!isFinite(a)) {
    return inv ? 0 : a;
  }

  var x = Math.pow(Math.abs(a), 1/root);
  // If a < 0, we require that root is an odd integer,
  // so (-1) ^ (1/root) = -1
  x = a < 0 ? -x : x;
  return inv ? 1 / x : x;

  // Very nice algorithm, but fails with nthRoot(-2, 3).
  // Newton's method has some well-known problems at times:
  // https://en.wikipedia.org/wiki/Newton%27s_method#Failure_analysis
  /*
  var x = 1; // Initial guess
  var xPrev = 1;
  var i = 0;
  var iMax = 10000;
  do {
    var delta = (a / Math.pow(x, root - 1) - x) / root;
    xPrev = x;
    x = x + delta;
    i++;
  }
  while (xPrev !== x && i < iMax);

  if (xPrev !== x) {
    throw new Error('Function nthRoot failed to converge');
  }

  return inv ? 1 / x : x;
  */
}

/**
 * Calculate the nth root of a Complex Number a using De Moviers Theorem.
 * @param  {Complex} a
 * @param  {number} root
 * @return {Array} array or n Complex Roots in Polar Form.
 */
function _nthComplexRoot(a, root) {
  if (root < 0) throw new Error('Root must be greater than zero');
  if (root === 0) throw new Error('Root must be non-zero');
  if (root % 1 !== 0) throw new Error('Root must be an integer');  
  var arg = a.arg();
  var abs = a.abs();
  var roots = [];
  var r = Math.pow(abs, 1/root);
  for(var k = 0; k < root; k++) {
    roots.push({r: r, phi: (arg + 2 * Math.PI * k)/root});
  }
  return roots;
}

exports.name = 'nthRoot';
exports.factory = factory;

},{"../../type/matrix/function/matrix":328,"../../type/matrix/utils/algorithm01":329,"../../type/matrix/utils/algorithm02":330,"../../type/matrix/utils/algorithm06":334,"../../type/matrix/utils/algorithm11":338,"../../type/matrix/utils/algorithm13":340,"../../type/matrix/utils/algorithm14":341}],266:[function(require,module,exports){
'use strict';

var isInteger = require('../../utils/number').isInteger;
var size = require('../../utils/array').size;

function factory (type, config, load, typed) {
  var latex = require('../../utils/latex');
  var eye = load(require('../matrix/eye'));
  var multiply = load(require('./multiply'));
  var matrix = load(require('../../type/matrix/function/matrix'));
  var fraction = load(require('../../type/fraction/function/fraction'));
  var number = load(require('../../type/number'));

  /**
   * Calculates the power of x to y, `x ^ y`.
   * Matrix exponentiation is supported for square matrices `x`, and positive
   * integer exponents `y`.
   *
   * For cubic roots of negative numbers, the function returns the principal
   * root by default. In order to let the function return the real root,
   * math.js can be configured with `math.config({predictable: true})`.
   * To retrieve all cubic roots of a value, use `math.cbrt(x, true)`.
   *
   * Syntax:
   *
   *    math.pow(x, y)
   *
   * Examples:
   *
   *    math.pow(2, 3);               // returns number 8
   *
   *    var a = math.complex(2, 3);
   *    math.pow(a, 2)                // returns Complex -5 + 12i
   *
   *    var b = [[1, 2], [4, 3]];
   *    math.pow(b, 2);               // returns Array [[9, 8], [16, 17]]
   *
   * See also:
   *
   *    multiply, sqrt, cbrt, nthRoot
   *
   * @param  {number | BigNumber | Complex | Array | Matrix} x  The base
   * @param  {number | BigNumber | Complex} y                   The exponent
   * @return {number | BigNumber | Complex | Array | Matrix} The value of `x` to the power `y`
   */
  var pow = typed('pow', {
    'number, number': _pow,

    'Complex, Complex': function (x, y) {
      return x.pow(y);
    },

    'BigNumber, BigNumber': function (x, y) {
      if (y.isInteger() || x >= 0 || config.predictable) {
        return x.pow(y);
      }
      else {
        return new type.Complex(x.toNumber(), 0).pow(y.toNumber(), 0);
      }
    },

    'Fraction, Fraction': function (x, y) {
      if (y.d !== 1) {
        if (config.predictable) {
          throw new Error('Function pow does not support non-integer exponents for fractions.');
        }
        else {
          return _pow(x.valueOf(), y.valueOf());
        }
      }
      else {
        return x.pow(y);
     }
    },

    'Array, number': _powArray,

    'Array, BigNumber': function (x, y) {
      return _powArray(x, y.toNumber());
    },

    'Matrix, number': _powMatrix,

    'Matrix, BigNumber': function (x, y) {
      return _powMatrix(x, y.toNumber());
    },

    'Unit, number': function (x, y) {
      return x.pow(y);
    }

  });

  /**
   * Calculates the power of x to y, x^y, for two numbers.
   * @param {number} x
   * @param {number} y
   * @return {number | Complex} res
   * @private
   */
  function _pow(x, y) {

    // Alternatively could define a 'realmode' config option or something, but
    // 'predictable' will work for now
    if (config.predictable && !isInteger(y) && x < 0) {
      // Check to see if y can be represented as a fraction
      try {
        var yFrac = fraction(y);
        var yNum = number(yFrac);
        if(y === yNum || Math.abs((y - yNum) / y) < 1e-14) {
          if(yFrac.d % 2 === 1) {
            return (yFrac.n % 2 === 0 ? 1 : -1) * Math.pow(-x, y);
          }
        }
      }
      catch (ex) {
        // fraction() throws an error if y is Infinity, etc.
      }

      // Unable to express y as a fraction, so continue on
    }

    if (isInteger(y) || x >= 0 || config.predictable) {
      return Math.pow(x, y);
    }
    else {
      return new type.Complex(x, 0).pow(y, 0);
    }
  }

  /**
   * Calculate the power of a 2d array
   * @param {Array} x     must be a 2 dimensional, square matrix
   * @param {number} y    a positive, integer value
   * @returns {Array}
   * @private
   */
  function _powArray(x, y) {
    if (!isInteger(y) || y < 0) {
      throw new TypeError('For A^b, b must be a positive integer (value is ' + y + ')');
    }
    // verify that A is a 2 dimensional square matrix
    var s = size(x);
    if (s.length != 2) {
      throw new Error('For A^b, A must be 2 dimensional (A has ' + s.length + ' dimensions)');
    }
    if (s[0] != s[1]) {
      throw new Error('For A^b, A must be square (size is ' + s[0] + 'x' + s[1] + ')');
    }

    var res = eye(s[0]).valueOf();
    var px = x;
    while (y >= 1) {
      if ((y & 1) == 1) {
        res = multiply(px, res);
      }
      y >>= 1;
      px = multiply(px, px);
    }
    return res;
  }

  /**
   * Calculate the power of a 2d matrix
   * @param {Matrix} x     must be a 2 dimensional, square matrix
   * @param {number} y    a positive, integer value
   * @returns {Matrix}
   * @private
   */
  function _powMatrix (x, y) {
    return matrix(_powArray(x.valueOf(), y));
  }



  pow.toTex = {
    2: '\\left(${args[0]}\\right)' + latex.operators['pow'] + '{${args[1]}}'
  };

  return pow;
}

exports.name = 'pow';
exports.factory = factory;

},{"../../type/fraction/function/fraction":326,"../../type/matrix/function/matrix":328,"../../type/number":342,"../../utils/array":346,"../../utils/latex":360,"../../utils/number":361,"../matrix/eye":277,"./multiply":262}],267:[function(require,module,exports){
'use strict';

var isInteger = require('../../utils/number').isInteger;
var toFixed = require('../../utils/number').toFixed;
var deepMap = require('../../utils/collection/deepMap');

var NO_INT = 'Number of decimals in function round must be an integer';

function factory (type, config, load, typed) {
  var matrix = load(require('../../type/matrix/function/matrix'));
  var equalScalar = load(require('../relational/equalScalar'));
  var zeros = load(require('../matrix/zeros'));

  var algorithm11 = load(require('../../type/matrix/utils/algorithm11'));
  var algorithm12 = load(require('../../type/matrix/utils/algorithm12'));
  var algorithm14 = load(require('../../type/matrix/utils/algorithm14'));
  
  /**
   * Round a value towards the nearest integer.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.round(x)
   *    math.round(x, n)
   *
   * Examples:
   *
   *    math.round(3.2);              // returns number 3
   *    math.round(3.8);              // returns number 4
   *    math.round(-4.2);             // returns number -4
   *    math.round(-4.7);             // returns number -5
   *    math.round(math.pi, 3);       // returns number 3.142
   *    math.round(123.45678, 2);     // returns number 123.46
   *
   *    var c = math.complex(3.2, -2.7);
   *    math.round(c);                // returns Complex 3 - 3i
   *
   *    math.round([3.2, 3.8, -4.7]); // returns Array [3, 4, -5]
   *
   * See also:
   *
   *    ceil, fix, floor
   *
   * @param  {number | BigNumber | Fraction | Complex | Array | Matrix} x  Number to be rounded
   * @param  {number | BigNumber | Array} [n=0]                            Number of decimals
   * @return {number | BigNumber | Fraction | Complex | Array | Matrix} Rounded value
   */
  var round = typed('round', {

    'number': Math.round,

    'number, number': function (x, n) {
      if (!isInteger(n))   {throw new TypeError(NO_INT);}
      if (n < 0 || n > 15) {throw new Error('Number of decimals in function round must be in te range of 0-15');}

      return _round(x, n);
    },

    'Complex': function (x) {
      return x.round();
    },

    'Complex, number': function (x, n) {
      if (n % 1) {throw new TypeError(NO_INT);}
      
      return x.round(n);
    },

    'Complex, BigNumber': function (x, n) {
      if (!n.isInteger()) {throw new TypeError(NO_INT);}

      var _n = n.toNumber();
      return x.round(_n);
    },

    'number, BigNumber': function (x, n) {
      if (!n.isInteger()) {throw new TypeError(NO_INT);}

      return new type.BigNumber(x).toDecimalPlaces(n.toNumber());
    },

    'BigNumber': function (x) {
      return x.toDecimalPlaces(0);
    },

    'BigNumber, BigNumber': function (x, n) {
      if (!n.isInteger()) {throw new TypeError(NO_INT);}

      return x.toDecimalPlaces(n.toNumber());
    },

    'Fraction': function (x) {
      return x.round();
    },

    'Fraction, number': function (x, n) {
      if (n % 1) {throw new TypeError(NO_INT);}
      return x.round(n);
    },

    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since round(0) = 0
      return deepMap(x, round, true);
    },

    'Matrix, number | BigNumber': function (x, y) {
      // result
      var c;
      // check storage format
      switch (x.storage()) {
        case 'sparse':
          c = algorithm11(x, y, round, false);
          break;
        default:
          c = algorithm14(x, y, round, false);
          break;
      }
      return c;
    },

    'number | Complex | BigNumber, Matrix': function (x, y) {
      // check scalar is zero
      if (!equalScalar(x, 0)) {
        // result
        var c;
        // check storage format
        switch (y.storage()) {
          case 'sparse':
            c = algorithm12(y, x, round, true);
            break;
          default:
            c = algorithm14(y, x, round, true);
            break;
        }
        return c;
      }
      // do not execute algorithm, result will be a zero matrix
      return zeros(y.size(), y.storage());
    },

    'Array, number | BigNumber': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, round, false).valueOf();
    },

    'number | Complex | BigNumber, Array': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, round, true).valueOf();
    }
  });

  round.toTex = {
    1: '\\left\\lfloor${args[0]}\\right\\rceil',
    2: undefined  // use default template
  };

  return round;
}

/**
 * round a number to the given number of decimals, or to zero if decimals is
 * not provided
 * @param {number} value
 * @param {number} decimals       number of decimals, between 0 and 15 (0 by default)
 * @return {number} roundedValue
 * @private
 */
function _round (value, decimals) {
  return parseFloat(toFixed(value, decimals));
}

exports.name = 'round';
exports.factory = factory;

},{"../../type/matrix/function/matrix":328,"../../type/matrix/utils/algorithm11":338,"../../type/matrix/utils/algorithm12":339,"../../type/matrix/utils/algorithm14":341,"../../utils/collection/deepMap":353,"../../utils/number":361,"../matrix/zeros":286,"../relational/equalScalar":288}],268:[function(require,module,exports){
'use strict';

var number = require('../../utils/number');
var deepMap = require('../../utils/collection/deepMap');

function factory (type, config, load, typed) {
  /**
   * Compute the sign of a value. The sign of a value x is:
   *
   * -  1 when x > 1
   * - -1 when x < 0
   * -  0 when x == 0
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.sign(x)
   *
   * Examples:
   *
   *    math.sign(3.5);               // returns 1
   *    math.sign(-4.2);              // returns -1
   *    math.sign(0);                 // returns 0
   *
   *    math.sign([3, 5, -2, 0, 2]);  // returns [1, 1, -1, 0, 1]
   *
   * See also:
   *
   *    abs
   *
   * @param  {number | BigNumber | Fraction | Complex | Array | Matrix | Unit} x
   *            The number for which to determine the sign
   * @return {number | BigNumber | Fraction | Complex | Array | Matrix | Unit}e
   *            The sign of `x`
   */
  var sign = typed('sign', {
    'number': number.sign,

    'Complex': function (x) {
      return x.sign();
    },

    'BigNumber': function (x) {
      return new type.BigNumber(x.cmp(0));
    },

    'Fraction': function (x) {
      return new type.Fraction(x.s, 1);
    },

    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since sign(0) = 0
      return deepMap(x, sign, true);
    },

    'Unit': function(x) {
      return sign(x.value);
    }
  });

  sign.toTex = {1: '\\mathrm{${name}}\\left(${args[0]}\\right)'};

  return sign;
}

exports.name = 'sign';
exports.factory = factory;


},{"../../utils/collection/deepMap":353,"../../utils/number":361}],269:[function(require,module,exports){
'use strict';

var deepMap = require('../../utils/collection/deepMap');

function factory (type, config, load, typed) {
  /**
   * Calculate the square root of a value.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.sqrt(x)
   *
   * Examples:
   *
   *    math.sqrt(25);                // returns 5
   *    math.square(5);               // returns 25
   *    math.sqrt(-4);                // returns Complex 2i
   *
   * See also:
   *
   *    square, multiply, cube, cbrt
   *
   * @param {number | BigNumber | Complex | Array | Matrix | Unit} x
   *            Value for which to calculate the square root.
   * @return {number | BigNumber | Complex | Array | Matrix | Unit}
   *            Returns the square root of `x`
   */
  var sqrt = typed('sqrt', {
    'number': _sqrtNumber,

    'Complex': function (x) {
        return x.sqrt();
    },

    'BigNumber': function (x) {
      if (!x.isNegative() || config.predictable) {
        return x.sqrt();
      }
      else {
        // negative value -> downgrade to number to do complex value computation
        return _sqrtNumber(x.toNumber());
      }
    },

    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since sqrt(0) = 0
      return deepMap(x, sqrt, true);
    },

    'Unit': function (x) {
      // Someday will work for complex units when they are implemented
      return x.pow(0.5);
    }

  });

  /**
   * Calculate sqrt for a number
   * @param {number} x
   * @returns {number | Complex} Returns the square root of x
   * @private
   */
  function _sqrtNumber(x) {
    if (x >= 0 || config.predictable) {
      return Math.sqrt(x);
    }
    else {
      return new type.Complex(x, 0).sqrt();
    }
  }

  sqrt.toTex = {1: '\\sqrt{${args[0]}}'};

  return sqrt;
}

exports.name = 'sqrt';
exports.factory = factory;

},{"../../utils/collection/deepMap":353}],270:[function(require,module,exports){
'use strict';

var deepMap = require('../../utils/collection/deepMap');

function factory (type, config, load, typed) {
  /**
   * Compute the square of a value, `x * x`.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.square(x)
   *
   * Examples:
   *
   *    math.square(2);           // returns number 4
   *    math.square(3);           // returns number 9
   *    math.pow(3, 2);           // returns number 9
   *    math.multiply(3, 3);      // returns number 9
   *
   *    math.square([1, 2, 3, 4]);  // returns Array [1, 4, 9, 16]
   *
   * See also:
   *
   *    multiply, cube, sqrt, pow
   *
   * @param  {number | BigNumber | Fraction | Complex | Array | Matrix | Unit} x
   *            Number for which to calculate the square
   * @return {number | BigNumber | Fraction | Complex | Array | Matrix | Unit}
   *            Squared value
   */
  var square = typed('square', {
    'number': function (x) {
      return x * x;
    },

    'Complex': function (x) {
      return x.mul(x);
    },

    'BigNumber': function (x) {
      return x.times(x);
    },

    'Fraction': function (x) {
      return x.mul(x);
    },

    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since square(0) = 0
      return deepMap(x, square, true);
    },

    'Unit': function(x) {
      return x.pow(2);
    }
  });

  square.toTex = {1: '\\left(${args[0]}\\right)^2'};

  return square;
}

exports.name = 'square';
exports.factory = factory;

},{"../../utils/collection/deepMap":353}],271:[function(require,module,exports){
'use strict';

var DimensionError = require('../../error/DimensionError');

function factory (type, config, load, typed) {
  var latex = require('../../utils/latex');

  var matrix = load(require('../../type/matrix/function/matrix'));
  var addScalar = load(require('./addScalar'));
  var unaryMinus = load(require('./unaryMinus'));

  var algorithm01 = load(require('../../type/matrix/utils/algorithm01'));
  var algorithm03 = load(require('../../type/matrix/utils/algorithm03'));
  var algorithm05 = load(require('../../type/matrix/utils/algorithm05'));
  var algorithm10 = load(require('../../type/matrix/utils/algorithm10'));
  var algorithm13 = load(require('../../type/matrix/utils/algorithm13'));
  var algorithm14 = load(require('../../type/matrix/utils/algorithm14'));

  // TODO: split function subtract in two: subtract and subtractScalar

  /**
   * Subtract two values, `x - y`.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.subtract(x, y)
   *
   * Examples:
   *
   *    math.subtract(5.3, 2);        // returns number 3.3
   *
   *    var a = math.complex(2, 3);
   *    var b = math.complex(4, 1);
   *    math.subtract(a, b);          // returns Complex -2 + 2i
   *
   *    math.subtract([5, 7, 4], 4);  // returns Array [1, 3, 0]
   *
   *    var c = math.unit('2.1 km');
   *    var d = math.unit('500m');
   *    math.subtract(c, d);          // returns Unit 1.6 km
   *
   * See also:
   *
   *    add
   *
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} x
   *            Initial value
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} y
   *            Value to subtract from `x`
   * @return {number | BigNumber | Fraction | Complex | Unit | Array | Matrix}
   *            Subtraction of `x` and `y`
   */
  var subtract = typed('subtract', {

    'number, number': function (x, y) {
      return x - y;
    },

    'Complex, Complex': function (x, y) {
      return x.sub(y);
    },

    'BigNumber, BigNumber': function (x, y) {
      return x.minus(y);
    },

    'Fraction, Fraction': function (x, y) {
      return x.sub(y);
    },

    'Unit, Unit': function (x, y) {
      if (x.value == null) {
        throw new Error('Parameter x contains a unit with undefined value');
      }

      if (y.value == null) {
        throw new Error('Parameter y contains a unit with undefined value');
      }

      if (!x.equalBase(y)) {
        throw new Error('Units do not match');
      }

      var res = x.clone();
      res.value = subtract(res.value, y.value);
      res.fixPrefix = false;

      return res;
    },
    
    'Matrix, Matrix': function (x, y) {
      // matrix sizes
      var xsize = x.size();
      var ysize = y.size();

      // check dimensions
      if (xsize.length !== ysize.length)
        throw new DimensionError(xsize.length, ysize.length);

      // result
      var c;

      // process matrix storage
      switch (x.storage()) {
        case 'sparse':
          switch (y.storage()) {
            case 'sparse':
              // sparse - sparse
              c = algorithm05(x, y, subtract);
              break;
            default:
              // sparse - dense
              c = algorithm03(y, x, subtract, true);
              break;
          }
          break;
        default:
          switch (y.storage()) {
            case 'sparse':
              // dense - sparse
              c = algorithm01(x, y, subtract, false);
              break;
            default:
              // dense - dense
              c = algorithm13(x, y, subtract);
              break;
          }
          break;
      }
      return c;
    },
    
    'Array, Array': function (x, y) {
      // use matrix implementation
      return subtract(matrix(x), matrix(y)).valueOf();
    },

    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return subtract(matrix(x), y);
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return subtract(x, matrix(y));
    },
    
    'Matrix, any': function (x, y) {
      // result
      var c;
      // check storage format
      switch (x.storage()) {
        case 'sparse':
          // algorithm 7 is faster than 9 since it calls f() for nonzero items only!
          c = algorithm10(x, unaryMinus(y), addScalar);
          break;
        default:
          c = algorithm14(x, y, subtract);
          break;
      }
      return c;
    },

    'any, Matrix': function (x, y) {
      // result
      var c;
      // check storage format
      switch (y.storage()) {
        case 'sparse':
          c = algorithm10(y, x, subtract, true);
          break;
        default:
          c = algorithm14(y, x, subtract, true);
          break;
      }
      return c;
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, subtract, false).valueOf();
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, subtract, true).valueOf();
    }
  });

  subtract.toTex = {
    2: '\\left(${args[0]}' + latex.operators['subtract'] + '${args[1]}\\right)'
  };

  return subtract;
}

exports.name = 'subtract';
exports.factory = factory;

},{"../../error/DimensionError":15,"../../type/matrix/function/matrix":328,"../../type/matrix/utils/algorithm01":329,"../../type/matrix/utils/algorithm03":331,"../../type/matrix/utils/algorithm05":333,"../../type/matrix/utils/algorithm10":337,"../../type/matrix/utils/algorithm13":340,"../../type/matrix/utils/algorithm14":341,"../../utils/latex":360,"./addScalar":243,"./unaryMinus":272}],272:[function(require,module,exports){
'use strict';

var deepMap = require('../../utils/collection/deepMap');

function factory (type, config, load, typed) {
  var latex = require('../../utils/latex');

  /**
   * Inverse the sign of a value, apply a unary minus operation.
   *
   * For matrices, the function is evaluated element wise. Boolean values and
   * strings will be converted to a number. For complex numbers, both real and
   * complex value are inverted.
   *
   * Syntax:
   *
   *    math.unaryMinus(x)
   *
   * Examples:
   *
   *    math.unaryMinus(3.5);      // returns -3.5
   *    math.unaryMinus(-4.2);     // returns 4.2
   *
   * See also:
   *
   *    add, subtract, unaryPlus
   *
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} x Number to be inverted.
   * @return {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} Returns the value with inverted sign.
   */
  var unaryMinus = typed('unaryMinus', {
    'number': function (x) {
      return -x;
    },

    'Complex': function (x) {
      return x.neg();
    },

    'BigNumber': function (x) {
      return x.neg();
    },

    'Fraction': function (x) {
      return x.neg();
    },

    'Unit': function (x) {
      var res = x.clone();
      res.value = unaryMinus(x.value);
      return res;
    },

    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since unaryMinus(0) = 0
      return deepMap(x, unaryMinus, true);
    }

    // TODO: add support for string
  });

  unaryMinus.toTex = {
    1: latex.operators['unaryMinus'] + '\\left(${args[0]}\\right)'
  };

  return unaryMinus;
}

exports.name = 'unaryMinus';
exports.factory = factory;

},{"../../utils/collection/deepMap":353,"../../utils/latex":360}],273:[function(require,module,exports){
'use strict';

var deepMap = require('../../utils/collection/deepMap');

function factory (type, config, load, typed) {
  var latex = require('../../utils/latex');

  /**
   * Unary plus operation.
   * Boolean values and strings will be converted to a number, numeric values will be returned as is.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.unaryPlus(x)
   *
   * Examples:
   *
   *    math.unaryPlus(3.5);      // returns 3.5
   *    math.unaryPlus(1);     // returns 1
   *
   * See also:
   *
   *    unaryMinus, add, subtract
   *
   * @param  {number | BigNumber | Fraction | string | Complex | Unit | Array | Matrix} x
   *            Input value
   * @return {number | BigNumber | Fraction | Complex | Unit | Array | Matrix}
   *            Returns the input value when numeric, converts to a number when input is non-numeric.
   */
  var unaryPlus = typed('unaryPlus', {
    'number': function (x) {
      return x;
    },

    'Complex': function (x) {
      return x; // complex numbers are immutable
    },

    'BigNumber': function (x) {
      return x; // bignumbers are immutable
    },

    'Fraction': function (x) {
      return x; // fractions are immutable
    },

    'Unit': function (x) {
      return x.clone();
    },

    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since unaryPlus(0) = 0
      return deepMap(x, unaryPlus, true);
    },

    'boolean | string | null': function (x) {
      // convert to a number or bignumber
      return (config.number == 'BigNumber') ? new type.BigNumber(+x): +x;
    }
  });

  unaryPlus.toTex = {
    1: latex.operators['unaryPlus'] + '\\left(${args[0]}\\right)'
  };

  return unaryPlus;
}

exports.name = 'unaryPlus';
exports.factory = factory;

},{"../../utils/collection/deepMap":353,"../../utils/latex":360}],274:[function(require,module,exports){
'use strict';

var isInteger = require('../../utils/number').isInteger;

function factory (type, config, load, typed) {
  var matrix = load(require('../../type/matrix/function/matrix'));

  /**
   * Calculate the extended greatest common divisor for two values.
   * See http://en.wikipedia.org/wiki/Extended_Euclidean_algorithm.
   *
   * Syntax:
   *
   *    math.xgcd(a, b)
   *
   * Examples:
   *
   *    math.xgcd(8, 12);             // returns [4, -1, 1]
   *    math.gcd(8, 12);              // returns 4
   *    math.xgcd(36163, 21199);      // returns [1247, -7, 12]
   *
   * See also:
   *
   *    gcd, lcm
   *
   * @param {number | BigNumber} a  An integer number
   * @param {number | BigNumber} b  An integer number
   * @return {Array}              Returns an array containing 3 integers `[div, m, n]`
   *                              where `div = gcd(a, b)` and `a*m + b*n = div`
   */
  var xgcd = typed('xgcd', {
    'number, number': _xgcd,
    'BigNumber, BigNumber': _xgcdBigNumber
    // TODO: implement support for Fraction
  });

  xgcd.toTex = undefined; // use default template

  return xgcd;

  /**
   * Calculate xgcd for two numbers
   * @param {number} a
   * @param {number} b
   * @return {number} result
   * @private
   */
  function _xgcd (a, b) {
    // source: http://en.wikipedia.org/wiki/Extended_Euclidean_algorithm
    var t, // used to swap two variables
        q, // quotient
        r, // remainder
        x = 0, lastx = 1,
        y = 1, lasty = 0;

    if (!isInteger(a) || !isInteger(b)) {
      throw new Error('Parameters in function xgcd must be integer numbers');
    }

    while (b) {
      q = Math.floor(a / b);
      r = a % b;

      t = x;
      x = lastx - q * x;
      lastx = t;

      t = y;
      y = lasty - q * y;
      lasty = t;

      a = b;
      b = r;
    }

    var res;
    if (a < 0) {
      res = [-a, -lastx, -lasty];
    }
    else {
      res = [a, a ? lastx : 0, lasty];
    }
    return (config.matrix === 'Array') ? res : matrix(res);
  }

  /**
   * Calculate xgcd for two BigNumbers
   * @param {BigNumber} a
   * @param {BigNumber} b
   * @return {BigNumber[]} result
   * @private
   */
  function _xgcdBigNumber(a, b) {
    // source: http://en.wikipedia.org/wiki/Extended_Euclidean_algorithm
    var t, // used to swap two variables
        q, // quotient
        r, // remainder
        zero = new type.BigNumber(0),
        one = new type.BigNumber(1),
        x = zero,
        lastx = one,
        y = one,
        lasty = zero;

    if (!a.isInt() || !b.isInt()) {
      throw new Error('Parameters in function xgcd must be integer numbers');
    }

    while (!b.isZero()) {
      q = a.div(b).floor();
      r = a.mod(b);

      t = x;
      x = lastx.minus(q.times(x));
      lastx = t;

      t = y;
      y = lasty.minus(q.times(y));
      lasty = t;

      a = b;
      b = r;
    }

    var res;
    if (a.lt(zero)) {
      res = [a.neg(), lastx.neg(), lasty.neg()];
    }
    else {
      res = [a, !a.isZero() ? lastx : 0, lasty];
    }
    return (config.matrix === 'Array') ? res : matrix(res);
  }
}

exports.name = 'xgcd';
exports.factory = factory;

},{"../../type/matrix/function/matrix":328,"../../utils/number":361}],275:[function(require,module,exports){
'use strict';

var clone = require('../../utils/object').clone;
var isInteger = require('../../utils/number').isInteger;
var array = require('../../utils/array');
var IndexError = require('../../error/IndexError');
var DimensionError = require('../../error/DimensionError');

function factory (type, config, load, typed) {
  var matrix = load(require('../../type/matrix/function/matrix'));

  /**
   * Concatenate two or more matrices.
   *
   * Syntax:
   *
   *     math.concat(A, B, C, ...)
   *     math.concat(A, B, C, ..., dim)
   *
   * Where:
   *
   * - `dim: number` is a zero-based dimension over which to concatenate the matrices.
   *   By default the last dimension of the matrices.
   *
   * Examples:
   *
   *    var A = [[1, 2], [5, 6]];
   *    var B = [[3, 4], [7, 8]];
   *
   *    math.concat(A, B);                  // returns [[1, 2, 3, 4], [5, 6, 7, 8]]
   *    math.concat(A, B, 0);               // returns [[1, 2], [5, 6], [3, 4], [7, 8]]
   *    math.concat('hello', ' ', 'world'); // returns 'hello world'
   *
   * See also:
   *
   *    size, squeeze, subset, transpose
   *
   * @param {... Array | Matrix} args     Two or more matrices
   * @return {Array | Matrix} Concatenated matrix
   */
  var concat = typed('concat', {
    // TODO: change signature to '...Array | Matrix, dim?' when supported
    '...Array | Matrix | number | BigNumber': function (args) {
      var i;
      var len = args.length;
      var dim = -1;  // zero-based dimension
      var prevDim;
      var asMatrix = false;
      var matrices = [];  // contains multi dimensional arrays

      for (i = 0; i < len; i++) {
        var arg = args[i];

        // test whether we need to return a Matrix (if not we return an Array)
        if (arg && arg.isMatrix === true) {
          asMatrix = true;
        }

        if (typeof arg === 'number' || (arg && arg.isBigNumber === true)) {
          if (i !== len - 1) {
            throw new Error('Dimension must be specified as last argument');
          }

          // last argument contains the dimension on which to concatenate
          prevDim = dim;
          dim = arg.valueOf(); // change BigNumber to number

          if (!isInteger(dim)) {
            throw new TypeError('Integer number expected for dimension');
          }

          if (dim < 0 || (i > 0 && dim > prevDim)) {
            // TODO: would be more clear when throwing a DimensionError here
            throw new IndexError(dim, prevDim + 1);
          }
        }
        else {
          // this is a matrix or array
          var m = clone(arg).valueOf();
          var size = array.size(m);
          matrices[i] = m;
          prevDim = dim;
          dim = size.length - 1;

          // verify whether each of the matrices has the same number of dimensions
          if (i > 0 && dim != prevDim) {
            throw new DimensionError(prevDim + 1, dim + 1);
          }
        }
      }

      if (matrices.length == 0) {
        throw new SyntaxError('At least one matrix expected');
      }

      var res = matrices.shift();
      while (matrices.length) {
        res = _concat(res, matrices.shift(), dim, 0);
      }

      return asMatrix ? matrix(res) : res;
    },

    '...string': function (args) {
      return args.join('');
    }
  });

  concat.toTex = undefined; // use default template

  return concat;
}

/**
 * Recursively concatenate two matrices.
 * The contents of the matrices is not cloned.
 * @param {Array} a             Multi dimensional array
 * @param {Array} b             Multi dimensional array
 * @param {number} concatDim    The dimension on which to concatenate (zero-based)
 * @param {number} dim          The current dim (zero-based)
 * @return {Array} c            The concatenated matrix
 * @private
 */
function _concat(a, b, concatDim, dim) {
  if (dim < concatDim) {
    // recurse into next dimension
    if (a.length != b.length) {
      throw new DimensionError(a.length, b.length);
    }

    var c = [];
    for (var i = 0; i < a.length; i++) {
      c[i] = _concat(a[i], b[i], concatDim, dim + 1);
    }
    return c;
  }
  else {
    // concatenate this dimension
    return a.concat(b);
  }
}

exports.name = 'concat';
exports.factory = factory;

},{"../../error/DimensionError":15,"../../error/IndexError":16,"../../type/matrix/function/matrix":328,"../../utils/array":346,"../../utils/number":361,"../../utils/object":362}],276:[function(require,module,exports){
'use strict';

var util = require('../../utils/index');
var object = util.object;
var string = util.string;

function factory (type, config, load, typed) {
  var matrix = load(require('../../type/matrix/function/matrix'));
  var add = load(require('../arithmetic/add'));
  var subtract = load(require('../arithmetic/subtract'));
  var multiply = load(require('../arithmetic/multiply'));
  var unaryMinus = load(require('../arithmetic/unaryMinus'));

  /**
   * Calculate the determinant of a matrix.
   *
   * Syntax:
   *
   *    math.det(x)
   *
   * Examples:
   *
   *    math.det([[1, 2], [3, 4]]); // returns -2
   *
   *    var A = [
   *      [-2, 2, 3],
   *      [-1, 1, 3],
   *      [2, 0, -1]
   *    ]
   *    math.det(A); // returns 6
   *
   * See also:
   *
   *    inv
   *
   * @param {Array | Matrix} x  A matrix
   * @return {number} The determinant of `x`
   */
  var det = typed('det', {
    'any': function (x) {
      return object.clone(x);
    },

    'Array | Matrix': function det (x) {
      var size;
      if (x && x.isMatrix === true) {
        size = x.size();
      }
      else if (Array.isArray(x)) {
        x = matrix(x);
        size = x.size();
      }
      else {
        // a scalar
        size = [];
      }

      switch (size.length) {
        case 0:
          // scalar
          return object.clone(x);

        case 1:
          // vector
          if (size[0] == 1) {
            return object.clone(x.valueOf()[0]);
          }
          else {
            throw new RangeError('Matrix must be square ' +
            '(size: ' + string.format(size) + ')');
          }

        case 2:
          // two dimensional array
          var rows = size[0];
          var cols = size[1];
          if (rows == cols) {
            return _det(x.clone().valueOf(), rows, cols);
          }
          else {
            throw new RangeError('Matrix must be square ' +
            '(size: ' + string.format(size) + ')');
          }

        default:
          // multi dimensional array
          throw new RangeError('Matrix must be two dimensional ' +
          '(size: ' + string.format(size) + ')');
      }
    }
  });

  det.toTex = {1: '\\det\\left(${args[0]}\\right)'};

  return det;

  /**
   * Calculate the determinant of a matrix
   * @param {Array[]} matrix  A square, two dimensional matrix
   * @param {number} rows     Number of rows of the matrix (zero-based)
   * @param {number} cols     Number of columns of the matrix (zero-based)
   * @returns {number} det
   * @private
   */
  function _det (matrix, rows, cols) {
    if (rows == 1) {
      // this is a 1 x 1 matrix
      return object.clone(matrix[0][0]);
    }
    else if (rows == 2) {
      // this is a 2 x 2 matrix
      // the determinant of [a11,a12;a21,a22] is det = a11*a22-a21*a12
      return subtract(
          multiply(matrix[0][0], matrix[1][1]),
          multiply(matrix[1][0], matrix[0][1])
      );
    }
    else {
      // this is an n x n matrix
      var compute_mu = function (matrix) {
        var i, j;

        // Compute the matrix with zero lower triangle, same upper triangle,
        // and diagonals given by the negated sum of the below diagonal
        // elements.
        var mu = new Array(matrix.length);
        var sum = 0;
        for (i = 1; i < matrix.length; i++) {
          sum = add(sum, matrix[i][i]);
        }

        for (i = 0; i < matrix.length; i++) {
          mu[i] = new Array(matrix.length);
          mu[i][i] = unaryMinus(sum);

          for (j = 0; j < i; j++) {
            mu[i][j] = 0; // TODO: make bignumber 0 in case of bignumber computation
          }

          for (j = i + 1; j < matrix.length; j++) {
            mu[i][j] = matrix[i][j];
          }

          if (i+1 < matrix.length) {
            sum = subtract(sum, matrix[i + 1][i + 1]);
          }
        }

        return mu;
      };

      var fa = matrix;
      for (var i = 0; i < rows - 1; i++) {
        fa = multiply(compute_mu(fa), matrix);
      }

      if (rows % 2 == 0) {
        return unaryMinus(fa[0][0]);
      } else {
        return fa[0][0];
      }
    }
  }
}

exports.name = 'det';
exports.factory = factory;


},{"../../type/matrix/function/matrix":328,"../../utils/index":359,"../arithmetic/add":242,"../arithmetic/multiply":262,"../arithmetic/subtract":271,"../arithmetic/unaryMinus":272}],277:[function(require,module,exports){
'use strict';

var array = require('../../utils/array');
var isInteger = require('../../utils/number').isInteger;

function factory (type, config, load, typed) {
  
  var matrix = load(require('../../type/matrix/function/matrix'));
  
  /**
   * Create a 2-dimensional identity matrix with size m x n or n x n.
   * The matrix has ones on the diagonal and zeros elsewhere.
   *
   * Syntax:
   *
   *    math.eye(n)
   *    math.eye(n, format)
   *    math.eye(m, n)
   *    math.eye(m, n, format)
   *    math.eye([m, n])
   *    math.eye([m, n], format)
   *
   * Examples:
   *
   *    math.eye(3);                    // returns [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
   *    math.eye(3, 2);                 // returns [[1, 0], [0, 1], [0, 0]]
   *
   *    var A = [[1, 2, 3], [4, 5, 6]];
   *    math.eye(math.size(A));         // returns [[1, 0, 0], [0, 1, 0]]
   *
   * See also:
   *
   *    diag, ones, zeros, size, range
   *
   * @param {...number | Matrix | Array} size   The size for the matrix
   * @param {string} [format]                   The Matrix storage format
   *
   * @return {Matrix | Array | number} A matrix with ones on the diagonal.
   */
  var eye = typed('eye', {
    '': function () {
      return (config.matrix === 'Matrix') ? matrix([]) : [];
    },

    'string': function (format) {
      return matrix(format);
    },

    'number | BigNumber': function (rows) {
      return _eye(rows, rows, config.matrix === 'Matrix' ? 'default' : undefined);
    },
    
    'number | BigNumber, string': function (rows, format) {
      return _eye(rows, rows, format);
    },

    'number | BigNumber, number | BigNumber': function (rows, cols) {
      return _eye(rows, cols, config.matrix === 'Matrix' ? 'default' : undefined);
    },
    
    'number | BigNumber, number | BigNumber, string': function (rows, cols, format) {
      return _eye(rows, cols, format);
    },

    'Array':  function (size) {
      return _eyeVector(size);
    },
    
    'Array, string':  function (size, format) {
      return _eyeVector(size, format);
    },

    'Matrix': function (size) {
      return _eyeVector(size.valueOf(), size.storage());
    },
    
    'Matrix, string': function (size, format) {
      return _eyeVector(size.valueOf(), format);
    }
  });

  eye.toTex = undefined; // use default template

  return eye;

  function _eyeVector (size, format) {
    switch (size.length) {
      case 0: return format ? matrix(format) : [];
      case 1: return _eye(size[0], size[0], format);
      case 2: return _eye(size[0], size[1], format);
      default: throw new Error('Vector containing two values expected');
    }
  }

  /**
   * Create an identity matrix
   * @param {number | BigNumber} rows
   * @param {number | BigNumber} cols
   * @param {string} [format]
   * @returns {Matrix}
   * @private
   */
  function _eye (rows, cols, format) {
    // BigNumber constructor with the right precision
    var Big = (rows && rows.isBigNumber === true)
        ? type.BigNumber
        : (cols && cols.isBigNumber === true)
            ? type.BigNumber
            : null;

    if (rows && rows.isBigNumber === true) rows = rows.toNumber();
    if (cols && cols.isBigNumber === true) cols = cols.toNumber();

    if (!isInteger(rows) || rows < 1) {
      throw new Error('Parameters in function eye must be positive integers');
    }
    if (!isInteger(cols) || cols < 1) {
      throw new Error('Parameters in function eye must be positive integers');
    }
    
    var one = Big ? new type.BigNumber(1) : 1;
    var defaultValue = Big ? new Big(0) : 0;
    var size = [rows, cols];
    
    // check we need to return a matrix
    if (format) {
      // get matrix storage constructor
      var F = type.Matrix.storage(format);
      // create diagonal matrix (use optimized implementation for storage format)
      return F.diagonal(size, one, 0, defaultValue);
    }
    
    // create and resize array
    var res = array.resize([], size, defaultValue);
    // fill in ones on the diagonal
    var minimum = rows < cols ? rows : cols;
    // fill diagonal
    for (var d = 0; d < minimum; d++) {
      res[d][d] = one;
    }
    return res;
  }
}

exports.name = 'eye';
exports.factory = factory;

},{"../../type/matrix/function/matrix":328,"../../utils/array":346,"../../utils/number":361}],278:[function(require,module,exports){
'use strict';

var size = require('../../utils/array').size;
var maxArgumentCount = require('../../utils/function').maxArgumentCount;

function factory (type, config, load, typed) {
  var matrix = load(require('../../type/matrix/function/matrix'));
  
  /**
   * Filter the items in an array or one dimensional matrix.
   *
   * Syntax:
   *
   *    math.filter(x, test)
   *
   * Examples:
   *
   *    function isPositive (x) {
   *      return x > 0;
   *    }
   *    math.filter([6, -2, -1, 4, 3], isPositive); // returns [6, 4, 3]
   *
   *    math.filter(["23", "foo", "100", "55", "bar"], /[0-9]+/); // returns ["23", "100", "55"]
   *
   * See also:
   *
   *    forEach, map, sort
   *
   * @param {Matrix | Array} x    A one dimensional matrix or array to filter
   * @param {Function | RegExp} test
   *        A function or regular expression to test items.
   *        All entries for which `test` returns true are returned.
   *        When `test` is a function, it is invoked with three parameters:
   *        the value of the element, the index of the element, and the
   *        matrix/array being traversed. The function must return a boolean.
   * @return {Matrix | Array} Returns the filtered matrix.
   */
  var filter = typed('filter', {
    'Array, function': _filterCallback,

    'Array, RegExp': _filterRegExp,

    'Matrix, function': function (x, test) {
      return matrix(_filterCallback(x.toArray(), test));
    },

    'Matrix, RegExp': function (x, test) {
      return matrix(_filterRegExp(x.toArray(), test));
    }
  });

  filter.toTex = undefined; // use default template

  return filter;
}

/**
 * Filter values in a callback given a callback function
 * @param {Array} x
 * @param {Function} callback
 * @return {Array} Returns the filtered array
 * @private
 */
function _filterCallback (x, callback) {
  if (size(x).length !== 1) {
    throw new Error('Only one dimensional matrices supported');
  }

  // figure out what number of arguments the callback function expects
  var args = maxArgumentCount(callback);

  return x.filter(function (value, index, array) {
    // invoke the callback function with the right number of arguments
    if (args === 1) {
      return callback(value);
    }
    else if (args === 2) {
      return callback(value, [index]);
    }
    else { // 3 or -1
      return callback(value, [index], array);
    }
  });
}

/**
 * Filter values in a callback given a regular expression
 * @param {Array} x
 * @param {Function} regexp
 * @return {Array} Returns the filtered array
 * @private
 */
function _filterRegExp (x, regexp) {
  if (size(x).length !== 1) {
    throw new Error('Only one dimensional matrices supported');
  }

  return x.filter(function (entry) {
    return regexp.test(entry);
  });
}

exports.name = 'filter';
exports.factory = factory;

},{"../../type/matrix/function/matrix":328,"../../utils/array":346,"../../utils/function":358}],279:[function(require,module,exports){
'use strict';

var maxArgumentCount = require('../../utils/function').maxArgumentCount;

function factory (type, config, load, typed) {
  /**
   * Iterate over all elements of a matrix/array, and executes the given callback function.
   *
   * Syntax:
   *
   *    math.forEach(x, callback)
   *
   * Examples:
   *
   *    math.forEach([1, 2, 3], function(value) {
   *      console.log(value);
   *    });
   *    // outputs 1, 2, 3
   *
   * See also:
   *
   *    filter, map, sort
   *
   * @param {Matrix | Array} x    The matrix to iterate on.
   * @param {Function} callback   The callback function is invoked with three
   *                              parameters: the value of the element, the index
   *                              of the element, and the Matrix/array being traversed.
   */
  var forEach = typed('forEach', {
    'Array, function': _forEach,

    'Matrix, function': function (x, callback) {
      return x.forEach(callback);
    }
  });

  forEach.toTex = undefined; // use default template

  return forEach;
}

/**
 * forEach for a multi dimensional array
 * @param {Array} array
 * @param {Function} callback
 * @private
 */
function _forEach (array, callback) {
  // figure out what number of arguments the callback function expects
  var args = maxArgumentCount(callback);

  var recurse = function (value, index) {
    if (Array.isArray(value)) {
      value.forEach(function (child, i) {
        // we create a copy of the index array and append the new index value
        recurse(child, index.concat(i));
      });
    }
    else {
      // invoke the callback function with the right number of arguments
      if (args === 1) {
        callback(value);
      }
      else if (args === 2) {
        callback(value, index);
      }
      else { // 3 or -1
        callback(value, index, array);
      }
    }
  };
  recurse(array, []);
}

exports.name = 'forEach';
exports.factory = factory;

},{"../../utils/function":358}],280:[function(require,module,exports){
'use strict';

var util = require('../../utils/index');

function factory (type, config, load, typed) {
  var matrix       = load(require('../../type/matrix/function/matrix'));
  var divideScalar = load(require('../arithmetic/divideScalar'));
  var addScalar    = load(require('../arithmetic/addScalar'));
  var multiply     = load(require('../arithmetic/multiply'));
  var unaryMinus   = load(require('../arithmetic/unaryMinus'));
  var det          = load(require('../matrix/det'));
  var eye          = load(require('./eye'));

  /**
   * Calculate the inverse of a square matrix.
   *
   * Syntax:
   *
   *     math.inv(x)
   *
   * Examples:
   *
   *     math.inv([[1, 2], [3, 4]]);  // returns [[-2, 1], [1.5, -0.5]]
   *     math.inv(4);                 // returns 0.25
   *     1 / 4;                       // returns 0.25
   *
   * See also:
   *
   *     det, transpose
   *
   * @param {number | Complex | Array | Matrix} x     Matrix to be inversed
   * @return {number | Complex | Array | Matrix} The inverse of `x`.
   */
  var inv = typed('inv', {
    'Array | Matrix': function (x) {
      var size = (x.isMatrix === true) ? x.size() : util.array.size(x);
      switch (size.length) {
        case 1:
          // vector
          if (size[0] == 1) {
            if (x.isMatrix === true) {
              return matrix([
                divideScalar(1, x.valueOf()[0])
              ]);
            }
            else {
              return [
                divideScalar(1, x[0])
              ];
            }
          }
          else {
            throw new RangeError('Matrix must be square ' +
            '(size: ' + util.string.format(size) + ')');
          }

        case 2:
          // two dimensional array
          var rows = size[0];
          var cols = size[1];
          if (rows == cols) {
            if (x.isMatrix === true) {
              return matrix(
                  _inv(x.valueOf(), rows, cols),
                  x.storage()
              );
            }
            else {
              // return an Array
              return _inv(x, rows, cols);
            }
          }
          else {
            throw new RangeError('Matrix must be square ' +
            '(size: ' + util.string.format(size) + ')');
          }

        default:
          // multi dimensional array
          throw new RangeError('Matrix must be two dimensional ' +
          '(size: ' + util.string.format(size) + ')');
      }
    },

    'any': function (x) {
      // scalar
      return divideScalar(1, x); // FIXME: create a BigNumber one when configured for bignumbers
    }
  });

  /**
   * Calculate the inverse of a square matrix
   * @param {Array[]} mat     A square matrix
   * @param {number} rows     Number of rows
   * @param {number} cols     Number of columns, must equal rows
   * @return {Array[]} inv    Inverse matrix
   * @private
   */
  function _inv (mat, rows, cols){
    var r, s, f, value, temp;

    if (rows == 1) {
      // this is a 1 x 1 matrix
      value = mat[0][0];
      if (value == 0) {
        throw Error('Cannot calculate inverse, determinant is zero');
      }
      return [[
        divideScalar(1, value)
      ]];
    }
    else if (rows == 2) {
      // this is a 2 x 2 matrix
      var d = det(mat);
      if (d == 0) {
        throw Error('Cannot calculate inverse, determinant is zero');
      }
      return [
        [
          divideScalar(mat[1][1], d),
          divideScalar(unaryMinus(mat[0][1]), d)
        ],
        [
          divideScalar(unaryMinus(mat[1][0]), d),
          divideScalar(mat[0][0], d)
        ]
      ];
    }
    else {
      // this is a matrix of 3 x 3 or larger
      // calculate inverse using gauss-jordan elimination
      //      http://en.wikipedia.org/wiki/Gaussian_elimination
      //      http://mathworld.wolfram.com/MatrixInverse.html
      //      http://math.uww.edu/~mcfarlat/inverse.htm

      // make a copy of the matrix (only the arrays, not of the elements)
      var A = mat.concat();
      for (r = 0; r < rows; r++) {
        A[r] = A[r].concat();
      }

      // create an identity matrix which in the end will contain the
      // matrix inverse
      var B = eye(rows).valueOf();

      // loop over all columns, and perform row reductions
      for (var c = 0; c < cols; c++) {
        // element Acc should be non zero. if not, swap content
        // with one of the lower rows
        r = c;
        while (r < rows && A[r][c] == 0) {
          r++;
        }
        if (r == rows || A[r][c] == 0) {
          // TODO: in case of zero det, just return a matrix wih Infinity values? (like octave)
          throw Error('Cannot calculate inverse, determinant is zero');
        }
        if (r != c) {
          temp = A[c]; A[c] = A[r]; A[r] = temp;
          temp = B[c]; B[c] = B[r]; B[r] = temp;
        }

        // eliminate non-zero values on the other rows at column c
        var Ac = A[c],
            Bc = B[c];
        for (r = 0; r < rows; r++) {
          var Ar = A[r],
              Br = B[r];
          if(r != c) {
            // eliminate value at column c and row r
            if (Ar[c] != 0) {
              f = divideScalar(unaryMinus(Ar[c]), Ac[c]);

              // add (f * row c) to row r to eliminate the value
              // at column c
              for (s = c; s < cols; s++) {
                Ar[s] = addScalar(Ar[s], multiply(f, Ac[s]));
              }
              for (s = 0; s < cols; s++) {
                Br[s] = addScalar(Br[s],  multiply(f, Bc[s]));
              }
            }
          }
          else {
            // normalize value at Acc to 1,
            // divide each value on row r with the value at Acc
            f = Ac[c];
            for (s = c; s < cols; s++) {
              Ar[s] = divideScalar(Ar[s], f);
            }
            for (s = 0; s < cols; s++) {
              Br[s] = divideScalar(Br[s], f);
            }
          }
        }
      }
      return B;
    }
  }

  inv.toTex = {1: '\\left(${args[0]}\\right)^{-1}'};

  return inv;
}

exports.name = 'inv';
exports.factory = factory;

},{"../../type/matrix/function/matrix":328,"../../utils/index":359,"../arithmetic/addScalar":243,"../arithmetic/divideScalar":248,"../arithmetic/multiply":262,"../arithmetic/unaryMinus":272,"../matrix/det":276,"./eye":277}],281:[function(require,module,exports){
'use strict';

var maxArgumentCount = require('../../utils/function').maxArgumentCount;

function factory (type, config, load, typed) {
  /**
   * Create a new matrix or array with the results of the callback function executed on
   * each entry of the matrix/array.
   *
   * Syntax:
   *
   *    math.map(x, callback)
   *
   * Examples:
   *
   *    math.map([1, 2, 3], function(value) {
   *      return value * value;
   *    });  // returns [1, 4, 9]
   *
   * See also:
   *
   *    filter, forEach, sort
   *
   * @param {Matrix | Array} x    The matrix to iterate on.
   * @param {Function} callback   The callback method is invoked with three
   *                              parameters: the value of the element, the index
   *                              of the element, and the matrix being traversed.
   * @return {Matrix | array}     Transformed map of x
   */
  var map = typed('map', {
    'Array, function': _map,

    'Matrix, function': function (x, callback) {
      return x.map(callback);
    }
  });

  map.toTex = undefined; // use default template

  return map;
}

/**
 * Map for a multi dimensional array
 * @param {Array} array
 * @param {Function} callback
 * @return {Array}
 * @private
 */
function _map (array, callback) {
  // figure out what number of arguments the callback function expects
  var args = maxArgumentCount(callback);

  var recurse = function (value, index) {
    if (Array.isArray(value)) {
      return value.map(function (child, i) {
        // we create a copy of the index array and append the new index value
        return recurse(child, index.concat(i));
      });
    }
    else {
      // invoke the callback function with the right number of arguments
      if (args === 1) {
        return callback(value);
      }
      else if (args === 2) {
        return callback(value, index);
      }
      else { // 3 or -1
        return callback(value, index, array);
      }
    }
  };

  return recurse(array, []);
}

exports.name = 'map';
exports.factory = factory;

},{"../../utils/function":358}],282:[function(require,module,exports){
'use strict';

function factory (type, config, load, typed) {
  var matrix = load(require('../../type/matrix/function/matrix'));

  var ZERO = new type.BigNumber(0);
  var ONE = new type.BigNumber(1);

  /**
   * Create an array from a range.
   * By default, the range end is excluded. This can be customized by providing
   * an extra parameter `includeEnd`.
   *
   * Syntax:
   *
   *     math.range(str [, includeEnd])               // Create a range from a string,
   *                                                  // where the string contains the
   *                                                  // start, optional step, and end,
   *                                                  // separated by a colon.
   *     math.range(start, end [, includeEnd])        // Create a range with start and
   *                                                  // end and a step size of 1.
   *     math.range(start, end, step [, includeEnd])  // Create a range with start, step,
   *                                                  // and end.
   *
   * Where:
   *
   * - `str: string`
   *   A string 'start:end' or 'start:step:end'
   * - `start: {number | BigNumber}`
   *   Start of the range
   * - `end: number | BigNumber`
   *   End of the range, excluded by default, included when parameter includeEnd=true
   * - `step: number | BigNumber`
   *   Step size. Default value is 1.
   * - `includeEnd: boolean`
   *   Option to specify whether to include the end or not. False by default.
   *
   * Examples:
   *
   *     math.range(2, 6);        // [2, 3, 4, 5]
   *     math.range(2, -3, -1);   // [2, 1, 0, -1, -2]
   *     math.range('2:1:6');     // [2, 3, 4, 5]
   *     math.range(2, 6, true);  // [2, 3, 4, 5, 6]
   *
   * See also:
   *
   *     ones, zeros, size, subset
   *
   * @param {*} args   Parameters describing the ranges `start`, `end`, and optional `step`.
   * @return {Array | Matrix} range
   */
  var range = typed('range', {
    // TODO: simplify signatures when typed-function supports default values and optional arguments

    // TODO: a number or boolean should not be converted to string here
    'string': _strRange,
    'string, boolean': _strRange,

    'number, number':  function (start, end) {
      return _out(_rangeEx(start, end, 1));
    },
    'number, number, number': function (start, end, step) {
      return _out(_rangeEx(start, end, step));
    },
    'number, number, boolean': function (start, end, includeEnd) {
      return includeEnd
          ? _out(_rangeInc(start, end, 1))
          : _out(_rangeEx(start, end, 1));
    },
    'number, number, number, boolean': function (start, end, step, includeEnd) {
      return includeEnd
          ? _out(_rangeInc(start, end, step))
          : _out(_rangeEx(start, end, step));
    },

    'BigNumber, BigNumber':  function (start, end) {
      return _out(_bigRangeEx(start, end, ONE));
    },
    'BigNumber, BigNumber, BigNumber': function (start, end, step) {
      return _out(_bigRangeEx(start, end, step));
    },
    'BigNumber, BigNumber, boolean': function (start, end, includeEnd) {
      return includeEnd
          ? _out(_bigRangeInc(start, end, ONE))
          : _out(_bigRangeEx(start, end, ONE));
    },
    'BigNumber, BigNumber, BigNumber, boolean': function (start, end, step, includeEnd) {
      return includeEnd
          ? _out(_bigRangeInc(start, end, step))
          : _out(_bigRangeEx(start, end, step));
    }

  });

  range.toTex = undefined; // use default template

  return range;

  function _out(arr) {
    return config.matrix === 'Array' ? arr : matrix(arr);
  }

  function _strRange (str, includeEnd) {
    var r = _parse(str);
    if (!r){
      throw new SyntaxError('String "' + str + '" is no valid range');
    }

    var fn;
    if (config.number === 'BigNumber') {
      fn = includeEnd ? _bigRangeInc : _bigRangeEx;
      return _out(fn(
          new type.BigNumber(r.start),
          new type.BigNumber(r.end),
          new type.BigNumber(r.step)));
    }
    else {
      fn = includeEnd ? _rangeInc : _rangeEx;
      return _out(fn(r.start, r.end, r.step));
    }
  }

  /**
   * Create a range with numbers. End is excluded
   * @param {number} start
   * @param {number} end
   * @param {number} step
   * @returns {Array} range
   * @private
   */
  function _rangeEx (start, end, step) {
    var array = [],
        x = start;
    if (step > 0) {
      while (x < end) {
        array.push(x);
        x += step;
      }
    }
    else if (step < 0) {
      while (x > end) {
        array.push(x);
        x += step;
      }
    }

    return array;
  }

  /**
   * Create a range with numbers. End is included
   * @param {number} start
   * @param {number} end
   * @param {number} step
   * @returns {Array} range
   * @private
   */
  function _rangeInc (start, end, step) {
    var array = [],
        x = start;
    if (step > 0) {
      while (x <= end) {
        array.push(x);
        x += step;
      }
    }
    else if (step < 0) {
      while (x >= end) {
        array.push(x);
        x += step;
      }
    }

    return array;
  }

  /**
   * Create a range with big numbers. End is excluded
   * @param {BigNumber} start
   * @param {BigNumber} end
   * @param {BigNumber} step
   * @returns {Array} range
   * @private
   */
  function _bigRangeEx (start, end, step) {
    var array = [],
        x = start;
    if (step.gt(ZERO)) {
      while (x.lt(end)) {
        array.push(x);
        x = x.plus(step);
      }
    }
    else if (step.lt(ZERO)) {
      while (x.gt(end)) {
        array.push(x);
        x = x.plus(step);
      }
    }

    return array;
  }

  /**
   * Create a range with big numbers. End is included
   * @param {BigNumber} start
   * @param {BigNumber} end
   * @param {BigNumber} step
   * @returns {Array} range
   * @private
   */
  function _bigRangeInc (start, end, step) {
    var array = [],
        x = start;
    if (step.gt(ZERO)) {
      while (x.lte(end)) {
        array.push(x);
        x = x.plus(step);
      }
    }
    else if (step.lt(ZERO)) {
      while (x.gte(end)) {
        array.push(x);
        x = x.plus(step);
      }
    }

    return array;
  }

  /**
   * Parse a string into a range,
   * The string contains the start, optional step, and end, separated by a colon.
   * If the string does not contain a valid range, null is returned.
   * For example str='0:2:11'.
   * @param {string} str
   * @return {{start: number, end: number, step: number} | null} range Object containing properties start, end, step
   * @private
   */
  function _parse (str) {
    var args = str.split(':');

    // number
    var nums = args.map(function (arg) {
      // use Number and not parseFloat as Number returns NaN on invalid garbage in the string
      return Number(arg);
    });

    var invalid = nums.some(function (num) {
      return isNaN(num);
    });
    if(invalid) {
      return null;
    }

    switch (nums.length) {
      case 2:
        return {
          start: nums[0],
          end: nums[1],
          step: 1
        };

      case 3:
        return {
          start: nums[0],
          end: nums[2],
          step: nums[1]
        };

      default:
        return null;
    }
  }

}

exports.name = 'range';
exports.factory = factory;

},{"../../type/matrix/function/matrix":328}],283:[function(require,module,exports){
'use strict';

var clone = require('../../utils/object').clone;
var validateIndex = require('../../utils/array').validateIndex;
var DimensionError = require('../../error/DimensionError');

function factory (type, config, load, typed) {
  var matrix = load(require('../../type/matrix/function/matrix'));

  /**
   * Get or set a subset of a matrix or string.
   *
   * Syntax:
   *     math.subset(value, index)                                // retrieve a subset
   *     math.subset(value, index, replacement [, defaultValue])  // replace a subset
   *
   * Examples:
   *
   *     // get a subset
   *     var d = [[1, 2], [3, 4]];
   *     math.subset(d, math.index(1, 0));        // returns 3
   *     math.subset(d, math.index([0, 2], 1));   // returns [[2], [4]]
   *
   *     // replace a subset
   *     var e = [];
   *     var f = math.subset(e, math.index(0, [0, 2]), [5, 6]);  // f = [[5, 6]]
   *     var g = math.subset(f, math.index(1, 1), 7, 0);         // g = [[5, 6], [0, 7]]
   *
   * See also:
   *
   *     size, resize, squeeze, index
   *
   * @param {Array | Matrix | string} matrix  An array, matrix, or string
   * @param {Index} index                     An index containing ranges for each
   *                                          dimension
   * @param {*} [replacement]                 An array, matrix, or scalar.
   *                                          If provided, the subset is replaced with replacement.
   *                                          If not provided, the subset is returned
   * @param {*} [defaultValue=undefined]      Default value, filled in on new entries when
   *                                          the matrix is resized. If not provided,
   *                                          math.matrix elements will be left undefined.
   * @return {Array | Matrix | string} Either the retrieved subset or the updated matrix.
   */
  var subset = typed('subset', {
    // get subset
    'Array, Index': function (value, index) {
      var m = matrix(value);
      var subset = m.subset(index);       // returns a Matrix
      return subset && subset.valueOf();  // return an Array (like the input)
    },

    'Matrix, Index': function (value, index) {
      return value.subset(index);
    },

    'Object, Index': _getObjectProperty,

    'string, Index': _getSubstring,

    // set subset
    'Array, Index, any': function (value, index, replacement) {
      return matrix(clone(value))
          .subset(index, replacement, undefined)
          .valueOf();
    },

    'Array, Index, any, any': function (value, index, replacement, defaultValue) {
      return matrix(clone(value))
          .subset(index, replacement, defaultValue)
          .valueOf();
    },

    'Matrix, Index, any': function (value, index, replacement) {
      return value.clone().subset(index, replacement);
    },

    'Matrix, Index, any, any': function (value, index, replacement, defaultValue) {
      return value.clone().subset(index, replacement, defaultValue);
    },

    'string, Index, string': _setSubstring,
    'string, Index, string, string': _setSubstring,
    'Object, Index, any': _setObjectProperty
  });

  subset.toTex = undefined; // use default template

  return subset;

  /**
   * Retrieve a subset of a string
   * @param {string} str            string from which to get a substring
   * @param {Index} index           An index containing ranges for each dimension
   * @returns {string} substring
   * @private
   */
  function _getSubstring(str, index) {
    if (!index || index.isIndex !== true) {
      // TODO: better error message
      throw new TypeError('Index expected');
    }
    if (index.size().length != 1) {
      throw new DimensionError(index.size().length, 1);
    }

    // validate whether the range is out of range
    var strLen = str.length;
    validateIndex(index.min()[0], strLen);
    validateIndex(index.max()[0], strLen);

    var range = index.dimension(0);

    var substr = '';
    range.forEach(function (v) {
      substr += str.charAt(v);
    });

    return substr;
  }

  /**
   * Replace a substring in a string
   * @param {string} str            string to be replaced
   * @param {Index} index           An index containing ranges for each dimension
   * @param {string} replacement    Replacement string
   * @param {string} [defaultValue] Default value to be uses when resizing
   *                                the string. is ' ' by default
   * @returns {string} result
   * @private
   */
  function _setSubstring(str, index, replacement, defaultValue) {
    if (!index || index.isIndex !== true) {
      // TODO: better error message
      throw new TypeError('Index expected');
    }
    if (index.size().length != 1) {
      throw new DimensionError(index.size().length, 1);
    }
    if (defaultValue !== undefined) {
      if (typeof defaultValue !== 'string' || defaultValue.length !== 1) {
        throw new TypeError('Single character expected as defaultValue');
      }
    }
    else {
      defaultValue = ' ';
    }

    var range = index.dimension(0);
    var len = range.size()[0];

    if (len != replacement.length) {
      throw new DimensionError(range.size()[0], replacement.length);
    }

    // validate whether the range is out of range
    var strLen = str.length;
    validateIndex(index.min()[0]);
    validateIndex(index.max()[0]);

    // copy the string into an array with characters
    var chars = [];
    for (var i = 0; i < strLen; i++) {
      chars[i] = str.charAt(i);
    }

    range.forEach(function (v, i) {
      chars[v] = replacement.charAt(i[0]);
    });

    // initialize undefined characters with a space
    if (chars.length > strLen) {
      for (i = strLen - 1, len = chars.length; i < len; i++) {
        if (!chars[i]) {
          chars[i] = defaultValue;
        }
      }
    }

    return chars.join('');
  }
}

/**
 * Retrieve a property from an object
 * @param {Object} object
 * @param {Index} index
 * @return {*} Returns the value of the property
 * @private
 */
function _getObjectProperty (object, index) {
  if (index.size().length !== 1) {
    throw new DimensionError(index.size(), 1);
  }

  var key = index.dimension(0);
  if (typeof key !== 'string') {
    throw new TypeError('String expected as index to retrieve an object property');
  }

  return object[key];
}

/**
 * Set a property on an object
 * @param {Object} object
 * @param {Index} index
 * @param {*} replacement
 * @return {*} Returns the updated object
 * @private
 */
function _setObjectProperty (object, index, replacement) {
  if (index.size().length !== 1) {
    throw new DimensionError(index.size(), 1);
  }

  var key = index.dimension(0);
  if (typeof key !== 'string') {
    throw new TypeError('String expected as index to retrieve an object property');
  }

  // clone the object, and apply the property to the clone
  var updated = clone(object);
  updated[key] = replacement;

  return updated;
}

exports.name = 'subset';
exports.factory = factory;

},{"../../error/DimensionError":15,"../../type/matrix/function/matrix":328,"../../utils/array":346,"../../utils/object":362}],284:[function(require,module,exports){
'use strict';

var clone = require('../../utils/object').clone;
var format = require('../../utils/string').format;

function factory (type, config, load, typed) {
  
  var matrix = load(require('../../type/matrix/function/matrix'));
  var add = load(require('../arithmetic/add'));

  /**
   * Calculate the trace of a matrix: the sum of the elements on the main
   * diagonal of a square matrix.
   *
   * Syntax:
   *
   *    math.trace(x)
   *
   * Examples:
   *
   *    math.trace([[1, 2], [3, 4]]); // returns 5
   *
   *    var A = [
   *      [1, 2, 3],
   *      [-1, 2, 3],
   *      [2, 0, 3]
   *    ]
   *    math.trace(A); // returns 6
   *
   * See also:
   *
   *    diag
   *
   * @param {Array | Matrix} x  A matrix
   *
   * @return {number} The trace of `x`
   */
  var trace = typed('trace', {
    
    'Array': function (x) {
      // use dense matrix implementation
      return trace(matrix(x));
    },

    'Matrix': function (x) {
      // result
      var c;
      // process storage format
      switch (x.storage()) {
        case 'dense':
          c = _denseTrace(x);
          break;
        case 'sparse':
          c = _sparseTrace(x);
          break;
      }
      return c;
    },
    
    'any': clone
  });
  
  var _denseTrace = function (m) {
    // matrix size & data
    var size = m._size;
    var data = m._data;
    
    // process dimensions
    switch (size.length) {
      case 1:
        // vector
        if (size[0] == 1) {
          // return data[0]
          return clone(data[0]);
        }
        throw new RangeError('Matrix must be square (size: ' + format(size) + ')');
      case 2:
        // two dimensional
        var rows = size[0];
        var cols = size[1];
        if (rows === cols) {
          // calulate sum
          var sum = 0;
          // loop diagonal
          for (var i = 0; i < rows; i++)
            sum = add(sum, data[i][i]);
          // return trace
          return sum;
        }
        throw new RangeError('Matrix must be square (size: ' + format(size) + ')');        
      default:
        // multi dimensional
        throw new RangeError('Matrix must be two dimensional (size: ' + format(size) + ')');
    }
  };
  
  var _sparseTrace = function (m) {
    // matrix arrays
    var values = m._values;
    var index = m._index;
    var ptr = m._ptr;
    var size = m._size;
    // check dimensions
    var rows = size[0];
    var columns = size[1];
    // matrix must be square
    if (rows === columns) {
      // calulate sum
      var sum = 0;
      // check we have data (avoid looping columns)
      if (values.length > 0) {
        // loop columns
        for (var j = 0; j < columns; j++) {
          // k0 <= k < k1 where k0 = _ptr[j] && k1 = _ptr[j+1]
          var k0 = ptr[j];
          var k1 = ptr[j + 1];
          // loop k within [k0, k1[
          for (var k = k0; k < k1; k++) {
            // row index
            var i = index[k];
            // check row
            if (i === j) {
              // accumulate value
              sum = add(sum, values[k]);
              // exit loop
              break;
            }
            if (i > j) {
              // exit loop, no value on the diagonal for column j
              break;
            }
          }
        }
      }
      // return trace
      return sum;
    }
    throw new RangeError('Matrix must be square (size: ' + format(size) + ')');   
  };

  trace.toTex = {1: '\\mathrm{tr}\\left(${args[0]}\\right)'};
  
  return trace;
}

exports.name = 'trace';
exports.factory = factory;

},{"../../type/matrix/function/matrix":328,"../../utils/object":362,"../../utils/string":363,"../arithmetic/add":242}],285:[function(require,module,exports){
'use strict';

var clone = require('../../utils/object').clone;
var format = require('../../utils/string').format;

function factory (type, config, load, typed) {
  var latex = require('../../utils/latex');

  var matrix = load(require('../../type/matrix/function/matrix'));

  var DenseMatrix = type.DenseMatrix,
      SparseMatrix = type.SparseMatrix;

  /**
   * Transpose a matrix. All values of the matrix are reflected over its
   * main diagonal. Only applicable to two dimensional matrices containing
   * a vector (i.e. having size `[1,n]` or `[n,1]`). One dimensional
   * vectors and scalars return the input unchanged.
   *
   * Syntax:
   *
   *     math.transpose(x)
   *
   * Examples:
   *
   *     var A = [[1, 2, 3], [4, 5, 6]];
   *     math.transpose(A);               // returns [[1, 4], [2, 5], [3, 6]]
   *
   * See also:
   *
   *     diag, inv, subset, squeeze
   *
   * @param {Array | Matrix} x  Matrix to be transposed
   * @return {Array | Matrix}   The transposed matrix
   */
  var transpose = typed('transpose', {

    'Array': function (x) {
      // use dense matrix implementation
      return transpose(matrix(x)).valueOf();
    },

    'Matrix': function (x) {
      // matrix size
      var size = x.size();

      // result
      var c;
      
      // process dimensions
      switch (size.length) {
        case 1:
          // vector
          c = x.clone();
          break;

        case 2:
          // rows and columns
          var rows = size[0];
          var columns = size[1];

          // check columns
          if (columns === 0) {
            // throw exception
            throw new RangeError('Cannot transpose a 2D matrix with no columns (size: ' + format(size) + ')');
          }

          // process storage format
          switch (x.storage()) {
            case 'dense':
              c = _denseTranspose(x, rows, columns);
              break;
            case 'sparse':
              c = _sparseTranspose(x, rows, columns);
              break;
          }
          break;
          
        default:
          // multi dimensional
          throw new RangeError('Matrix must be a vector or two dimensional (size: ' + format(this._size) + ')');
      }
      return c;
    },

    // scalars
    'any': function (x) {
      return clone(x);
    }
  });

  var _denseTranspose = function (m, rows, columns) {
    // matrix array
    var data = m._data;
    // transposed matrix data
    var transposed = [];
    var transposedRow;
    // loop columns
    for (var j = 0; j < columns; j++) {
      // initialize row
      transposedRow = transposed[j] = [];
      // loop rows
      for (var i = 0; i < rows; i++) {
        // set data
        transposedRow[i] = clone(data[i][j]);
      }
    }
    // return matrix
    return new DenseMatrix({
      data: transposed,
      size: [columns, rows],
      datatype: m._datatype
    });
  };

  var _sparseTranspose = function (m, rows, columns) {
    // matrix arrays
    var values = m._values;
    var index = m._index;
    var ptr = m._ptr;
    // result matrices
    var cvalues = values ? [] : undefined;
    var cindex = [];
    var cptr = [];
    // row counts
    var w = [];
    for (var x = 0; x < rows; x++)
      w[x] = 0;
    // vars
    var p, l, j;
    // loop values in matrix
    for (p = 0, l = index.length; p < l; p++) {
      // number of values in row
      w[index[p]]++;
    }
    // cumulative sum
    var sum = 0;
    // initialize cptr with the cummulative sum of row counts
    for (var i = 0; i < rows; i++) {
      // update cptr
      cptr.push(sum);
      // update sum
      sum += w[i];
      // update w
      w[i] = cptr[i];
    }
    // update cptr
    cptr.push(sum);
    // loop columns
    for (j = 0; j < columns; j++) {
      // values & index in column
      for (var k0 = ptr[j], k1 = ptr[j + 1], k = k0; k < k1; k++) {
        // C values & index
        var q = w[index[k]]++;
        // C[j, i] = A[i, j]
        cindex[q] = j;
        // check we need to process values (pattern matrix)
        if (values)
          cvalues[q] = clone(values[k]);
      }
    }
    // return matrix
    return new SparseMatrix({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size: [columns, rows],
      datatype: m._datatype
    });
  };

  transpose.toTex = {1: '\\left(${args[0]}\\right)' + latex.operators['transpose']};

  return transpose;
}

exports.name = 'transpose';
exports.factory = factory;

},{"../../type/matrix/function/matrix":328,"../../utils/latex":360,"../../utils/object":362,"../../utils/string":363}],286:[function(require,module,exports){
'use strict';

var isInteger = require('../../utils/number').isInteger;
var resize = require('../../utils/array').resize;

function factory (type, config, load, typed) {
  var matrix = load(require('../../type/matrix/function/matrix'));

  /**
   * Create a matrix filled with zeros. The created matrix can have one or
   * multiple dimensions.
   *
   * Syntax:
   *
   *    math.zeros(m)
   *    math.zeros(m, format)
   *    math.zeros(m, n)
   *    math.zeros(m, n, format)
   *    math.zeros([m, n])
   *    math.zeros([m, n], format)
   *
   * Examples:
   *
   *    math.zeros(3);                  // returns [0, 0, 0]
   *    math.zeros(3, 2);               // returns [[0, 0], [0, 0], [0, 0]]
   *    math.zeros(3, 'dense');         // returns [0, 0, 0]
   *
   *    var A = [[1, 2, 3], [4, 5, 6]];
   *    math.zeros(math.size(A));       // returns [[0, 0, 0], [0, 0, 0]]
   *
   * See also:
   *
   *    ones, eye, size, range
   *
   * @param {...number | Array} size    The size of each dimension of the matrix
   * @param {string} [format]           The Matrix storage format
   *
   * @return {Array | Matrix}           A matrix filled with zeros
   */
  var zeros = typed('zeros', {
    '': function () {
      return (config.matrix === 'Array')
          ? _zeros([])
          : _zeros([], 'default');
    },

    // math.zeros(m, n, p, ..., format)
    // TODO: more accurate signature '...number | BigNumber, string' as soon as typed-function supports this
    '...number | BigNumber | string': function (size) {
      var last = size[size.length - 1];
      if (typeof last === 'string') {
        var format = size.pop();
        return _zeros(size, format);
      }
      else if (config.matrix === 'Array') {
        return _zeros(size);
      }
      else {
        return _zeros(size, 'default');
      }
    },

    'Array': _zeros,

    'Matrix': function (size) {
      var format = size.storage();
      return _zeros(size.valueOf(), format);
    },

    'Array | Matrix, string': function (size, format) {
      return _zeros (size.valueOf(), format);
    }
  });

  zeros.toTex = undefined; // use default template

  return zeros;

  /**
   * Create an Array or Matrix with zeros
   * @param {Array} size
   * @param {string} [format='default']
   * @return {Array | Matrix}
   * @private
   */
  function _zeros(size, format) {
    var hasBigNumbers = _normalize(size);
    var defaultValue = hasBigNumbers ? new type.BigNumber(0) : 0;
    _validate(size);

    if (format) {
      // return a matrix
      var m = matrix(format);
      if (size.length > 0) {
        return m.resize(size, defaultValue);
      }
      return m;
    }
    else {
      // return an Array
      var arr = [];
      if (size.length > 0) {
        return resize(arr, size, defaultValue);
      }
      return arr;
    }
  }

  // replace BigNumbers with numbers, returns true if size contained BigNumbers
  function _normalize(size) {
    var hasBigNumbers = false;
    size.forEach(function (value, index, arr) {
      if (value && value.isBigNumber === true) {
        hasBigNumbers = true;
        arr[index] = value.toNumber();
      }
    });
    return hasBigNumbers;
  }

  // validate arguments
  function _validate (size) {
    size.forEach(function (value) {
      if (typeof value !== 'number' || !isInteger(value) || value < 0) {
        throw new Error('Parameters in function zeros must be positive integers');
      }
    });
  }
}

// TODO: zeros contains almost the same code as ones. Reuse this?

exports.name = 'zeros';
exports.factory = factory;

},{"../../type/matrix/function/matrix":328,"../../utils/array":346,"../../utils/number":361}],287:[function(require,module,exports){
'use strict';

function factory (type, config, load, typed) {
  
  var matrix = load(require('../../type/matrix/function/matrix'));
  var equalScalar = load(require('./equalScalar'));

  var algorithm03 = load(require('../../type/matrix/utils/algorithm03'));
  var algorithm07 = load(require('../../type/matrix/utils/algorithm07'));
  var algorithm12 = load(require('../../type/matrix/utils/algorithm12'));
  var algorithm13 = load(require('../../type/matrix/utils/algorithm13'));
  var algorithm14 = load(require('../../type/matrix/utils/algorithm14'));

  var latex = require('../../utils/latex');

  /**
   * Test whether two values are equal.
   *
   * The function tests whether the relative difference between x and y is
   * smaller than the configured epsilon. The function cannot be used to
   * compare values smaller than approximately 2.22e-16.
   *
   * For matrices, the function is evaluated element wise.
   * In case of complex numbers, x.re must equal y.re, and x.im must equal y.im.
   *
   * Values `null` and `undefined` are compared strictly, thus `null` is only
   * equal to `null` and nothing else, and `undefined` is only equal to
   * `undefined` and nothing else.
   *
   * Syntax:
   *
   *    math.equal(x, y)
   *
   * Examples:
   *
   *    math.equal(2 + 2, 3);         // returns false
   *    math.equal(2 + 2, 4);         // returns true
   *
   *    var a = math.unit('50 cm');
   *    var b = math.unit('5 m');
   *    math.equal(a, b);             // returns true
   *
   *    var c = [2, 5, 1];
   *    var d = [2, 7, 1];
   *
   *    math.equal(c, d);             // returns [true, false, true]
   *    math.deepEqual(c, d);         // returns false
   *
   *    math.equal(0, null);          // returns false
   *
   * See also:
   *
   *    unequal, smaller, smallerEq, larger, largerEq, compare, deepEqual
   *
   * @param  {number | BigNumber | boolean | Complex | Unit | string | Array | Matrix} x First value to compare
   * @param  {number | BigNumber | boolean | Complex | Unit | string | Array | Matrix} y Second value to compare
   * @return {boolean | Array | Matrix} Returns true when the compared values are equal, else returns false
   */
  var equal = typed('equal', {
    
    'any, any': function (x, y) {
      // strict equality for null and undefined?
      if (x === null) { return y === null; }
      if (y === null) { return x === null; }
      if (x === undefined) { return y === undefined; }
      if (y === undefined) { return x === undefined; }

      return equalScalar(x, y);
    },

    'Matrix, Matrix': function (x, y) {
      // result
      var c;

      // process matrix storage
      switch (x.storage()) {
        case 'sparse':
          switch (y.storage()) {
            case 'sparse':
              // sparse + sparse
              c = algorithm07(x, y, equalScalar);
              break;
            default:
              // sparse + dense
              c = algorithm03(y, x, equalScalar, true);
              break;
          }
          break;
        default:
          switch (y.storage()) {
            case 'sparse':
              // dense + sparse
              c = algorithm03(x, y, equalScalar, false);
              break;
            default:
              // dense + dense
              c = algorithm13(x, y, equalScalar);
              break;
          }
          break;
      }
      return c;
    },
    
    'Array, Array': function (x, y) {
      // use matrix implementation
      return equal(matrix(x), matrix(y)).valueOf();
    },

    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return equal(matrix(x), y);
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return equal(x, matrix(y));
    },
    
    'Matrix, any': function (x, y) {
      // result
      var c;
      // check storage format
      switch (x.storage()) {
        case 'sparse':
          c = algorithm12(x, y, equalScalar, false);
          break;
        default:
          c = algorithm14(x, y, equalScalar, false);
          break;
      }
      return c;
    },

    'any, Matrix': function (x, y) {
      // result
      var c;
      // check storage format
      switch (y.storage()) {
        case 'sparse':
          c = algorithm12(y, x, equalScalar, true);
          break;
        default:
          c = algorithm14(y, x, equalScalar, true);
          break;
      }
      return c;
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, equalScalar, false).valueOf();
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, equalScalar, true).valueOf();
    }
  });

  equal.toTex = {
    2: '\\left(${args[0]}' + latex.operators['equal'] + '${args[1]}\\right)'
  };

  return equal;
}

exports.name = 'equal';
exports.factory = factory;

},{"../../type/matrix/function/matrix":328,"../../type/matrix/utils/algorithm03":331,"../../type/matrix/utils/algorithm07":335,"../../type/matrix/utils/algorithm12":339,"../../type/matrix/utils/algorithm13":340,"../../type/matrix/utils/algorithm14":341,"../../utils/latex":360,"./equalScalar":288}],288:[function(require,module,exports){
'use strict';

var nearlyEqual = require('../../utils/number').nearlyEqual;
var bigNearlyEqual = require('../../utils/bignumber/nearlyEqual');

function factory (type, config, load, typed) {
  
  /**
   * Test whether two values are equal.
   *
   * @param  {number | BigNumber | Fraction | boolean | Complex | Unit} x   First value to compare
   * @param  {number | BigNumber | Fraction | boolean | Complex} y          Second value to compare
   * @return {boolean}                                                  Returns true when the compared values are equal, else returns false
   * @private
   */
  var equalScalar = typed('equalScalar', {

    'boolean, boolean': function (x, y) {
      return x === y;
    },

    'number, number': function (x, y) {
      return x === y || nearlyEqual(x, y, config.epsilon);
    },

    'BigNumber, BigNumber': function (x, y) {
      return x.eq(y) || bigNearlyEqual(x, y, config.epsilon);
    },

    'Fraction, Fraction': function (x, y) {
      return x.equals(y);
    },

    'Complex, Complex': function (x, y) {
      return x.equals(y);
    },

    'Unit, Unit': function (x, y) {
      if (!x.equalBase(y)) {
        throw new Error('Cannot compare units with different base');
      }
      return equalScalar(x.value, y.value);
    },

    'string, string': function (x, y) {
      return x === y;
    }
  });
  
  return equalScalar;
}

exports.factory = factory;

},{"../../utils/bignumber/nearlyEqual":349,"../../utils/number":361}],289:[function(require,module,exports){
'use strict';

var nearlyEqual = require('../../utils/number').nearlyEqual;
var bigNearlyEqual = require('../../utils/bignumber/nearlyEqual');

function factory (type, config, load, typed) {
  
  var matrix = load(require('../../type/matrix/function/matrix'));

  var algorithm03 = load(require('../../type/matrix/utils/algorithm03'));
  var algorithm07 = load(require('../../type/matrix/utils/algorithm07'));
  var algorithm12 = load(require('../../type/matrix/utils/algorithm12'));
  var algorithm13 = load(require('../../type/matrix/utils/algorithm13'));
  var algorithm14 = load(require('../../type/matrix/utils/algorithm14'));

  var latex = require('../../utils/latex');

  /**
   * Test whether value x is larger than y.
   *
   * The function returns true when x is larger than y and the relative
   * difference between x and y is larger than the configured epsilon. The
   * function cannot be used to compare values smaller than approximately 2.22e-16.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.larger(x, y)
   *
   * Examples:
   *
   *    math.larger(2, 3);             // returns false
   *    math.larger(5, 2 + 2);         // returns true
   *
   *    var a = math.unit('5 cm');
   *    var b = math.unit('2 inch');
   *    math.larger(a, b);             // returns false
   *
   * See also:
   *
   *    equal, unequal, smaller, smallerEq, largerEq, compare
   *
   * @param  {number | BigNumber | Fraction | boolean | Unit | string | Array | Matrix} x First value to compare
   * @param  {number | BigNumber | Fraction | boolean | Unit | string | Array | Matrix} y Second value to compare
   * @return {boolean | Array | Matrix} Returns true when the x is larger than y, else returns false
   */
  var larger = typed('larger', {

    'boolean, boolean': function (x, y) {
      return x > y;
    },

    'number, number': function (x, y) {
      return x > y && !nearlyEqual(x, y, config.epsilon);
    },

    'BigNumber, BigNumber': function (x, y) {
      return x.gt(y) && !bigNearlyEqual(x, y, config.epsilon);
    },

    'Fraction, Fraction': function (x, y) {
      return x.compare(y) === 1;
    },

    'Complex, Complex': function () {
      throw new TypeError('No ordering relation is defined for complex numbers');
    },

    'Unit, Unit': function (x, y) {
      if (!x.equalBase(y)) {
        throw new Error('Cannot compare units with different base');
      }
      return larger(x.value, y.value);
    },

    'string, string': function (x, y) {
      return x > y;
    },

    'Matrix, Matrix': function (x, y) {
      // result
      var c;

      // process matrix storage
      switch (x.storage()) {
        case 'sparse':
          switch (y.storage()) {
            case 'sparse':
              // sparse + sparse
              c = algorithm07(x, y, larger);
              break;
            default:
              // sparse + dense
              c = algorithm03(y, x, larger, true);
              break;
          }
          break;
        default:
          switch (y.storage()) {
            case 'sparse':
              // dense + sparse
              c = algorithm03(x, y, larger, false);
              break;
            default:
              // dense + dense
              c = algorithm13(x, y, larger);
              break;
          }
          break;
      }
      return c;
    },

    'Array, Array': function (x, y) {
      // use matrix implementation
      return larger(matrix(x), matrix(y)).valueOf();
    },

    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return larger(matrix(x), y);
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return larger(x, matrix(y));
    },

    'Matrix, any': function (x, y) {
      // result
      var c;
      // check storage format
      switch (x.storage()) {
        case 'sparse':
          c = algorithm12(x, y, larger, false);
          break;
        default:
          c = algorithm14(x, y, larger, false);
          break;
      }
      return c;
    },

    'any, Matrix': function (x, y) {
      // result
      var c;
      // check storage format
      switch (y.storage()) {
        case 'sparse':
          c = algorithm12(y, x, larger, true);
          break;
        default:
          c = algorithm14(y, x, larger, true);
          break;
      }
      return c;
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, larger, false).valueOf();
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, larger, true).valueOf();
    }
  });

  larger.toTex = {
    2: '\\left(${args[0]}' + latex.operators['larger'] + '${args[1]}\\right)'
  };

  return larger;
}

exports.name = 'larger';
exports.factory = factory;

},{"../../type/matrix/function/matrix":328,"../../type/matrix/utils/algorithm03":331,"../../type/matrix/utils/algorithm07":335,"../../type/matrix/utils/algorithm12":339,"../../type/matrix/utils/algorithm13":340,"../../type/matrix/utils/algorithm14":341,"../../utils/bignumber/nearlyEqual":349,"../../utils/latex":360,"../../utils/number":361}],290:[function(require,module,exports){
'use strict';

var nearlyEqual = require('../../utils/number').nearlyEqual;
var bigNearlyEqual = require('../../utils/bignumber/nearlyEqual');

function factory (type, config, load, typed) {

  var matrix = load(require('../../type/matrix/function/matrix'));

  var algorithm03 = load(require('../../type/matrix/utils/algorithm03'));
  var algorithm07 = load(require('../../type/matrix/utils/algorithm07'));
  var algorithm12 = load(require('../../type/matrix/utils/algorithm12'));
  var algorithm13 = load(require('../../type/matrix/utils/algorithm13'));
  var algorithm14 = load(require('../../type/matrix/utils/algorithm14'));

  var latex = require('../../utils/latex');

  /**
   * Test whether value x is smaller than y.
   *
   * The function returns true when x is smaller than y and the relative
   * difference between x and y is smaller than the configured epsilon. The
   * function cannot be used to compare values smaller than approximately 2.22e-16.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.smaller(x, y)
   *
   * Examples:
   *
   *    math.smaller(2, 3);            // returns true
   *    math.smaller(5, 2 * 2);        // returns false
   *
   *    var a = math.unit('5 cm');
   *    var b = math.unit('2 inch');
   *    math.smaller(a, b);            // returns true
   *
   * See also:
   *
   *    equal, unequal, smallerEq, smaller, smallerEq, compare
   *
   * @param  {number | BigNumber | Fraction | boolean | Unit | string | Array | Matrix} x First value to compare
   * @param  {number | BigNumber | Fraction | boolean | Unit | string | Array | Matrix} y Second value to compare
   * @return {boolean | Array | Matrix} Returns true when the x is smaller than y, else returns false
   */
  var smaller = typed('smaller', {

    'boolean, boolean': function (x, y) {
      return x < y;
    },

    'number, number': function (x, y) {
      return x < y && !nearlyEqual(x, y, config.epsilon);
    },

    'BigNumber, BigNumber': function (x, y) {
      return x.lt(y) && !bigNearlyEqual(x, y, config.epsilon);
    },

    'Fraction, Fraction': function (x, y) {
      return x.compare(y) === -1;
    },

    'Complex, Complex': function (x, y) {
      throw new TypeError('No ordering relation is defined for complex numbers');
    },

    'Unit, Unit': function (x, y) {
      if (!x.equalBase(y)) {
        throw new Error('Cannot compare units with different base');
      }
      return smaller(x.value, y.value);
    },

    'string, string': function (x, y) {
      return x < y;
    },

    'Matrix, Matrix': function (x, y) {
      // result
      var c;

      // process matrix storage
      switch (x.storage()) {
        case 'sparse':
          switch (y.storage()) {
            case 'sparse':
              // sparse + sparse
              c = algorithm07(x, y, smaller);
              break;
            default:
              // sparse + dense
              c = algorithm03(y, x, smaller, true);
              break;
          }
          break;
        default:
          switch (y.storage()) {
            case 'sparse':
              // dense + sparse
              c = algorithm03(x, y, smaller, false);
              break;
            default:
              // dense + dense
              c = algorithm13(x, y, smaller);
              break;
          }
          break;
      }
      return c;
    },

    'Array, Array': function (x, y) {
      // use matrix implementation
      return smaller(matrix(x), matrix(y)).valueOf();
    },

    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return smaller(matrix(x), y);
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return smaller(x, matrix(y));
    },

    'Matrix, any': function (x, y) {
      // result
      var c;
      // check storage format
      switch (x.storage()) {
        case 'sparse':
          c = algorithm12(x, y, smaller, false);
          break;
        default:
          c = algorithm14(x, y, smaller, false);
          break;
      }
      return c;
    },

    'any, Matrix': function (x, y) {
      // result
      var c;
      // check storage format
      switch (y.storage()) {
        case 'sparse':
          c = algorithm12(y, x, smaller, true);
          break;
        default:
          c = algorithm14(y, x, smaller, true);
          break;
      }
      return c;
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, smaller, false).valueOf();
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, smaller, true).valueOf();
    }
  });

  smaller.toTex = {
    2: '\\left(${args[0]}' + latex.operators['smaller'] + '${args[1]}\\right)'
  };

  return smaller;
}

exports.name = 'smaller';
exports.factory = factory;

},{"../../type/matrix/function/matrix":328,"../../type/matrix/utils/algorithm03":331,"../../type/matrix/utils/algorithm07":335,"../../type/matrix/utils/algorithm12":339,"../../type/matrix/utils/algorithm13":340,"../../type/matrix/utils/algorithm14":341,"../../utils/bignumber/nearlyEqual":349,"../../utils/latex":360,"../../utils/number":361}],291:[function(require,module,exports){
'use strict';

var deepForEach = require('../../utils/collection/deepForEach');
var reduce = require('../../utils/collection/reduce');
var containsCollections = require('../../utils/collection/containsCollections');

function factory (type, config, load, typed) {
  var larger = load(require('../relational/larger'));

  /**
   * Compute the maximum value of a matrix or a  list with values.
   * In case of a multi dimensional array, the maximum of the flattened array
   * will be calculated. When `dim` is provided, the maximum over the selected
   * dimension will be calculated. Parameter `dim` is zero-based.
   *
   * Syntax:
   *
   *     math.max(a, b, c, ...)
   *     math.max(A)
   *     math.max(A, dim)
   *
   * Examples:
   *
   *     math.max(2, 1, 4, 3);                  // returns 4
   *     math.max([2, 1, 4, 3]);                // returns 4
   *
   *     // maximum over a specified dimension (zero-based)
   *     math.max([[2, 5], [4, 3], [1, 7]], 0); // returns [4, 7]
   *     math.max([[2, 5], [4, 3]], [1, 7], 1); // returns [5, 4, 7]
   *
   *     math.max(2.7, 7.1, -4.5, 2.0, 4.1);    // returns 7.1
   *     math.min(2.7, 7.1, -4.5, 2.0, 4.1);    // returns -4.5
   *
   * See also:
   *
   *    mean, median, min, prod, std, sum, var
   *
   * @param {... *} args  A single matrix or or multiple scalar values
   * @return {*} The maximum value
   */
  var max = typed('max', {
    // max([a, b, c, d, ...])
    'Array | Matrix': _max,

    // max([a, b, c, d, ...], dim)
    'Array | Matrix, number | BigNumber': function (array, dim) {
      return reduce(array, dim.valueOf(), _largest);
    },

    // max(a, b, c, d, ...)
    '...': function (args) {
      if (containsCollections(args)) {
        throw new TypeError('Scalar values expected in function max');
      }

      return _max(args);
    }
  });

  max.toTex = '\\max\\left(${args}\\right)';

  return max;

  /**
   * Return the largest of two values
   * @param {*} x
   * @param {*} y
   * @returns {*} Returns x when x is largest, or y when y is largest
   * @private
   */
  function _largest(x, y){
    return larger(x, y) ? x : y;
  }

  /**
   * Recursively calculate the maximum value in an n-dimensional array
   * @param {Array} array
   * @return {number} max
   * @private
   */
  function _max(array) {
    var max = undefined;

    deepForEach(array, function (value) {
      if (max === undefined || larger(value, max)) {
        max = value;
      }
    });

    if (max === undefined) {
      throw new Error('Cannot calculate max of an empty array');
    }

    return max;
  }
}

exports.name = 'max';
exports.factory = factory;

},{"../../utils/collection/containsCollections":351,"../../utils/collection/deepForEach":352,"../../utils/collection/reduce":355,"../relational/larger":289}],292:[function(require,module,exports){
'use strict';

var size = require('../../utils/array').size;
var deepForEach = require('../../utils/collection/deepForEach');
var reduce = require('../../utils/collection/reduce');
var containsCollections = require('../../utils/collection/containsCollections');

function factory (type, config, load, typed) {
  var add = load(require('../arithmetic/add'));
  var divide = load(require('../arithmetic/divide'));

  /**
   * Compute the mean value of matrix or a list with values.
   * In case of a multi dimensional array, the mean of the flattened array
   * will be calculated. When `dim` is provided, the maximum over the selected
   * dimension will be calculated. Parameter `dim` is zero-based.
   *
   * Syntax:
   *
   *     math.mean(a, b, c, ...)
   *     math.mean(A)
   *     math.mean(A, dim)
   *
   * Examples:
   *
   *     math.mean(2, 1, 4, 3);                     // returns 2.5
   *     math.mean([1, 2.7, 3.2, 4]);               // returns 2.725
   *
   *     math.mean([[2, 5], [6, 3], [1, 7]], 0);    // returns [3, 5]
   *     math.mean([[2, 5], [6, 3], [1, 7]], 1);    // returns [3.5, 4.5, 4]
   *
   * See also:
   *
   *     median, min, max, sum, prod, std, var
   *
   * @param {... *} args  A single matrix or or multiple scalar values
   * @return {*} The mean of all values
   */
  var mean = typed('mean', {
      // mean([a, b, c, d, ...])
    'Array | Matrix': _mean,

      // mean([a, b, c, d, ...], dim)
    'Array | Matrix, number | BigNumber': _nmean,

    // mean(a, b, c, d, ...)
    '...': function (args) {
      if (containsCollections(args)) {
        throw new TypeError('Scalar values expected in function mean');
      }

      return _mean(args);
    }
  });

  mean.toTex = undefined; // use default template

  return mean;

  /**
   * Calculate the mean value in an n-dimensional array, returning a
   * n-1 dimensional array
   * @param {Array} array
   * @param {number} dim
   * @return {number} mean
   * @private
   */
  function _nmean(array, dim){
    var sum = reduce(array, dim, add);
    var s = Array.isArray(array) ? size(array) : array.size();
    return divide(sum, s[dim]);
  }

  /**
   * Recursively calculate the mean value in an n-dimensional array
   * @param {Array} array
   * @return {number} mean
   * @private
   */
  function _mean(array) {
    var sum = 0;
    var num = 0;

    deepForEach(array, function (value) {
      sum = add(sum, value);
      num++;
    });

    if (num === 0) {
      throw new Error('Cannot calculate mean of an empty array');
    }

    return divide(sum, num);
  }
}

exports.name = 'mean';
exports.factory = factory;

},{"../../utils/array":346,"../../utils/collection/containsCollections":351,"../../utils/collection/deepForEach":352,"../../utils/collection/reduce":355,"../arithmetic/add":242,"../arithmetic/divide":247}],293:[function(require,module,exports){
'use strict';

var deepForEach = require('../../utils/collection/deepForEach');
var reduce = require('../../utils/collection/reduce');
var containsCollections = require('../../utils/collection/containsCollections');

function factory (type, config, load, typed) {
  var smaller = load(require('../relational/smaller'));
  
  /**
   * Compute the maximum value of a matrix or a  list of values.
   * In case of a multi dimensional array, the maximum of the flattened array
   * will be calculated. When `dim` is provided, the maximum over the selected
   * dimension will be calculated. Parameter `dim` is zero-based.
   *
   * Syntax:
   *
   *     math.min(a, b, c, ...)
   *     math.min(A)
   *     math.min(A, dim)
   *
   * Examples:
   *
   *     math.min(2, 1, 4, 3);                  // returns 1
   *     math.min([2, 1, 4, 3]);                // returns 1
   *
   *     // maximum over a specified dimension (zero-based)
   *     math.min([[2, 5], [4, 3], [1, 7]], 0); // returns [1, 3]
   *     math.min([[2, 5], [4, 3], [1, 7]], 1); // returns [2, 3, 1]
   *
   *     math.max(2.7, 7.1, -4.5, 2.0, 4.1);    // returns 7.1
   *     math.min(2.7, 7.1, -4.5, 2.0, 4.1);    // returns -4.5
   *
   * See also:
   *
   *    mean, median, max, prod, std, sum, var
   *
   * @param {... *} args  A single matrix or or multiple scalar values
   * @return {*} The minimum value
   */
  var min = typed('min', {
    // min([a, b, c, d, ...])
    'Array | Matrix': _min,

    // min([a, b, c, d, ...], dim)
    'Array | Matrix, number | BigNumber': function (array, dim) {
      return reduce(array, dim.valueOf(), _smallest);
    },

    // min(a, b, c, d, ...)
    '...': function (args) {
      if (containsCollections(args)) {
        throw new TypeError('Scalar values expected in function min');
      }

      return _min(args);
    }
  });

  min.toTex = '\\min\\left(${args}\\right)';

  return min;

  /**
   * Return the smallest of two values
   * @param {*} x
   * @param {*} y
   * @returns {*} Returns x when x is smallest, or y when y is smallest
   * @private
   */
  function _smallest(x, y) {
    return smaller(x, y) ? x : y;
  }

  /**
   * Recursively calculate the minimum value in an n-dimensional array
   * @param {Array} array
   * @return {number} min
   * @private
   */
  function _min(array) {
    var min = undefined;

    deepForEach(array, function (value) {
      if (min === undefined || smaller(value, min)) {
        min = value;
      }
    });

    if (min === undefined) {
      throw new Error('Cannot calculate min of an empty array');
    }

    return min;
  }
}

exports.name = 'min';
exports.factory = factory;

},{"../../utils/collection/containsCollections":351,"../../utils/collection/deepForEach":352,"../../utils/collection/reduce":355,"../relational/smaller":290}],294:[function(require,module,exports){
'use strict';

var string = require('../../utils/string');

function factory (type, config, load, typed) {
  /**
   * Format a value of any type into a string.
   *
   * Syntax:
   *
   *    math.format(value)
   *    math.format(value, options)
   *    math.format(value, precision)
   *    math.format(value, callback)
   *
   * Where:
   *
   *  - `value: *`
   *    The value to be formatted
   *  - `options: Object`
   *    An object with formatting options. Available options:
   *    - `notation: string`
   *      Number notation. Choose from:
   *      - 'fixed'
   *        Always use regular number notation.
   *        For example '123.40' and '14000000'
   *      - 'exponential'
   *        Always use exponential notation.
   *        For example '1.234e+2' and '1.4e+7'
   *      - 'engineering'
   *        Always use engineering notation.
   *        For example '123.4e+0' and '14.0e+6'
   *      - 'auto' (default)
   *        Regular number notation for numbers having an absolute value between
   *        `lower` and `upper` bounds, and uses exponential notation elsewhere.
   *        Lower bound is included, upper bound is excluded.
   *        For example '123.4' and '1.4e7'.
   *    - `precision: number`
   *      A number between 0 and 16 to round the digits of the number. In case
   *      of notations 'exponential' and 'auto', `precision` defines the total
   *      number of significant digits returned and is undefined by default.
   *      In case of notation 'fixed', `precision` defines the number of
   *      significant digits after the decimal point, and is 0 by default.
   *    - `exponential: Object`
   *      An object containing two parameters, {number} lower and {number} upper,
   *      used by notation 'auto' to determine when to return exponential
   *      notation. Default values are `lower=1e-3` and `upper=1e5`. Only
   *      applicable for notation `auto`.
   *    - `fraction: string`. Available values: 'ratio' (default) or 'decimal'.
   *      For example `format(fraction(1, 3))` will output '1/3' when 'ratio' is
   *      configured, and will output `0.(3)` when 'decimal' is configured.
   * - `callback: function`
   *   A custom formatting function, invoked for all numeric elements in `value`,
   *   for example all elements of a matrix, or the real and imaginary
   *   parts of a complex number. This callback can be used to override the
   *   built-in numeric notation with any type of formatting. Function `callback`
   *   is called with `value` as parameter and must return a string.
   *
   * When `value` is an Object:
   *
   * - When the object contains a property `format` being a function, this function
   *   is invoked as `value.format(options)` and the result is returned.
   * - When the object has its own `toString` method, this method is invoked
   *   and the result is returned.
   * - In other cases the function will loop over all object properties and
   *   return JSON object notation like '{"a": 2, "b": 3}'.
   *
   * When value is a function:
   *
   * - When the function has a property `syntax`, it returns this
   *   syntax description.
   * - In other cases, a string `'function'` is returned.
   *
   * Examples:
   *
   *    math.format(6.4);                                        // returns '6.4'
   *    math.format(1240000);                                    // returns '1.24e6'
   *    math.format(1/3);                                        // returns '0.3333333333333333'
   *    math.format(1/3, 3);                                     // returns '0.333'
   *    math.format(21385, 2);                                   // returns '21000'
   *    math.format(12.071, {notation: 'fixed'});                // returns '12'
   *    math.format(2.3,    {notation: 'fixed', precision: 2});  // returns '2.30'
   *    math.format(52.8,   {notation: 'exponential'});          // returns '5.28e+1'
   *    math.format(12400,  {notation: 'engineering'});         // returns '12.400e+3'
   *
   *    function formatCurrency(value) {
   *      // return currency notation with two digits:
   *      return '$' + value.toFixed(2);
   *
   *      // you could also use math.format inside the callback:
   *      // return '$' + math.format(value, {notation: 'fixed', precision: 2});
   *    }
   *    math.format([2.1, 3, 0.016], formatCurrency};            // returns '[$2.10, $3.00, $0.02]'
   *
   * See also:
   *
   *    print
   *
   * @param {*} value                               Value to be stringified
   * @param {Object | Function | number} [options]  Formatting options
   * @return {string} The formatted value
   */
  var format = typed('format', {
    'any': string.format,
    'any, Object | function | number': string.format
  });

  format.toTex = undefined; // use default template

  return format;
}

exports.name = 'format';
exports.factory = factory;

},{"../../utils/string":363}],295:[function(require,module,exports){
'use strict';

var deepMap = require('../../utils/collection/deepMap');

function factory (type, config, load, typed) {

  /**
   * Calculate the inverse cosine of a value.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.acos(x)
   *
   * Examples:
   *
   *    math.acos(0.5);           // returns number 1.0471975511965979
   *    math.acos(math.cos(1.5)); // returns number 1.5
   *
   *    math.acos(2);             // returns Complex 0 + 1.3169578969248166 i
   *
   * See also:
   *
   *    cos, atan, asin
   *
   * @param {number | BigNumber | Complex | Array | Matrix} x  Function input
   * @return {number | BigNumber | Complex | Array | Matrix} The arc cosine of x
   */
  var acos = typed('acos', {
    'number': function (x) {
      if ((x >= -1 && x <= 1) || config.predictable) {
        return Math.acos(x);
      }
      else {
        return new type.Complex(x, 0).acos();
      }
    },

    'Complex': function (x) {
      return x.acos();
    },

    'BigNumber': function (x) {
      return x.acos();
    },

    'Array | Matrix': function (x) {
      return deepMap(x, acos);
    }
  });

  acos.toTex = {1: '\\cos^{-1}\\left(${args[0]}\\right)'};

  return acos;
}

exports.name = 'acos';
exports.factory = factory;

},{"../../utils/collection/deepMap":353}],296:[function(require,module,exports){
'use strict';

var deepMap = require('../../utils/collection/deepMap');

function factory (type, config, load, typed) {

  /**
   * Calculate the hyperbolic arccos of a value,
   * defined as `acosh(x) = ln(sqrt(x^2 - 1) + x)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.acosh(x)
   *
   * Examples:
   *
   *    math.acosh(1.5);       // returns 0.9624236501192069
   *
   * See also:
   *
   *    cosh, asinh, atanh
   *
   * @param {number | Complex | Unit | Array | Matrix} x  Function input
   * @return {number | Complex | Array | Matrix} Hyperbolic arccosine of x
   */
  var acosh = typed('acosh', {
    'number': function (x) {
      if (x >= 1 || config.predictable) {
        return _acosh(x);
      }
      if (x <= -1) {
        return new type.Complex(Math.log(Math.sqrt(x*x - 1) - x), Math.PI);
      }
      return new type.Complex(x, 0).acosh();
    },

    'Complex': function (x) {
      return x.acosh();
    },

    'BigNumber': function (x) {
      return x.acosh();
    },

    'Array | Matrix': function (x) {
      return deepMap(x, acosh);
    }
  });

  acosh.toTex = {1: '\\cosh^{-1}\\left(${args[0]}\\right)'};

  return acosh;
}

/**
 * Calculate the hyperbolic arccos of a number
 * @param {number} x
 * @return {number}
 * @private
 */
var _acosh = Math.acosh || function (x) {
  return Math.log(Math.sqrt(x*x - 1) + x)
};

exports.name = 'acosh';
exports.factory = factory;

},{"../../utils/collection/deepMap":353}],297:[function(require,module,exports){
'use strict';

var deepMap = require('../../utils/collection/deepMap');

function factory (type, config, load, typed) {

  /**
   * Calculate the inverse cotangent of a value, defined as `acot(x) = atan(1/x)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.acot(x)
   *
   * Examples:
   *
   *    math.acot(0.5);           // returns number 0.4636476090008061
   *    math.acot(math.cot(1.5)); // returns number 1.5
   *
   *    math.acot(2);             // returns Complex 1.5707963267948966 -1.3169578969248166 i
   *
   * See also:
   *
   *    cot, atan
   *
   * @param {number | Complex | Array | Matrix} x   Function input
   * @return {number | Complex | Array | Matrix} The arc cotangent of x
   */
  var acot = typed('acot', {
    'number': function (x) {
      return Math.atan(1 / x);
    },

    'Complex': function (x) {
      return x.acot();
    },

    'BigNumber': function (x) {
      return new type.BigNumber(1).div(x).atan();
    },

    'Array | Matrix': function (x) {
      return deepMap(x, acot);
    }
  });

  acot.toTex = {1: '\\cot^{-1}\\left(${args[0]}\\right)'};

  return acot;
}

exports.name = 'acot';
exports.factory = factory;

},{"../../utils/collection/deepMap":353}],298:[function(require,module,exports){
'use strict';

var deepMap = require('../../utils/collection/deepMap');

function factory (type, config, load, typed) {

  /**
   * Calculate the hyperbolic arccotangent of a value,
   * defined as `acoth(x) = atanh(1/x) = (ln((x+1)/x) + ln(x/(x-1))) / 2`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.acoth(x)
   *
   * Examples:
   *
   *    math.acoth(0.5);       // returns 0.8047189562170503
   *
   * See also:
   *
   *    acsch, asech
   *
   * @param {number | Complex | Array | Matrix} x  Function input
   * @return {number | Complex | Array | Matrix} Hyperbolic arccotangent of x
   */
  var acoth = typed('acoth', {
    'number': function (x) {
      if (x >= 1 || x <= -1 || config.predictable) {
        return isFinite(x) ? (Math.log((x+1)/x) + Math.log(x/(x-1))) / 2 : 0;
      }
      return new type.Complex(x, 0).acoth();
    },

    'Complex': function (x) {
      return x.acoth();
    },

    'BigNumber': function (x) {
      return new type.BigNumber(1).div(x).atanh();
    },

    'Array | Matrix': function (x) {
      return deepMap(x, acoth);
    }
  });

  acoth.toTex = {1: '\\coth^{-1}\\left(${args[0]}\\right)'};

  return acoth;
}

exports.name = 'acoth';
exports.factory = factory;

},{"../../utils/collection/deepMap":353}],299:[function(require,module,exports){
'use strict';

var deepMap = require('../../utils/collection/deepMap');


function factory (type, config, load, typed) {

  /**
   * Calculate the inverse cosecant of a value, defined as `acsc(x) = asin(1/x)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.acsc(x)
   *
   * Examples:
   *
   *    math.acsc(0.5);           // returns number 0.5235987755982989
   *    math.acsc(math.csc(1.5)); // returns number ~1.5
   *
   *    math.acsc(2);             // returns Complex 1.5707963267948966 -1.3169578969248166 i
   *
   * See also:
   *
   *    csc, asin, asec
   *
   * @param {number | Complex | Array | Matrix} x   Function input
   * @return {number | Complex | Array | Matrix} The arc cosecant of x
   */
  var acsc = typed('acsc', {
    'number': function (x) {
      if (x <= -1 || x >= 1 || config.predictable) {
        return Math.asin(1 / x);
      }
      return new type.Complex(x, 0).acsc();
    },

    'Complex': function (x) {
      return x.acsc();
    },

    'BigNumber': function (x) {
      return new type.BigNumber(1).div(x).asin();
    },

    'Array | Matrix': function (x) {
      return deepMap(x, acsc);
    }
  });

  acsc.toTex = {1: '\\csc^{-1}\\left(${args[0]}\\right)'};

  return acsc;
}

exports.name = 'acsc';
exports.factory = factory;

},{"../../utils/collection/deepMap":353}],300:[function(require,module,exports){
'use strict';

var deepMap = require('../../utils/collection/deepMap');

function factory (type, config, load, typed) {

  /**
   * Calculate the hyperbolic arccosecant of a value,
   * defined as `acsch(x) = asinh(1/x) = ln(1/x + sqrt(1/x^2 + 1))`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.acsch(x)
   *
   * Examples:
   *
   *    math.acsch(0.5);       // returns 1.4436354751788103
   *
   * See also:
   *
   *    asech, acoth
   *
   * @param {number | Complex | Array | Matrix} x  Function input
   * @return {number | Complex | Array | Matrix} Hyperbolic arccosecant of x
   */
  var acsch = typed('acsch', {
    'number': function (x) {
      x = 1 / x;
      return Math.log(x + Math.sqrt(x*x + 1));
    },

    'Complex': function (x) {
      return x.acsch();
    },

    'BigNumber': function (x) {
      return new type.BigNumber(1).div(x).asinh();
    },

    'Array | Matrix': function (x) {
      return deepMap(x, acsch);
    }
  });

  acsch.toTex = {1: '\\mathrm{csch}^{-1}\\left(${args[0]}\\right)'};

  return acsch;
}

exports.name = 'acsch';
exports.factory = factory;

},{"../../utils/collection/deepMap":353}],301:[function(require,module,exports){
'use strict';

var deepMap = require('../../utils/collection/deepMap');

function factory (type, config, load, typed) {

  /**
   * Calculate the inverse secant of a value. Defined as `asec(x) = acos(1/x)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.asec(x)
   *
   * Examples:
   *
   *    math.asec(0.5);           // returns 1.0471975511965979
   *    math.asec(math.sec(1.5)); // returns 1.5
   *
   *    math.asec(2);             // returns 0 + 1.3169578969248166 i
   *
   * See also:
   *
   *    acos, acot, acsc
   *
   * @param {number | Complex | Array | Matrix} x  Function input
   * @return {number | Complex | Array | Matrix} The arc secant of x
   */
  var asec = typed('asec', {
    'number': function (x) {
      if (x <= -1 || x >= 1 || config.predictable) {
        return Math.acos(1 / x);
      }
      return new type.Complex(x, 0).asec();
    },

    'Complex': function (x) {
      return x.asec();
    },

    'BigNumber': function (x) {
      return new type.BigNumber(1).div(x).acos();
    },

    'Array | Matrix': function (x) {
      return deepMap(x, asec);
    }
  });

  asec.toTex = {1: '\\sec^{-1}\\left(${args[0]}\\right)'};

  return asec;
}

exports.name = 'asec';
exports.factory = factory;

},{"../../utils/collection/deepMap":353}],302:[function(require,module,exports){
'use strict';

var deepMap = require('../../utils/collection/deepMap');

function factory (type, config, load, typed) {
  var acosh = typed.find(load(require('./acosh')), ['Complex']);

  /**
   * Calculate the hyperbolic arcsecant of a value,
   * defined as `asech(x) = acosh(1/x) = ln(sqrt(1/x^2 - 1) + 1/x)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.asech(x)
   *
   * Examples:
   *
   *    math.asech(0.5);       // returns 1.3169578969248166
   *
   * See also:
   *
   *    acsch, acoth
   *
   * @param {number | Complex | Array | Matrix} x  Function input
   * @return {number | Complex | Array | Matrix} Hyperbolic arcsecant of x
   */
  var asech = typed('asech', {
    'number': function (x) {
      if ((x <= 1 && x >= -1) || config.predictable) {
        x = 1 / x;

        var ret = Math.sqrt(x*x - 1);
        if (x > 0 || config.predictable) {
          return Math.log(ret + x);
        }

        return new type.Complex(Math.log(ret - x), Math.PI);
      }

      return new type.Complex(x, 0).asech();
    },

    'Complex': function (x) {
      return x.asech()
    },

    'BigNumber': function (x) {
      return new type.BigNumber(1).div(x).acosh();
    },

    'Array | Matrix': function (x) {
      return deepMap(x, asech);
    }
  });

  asech.toTex = {1: '\\mathrm{sech}^{-1}\\left(${args[0]}\\right)'};

  return asech;
}

exports.name = 'asech';
exports.factory = factory;

},{"../../utils/collection/deepMap":353,"./acosh":296}],303:[function(require,module,exports){
'use strict';

var deepMap = require('../../utils/collection/deepMap');

function factory (type, config, load, typed) {

  /**
   * Calculate the inverse sine of a value.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.asin(x)
   *
   * Examples:
   *
   *    math.asin(0.5);           // returns number 0.5235987755982989
   *    math.asin(math.sin(1.5)); // returns number ~1.5
   *
   *    math.asin(2);             // returns Complex 1.5707963267948966 -1.3169578969248166 i
   *
   * See also:
   *
   *    sin, atan, acos
   *
   * @param {number | BigNumber | Complex | Array | Matrix} x   Function input
   * @return {number | BigNumber | Complex | Array | Matrix} The arc sine of x
   */
  var asin = typed('asin', {
    'number': function (x) {
      if ((x >= -1 && x <= 1) || config.predictable) {
        return Math.asin(x);
      }
      else {
        return new type.Complex(x, 0).asin();
      }
    },

    'Complex': function (x) {
      return x.asin();
    },

    'BigNumber': function (x) {
      return x.asin();
    },

    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since asin(0) = 0
      return deepMap(x, asin, true);
    }
  });

  asin.toTex = {1: '\\sin^{-1}\\left(${args[0]}\\right)'};

  return asin;
}

exports.name = 'asin';
exports.factory = factory;

},{"../../utils/collection/deepMap":353}],304:[function(require,module,exports){
'use strict';

var deepMap = require('../../utils/collection/deepMap');

function factory (type, config, load, typed) {

  /**
   * Calculate the hyperbolic arcsine of a value,
   * defined as `asinh(x) = ln(x + sqrt(x^2 + 1))`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.asinh(x)
   *
   * Examples:
   *
   *    math.asinh(0.5);       // returns 0.48121182505960347
   *
   * See also:
   *
   *    acosh, atanh
   *
   * @param {number | Complex | Array | Matrix} x  Function input
   * @return {number | Complex | Array | Matrix} Hyperbolic arcsine of x
   */
  var asinh = typed('asinh', {
    'number': Math.asinh || function (x) {
      return Math.log(Math.sqrt(x*x + 1) + x);
    },

    'Complex': function (x) {
        return x.asinh();
    },

    'BigNumber': function (x) {
      return x.asinh();
    },

    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since asinh(0) = 0
      return deepMap(x, asinh, true);
    }
  });

  asinh.toTex = {1: '\\sinh^{-1}\\left(${args[0]}\\right)'};

  return asinh;
}

exports.name = 'asinh';
exports.factory = factory;

},{"../../utils/collection/deepMap":353}],305:[function(require,module,exports){
'use strict';

var deepMap = require('../../utils/collection/deepMap');

function factory (type, config, load, typed) {

  /**
   * Calculate the inverse tangent of a value.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.atan(x)
   *
   * Examples:
   *
   *    math.atan(0.5);           // returns number 0.4636476090008061
   *    math.atan(math.tan(1.5)); // returns number 1.5
   *
   *    math.atan(2);             // returns Complex 1.5707963267948966 -1.3169578969248166 i
   *
   * See also:
   *
   *    tan, asin, acos
   *
   * @param {number | BigNumber | Complex | Array | Matrix} x   Function input
   * @return {number | BigNumber | Complex | Array | Matrix} The arc tangent of x
   */
  var atan = typed('atan', {
    'number': function (x) {
      return Math.atan(x);
    },

    'Complex': function (x) {
      return x.atan();
    },

    'BigNumber': function (x) {
      return x.atan();
    },

    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since atan(0) = 0
      return deepMap(x, atan, true);
    }
  });

  atan.toTex = {1: '\\tan^{-1}\\left(${args[0]}\\right)'};

  return atan;
}

exports.name = 'atan';
exports.factory = factory;

},{"../../utils/collection/deepMap":353}],306:[function(require,module,exports){
'use strict';

function factory (type, config, load, typed) {

  var matrix = load(require('../../type/matrix/function/matrix'));

  var algorithm02 = load(require('../../type/matrix/utils/algorithm02'));
  var algorithm03 = load(require('../../type/matrix/utils/algorithm03'));
  var algorithm09 = load(require('../../type/matrix/utils/algorithm09'));
  var algorithm11 = load(require('../../type/matrix/utils/algorithm11'));
  var algorithm12 = load(require('../../type/matrix/utils/algorithm12'));
  var algorithm13 = load(require('../../type/matrix/utils/algorithm13'));
  var algorithm14 = load(require('../../type/matrix/utils/algorithm14'));

  /**
   * Calculate the inverse tangent function with two arguments, y/x.
   * By providing two arguments, the right quadrant of the computed angle can be
   * determined.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.atan2(y, x)
   *
   * Examples:
   *
   *    math.atan2(2, 2) / math.pi;       // returns number 0.25
   *
   *    var angle = math.unit(60, 'deg'); // returns Unit 60 deg
   *    var x = math.cos(angle);
   *    var y = math.sin(angle);
   *
   *    math.atan(2);             // returns Complex 1.5707963267948966 -1.3169578969248166 i
   *
   * See also:
   *
   *    tan, atan, sin, cos
   *
   * @param {number | Array | Matrix} y  Second dimension
   * @param {number | Array | Matrix} x  First dimension
   * @return {number | Array | Matrix} Four-quadrant inverse tangent
   */
  var atan2 = typed('atan2', {

    'number, number': Math.atan2,

    // Complex numbers doesn't seem to have a reasonable implementation of
    // atan2(). Even Matlab removed the support, after they only calculated
    // the atan only on base of the real part of the numbers and ignored the imaginary.

    'BigNumber, BigNumber': function (y, x) {
      return type.BigNumber.atan2(y, x);
    },

    'Matrix, Matrix': function (x, y) {
      // result
      var c;

      // process matrix storage
      switch (x.storage()) {
        case 'sparse':
          switch (y.storage()) {
            case 'sparse':
              // sparse .* sparse
              c = algorithm09(x, y, atan2, false);
              break;
            default:
              // sparse .* dense
              c = algorithm02(y, x, atan2, true);
              break;
          }
          break;
        default:
          switch (y.storage()) {
            case 'sparse':
              // dense .* sparse
              c = algorithm03(x, y, atan2, false);
              break;
            default:
              // dense .* dense
              c = algorithm13(x, y, atan2);
              break;
          }
          break;
      }
      return c;
    },

    'Array, Array': function (x, y) {
      // use matrix implementation
      return atan2(matrix(x), matrix(y)).valueOf();
    },

    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return atan2(matrix(x), y);
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return atan2(x, matrix(y));
    },

    'Matrix, number | BigNumber': function (x, y) {
      // result
      var c;
      // check storage format
      switch (x.storage()) {
        case 'sparse':
          c = algorithm11(x, y, atan2, false);
          break;
        default:
          c = algorithm14(x, y, atan2, false);
          break;
      }
      return c;
    },

    'number | BigNumber, Matrix': function (x, y) {
      // result
      var c;
      // check storage format
      switch (y.storage()) {
        case 'sparse':
          c = algorithm12(y, x, atan2, true);
          break;
        default:
          c = algorithm14(y, x, atan2, true);
          break;
      }
      return c;
    },

    'Array, number | BigNumber': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, atan2, false).valueOf();
    },

    'number | BigNumber, Array': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, atan2, true).valueOf();
    }
  });

  atan2.toTex = {2: '\\mathrm{atan2}\\left(${args}\\right)'};

  return atan2;
}

exports.name = 'atan2';
exports.factory = factory;

},{"../../type/matrix/function/matrix":328,"../../type/matrix/utils/algorithm02":330,"../../type/matrix/utils/algorithm03":331,"../../type/matrix/utils/algorithm09":336,"../../type/matrix/utils/algorithm11":338,"../../type/matrix/utils/algorithm12":339,"../../type/matrix/utils/algorithm13":340,"../../type/matrix/utils/algorithm14":341}],307:[function(require,module,exports){
'use strict';

var deepMap = require('../../utils/collection/deepMap');

function factory (type, config, load, typed) {
  /**
   * Calculate the hyperbolic arctangent of a value,
   * defined as `atanh(x) = ln((1 + x)/(1 - x)) / 2`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.atanh(x)
   *
   * Examples:
   *
   *    math.atanh(0.5);       // returns 0.5493061443340549
   *
   * See also:
   *
   *    acosh, asinh
   *
   * @param {number | Complex | Array | Matrix} x  Function input
   * @return {number | Complex | Array | Matrix} Hyperbolic arctangent of x
   */
  var atanh = typed('atanh', {
    'number': function (x) {
      if ((x <= 1 && x >= -1) || config.predictable) {
        return _atanh(x);
      }
      return new type.Complex(x, 0).atanh();
    },

    'Complex': function (x) {
      return x.atanh();
    },

    'BigNumber': function (x) {
      return x.atanh();
    },

    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since atanh(0) = 0
      return deepMap(x, atanh, true);
    }
  });

  atanh.toTex = {1: '\\tanh^{-1}\\left(${args[0]}\\right)'};

  return atanh;
}

/**
 * Calculate the hyperbolic arctangent of a number
 * @param {number} x
 * @return {number}
 * @private
 */
var _atanh = Math.atanh || function (x) {
  return Math.log((1 + x)/(1 - x)) / 2
};

exports.name = 'atanh';
exports.factory = factory;

},{"../../utils/collection/deepMap":353}],308:[function(require,module,exports){
'use strict';

var deepMap = require('../../utils/collection/deepMap');

function factory (type, config, load, typed) {

  /**
   * Calculate the cosine of a value.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.cos(x)
   *
   * Examples:
   *
   *    math.cos(2);                      // returns number -0.4161468365471422
   *    math.cos(math.pi / 4);            // returns number  0.7071067811865475
   *    math.cos(math.unit(180, 'deg'));  // returns number -1
   *    math.cos(math.unit(60, 'deg'));   // returns number  0.5
   *
   *    var angle = 0.2;
   *    math.pow(math.sin(angle), 2) + math.pow(math.cos(angle), 2); // returns number ~1
   *
   * See also:
   *
   *    cos, tan
   *
   * @param {number | BigNumber | Complex | Unit | Array | Matrix} x  Function input
   * @return {number | BigNumber | Complex | Array | Matrix} Cosine of x
   */
  var cos = typed('cos', {
    'number': Math.cos,

    'Complex': function (x) {
      return x.cos();
    },

    'BigNumber': function (x) {
      return x.cos();
    },

    'Unit': function (x) {
      if (!x.hasBase(type.Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError ('Unit in function cos is no angle');
      }
      return cos(x.value);
    },

    'Array | Matrix': function (x) {
      return deepMap(x, cos);
    }
  });

  cos.toTex = {1: '\\cos\\left(${args[0]}\\right)'};

  return cos;
}

exports.name = 'cos';
exports.factory = factory;

},{"../../utils/collection/deepMap":353}],309:[function(require,module,exports){
'use strict';

var deepMap = require('../../utils/collection/deepMap');

function factory (type, config, load, typed) {
  /**
   * Calculate the hyperbolic cosine of a value,
   * defined as `cosh(x) = 1/2 * (exp(x) + exp(-x))`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.cosh(x)
   *
   * Examples:
   *
   *    math.cosh(0.5);       // returns number 1.1276259652063807
   *
   * See also:
   *
   *    sinh, tanh
   *
   * @param {number | BigNumber | Complex | Unit | Array | Matrix} x  Function input
   * @return {number | BigNumber | Complex | Array | Matrix} Hyperbolic cosine of x
   */
  var cosh = typed('cosh', {
    'number': _cosh,

    'Complex': function (x) {
      return x.cosh();
    },

    'BigNumber': function (x) {
      return x.cosh();
    },

    'Unit': function (x) {
      if (!x.hasBase(type.Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError ('Unit in function cosh is no angle');
      }
      return cosh(x.value);
    },

    'Array | Matrix': function (x) {
      return deepMap(x, cosh);
    }
  });

  cosh.toTex = {1: '\\cosh\\left(${args[0]}\\right)'};

  return cosh;
}

/**
 * Calculate the hyperbolic cosine of a number
 * @param {number} x
 * @returns {number}
 * @private
 */
var _cosh = Math.cosh || function (x) {
  return (Math.exp(x) + Math.exp(-x)) / 2;
};

exports.name = 'cosh';
exports.factory = factory;

},{"../../utils/collection/deepMap":353}],310:[function(require,module,exports){
'use strict';

var deepMap = require('../../utils/collection/deepMap');

function factory (type, config, load, typed) {
  /**
   * Calculate the cotangent of a value. Defined as `cot(x) = 1 / tan(x)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.cot(x)
   *
   * Examples:
   *
   *    math.cot(2);      // returns number -0.45765755436028577
   *    1 / math.tan(2);  // returns number -0.45765755436028577
   *
   * See also:
   *
   *    tan, sec, csc
   *
   * @param {number | Complex | Unit | Array | Matrix} x  Function input
   * @return {number | Complex | Array | Matrix} Cotangent of x
   */
  var cot = typed('cot', {
    'number': function (x) {
      return 1 / Math.tan(x);
    },

    'Complex': function (x) {
      return x.cot();
    },

    'BigNumber': function (x) {
      return new type.BigNumber(1).div(x.tan());
    },

    'Unit': function (x) {
      if (!x.hasBase(type.Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError ('Unit in function cot is no angle');
      }
      return cot(x.value);
    },

    'Array | Matrix': function (x) {
      return deepMap(x, cot);
    }
  });

  cot.toTex = {1: '\\cot\\left(${args[0]}\\right)'};

  return cot;
}

exports.name = 'cot';
exports.factory = factory;

},{"../../utils/collection/deepMap":353}],311:[function(require,module,exports){
'use strict';

var deepMap = require('../../utils/collection/deepMap');

function factory (type, config, load, typed) {
  /**
   * Calculate the hyperbolic cotangent of a value,
   * defined as `coth(x) = 1 / tanh(x)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.coth(x)
   *
   * Examples:
   *
   *    // coth(x) = 1 / tanh(x)
   *    math.coth(2);         // returns 1.0373147207275482
   *    1 / math.tanh(2);     // returns 1.0373147207275482
   *
   * See also:
   *
   *    sinh, tanh, cosh
   *
   * @param {number | Complex | Unit | Array | Matrix} x  Function input
   * @return {number | Complex | Array | Matrix} Hyperbolic cotangent of x
   */
  var coth = typed('coth', {
    'number': _coth,

    'Complex': function (x) {
      return x.coth();
    },

    'BigNumber': function (x) {
      return new type.BigNumber(1).div(x.tanh());
    },

    'Unit': function (x) {
      if (!x.hasBase(type.Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError ('Unit in function coth is no angle');
      }
      return coth(x.value);
    },

    'Array | Matrix': function (x) {
      return deepMap(x, coth);
    }
  });

  coth.toTex = {1: '\\coth\\left(${args[0]}\\right)'};

  return coth;
}

/**
 * Calculate the hyperbolic cosine of a number
 * @param {number} x
 * @returns {number}
 * @private
 */
function _coth(x) {
  var e = Math.exp(2 * x);
  return (e + 1) / (e - 1);
}

exports.name = 'coth';
exports.factory = factory;

},{"../../utils/collection/deepMap":353}],312:[function(require,module,exports){
'use strict';

var deepMap = require('../../utils/collection/deepMap');

function factory (type, config, load, typed) {
  /**
   * Calculate the cosecant of a value, defined as `csc(x) = 1/sin(x)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.csc(x)
   *
   * Examples:
   *
   *    math.csc(2);      // returns number 1.099750170294617
   *    1 / math.sin(2);  // returns number 1.099750170294617
   *
   * See also:
   *
   *    sin, sec, cot
   *
   * @param {number | Complex | Unit | Array | Matrix} x  Function input
   * @return {number | Complex | Array | Matrix} Cosecant of x
   */
  var csc = typed('csc', {
    'number': function (x) {
      return 1 / Math.sin(x);
    },

    'Complex': function (x) {
      return x.csc();
    },

    'BigNumber': function (x) {
      return new type.BigNumber(1).div(x.sin());
    },

    'Unit': function (x) {
      if (!x.hasBase(type.Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError ('Unit in function csc is no angle');
      }
      return csc(x.value);
    },

    'Array | Matrix': function (x) {
      return deepMap(x, csc);
    }
  });

  csc.toTex = {1: '\\csc\\left(${args[0]}\\right)'};

  return csc;
}

exports.name = 'csc';
exports.factory = factory;

},{"../../utils/collection/deepMap":353}],313:[function(require,module,exports){
'use strict';

var deepMap = require('../../utils/collection/deepMap');
var sign = require('../../utils/number').sign;

function factory (type, config, load, typed) {
  /**
   * Calculate the hyperbolic cosecant of a value,
   * defined as `csch(x) = 1 / sinh(x)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.csch(x)
   *
   * Examples:
   *
   *    // csch(x) = 1/ sinh(x)
   *    math.csch(0.5);       // returns 1.9190347513349437
   *    1 / math.sinh(0.5);   // returns 1.9190347513349437
   *
   * See also:
   *
   *    sinh, sech, coth
   *
   * @param {number | Complex | Unit | Array | Matrix} x  Function input
   * @return {number | Complex | Array | Matrix} Hyperbolic cosecant of x
   */
  var csch = typed('csch', {
    'number': _csch,

    'Complex': function (x) {
      return x.csch();
    },

    'BigNumber': function (x) {
      return new type.BigNumber(1).div(x.sinh());
    },

    'Unit': function (x) {
      if (!x.hasBase(type.Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError ('Unit in function csch is no angle');
      }
      return csch(x.value);
    },

    'Array | Matrix': function (x) {
      return deepMap(x, csch);
    }
  });

  csch.toTex = {1: '\\mathrm{csch}\\left(${args[0]}\\right)'};

  return csch;
}

/**
 * Calculate the hyperbolic cosecant of a number
 * @param {number} x
 * @returns {number}
 * @private
 */
function _csch(x) {
  // consider values close to zero (+/-)
  if (x == 0) {
    return Number.POSITIVE_INFINITY;
  }
  else {
    return Math.abs(2 / (Math.exp(x) - Math.exp(-x))) * sign(x);
  }
}

exports.name = 'csch';
exports.factory = factory;

},{"../../utils/collection/deepMap":353,"../../utils/number":361}],314:[function(require,module,exports){
module.exports = [
  require('./acos'),
  require('./acosh'),
  require('./acot'),
  require('./acoth'),
  require('./acsc'),
  require('./acsch'),
  require('./asec'),
  require('./asech'),
  require('./asin'),
  require('./asinh'),
  require('./atan'),
  require('./atan2'),
  require('./atanh'),
  require('./cos'),
  require('./cosh'),
  require('./cot'),
  require('./coth'),
  require('./csc'),
  require('./csch'),
  require('./sec'),
  require('./sech'),
  require('./sin'),
  require('./sinh'),
  require('./tan'),
  require('./tanh')
];

},{"./acos":295,"./acosh":296,"./acot":297,"./acoth":298,"./acsc":299,"./acsch":300,"./asec":301,"./asech":302,"./asin":303,"./asinh":304,"./atan":305,"./atan2":306,"./atanh":307,"./cos":308,"./cosh":309,"./cot":310,"./coth":311,"./csc":312,"./csch":313,"./sec":315,"./sech":316,"./sin":317,"./sinh":318,"./tan":319,"./tanh":320}],315:[function(require,module,exports){
'use strict';

var deepMap = require('../../utils/collection/deepMap');

function factory (type, config, load, typed) {
  /**
   * Calculate the secant of a value, defined as `sec(x) = 1/cos(x)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.sec(x)
   *
   * Examples:
   *
   *    math.sec(2);      // returns number -2.4029979617223822
   *    1 / math.cos(2);  // returns number -2.4029979617223822
   *
   * See also:
   *
   *    cos, csc, cot
   *
   * @param {number | Complex | Unit | Array | Matrix} x  Function input
   * @return {number | Complex | Array | Matrix} Secant of x
   */
  var sec = typed('sec', {
    'number': function (x) {
      return 1 / Math.cos(x);
    },

    'Complex': function (x) {
      return x.sec();
    },

    'BigNumber': function (x) {
      return new type.BigNumber(1).div(x.cos());
    },

    'Unit': function (x) {
      if (!x.hasBase(type.Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError ('Unit in function sec is no angle');
      }
      return sec(x.value);
    },

    'Array | Matrix': function (x) {
      return deepMap(x, sec);
    }
  });

  sec.toTex = {1: '\\sec\\left(${args[0]}\\right)'};

  return sec;
}

exports.name = 'sec';
exports.factory = factory;

},{"../../utils/collection/deepMap":353}],316:[function(require,module,exports){
'use strict';

var deepMap = require('../../utils/collection/deepMap');

function factory (type, config, load, typed) {
  /**
   * Calculate the hyperbolic secant of a value,
   * defined as `sech(x) = 1 / cosh(x)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.sech(x)
   *
   * Examples:
   *
   *    // sech(x) = 1/ cosh(x)
   *    math.sech(0.5);       // returns 0.886818883970074
   *    1 / math.cosh(0.5);   // returns 0.886818883970074
   *
   * See also:
   *
   *    cosh, csch, coth
   *
   * @param {number | Complex | Unit | Array | Matrix} x  Function input
   * @return {number | Complex | Array | Matrix} Hyperbolic secant of x
   */
  var sech = typed('sech', {
    'number': _sech,

    'Complex': function (x) {
      return x.sech();
    },

    'BigNumber': function (x) {
      return new type.BigNumber(1).div(x.cosh());
    },

    'Unit': function (x) {
      if (!x.hasBase(type.Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError ('Unit in function sech is no angle');
      }
      return sech(x.value);
    },

    'Array | Matrix': function (x) {
      return deepMap(x, sech);
    }
  });

  sech.toTex = {1: '\\mathrm{sech}\\left(${args[0]}\\right)'};

  return sech;
}

/**
 * Calculate the hyperbolic secant of a number
 * @param {number} x
 * @returns {number}
 * @private
 */
function _sech(x) {
  return 2 / (Math.exp(x) + Math.exp(-x));
}

exports.name = 'sech';
exports.factory = factory;

},{"../../utils/collection/deepMap":353}],317:[function(require,module,exports){
'use strict';

var deepMap = require('../../utils/collection/deepMap');

function factory (type, config, load, typed) {

  /**
   * Calculate the sine of a value.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.sin(x)
   *
   * Examples:
   *
   *    math.sin(2);                      // returns number 0.9092974268256813
   *    math.sin(math.pi / 4);            // returns number 0.7071067811865475
   *    math.sin(math.unit(90, 'deg'));   // returns number 1
   *    math.sin(math.unit(30, 'deg'));   // returns number 0.5
   *
   *    var angle = 0.2;
   *    math.pow(math.sin(angle), 2) + math.pow(math.cos(angle), 2); // returns number ~1
   *
   * See also:
   *
   *    cos, tan
   *
   * @param {number | BigNumber | Complex | Unit | Array | Matrix} x  Function input
   * @return {number | BigNumber | Complex | Array | Matrix} Sine of x
   */
  var sin = typed('sin', {
    'number': Math.sin,

    'Complex': function (x) {
      return x.sin();
    },

    'BigNumber': function (x) {
      return x.sin();
    },

    'Unit': function (x) {
      if (!x.hasBase(type.Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError ('Unit in function sin is no angle');
      }
      return sin(x.value);
    },

    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since sin(0) = 0
      return deepMap(x, sin, true);
    }
  });

  sin.toTex = {1: '\\sin\\left(${args[0]}\\right)'};

  return sin;
}

exports.name = 'sin';
exports.factory = factory;

},{"../../utils/collection/deepMap":353}],318:[function(require,module,exports){
'use strict';

var deepMap = require('../../utils/collection/deepMap');

function factory (type, config, load, typed) {
  /**
   * Calculate the hyperbolic sine of a value,
   * defined as `sinh(x) = 1/2 * (exp(x) - exp(-x))`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.sinh(x)
   *
   * Examples:
   *
   *    math.sinh(0.5);       // returns number 0.5210953054937474
   *
   * See also:
   *
   *    cosh, tanh
   *
   * @param {number | BigNumber | Complex | Unit | Array | Matrix} x  Function input
   * @return {number | BigNumber | Complex | Array | Matrix} Hyperbolic sine of x
   */
  var sinh = typed('sinh', {
    'number': _sinh,

    'Complex': function (x) {
      return x.sinh();
    },

    'BigNumber': function (x) {
      return x.sinh();
    },

    'Unit': function (x) {
      if (!x.hasBase(type.Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError ('Unit in function sinh is no angle');
      }
      return sinh(x.value);
    },

    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since sinh(0) = 0
      return deepMap(x, sinh, true);
    }
  });

  sinh.toTex = {1: '\\sinh\\left(${args[0]}\\right)'};

  return sinh;
}

/**
 * Calculate the hyperbolic sine of a number
 * @param {number} x
 * @returns {number}
 * @private
 */
var _sinh = Math.sinh || function (x) {
  return (Math.exp(x) - Math.exp(-x)) / 2;
};

exports.name = 'sinh';
exports.factory = factory;

},{"../../utils/collection/deepMap":353}],319:[function(require,module,exports){
'use strict';

var deepMap = require('../../utils/collection/deepMap');

function factory (type, config, load, typed) {
  /**
   * Calculate the tangent of a value. `tan(x)` is equal to `sin(x) / cos(x)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.tan(x)
   *
   * Examples:
   *
   *    math.tan(0.5);                    // returns number 0.5463024898437905
   *    math.sin(0.5) / math.cos(0.5);    // returns number 0.5463024898437905
   *    math.tan(math.pi / 4);            // returns number 1
   *    math.tan(math.unit(45, 'deg'));   // returns number 1
   *
   * See also:
   *
   *    atan, sin, cos
   *
   * @param {number | BigNumber | Complex | Unit | Array | Matrix} x  Function input
   * @return {number | BigNumber | Complex | Array | Matrix} Tangent of x
   */
  var tan = typed('tan', {
    'number': Math.tan,

    'Complex': function (x) {
        return x.tan();
    },

    'BigNumber': function (x) {
      return x.tan();
    },

    'Unit': function (x) {
      if (!x.hasBase(type.Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError ('Unit in function tan is no angle');
      }
      return tan(x.value);
    },

    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since tan(0) = 0
      return deepMap(x, tan, true);
    }
  });

  tan.toTex = {1: '\\tan\\left(${args[0]}\\right)'};

  return tan;
}

exports.name = 'tan';
exports.factory = factory;

},{"../../utils/collection/deepMap":353}],320:[function(require,module,exports){
'use strict';

var deepMap = require('../../utils/collection/deepMap');

function factory (type, config, load, typed) {
  /**
   * Calculate the hyperbolic tangent of a value,
   * defined as `tanh(x) = (exp(2 * x) - 1) / (exp(2 * x) + 1)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.tanh(x)
   *
   * Examples:
   *
   *    // tanh(x) = sinh(x) / cosh(x) = 1 / coth(x)
   *    math.tanh(0.5);                   // returns 0.46211715726000974
   *    math.sinh(0.5) / math.cosh(0.5);  // returns 0.46211715726000974
   *    1 / math.coth(0.5);               // returns 0.46211715726000974
   *
   * See also:
   *
   *    sinh, cosh, coth
   *
   * @param {number | BigNumber | Complex | Unit | Array | Matrix} x  Function input
   * @return {number | BigNumber | Complex | Array | Matrix} Hyperbolic tangent of x
   */
  var tanh = typed('tanh', {
    'number': _tanh,

    'Complex': function (x) {
        return x.tanh();
    },

    'BigNumber': function (x) {
      return x.tanh();
    },

    'Unit': function (x) {
      if (!x.hasBase(type.Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError ('Unit in function tanh is no angle');
      }
      return tanh(x.value);
    },

    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since tanh(0) = 0
      return deepMap(x, tanh, true);
    }
  });

  tanh.toTex = {1: '\\tanh\\left(${args[0]}\\right)'};

  return tanh;
}

/**
 * Calculate the hyperbolic tangent of a number
 * @param {number} x
 * @returns {number}
 * @private
 */
var _tanh = Math.tanh || function (x) {
  var e = Math.exp(2 * x);
  return (e - 1) / (e + 1);
};

exports.name = 'tanh';
exports.factory = factory;

},{"../../utils/collection/deepMap":353}],321:[function(require,module,exports){
'use strict';

var deepMap = require('../../utils/collection/deepMap');
var number = require('../../utils/number');

function factory (type, config, load, typed) {
  /**
   * Test whether a value is negative: smaller than zero.
   * The function supports types `number`, `BigNumber`, `Fraction`, and `Unit`.
   *
   * The function is evaluated element-wise in case of Array or Matrix input.
   *
   * Syntax:
   *
   *     math.isNegative(x)
   *
   * Examples:
   *
   *    math.isNegative(3);                     // returns false
   *    math.isNegative(-2);                    // returns true
   *    math.isNegative(0);                     // returns false
   *    math.isNegative(-0);                    // returns false
   *    math.isNegative(math.bignumber(2));     // returns false
   *    math.isNegative(math.fraction(-2, 5));  // returns true
   *    math.isNegative('-2');                  // returns true
   *    math.isNegative([2, 0, -3]');           // returns [false, false, true]
   *
   * See also:
   *
   *    isNumeric, isPositive, isZero, isInteger
   *
   * @param {number | BigNumber | Fraction | Unit | Array | Matrix} x  Value to be tested
   * @return {boolean}  Returns true when `x` is larger than zero.
   *                    Throws an error in case of an unknown data type.
   */
  var isNegative = typed('isNegative', {
    'number': function (x) {
      return x < 0;
    },

    'BigNumber': function (x) {
      return x.isNeg() && !x.isZero() && !x.isNaN();
    },

    'Fraction': function (x) {
      return x.s < 0; // It's enough to decide on the sign
    },

    'Unit': function (x) {
      return isNegative(x.value);
    },

    'Array | Matrix': function (x) {
      return deepMap(x, isNegative);
    }
  });

  return isNegative;
}

exports.name = 'isNegative';
exports.factory = factory;

},{"../../utils/collection/deepMap":353,"../../utils/number":361}],322:[function(require,module,exports){
'use strict';

var deepMap = require('../../utils/collection/deepMap');
var number = require('../../utils/number');

function factory (type, config, load, typed) {
  /**
   * Test whether a value is an numeric value.
   *
   * The function is evaluated element-wise in case of Array or Matrix input.
   *
   * Syntax:
   *
   *     math.isNumeric(x)
   *
   * Examples:
   *
   *    math.isNumeric(2);                     // returns true
   *    math.isNumeric(0);                     // returns true
   *    math.isNumeric(math.bignumber(500));   // returns true
   *    math.isNumeric(math.fraction(4));      // returns true
   *    math.isNumeric(math.complex('2-4i');   // returns false
   *    math.isNumeric('3');                   // returns false
   *    math.isNumeric([2.3, 'foo', false]);   // returns [true, false, true]
   *
   * See also:
   *
   *    isZero, isPositive, isNegative, isInteger
   *
   * @param {*} x       Value to be tested
   * @return {boolean}  Returns true when `x` is a `number`, `BigNumber`,
   *                    `Fraction`, or `boolean`. Returns false for other types.
   *                    Throws an error in case of unknown types.
   */
  var isNumeric = typed('isNumeric', {
    'number | BigNumber | Fraction | boolean': function () {
      return true;
    },

    'Complex | Unit | string': function () {
      return false;
    },

    'Array | Matrix': function (x) {
      return deepMap(x, isNumeric);
    }
  });

  return isNumeric;
}

exports.name = 'isNumeric';
exports.factory = factory;

},{"../../utils/collection/deepMap":353,"../../utils/number":361}],323:[function(require,module,exports){
'use strict';

var deepMap = require('../../utils/collection/deepMap');
var number = require('../../utils/number');

function factory (type, config, load, typed) {
  /**
   * Test whether a value is positive: larger than zero.
   * The function supports types `number`, `BigNumber`, `Fraction`, and `Unit`.
   *
   * The function is evaluated element-wise in case of Array or Matrix input.
   *
   * Syntax:
   *
   *     math.isPositive(x)
   *
   * Examples:
   *
   *    math.isPositive(3);                     // returns true
   *    math.isPositive(-2);                    // returns false
   *    math.isPositive(0);                     // returns false
   *    math.isPositive(-0);                    // returns false
   *    math.isPositive(0.5);                   // returns true
   *    math.isPositive(math.bignumber(2));     // returns true
   *    math.isPositive(math.fraction(-2, 5));  // returns false
   *    math.isPositive(math.fraction(1,3));    // returns false
   *    math.isPositive('2');                   // returns true
   *    math.isPositive([2, 0, -3]');           // returns [true, false, false]
   *
   * See also:
   *
   *    isNumeric, isZero, isNegative, isInteger
   *
   * @param {number | BigNumber | Fraction | Unit | Array | Matrix} x  Value to be tested
   * @return {boolean}  Returns true when `x` is larger than zero.
   *                    Throws an error in case of an unknown data type.
   */
  var isPositive = typed('isPositive', {
    'number': function (x) {
      return x > 0;
    },

    'BigNumber': function (x) {
      return !x.isNeg() && !x.isZero() && !x.isNaN();
    },

    'Fraction': function (x) {
      return x.s > 0 && x.n > 0;
    },

    'Unit': function (x) {
      return isPositive(x.value);
    },

    'Array | Matrix': function (x) {
      return deepMap(x, isPositive);
    }
  });

  return isPositive;
}

exports.name = 'isPositive';
exports.factory = factory;

},{"../../utils/collection/deepMap":353,"../../utils/number":361}],324:[function(require,module,exports){
'use strict';

var types = require('../../utils/types');

function factory (type, config, load, typed) {
  /**
   * Determine the type of a variable.
   *
   * Function `typeof` recognizes the following types of objects:
   *
   * Object                 | Returns       | Example
   * ---------------------- | ------------- | ------------------------------------------
   * null                   | `'null'`      | `math.typeof(null)`
   * number                 | `'number'`    | `math.typeof(3.5)`
   * boolean                | `'boolean'`   | `math.typeof (true)`
   * string                 | `'string'`    | `math.typeof ('hello world')`
   * Array                  | `'Array'`     | `math.typeof ([1, 2, 3])`
   * Date                   | `'Date'`      | `math.typeof (new Date())`
   * Function               | `'Function'`  | `math.typeof (function () {})`
   * Object                 | `'Object'`    | `math.typeof ({a: 2, b: 3})`
   * RegExp                 | `'RegExp'`    | `math.typeof (/a regexp/)`
   * undefined              | `'undefined'` | `math.typeof(undefined)`
   * math.type.BigNumber    | `'BigNumber'` | `math.typeof (math.bignumber('2.3e500'))`
   * math.type.Chain        | `'Chain'`     | `math.typeof (math.chain(2))`
   * math.type.Complex      | `'Complex'`   | `math.typeof (math.complex(2, 3))`
   * math.type.Fraction     | `'Fraction'`  | `math.typeof (math.fraction(1, 3))`
   * math.type.Help         | `'Help'`      | `math.typeof (math.help('sqrt'))`
   * math.type.Index        | `'Index'`     | `math.typeof (math.index(1, 3))`
   * math.type.Matrix       | `'Matrix'`    | `math.typeof (math.matrix([[1,2], [3, 4]]))`
   * math.type.Range        | `'Range'`     | `math.typeof (math.range(0, 10))`
   * math.type.Unit         | `'Unit'`      | `math.typeof (math.unit('45 deg'))`
   *
   * Syntax:
   *
   *    math.typeof(x)
   *
   * Examples:
   *
   *    math.typeof(3.5);                     // returns 'number'
   *    math.typeof(math.complex('2-4i'));    // returns 'Complex'
   *    math.typeof(math.unit('45 deg'));     // returns 'Unit'
   *    math.typeof('hello world');           // returns 'string'
   *
   * @param {*} x     The variable for which to test the type.
   * @return {string} Returns the name of the type. Primitive types are lower case,
   *                  non-primitive types are upper-camel-case.
   *                  For example 'number', 'string', 'Array', 'Date'.
   */
  var _typeof = typed('_typeof', {
    'any': function (x) {
      // JavaScript types
      var t = types.type(x);

      // math.js types
      if (t === 'Object') {
        if (x.isBigNumber === true) return 'BigNumber';
        if (x.isComplex === true)   return 'Complex';
        if (x.isFraction === true)  return 'Fraction';
        if (x.isMatrix === true)    return 'Matrix';
        if (x.isUnit === true)      return 'Unit';
        if (x.isIndex === true)     return 'Index';
        if (x.isRange === true)     return 'Range';
        if (x.isChain === true)     return 'Chain';
        if (x.isHelp === true)      return 'Help';
      }

      return t;
    }
  });

  _typeof.toTex = undefined; // use default template

  return _typeof;
}

exports.name = 'typeof';
exports.factory = factory;

},{"../../utils/types":364}],325:[function(require,module,exports){
var Complex = require('complex.js');
var format = require('../../utils/number').format;
var isNumber = require('../../utils/number').isNumber;

function factory (type, config, load, typed, math) {

  /**
   * Attach type information
   */
  Complex.prototype.type = 'Complex';
  Complex.prototype.isComplex = true;


  /**
   * Get a JSON representation of the complex number
   * @returns {Object} Returns a JSON object structured as:
   *                   `{"mathjs": "Complex", "re": 2, "im": 3}`
   */
  Complex.prototype.toJSON = function () {
    return {
      mathjs: 'Complex',
      re: this.re,
      im: this.im
    };
  };

  /*
   * Return the value of the complex number in polar notation
   * The angle phi will be set in the interval of [-pi, pi].
   * @return {{r: number, phi: number}} Returns and object with properties r and phi.
   */
  Complex.prototype.toPolar = function () {
    return {
      r: this.abs(),
      phi: this.arg()
    };
  };

  /**
   * Get a string representation of the complex number,
   * with optional formatting options.
   * @param {Object | number | Function} [options]  Formatting options. See
   *                                                lib/utils/number:format for a
   *                                                description of the available
   *                                                options.
   * @return {string} str
   */
  Complex.prototype.format = function (options) {
    var str = '';
    var im = this.im;
    var re = this.re;
    var strRe = format(this.re, options);
    var strIm = format(this.im, options);

    // round either re or im when smaller than the configured precision
    var precision = isNumber(options) ? options : options ? options.precision : null;
    if (precision !== null) {
      var epsilon = Math.pow(10, -precision);
      if (Math.abs(re / im) < epsilon) {
        re = 0;
      }
      if (Math.abs(im / re) < epsilon) {
        im = 0;
      }
    }

    if (im == 0) {
      // real value
      str = strRe;
    } else if (re == 0) {
      // purely complex value
      if (im == 1) {
        str = 'i';
      } else if (im == -1) {
        str = '-i';
      } else {
        str = strIm + 'i';
      }
    } else {
      // complex value
      if (im > 0) {
        if (im == 1) {
          str = strRe + ' + i';
        } else {
          str = strRe + ' + ' + strIm + 'i';
        }
      } else {
        if (im == -1) {
          str = strRe + ' - i';
        } else {
          str = strRe + ' - ' + strIm.substring(1) + 'i';
        }
      }
    }
    return str;
  };

  /**
   * Create a complex number from polar coordinates
   *
   * Usage:
   *
   *     Complex.fromPolar(r: number, phi: number) : Complex
   *     Complex.fromPolar({r: number, phi: number}) : Complex
   *
   * @param {*} args...
   * @return {Complex}
   */
  Complex.fromPolar = function (args) {
    switch (arguments.length) {
      case 1:
        var arg = arguments[0];
        if (typeof arg === 'object') {
          return Complex(arg);
        }
        throw new TypeError('Input has to be an object with r and phi keys.');

      case 2:
        var r = arguments[0],
            phi = arguments[1];
        if (isNumber(r)) {
          if (phi && phi.isUnit && phi.hasBase('ANGLE')) {
            // convert unit to a number in radians
            phi = phi.toNumber('rad');
          }

          if (isNumber(phi)) {
            return new Complex({r: r, phi: phi});
          }

          throw new TypeError('Phi is not a number nor an angle unit.');
        } else {
          throw new TypeError('Radius r is not a number.');
        }

      default:
        throw new SyntaxError('Wrong number of arguments in function fromPolar');
    }
  };


  Complex.prototype.valueOf = Complex.prototype.toString;

  /**
   * Create a Complex number from a JSON object
   * @param {Object} json  A JSON Object structured as
   *                       {"mathjs": "Complex", "re": 2, "im": 3}
   *                       All properties are optional, default values
   *                       for `re` and `im` are 0.
   * @return {Complex} Returns a new Complex number
   */
  Complex.fromJSON = function (json) {
    return new Complex(json);
  };

  // apply the current epsilon
  Complex.EPSILON = config.epsilon;

  // listen for changed in the configuration, automatically apply changed epsilon
  math.on('config', function (curr, prev) {
    if (curr.epsilon !== prev.epsilon) {
      Complex.EPSILON = curr.epsilon;
    }
  });

  return Complex;
}

exports.name = 'Complex';
exports.path = 'type';
exports.factory = factory;
exports.math = true; // request access to the math namespace

},{"../../utils/number":361,"complex.js":365}],326:[function(require,module,exports){
'use strict';

var deepMap = require('../../../utils/collection/deepMap');

function factory (type, config, load, typed) {
  /**
   * Create a fraction convert a value to a fraction.
   *
   * Syntax:
   *     math.fraction(numerator, denominator)
   *     math.fraction({n: numerator, d: denominator})
   *     math.fraction(matrix: Array | Matrix)         Turn all matrix entries
   *                                                   into fractions
   *
   * Examples:
   *
   *     math.fraction(1, 3);
   *     math.fraction('2/3');
   *     math.fraction({n: 2, d: 3});
   *     math.fraction([0.2, 0.25, 1.25]);
   *
   * See also:
   *
   *    bignumber, number, string, unit
   *
   * @param {number | string | Fraction | BigNumber | Array | Matrix} [args]
   *            Arguments specifying the numerator and denominator of
   *            the fraction
   * @return {Fraction | Array | Matrix} Returns a fraction
   */
  var fraction = typed('fraction', {
    'number': function (x) {
      if (!isFinite(x) || isNaN(x)) {
        throw new Error(x + ' cannot be represented as a fraction');
      }

      return new type.Fraction(x);
    },

    'string': function (x) {
      return new type.Fraction(x);
    },

    'number, number': function (numerator, denominator) {
      return new type.Fraction(numerator, denominator);
    },

    'BigNumber': function (x) {
      return new type.Fraction(x.toString());
    },

    'Fraction': function (x) {
      return x; // fractions are immutable
    },

    'Object': function (x) {
      return new type.Fraction(x);
    },

    'Array | Matrix': function (x) {
      return deepMap(x, fraction);
    }
  });

  return fraction;
}

exports.name = 'fraction';
exports.factory = factory;

},{"../../../utils/collection/deepMap":353}],327:[function(require,module,exports){
'use strict';

var number = require('../../utils/number');

function factory (type, config, load, typed) {
  /**
   * Create a range. A range has a start, step, and end, and contains functions
   * to iterate over the range.
   *
   * A range can be constructed as:
   *     var range = new Range(start, end);
   *     var range = new Range(start, end, step);
   *
   * To get the result of the range:
   *     range.forEach(function (x) {
   *         console.log(x);
   *     });
   *     range.map(function (x) {
   *         return math.sin(x);
   *     });
   *     range.toArray();
   *
   * Example usage:
   *     var c = new Range(2, 6);         // 2:1:5
   *     c.toArray();                     // [2, 3, 4, 5]
   *     var d = new Range(2, -3, -1);    // 2:-1:-2
   *     d.toArray();                     // [2, 1, 0, -1, -2]
   *
   * @class Range
   * @constructor Range
   * @param {number} start  included lower bound
   * @param {number} end    excluded upper bound
   * @param {number} [step] step size, default value is 1
   */
  function Range(start, end, step) {
    if (!(this instanceof Range)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }

    if (start != null) {
      if (start.isBigNumber === true)
        start = start.toNumber();
      else if (typeof start !== 'number')
        throw new TypeError('Parameter start must be a number');
    }
    if (end != null) {
      if (end.isBigNumber === true)
        end = end.toNumber();
      else if (typeof end !== 'number')
        throw new TypeError('Parameter end must be a number');
    }
    if (step != null) {
      if (step.isBigNumber === true)
        step = step.toNumber();
      else if (typeof step !== 'number')
        throw new TypeError('Parameter step must be a number');
    }

    this.start = (start != null) ? parseFloat(start) : 0;
    this.end   = (end != null)   ? parseFloat(end)   : 0;
    this.step  = (step != null)  ? parseFloat(step)  : 1;
  }

  /**
   * Attach type information
   */
  Range.prototype.type = 'Range';
  Range.prototype.isRange = true;

  /**
   * Parse a string into a range,
   * The string contains the start, optional step, and end, separated by a colon.
   * If the string does not contain a valid range, null is returned.
   * For example str='0:2:11'.
   * @memberof Range
   * @param {string} str
   * @return {Range | null} range
   */
  Range.parse = function (str) {
    if (typeof str !== 'string') {
      return null;
    }

    var args = str.split(':');
    var nums = args.map(function (arg) {
      return parseFloat(arg);
    });

    var invalid = nums.some(function (num) {
      return isNaN(num);
    });
    if (invalid) {
      return null;
    }

    switch (nums.length) {
      case 2:
        return new Range(nums[0], nums[1]);
      case 3:
        return new Range(nums[0], nums[2], nums[1]);
      default:
        return null;
    }
  };

  /**
   * Create a clone of the range
   * @return {Range} clone
   */
  Range.prototype.clone = function () {
    return new Range(this.start, this.end, this.step);
  };

  /**
   * Retrieve the size of the range.
   * Returns an array containing one number, the number of elements in the range.
   * @memberof Range
   * @returns {number[]} size
   */
  Range.prototype.size = function () {
    var len = 0,
        start = this.start,
        step = this.step,
        end = this.end,
        diff = end - start;

    if (number.sign(step) == number.sign(diff)) {
      len = Math.ceil((diff) / step);
    }
    else if (diff == 0) {
      len = 0;
    }

    if (isNaN(len)) {
      len = 0;
    }
    return [len];
  };

  /**
   * Calculate the minimum value in the range
   * @memberof Range
   * @return {number | undefined} min
   */
  Range.prototype.min = function () {
    var size = this.size()[0];

    if (size > 0) {
      if (this.step > 0) {
        // positive step
        return this.start;
      }
      else {
        // negative step
        return this.start + (size - 1) * this.step;
      }
    }
    else {
      return undefined;
    }
  };

  /**
   * Calculate the maximum value in the range
   * @memberof Range
   * @return {number | undefined} max
   */
  Range.prototype.max = function () {
    var size = this.size()[0];

    if (size > 0) {
      if (this.step > 0) {
        // positive step
        return this.start + (size - 1) * this.step;
      }
      else {
        // negative step
        return this.start;
      }
    }
    else {
      return undefined;
    }
  };


  /**
   * Execute a callback function for each value in the range.
   * @memberof Range
   * @param {function} callback   The callback method is invoked with three
   *                              parameters: the value of the element, the index
   *                              of the element, and the Range being traversed.
   */
  Range.prototype.forEach = function (callback) {
    var x = this.start;
    var step = this.step;
    var end = this.end;
    var i = 0;

    if (step > 0) {
      while (x < end) {
        callback(x, [i], this);
        x += step;
        i++;
      }
    }
    else if (step < 0) {
      while (x > end) {
        callback(x, [i], this);
        x += step;
        i++;
      }
    }
  };

  /**
   * Execute a callback function for each value in the Range, and return the
   * results as an array
   * @memberof Range
   * @param {function} callback   The callback method is invoked with three
   *                              parameters: the value of the element, the index
   *                              of the element, and the Matrix being traversed.
   * @returns {Array} array
   */
  Range.prototype.map = function (callback) {
    var array = [];
    this.forEach(function (value, index, obj) {
      array[index[0]] = callback(value, index, obj);
    });
    return array;
  };

  /**
   * Create an Array with a copy of the Ranges data
   * @memberof Range
   * @returns {Array} array
   */
  Range.prototype.toArray = function () {
    var array = [];
    this.forEach(function (value, index) {
      array[index[0]] = value;
    });
    return array;
  };

  /**
   * Get the primitive value of the Range, a one dimensional array
   * @memberof Range
   * @returns {Array} array
   */
  Range.prototype.valueOf = function () {
    // TODO: implement a caching mechanism for range.valueOf()
    return this.toArray();
  };

  /**
   * Get a string representation of the range, with optional formatting options.
   * Output is formatted as 'start:step:end', for example '2:6' or '0:0.2:11'
   * @memberof Range
   * @param {Object | number | function} [options]  Formatting options. See
   *                                                lib/utils/number:format for a
   *                                                description of the available
   *                                                options.
   * @returns {string} str
   */
  Range.prototype.format = function (options) {
    var str = number.format(this.start, options);

    if (this.step != 1) {
      str += ':' + number.format(this.step, options);
    }
    str += ':' + number.format(this.end, options);
    return str;
  };

  /**
   * Get a string representation of the range.
   * @memberof Range
   * @returns {string}
   */
  Range.prototype.toString = function () {
    return this.format();
  };

  /**
   * Get a JSON representation of the range
   * @memberof Range
   * @returns {Object} Returns a JSON object structured as:
   *                   `{"mathjs": "Range", "start": 2, "end": 4, "step": 1}`
   */
  Range.prototype.toJSON = function () {
    return {
      mathjs: 'Range',
      start: this.start,
      end: this.end,
      step: this.step
    };
  };

  /**
   * Instantiate a Range from a JSON object
   * @memberof Range
   * @param {Object} json A JSON object structured as:
   *                      `{"mathjs": "Range", "start": 2, "end": 4, "step": 1}`
   * @return {Range}
   */
  Range.fromJSON = function (json) {
    return new Range(json.start, json.end, json.step);
  };

  return Range;
}

exports.name = 'Range';
exports.path = 'type';
exports.factory = factory;

},{"../../utils/number":361}],328:[function(require,module,exports){
'use strict';

function factory (type, config, load, typed) {
  /**
   * Create a Matrix. The function creates a new `math.type.Matrix` object from
   * an `Array`. A Matrix has utility functions to manipulate the data in the
   * matrix, like getting the size and getting or setting values in the matrix.
   * Supported storage formats are 'dense' and 'sparse'.
   *
   * Syntax:
   *
   *    math.matrix()                         // creates an empty matrix using default storage format (dense).
   *    math.matrix(data)                     // creates a matrix with initial data using default storage format (dense).
   *    math.matrix('dense')                  // creates an empty matrix using the given storage format.
   *    math.matrix(data, 'dense')            // creates a matrix with initial data using the given storage format.
   *    math.matrix(data, 'sparse')           // creates a sparse matrix with initial data.
   *    math.matrix(data, 'sparse', 'number') // creates a sparse matrix with initial data, number data type.
   *
   * Examples:
   *
   *    var m = math.matrix([[1, 2], [3, 4]]);
   *    m.size();                        // Array [2, 2]
   *    m.resize([3, 2], 5);
   *    m.valueOf();                     // Array [[1, 2], [3, 4], [5, 5]]
   *    m.get([1, 0])                    // number 3
   *
   * See also:
   *
   *    bignumber, boolean, complex, index, number, string, unit, sparse
   *
   * @param {Array | Matrix} [data]    A multi dimensional array
   * @param {string} [format]          The Matrix storage format
   *
   * @return {Matrix} The created matrix
   */
  var matrix = typed('matrix', {
    '': function () {
      return _create([]);
    },

    'string': function (format) {
      return _create([], format);
    },
    
    'string, string': function (format, datatype) {
      return _create([], format, datatype);
    },

    'Array': function (data) {
      return _create(data);
    },
      
    'Matrix': function (data) {
      return _create(data, data.storage());
    },
    
    'Array | Matrix, string': _create,
    
    'Array | Matrix, string, string': _create
  });

  matrix.toTex = {
    0: '\\begin{bmatrix}\\end{bmatrix}',
    1: '\\left(${args[0]}\\right)',
    2: '\\left(${args[0]}\\right)'
  };

  return matrix;

  /**
   * Create a new Matrix with given storage format
   * @param {Array} data
   * @param {string} [format]
   * @param {string} [datatype]
   * @returns {Matrix} Returns a new Matrix
   * @private
   */
  function _create(data, format, datatype) {
    // get storage format constructor
    var M = type.Matrix.storage(format || 'default');

    // create instance
    return new M(data, datatype);
  }
}

exports.name = 'matrix';
exports.factory = factory;

},{}],329:[function(require,module,exports){
'use strict';

var DimensionError = require('../../../error/DimensionError');

function factory (type, config, load, typed) {

  var DenseMatrix = type.DenseMatrix;

  /**
   * Iterates over SparseMatrix nonzero items and invokes the callback function f(Dij, Sij). 
   * Callback function invoked NNZ times (number of nonzero items in SparseMatrix).
   *
   *
   *          ┌  f(Dij, Sij)  ; S(i,j) !== 0
   * C(i,j) = ┤
   *          └  Dij          ; otherwise
   *
   *
   * @param {Matrix}   denseMatrix       The DenseMatrix instance (D)
   * @param {Matrix}   sparseMatrix      The SparseMatrix instance (S)
   * @param {Function} callback          The f(Dij,Sij) operation to invoke, where Dij = DenseMatrix(i,j) and Sij = SparseMatrix(i,j)
   * @param {boolean}  inverse           A true value indicates callback should be invoked f(Sij,Dij)
   *
   * @return {Matrix}                    DenseMatrix (C)
   *
   * see https://github.com/josdejong/mathjs/pull/346#issuecomment-97477571
   */
  var algorithm01 = function (denseMatrix, sparseMatrix, callback, inverse) {
    // dense matrix arrays
    var adata = denseMatrix._data;
    var asize = denseMatrix._size;
    var adt = denseMatrix._datatype;
    // sparse matrix arrays
    var bvalues = sparseMatrix._values;
    var bindex = sparseMatrix._index;
    var bptr = sparseMatrix._ptr;
    var bsize = sparseMatrix._size;
    var bdt = sparseMatrix._datatype;

    // validate dimensions
    if (asize.length !== bsize.length)
      throw new DimensionError(asize.length, bsize.length);

    // check rows & columns
    if (asize[0] !== bsize[0] || asize[1] !== bsize[1])
      throw new RangeError('Dimension mismatch. Matrix A (' + asize + ') must match Matrix B (' + bsize + ')');

    // sparse matrix cannot be a Pattern matrix
    if (!bvalues)
      throw new Error('Cannot perform operation on Dense Matrix and Pattern Sparse Matrix');

    // rows & columns
    var rows = asize[0];
    var columns = asize[1];

    // process data types
    var dt = typeof adt === 'string' && adt === bdt ? adt : undefined;
    // callback function
    var cf = dt ? typed.find(callback, [dt, dt]) : callback;

    // vars
    var i, j;
    
    // result (DenseMatrix)
    var cdata = [];
    // initialize c
    for (i = 0; i < rows; i++)
      cdata[i] = [];      
    
    // workspace
    var x = [];
    // marks indicating we have a value in x for a given column
    var w = [];

    // loop columns in b
    for (j = 0; j < columns; j++) {
      // column mark
      var mark = j + 1;
      // values in column j
      for (var k0 = bptr[j], k1 = bptr[j + 1], k = k0; k < k1; k++) {
        // row
        i = bindex[k];
        // update workspace
        x[i] = inverse ? cf(bvalues[k], adata[i][j]) : cf(adata[i][j], bvalues[k]);
        // mark i as updated
        w[i] = mark;
      }
      // loop rows
      for (i = 0; i < rows; i++) {
        // check row is in workspace
        if (w[i] === mark) {
          // c[i][j] was already calculated
          cdata[i][j] = x[i];
        }
        else {
          // item does not exist in S
          cdata[i][j] = adata[i][j];
        }
      }
    }

    // return dense matrix
    return new DenseMatrix({
      data: cdata,
      size: [rows, columns],
      datatype: dt
    });
  };
  
  return algorithm01;
}

exports.name = 'algorithm01';
exports.factory = factory;

},{"../../../error/DimensionError":15}],330:[function(require,module,exports){
'use strict';

var DimensionError = require('../../../error/DimensionError');

function factory (type, config, load, typed) {

  var equalScalar = load(require('../../../function/relational/equalScalar'));

  var SparseMatrix = type.SparseMatrix;

  /**
   * Iterates over SparseMatrix nonzero items and invokes the callback function f(Dij, Sij). 
   * Callback function invoked NNZ times (number of nonzero items in SparseMatrix).
   *
   *
   *          ┌  f(Dij, Sij)  ; S(i,j) !== 0
   * C(i,j) = ┤
   *          └  0            ; otherwise
   *
   *
   * @param {Matrix}   denseMatrix       The DenseMatrix instance (D)
   * @param {Matrix}   sparseMatrix      The SparseMatrix instance (S)
   * @param {Function} callback          The f(Dij,Sij) operation to invoke, where Dij = DenseMatrix(i,j) and Sij = SparseMatrix(i,j)
   * @param {boolean}  inverse           A true value indicates callback should be invoked f(Sij,Dij)
   *
   * @return {Matrix}                    SparseMatrix (C)
   *
   * see https://github.com/josdejong/mathjs/pull/346#issuecomment-97477571
   */
  var algorithm02 = function (denseMatrix, sparseMatrix, callback, inverse) {
    // dense matrix arrays
    var adata = denseMatrix._data;
    var asize = denseMatrix._size;
    var adt = denseMatrix._datatype;
    // sparse matrix arrays
    var bvalues = sparseMatrix._values;
    var bindex = sparseMatrix._index;
    var bptr = sparseMatrix._ptr;
    var bsize = sparseMatrix._size;
    var bdt = sparseMatrix._datatype;

    // validate dimensions
    if (asize.length !== bsize.length)
      throw new DimensionError(asize.length, bsize.length);

    // check rows & columns
    if (asize[0] !== bsize[0] || asize[1] !== bsize[1])
      throw new RangeError('Dimension mismatch. Matrix A (' + asize + ') must match Matrix B (' + bsize + ')');

    // sparse matrix cannot be a Pattern matrix
    if (!bvalues)
      throw new Error('Cannot perform operation on Dense Matrix and Pattern Sparse Matrix');

    // rows & columns
    var rows = asize[0];
    var columns = asize[1];
    
    // datatype
    var dt;
    // equal signature to use
    var eq = equalScalar;
    // zero value
    var zero = 0;
    // callback signature to use
    var cf = callback;

    // process data types
    if (typeof adt === 'string' && adt === bdt) {
      // datatype
      dt = adt;
      // find signature that matches (dt, dt)
      eq = typed.find(equalScalar, [dt, dt]);
      // convert 0 to the same datatype
      zero = typed.convert(0, dt);
      // callback
      cf = typed.find(callback, [dt, dt]);
    }

    // result (SparseMatrix)
    var cvalues = [];
    var cindex = [];
    var cptr = [];

    // loop columns in b
    for (var j = 0; j < columns; j++) {
      // update cptr
      cptr[j] = cindex.length;
      // values in column j
      for (var k0 = bptr[j], k1 = bptr[j + 1], k = k0; k < k1; k++) {
        // row
        var i = bindex[k];
        // update C(i,j)
        var cij = inverse ? cf(bvalues[k], adata[i][j]) : cf(adata[i][j], bvalues[k]);
        // check for nonzero
        if (!eq(cij, zero)) {
          // push i & v
          cindex.push(i);
          cvalues.push(cij);
        }
      }
    }
    // update cptr
    cptr[columns] = cindex.length;

    // return sparse matrix
    return new SparseMatrix({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size: [rows, columns],
      datatype: dt
    });
  };
  
  return algorithm02;
}

exports.name = 'algorithm02';
exports.factory = factory;

},{"../../../error/DimensionError":15,"../../../function/relational/equalScalar":288}],331:[function(require,module,exports){
'use strict';

var DimensionError = require('../../../error/DimensionError');

function factory (type, config, load, typed) {

  var DenseMatrix = type.DenseMatrix;

  /**
   * Iterates over SparseMatrix items and invokes the callback function f(Dij, Sij).
   * Callback function invoked M*N times.
   *
   *
   *          ┌  f(Dij, Sij)  ; S(i,j) !== 0
   * C(i,j) = ┤
   *          └  f(Dij, 0)    ; otherwise
   *
   *
   * @param {Matrix}   denseMatrix       The DenseMatrix instance (D)
   * @param {Matrix}   sparseMatrix      The SparseMatrix instance (C)
   * @param {Function} callback          The f(Dij,Sij) operation to invoke, where Dij = DenseMatrix(i,j) and Sij = SparseMatrix(i,j)
   * @param {boolean}  inverse           A true value indicates callback should be invoked f(Sij,Dij)
   *
   * @return {Matrix}                    DenseMatrix (C)
   *
   * see https://github.com/josdejong/mathjs/pull/346#issuecomment-97477571
   */
  var algorithm03 = function (denseMatrix, sparseMatrix, callback, inverse) {
    // dense matrix arrays
    var adata = denseMatrix._data;
    var asize = denseMatrix._size;
    var adt = denseMatrix._datatype;
    // sparse matrix arrays
    var bvalues = sparseMatrix._values;
    var bindex = sparseMatrix._index;
    var bptr = sparseMatrix._ptr;
    var bsize = sparseMatrix._size;
    var bdt = sparseMatrix._datatype;

    // validate dimensions
    if (asize.length !== bsize.length)
      throw new DimensionError(asize.length, bsize.length);

    // check rows & columns
    if (asize[0] !== bsize[0] || asize[1] !== bsize[1])
      throw new RangeError('Dimension mismatch. Matrix A (' + asize + ') must match Matrix B (' + bsize + ')');

    // sparse matrix cannot be a Pattern matrix
    if (!bvalues)
      throw new Error('Cannot perform operation on Dense Matrix and Pattern Sparse Matrix');

    // rows & columns
    var rows = asize[0];
    var columns = asize[1];

    // datatype
    var dt;
    // zero value
    var zero = 0;
    // callback signature to use
    var cf = callback;

    // process data types
    if (typeof adt === 'string' && adt === bdt) {
      // datatype
      dt = adt;
      // convert 0 to the same datatype
      zero = typed.convert(0, dt);
      // callback
      cf = typed.find(callback, [dt, dt]);
    }

    // result (DenseMatrix)
    var cdata = [];

    // initialize dense matrix
    for (var z = 0; z < rows; z++) {
      // initialize row
      cdata[z] = [];
    }

    // workspace
    var x = [];
    // marks indicating we have a value in x for a given column
    var w = [];

    // loop columns in b
    for (var j = 0; j < columns; j++) {
      // column mark
      var mark = j + 1;
      // values in column j
      for (var k0 = bptr[j], k1 = bptr[j + 1], k = k0; k < k1; k++) {
        // row
        var i = bindex[k];
        // update workspace
        x[i] = inverse ? cf(bvalues[k], adata[i][j]) : cf(adata[i][j], bvalues[k]);
        w[i] = mark;
      }
      // process workspace
      for (var y = 0; y < rows; y++) {
        // check we have a calculated value for current row
        if (w[y] === mark) {
          // use calculated value
          cdata[y][j] = x[y];
        }
        else {
          // calculate value
          cdata[y][j] = inverse ? cf(zero, adata[y][j]) : cf(adata[y][j], zero);
        }
      }
    }

    // return dense matrix
    return new DenseMatrix({
      data: cdata,
      size: [rows, columns],
      datatype: dt
    });
  };
  
  return algorithm03;
}

exports.name = 'algorithm03';
exports.factory = factory;

},{"../../../error/DimensionError":15}],332:[function(require,module,exports){
'use strict';

var DimensionError = require('../../../error/DimensionError');

function factory (type, config, load, typed) {

  var equalScalar = load(require('../../../function/relational/equalScalar'));

  var SparseMatrix = type.SparseMatrix;

  /**
   * Iterates over SparseMatrix A and SparseMatrix B nonzero items and invokes the callback function f(Aij, Bij). 
   * Callback function invoked MAX(NNZA, NNZB) times
   *
   *
   *          ┌  f(Aij, Bij)  ; A(i,j) !== 0 && B(i,j) !== 0
   * C(i,j) = ┤  A(i,j)       ; A(i,j) !== 0
   *          └  B(i,j)       ; B(i,j) !== 0
   *
   *
   * @param {Matrix}   a                 The SparseMatrix instance (A)
   * @param {Matrix}   b                 The SparseMatrix instance (B)
   * @param {Function} callback          The f(Aij,Bij) operation to invoke
   *
   * @return {Matrix}                    SparseMatrix (C)
   *
   * see https://github.com/josdejong/mathjs/pull/346#issuecomment-97620294
   */
  var algorithm04 = function (a, b, callback) {
    // sparse matrix arrays
    var avalues = a._values;
    var aindex = a._index;
    var aptr = a._ptr;
    var asize = a._size;
    var adt = a._datatype;
    // sparse matrix arrays
    var bvalues = b._values;
    var bindex = b._index;
    var bptr = b._ptr;
    var bsize = b._size;
    var bdt = b._datatype;

    // validate dimensions
    if (asize.length !== bsize.length)
      throw new DimensionError(asize.length, bsize.length);

    // check rows & columns
    if (asize[0] !== bsize[0] || asize[1] !== bsize[1])
      throw new RangeError('Dimension mismatch. Matrix A (' + asize + ') must match Matrix B (' + bsize + ')');

    // rows & columns
    var rows = asize[0];
    var columns = asize[1];

    // datatype
    var dt;
    // equal signature to use
    var eq = equalScalar;
    // zero value
    var zero = 0;
    // callback signature to use
    var cf = callback;

    // process data types
    if (typeof adt === 'string' && adt === bdt) {
      // datatype
      dt = adt;
      // find signature that matches (dt, dt)
      eq = typed.find(equalScalar, [dt, dt]);
      // convert 0 to the same datatype
      zero = typed.convert(0, dt);
      // callback
      cf = typed.find(callback, [dt, dt]);
    }

    // result arrays
    var cvalues = avalues && bvalues ? [] : undefined;
    var cindex = [];
    var cptr = [];
    // matrix
    var c = new SparseMatrix({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size: [rows, columns],
      datatype: dt
    });

    // workspace
    var xa = avalues && bvalues ? [] : undefined;
    var xb = avalues && bvalues ? [] : undefined;
    // marks indicating we have a value in x for a given column
    var wa = [];
    var wb = [];

    // vars 
    var i, j, k, k0, k1;
    
    // loop columns
    for (j = 0; j < columns; j++) {
      // update cptr
      cptr[j] = cindex.length;
      // columns mark
      var mark = j + 1;
      // loop A(:,j)
      for (k0 = aptr[j], k1 = aptr[j + 1], k = k0; k < k1; k++) {
        // row
        i = aindex[k];
        // update c
        cindex.push(i);
        // update workspace
        wa[i] = mark;
        // check we need to process values
        if (xa)
          xa[i] = avalues[k];
      }
      // loop B(:,j)
      for (k0 = bptr[j], k1 = bptr[j + 1], k = k0; k < k1; k++) {
        // row
        i = bindex[k];
        // check row exists in A
        if (wa[i] === mark) {
          // update record in xa @ i
          if (xa) {
            // invoke callback
            var v = cf(xa[i], bvalues[k]);
            // check for zero
            if (!eq(v, zero)) {
              // update workspace
              xa[i] = v;              
            }
            else {
              // remove mark (index will be removed later)
              wa[i] = null;
            }
          }
        }
        else {
          // update c
          cindex.push(i);
          // update workspace
          wb[i] = mark;
          // check we need to process values
          if (xb)
            xb[i] = bvalues[k];
        }
      }
      // check we need to process values (non pattern matrix)
      if (xa && xb) {
        // initialize first index in j
        k = cptr[j];
        // loop index in j
        while (k < cindex.length) {
          // row
          i = cindex[k];
          // check workspace has value @ i
          if (wa[i] === mark) {
            // push value (Aij != 0 || (Aij != 0 && Bij != 0))
            cvalues[k] = xa[i];
            // increment pointer
            k++;
          }
          else if (wb[i] === mark) {
            // push value (bij != 0)
            cvalues[k] = xb[i];
            // increment pointer
            k++;
          }
          else {
            // remove index @ k
            cindex.splice(k, 1);
          }
        }
      }
    }
    // update cptr
    cptr[columns] = cindex.length;

    // return sparse matrix
    return c;
  };
  
  return algorithm04;
}

exports.name = 'algorithm04';
exports.factory = factory;

},{"../../../error/DimensionError":15,"../../../function/relational/equalScalar":288}],333:[function(require,module,exports){
'use strict';

var DimensionError = require('../../../error/DimensionError');

function factory (type, config, load, typed) {

  var equalScalar = load(require('../../../function/relational/equalScalar'));
  
  var SparseMatrix = type.SparseMatrix;

  /**
   * Iterates over SparseMatrix A and SparseMatrix B nonzero items and invokes the callback function f(Aij, Bij). 
   * Callback function invoked MAX(NNZA, NNZB) times
   *
   *
   *          ┌  f(Aij, Bij)  ; A(i,j) !== 0 || B(i,j) !== 0
   * C(i,j) = ┤  
   *          └  0            ; otherwise
   *
   *
   * @param {Matrix}   a                 The SparseMatrix instance (A)
   * @param {Matrix}   b                 The SparseMatrix instance (B)
   * @param {Function} callback          The f(Aij,Bij) operation to invoke
   *
   * @return {Matrix}                    SparseMatrix (C)
   *
   * see https://github.com/josdejong/mathjs/pull/346#issuecomment-97620294
   */
  var algorithm05 = function (a, b, callback) {
    // sparse matrix arrays
    var avalues = a._values;
    var aindex = a._index;
    var aptr = a._ptr;
    var asize = a._size;
    var adt = a._datatype;
    // sparse matrix arrays
    var bvalues = b._values;
    var bindex = b._index;
    var bptr = b._ptr;
    var bsize = b._size;
    var bdt = b._datatype;

    // validate dimensions
    if (asize.length !== bsize.length)
      throw new DimensionError(asize.length, bsize.length);

    // check rows & columns
    if (asize[0] !== bsize[0] || asize[1] !== bsize[1])
      throw new RangeError('Dimension mismatch. Matrix A (' + asize + ') must match Matrix B (' + bsize + ')');

    // rows & columns
    var rows = asize[0];
    var columns = asize[1];

    // datatype
    var dt;
    // equal signature to use
    var eq = equalScalar;
    // zero value
    var zero = 0;
    // callback signature to use
    var cf = callback;

    // process data types
    if (typeof adt === 'string' && adt === bdt) {
      // datatype
      dt = adt;
      // find signature that matches (dt, dt)
      eq = typed.find(equalScalar, [dt, dt]);
      // convert 0 to the same datatype
      zero = typed.convert(0, dt);
      // callback
      cf = typed.find(callback, [dt, dt]);
    }

    // result arrays
    var cvalues = avalues && bvalues ? [] : undefined;
    var cindex = [];
    var cptr = [];
    // matrix
    var c = new SparseMatrix({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size: [rows, columns],
      datatype: dt
    });

    // workspaces
    var xa = cvalues ? [] : undefined;
    var xb = cvalues ? [] : undefined;
    // marks indicating we have a value in x for a given column
    var wa = [];
    var wb = [];

    // vars
    var i, j, k, k1;
    
    // loop columns
    for (j = 0; j < columns; j++) {
      // update cptr
      cptr[j] = cindex.length;
      // columns mark
      var mark = j + 1;
      // loop values A(:,j)
      for (k = aptr[j], k1 = aptr[j + 1]; k < k1; k++) {
        // row
        i = aindex[k];
        // push index
        cindex.push(i);
        // update workspace
        wa[i] = mark;
        // check we need to process values
        if (xa)
          xa[i] = avalues[k];
      }
      // loop values B(:,j)
      for (k = bptr[j], k1 = bptr[j + 1]; k < k1; k++) {
        // row
        i = bindex[k];
        // check row existed in A
        if (wa[i] !== mark) {
          // push index
          cindex.push(i);
        }
        // update workspace
        wb[i] = mark;
        // check we need to process values
        if (xb)
          xb[i] = bvalues[k];
      }
      // check we need to process values (non pattern matrix)
      if (cvalues) {
        // initialize first index in j
        k = cptr[j];
        // loop index in j
        while (k < cindex.length) {
          // row
          i = cindex[k];
          // marks
          var wai = wa[i];
          var wbi = wb[i];
          // check Aij or Bij are nonzero
          if (wai === mark || wbi === mark) {
            // matrix values @ i,j
            var va = wai === mark ? xa[i] : zero;
            var vb = wbi === mark ? xb[i] : zero;
            // Cij
            var vc = cf(va, vb);
            // check for zero
            if (!eq(vc, zero)) {
              // push value
              cvalues.push(vc);
              // increment pointer
              k++;
            }
            else {
              // remove value @ i, do not increment pointer
              cindex.splice(k, 1);
            }
          }
        }
      }
    }
    // update cptr
    cptr[columns] = cindex.length;

    // return sparse matrix
    return c;
  };

  return algorithm05;
}

exports.name = 'algorithm05';
exports.factory = factory;

},{"../../../error/DimensionError":15,"../../../function/relational/equalScalar":288}],334:[function(require,module,exports){
'use strict';

var scatter = require('./../../../utils/collection/scatter');
var DimensionError = require('../../../error/DimensionError');

function factory (type, config, load, typed) {

  var equalScalar = load(require('../../../function/relational/equalScalar'));

  var SparseMatrix = type.SparseMatrix;

  /**
   * Iterates over SparseMatrix A and SparseMatrix B nonzero items and invokes the callback function f(Aij, Bij). 
   * Callback function invoked (Anz U Bnz) times, where Anz and Bnz are the nonzero elements in both matrices.
   *
   *
   *          ┌  f(Aij, Bij)  ; A(i,j) !== 0 && B(i,j) !== 0
   * C(i,j) = ┤  
   *          └  0            ; otherwise
   *
   *
   * @param {Matrix}   a                 The SparseMatrix instance (A)
   * @param {Matrix}   b                 The SparseMatrix instance (B)
   * @param {Function} callback          The f(Aij,Bij) operation to invoke
   *
   * @return {Matrix}                    SparseMatrix (C)
   *
   * see https://github.com/josdejong/mathjs/pull/346#issuecomment-97620294
   */
  var algorithm06 = function (a, b, callback) {
    // sparse matrix arrays
    var avalues = a._values;
    var asize = a._size;
    var adt = a._datatype;
    // sparse matrix arrays
    var bvalues = b._values;
    var bsize = b._size;
    var bdt = b._datatype;

    // validate dimensions
    if (asize.length !== bsize.length)
      throw new DimensionError(asize.length, bsize.length);

    // check rows & columns
    if (asize[0] !== bsize[0] || asize[1] !== bsize[1])
      throw new RangeError('Dimension mismatch. Matrix A (' + asize + ') must match Matrix B (' + bsize + ')');

    // rows & columns
    var rows = asize[0];
    var columns = asize[1];

    // datatype
    var dt;
    // equal signature to use
    var eq = equalScalar;
    // zero value
    var zero = 0;
    // callback signature to use
    var cf = callback;

    // process data types
    if (typeof adt === 'string' && adt === bdt) {
      // datatype
      dt = adt;
      // find signature that matches (dt, dt)
      eq = typed.find(equalScalar, [dt, dt]);
      // convert 0 to the same datatype
      zero = typed.convert(0, dt);
      // callback
      cf = typed.find(callback, [dt, dt]);
    }

    // result arrays
    var cvalues = avalues && bvalues ? [] : undefined;
    var cindex = [];
    var cptr = [];
    // matrix
    var c = new SparseMatrix({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size: [rows, columns],
      datatype: dt
    });

    // workspaces
    var x = cvalues ? [] : undefined;
    // marks indicating we have a value in x for a given column
    var w = [];
    // marks indicating value in a given row has been updated
    var u = [];

    // loop columns
    for (var j = 0; j < columns; j++) {
      // update cptr
      cptr[j] = cindex.length;
      // columns mark
      var mark = j + 1;
      // scatter the values of A(:,j) into workspace
      scatter(a, j, w, x, u, mark, c, cf);
      // scatter the values of B(:,j) into workspace
      scatter(b, j, w, x, u, mark, c, cf);
      // check we need to process values (non pattern matrix)
      if (x) {
        // initialize first index in j
        var k = cptr[j];
        // loop index in j
        while (k < cindex.length) {
          // row
          var i = cindex[k];
          // check function was invoked on current row (Aij !=0 && Bij != 0)
          if (u[i] === mark) {
            // value @ i
            var v = x[i];
            // check for zero value
            if (!eq(v, zero)) {
              // push value
              cvalues.push(v);
              // increment pointer
              k++;
            }
            else {
              // remove value @ i, do not increment pointer
              cindex.splice(k, 1);
            }
          }
          else {
            // remove value @ i, do not increment pointer
            cindex.splice(k, 1);
          }
        }
      }
      else {
        // initialize first index in j
        var p = cptr[j];
        // loop index in j
        while (p < cindex.length) {
          // row
          var r = cindex[p];
          // check function was invoked on current row (Aij !=0 && Bij != 0)
          if (u[r] !== mark) {
            // remove value @ i, do not increment pointer
            cindex.splice(p, 1);
          }
          else {
            // increment pointer
            p++;
          }
        }
      }
    }
    // update cptr
    cptr[columns] = cindex.length;

    // return sparse matrix
    return c;
  };
  
  return algorithm06;
}

exports.name = 'algorithm06';
exports.factory = factory;

},{"../../../error/DimensionError":15,"../../../function/relational/equalScalar":288,"./../../../utils/collection/scatter":356}],335:[function(require,module,exports){
'use strict';

var DimensionError = require('../../../error/DimensionError');

function factory (type, config, load, typed) {

  var DenseMatrix = type.DenseMatrix;

  /**
   * Iterates over SparseMatrix A and SparseMatrix B items (zero and nonzero) and invokes the callback function f(Aij, Bij). 
   * Callback function invoked MxN times.
   *
   * C(i,j) = f(Aij, Bij)
   *
   * @param {Matrix}   a                 The SparseMatrix instance (A)
   * @param {Matrix}   b                 The SparseMatrix instance (B)
   * @param {Function} callback          The f(Aij,Bij) operation to invoke
   *
   * @return {Matrix}                    DenseMatrix (C)
   *
   * see https://github.com/josdejong/mathjs/pull/346#issuecomment-97620294
   */
  var algorithm07 = function (a, b, callback) {
    // sparse matrix arrays
    var asize = a._size;
    var adt = a._datatype;
    // sparse matrix arrays
    var bsize = b._size;
    var bdt = b._datatype;

    // validate dimensions
    if (asize.length !== bsize.length)
      throw new DimensionError(asize.length, bsize.length);

    // check rows & columns
    if (asize[0] !== bsize[0] || asize[1] !== bsize[1])
      throw new RangeError('Dimension mismatch. Matrix A (' + asize + ') must match Matrix B (' + bsize + ')');

    // rows & columns
    var rows = asize[0];
    var columns = asize[1];

    // datatype
    var dt;
    // zero value
    var zero = 0;
    // callback signature to use
    var cf = callback;

    // process data types
    if (typeof adt === 'string' && adt === bdt) {
      // datatype
      dt = adt;
      // convert 0 to the same datatype
      zero = typed.convert(0, dt);
      // callback
      cf = typed.find(callback, [dt, dt]);
    }

    // vars
    var i, j;
    
    // result arrays
    var cdata = [];
    // initialize c
    for (i = 0; i < rows; i++)
      cdata[i] = [];

    // matrix
    var c = new DenseMatrix({
      data: cdata,
      size: [rows, columns],
      datatype: dt
    });

    // workspaces
    var xa = [];
    var xb = [];
    // marks indicating we have a value in x for a given column
    var wa = [];
    var wb = [];

    // loop columns
    for (j = 0; j < columns; j++) {
      // columns mark
      var mark = j + 1;
      // scatter the values of A(:,j) into workspace
      _scatter(a, j, wa, xa, mark);
      // scatter the values of B(:,j) into workspace
      _scatter(b, j, wb, xb, mark);
      // loop rows
      for (i = 0; i < rows; i++) {
        // matrix values @ i,j
        var va = wa[i] === mark ? xa[i] : zero;
        var vb = wb[i] === mark ? xb[i] : zero;
        // invoke callback
        cdata[i][j] = cf(va, vb);
      }          
    }

    // return sparse matrix
    return c;
  };
  
  var _scatter = function (m, j, w, x, mark) {
    // a arrays
    var values = m._values;
    var index = m._index;
    var ptr = m._ptr;
    // loop values in column j
    for (var k = ptr[j], k1 = ptr[j + 1]; k < k1; k++) {
      // row
      var i = index[k];
      // update workspace
      w[i] = mark;
      x[i] = values[k];
    }
  };
  
  return algorithm07;
}

exports.name = 'algorithm07';
exports.factory = factory;

},{"../../../error/DimensionError":15}],336:[function(require,module,exports){
'use strict';

var DimensionError = require('../../../error/DimensionError');

function factory (type, config, load, typed) {

  var equalScalar = load(require('../../../function/relational/equalScalar'));

  var SparseMatrix = type.SparseMatrix;

  /**
   * Iterates over SparseMatrix A and invokes the callback function f(Aij, Bij). 
   * Callback function invoked NZA times, number of nonzero elements in A.
   *
   *
   *          ┌  f(Aij, Bij)  ; A(i,j) !== 0
   * C(i,j) = ┤  
   *          └  0            ; otherwise
   *
   *
   * @param {Matrix}   a                 The SparseMatrix instance (A)
   * @param {Matrix}   b                 The SparseMatrix instance (B)
   * @param {Function} callback          The f(Aij,Bij) operation to invoke
   *
   * @return {Matrix}                    SparseMatrix (C)
   *
   * see https://github.com/josdejong/mathjs/pull/346#issuecomment-97620294
   */
  var algorithm09 = function (a, b, callback) {
    // sparse matrix arrays
    var avalues = a._values;
    var aindex = a._index;
    var aptr = a._ptr;
    var asize = a._size;
    var adt = a._datatype;
    // sparse matrix arrays
    var bvalues = b._values;
    var bindex = b._index;
    var bptr = b._ptr;
    var bsize = b._size;
    var bdt = b._datatype;

    // validate dimensions
    if (asize.length !== bsize.length)
      throw new DimensionError(asize.length, bsize.length);

    // check rows & columns
    if (asize[0] !== bsize[0] || asize[1] !== bsize[1])
      throw new RangeError('Dimension mismatch. Matrix A (' + asize + ') must match Matrix B (' + bsize + ')');

    // rows & columns
    var rows = asize[0];
    var columns = asize[1];

    // datatype
    var dt;
    // equal signature to use
    var eq = equalScalar;
    // zero value
    var zero = 0;
    // callback signature to use
    var cf = callback;

    // process data types
    if (typeof adt === 'string' && adt === bdt) {
      // datatype
      dt = adt;
      // find signature that matches (dt, dt)
      eq = typed.find(equalScalar, [dt, dt]);
      // convert 0 to the same datatype
      zero = typed.convert(0, dt);
      // callback
      cf = typed.find(callback, [dt, dt]);
    }

    // result arrays
    var cvalues = avalues && bvalues ? [] : undefined;
    var cindex = [];
    var cptr = [];
    // matrix
    var c = new SparseMatrix({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size: [rows, columns],
      datatype: dt
    });

    // workspaces
    var x = cvalues ? [] : undefined;
    // marks indicating we have a value in x for a given column
    var w = [];

    // vars
    var i, j, k, k0, k1;
    
    // loop columns
    for (j = 0; j < columns; j++) {
      // update cptr
      cptr[j] = cindex.length;
      // column mark
      var mark = j + 1;
      // check we need to process values
      if (x) {
        // loop B(:,j)
        for (k0 = bptr[j], k1 = bptr[j + 1], k = k0; k < k1; k++) {
          // row
          i = bindex[k];
          // update workspace
          w[i] = mark;
          x[i] = bvalues[k];
        }
      }
      // loop A(:,j)
      for (k0 = aptr[j], k1 = aptr[j + 1], k = k0; k < k1; k++) {
        // row
        i = aindex[k];
        // check we need to process values
        if (x) {
          // b value @ i,j
          var vb = w[i] === mark ? x[i] : zero;
          // invoke f
          var vc = cf(avalues[k], vb);
          // check zero value
          if (!eq(vc, zero)) {
            // push index
            cindex.push(i);
            // push value
            cvalues.push(vc);
          }
        }
        else {
          // push index
          cindex.push(i);
        }
      }
    }
    // update cptr
    cptr[columns] = cindex.length;

    // return sparse matrix
    return c;
  };

  return algorithm09;
}

exports.name = 'algorithm09';
exports.factory = factory;

},{"../../../error/DimensionError":15,"../../../function/relational/equalScalar":288}],337:[function(require,module,exports){
'use strict';

function factory (type, config, load, typed) {

  var DenseMatrix = type.DenseMatrix;

  /**
   * Iterates over SparseMatrix S nonzero items and invokes the callback function f(Sij, b). 
   * Callback function invoked NZ times (number of nonzero items in S).
   *
   *
   *          ┌  f(Sij, b)  ; S(i,j) !== 0
   * C(i,j) = ┤  
   *          └  b          ; otherwise
   *
   *
   * @param {Matrix}   s                 The SparseMatrix instance (S)
   * @param {Scalar}   b                 The Scalar value
   * @param {Function} callback          The f(Aij,b) operation to invoke
   * @param {boolean}  inverse           A true value indicates callback should be invoked f(b,Sij)
   *
   * @return {Matrix}                    DenseMatrix (C)
   *
   * https://github.com/josdejong/mathjs/pull/346#issuecomment-97626813
   */
  var algorithm10 = function (s, b, callback, inverse) {
    // sparse matrix arrays
    var avalues = s._values;
    var aindex = s._index;
    var aptr = s._ptr;
    var asize = s._size;
    var adt = s._datatype;

    // sparse matrix cannot be a Pattern matrix
    if (!avalues)
      throw new Error('Cannot perform operation on Pattern Sparse Matrix and Scalar value');

    // rows & columns
    var rows = asize[0];
    var columns = asize[1];

    // datatype
    var dt;
    // callback signature to use
    var cf = callback;

    // process data types
    if (typeof adt === 'string') {
      // datatype
      dt = adt;
      // convert b to the same datatype
      b = typed.convert(b, dt);
      // callback
      cf = typed.find(callback, [dt, dt]);
    }

    // result arrays
    var cdata = [];
    // matrix
    var c = new DenseMatrix({
      data: cdata,
      size: [rows, columns],
      datatype: dt
    });

    // workspaces
    var x = [];
    // marks indicating we have a value in x for a given column
    var w = [];

    // loop columns
    for (var j = 0; j < columns; j++) {
      // columns mark
      var mark = j + 1;
      // values in j
      for (var k0 = aptr[j], k1 = aptr[j + 1], k = k0; k < k1; k++) {
        // row
        var r = aindex[k];
        // update workspace
        x[r] = avalues[k];
        w[r] = mark;
      }
      // loop rows
      for (var i = 0; i < rows; i++) {
        // initialize C on first column
        if (j === 0) {
          // create row array
          cdata[i] = [];
        }
        // check sparse matrix has a value @ i,j
        if (w[i] === mark) {
          // invoke callback, update C
          cdata[i][j] = inverse ? cf(b, x[i]) : cf(x[i], b);
        }
        else {
          // dense matrix value @ i, j
          cdata[i][j] = b;
        }
      }
    }

    // return sparse matrix
    return c;
  };

  return algorithm10;
}

exports.name = 'algorithm10';
exports.factory = factory;

},{}],338:[function(require,module,exports){
'use strict';

function factory (type, config, load, typed) {

  var equalScalar = load(require('../../../function/relational/equalScalar'));

  var SparseMatrix = type.SparseMatrix;

  /**
   * Iterates over SparseMatrix S nonzero items and invokes the callback function f(Sij, b). 
   * Callback function invoked NZ times (number of nonzero items in S).
   *
   *
   *          ┌  f(Sij, b)  ; S(i,j) !== 0
   * C(i,j) = ┤  
   *          └  0          ; otherwise
   *
   *
   * @param {Matrix}   s                 The SparseMatrix instance (S)
   * @param {Scalar}   b                 The Scalar value
   * @param {Function} callback          The f(Aij,b) operation to invoke
   * @param {boolean}  inverse           A true value indicates callback should be invoked f(b,Sij)
   *
   * @return {Matrix}                    SparseMatrix (C)
   *
   * https://github.com/josdejong/mathjs/pull/346#issuecomment-97626813
   */
  var algorithm11 = function (s, b, callback, inverse) {
    // sparse matrix arrays
    var avalues = s._values;
    var aindex = s._index;
    var aptr = s._ptr;
    var asize = s._size;
    var adt = s._datatype;

    // sparse matrix cannot be a Pattern matrix
    if (!avalues)
      throw new Error('Cannot perform operation on Pattern Sparse Matrix and Scalar value');

    // rows & columns
    var rows = asize[0];
    var columns = asize[1];

    // datatype
    var dt;
    // equal signature to use
    var eq = equalScalar;
    // zero value
    var zero = 0;
    // callback signature to use
    var cf = callback;

    // process data types
    if (typeof adt === 'string') {
      // datatype
      dt = adt;
      // find signature that matches (dt, dt)
      eq = typed.find(equalScalar, [dt, dt]);
      // convert 0 to the same datatype
      zero = typed.convert(0, dt);
      // convert b to the same datatype
      b = typed.convert(b, dt);
      // callback
      cf = typed.find(callback, [dt, dt]);
    }

    // result arrays
    var cvalues = [];
    var cindex = [];
    var cptr = [];
    // matrix
    var c = new SparseMatrix({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size: [rows, columns],
      datatype: dt
    });

    // loop columns
    for (var j = 0; j < columns; j++) {
      // initialize ptr
      cptr[j] = cindex.length;
      // values in j
      for (var k0 = aptr[j], k1 = aptr[j + 1], k = k0; k < k1; k++) {
        // row
        var i = aindex[k];
        // invoke callback
        var v = inverse ? cf(b, avalues[k]) : cf(avalues[k], b);
        // check value is zero
        if (!eq(v, zero)) {
          // push index & value
          cindex.push(i);
          cvalues.push(v);
        }
      }
    }
    // update ptr
    cptr[columns] = cindex.length;

    // return sparse matrix
    return c;
  };

  return algorithm11;
}

exports.name = 'algorithm11';
exports.factory = factory;

},{"../../../function/relational/equalScalar":288}],339:[function(require,module,exports){
'use strict';

function factory (type, config, load, typed) {

  var DenseMatrix = type.DenseMatrix;

  /**
   * Iterates over SparseMatrix S nonzero items and invokes the callback function f(Sij, b). 
   * Callback function invoked MxN times.
   *
   *
   *          ┌  f(Sij, b)  ; S(i,j) !== 0
   * C(i,j) = ┤  
   *          └  f(0, b)    ; otherwise
   *
   *
   * @param {Matrix}   s                 The SparseMatrix instance (S)
   * @param {Scalar}   b                 The Scalar value
   * @param {Function} callback          The f(Aij,b) operation to invoke
   * @param {boolean}  inverse           A true value indicates callback should be invoked f(b,Sij)
   *
   * @return {Matrix}                    DenseMatrix (C)
   *
   * https://github.com/josdejong/mathjs/pull/346#issuecomment-97626813
   */
  var algorithm12 = function (s, b, callback, inverse) {
    // sparse matrix arrays
    var avalues = s._values;
    var aindex = s._index;
    var aptr = s._ptr;
    var asize = s._size;
    var adt = s._datatype;

    // sparse matrix cannot be a Pattern matrix
    if (!avalues)
      throw new Error('Cannot perform operation on Pattern Sparse Matrix and Scalar value');

    // rows & columns
    var rows = asize[0];
    var columns = asize[1];

    // datatype
    var dt;
    // callback signature to use
    var cf = callback;

    // process data types
    if (typeof adt === 'string') {
      // datatype
      dt = adt;
      // convert b to the same datatype
      b = typed.convert(b, dt);
      // callback
      cf = typed.find(callback, [dt, dt]);
    }
    
    // result arrays
    var cdata = [];
    // matrix
    var c = new DenseMatrix({
      data: cdata,
      size: [rows, columns],
      datatype: dt
    });

    // workspaces
    var x = [];
    // marks indicating we have a value in x for a given column
    var w = [];

    // loop columns
    for (var j = 0; j < columns; j++) {
      // columns mark
      var mark = j + 1;
      // values in j
      for (var k0 = aptr[j], k1 = aptr[j + 1], k = k0; k < k1; k++) {
        // row
        var r = aindex[k];
        // update workspace
        x[r] = avalues[k];
        w[r] = mark;
      }
      // loop rows
      for (var i = 0; i < rows; i++) {
        // initialize C on first column
        if (j === 0) {
          // create row array
          cdata[i] = [];
        }
        // check sparse matrix has a value @ i,j
        if (w[i] === mark) {
          // invoke callback, update C
          cdata[i][j] = inverse ? cf(b, x[i]) : cf(x[i], b);
        }
        else {
          // dense matrix value @ i, j
          cdata[i][j] = inverse ? cf(b, 0) : cf(0, b);
        }
      }
    }

    // return sparse matrix
    return c;
  };
  
  return algorithm12;
}

exports.name = 'algorithm12';
exports.factory = factory;

},{}],340:[function(require,module,exports){
'use strict';

var util = require('../../../utils/index');
var DimensionError = require('../../../error/DimensionError');

var string = util.string,
    isString = string.isString;

function factory (type, config, load, typed) {

  var DenseMatrix = type.DenseMatrix;

  /**
   * Iterates over DenseMatrix items and invokes the callback function f(Aij..z, Bij..z). 
   * Callback function invoked MxN times.
   *
   * C(i,j,...z) = f(Aij..z, Bij..z)
   *
   * @param {Matrix}   a                 The DenseMatrix instance (A)
   * @param {Matrix}   b                 The DenseMatrix instance (B)
   * @param {Function} callback          The f(Aij..z,Bij..z) operation to invoke
   *
   * @return {Matrix}                    DenseMatrix (C)
   *
   * https://github.com/josdejong/mathjs/pull/346#issuecomment-97658658
   */
  var algorithm13 = function (a, b, callback) {
    // a arrays
    var adata = a._data;
    var asize = a._size;
    var adt = a._datatype;
    // b arrays
    var bdata = b._data;
    var bsize = b._size;
    var bdt = b._datatype;
    // c arrays
    var csize = [];

    // validate dimensions
    if (asize.length !== bsize.length)
      throw new DimensionError(asize.length, bsize.length);

    // validate each one of the dimension sizes
    for (var s = 0; s < asize.length; s++) {
      // must match
      if (asize[s] !== bsize[s])
        throw new RangeError('Dimension mismatch. Matrix A (' + asize + ') must match Matrix B (' + bsize + ')');
      // update dimension in c
      csize[s] = asize[s];
    }

    // datatype
    var dt;
    // callback signature to use
    var cf = callback;

    // process data types
    if (typeof adt === 'string' && adt === bdt) {
      // datatype
      dt = adt;
      // convert b to the same datatype
      b = typed.convert(b, dt);
      // callback
      cf = typed.find(callback, [dt, dt]);
    }

    // populate cdata, iterate through dimensions
    var cdata = csize.length > 0 ? _iterate(cf, 0, csize, csize[0], adata, bdata) : [];
    
    // c matrix
    return new DenseMatrix({
      data: cdata,
      size: csize,
      datatype: dt
    });
  };
  
  // recursive function
  var _iterate = function (f, level, s, n, av, bv) {
    // initialize array for this level
    var cv = [];
    // check we reach the last level
    if (level === s.length - 1) {
      // loop arrays in last level
      for (var i = 0; i < n; i++) {
        // invoke callback and store value
        cv[i] = f(av[i], bv[i]);
      }
    }
    else {
      // iterate current level
      for (var j = 0; j < n; j++) {
        // iterate next level
        cv[j] = _iterate(f, level + 1, s, s[level + 1], av[j], bv[j]);
      }
    }
    return cv;
  };
  
  return algorithm13;
}

exports.name = 'algorithm13';
exports.factory = factory;

},{"../../../error/DimensionError":15,"../../../utils/index":359}],341:[function(require,module,exports){
'use strict';

var clone = require('../../../utils/object').clone;

function factory (type, config, load, typed) {

  var DenseMatrix = type.DenseMatrix;

  /**
   * Iterates over DenseMatrix items and invokes the callback function f(Aij..z, b). 
   * Callback function invoked MxN times.
   *
   * C(i,j,...z) = f(Aij..z, b)
   *
   * @param {Matrix}   a                 The DenseMatrix instance (A)
   * @param {Scalar}   b                 The Scalar value
   * @param {Function} callback          The f(Aij..z,b) operation to invoke
   * @param {boolean}  inverse           A true value indicates callback should be invoked f(b,Aij..z)
   *
   * @return {Matrix}                    DenseMatrix (C)
   *
   * https://github.com/josdejong/mathjs/pull/346#issuecomment-97659042
   */
  var algorithm14 = function (a, b, callback, inverse) {
    // a arrays
    var adata = a._data;
    var asize = a._size;
    var adt = a._datatype;
    
    // datatype
    var dt;
    // callback signature to use
    var cf = callback;

    // process data types
    if (typeof adt === 'string') {
      // datatype
      dt = adt;
      // convert b to the same datatype
      b = typed.convert(b, dt);
      // callback
      cf = typed.find(callback, [dt, dt]);
    }
    
    // populate cdata, iterate through dimensions
    var cdata = asize.length > 0 ? _iterate(cf, 0, asize, asize[0], adata, b, inverse) : [];

    // c matrix
    return new DenseMatrix({
      data: cdata,
      size: clone(asize),
      datatype: dt
    });
  };
  
  // recursive function
  var _iterate = function (f, level, s, n, av, bv, inverse) {
    // initialize array for this level
    var cv = [];
    // check we reach the last level
    if (level === s.length - 1) {
      // loop arrays in last level
      for (var i = 0; i < n; i++) {
        // invoke callback and store value
        cv[i] = inverse ? f(bv, av[i]) : f(av[i], bv);
      }
    }
    else {
      // iterate current level
      for (var j = 0; j < n; j++) {
        // iterate next level
        cv[j] = _iterate(f, level + 1, s, s[level + 1], av[j], bv, inverse);
      }
    }
    return cv;
  };

  return algorithm14;
}

exports.name = 'algorithm14';
exports.factory = factory;

},{"../../../utils/object":362}],342:[function(require,module,exports){
'use strict';

var deepMap = require('./../utils/collection/deepMap');

function factory (type, config, load, typed) {
  /**
   * Create a number or convert a string, boolean, or unit to a number.
   * When value is a matrix, all elements will be converted to number.
   *
   * Syntax:
   *
   *    math.number(value)
   *    math.number(unit, valuelessUnit)
   *
   * Examples:
   *
   *    math.number(2);                         // returns number 2
   *    math.number('7.2');                     // returns number 7.2
   *    math.number(true);                      // returns number 1
   *    math.number([true, false, true, true]); // returns [1, 0, 1, 1]
   *    math.number(math.unit('52cm'), 'm');    // returns 0.52
   *
   * See also:
   *
   *    bignumber, boolean, complex, index, matrix, string, unit
   *
   * @param {string | number | BigNumber | Fraction | boolean | Array | Matrix | Unit | null} [value]  Value to be converted
   * @param {Unit | string} [valuelessUnit] A valueless unit, used to convert a unit to a number
   * @return {number | Array | Matrix} The created number
   */
  var number = typed('number', {
    '': function () {
      return 0;
    },

    'number': function (x) {
      return x;
    },

    'string': function (x) {
      var num = Number(x);
      if (isNaN(num)) {
        throw new SyntaxError('String "' + x + '" is no valid number');
      }
      return num;
    },

    'BigNumber': function (x) {
      return x.toNumber();
    },

    'Fraction': function (x) {
      return x.valueOf();
    },

    'Unit': function (x) {
      throw new Error('Second argument with valueless unit expected');
    },

    'Unit, string | Unit': function (unit, valuelessUnit) {
      return unit.toNumber(valuelessUnit);
    },

    'Array | Matrix': function (x) {
      return deepMap(x, number);
    }
  });

  number.toTex = {
    0: '0',
    1: '\\left(${args[0]}\\right)',
    2: '\\left(\\left(${args[0]}\\right)${args[1]}\\right)'
  };

  return number;
}

exports.name = 'number';
exports.factory = factory;

},{"./../utils/collection/deepMap":353}],343:[function(require,module,exports){
'use strict';

function factory (type, config, load, typed) {
  /**
   * A ResultSet contains a list or results
   * @class ResultSet
   * @param {Array} entries
   * @constructor ResultSet
   */
  function ResultSet(entries) {
    if (!(this instanceof ResultSet)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }

    this.entries = entries || [];
  }

  /**
   * Attach type information
   */
  ResultSet.prototype.type = 'ResultSet';
  ResultSet.prototype.isResultSet = true;

  /**
   * Returns the array with results hold by this ResultSet
   * @memberof ResultSet
   * @returns {Array} entries
   */
  ResultSet.prototype.valueOf = function () {
    return this.entries;
  };

  /**
   * Returns the stringified results of the ResultSet
   * @memberof ResultSet
   * @returns {string} string
   */
  ResultSet.prototype.toString = function () {
    return '[' + this.entries.join(', ') + ']';
  };

  /**
   * Get a JSON representation of the ResultSet
   * @memberof ResultSet
   * @returns {Object} Returns a JSON object structured as:
   *                   `{"mathjs": "ResultSet", "entries": [...]}`
   */
  ResultSet.prototype.toJSON = function () {
    return {
      mathjs: 'ResultSet',
      entries: this.entries
    };
  };

  /**
   * Instantiate a ResultSet from a JSON object
   * @memberof ResultSet
   * @param {Object} json  A JSON object structured as:
   *                       `{"mathjs": "ResultSet", "entries": [...]}`
   * @return {ResultSet}
   */
  ResultSet.fromJSON = function (json) {
    return new ResultSet(json.entries);
  };

  return ResultSet;
}

exports.name = 'ResultSet';
exports.path = 'type';
exports.factory = factory;

},{}],344:[function(require,module,exports){
'use strict';

var endsWith = require('../../utils/string').endsWith;
var clone = require('../../utils/object').clone;
var constants = require('../../utils/bignumber/constants');

function factory (type, config, load, typed, math) {
  var add       = load(require('../../function/arithmetic/addScalar'));
  var subtract  = load(require('../../function/arithmetic/subtract'));
  var multiply  = load(require('../../function/arithmetic/multiplyScalar'));
  var divide    = load(require('../../function/arithmetic/divideScalar'));
  var pow       = load(require('../../function/arithmetic/pow'));
  var abs       = load(require('../../function/arithmetic/abs'));
  var fix       = load(require('../../function/arithmetic/fix'));
  var equal     = load(require('../../function/relational/equal'));
  var isNumeric = load(require('../../function/utils/isNumeric'));
  var format    = load(require('../../function/string/format'));
  var getTypeOf = load(require('../../function/utils/typeof'));
  var toNumber  = load(require('../../type/number'));
  var Complex   = load(require('../../type/complex/Complex'));

  /**
   * A unit can be constructed in the following ways:
   *     var a = new Unit(value, name);
   *     var b = new Unit(null, name);
   *     var c = Unit.parse(str);
   *
   * Example usage:
   *     var a = new Unit(5, 'cm');               // 50 mm
   *     var b = Unit.parse('23 kg');             // 23 kg
   *     var c = math.in(a, new Unit(null, 'm');  // 0.05 m
   *     var d = new Unit(9.81, "m/s^2");         // 9.81 m/s^2
   *
   * @class Unit
   * @constructor Unit
   * @param {number | BigNumber | Fraction | Complex | boolean} [value]  A value like 5.2
   * @param {string} [name]   A unit name like "cm" or "inch", or a derived unit of the form: "u1[^ex1] [u2[^ex2] ...] [/ u3[^ex3] [u4[^ex4]]]", such as "kg m^2/s^2", where each unit appearing after the forward slash is taken to be in the denominator. "kg m^2 s^-2" is a synonym and is also acceptable. Any of the units can include a prefix.
   */
  function Unit(value, name) {
    if (!(this instanceof Unit)) {
      throw new Error('Constructor must be called with the new operator');
    }

    if (!(value === undefined || isNumeric(value) || value.isComplex)) {
      throw new TypeError('First parameter in Unit constructor must be number, BigNumber, Fraction, Complex, or undefined');
    }
    if (name != undefined && (typeof name !== 'string' || name == '')) {
      throw new TypeError('Second parameter in Unit constructor must be a string');
    }

    if (name != undefined) {
      var u = Unit.parse(name);
      this.units = u.units;
      this.dimensions = u.dimensions;
    }
    else {
      this.units = [
        {
          unit: UNIT_NONE,
          prefix: PREFIXES.NONE,  // link to a list with supported prefixes
          power: 0
        }
      ];
      this.dimensions = []; 
      for(var i=0; i<BASE_DIMENSIONS.length; i++) {
        this.dimensions[i] = 0;
      }
    }

    this.value = (value != undefined) ? this._normalize(value) : null;

    this.fixPrefix = false; // if true, function format will not search for the
                            // best prefix but leave it as initially provided.
                            // fixPrefix is set true by the method Unit.to

    // The justification behind this is that if the constructor is explicitly called,
    // the caller wishes the units to be returned exactly as he supplied.
    this.isUnitListSimplified = true;

  }

  /**
   * Attach type information
   */
  Unit.prototype.type = 'Unit';
  Unit.prototype.isUnit = true;

  // private variables and functions for the Unit parser
  var text, index, c;

  function skipWhitespace() {
    while (c == ' ' || c == '\t') {
      next();
    }
  }

  function isDigitDot(c) {
    return ((c >= '0' && c <= '9') || c == '.');
  }

  function isDigit(c) {
    return ((c >= '0' && c <= '9'));
  }

  function next() {
    index++;
    c = text.charAt(index);
  }

  function revert(oldIndex) {
    index = oldIndex;
    c = text.charAt(index);
  }

  function parseNumber() {
    var number = '';
    var oldIndex;
    oldIndex = index;

    if (c == '+') {
      next();
    }
    else if (c == '-') {
      number += c;
      next();
    }

    if (!isDigitDot(c)) {
      // a + or - must be followed by a digit
      revert(oldIndex);
      return null;
    }

    // get number, can have a single dot
    if (c == '.') {
      number += c;
      next();
      if (!isDigit(c)) {
        // this is no legal number, it is just a dot
        revert(oldIndex);
        return null;
      }
    }
    else {
      while (isDigit(c)) {
        number += c;
        next();
      }
      if (c == '.') {
        number += c;
        next();
      }
    }
    while (isDigit(c)) {
      number += c;
      next();
    }

    // check for exponential notation like "2.3e-4" or "1.23e50"
    if (c == 'E' || c == 'e') {
      // The grammar branches here. This could either be part of an exponent or the start of a unit that begins with the letter e, such as "4exabytes"

      var tentativeNumber = '';
      var tentativeIndex = index;

      tentativeNumber += c;
      next();

      if (c == '+' || c == '-') {
        tentativeNumber += c;
        next();
      }

      // Scientific notation MUST be followed by an exponent (otherwise we assume it is not scientific notation)
      if (!isDigit(c)) {
        // The e or E must belong to something else, so return the number without the e or E.
        revert(tentativeIndex);
        return number;
      }
      
      // We can now safely say that this is scientific notation.
      number = number + tentativeNumber;
      while (isDigit(c)) {
        number += c;
        next();
      }
    }

    return number;
  }

  function parseUnit() {
    var unitName = '';

    // Alphanumeric characters only; matches [a-zA-Z0-9]
    var code = text.charCodeAt(index);
    while ( (code >= 48 && code <= 57) ||
            (code >= 65 && code <= 90) ||
            (code >= 97 && code <= 122)) {
      unitName += c;
      next();
      code = text.charCodeAt(index);
    }

    // Must begin with [a-zA-Z]
    code = unitName.charCodeAt(0);
    if ((code >= 65 && code <= 90) ||
        (code >= 97 && code <= 122)) {
        return unitName || null;
    } 
    else {
      return null;
    }
  }

  function parseCharacter(toFind) {
    if (c === toFind) {
      next();
      return toFind;
    }
    else {
      return null;
    }
  }

  /**
   * Parse a string into a unit. The value of the unit is parsed as number,
   * BigNumber, or Fraction depending on the math.js config setting `number`.
   *
   * Throws an exception if the provided string does not contain a valid unit or
   * cannot be parsed.
   * @memberof Unit
   * @param {string} str        A string like "5.2 inch", "4e2 cm/s^2"
   * @return {Unit} unit
   */
  Unit.parse = function (str, options) {
    options = options || {};
    text = str;
    index = -1;
    c = '';

    if (typeof text !== 'string') {
      throw new TypeError('Invalid argument in Unit.parse, string expected');
    }

    var unit = new Unit();
    unit.units = [];

    // A unit should follow this pattern:
    // [number]unit[^number] [unit[^number]]...[/unit[^number] [unit[^number]]]

    // Rules:
    // number is any floating point number.
    // unit is any alphanumeric string beginning with an alpha. Units with names like e3 should be avoided because they look like the exponent of a floating point number!
    // The string may optionally begin with a number.
    // Each unit may optionally be followed by ^number.
    // Whitespace or a forward slash is recommended between consecutive units, although the following technically is parseable:
    //   2m^2kg/s^2
    // it is not good form. If a unit starts with e, then it could be confused as a floating point number:
    //   4erg

    next();
    skipWhitespace();
    // Optional number at the start of the string
    var valueStr = parseNumber();
    var value = null;
    if(valueStr) {
      if (config.number === 'BigNumber') {
        value = new type.BigNumber(valueStr);
      }
      else if (config.number === 'Fraction') {
        value = new type.Fraction(valueStr);
      }
      else { // number
        value = parseFloat(valueStr);
      }
    }
    skipWhitespace();    // Whitespace is not required here

    // Next, we read any number of unit[^number]
    var powerMultiplierCurrent = 1;
    var expectingUnit = false;

    // Stack to keep track of powerMultipliers applied to each parentheses group
    var powerMultiplierStack = [];

    // Running product of all elements in powerMultiplierStack
    var powerMultiplierStackProduct = 1;

    while (true) {
      skipWhitespace();

      // Check for and consume opening parentheses, pushing powerMultiplierCurrent to the stack
      // A '(' will always appear directly before a unit.
      while (c === '(') {
        powerMultiplierStack.push(powerMultiplierCurrent);
        powerMultiplierStackProduct *= powerMultiplierCurrent;
        powerMultiplierCurrent = 1;
        next();
        skipWhitespace();
      }

      // Is there something here?
      if(c) {
        var oldC = c;
        var uStr = parseUnit();
        if(uStr == null) {
          throw new SyntaxError('Unexpected "' + oldC + '" in "' + text + '" at index ' + index.toString());
        }
      }
      else {
        // End of input.
        break;
      }

      // Verify the unit exists and get the prefix (if any)
      var res = _findUnit(uStr);
      if(res == null) {
        // Unit not found.
        throw new SyntaxError('Unit "' + uStr + '" not found.');
      }

      var power = powerMultiplierCurrent * powerMultiplierStackProduct;
      // Is there a "^ number"?
      skipWhitespace();
      if (parseCharacter('^')) {
        skipWhitespace();
        var p = parseNumber();
        if(p == null) {
          // No valid number found for the power!
          throw new SyntaxError('In "' + str + '", "^" must be followed by a floating-point number');
        }
        power *= p;
      }

      // Add the unit to the list
      unit.units.push( {
        unit: res.unit,
        prefix: res.prefix,
        power: power
      });
      for(var i=0; i<BASE_DIMENSIONS.length; i++) {
        unit.dimensions[i] += (res.unit.dimensions[i] || 0) * power;
      }

      // Check for and consume closing parentheses, popping from the stack.
      // A ')' will always follow a unit.
      skipWhitespace();
      while (c === ')') {
        if(powerMultiplierStack.length === 0) {
          throw new SyntaxError('Unmatched ")" in "' + text + '" at index ' + index.toString());
        }
        powerMultiplierStackProduct /= powerMultiplierStack.pop();
        next();
        skipWhitespace();
      }

      // "*" and "/" should mean we are expecting something to come next.
      // Is there a forward slash? If so, negate powerMultiplierCurrent. The next unit or paren group is in the denominator.
      expectingUnit = false;

      if (parseCharacter('*')) {
        // explicit multiplication
        powerMultiplierCurrent = 1;
        expectingUnit = true;
      }
      else if (parseCharacter('/')) {
        // division
        powerMultiplierCurrent = -1;
        expectingUnit = true;
      }
      else {
        // implicit multiplication
        powerMultiplierCurrent = 1;
      }

      // Replace the unit into the auto unit system
      if(res.unit.base) {
        var baseDim = res.unit.base.key;
        UNIT_SYSTEMS.auto[baseDim] = {
          unit: res.unit,
          prefix: res.prefix
        };
      }
    }
    
    // Has the string been entirely consumed?
    skipWhitespace();
    if(c) {
      throw new SyntaxError('Could not parse: "' + str + '"');
    }

    // Is there a trailing slash?
    if(expectingUnit) {
      throw new SyntaxError('Trailing characters: "' + str + '"');
    }

    // Is the parentheses stack empty?
    if(powerMultiplierStack.length !== 0) {
      throw new SyntaxError('Unmatched "(" in "' + text + '"');
    }

    // Are there any units at all?
    if(unit.units.length == 0 && !options.allowNoUnits) {
      throw new SyntaxError('"' + str + '" contains no units');
    }

    unit.value = (value != undefined) ? unit._normalize(value) : null;
    return unit;
  };

  /**
   * create a copy of this unit
   * @memberof Unit
   * @return {Unit} Returns a cloned version of the unit
   */
  Unit.prototype.clone = function () {
    var unit = new Unit();

    unit.fixPrefix = this.fixPrefix;
    unit.isUnitListSimplified = this.isUnitListSimplified;

    unit.value = clone(this.value);
    unit.dimensions = this.dimensions.slice(0);
    unit.units = [];
    for(var i = 0; i < this.units.length; i++) {
      unit.units[i] = { };
      for (var p in this.units[i]) {
        if (this.units[i].hasOwnProperty(p)) {
          unit.units[i][p] = this.units[i][p];
        }
      }
    }

    return unit;
  };

  /**
   * Return whether the unit is derived (such as m/s, or cm^2, but not N)
   * @memberof Unit
   * @return {boolean} True if the unit is derived
   */
  Unit.prototype._isDerived = function() {
    if(this.units.length === 0) {
      return false;
    }
    return this.units.length > 1 || Math.abs(this.units[0].power - 1.0) > 1e-15;
  };

  /**
   * Normalize a value, based on its currently set unit(s)
   * @memberof Unit
   * @param {number | BigNumber | Fraction | boolean} value
   * @return {number | BigNumber | Fraction | boolean} normalized value
   * @private
   */
  Unit.prototype._normalize = function (value) {
    var unitValue, unitOffset, unitPower, unitPrefixValue;
    var convert;

    if (value == null || this.units.length === 0) {
      return value;
    }
    else if (this._isDerived()) {
      // This is a derived unit, so do not apply offsets.
      // For example, with J kg^-1 degC^-1 you would NOT want to apply the offset.
      var res = value;
      convert = Unit._getNumberConverter(getTypeOf(value)); // convert to Fraction or BigNumber if needed

      for(var i=0; i < this.units.length; i++) {
        unitValue       = convert(this.units[i].unit.value);
        unitPrefixValue = convert(this.units[i].prefix.value);
        unitPower       = convert(this.units[i].power);
        res = multiply(res, pow(multiply(unitValue, unitPrefixValue), unitPower));
      }

      return res;
    }
    else {
      // This is a single unit of power 1, like kg or degC
      convert = Unit._getNumberConverter(getTypeOf(value)); // convert to Fraction or BigNumber if needed

      unitValue       = convert(this.units[0].unit.value);
      unitOffset      = convert(this.units[0].unit.offset);
      unitPrefixValue = convert(this.units[0].prefix.value);

      return multiply(add(value, unitOffset), multiply(unitValue, unitPrefixValue));
    }
  };

  /**
   * Denormalize a value, based on its currently set unit(s)
   * @memberof Unit
   * @param {number} value
   * @param {number} [prefixValue]    Optional prefix value to be used (ignored if this is a derived unit)
   * @return {number} denormalized value
   * @private
   */
  Unit.prototype._denormalize = function (value, prefixValue) {
    var unitValue, unitOffset, unitPower, unitPrefixValue;
    var convert;

    if (value == null || this.units.length === 0) {
      return value;
    }
    else if (this._isDerived()) {
      // This is a derived unit, so do not apply offsets.
      // For example, with J kg^-1 degC^-1 you would NOT want to apply the offset.
      // Also, prefixValue is ignored--but we will still use the prefix value stored in each unit, since kg is usually preferable to g unless the user decides otherwise.
      var res = value;
      convert = Unit._getNumberConverter(getTypeOf(value)); // convert to Fraction or BigNumber if needed

      for (var i = 0; i < this.units.length; i++) {
        unitValue       = convert(this.units[i].unit.value);
        unitPrefixValue = convert(this.units[i].prefix.value);
        unitPower       = convert(this.units[i].power);
        res = divide(res, pow(multiply(unitValue, unitPrefixValue), unitPower));
      }

      return res;
    }
    else {
      // This is a single unit of power 1, like kg or degC
      convert = Unit._getNumberConverter(getTypeOf(value)); // convert to Fraction or BigNumber if needed

      unitValue       = convert(this.units[0].unit.value);
      unitPrefixValue = convert(this.units[0].prefix.value);
      unitOffset      = convert(this.units[0].unit.offset);

      if (prefixValue == undefined) {
        return subtract(divide(divide(value, unitValue), unitPrefixValue), unitOffset);
      }
      else {
        return subtract(divide(divide(value, unitValue), prefixValue), unitOffset);
      }
    }
  };

  /**
   * Find a unit from a string
   * @memberof Unit
   * @param {string} str              A string like 'cm' or 'inch'
   * @returns {Object | null} result  When found, an object with fields unit and
   *                                  prefix is returned. Else, null is returned.
   * @private
   */
  function _findUnit(str) {
  
    // First, match units names exactly. For example, a user could define 'mm' as 10^-4 m, which is silly, but then we would want 'mm' to match the user-defined unit.
    if(UNITS.hasOwnProperty(str)) {
      var unit = UNITS[str];
      var prefix = unit.prefixes[''];
      return {
        unit: unit,
        prefix: prefix
      }
    }

    for (var name in UNITS) {
      if (UNITS.hasOwnProperty(name)) {
        if (endsWith(str, name)) {
          var unit = UNITS[name];
          var prefixLen = (str.length - name.length);
          var prefixName = str.substring(0, prefixLen);
          var prefix = unit.prefixes[prefixName];
          if (prefix !== undefined) {
            // store unit, prefix, and value
            return {
              unit: unit,
              prefix: prefix
            };
          }
        }
      }
    }

    return null;
  }

  /**
   * Test if the given expression is a unit.
   * The unit can have a prefix but cannot have a value.
   * @memberof Unit
   * @param {string} name   A string to be tested whether it is a value less unit.
   *                        The unit can have prefix, like "cm"
   * @return {boolean}      true if the given string is a unit
   */
  Unit.isValuelessUnit = function (name) {
    return (_findUnit(name) != null);
  };

  /**
   * check if this unit has given base unit
   * If this unit is a derived unit, this will ALWAYS return false, since by definition base units are not derived.
   * @memberof Unit
   * @param {BASE_UNITS | string | undefined} base
   */
  Unit.prototype.hasBase = function (base) {

    if(typeof(base) === "string") {
      base = BASE_UNITS[base];
    }

    if(!base)
      return false;


    // All dimensions must be the same
    for(var i=0; i<BASE_DIMENSIONS.length; i++) {
      if (Math.abs((this.dimensions[i] || 0) - (base.dimensions[i] || 0)) > 1e-12) {
        return false;
      }
    }
    return true;

  };

  /**
   * Check if this unit has a base or bases equal to another base or bases
   * For derived units, the exponent on each base also must match
   * @memberof Unit
   * @param {Unit} other
   * @return {boolean} true if equal base
   */
  Unit.prototype.equalBase = function (other) {
    // All dimensions must be the same
    for(var i=0; i<BASE_DIMENSIONS.length; i++) {
      if (Math.abs((this.dimensions[i] || 0) - (other.dimensions[i] || 0)) > 1e-12) {
        return false;
      }
    }
    return true;
  };

  /**
   * Check if this unit equals another unit
   * @memberof Unit
   * @param {Unit} other
   * @return {boolean} true if both units are equal
   */
  Unit.prototype.equals = function (other) {
    return (this.equalBase(other) && equal(this.value, other.value));
  };

  /**
   * Multiply this unit with another one
   * @memberof Unit
   * @param {Unit} other
   * @return {Unit} product of this unit and the other unit
   */
  Unit.prototype.multiply = function (other) {
    var res = this.clone();
    
    for(var i = 0; i<BASE_DIMENSIONS.length; i++) {
      // Dimensions arrays may be of different lengths. Default to 0.
      res.dimensions[i] = (this.dimensions[i] || 0) + (other.dimensions[i] || 0);
    }

    // Append other's units list onto res (simplify later in Unit.prototype.format)
    for(var i=0; i<other.units.length; i++) {
      // Make a deep copy
      var inverted = {};
      for(var key in other.units[i]) {
        inverted[key] = other.units[i][key];
      }
      res.units.push(inverted);
    }

    // If at least one operand has a value, then the result should also have a value
    if(this.value != null || other.value != null) {
      var valThis = this.value == null ? this._normalize(1) : this.value;
      var valOther = other.value == null ? other._normalize(1) : other.value;
      res.value = multiply(valThis, valOther);
    }
    else {
      res.value = null;
    }

    // Trigger simplification of the unit list at some future time
    res.isUnitListSimplified = false;

    return getNumericIfUnitless(res);
  };

  /**
   * Divide this unit by another one
   * @memberof Unit
   * @param {Unit} other
   * @return {Unit} result of dividing this unit by the other unit
   */
  Unit.prototype.divide = function (other) {
    var res = this.clone();
    
    for(var i=0; i<BASE_DIMENSIONS.length; i++) {
      // Dimensions arrays may be of different lengths. Default to 0.
      res.dimensions[i] = (this.dimensions[i] || 0) - (other.dimensions[i] || 0);
    }

    // Invert and append other's units list onto res (simplify later in Unit.prototype.format)
    for(var i=0; i<other.units.length; i++) {
      // Make a deep copy
      var inverted = {};
      for(var key in other.units[i]) {
        inverted[key] = other.units[i][key];
      }
      inverted.power = -inverted.power;
      res.units.push(inverted);
    }

    // If at least one operand has a value, the result should have a value
    if (this.value != null || other.value != null) {
      var valThis = this.value == null ? this._normalize(1) : this.value;
      var valOther = other.value == null ? other._normalize(1) : other.value;
      res.value = divide(valThis, valOther);
    }
    else {
      res.value = null;
    }

    // Trigger simplification of the unit list at some future time
    res.isUnitListSimplified = false;

    return getNumericIfUnitless(res);
  };

  /**
   * Calculate the power of a unit
   * @memberof Unit
   * @param {number | Fraction | BigNumber} p
   * @returns {Unit}      The result: this^p
   */
  Unit.prototype.pow = function (p) {
    var res = this.clone();
    
    for(var i=0; i<BASE_DIMENSIONS.length; i++) {
      // Dimensions arrays may be of different lengths. Default to 0.
      res.dimensions[i] = (this.dimensions[i] || 0) * p;
    }

    // Adjust the power of each unit in the list
    for(var i=0; i<res.units.length; i++) {
      res.units[i].power *= p;
    }

    if(res.value != null) {
      res.value = pow(res.value, p);

      // only allow numeric output, we don't want to return a Complex number
      //if (!isNumeric(res.value)) {
      //  res.value = NaN;
      //}
      // Update: Complex supported now
    }
    else {
      res.value = null;
    }

    // Trigger lazy evaluation of the unit list
    res.isUnitListSimplified = false;

    return getNumericIfUnitless(res);
  };

  /**
   * Return the numeric value of this unit if it is dimensionless, has a value, and config.predictable == false; or the original unit otherwise
   * @param {Unit} unit
   * @returns {number | Fraction | BigNumber | Unit}  The numeric value of the unit if conditions are met, or the original unit otherwise
   */
  var getNumericIfUnitless = function(unit) {
    if(unit.equalBase(BASE_UNITS.NONE) && unit.value !== null && !config.predictable) {
      return unit.value;
    }
    else {
      return unit;
    }
  }
    

  /**
   * Calculate the absolute value of a unit
   * @memberof Unit
   * @param {number | Fraction | BigNumber} x
   * @returns {Unit}      The result: |x|, absolute value of x
   */
  Unit.prototype.abs = function () {
    // This gives correct, but unexpected, results for units with an offset.
    // For example, abs(-283.15 degC) = -263.15 degC !!!
    var ret = this.clone();
    ret.value = abs(ret.value);

    for(var i in ret.units) {
      if(ret.units[i].unit.name === 'VA' || ret.units[i].unit.name === 'VAR') {
        ret.units[i].unit = UNITS["W"];
      }
    }

    return ret;
  };

  /**
   * Convert the unit to a specific unit name.
   * @memberof Unit
   * @param {string | Unit} valuelessUnit   A unit without value. Can have prefix, like "cm"
   * @returns {Unit} Returns a clone of the unit with a fixed prefix and unit.
   */
  Unit.prototype.to = function (valuelessUnit) {
    var other;
    var value = this.value == null ? this._normalize(1) : this.value;
    if (typeof valuelessUnit === 'string') {
      //other = new Unit(null, valuelessUnit);
      other = Unit.parse(valuelessUnit);
      if (!this.equalBase(other)) {
        throw new Error('Units do not match');
      }
      if (other.value !== null) {
        throw new Error('Cannot convert to a unit with a value');
      }

      other.value = clone(value);
      other.fixPrefix = true;
      other.isUnitListSimplified = true;
      return other;
    }
    else if (valuelessUnit && valuelessUnit.isUnit) {
      if (!this.equalBase(valuelessUnit)) {
        throw new Error('Units do not match');
      }
      if (valuelessUnit.value !== null) {
        throw new Error('Cannot convert to a unit with a value');
      }
      other = valuelessUnit.clone();
      other.value = clone(value);
      other.fixPrefix = true;
      other.isUnitListSimplified = true;
      return other;
    }
    else {
      throw new Error('String or Unit expected as parameter');
    }
  };

  /**
   * Return the value of the unit when represented with given valueless unit
   * @memberof Unit
   * @param {string | Unit} valuelessUnit    For example 'cm' or 'inch'
   * @return {number} Returns the unit value as number.
   */
  // TODO: deprecate Unit.toNumber? It's always better to use toNumeric
  Unit.prototype.toNumber = function (valuelessUnit) {
    return toNumber(this.toNumeric(valuelessUnit));
  };

  /**
   * Return the value of the unit in the original numeric type
   * @memberof Unit
   * @param {string | Unit} valuelessUnit    For example 'cm' or 'inch'
   * @return {number | BigNumber | Fraction} Returns the unit value
   */
  Unit.prototype.toNumeric = function (valuelessUnit) {
    var other = this;
    if(valuelessUnit) {
      // Allow getting the numeric value without converting to a different unit
      other = this.to(valuelessUnit);
    }

    if(other._isDerived()) {
      return other._denormalize(other.value);
    }
    else {
      return other._denormalize(other.value, other.units[0].prefix.value);
    }
  };

  /**
   * Get a string representation of the unit.
   * @memberof Unit
   * @return {string}
   */
  Unit.prototype.toString = function () {
    return this.format();
  };

  /**
   * Get a JSON representation of the unit
   * @memberof Unit
   * @returns {Object} Returns a JSON object structured as:
   *                   `{"mathjs": "Unit", "value": 2, "unit": "cm", "fixPrefix": false}`
   */
  Unit.prototype.toJSON = function () {
    return {
      mathjs: 'Unit',
      value: this._denormalize(this.value),
      unit: this.formatUnits(),
      fixPrefix: this.fixPrefix
    };
  };

  /**
   * Instantiate a Unit from a JSON object
   * @memberof Unit
   * @param {Object} json  A JSON object structured as:
   *                       `{"mathjs": "Unit", "value": 2, "unit": "cm", "fixPrefix": false}`
   * @return {Unit}
   */
  Unit.fromJSON = function (json) {
    var unit = new Unit(json.value, json.unit);
    unit.fixPrefix = json.fixPrefix || false;
    return unit;
  };

  /**
   * Returns the string representation of the unit.
   * @memberof Unit
   * @return {string}
   */
  Unit.prototype.valueOf = Unit.prototype.toString;

  /**
   * Attempt to simplify the list of units for this unit according to the dimensions array and the current unit system. After the call, this Unit will contain a list of the "best" units for formatting.
   * Intended to be evaluated lazily. You must set isUnitListSimplified = false before the call! After the call, isUnitListSimplified will be set to true.
   */
  Unit.prototype.simplifyUnitListLazy = function() {

    if (this.isUnitListSimplified || this.value == null) {
      return;
    }

    var proposedUnitList = [];

    // Search for a matching base
    var matchingBase;
    for(var key in currentUnitSystem) {
      if(this.hasBase(BASE_UNITS[key])) {
        matchingBase = key;
        break;
      }
    }

    if(matchingBase === 'NONE')
    {
      this.units = [];
    }
    else {
      var matchingUnit;
      if(matchingBase) {
        // Does the unit system have a matching unit?
        if(currentUnitSystem.hasOwnProperty(matchingBase)) {
          matchingUnit = currentUnitSystem[matchingBase];
        }
      }
      var value;
      var str;
      if(matchingUnit) {
        this.units = [{
          unit: matchingUnit.unit,
          prefix: matchingUnit.prefix,
          power: 1.0
        }];
      }
      else {
        // Multiple units or units with powers are formatted like this:
        // 5 (kg m^2) / (s^3 mol)
        // Build an representation from the base units of the current unit system
        var missingBaseDim = false;
        for(var i=0; i<BASE_DIMENSIONS.length; i++) {
          var baseDim = BASE_DIMENSIONS[i];
          if(Math.abs(this.dimensions[i] || 0) > 1e-12) {
            if(currentUnitSystem.hasOwnProperty(baseDim)) {
              proposedUnitList.push({
                unit: currentUnitSystem[baseDim].unit,
                prefix: currentUnitSystem[baseDim].prefix,
                power: this.dimensions[i] || 0
              });
            }
            else {
              missingBaseDim = true;
            }
          }
        }
        var util = require('util');

        // Is the proposed unit list "simpler" than the existing one?
        if(proposedUnitList.length < this.units.length && !missingBaseDim) {
          // Replace this unit list with the proposed list
          this.units = proposedUnitList;
        }
      }
    }

    this.isUnitListSimplified = true;
  };

  /**
   * Get a string representation of the units of this Unit, without the value.
   * @memberof Unit
   * @return {string}
   */
  Unit.prototype.formatUnits = function () {

    // Lazy evaluation of the unit list
    this.simplifyUnitListLazy();

    var strNum = "";
    var strDen = "";
    var nNum = 0;
    var nDen = 0;

    for(var i=0; i<this.units.length; i++) {
      if(this.units[i].power > 0) {
        nNum++;
        strNum += " " + this.units[i].prefix.name + this.units[i].unit.name;
        if(Math.abs(this.units[i].power - 1.0) > 1e-15) {
          strNum += "^" + this.units[i].power;
        }
      }
      else if(this.units[i].power < 0) {
        nDen++;
      }
    }

    if(nDen > 0) {
      for(var i=0; i<this.units.length; i++) {
        if(this.units[i].power < 0) {
          if(nNum > 0) {
            strDen += " " + this.units[i].prefix.name + this.units[i].unit.name;
            if(Math.abs(this.units[i].power + 1.0) > 1e-15) {
              strDen += "^" + (-this.units[i].power);
            }
          }
          else {
            strDen += " " + this.units[i].prefix.name + this.units[i].unit.name;
            strDen += "^" + (this.units[i].power);
          }
        }
      }
    }
    // Remove leading " "
    strNum = strNum.substr(1);
    strDen = strDen.substr(1);

    // Add parans for better copy/paste back into the eval, for example, or for better pretty print formatting
    if(nNum > 1 && nDen > 0) {
      strNum = "(" + strNum + ")";
    }
    if(nDen > 1 && nNum > 0) {
      strDen = "(" + strDen + ")";
    }

    var str = strNum;
    if(nNum > 0 && nDen > 0) {
      str += " / ";
    }
    str += strDen;

    return str;
  };

  /**
   * Get a string representation of the Unit, with optional formatting options.
   * @memberof Unit
   * @param {Object | number | Function} [options]  Formatting options. See
   *                                                lib/utils/number:format for a
   *                                                description of the available
   *                                                options.
   * @return {string}
   */
  Unit.prototype.format = function (options) {

    // Simplfy the unit list, if necessary
    this.simplifyUnitListLazy();

    // Apply some custom logic for handling VA and VAR. The goal is to express the value of the unit as a real value, if possible. Otherwise, use a real-valued unit instead of a complex-valued one.
    var isImaginary = false;
    var isReal = true;
    if(typeof(this.value) !== 'undefined' && this.value !== null && this.value.isComplex) {
      // TODO: Make this better, for example, use relative magnitude of re and im rather than absolute
      isImaginary = Math.abs(this.value.re) < 1e-14;
      isReal = Math.abs(this.value.im) < 1e-14;
    }
    
    for(var i in this.units) {
      if(this.units[i].unit) {
        if(this.units[i].unit.name === 'VA' && isImaginary) {
          this.units[i].unit = UNITS["VAR"];
        }
        else if(this.units[i].unit.name === 'VAR' && !isImaginary) {
          this.units[i].unit = UNITS["VA"];
        }
      }
    }


    // Now apply the best prefix
    // Units must have only one unit and not have the fixPrefix flag set
    if (this.units.length === 1 && !this.fixPrefix) {
      // Units must have integer powers, otherwise the prefix will change the
      // outputted value by not-an-integer-power-of-ten
      if (Math.abs(this.units[0].power - Math.round(this.units[0].power)) < 1e-14) {
        // Apply the best prefix
        this.units[0].prefix = this._bestPrefix();
      }
    }


    var value = this._denormalize(this.value);
    var str = (this.value !== null) ? format(value, options || {}) : '';
    var unitStr = this.formatUnits();
    if(this.value && this.value.isComplex) {
      str = "(" + str + ")";    // Surround complex values with ( ) to enable better parsing 
    }
    if(unitStr.length > 0 && str.length > 0) {
      str += " ";
    }
    str += unitStr;

    return str;
  };

  /**
   * Calculate the best prefix using current value.
   * @memberof Unit
   * @returns {Object} prefix
   * @private
   */
  Unit.prototype._bestPrefix = function () {
    if (this.units.length !== 1) {
      throw new Error("Can only compute the best prefix for single units with integer powers, like kg, s^2, N^-1, and so forth!");
    }
    if (Math.abs(this.units[0].power - Math.round(this.units[0].power)) >= 1e-14) {
      throw new Error("Can only compute the best prefix for single units with integer powers, like kg, s^2, N^-1, and so forth!");
    }

    // find the best prefix value (resulting in the value of which
    // the absolute value of the log10 is closest to zero,
    // though with a little offset of 1.2 for nicer values: you get a
    // sequence 1mm 100mm 500mm 0.6m 1m 10m 100m 500m 0.6km 1km ...

    // Note: the units value can be any numeric type, but to find the best
    // prefix it's enough to work with limited precision of a regular number
    // Update: using mathjs abs since we also allow complex numbers
    var absValue = abs(this.value);
    var absUnitValue = abs(this.units[0].unit.value);
    var bestPrefix = this.units[0].prefix;
    if (absValue === 0) {
      return bestPrefix;
    }
    var power = this.units[0].power;
    var bestDiff = Math.log(absValue / Math.pow(bestPrefix.value * absUnitValue, power)) / Math.LN10 - 1.2;
    if(bestDiff > -2.200001 && bestDiff < 1.800001) return bestPrefix;    // Allow the original prefix
    bestDiff = Math.abs(bestDiff);
    var prefixes = this.units[0].unit.prefixes;
    for (var p in prefixes) {
      if (prefixes.hasOwnProperty(p)) {
        var prefix = prefixes[p];
        if (prefix.scientific) {

          var diff = Math.abs(
              Math.log(absValue / Math.pow(prefix.value * absUnitValue, power)) / Math.LN10 - 1.2);

          if (diff < bestDiff
              || (diff === bestDiff && prefix.name.length < bestPrefix.name.length)) {
                // choose the prefix with the smallest diff, or if equal, choose the one
                // with the shortest name (can happen with SHORTLONG for example)
                bestPrefix = prefix;
                bestDiff = diff;
          }
        }
      }
    }

    return bestPrefix;
  };

  /**
   * Returns an array of units whose sum is equal to this unit
   * @memberof Unit
   * @param {Array} [parts] An array of strings or valueless units. 
   *
   *   Example:
   *
   *   var u = new Unit(1, 'm');
   *   u.splitUnit(['feet', 'inch']);
   *     [ 3 feet, 3.3700787401575 inch ]
   *
   * @return {Array} An array of units.
   */
  Unit.prototype.splitUnit = function(parts) {

    var x = this.clone();
    var ret = [];
    for(var i=0; i<parts.length; i++) {
      x = x.to(parts[i]);
      if(i==parts.length-1) break;
      // fix rounds a number towards 0
      var fixedVal = fix(x.toNumeric());
      var y = new Unit(fixedVal, parts[i].toString());
      ret.push(y);
      x = subtract(x, y);
    }
    ret.push(x);

    return ret;
  };

  var PREFIXES = {
    NONE: {
      '': {name: '', value: 1, scientific: true}
    },
    SHORT: {
      '': {name: '', value: 1, scientific: true},

      'da': {name: 'da', value: 1e1, scientific: false},
      'h': {name: 'h', value: 1e2, scientific: false},
      'k': {name: 'k', value: 1e3, scientific: true},
      'M': {name: 'M', value: 1e6, scientific: true},
      'G': {name: 'G', value: 1e9, scientific: true},
      'T': {name: 'T', value: 1e12, scientific: true},
      'P': {name: 'P', value: 1e15, scientific: true},
      'E': {name: 'E', value: 1e18, scientific: true},
      'Z': {name: 'Z', value: 1e21, scientific: true},
      'Y': {name: 'Y', value: 1e24, scientific: true},

      'd': {name: 'd', value: 1e-1, scientific: false},
      'c': {name: 'c', value: 1e-2, scientific: false},
      'm': {name: 'm', value: 1e-3, scientific: true},
      'u': {name: 'u', value: 1e-6, scientific: true},
      'n': {name: 'n', value: 1e-9, scientific: true},
      'p': {name: 'p', value: 1e-12, scientific: true},
      'f': {name: 'f', value: 1e-15, scientific: true},
      'a': {name: 'a', value: 1e-18, scientific: true},
      'z': {name: 'z', value: 1e-21, scientific: true},
      'y': {name: 'y', value: 1e-24, scientific: true}
    },
    LONG: {
      '': {name: '', value: 1, scientific: true},

      'deca': {name: 'deca', value: 1e1, scientific: false},
      'hecto': {name: 'hecto', value: 1e2, scientific: false},
      'kilo': {name: 'kilo', value: 1e3, scientific: true},
      'mega': {name: 'mega', value: 1e6, scientific: true},
      'giga': {name: 'giga', value: 1e9, scientific: true},
      'tera': {name: 'tera', value: 1e12, scientific: true},
      'peta': {name: 'peta', value: 1e15, scientific: true},
      'exa': {name: 'exa', value: 1e18, scientific: true},
      'zetta': {name: 'zetta', value: 1e21, scientific: true},
      'yotta': {name: 'yotta', value: 1e24, scientific: true},

      'deci': {name: 'deci', value: 1e-1, scientific: false},
      'centi': {name: 'centi', value: 1e-2, scientific: false},
      'milli': {name: 'milli', value: 1e-3, scientific: true},
      'micro': {name: 'micro', value: 1e-6, scientific: true},
      'nano': {name: 'nano', value: 1e-9, scientific: true},
      'pico': {name: 'pico', value: 1e-12, scientific: true},
      'femto': {name: 'femto', value: 1e-15, scientific: true},
      'atto': {name: 'atto', value: 1e-18, scientific: true},
      'zepto': {name: 'zepto', value: 1e-21, scientific: true},
      'yocto': {name: 'yocto', value: 1e-24, scientific: true}
    },
    SQUARED: {
      '': {name: '', value: 1, scientific: true},

      'da': {name: 'da', value: 1e2, scientific: false},
      'h': {name: 'h', value: 1e4, scientific: false},
      'k': {name: 'k', value: 1e6, scientific: true},
      'M': {name: 'M', value: 1e12, scientific: true},
      'G': {name: 'G', value: 1e18, scientific: true},
      'T': {name: 'T', value: 1e24, scientific: true},
      'P': {name: 'P', value: 1e30, scientific: true},
      'E': {name: 'E', value: 1e36, scientific: true},
      'Z': {name: 'Z', value: 1e42, scientific: true},
      'Y': {name: 'Y', value: 1e48, scientific: true},

      'd': {name: 'd', value: 1e-2, scientific: false},
      'c': {name: 'c', value: 1e-4, scientific: false},
      'm': {name: 'm', value: 1e-6, scientific: true},
      'u': {name: 'u', value: 1e-12, scientific: true},
      'n': {name: 'n', value: 1e-18, scientific: true},
      'p': {name: 'p', value: 1e-24, scientific: true},
      'f': {name: 'f', value: 1e-30, scientific: true},
      'a': {name: 'a', value: 1e-36, scientific: true},
      'z': {name: 'z', value: 1e-42, scientific: true},
      'y': {name: 'y', value: 1e-48, scientific: true}
    },
    CUBIC: {
      '': {name: '', value: 1, scientific: true},

      'da': {name: 'da', value: 1e3, scientific: false},
      'h': {name: 'h', value: 1e6, scientific: false},
      'k': {name: 'k', value: 1e9, scientific: true},
      'M': {name: 'M', value: 1e18, scientific: true},
      'G': {name: 'G', value: 1e27, scientific: true},
      'T': {name: 'T', value: 1e36, scientific: true},
      'P': {name: 'P', value: 1e45, scientific: true},
      'E': {name: 'E', value: 1e54, scientific: true},
      'Z': {name: 'Z', value: 1e63, scientific: true},
      'Y': {name: 'Y', value: 1e72, scientific: true},

      'd': {name: 'd', value: 1e-3, scientific: false},
      'c': {name: 'c', value: 1e-6, scientific: false},
      'm': {name: 'm', value: 1e-9, scientific: true},
      'u': {name: 'u', value: 1e-18, scientific: true},
      'n': {name: 'n', value: 1e-27, scientific: true},
      'p': {name: 'p', value: 1e-36, scientific: true},
      'f': {name: 'f', value: 1e-45, scientific: true},
      'a': {name: 'a', value: 1e-54, scientific: true},
      'z': {name: 'z', value: 1e-63, scientific: true},
      'y': {name: 'y', value: 1e-72, scientific: true}
    },
    BINARY_SHORT: {
      '': {name: '', value: 1, scientific: true},
      'k': {name: 'k', value: 1e3, scientific: true},
      'M': {name: 'M', value: 1e6, scientific: true},
      'G': {name: 'G', value: 1e9, scientific: true},
      'T': {name: 'T', value: 1e12, scientific: true},
      'P': {name: 'P', value: 1e15, scientific: true},
      'E': {name: 'E', value: 1e18, scientific: true},
      'Z': {name: 'Z', value: 1e21, scientific: true},
      'Y': {name: 'Y', value: 1e24, scientific: true},

      'Ki': {name: 'Ki', value: 1024, scientific: true},
      'Mi': {name: 'Mi', value: Math.pow(1024, 2), scientific: true},
      'Gi': {name: 'Gi', value: Math.pow(1024, 3), scientific: true},
      'Ti': {name: 'Ti', value: Math.pow(1024, 4), scientific: true},
      'Pi': {name: 'Pi', value: Math.pow(1024, 5), scientific: true},
      'Ei': {name: 'Ei', value: Math.pow(1024, 6), scientific: true},
      'Zi': {name: 'Zi', value: Math.pow(1024, 7), scientific: true},
      'Yi': {name: 'Yi', value: Math.pow(1024, 8), scientific: true}
    },
    BINARY_LONG: {
      '': {name: '', value: 1, scientific: true},
      'kilo': {name: 'kilo', value: 1e3, scientific: true},
      'mega': {name: 'mega', value: 1e6, scientific: true},
      'giga': {name: 'giga', value: 1e9, scientific: true},
      'tera': {name: 'tera', value: 1e12, scientific: true},
      'peta': {name: 'peta', value: 1e15, scientific: true},
      'exa': {name: 'exa', value: 1e18, scientific: true},
      'zetta': {name: 'zetta', value: 1e21, scientific: true},
      'yotta': {name: 'yotta', value: 1e24, scientific: true},

      'kibi': {name: 'kibi', value: 1024, scientific: true},
      'mebi': {name: 'mebi', value: Math.pow(1024, 2), scientific: true},
      'gibi': {name: 'gibi', value: Math.pow(1024, 3), scientific: true},
      'tebi': {name: 'tebi', value: Math.pow(1024, 4), scientific: true},
      'pebi': {name: 'pebi', value: Math.pow(1024, 5), scientific: true},
      'exi': {name: 'exi', value: Math.pow(1024, 6), scientific: true},
      'zebi': {name: 'zebi', value: Math.pow(1024, 7), scientific: true},
      'yobi': {name: 'yobi', value: Math.pow(1024, 8), scientific: true}
    },
    BTU: {
      '':   {name: '',   value: 1,   scientific: true},
      'MM': {name: 'MM', value: 1e6, scientific: true}
    }
  };

  // Add a prefix list for both short and long prefixes (for ohm in particular, since Mohm and megaohm are both acceptable):
  PREFIXES.SHORTLONG = {};
  for (var key in PREFIXES.SHORT) {
    if(PREFIXES.SHORT.hasOwnProperty(key)) {
      PREFIXES.SHORTLONG[key] = PREFIXES.SHORT[key];
    }
  }
  for (var key in PREFIXES.LONG) {
    if(PREFIXES.LONG.hasOwnProperty(key)) {
      PREFIXES.SHORTLONG[key] = PREFIXES.LONG[key];
    }
  }

  /* Internally, each unit is represented by a value and a dimension array. The elements of the dimensions array have the following meaning:
   * Index  Dimension
   * -----  ---------
   *   0    Length
   *   1    Mass
   *   2    Time
   *   3    Current
   *   4    Temperature
   *   5    Luminous intensity
   *   6    Amount of substance
   *   7    Angle
   *   8    Bit (digital)
   * For example, the unit "298.15 K" is a pure temperature and would have a value of 298.15 and a dimension array of [0, 0, 0, 0, 1, 0, 0, 0, 0]. The unit "1 cal / (gm °C)" can be written in terms of the 9 fundamental dimensions as [length^2] / ([time^2] * [temperature]), and would a value of (after conversion to SI) 4184.0 and a dimensions array of [2, 0, -2, 0, -1, 0, 0, 0, 0].
   *
   */

  var BASE_DIMENSIONS = ["MASS", "LENGTH", "TIME", "CURRENT", "TEMPERATURE", "LUMINOUS_INTENSITY", "AMOUNT_OF_SUBSTANCE", "ANGLE", "BIT"];

  var BASE_UNITS = {
    NONE: {
      dimensions: [0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    MASS: {
      dimensions: [1, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    LENGTH: {
      dimensions: [0, 1, 0, 0, 0, 0, 0, 0, 0]
    },
    TIME: {
      dimensions: [0, 0, 1, 0, 0, 0, 0, 0, 0]
    },
    CURRENT: {
      dimensions: [0, 0, 0, 1, 0, 0, 0, 0, 0]
    },
    TEMPERATURE: {
      dimensions: [0, 0, 0, 0, 1, 0, 0, 0, 0]
    },
    LUMINOUS_INTENSITY: {
      dimensions: [0, 0, 0, 0, 0, 1, 0, 0, 0]
    },
    AMOUNT_OF_SUBSTANCE: {
      dimensions: [0, 0, 0, 0, 0, 0, 1, 0, 0]
    },

    FORCE: {
      dimensions: [1, 1, -2, 0, 0, 0, 0, 0, 0]
    },
    SURFACE: {
      dimensions: [0, 2, 0, 0, 0, 0, 0, 0, 0]
    },
    VOLUME: {
      dimensions: [0, 3, 0, 0, 0, 0, 0, 0, 0]
    },
    ENERGY: {
      dimensions: [1, 2, -2, 0, 0, 0, 0, 0, 0]
    },
    POWER: {
      dimensions: [1, 2, -3, 0, 0, 0, 0, 0, 0]
    },
    PRESSURE: {
      dimensions: [1, -1, -2, 0, 0, 0, 0, 0, 0]
    },

    ELECTRIC_CHARGE: {
      dimensions: [0, 0, 1, 1, 0, 0, 0, 0, 0]
    },
    ELECTRIC_CAPACITANCE: {
      dimensions: [-1, -2, 4, 2, 0, 0, 0, 0, 0]
    },
    ELECTRIC_POTENTIAL: {
      dimensions: [1, 2, -3, -1, 0, 0, 0, 0, 0]
    },
    ELECTRIC_RESISTANCE: {
      dimensions: [1, 2, -3, -2, 0, 0, 0, 0, 0]
    },
    ELECTRIC_INDUCTANCE: {
      dimensions: [1, 2, -2, -2, 0, 0, 0, 0, 0]
    },
    ELECTRIC_CONDUCTANCE: {
      dimensions: [-1, -2, 3, 2, 0, 0, 0, 0, 0]
    },
    MAGNETIC_FLUX: {
      dimensions: [1, 2, -2, -1, 0, 0, 0, 0, 0]
    },
    MAGNETIC_FLUX_DENSITY: {
      dimensions: [1, 0, -2, -1, 0, 0, 0, 0, 0]
    },

    FREQUENCY: {
      dimensions: [0, 0, -1, 0, 0, 0, 0, 0, 0]
    },
    ANGLE: {
      dimensions: [0, 0, 0, 0, 0, 0, 0, 1, 0]
    },
    BIT: {
      dimensions: [0, 0, 0, 0, 0, 0, 0, 0, 1]
    }
  };

  for(var key in BASE_UNITS) {
    BASE_UNITS[key].key = key;
  }

  var BASE_UNIT_NONE = {};

  var UNIT_NONE = {name: '', base: BASE_UNIT_NONE, value: 1, offset: 0, dimensions: [0,0,0,0,0,0,0,0,0]};

  var UNITS = {
    // length
    meter: {
      name: 'meter',
      base: BASE_UNITS.LENGTH,
      prefixes: PREFIXES.LONG,
      value: 1,
      offset: 0
    },
    inch: {
      name: 'inch',
      base: BASE_UNITS.LENGTH,
      prefixes: PREFIXES.NONE,
      value: 0.0254,
      offset: 0
    },
    foot: {
      name: 'foot',
      base: BASE_UNITS.LENGTH,
      prefixes: PREFIXES.NONE,
      value: 0.3048,
      offset: 0
    },
    yard: {
      name: 'yard',
      base: BASE_UNITS.LENGTH,
      prefixes: PREFIXES.NONE,
      value: 0.9144,
      offset: 0
    },
    mile: {
      name: 'mile',
      base: BASE_UNITS.LENGTH,
      prefixes: PREFIXES.NONE,
      value: 1609.344,
      offset: 0
    },
    link: {
      name: 'link',
      base: BASE_UNITS.LENGTH,
      prefixes: PREFIXES.NONE,
      value: 0.201168,
      offset: 0
    },
    rod: {
      name: 'rod',
      base: BASE_UNITS.LENGTH,
      prefixes: PREFIXES.NONE,
      value: 5.029210,
      offset: 0
    },
    chain: {
      name: 'chain',
      base: BASE_UNITS.LENGTH,
      prefixes: PREFIXES.NONE,
      value: 20.1168,
      offset: 0
    },
    angstrom: {
      name: 'angstrom',
      base: BASE_UNITS.LENGTH,
      prefixes: PREFIXES.NONE,
      value: 1e-10,
      offset: 0
    },

    m: {
      name: 'm',
      base: BASE_UNITS.LENGTH,
      prefixes: PREFIXES.SHORT,
      value: 1,
      offset: 0
    },
    'in': {
      name: 'in',
      base: BASE_UNITS.LENGTH,
      prefixes: PREFIXES.NONE,
      value: 0.0254,
      offset: 0
    },
    ft: {
      name: 'ft',
      base: BASE_UNITS.LENGTH,
      prefixes: PREFIXES.NONE,
      value: 0.3048,
      offset: 0
    },
    yd: {
      name: 'yd',
      base: BASE_UNITS.LENGTH,
      prefixes: PREFIXES.NONE,
      value: 0.9144,
      offset: 0
    },
    mi: {
      name: 'mi',
      base: BASE_UNITS.LENGTH,
      prefixes: PREFIXES.NONE,
      value: 1609.344,
      offset: 0
    },
    li: {
      name: 'li',
      base: BASE_UNITS.LENGTH,
      prefixes: PREFIXES.NONE,
      value: 0.201168,
      offset: 0
    },
    rd: {
      name: 'rd',
      base: BASE_UNITS.LENGTH,
      prefixes: PREFIXES.NONE,
      value: 5.029210,
      offset: 0
    },
    ch: {
      name: 'ch',
      base: BASE_UNITS.LENGTH,
      prefixes: PREFIXES.NONE,
      value: 20.1168,
      offset: 0
    },
    mil: {
      name: 'mil',
      base: BASE_UNITS.LENGTH,
      prefixes: PREFIXES.NONE,
      value: 0.0000254,
      offset: 0
    }, // 1/1000 inch

    // Surface
    m2: {
      name: 'm2',
      base: BASE_UNITS.SURFACE,
      prefixes: PREFIXES.SQUARED,
      value: 1,
      offset: 0
    },
    sqin: {
      name: 'sqin',
      base: BASE_UNITS.SURFACE,
      prefixes: PREFIXES.NONE,
      value: 0.00064516,
      offset: 0
    }, // 645.16 mm2
    sqft: {
      name: 'sqft',
      base: BASE_UNITS.SURFACE,
      prefixes: PREFIXES.NONE,
      value: 0.09290304,
      offset: 0
    }, // 0.09290304 m2
    sqyd: {
      name: 'sqyd',
      base: BASE_UNITS.SURFACE,
      prefixes: PREFIXES.NONE,
      value: 0.83612736,
      offset: 0
    }, // 0.83612736 m2
    sqmi: {
      name: 'sqmi',
      base: BASE_UNITS.SURFACE,
      prefixes: PREFIXES.NONE,
      value: 2589988.110336,
      offset: 0
    }, // 2.589988110336 km2
    sqrd: {
      name: 'sqrd',
      base: BASE_UNITS.SURFACE,
      prefixes: PREFIXES.NONE,
      value: 25.29295,
      offset: 0
    }, // 25.29295 m2
    sqch: {
      name: 'sqch',
      base: BASE_UNITS.SURFACE,
      prefixes: PREFIXES.NONE,
      value: 404.6873,
      offset: 0
    }, // 404.6873 m2
    sqmil: {
      name: 'sqmil',
      base: BASE_UNITS.SURFACE,
      prefixes: PREFIXES.NONE,
      value: 6.4516e-10,
      offset: 0
    }, // 6.4516 * 10^-10 m2
    acre: {
      name: 'acre',
      base: BASE_UNITS.SURFACE,
      prefixes: PREFIXES.NONE,
      value: 4046.86,
      offset: 0
    }, // 4046.86 m2
    hectare: {
      name: 'hectare',
      base: BASE_UNITS.SURFACE,
      prefixes: PREFIXES.NONE,
      value: 10000,
      offset: 0
    }, // 10000 m2

    // Volume
    m3: {
      name: 'm3',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.CUBIC,
      value: 1,
      offset: 0
    },
    L: {
      name: 'L',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.SHORT,
      value: 0.001,
      offset: 0
    }, // litre
    l: {
      name: 'l',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.SHORT,
      value: 0.001,
      offset: 0
    }, // litre
    litre: {
      name: 'litre',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.LONG,
      value: 0.001,
      offset: 0
    },
    cuin: {
      name: 'cuin',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 1.6387064e-5,
      offset: 0
    }, // 1.6387064e-5 m3
    cuft: {
      name: 'cuft',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.028316846592,
      offset: 0
    }, // 28.316 846 592 L
    cuyd: {
      name: 'cuyd',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.764554857984,
      offset: 0
    }, // 764.554 857 984 L
    teaspoon: {
      name: 'teaspoon',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.000005,
      offset: 0
    }, // 5 mL
    tablespoon: {
      name: 'tablespoon',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.000015,
      offset: 0
    }, // 15 mL
    //{name: 'cup', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.000240, offset: 0}, // 240 mL  // not possible, we have already another cup
    drop: {
      name: 'drop',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 5e-8,
      offset: 0
    },  // 0.05 mL = 5e-8 m3
    gtt: {
      name: 'gtt',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 5e-8,
      offset: 0
    },  // 0.05 mL = 5e-8 m3

    // Liquid volume
    minim: {
      name: 'minim',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.00000006161152,
      offset: 0
    }, // 0.06161152 mL
    fluiddram: {
      name: 'fluiddram',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.0000036966911,
      offset: 0
    },  // 3.696691 mL
    fluidounce: {
      name: 'fluidounce',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.00002957353,
      offset: 0
    }, // 29.57353 mL
    gill: {
      name: 'gill',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.0001182941,
      offset: 0
    }, // 118.2941 mL
    cc: {
      name: 'cc',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 1e-6,
      offset: 0
    }, // 1e-6 L
    cup: {
      name: 'cup',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.0002365882,
      offset: 0
    }, // 236.5882 mL
    pint: {
      name: 'pint',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.0004731765,
      offset: 0
    }, // 473.1765 mL
    quart: {
      name: 'quart',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.0009463529,
      offset: 0
    }, // 946.3529 mL
    gallon: {
      name: 'gallon',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.003785412,
      offset: 0
    }, // 3.785412 L
    beerbarrel: {
      name: 'beerbarrel',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.1173478,
      offset: 0
    }, // 117.3478 L
    oilbarrel: {
      name: 'oilbarrel',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.1589873,
      offset: 0
    }, // 158.9873 L
    hogshead: {
      name: 'hogshead',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.2384810,
      offset: 0
    }, // 238.4810 L

    //{name: 'min', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.00000006161152, offset: 0}, // 0.06161152 mL // min is already in use as minute
    fldr: {
      name: 'fldr',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.0000036966911,
      offset: 0
    },  // 3.696691 mL
    floz: {
      name: 'floz',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.00002957353,
      offset: 0
    }, // 29.57353 mL
    gi: {
      name: 'gi',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.0001182941,
      offset: 0
    }, // 118.2941 mL
    cp: {
      name: 'cp',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.0002365882,
      offset: 0
    }, // 236.5882 mL
    pt: {
      name: 'pt',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.0004731765,
      offset: 0
    }, // 473.1765 mL
    qt: {
      name: 'qt',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.0009463529,
      offset: 0
    }, // 946.3529 mL
    gal: {
      name: 'gal',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.003785412,
      offset: 0
    }, // 3.785412 L
    bbl: {
      name: 'bbl',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.1173478,
      offset: 0
    }, // 117.3478 L
    obl: {
      name: 'obl',
      base: BASE_UNITS.VOLUME,
      prefixes: PREFIXES.NONE,
      value: 0.1589873,
      offset: 0
    }, // 158.9873 L
    //{name: 'hogshead', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.2384810, offset: 0}, // 238.4810 L // TODO: hh?

    // Mass
    g: {
      name: 'g',
      base: BASE_UNITS.MASS,
      prefixes: PREFIXES.SHORT,
      value: 0.001,
      offset: 0
    },
    gram: {
      name: 'gram',
      base: BASE_UNITS.MASS,
      prefixes: PREFIXES.LONG,
      value: 0.001,
      offset: 0
    },

    ton: {
      name: 'ton',
      base: BASE_UNITS.MASS,
      prefixes: PREFIXES.SHORT,
      value: 907.18474,
      offset: 0
    },
    tonne: {
      name: 'tonne',
      base: BASE_UNITS.MASS,
      prefixes: PREFIXES.SHORT,
      value: 1000,
      offset: 0
    },

    grain: {
      name: 'grain',
      base: BASE_UNITS.MASS,
      prefixes: PREFIXES.NONE,
      value: 64.79891e-6,
      offset: 0
    },
    dram: {
      name: 'dram',
      base: BASE_UNITS.MASS,
      prefixes: PREFIXES.NONE,
      value: 1.7718451953125e-3,
      offset: 0
    },
    ounce: {
      name: 'ounce',
      base: BASE_UNITS.MASS,
      prefixes: PREFIXES.NONE,
      value: 28.349523125e-3,
      offset: 0
    },
    poundmass: {
      name: 'poundmass',
      base: BASE_UNITS.MASS,
      prefixes: PREFIXES.NONE,
      value: 453.59237e-3,
      offset: 0
    },
    hundredweight: {
      name: 'hundredweight',
      base: BASE_UNITS.MASS,
      prefixes: PREFIXES.NONE,
      value: 45.359237,
      offset: 0
    },
    stick: {
      name: 'stick',
      base: BASE_UNITS.MASS,
      prefixes: PREFIXES.NONE,
      value: 115e-3,
      offset: 0
    },
    stone: {
      name: 'stone',
      base: BASE_UNITS.MASS,
      prefixes: PREFIXES.NONE,
      value: 6.35029318,
      offset: 0
    },

    gr: {
      name: 'gr',
      base: BASE_UNITS.MASS,
      prefixes: PREFIXES.NONE,
      value: 64.79891e-6,
      offset: 0
    },
    dr: {
      name: 'dr',
      base: BASE_UNITS.MASS,
      prefixes: PREFIXES.NONE,
      value: 1.7718451953125e-3,
      offset: 0
    },
    oz: {
      name: 'oz',
      base: BASE_UNITS.MASS,
      prefixes: PREFIXES.NONE,
      value: 28.349523125e-3,
      offset: 0
    },
    lbm: {
      name: 'lbm',
      base: BASE_UNITS.MASS,
      prefixes: PREFIXES.NONE,
      value: 453.59237e-3,
      offset: 0
    },
    cwt: {
      name: 'cwt',
      base: BASE_UNITS.MASS,
      prefixes: PREFIXES.NONE,
      value: 45.359237,
      offset: 0
    },

    // Time
    s: {
      name: 's',
      base: BASE_UNITS.TIME,
      prefixes: PREFIXES.SHORT,
      value: 1,
      offset: 0
    },
    min: {
      name: 'min',
      base: BASE_UNITS.TIME,
      prefixes: PREFIXES.NONE,
      value: 60,
      offset: 0
    },
    h: {
      name: 'h',
      base: BASE_UNITS.TIME,
      prefixes: PREFIXES.NONE,
      value: 3600,
      offset: 0
    },
    second: {
      name: 'second',
      base: BASE_UNITS.TIME,
      prefixes: PREFIXES.LONG,
      value: 1,
      offset: 0
    },
    sec: {
      name: 'sec',
      base: BASE_UNITS.TIME,
      prefixes: PREFIXES.LONG,
      value: 1,
      offset: 0
    },
    minute: {
      name: 'minute',
      base: BASE_UNITS.TIME,
      prefixes: PREFIXES.NONE,
      value: 60,
      offset: 0
    },
    hour: {
      name: 'hour',
      base: BASE_UNITS.TIME,
      prefixes: PREFIXES.NONE,
      value: 3600,
      offset: 0
    },
    day: {
      name: 'day',
      base: BASE_UNITS.TIME,
      prefixes: PREFIXES.NONE,
      value: 86400,
      offset: 0
    },
    week: {
      name: 'week',
      base: BASE_UNITS.TIME,
      prefixes: PREFIXES.NONE,
      value: 7*86400,
      offset: 0
    },
    month: {
      name: 'month',
      base: BASE_UNITS.TIME,
      prefixes: PREFIXES.NONE,
      value: 2629800, //1/12th of Julian year
      offset: 0
    },
    year: {
      name: 'year',
      base: BASE_UNITS.TIME,
      prefixes: PREFIXES.NONE,
      value: 31557600, //Julian year
      offset: 0
    },
    decade: {
      name: 'year',
      base: BASE_UNITS.TIME,
      prefixes: PREFIXES.NONE,
      value: 315576000, //Julian decade
      offset: 0
    },
    century: {
      name: 'century',
      base: BASE_UNITS.TIME,
      prefixes: PREFIXES.NONE,
      value: 3155760000, //Julian century
      offset: 0
    },
    millennium: {
      name: 'millennium',
      base: BASE_UNITS.TIME,
      prefixes: PREFIXES.NONE,
      value: 31557600000, //Julian millennium
      offset: 0
    },

    // Frequency
    hertz: {
      name: 'Hertz',
      base: BASE_UNITS.FREQUENCY,
      prefixes: PREFIXES.LONG,
      value: 1,
      offset: 0,
      reciprocal: true
    },
    Hz: {
      name: 'Hz',
      base: BASE_UNITS.FREQUENCY,
      prefixes: PREFIXES.SHORT,
      value: 1,
      offset: 0,
      reciprocal: true
    },

    // Angle
    rad: {
      name: 'rad',
      base: BASE_UNITS.ANGLE,
      prefixes: PREFIXES.LONG,
      value: 1,
      offset: 0
    },
    // deg = rad / (2*pi) * 360 = rad / 0.017453292519943295769236907684888
    deg: {
      name: 'deg',
      base: BASE_UNITS.ANGLE,
      prefixes: PREFIXES.LONG,
      value: null, // will be filled in by calculateAngleValues()
      offset: 0
    },
    // grad = rad / (2*pi) * 400  = rad / 0.015707963267948966192313216916399
    grad: {
      name: 'grad',
      base: BASE_UNITS.ANGLE,
      prefixes: PREFIXES.LONG,
      value: null, // will be filled in by calculateAngleValues()
      offset: 0
    },
    // cycle = rad / (2*pi) = rad / 6.2831853071795864769252867665793
    cycle: {
      name: 'cycle',
      base: BASE_UNITS.ANGLE,
      prefixes: PREFIXES.NONE,
      value: null, // will be filled in by calculateAngleValues()
      offset: 0
    },
    // arcsec = rad / (3600 * (360 / 2 * pi)) = rad / 0.0000048481368110953599358991410235795
    arcsec: {
      name: 'arcsec',
      base: BASE_UNITS.ANGLE,
      prefixes: PREFIXES.NONE,
      value: null, // will be filled in by calculateAngleValues()
      offset: 0
    },
    // arcmin = rad / (60 * (360 / 2 * pi)) = rad / 0.00029088820866572159615394846141477
    arcmin: {
      name: 'arcmin',
      base: BASE_UNITS.ANGLE,
      prefixes: PREFIXES.NONE,
      value: null, // will be filled in by calculateAngleValues()
      offset: 0
    },
    
    // Electric current
    A: {
      name: 'A',
      base: BASE_UNITS.CURRENT,
      prefixes: PREFIXES.SHORT,
      value: 1,
      offset: 0
    },
    ampere: {
      name: 'ampere',
      base: BASE_UNITS.CURRENT,
      prefixes: PREFIXES.LONG,
      value: 1,
      offset: 0
    },

    // Temperature
    // K(C) = °C + 273.15
    // K(F) = (°F + 459.67) / 1.8
    // K(R) = °R / 1.8
    K: {
      name: 'K',
      base: BASE_UNITS.TEMPERATURE,
      prefixes: PREFIXES.NONE,
      value: 1,
      offset: 0
    },
    degC: {
      name: 'degC',
      base: BASE_UNITS.TEMPERATURE,
      prefixes: PREFIXES.NONE,
      value: 1,
      offset: 273.15
    },
    degF: {
      name: 'degF',
      base: BASE_UNITS.TEMPERATURE,
      prefixes: PREFIXES.NONE,
      value: 1 / 1.8,
      offset: 459.67
    },
    degR: {
      name: 'degR',
      base: BASE_UNITS.TEMPERATURE,
      prefixes: PREFIXES.NONE,
      value: 1 / 1.8,
      offset: 0
    },
    kelvin: {
      name: 'kelvin',
      base: BASE_UNITS.TEMPERATURE,
      prefixes: PREFIXES.NONE,
      value: 1,
      offset: 0
    },
    celsius: {
      name: 'celsius',
      base: BASE_UNITS.TEMPERATURE,
      prefixes: PREFIXES.NONE,
      value: 1,
      offset: 273.15
    },
    fahrenheit: {
      name: 'fahrenheit',
      base: BASE_UNITS.TEMPERATURE,
      prefixes: PREFIXES.NONE,
      value: 1 / 1.8,
      offset: 459.67
    },
    rankine: {
      name: 'rankine',
      base: BASE_UNITS.TEMPERATURE,
      prefixes: PREFIXES.NONE,
      value: 1 / 1.8,
      offset: 0
    },

    // amount of substance
    mol: {
      name: 'mol',
      base: BASE_UNITS.AMOUNT_OF_SUBSTANCE,
      prefixes: PREFIXES.SHORT,
      value: 1,
      offset: 0
    },
    mole: {
      name: 'mole',
      base: BASE_UNITS.AMOUNT_OF_SUBSTANCE,
      prefixes: PREFIXES.LONG,
      value: 1,
      offset: 0
    },

    // luminous intensity
    cd: {
      name: 'cd',
      base: BASE_UNITS.LUMINOUS_INTENSITY,
      prefixes: PREFIXES.NONE,
      value: 1,
      offset: 0
    },
    candela: {
      name: 'candela',
      base: BASE_UNITS.LUMINOUS_INTENSITY,
      prefixes: PREFIXES.NONE,
      value: 1,
      offset: 0
    },
    // TODO: units STERADIAN
    //{name: 'sr', base: BASE_UNITS.STERADIAN, prefixes: PREFIXES.NONE, value: 1, offset: 0},
    //{name: 'steradian', base: BASE_UNITS.STERADIAN, prefixes: PREFIXES.NONE, value: 1, offset: 0},

    // Force
    N: {
      name: 'N',
      base: BASE_UNITS.FORCE,
      prefixes: PREFIXES.SHORT,
      value: 1,
      offset: 0
    },
    newton: {
      name: 'newton',
      base: BASE_UNITS.FORCE,
      prefixes: PREFIXES.LONG,
      value: 1,
      offset: 0
    },
    dyn: {
      name: 'dyn',
      base: BASE_UNITS.FORCE,
      prefixes: PREFIXES.SHORT,
      value: 0.00001,
      offset: 0
    },
    dyne: {
      name: 'dyne',
      base: BASE_UNITS.FORCE,
      prefixes: PREFIXES.LONG,
      value: 0.00001,
      offset: 0
    },
    lbf: {
      name: 'lbf',
      base: BASE_UNITS.FORCE,
      prefixes: PREFIXES.NONE,
      value: 4.4482216152605,
      offset: 0
    },
    poundforce: {
      name: 'poundforce',
      base: BASE_UNITS.FORCE,
      prefixes: PREFIXES.NONE,
      value: 4.4482216152605,
      offset: 0
    },
    kip: {
      name: 'kip',
      base: BASE_UNITS.FORCE,
      prefixes: PREFIXES.LONG,
      value: 4448.2216,
      offset: 0
    },
	
    // Energy
    J: {
      name: 'J',
      base: BASE_UNITS.ENERGY,
      prefixes: PREFIXES.SHORT,
      value: 1,
      offset: 0
    },
    joule: {
      name: 'joule',
      base: BASE_UNITS.ENERGY,
      prefixes: PREFIXES.SHORT,
      value: 1,
      offset: 0
    },
    erg: {
      name: 'erg',
      base: BASE_UNITS.ENERGY,
      prefixes: PREFIXES.NONE,
      value: 1e-5,
      offset: 0
    },
    Wh: {
      name: 'Wh',
      base: BASE_UNITS.ENERGY,
      prefixes: PREFIXES.SHORT,
      value: 3600,
      offset: 0
    },
    BTU: {
      name: 'BTU',
      base: BASE_UNITS.ENERGY,
      prefixes: PREFIXES.BTU,
      value: 1055.05585262,
      offset: 0
    },
    eV: {
      name: 'eV',
      base: BASE_UNITS.ENERGY,
      prefixes: PREFIXES.SHORT,
      value: 1.602176565e-19,
      offset: 0
    },
    electronvolt: {
      name: 'electronvolt',
      base: BASE_UNITS.ENERGY,
      prefixes: PREFIXES.LONG,
      value: 1.602176565e-19,
      offset: 0
    },


    // Power
    W: {
      name: 'W',
      base: BASE_UNITS.POWER,
      prefixes: PREFIXES.SHORT,
      value: 1,
      offset: 0
    },
    watt: {
      name: 'W',
      base: BASE_UNITS.POWER,
      prefixes: PREFIXES.LONG,
      value: 1,
      offset: 0
    },
    hp: {
      name: 'hp',
      base: BASE_UNITS.POWER,
      prefixes: PREFIXES.NONE,
      value: 745.6998715386,
      offset: 0
    },

    // Electrical power units
    VAR: {
      name: 'VAR',
      base: BASE_UNITS.POWER,
      prefixes: PREFIXES.SHORT,
      value: Complex.I,
      offset: 0
    },
    
    VA: {
      name: 'VA',
      base: BASE_UNITS.POWER,
      prefixes: PREFIXES.SHORT,
      value: 1,
      offset: 0
    },

    // Pressure
    Pa: {
      name: 'Pa',
      base: BASE_UNITS.PRESSURE,
      prefixes: PREFIXES.SHORT,
      value: 1,
      offset: 0
    },
    psi: {
      name: 'psi',
      base: BASE_UNITS.PRESSURE,
      prefixes: PREFIXES.NONE,
      value: 6894.75729276459,
      offset: 0
    },
    atm: {
      name: 'atm',
      base: BASE_UNITS.PRESSURE,
      prefixes: PREFIXES.NONE,
      value: 101325,
      offset: 0
    },
    bar: {
      name: 'bar',
      base: BASE_UNITS.PRESSURE,
      prefixes: PREFIXES.NONE,
      value: 100000,
      offset: 0
    },
    torr: {
      name: 'torr',
      base: BASE_UNITS.PRESSURE,
      prefixes: PREFIXES.NONE,
      value: 133.322,
      offset: 0
    },
    mmHg: {
      name: 'mmHg',
      base: BASE_UNITS.PRESSURE,
      prefixes: PREFIXES.NONE,
      value: 133.322,
      offset: 0
    },
    mmH2O: {
      name: 'mmH2O',
      base: BASE_UNITS.PRESSURE,
      prefixes: PREFIXES.NONE,
      value: 9.80665,
      offset: 0
    },
    cmH2O: {
      name: 'cmH2O',
      base: BASE_UNITS.PRESSURE,
      prefixes: PREFIXES.NONE,
      value: 98.0665,
      offset: 0
    },

    // Electric charge
    coulomb: {
      name: 'coulomb',
      base: BASE_UNITS.ELECTRIC_CHARGE,
      prefixes: PREFIXES.LONG,
      value: 1,
      offset: 0
    },
    C: {
      name: 'C',
      base: BASE_UNITS.ELECTRIC_CHARGE,
      prefixes: PREFIXES.SHORT,
      value: 1,
      offset: 0
    },
    // Electric capacitance
    farad: {
      name: 'farad',
      base: BASE_UNITS.ELECTRIC_CAPACITANCE,
      prefixes: PREFIXES.LONG,
      value: 1,
      offset: 0
    },
    F: {
      name: 'F',
      base: BASE_UNITS.ELECTRIC_CAPACITANCE,
      prefixes: PREFIXES.SHORT,
      value: 1,
      offset: 0
    },
    // Electric potential
    volt: {
      name: 'volt',
      base: BASE_UNITS.ELECTRIC_POTENTIAL,
      prefixes: PREFIXES.LONG,
      value: 1,
      offset: 0
    },
    V: {
      name: 'V',
      base: BASE_UNITS.ELECTRIC_POTENTIAL,
      prefixes: PREFIXES.SHORT,
      value: 1,
      offset: 0
    },
    // Electric resistance
    ohm: {
      name: 'ohm',
      base: BASE_UNITS.ELECTRIC_RESISTANCE,
      prefixes: PREFIXES.SHORTLONG,    // Both Mohm and megaohm are acceptable
      value: 1,
      offset: 0
    },
    /*
     * Unicode breaks in browsers if charset is not specified
    Ω: {
      name: 'Ω',
      base: BASE_UNITS.ELECTRIC_RESISTANCE,
      prefixes: PREFIXES.SHORT,
      value: 1,
      offset: 0
    },
    */
    // Electric inductance
    henry: {
      name: 'henry',
      base: BASE_UNITS.ELECTRIC_INDUCTANCE,
      prefixes: PREFIXES.LONG,
      value: 1,
      offset: 0
    },
    H: {
      name: 'H',
      base: BASE_UNITS.ELECTRIC_INDUCTANCE,
      prefixes: PREFIXES.SHORT,
      value: 1,
      offset: 0
    },
    // Electric conductance
    siemens: {
      name: 'siemens',
      base: BASE_UNITS.ELECTRIC_CONDUCTANCE,
      prefixes: PREFIXES.LONG,
      value: 1,
      offset: 0
    },
    S: {
      name: 'S',
      base: BASE_UNITS.ELECTRIC_CONDUCTANCE,
      prefixes: PREFIXES.SHORT,
      value: 1,
      offset: 0
    },
    // Magnetic flux
    weber: {
      name: 'weber',
      base: BASE_UNITS.MAGNETIC_FLUX,
      prefixes: PREFIXES.LONG,
      value: 1,
      offset: 0
    },
    Wb: {
      name: 'Wb',
      base: BASE_UNITS.MAGNETIC_FLUX,
      prefixes: PREFIXES.SHORT,
      value: 1,
      offset: 0
    },
    // Magnetic flux density
    tesla: {
      name: 'tesla',
      base: BASE_UNITS.MAGNETIC_FLUX_DENSITY,
      prefixes: PREFIXES.LONG,
      value: 1,
      offset: 0
    },
    T: {
      name: 'T',
      base: BASE_UNITS.MAGNETIC_FLUX_DENSITY,
      prefixes: PREFIXES.SHORT,
      value: 1,
      offset: 0
    },

    // Binary
    b: {
      name: 'b',
      base: BASE_UNITS.BIT,
      prefixes: PREFIXES.BINARY_SHORT,
      value: 1,
      offset: 0
    },
    bits: {
      name: 'bits',
      base: BASE_UNITS.BIT,
      prefixes: PREFIXES.BINARY_LONG,
      value: 1,
      offset: 0
    },
    B: {
      name: 'B',
      base: BASE_UNITS.BIT,
      prefixes: PREFIXES.BINARY_SHORT,
      value: 8,
      offset: 0
    },
    bytes: {
      name: 'bytes',
      base: BASE_UNITS.BIT,
      prefixes: PREFIXES.BINARY_LONG,
      value: 8,
      offset: 0
    }
  };

  // aliases (formerly plurals)
  var ALIASES = {
    meters: 'meter',
    inches: 'inch',
    feet: 'foot',
    yards: 'yard',
    miles: 'mile',
    links: 'link',
    rods: 'rod',
    chains: 'chain',
    angstroms: 'angstrom',

    lt: 'l',
    litres: 'litre',
    liter: 'litre',
    liters: 'litre',
    teaspoons: 'teaspoon',
    tablespoons: 'tablespoon',
    minims: 'minim',
    fluiddrams: 'fluiddram',
    fluidounces: 'fluidounce',
    gills: 'gill',
    cups: 'cup',
    pints: 'pint',
    quarts: 'quart',
    gallons: 'gallon',
    beerbarrels: 'beerbarrel',
    oilbarrels: 'oilbarrel',
    hogsheads: 'hogshead',
    gtts: 'gtt',

    grams: 'gram',
    tons: 'ton',
    tonnes: 'tonne',
    grains: 'grain',
    drams: 'dram',
    ounces: 'ounce',
    poundmasses: 'poundmass',
    hundredweights: 'hundredweight',
    sticks: 'stick',
    lb: 'lbm',
    lbs: 'lbm',
	
    kips: 'kip',

    acres: 'acre',
    hectares: 'hectare',
    sqfeet: 'sqft',
    sqyard: 'sqyd',
    sqmile: 'sqmi',
    sqmiles: 'sqmi',

    mmhg: 'mmHg',
    mmh2o: 'mmH2O',
    cmh2o: 'cmH2O',

    seconds: 'second',
    secs: 'second',
    minutes: 'minute',
    mins: 'minute',
    hours: 'hour',
    hr: 'hour',
    hrs: 'hour',
    days: 'day',
    weeks: 'week',
    months: 'month',
    years: 'year',

    hertz: 'hertz',

    radians: 'rad',
    degree: 'deg',
    degrees: 'deg',
    gradian: 'grad',
    gradians: 'grad',
    cycles: 'cycle',
    arcsecond: 'arcsec',
    arcseconds: 'arcsec',
    arcminute: 'arcmin',
    arcminutes: 'arcmin',

    BTUs: 'BTU',
    watts: 'watt',
    joules: 'joule',

    amperes: 'ampere',
    coulombs: 'coulomb',
    volts: 'volt',
    ohms: 'ohm',
    farads: 'farad',
    webers: 'weber',
    teslas: 'tesla',
    electronvolts: 'electronvolt',
    moles: 'mole'

  };

  /**
   * Calculate the values for the angle units.
   * Value is calculated as number or BigNumber depending on the configuration
   * @param {{number: 'number' | 'BigNumber'}} config
   */
  function calculateAngleValues (config) {
    if (config.number === 'BigNumber') {
      var pi = constants.pi(type.BigNumber);
      UNITS.rad.value = new type.BigNumber(1);
      UNITS.deg.value = pi.div(180);        // 2 * pi / 360;
      UNITS.grad.value = pi.div(200);       // 2 * pi / 400;
      UNITS.cycle.value = pi.times(2);      // 2 * pi
      UNITS.arcsec.value = pi.div(648000);  // 2 * pi / 360 / 3600
      UNITS.arcmin.value = pi.div(10800);   // 2 * pi / 360 / 60
    }
    else { // number
      UNITS.rad.value = 1;
      UNITS.deg.value = Math.PI / 180;        // 2 * pi / 360;
      UNITS.grad.value = Math.PI / 200;       // 2 * pi / 400;
      UNITS.cycle.value = Math.PI * 2;        // 2 * pi
      UNITS.arcsec.value = Math.PI / 648000;  // 2 * pi / 360 / 3600;
      UNITS.arcmin.value = Math.PI / 10800;   // 2 * pi / 360 / 60;
    }
  }

  // apply the angle values now
  calculateAngleValues(config);

  // recalculate the values on change of configuration
  math.on('config', function (curr, prev) {
    if (curr.number !== prev.number) {
      calculateAngleValues(curr);
    }
  });

  /**
   * A unit system is a set of dimensionally independent base units plus a set of derived units, formed by multiplication and division of the base units, that are by convention used with the unit system.
   * A user perhaps could issue a command to select a preferred unit system, or use the default (see below).
   * Auto unit system: The default unit system is updated on the fly anytime a unit is parsed. The corresponding unit in the default unit system is updated, so that answers are given in the same units the user supplies.
   */
  var UNIT_SYSTEMS = {
    si: {
      // Base units
      NONE:                  {unit: UNIT_NONE, prefix: PREFIXES.NONE['']},
      LENGTH:                {unit: UNITS.m,   prefix: PREFIXES.SHORT['']},
      MASS:                  {unit: UNITS.g,   prefix: PREFIXES.SHORT['k']}, 
      TIME:                  {unit: UNITS.s,   prefix: PREFIXES.SHORT['']}, 
      CURRENT:               {unit: UNITS.A,   prefix: PREFIXES.SHORT['']}, 
      TEMPERATURE:           {unit: UNITS.K,   prefix: PREFIXES.SHORT['']}, 
      LUMINOUS_INTENSITY:    {unit: UNITS.cd,  prefix: PREFIXES.SHORT['']}, 
      AMOUNT_OF_SUBSTANCE:   {unit: UNITS.mol, prefix: PREFIXES.SHORT['']}, 
      ANGLE:                 {unit: UNITS.rad, prefix: PREFIXES.SHORT['']}, 
      BIT:                   {unit: UNITS.bit, prefix: PREFIXES.SHORT['']}, 

      // Derived units
      FORCE:                 {unit: UNITS.N,   prefix: PREFIXES.SHORT['']}, 
      ENERGY:                {unit: UNITS.J,   prefix: PREFIXES.SHORT['']},
      POWER:                 {unit: UNITS.W,   prefix: PREFIXES.SHORT['']},
      PRESSURE:              {unit: UNITS.Pa,  prefix: PREFIXES.SHORT['']},
      ELECTRIC_CHARGE:       {unit: UNITS.C,   prefix: PREFIXES.SHORT['']},
      ELECTRIC_CAPACITANCE:  {unit: UNITS.F,   prefix: PREFIXES.SHORT['']},
      ELECTRIC_POTENTIAL:    {unit: UNITS.V,   prefix: PREFIXES.SHORT['']},
      ELECTRIC_RESISTANCE:   {unit: UNITS.ohm, prefix: PREFIXES.SHORT['']},
      ELECTRIC_INDUCTANCE:   {unit: UNITS.H,   prefix: PREFIXES.SHORT['']},
      ELECTRIC_CONDUCTANCE:  {unit: UNITS.S,   prefix: PREFIXES.SHORT['']},
      MAGNETIC_FLUX:         {unit: UNITS.Wb,  prefix: PREFIXES.SHORT['']},
      MAGNETIC_FLUX_DENSITY: {unit: UNITS.T,   prefix: PREFIXES.SHORT['']},
      FREQUENCY:             {unit: UNITS.Hz,  prefix: PREFIXES.SHORT['']}
    }
  };

  // Clone to create the other unit systems
  UNIT_SYSTEMS.cgs = JSON.parse(JSON.stringify(UNIT_SYSTEMS.si));
  UNIT_SYSTEMS.cgs.LENGTH = {unit: UNITS.m,   prefix: PREFIXES.SHORT['c']};
  UNIT_SYSTEMS.cgs.MASS =   {unit: UNITS.g,   prefix: PREFIXES.SHORT['']};
  UNIT_SYSTEMS.cgs.FORCE =  {unit: UNITS.dyn, prefix: PREFIXES.SHORT['']};
  UNIT_SYSTEMS.cgs.ENERGY = {unit: UNITS.erg, prefix: PREFIXES.NONE['']};
  // there are wholly 4 unique cgs systems for electricity and magnetism,
  // so let's not worry about it unless somebody complains
  
  UNIT_SYSTEMS.us = JSON.parse(JSON.stringify(UNIT_SYSTEMS.si));
  UNIT_SYSTEMS.us.LENGTH =      {unit: UNITS.ft,   prefix: PREFIXES.NONE['']};
  UNIT_SYSTEMS.us.MASS =        {unit: UNITS.lbm,  prefix: PREFIXES.NONE['']};
  UNIT_SYSTEMS.us.TEMPERATURE = {unit: UNITS.degF, prefix: PREFIXES.NONE['']};
  UNIT_SYSTEMS.us.FORCE =       {unit: UNITS.lbf,  prefix: PREFIXES.NONE['']};
  UNIT_SYSTEMS.us.ENERGY =      {unit: UNITS.BTU,  prefix: PREFIXES.BTU['']};
  UNIT_SYSTEMS.us.POWER =       {unit: UNITS.hp,   prefix: PREFIXES.NONE['']};
  UNIT_SYSTEMS.us.PRESSURE =    {unit: UNITS.psi,  prefix: PREFIXES.NONE['']};

  // Add additional unit systems here.



  // Choose a unit system to seed the auto unit system.
  UNIT_SYSTEMS.auto = JSON.parse(JSON.stringify(UNIT_SYSTEMS.si));

  // Set the current unit system
  var currentUnitSystem = UNIT_SYSTEMS.auto;

  /**
   * Set a unit system for formatting derived units.
   * @param {string} [name] The name of the unit system.
   */
  Unit.setUnitSystem = function(name) {
    if(UNIT_SYSTEMS.hasOwnProperty(name)) {
      currentUnitSystem = UNIT_SYSTEMS[name];
    }
    else {
      throw new Error('Unit system ' + name + ' does not exist. Choices are: ' + Object.keys(UNIT_SYSTEMS).join(', '));
    }
  };

  /**
   * Return the current unit system.
   * @return {string} The current unit system.
   */
  Unit.getUnitSystem = function() {
    for(var key in UNIT_SYSTEMS) {
      if(UNIT_SYSTEMS[key] === currentUnitSystem) {
        return key;
      }
    }
  };

  /**
   * Converters to convert from number to an other numeric type like BigNumber
   * or Fraction
   */
  Unit.typeConverters = {
    BigNumber: function (x) {
      return new type.BigNumber(x + ''); // stringify to prevent constructor error
    },

    Fraction: function (x) {
      return new type.Fraction(x);
    },

    Complex: function (x) {
      return x;
    },

    number: function (x) {
      return x;
    }
  };

  /**
   * Retrieve the right convertor function corresponding with the type
   * of provided exampleValue.
   *
   * @param {string} type   A string 'number', 'BigNumber', or 'Fraction'
   *                        In case of an unknown type,
   * @return {Function}
   */
  Unit._getNumberConverter = function (type) {
    if (!Unit.typeConverters[type]) {
      throw new TypeError('Unsupported type "' + type + '"');
    }

    return Unit.typeConverters[type];
  };

  // Add dimensions to each built-in unit
  for (var key in UNITS) {
    var unit = UNITS[key];
    unit.dimensions = unit.base.dimensions;
  }    

  // Create aliases
  for (var name in ALIASES) {
    if(ALIASES.hasOwnProperty(name)) {
      var unit = UNITS[ALIASES[name]];
      var alias = {};
      for(var key in unit) {
        if(unit.hasOwnProperty(key)) {
          alias[key] = unit[key];
        }
      }
      alias.name = name;
      UNITS[name] = alias;
    }
  }

  function assertUnitNameIsValid(name) {
    for(var i=0; i<name.length; i++) {
      var c = name.charAt(i);
       
      var isValidAlpha = function (p) {
        return /^[a-zA-Z]$/.test(p);
      };

      var isDigit = function (c) {
        return (c >= '0' && c <= '9');
      }

      if(i === 0 && !isValidAlpha(c))
        throw new Error('Invalid unit name (must begin with alpha character): "' + name + '"');

      if(i > 0 && !( isValidAlpha(c)
                  || isDigit(c)))
        throw new Error('Invalid unit name (only alphanumeric characters are allowed): "' + name + '"');

    }
  }

  /**
   * Wrapper around createUnitSingle.
   * Example: 
   *  createUnit({
   *    foo: { },
   *    bar: {
   *      definition: 'kg/foo',
   *      aliases: ['ba', 'barr', 'bars'],
   *      offset: 200
   *    },
   *    baz: '4 bar'
   *  }, 
   *  {
   *    override: true;
   *  });
   * @param {object} obj      Object map. Each key becomes a unit which is defined by its value.
   * @param {object} options
   */
  Unit.createUnit = function(obj, options) {
    
    if(typeof(obj) !== 'object') {
      throw new TypeError("createUnit expects first parameter to be of type 'Object'");
    }

    // Remove all units and aliases we are overriding
    if(options && options.override) {
      for(var key in obj) {
        if(obj.hasOwnProperty(key)) {
          Unit.deleteUnit(key);
        }
        if(obj[key].aliases) {
          for(var i=0; i<obj[key].aliases.length; i++) {
            Unit.deleteUnit(obj[key].aliases[i]);
          }
        }
      }
    }

    // TODO: traverse multiple times until all units have been added
    var lastUnit;
    for(var key in obj) {
      if(obj.hasOwnProperty(key)) {
        lastUnit = Unit.createUnitSingle(key, obj[key]);
      }
    }
    return lastUnit;
  };

  /**
   * Create a user-defined unit and register it with the Unit type.
   * Example: 
   *  createUnitSingle('knot', '0.514444444 m/s')
   *  createUnitSingle('acre', new Unit(43560, 'ft^2'))
   *
   * @param {string} name      The name of the new unit. Must be unique. Example: 'knot'
   * @param {string, Unit} definition      Definition of the unit in terms of existing units. For example, '0.514444444 m / s'.
   * @param {Object} options   (optional) An object containing any of the following properties:
   *     prefixes {string} "none", "short", "long", "binary_short", or "binary_long". The default is "none".
   *     aliases {Array} Array of strings. Example: ['knots', 'kt', 'kts']
   *     offset {Numeric} An offset to apply when converting from the unit. For example, the offset for celsius is 273.15 and the offset for farhenheit is 459.67. Default is 0.
   *
   * @return {Unit} 
   */
  Unit.createUnitSingle = function(name, obj, options) {

    if(typeof(obj) === 'undefined' || obj === null) {
      obj = {};
    }
    
    if(typeof(name) !== 'string') {
      throw new TypeError("createUnitSingle expects first parameter to be of type 'string'");
    }
   
    // Check collisions with existing units
    if(UNITS.hasOwnProperty(name)) {
      throw new Error('Cannot create unit "' + name + '": a unit with that name already exists');
    }

    // TODO: Validate name for collisions with other built-in functions (like abs or cos, for example), and for acceptable variable names. For example, '42' is probably not a valid unit. Nor is '%', since it is also an operator.

    assertUnitNameIsValid(name);

    var defUnit = null;   // The Unit from which the new unit will be created.
    var aliases = [];
    var offset = 0;
    var definition;
    var prefixes;
    if(obj && obj.type === 'Unit') {
      defUnit = obj.clone();
    }
    else if(typeof(obj) === 'string') {
      if(obj !== '') {
        definition = obj;
      }
    }
    else if(typeof(obj) === 'object') {
      definition = obj.definition;
      prefixes = obj.prefixes; 
      offset = obj.offset;
      aliases = obj.aliases;
    }
    else {
      throw new TypeError('Cannot create unit "' + name + '" from "' + obj.toString() + '": expecting "string" or "Unit" or "Object"');
    }

    if(aliases) {
      for (var i=0; i<aliases.length; i++) {
        if(UNITS.hasOwnProperty(aliases[i])) {
          throw new Error('Cannot create alias "' + aliases[i] + '": a unit with that name already exists');
        }
      }
    }

    if(definition && typeof(definition) === 'string' && !defUnit) {
      try {
        defUnit = Unit.parse(definition, {allowNoUnits: true});
      }
      catch (ex) {
        ex.message = 'Could not create unit "' + name + '" from "' + definition + '": ' + ex.message;
        throw(ex);
      }
    }
    else if(definition && definition.type === 'Unit') {
      defUnit = definition.clone();
    }

    aliases = aliases || [];
    offset = offset || 0;
    if(prefixes && prefixes.toUpperCase) 
      prefixes = PREFIXES[prefixes.toUpperCase()] || PREFIXES.NONE;
    else
      prefixes = PREFIXES.NONE;


    // If defUnit is null, it is because the user did not
    // specify a defintion. So create a new base dimension.
    var newUnit = {};
    if(!defUnit) {
      // Add a new base dimension
      var baseName = name + "_STUFF";   // foo --> foo_STUFF, or the essence of foo
      if(BASE_DIMENSIONS.indexOf(baseName) >= 0) {
        throw new Error('Cannot create new base unit "' + name + '": a base unit with that name already exists (and cannot be overridden)');
      }
      BASE_DIMENSIONS.push(baseName);

      // Push 0 onto existing base units
      for(var b in BASE_UNITS) {
        if(BASE_UNITS.hasOwnProperty(b)) {
          BASE_UNITS[b].dimensions[BASE_DIMENSIONS.length-1] = 0;
        }
      }

      // Add the new base unit
      var newBaseUnit = { dimensions: [] };
      for(var i=0; i<BASE_DIMENSIONS.length; i++) {
        newBaseUnit.dimensions[i] = 0;
      }
      newBaseUnit.dimensions[BASE_DIMENSIONS.length-1] = 1;
      newBaseUnit.key = baseName;
      BASE_UNITS[baseName] = newBaseUnit;
       
      newUnit = {
        name: name,
        value: 1,
        dimensions: BASE_UNITS[baseName].dimensions.slice(0),
        prefixes: prefixes,
        offset: offset,
        base: baseName
      };

      currentUnitSystem[baseName] = {
        unit: newUnit,
        prefix: PREFIXES.NONE['']
      };

    }
    else {

      newUnit = {
        name: name,
        value: defUnit.value,
        dimensions: defUnit.dimensions.slice(0),
        prefixes: prefixes,
        offset: offset,
      };
      
      // Create a new base if no matching base exists
      var anyMatch = false;
      for(var i in BASE_UNITS) {
        if(BASE_UNITS.hasOwnProperty(i)) {
          var match = true;
          for(var j=0; j<BASE_DIMENSIONS.length; j++) {
            if (Math.abs((newUnit.dimensions[j] || 0) - (BASE_UNITS[i].dimensions[j] || 0)) > 1e-12) {
              match = false;
              break;
            }
          }
          if(match) {
            anyMatch = true;
            break;
          }
        }
      }
      if(!anyMatch) {
        var baseName = name + "_STUFF";   // foo --> foo_STUFF, or the essence of foo
        // Add the new base unit
        var newBaseUnit = { dimensions: defUnit.dimensions.slice(0) };
        newBaseUnit.key = baseName;
        BASE_UNITS[baseName] = newBaseUnit;

        currentUnitSystem[baseName] = {
          unit: newUnit,
          prefix: PREFIXES.NONE['']
        };

        newUnit.base = baseName;
      }
    }

    Unit.UNITS[name] = newUnit;

    for (var i=0; i<aliases.length; i++) {
      var aliasName = aliases[i];
      var alias = {};
      for(var key in newUnit) {
        if(newUnit.hasOwnProperty(key)) {
          alias[key] = newUnit[key];
        }
      }
      alias.name = aliasName;
      Unit.UNITS[aliasName] = alias;
    }

    return new Unit(null, name);
  };

  Unit.deleteUnit = function(name) {
    delete Unit.UNITS[name];
  };


  Unit.PREFIXES = PREFIXES;
  Unit.BASE_UNITS = BASE_UNITS;
  Unit.UNITS = UNITS;
  Unit.UNIT_SYSTEMS = UNIT_SYSTEMS;

  return Unit;
}

exports.name = 'Unit';
exports.path = 'type';
exports.factory = factory;
exports.math = true; // request access to the math namespace

},{"../../function/arithmetic/abs":241,"../../function/arithmetic/addScalar":243,"../../function/arithmetic/divideScalar":248,"../../function/arithmetic/fix":253,"../../function/arithmetic/multiplyScalar":263,"../../function/arithmetic/pow":266,"../../function/arithmetic/subtract":271,"../../function/relational/equal":287,"../../function/string/format":294,"../../function/utils/isNumeric":322,"../../function/utils/typeof":324,"../../type/complex/Complex":325,"../../type/number":342,"../../utils/bignumber/constants":347,"../../utils/object":362,"../../utils/string":363,"util":4}],345:[function(require,module,exports){
'use strict';

/**
 * Format a number using methods toPrecision, toFixed, toExponential.
 * @param {number | string} value
 * @constructor
 */
function NumberFormatter (value) {
  // parse the input value
  var match = String(value).toLowerCase().match(/^0*?(-?)(\d+\.?\d*)(e([+-]?\d+))?$/);
  if (!match) {
    throw new SyntaxError('Invalid number');
  }

  var sign         = match[1];
  var coefficients = match[2];
  var exponent     = parseFloat(match[4] || '0');

  var dot = coefficients.indexOf('.');
  exponent += (dot !== -1) ? (dot - 1) : (coefficients.length - 1);

  this.sign = sign;
  this.coefficients = coefficients
      .replace('.', '')  // remove the dot (must be removed before removing leading zeros)
      .replace(/^0*/, function (zeros) {
        // remove leading zeros, add their count to the exponent
        exponent -= zeros.length;
        return '';
      })
      .replace(/0*$/, '') // remove trailing zeros
      .split('')
      .map(function (d) {
        return parseInt(d);
      });

  if (this.coefficients.length === 0) {
    this.coefficients.push(0);
    exponent++;
  }

  this.exponent = exponent;
}


/**
 * Format a number with engineering notation.
 * @param {number} [precision=0]        Optional number of decimals after the
 *                                      decimal point. Zero by default.
 */
NumberFormatter.prototype.toEngineering = function(precision) {
  var rounded = this.roundDigits(precision);

  var e = rounded.exponent;
  var c = rounded.coefficients;

  // find nearest lower multiple of 3 for exponent
  var newExp = e % 3 === 0 ? e : (e < 0 ? (e - 3) - (e % 3) : e - (e % 3));

  // concatenate coefficients with necessary zeros
  var significandsDiff = e >= 0 ? e : Math.abs(newExp);

  // add zeros if necessary (for ex: 1e+8)
  if (c.length - 1 < significandsDiff) c = c.concat(zeros(significandsDiff - (c.length - 1)));

  // find difference in exponents
  var expDiff = Math.abs(e - newExp);

  var decimalIdx = 1;
  var str = '';

  // push decimal index over by expDiff times
  while (--expDiff >= 0) decimalIdx++;

  // if all coefficient values are zero after the decimal point, don't add a decimal value. 
  // otherwise concat with the rest of the coefficients
  var decimals = c.slice(decimalIdx).join('');
  var decimalVal = decimals.match(/[1-9]/) ? ('.' + decimals) : '';

  str = c.slice(0, decimalIdx).join('') + decimalVal;

  str += 'e' + (e >= 0 ? '+' : '') + newExp.toString();
  return rounded.sign + str;
}

/**
 * Format a number with fixed notation.
 * @param {number} [precision=0]        Optional number of decimals after the
 *                                      decimal point. Zero by default.
 */
NumberFormatter.prototype.toFixed = function (precision) {
  var rounded = this.roundDigits(this.exponent + 1 + (precision || 0));
  var c = rounded.coefficients;
  var p = rounded.exponent + 1; // exponent may have changed

  // append zeros if needed
  var pp = p + (precision || 0);
  if (c.length < pp) {
    c = c.concat(zeros(pp - c.length));
  }

  // prepend zeros if needed
  if (p < 0) {
    c = zeros(-p + 1).concat(c);
    p = 1;
  }

  // insert a dot if needed
  if (precision) {
    c.splice(p, 0, (p === 0) ? '0.' : '.');
  }

  return this.sign + c.join('');
};

/**
 * Format a number in exponential notation. Like '1.23e+5', '2.3e+0', '3.500e-3'
 * @param {number} [precision]  Number of digits in formatted output.
 *                              If not provided, the maximum available digits
 *                              is used.
 */
NumberFormatter.prototype.toExponential = function (precision) {
  // round if needed, else create a clone
  var rounded = precision ? this.roundDigits(precision) : this.clone();
  var c = rounded.coefficients;
  var e = rounded.exponent;

  // append zeros if needed
  if (c.length < precision) {
    c = c.concat(zeros(precision - c.length));
  }

  // format as `C.CCCe+EEE` or `C.CCCe-EEE`
  var first = c.shift();
  return this.sign + first + (c.length > 0 ? ('.' + c.join('')) : '') +
      'e' + (e >= 0 ? '+' : '') + e;
};

/**
 * Format a number with a certain precision
 * @param {number} [precision=undefined] Optional number of digits.
 * @param {{lower: number | undefined, upper: number | undefined}} [options]
 *                                       By default:
 *                                         lower = 1e-3 (excl)
 *                                         upper = 1e+5 (incl)
 * @return {string}
 */
NumberFormatter.prototype.toPrecision = function(precision, options) {
  // determine lower and upper bound for exponential notation.
  var lower = (options && options.lower !== undefined) ? options.lower : 1e-3;
  var upper = (options && options.upper !== undefined) ? options.upper : 1e+5;

  var abs = Math.abs(Math.pow(10, this.exponent));
  if (abs < lower || abs >= upper) {
    // exponential notation
    return this.toExponential(precision);
  }
  else {
    var rounded = precision ? this.roundDigits(precision) : this.clone();
    var c = rounded.coefficients;
    var e = rounded.exponent;

    // append trailing zeros
    if (c.length < precision) {
      c = c.concat(zeros(precision - c.length));
    }

    // append trailing zeros
    // TODO: simplify the next statement
    c = c.concat(zeros(e - c.length + 1 +
        (c.length < precision ? precision - c.length : 0)));

    // prepend zeros
    c = zeros(-e).concat(c);

    var dot = e > 0 ? e : 0;
    if (dot < c.length - 1) {
      c.splice(dot + 1, 0, '.');
    }

    return this.sign + c.join('');
  }
};

/**
 * Crete a clone of the NumberFormatter
 * @return {NumberFormatter} Returns a clone of the NumberFormatter
 */
NumberFormatter.prototype.clone = function () {
  var clone = new NumberFormatter('0');
  clone.sign = this.sign;
  clone.coefficients = this.coefficients.slice(0);
  clone.exponent = this.exponent;
  return clone;
};

/**
 * Round the number of digits of a number *
 * @param {number} precision  A positive integer
 * @return {NumberFormatter}  Returns a new NumberFormatter with the rounded
 *                            digits
 */
NumberFormatter.prototype.roundDigits = function (precision) {
  var rounded = this.clone();
  var c = rounded.coefficients;

  // prepend zeros if needed
  while (precision <= 0) {
    c.unshift(0);
    rounded.exponent++;
    precision++;
  }

  if (c.length > precision) {
    var removed = c.splice(precision, c.length - precision);

    if (removed[0] >= 5) {
      var i = precision - 1;
      c[i]++;
      while (c[i] === 10) {
        c.pop();
        if (i === 0) {
          c.unshift(0);
          rounded.exponent++;
          i++;
        }
        i--;
        c[i]++;
      }
    }
  }

  return rounded;
};

/**
 * Create an array filled with zeros.
 * @param {number} length
 * @return {Array}
 */
function zeros(length) {
  var arr = [];
  for (var i = 0; i < length; i++) {
    arr.push(0);
  }
  return arr;
}

module.exports = NumberFormatter;

},{}],346:[function(require,module,exports){
'use strict';

var number = require('./number');
var string = require('./string');
var object = require('./object');
var types = require('./types');

var DimensionError = require('../error/DimensionError');
var IndexError = require('../error/IndexError');

/**
 * Calculate the size of a multi dimensional array.
 * This function checks the size of the first entry, it does not validate
 * whether all dimensions match. (use function `validate` for that)
 * @param {Array} x
 * @Return {Number[]} size
 */
exports.size = function (x) {
  var s = [];

  while (Array.isArray(x)) {
    s.push(x.length);
    x = x[0];
  }

  return s;
};

/**
 * Recursively validate whether each element in a multi dimensional array
 * has a size corresponding to the provided size array.
 * @param {Array} array    Array to be validated
 * @param {number[]} size  Array with the size of each dimension
 * @param {number} dim   Current dimension
 * @throws DimensionError
 * @private
 */
function _validate(array, size, dim) {
  var i;
  var len = array.length;

  if (len != size[dim]) {
    throw new DimensionError(len, size[dim]);
  }

  if (dim < size.length - 1) {
    // recursively validate each child array
    var dimNext = dim + 1;
    for (i = 0; i < len; i++) {
      var child = array[i];
      if (!Array.isArray(child)) {
        throw new DimensionError(size.length - 1, size.length, '<');
      }
      _validate(array[i], size, dimNext);
    }
  }
  else {
    // last dimension. none of the childs may be an array
    for (i = 0; i < len; i++) {
      if (Array.isArray(array[i])) {
        throw new DimensionError(size.length + 1, size.length, '>');
      }
    }
  }
}

/**
 * Validate whether each element in a multi dimensional array has
 * a size corresponding to the provided size array.
 * @param {Array} array    Array to be validated
 * @param {number[]} size  Array with the size of each dimension
 * @throws DimensionError
 */
exports.validate = function(array, size) {
  var isScalar = (size.length == 0);
  if (isScalar) {
    // scalar
    if (Array.isArray(array)) {
      throw new DimensionError(array.length, 0);
    }
  }
  else {
    // array
    _validate(array, size, 0);
  }
};

/**
 * Test whether index is an integer number with index >= 0 and index < length
 * when length is provided
 * @param {number} index    Zero-based index
 * @param {number} [length] Length of the array
 */
exports.validateIndex = function(index, length) {
  if (!number.isNumber(index) || !number.isInteger(index)) {
    throw new TypeError('Index must be an integer (value: ' + index + ')');
  }
  if (index < 0 || (typeof length === 'number' && index >= length)) {
    throw new IndexError(index, length);
  }
};

// a constant used to specify an undefined defaultValue
exports.UNINITIALIZED = {};

/**
 * Resize a multi dimensional array. The resized array is returned.
 * @param {Array} array         Array to be resized
 * @param {Array.<number>} size Array with the size of each dimension
 * @param {*} [defaultValue=0]  Value to be filled in in new entries,
 *                              zero by default. To leave new entries undefined,
 *                              specify array.UNINITIALIZED as defaultValue
 * @return {Array} array         The resized array
 */
exports.resize = function(array, size, defaultValue) {
  // TODO: add support for scalars, having size=[] ?

  // check the type of the arguments
  if (!Array.isArray(array) || !Array.isArray(size)) {
    throw new TypeError('Array expected');
  }
  if (size.length === 0) {
    throw new Error('Resizing to scalar is not supported');
  }

  // check whether size contains positive integers
  size.forEach(function (value) {
    if (!number.isNumber(value) || !number.isInteger(value) || value < 0) {
      throw new TypeError('Invalid size, must contain positive integers ' +
          '(size: ' + string.format(size) + ')');
    }
  });

  // recursively resize the array
  var _defaultValue = (defaultValue !== undefined) ? defaultValue : 0;
  _resize(array, size, 0, _defaultValue);

  return array;
};

/**
 * Recursively resize a multi dimensional array
 * @param {Array} array         Array to be resized
 * @param {number[]} size       Array with the size of each dimension
 * @param {number} dim          Current dimension
 * @param {*} [defaultValue]    Value to be filled in in new entries,
 *                              undefined by default.
 * @private
 */
function _resize (array, size, dim, defaultValue) {
  var i;
  var elem;
  var oldLen = array.length;
  var newLen = size[dim];
  var minLen = Math.min(oldLen, newLen);

  // apply new length
  array.length = newLen;

  if (dim < size.length - 1) {
    // non-last dimension
    var dimNext = dim + 1;

    // resize existing child arrays
    for (i = 0; i < minLen; i++) {
      // resize child array
      elem = array[i];
      if (!Array.isArray(elem)) {
        elem = [elem]; // add a dimension
        array[i] = elem;
      }
      _resize(elem, size, dimNext, defaultValue);
    }

    // create new child arrays
    for (i = minLen; i < newLen; i++) {
      // get child array
      elem = [];
      array[i] = elem;

      // resize new child array
      _resize(elem, size, dimNext, defaultValue);
    }
  }
  else {
    // last dimension

    // remove dimensions of existing values
    for (i = 0; i < minLen; i++) {
      while (Array.isArray(array[i])) {
        array[i] = array[i][0];
      }
    }

    if(defaultValue !== exports.UNINITIALIZED) {
      // fill new elements with the default value
      for (i = minLen; i < newLen; i++) {
        array[i] = defaultValue;
      }
    }
  }
}

/**
 * Squeeze a multi dimensional array
 * @param {Array} array
 * @param {Array} [size]
 * @returns {Array} returns the array itself
 */
exports.squeeze = function(array, size) {
  var s = size || exports.size(array);

  // squeeze outer dimensions
  while (Array.isArray(array) && array.length === 1) {
    array = array[0];
    s.shift();
  }

  // find the first dimension to be squeezed
  var dims = s.length;
  while (s[dims - 1] === 1) {
    dims--;
  }

  // squeeze inner dimensions
  if (dims < s.length) {
    array = _squeeze(array, dims, 0);
    s.length = dims;
  }

  return array;
};

/**
 * Recursively squeeze a multi dimensional array
 * @param {Array} array
 * @param {number} dims Required number of dimensions
 * @param {number} dim  Current dimension
 * @returns {Array | *} Returns the squeezed array
 * @private
 */
function _squeeze (array, dims, dim) {
  var i, ii;

  if (dim < dims) {
    var next = dim + 1;
    for (i = 0, ii = array.length; i < ii; i++) {
      array[i] = _squeeze(array[i], dims, next);
    }
  }
  else {
    while (Array.isArray(array)) {
      array = array[0];
    }
  }

  return array;
}

/**
 * Unsqueeze a multi dimensional array: add dimensions when missing
 * 
 * Paramter `size` will be mutated to match the new, unqueezed matrix size.
 * 
 * @param {Array} array
 * @param {number} dims     Desired number of dimensions of the array
 * @param {number} [outer]  Number of outer dimensions to be added
 * @param {Array} [size]    Current size of array.
 * @returns {Array} returns the array itself
 * @private
 */
exports.unsqueeze = function(array, dims, outer, size) {
  var s = size || exports.size(array);

  // unsqueeze outer dimensions
  if (outer) {
    for (var i = 0; i < outer; i++) {
      array = [array];
      s.unshift(1);
    }
  }

  // unsqueeze inner dimensions
  array = _unsqueeze(array, dims, 0);
  while (s.length < dims) {
    s.push(1);
  }

  return array;
};

/**
 * Recursively unsqueeze a multi dimensional array
 * @param {Array} array
 * @param {number} dims Required number of dimensions
 * @param {number} dim  Current dimension
 * @returns {Array | *} Returns the squeezed array
 * @private
 */
function _unsqueeze (array, dims, dim) {
  var i, ii;

  if (Array.isArray(array)) {
    var next = dim + 1;
    for (i = 0, ii = array.length; i < ii; i++) {
      array[i] = _unsqueeze(array[i], dims, next);
    }
  }
  else {
    for (var d = dim; d < dims; d++) {
      array = [array];
    }
  }

  return array;
}
/**
 * Flatten a multi dimensional array, put all elements in a one dimensional
 * array
 * @param {Array} array   A multi dimensional array
 * @return {Array}        The flattened array (1 dimensional)
 */
exports.flatten = function(array) {
  if (!Array.isArray(array)) {
    //if not an array, return as is
    return array;
  }
  var flat = [];

  array.forEach(function callback(value) {
    if (Array.isArray(value)) {
      value.forEach(callback);  //traverse through sub-arrays recursively
    }
    else {
      flat.push(value);
    }
  });

  return flat;
};

/**
 * Test whether an object is an array
 * @param {*} value
 * @return {boolean} isArray
 */
exports.isArray = Array.isArray;

},{"../error/DimensionError":15,"../error/IndexError":16,"./number":361,"./object":362,"./string":363,"./types":364}],347:[function(require,module,exports){
var memoize = require('../function').memoize;

/**
 * Calculate BigNumber e
 * @param {function} BigNumber   BigNumber constructor
 * @returns {BigNumber} Returns e
 */
exports.e = memoize(function (BigNumber) {
  return new BigNumber(1).exp();
}, hasher);

/**
 * Calculate BigNumber golden ratio, phi = (1+sqrt(5))/2
 * @param {function} BigNumber   BigNumber constructor
 * @returns {BigNumber} Returns phi
 */
exports.phi = memoize(function (BigNumber) {
  return new BigNumber(1).plus(new BigNumber(5).sqrt()).div(2);
}, hasher);

/**
 * Calculate BigNumber pi.
 * @param {function} BigNumber   BigNumber constructor
 * @returns {BigNumber} Returns pi
 */
exports.pi = memoize(function (BigNumber) {
  return pi = BigNumber.acos(-1);
}, hasher);

/**
 * Calculate BigNumber tau, tau = 2 * pi
 * @param {function} BigNumber   BigNumber constructor
 * @returns {BigNumber} Returns tau
 */
exports.tau = memoize(function (BigNumber) {
  return exports.pi(BigNumber).times(2);
}, hasher);

/**
 * Create a hash for a BigNumber constructor function. The created has is
 * the configured precision
 * @param {Array} args         Supposed to contain a single entry with
 *                             a BigNumber constructor
 * @return {number} precision
 * @private
 */
function hasher (args) {
  return args[0].precision;
}

},{"../function":358}],348:[function(require,module,exports){
/**
 * Convert a BigNumber to a formatted string representation.
 *
 * Syntax:
 *
 *    format(value)
 *    format(value, options)
 *    format(value, precision)
 *    format(value, fn)
 *
 * Where:
 *
 *    {number} value   The value to be formatted
 *    {Object} options An object with formatting options. Available options:
 *                     {string} notation
 *                         Number notation. Choose from:
 *                         'fixed'          Always use regular number notation.
 *                                          For example '123.40' and '14000000'
 *                         'exponential'    Always use exponential notation.
 *                                          For example '1.234e+2' and '1.4e+7'
 *                         'auto' (default) Regular number notation for numbers
 *                                          having an absolute value between
 *                                          `lower` and `upper` bounds, and uses
 *                                          exponential notation elsewhere.
 *                                          Lower bound is included, upper bound
 *                                          is excluded.
 *                                          For example '123.4' and '1.4e7'.
 *                     {number} precision   A number between 0 and 16 to round
 *                                          the digits of the number.
 *                                          In case of notations 'exponential' and
 *                                          'auto', `precision` defines the total
 *                                          number of significant digits returned
 *                                          and is undefined by default.
 *                                          In case of notation 'fixed',
 *                                          `precision` defines the number of
 *                                          significant digits after the decimal
 *                                          point, and is 0 by default.
 *                     {Object} exponential An object containing two parameters,
 *                                          {number} lower and {number} upper,
 *                                          used by notation 'auto' to determine
 *                                          when to return exponential notation.
 *                                          Default values are `lower=1e-3` and
 *                                          `upper=1e5`.
 *                                          Only applicable for notation `auto`.
 *    {Function} fn    A custom formatting function. Can be used to override the
 *                     built-in notations. Function `fn` is called with `value` as
 *                     parameter and must return a string. Is useful for example to
 *                     format all values inside a matrix in a particular way.
 *
 * Examples:
 *
 *    format(6.4);                                        // '6.4'
 *    format(1240000);                                    // '1.24e6'
 *    format(1/3);                                        // '0.3333333333333333'
 *    format(1/3, 3);                                     // '0.333'
 *    format(21385, 2);                                   // '21000'
 *    format(12.071, {notation: 'fixed'});                // '12'
 *    format(2.3,    {notation: 'fixed', precision: 2});  // '2.30'
 *    format(52.8,   {notation: 'exponential'});          // '5.28e+1'
 *
 * @param {BigNumber} value
 * @param {Object | Function | number} [options]
 * @return {string} str The formatted value
 */
exports.format = function (value, options) {
  if (typeof options === 'function') {
    // handle format(value, fn)
    return options(value);
  }

  // handle special cases
  if (!value.isFinite()) {
    return value.isNaN() ? 'NaN' : (value.gt(0) ? 'Infinity' : '-Infinity');
  }

  // default values for options
  var notation = 'auto';
  var precision = undefined;

  if (options !== undefined) {
    // determine notation from options
    if (options.notation) {
      notation = options.notation;
    }

    // determine precision from options
    if (typeof options === 'number') {
      precision = options;
    }
    else if (options.precision) {
      precision = options.precision;
    }
  }

  // handle the various notations
  switch (notation) {
    case 'fixed':
      return exports.toFixed(value, precision);

    case 'exponential':
      return exports.toExponential(value, precision);

    case 'auto':
      // determine lower and upper bound for exponential notation.
      // TODO: implement support for upper and lower to be BigNumbers themselves
      var lower = 1e-3;
      var upper = 1e5;
      if (options && options.exponential) {
        if (options.exponential.lower !== undefined) {
          lower = options.exponential.lower;
        }
        if (options.exponential.upper !== undefined) {
          upper = options.exponential.upper;
        }
      }

      // adjust the configuration of the BigNumber constructor (yeah, this is quite tricky...)
      var oldConfig = {
        toExpNeg: value.constructor.toExpNeg,
        toExpPos: value.constructor.toExpPos
      };

      value.constructor.config({
        toExpNeg: Math.round(Math.log(lower) / Math.LN10),
        toExpPos: Math.round(Math.log(upper) / Math.LN10)
      });

      // handle special case zero
      if (value.isZero()) return '0';

      // determine whether or not to output exponential notation
      var str;
      var abs = value.abs();
      if (abs.gte(lower) && abs.lt(upper)) {
        // normal number notation
        str = value.toSignificantDigits(precision).toFixed();
      }
      else {
        // exponential notation
        str = exports.toExponential(value, precision);
      }

      // remove trailing zeros after the decimal point
      return str.replace(/((\.\d*?)(0+))($|e)/, function () {
        var digits = arguments[2];
        var e = arguments[4];
        return (digits !== '.') ? digits + e : e;
      });

    default:
      throw new Error('Unknown notation "' + notation + '". ' +
          'Choose "auto", "exponential", or "fixed".');
  }
};

/**
 * Format a number in exponential notation. Like '1.23e+5', '2.3e+0', '3.500e-3'
 * @param {BigNumber} value
 * @param {number} [precision]  Number of digits in formatted output.
 *                              If not provided, the maximum available digits
 *                              is used.
 * @returns {string} str
 */
exports.toExponential = function (value, precision) {
  if (precision !== undefined) {
    return value.toExponential(precision - 1); // Note the offset of one
  }
  else {
    return value.toExponential();
  }
};

/**
 * Format a number with fixed notation.
 * @param {BigNumber} value
 * @param {number} [precision=0]        Optional number of decimals after the
 *                                      decimal point. Zero by default.
 */
exports.toFixed = function (value, precision) {
  return value.toFixed(precision || 0);
  // Note: the (precision || 0) is needed as the toFixed of BigNumber has an
  // undefined default precision instead of 0.
};

},{}],349:[function(require,module,exports){
'use strict';

/**
 * Compares two BigNumbers.
 * @param {BigNumber} x       First value to compare
 * @param {BigNumber} y       Second value to compare
 * @param {number} [epsilon]  The maximum relative difference between x and y
 *                            If epsilon is undefined or null, the function will
 *                            test whether x and y are exactly equal.
 * @return {boolean} whether the two numbers are nearly equal
 */
module.exports = function nearlyEqual(x, y, epsilon) {
  // if epsilon is null or undefined, test whether x and y are exactly equal
  if (epsilon == null) {
    return x.eq(y);
  }


  // use "==" operator, handles infinities
  if (x.eq(y)) {
    return true;
  }

  // NaN
  if (x.isNaN() || y.isNaN()) {
    return false;
  }

  // at this point x and y should be finite
  if(x.isFinite() && y.isFinite()) {
    // check numbers are very close, needed when comparing numbers near zero
    var diff = x.minus(y).abs();
    if (diff.isZero()) {
      return true;
    }
    else {
      // use relative error
      var max = x.constructor.max(x.abs(), y.abs());
      return diff.lte(max.times(epsilon));
    }
  }

  // Infinite and Number or negative Infinite and positive Infinite cases
  return false;
};

},{}],350:[function(require,module,exports){
'use strict';

/**
 * Test whether value is a boolean
 * @param {*} value
 * @return {boolean} isBoolean
 */
exports.isBoolean = function(value) {
  return typeof value == 'boolean';
};

},{}],351:[function(require,module,exports){
'use strict';

var isCollection = require('./isCollection');

/**
 * Test whether an array contains collections
 * @param {Array} array
 * @returns {boolean} Returns true when the array contains one or multiple
 *                    collections (Arrays or Matrices). Returns false otherwise.
 */
module.exports = function containsCollections (array) {
  for (var i = 0; i < array.length; i++) {
    if (isCollection(array[i])) {
      return true;
    }
  }
  return false;
};

},{"./isCollection":354}],352:[function(require,module,exports){
'use strict';

/**
 * Recursively loop over all elements in a given multi dimensional array
 * and invoke the callback on each of the elements.
 * @param {Array | Matrix} array
 * @param {Function} callback     The callback method is invoked with one
 *                                parameter: the current element in the array
 */
module.exports = function deepForEach (array, callback) {
  if (array && array.isMatrix === true) {
    array = array.valueOf();
  }

  for (var i = 0, ii = array.length; i < ii; i++) {
    var value = array[i];

    if (Array.isArray(value)) {
      deepForEach(value, callback);
    }
    else {
      callback(value);
    }
  }
};

},{}],353:[function(require,module,exports){
'use strict';

/**
 * Execute the callback function element wise for each element in array and any
 * nested array
 * Returns an array with the results
 * @param {Array | Matrix} array
 * @param {Function} callback   The callback is called with two parameters:
 *                              value1 and value2, which contain the current
 *                              element of both arrays.
 * @param {boolean} [skipZeros] Invoke callback function for non-zero values only.
 *
 * @return {Array | Matrix} res
 */
module.exports = function deepMap(array, callback, skipZeros) {
  if (array && (typeof array.map === 'function')) {
    // TODO: replace array.map with a for loop to improve performance
    return array.map(function (x) {
      return deepMap(x, callback, skipZeros);
    });
  }
  else {
    return callback(array);
  }
};

},{}],354:[function(require,module,exports){
'use strict';

/**
 * Test whether a value is a collection: an Array or Matrix
 * @param {*} x
 * @returns {boolean} isCollection
 */
module.exports = function isCollection (x) {
  return (Array.isArray(x) || (x && x.isMatrix === true));
};

},{}],355:[function(require,module,exports){
'use strict';

var arraySize = require('../array').size;
var IndexError = require('../../error/IndexError');

/**
 * Reduce a given matrix or array to a new matrix or
 * array with one less dimension, applying the given
 * callback in the selected dimension.
 * @param {Array | Matrix} mat
 * @param {number} dim
 * @param {Function} callback
 * @return {Array | Matrix} res
 */
module.exports = function(mat, dim, callback) {
  var size = Array.isArray(mat) ? arraySize(mat) : mat.size();
  if (dim < 0 || (dim >= size.length)) {
    // TODO: would be more clear when throwing a DimensionError here
    throw new IndexError(dim, size.length);
  }

  if (mat && mat.isMatrix === true) {
    return mat.create(_reduce(mat.valueOf(), dim, callback));
  }else {
    return _reduce(mat, dim, callback);
  }
};

/**
 * Recursively reduce a matrix
 * @param {Array} mat
 * @param {number} dim
 * @param {Function} callback
 * @returns {Array} ret
 * @private
 */
function _reduce(mat, dim, callback){
  var i, ret, val, tran;

  if(dim<=0){
    if( !Array.isArray(mat[0]) ){
      val = mat[0];
      for(i=1; i<mat.length; i++){
        val = callback(val, mat[i]);
      }
      return val;
    }else{
      tran = _switch(mat);
      ret = [];
      for(i=0; i<tran.length; i++){
        ret[i] = _reduce(tran[i], dim-1, callback);
      }
      return ret;
    }
  }else{
    ret = [];
    for(i=0; i<mat.length; i++){
      ret[i] = _reduce(mat[i], dim-1, callback);
    }
    return ret;
  }
}

/**
 * Transpose a matrix
 * @param {Array} mat
 * @returns {Array} ret
 * @private
 */
function _switch(mat){
  var I = mat.length;
  var J = mat[0].length;
  var i, j;
  var ret = [];
  for( j=0; j<J; j++) {
    var tmp = [];
    for( i=0; i<I; i++) {
      tmp.push(mat[i][j]);
    }
    ret.push(tmp);
  }
  return ret;
}

},{"../../error/IndexError":16,"../array":346}],356:[function(require,module,exports){
'use strict';

module.exports = function scatter(a, j, w, x, u, mark, c, f, inverse, update, value) {
  // a arrays
  var avalues = a._values;
  var aindex = a._index;
  var aptr = a._ptr;
  // c arrays
  var cindex = c._index;

  // vars
  var k, k0, k1, i;

  // check we need to process values (pattern matrix)
  if (x) {
    // values in j
    for (k0 = aptr[j], k1 = aptr[j + 1], k = k0; k < k1; k++) {
      // row
      i = aindex[k];
      // check value exists in current j
      if (w[i] !== mark) {
        // i is new entry in j
        w[i] = mark;
        // add i to pattern of C
        cindex.push(i);
        // x(i) = A, check we need to call function this time
        if (update) {
          // copy value to workspace calling callback function
          x[i] = inverse ? f(avalues[k], value) : f(value, avalues[k]);
          // function was called on current row
          u[i] = mark;
        }
        else {
          // copy value to workspace
          x[i] = avalues[k];
        }
      }
      else {
        // i exists in C already
        x[i] = inverse ? f(avalues[k], x[i]) : f(x[i], avalues[k]);
        // function was called on current row
        u[i] = mark;
      }
    }
  }
  else {
    // values in j
    for (k0 = aptr[j], k1 = aptr[j + 1], k = k0; k < k1; k++) {
      // row
      i = aindex[k];
      // check value exists in current j
      if (w[i] !== mark) {
        // i is new entry in j
        w[i] = mark;
        // add i to pattern of C
        cindex.push(i);
      }
      else {
        // indicate function was called on current row
        u[i] = mark;
      }
    }
  }
};

},{}],357:[function(require,module,exports){
var Emitter = require('tiny-emitter');

/**
 * Extend given object with emitter functions `on`, `off`, `once`, `emit`
 * @param {Object} obj
 * @return {Object} obj
 */
exports.mixin = function (obj) {
  // create event emitter
  var emitter = new Emitter();

  // bind methods to obj (we don't want to expose the emitter.e Array...)
  obj.on   = emitter.on.bind(emitter);
  obj.off  = emitter.off.bind(emitter);
  obj.once = emitter.once.bind(emitter);
  obj.emit = emitter.emit.bind(emitter);

  return obj;
};

},{"tiny-emitter":366}],358:[function(require,module,exports){
// function utils

/*
 * Memoize a given function by caching the computed result.
 * The cache of a memoized function can be cleared by deleting the `cache`
 * property of the function.
 *
 * @param {function} fn                     The function to be memoized.
 *                                          Must be a pure function.
 * @param {function(args: Array)} [hasher]  A custom hash builder.
 *                                          Is JSON.stringify by default.
 * @return {function}                       Returns the memoized function
 */
exports.memoize = function(fn, hasher) {
  return function memoize() {
    if (typeof memoize.cache !== 'object') {
      memoize.cache = {};
    }

    var args = [];
    for (var i = 0; i < arguments.length; i++) {
      args[i] = arguments[i];
    }

    var hash = hasher ? hasher(args) : JSON.stringify(args);
    if (!(hash in memoize.cache)) {
      return memoize.cache[hash] = fn.apply(fn, args);
    }
    return memoize.cache[hash];
  };
};

/**
 * Find the maximum number of arguments expected by a typed function.
 * @param {function} fn   A typed function
 * @return {number} Returns the maximum number of expected arguments.
 *                  Returns -1 when no signatures where found on the function.
 */
exports.maxArgumentCount = function (fn) {
  return Object.keys(fn.signatures || {})
      .reduce(function (args, signature) {
        var count = (signature.match(/,/g) || []).length + 1;
        return Math.max(args, count);
      }, -1);
};

},{}],359:[function(require,module,exports){
'use strict';

exports.array = require('./array');
exports['boolean'] = require('./boolean');
exports['function'] = require('./function');
exports.number = require('./number');
exports.object = require('./object');
exports.string = require('./string');
exports.types = require('./types');
exports.emitter = require('./emitter');

},{"./array":346,"./boolean":350,"./emitter":357,"./function":358,"./number":361,"./object":362,"./string":363,"./types":364}],360:[function(require,module,exports){
'use strict';

exports.symbols = {
  // GREEK LETTERS
  Alpha: 'A',     alpha: '\\alpha',
  Beta: 'B',      beta: '\\beta',
  Gamma: '\\Gamma',    gamma: '\\gamma',
  Delta: '\\Delta',    delta: '\\delta',
  Epsilon: 'E',   epsilon: '\\epsilon',  varepsilon: '\\varepsilon',
  Zeta: 'Z',      zeta: '\\zeta',
  Eta: 'H',       eta: '\\eta',
  Theta: '\\Theta',    theta: '\\theta',    vartheta: '\\vartheta',
  Iota: 'I',      iota: '\\iota',
  Kappa: 'K',     kappa: '\\kappa',    varkappa: '\\varkappa',
  Lambda: '\\Lambda',   lambda: '\\lambda',
  Mu: 'M',        mu: '\\mu',
  Nu: 'N',        nu: '\\nu',
  Xi: '\\Xi',       xi: '\\xi',
  Omicron: 'O',   omicron: 'o',
  Pi: '\\Pi',       pi: '\\pi',       varpi: '\\varpi',
  Rho: 'P',       rho: '\\rho',      varrho: '\\varrho',
  Sigma: '\\Sigma',    sigma: '\\sigma',    varsigma: '\\varsigma',
  Tau: 'T',       tau: '\\tau',
  Upsilon: '\\Upsilon',  upsilon: '\\upsilon',
  Phi: '\\Phi',      phi: '\\phi',      varphi: '\\varphi',
  Chi: 'X',       chi: '\\chi',
  Psi: '\\Psi',      psi: '\\psi',
  Omega: '\\Omega',    omega: '\\omega',
  //logic
  'true': '\\mathrm{True}',
  'false': '\\mathrm{False}',
  //other
  i: 'i', //TODO use \i ??
  inf: '\\infty',
  Inf: '\\infty',
  infinity: '\\infty',
  Infinity: '\\infty',
  oo: '\\infty',
  lim: '\\lim',
  'undefined': '\\mathbf{?}'
};

exports.operators = {
  'transpose': '^\\top',
  'factorial': '!',
  'pow': '^',
  'dotPow': '.^\\wedge', //TODO find ideal solution
  'unaryPlus': '+',
  'unaryMinus': '-',
  'bitNot': '~', //TODO find ideal solution
  'not': '\\neg',
  'multiply': '\\cdot',
  'divide': '\\frac', //TODO how to handle that properly?
  'dotMultiply': '.\\cdot', //TODO find ideal solution
  'dotDivide': '.:', //TODO find ideal solution
  'mod': '\\mod',
  'add': '+',
  'subtract': '-',
  'to': '\\rightarrow',
  'leftShift': '<<',
  'rightArithShift': '>>',
  'rightLogShift': '>>>',
  'equal': '=',
  'unequal': '\\neq',
  'smaller': '<',
  'larger': '>',
  'smallerEq': '\\leq',
  'largerEq': '\\geq',
  'bitAnd': '\\&',
  'bitXor': '\\underline{|}',
  'bitOr': '|',
  'and': '\\wedge',
  'xor': '\\veebar',
  'or': '\\vee'
};

exports.defaultTemplate = '\\mathrm{${name}}\\left(${args}\\right)';

var units = {
  deg: '^\\circ'
};

//@param {string} name
//@param {boolean} isUnit
exports.toSymbol = function (name, isUnit) {
  isUnit = typeof isUnit === 'undefined' ? false : isUnit;
  if (isUnit) {
    if (units.hasOwnProperty(name)) {
      return units[name];
    }
    return '\\mathrm{' + name + '}';
  }

  if (exports.symbols.hasOwnProperty(name)) {
    return exports.symbols[name];
  }
  else if (name.indexOf('_') !== -1) {
    //symbol with index (eg. alpha_1)
    var index = name.indexOf('_');
    return exports.toSymbol(name.substring(0, index)) + '_{'
      + exports.toSymbol(name.substring(index + 1)) + '}';
  }
  return name;
};

},{}],361:[function(require,module,exports){
'use strict';

var NumberFormatter = require('./NumberFormatter');

/**
 * Test whether value is a number
 * @param {*} value
 * @return {boolean} isNumber
 */
exports.isNumber = function(value) {
  return typeof value === 'number';
};

/**
 * Check if a number is integer
 * @param {number | boolean} value
 * @return {boolean} isInteger
 */
exports.isInteger = function(value) {
  return isFinite(value)
      ? (value == Math.round(value))
      : false;
  // Note: we use ==, not ===, as we can have Booleans as well
};

/**
 * Calculate the sign of a number
 * @param {number} x
 * @returns {*}
 */
exports.sign = Math.sign || function(x) {
  if (x > 0) {
    return 1;
  }
  else if (x < 0) {
    return -1;
  }
  else {
    return 0;
  }
};

/**
 * Convert a number to a formatted string representation.
 *
 * Syntax:
 *
 *    format(value)
 *    format(value, options)
 *    format(value, precision)
 *    format(value, fn)
 *
 * Where:
 *
 *    {number} value   The value to be formatted
 *    {Object} options An object with formatting options. Available options:
 *                     {string} notation
 *                         Number notation. Choose from:
 *                         'fixed'          Always use regular number notation.
 *                                          For example '123.40' and '14000000'
 *                         'exponential'    Always use exponential notation.
 *                                          For example '1.234e+2' and '1.4e+7'
 *                         'engineering'    Always use engineering notation.
 *                                          For example '123.4e+0' and '14.0e+6'
 *                         'auto' (default) Regular number notation for numbers
 *                                          having an absolute value between
 *                                          `lower` and `upper` bounds, and uses
 *                                          exponential notation elsewhere.
 *                                          Lower bound is included, upper bound
 *                                          is excluded.
 *                                          For example '123.4' and '1.4e7'.
 *                     {number} precision   A number between 0 and 16 to round
 *                                          the digits of the number.
 *                                          In case of notations 'exponential' and
 *                                          'auto', `precision` defines the total
 *                                          number of significant digits returned
 *                                          and is undefined by default.
 *                                          In case of notation 'fixed',
 *                                          `precision` defines the number of
 *                                          significant digits after the decimal
 *                                          point, and is 0 by default.
 *                     {Object} exponential An object containing two parameters,
 *                                          {number} lower and {number} upper,
 *                                          used by notation 'auto' to determine
 *                                          when to return exponential notation.
 *                                          Default values are `lower=1e-3` and
 *                                          `upper=1e5`.
 *                                          Only applicable for notation `auto`.
 *    {Function} fn    A custom formatting function. Can be used to override the
 *                     built-in notations. Function `fn` is called with `value` as
 *                     parameter and must return a string. Is useful for example to
 *                     format all values inside a matrix in a particular way.
 *
 * Examples:
 *
 *    format(6.4);                                        // '6.4'
 *    format(1240000);                                    // '1.24e6'
 *    format(1/3);                                        // '0.3333333333333333'
 *    format(1/3, 3);                                     // '0.333'
 *    format(21385, 2);                                   // '21000'
 *    format(12.071, {notation: 'fixed'});                // '12'
 *    format(2.3,    {notation: 'fixed', precision: 2});  // '2.30'
 *    format(52.8,   {notation: 'exponential'});          // '5.28e+1'
 *    format(12345678, {notation: 'engineering'});        // '12.345678e+6'
 *
 * @param {number} value
 * @param {Object | Function | number} [options]
 * @return {string} str The formatted value
 */
exports.format = function(value, options) {
  if (typeof options === 'function') {
    // handle format(value, fn)
    return options(value);
  }

  // handle special cases
  if (value === Infinity) {
    return 'Infinity';
  }
  else if (value === -Infinity) {
    return '-Infinity';
  }
  else if (isNaN(value)) {
    return 'NaN';
  }

  // default values for options
  var notation = 'auto';
  var precision = undefined;

  if (options) {
    // determine notation from options
    if (options.notation) {
      notation = options.notation;
    }

    // determine precision from options
    if (exports.isNumber(options)) {
      precision = options;
    }
    else if (options.precision) {
      precision = options.precision;
    }
  }

  // handle the various notations
  switch (notation) {
    case 'fixed':
      return exports.toFixed(value, precision);

    case 'exponential':
      return exports.toExponential(value, precision);

    case 'engineering':
      return exports.toEngineering(value, precision);

    case 'auto':
      return exports
          .toPrecision(value, precision, options && options.exponential)

          // remove trailing zeros after the decimal point
          .replace(/((\.\d*?)(0+))($|e)/, function () {
            var digits = arguments[2];
            var e = arguments[4];
            return (digits !== '.') ? digits + e : e;
          });

    default:
      throw new Error('Unknown notation "' + notation + '". ' +
          'Choose "auto", "exponential", or "fixed".');
  }
};

/**
 * Format a number in exponential notation. Like '1.23e+5', '2.3e+0', '3.500e-3'
 * @param {number} value
 * @param {number} [precision]  Number of digits in formatted output.
 *                              If not provided, the maximum available digits
 *                              is used.
 * @returns {string} str
 */
exports.toExponential = function(value, precision) {
  return new NumberFormatter(value).toExponential(precision);
};

/**
 * Format a number in engineering notation. Like '1.23e+6', '2.3e+0', '3.500e-3'
 * @param {number} value
 * @param {number} [precision]  Number of digits in formatted output.
 *                              If not provided, the maximum available digits
 *                              is used.
 * @returns {string} str
 */
exports.toEngineering = function(value, precision) {
  return new NumberFormatter(value).toEngineering(precision);
};

/**
 * Format a number with fixed notation.
 * @param {number} value
 * @param {number} [precision=0]        Optional number of decimals after the
 *                                      decimal point. Zero by default.
 */
exports.toFixed = function(value, precision) {
  return new NumberFormatter(value).toFixed(precision);
};

/**
 * Format a number with a certain precision
 * @param {number} value
 * @param {number} [precision=undefined] Optional number of digits.
 * @param {{lower: number, upper: number}} [options]  By default:
 *                                                    lower = 1e-3 (excl)
 *                                                    upper = 1e+5 (incl)
 * @return {string}
 */
exports.toPrecision = function(value, precision, options) {
  return new NumberFormatter(value).toPrecision(precision, options);
};

/**
 * Count the number of significant digits of a number.
 *
 * For example:
 *   2.34 returns 3
 *   0.0034 returns 2
 *   120.5e+30 returns 4
 *
 * @param {number} value
 * @return {number} digits   Number of significant digits
 */
exports.digits = function(value) {
  return value
      .toExponential()
      .replace(/e.*$/, '')          // remove exponential notation
      .replace( /^0\.?0*|\./, '')   // remove decimal point and leading zeros
      .length
};

/**
 * Minimum number added to one that makes the result different than one
 */
exports.DBL_EPSILON = Number.EPSILON || 2.2204460492503130808472633361816E-16;

/**
 * Compares two floating point numbers.
 * @param {number} x          First value to compare
 * @param {number} y          Second value to compare
 * @param {number} [epsilon]  The maximum relative difference between x and y
 *                            If epsilon is undefined or null, the function will
 *                            test whether x and y are exactly equal.
 * @return {boolean} whether the two numbers are nearly equal
*/
exports.nearlyEqual = function(x, y, epsilon) {
  // if epsilon is null or undefined, test whether x and y are exactly equal
  if (epsilon == null) {
    return x == y;
  }

  // use "==" operator, handles infinities
  if (x == y) {
    return true;
  }

  // NaN
  if (isNaN(x) || isNaN(y)) {
    return false;
  }

  // at this point x and y should be finite
  if(isFinite(x) && isFinite(y)) {
    // check numbers are very close, needed when comparing numbers near zero
    var diff = Math.abs(x - y);
    if (diff < exports.DBL_EPSILON) {
      return true;
    }
    else {
      // use relative error
      return diff <= Math.max(Math.abs(x), Math.abs(y)) * epsilon;
    }
  }

  // Infinite and Number or negative Infinite and positive Infinite cases
  return false;
};

},{"./NumberFormatter":345}],362:[function(require,module,exports){
'use strict';

/**
 * Clone an object
 *
 *     clone(x)
 *
 * Can clone any primitive type, array, and object.
 * If x has a function clone, this function will be invoked to clone the object.
 *
 * @param {*} x
 * @return {*} clone
 */
exports.clone = function clone(x) {
  var type = typeof x;

  // immutable primitive types
  if (type === 'number' || type === 'string' || type === 'boolean' ||
      x === null || x === undefined) {
    return x;
  }

  // use clone function of the object when available
  if (typeof x.clone === 'function') {
    return x.clone();
  }

  // array
  if (Array.isArray(x)) {
    return x.map(function (value) {
      return clone(value);
    });
  }

  if (x instanceof Number)    return new Number(x.valueOf());
  if (x instanceof String)    return new String(x.valueOf());
  if (x instanceof Boolean)   return new Boolean(x.valueOf());
  if (x instanceof Date)      return new Date(x.valueOf());
  if (x && x.isBigNumber === true) return x; // bignumbers are immutable
  if (x instanceof RegExp)  throw new TypeError('Cannot clone ' + x);  // TODO: clone a RegExp

  // object
  var m = {};
  for (var key in x) {
    if (x.hasOwnProperty(key)) {
      m[key] = clone(x[key]);
    }
  }
  return m;
};

/**
 * Extend object a with the properties of object b
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 */
exports.extend = function(a, b) {
  for (var prop in b) {
    if (b.hasOwnProperty(prop)) {
      a[prop] = b[prop];
    }
  }
  return a;
};

/**
 * Deep extend an object a with the properties of object b
 * @param {Object} a
 * @param {Object} b
 * @returns {Object}
 */
exports.deepExtend = function deepExtend (a, b) {
  // TODO: add support for Arrays to deepExtend
  if (Array.isArray(b)) {
    throw new TypeError('Arrays are not supported by deepExtend');
  }

  for (var prop in b) {
    if (b.hasOwnProperty(prop)) {
      if (b[prop] && b[prop].constructor === Object) {
        if (a[prop] === undefined) {
          a[prop] = {};
        }
        if (a[prop].constructor === Object) {
          deepExtend(a[prop], b[prop]);
        }
        else {
          a[prop] = b[prop];
        }
      } else if (Array.isArray(b[prop])) {
        throw new TypeError('Arrays are not supported by deepExtend');
      } else {
        a[prop] = b[prop];
      }
    }
  }
  return a;
};

/**
 * Deep test equality of all fields in two pairs of arrays or objects.
 * @param {Array | Object} a
 * @param {Array | Object} b
 * @returns {boolean}
 */
exports.deepEqual = function deepEqual (a, b) {
  var prop, i, len;
  if (Array.isArray(a)) {
    if (!Array.isArray(b)) {
      return false;
    }

    if (a.length != b.length) {
      return false;
    }

    for (i = 0, len = a.length; i < len; i++) {
      if (!exports.deepEqual(a[i], b[i])) {
        return false;
      }
    }
    return true;
  }
  else if (a instanceof Object) {
    if (Array.isArray(b) || !(b instanceof Object)) {
      return false;
    }

    for (prop in a) {
      //noinspection JSUnfilteredForInLoop
      if (!exports.deepEqual(a[prop], b[prop])) {
        return false;
      }
    }
    for (prop in b) {
      //noinspection JSUnfilteredForInLoop
      if (!exports.deepEqual(a[prop], b[prop])) {
        return false;
      }
    }
    return true;
  }
  else {
    return (typeof a === typeof b) && (a == b);
  }
};

/**
 * Test whether the current JavaScript engine supports Object.defineProperty
 * @returns {boolean} returns true if supported
 */
exports.canDefineProperty = function () {
  // test needed for broken IE8 implementation
  try {
    if (Object.defineProperty) {
      Object.defineProperty({}, 'x', { get: function () {} });
      return true;
    }
  } catch (e) {}

  return false;
};

/**
 * Attach a lazy loading property to a constant.
 * The given function `fn` is called once when the property is first requested.
 * On older browsers (<IE8), the function will fall back to direct evaluation
 * of the properties value.
 * @param {Object} object   Object where to add the property
 * @param {string} prop     Property name
 * @param {Function} fn     Function returning the property value. Called
 *                          without arguments.
 */
exports.lazy = function (object, prop, fn) {
  if (exports.canDefineProperty()) {
    var _uninitialized = true;
    var _value;
    Object.defineProperty(object, prop, {
      get: function () {
        if (_uninitialized) {
          _value = fn();
          _uninitialized = false;
        }
        return _value;
      },

      set: function (value) {
        _value = value;
        _uninitialized = false;
      },

      configurable: true,
      enumerable: true
    });
  }
  else {
    // fall back to immediate evaluation
    object[prop] = fn();
  }
};

/**
 * Traverse a path into an object.
 * When a namespace is missing, it will be created
 * @param {Object} object
 * @param {string} path   A dot separated string like 'name.space'
 * @return {Object} Returns the object at the end of the path
 */
exports.traverse = function(object, path) {
  var obj = object;

  if (path) {
    var names = path.split('.');
    for (var i = 0; i < names.length; i++) {
      var name = names[i];
      if (!(name in obj)) {
        obj[name] = {};
      }
      obj = obj[name];
    }
  }

  return obj;
};

/**
 * Test whether an object is a factory. a factory has fields:
 *
 * - factory: function (type: Object, config: Object, load: function, typed: function [, math: Object])   (required)
 * - name: string (optional)
 * - path: string    A dot separated path (optional)
 * - math: boolean   If true (false by default), the math namespace is passed
 *                   as fifth argument of the factory function
 *
 * @param {*} object
 * @returns {boolean}
 */
exports.isFactory = function (object) {
  return object && typeof object.factory === 'function';
};

},{}],363:[function(require,module,exports){
'use strict';

var formatNumber = require('./number').format;
var formatBigNumber = require('./bignumber/formatter').format;

/**
 * Test whether value is a string
 * @param {*} value
 * @return {boolean} isString
 */
exports.isString = function(value) {
  return typeof value === 'string';
};

/**
 * Check if a text ends with a certain string.
 * @param {string} text
 * @param {string} search
 */
exports.endsWith = function(text, search) {
  var start = text.length - search.length;
  var end = text.length;
  return (text.substring(start, end) === search);
};

/**
 * Format a value of any type into a string.
 *
 * Usage:
 *     math.format(value)
 *     math.format(value, precision)
 *
 * When value is a function:
 *
 * - When the function has a property `syntax`, it returns this
 *   syntax description.
 * - In other cases, a string `'function'` is returned.
 *
 * When `value` is an Object:
 *
 * - When the object contains a property `format` being a function, this
 *   function is invoked as `value.format(options)` and the result is returned.
 * - When the object has its own `toString` method, this method is invoked
 *   and the result is returned.
 * - In other cases the function will loop over all object properties and
 *   return JSON object notation like '{"a": 2, "b": 3}'.
 *
 * Example usage:
 *     math.format(2/7);                // '0.2857142857142857'
 *     math.format(math.pi, 3);         // '3.14'
 *     math.format(new Complex(2, 3));  // '2 + 3i'
 *     math.format('hello');            // '"hello"'
 *
 * @param {*} value             Value to be stringified
 * @param {Object | number | Function} [options]  Formatting options. See
 *                                                lib/utils/number:format for a
 *                                                description of the available
 *                                                options.
 * @return {string} str
 */
exports.format = function(value, options) {
  if (typeof value === 'number') {
    return formatNumber(value, options);
  }

  if (value && value.isBigNumber === true) {
    return formatBigNumber(value, options);
  }

  if (value && value.isFraction === true) {
    if (!options || options.fraction !== 'decimal') {
      // output as ratio, like '1/3'
      return (value.s * value.n) + '/' + value.d;
    }
    else {
      // output as decimal, like '0.(3)'
      return value.toString();
    }
  }

  if (Array.isArray(value)) {
    return formatArray(value, options);
  }

  if (exports.isString(value)) {
    return '"' + value + '"';
  }

  if (typeof value === 'function') {
    return value.syntax ? String(value.syntax) : 'function';
  }

  if (value && typeof value === 'object') {
    if (typeof value.format === 'function') {
      return value.format(options);
    }
    else if (value && value.toString() !== {}.toString()) {
      // this object has a non-native toString method, use that one
      return value.toString();
    }
    else {
      var entries = [];

      for (var key in value) {
        if (value.hasOwnProperty(key)) {
          entries.push('"' + key + '": ' + exports.format(value[key], options));
        }
      }

      return '{' + entries.join(', ') + '}';
    }
  }

  return String(value);
};

/**
 * Recursively format an n-dimensional matrix
 * Example output: "[[1, 2], [3, 4]]"
 * @param {Array} array
 * @param {Object | number | Function} [options]  Formatting options. See
 *                                                lib/utils/number:format for a
 *                                                description of the available
 *                                                options.
 * @returns {string} str
 */
function formatArray (array, options) {
  if (Array.isArray(array)) {
    var str = '[';
    var len = array.length;
    for (var i = 0; i < len; i++) {
      if (i != 0) {
        str += ', ';
      }
      str += formatArray(array[i], options);
    }
    str += ']';
    return str;
  }
  else {
    return exports.format(array, options);
  }
}

},{"./bignumber/formatter":348,"./number":361}],364:[function(require,module,exports){
'use strict';

/**
 * Determine the type of a variable
 *
 *     type(x)
 *
 * The following types are recognized:
 *
 *     'undefined'
 *     'null'
 *     'boolean'
 *     'number'
 *     'string'
 *     'Array'
 *     'Function'
 *     'Date'
 *     'RegExp'
 *     'Object'
 *
 * @param {*} x
 * @return {string} Returns the name of the type. Primitive types are lower case,
 *                  non-primitive types are upper-camel-case.
 *                  For example 'number', 'string', 'Array', 'Date'.
 */
exports.type = function(x) {
  var type = typeof x;

  if (type === 'object') {
    if (x === null)           return 'null';
    if (x instanceof Boolean) return 'boolean';
    if (x instanceof Number)  return 'number';
    if (x instanceof String)  return 'string';
    if (Array.isArray(x))     return 'Array';
    if (x instanceof Date)    return 'Date';
    if (x instanceof RegExp)  return 'RegExp';

    return 'Object';
  }

  if (type === 'function')    return 'Function';

  return type;
};

/**
 * Test whether a value is a scalar
 * @param x
 * @return {boolean} Returns true when x is a scalar, returns false when
 *                   x is a Matrix or Array.
 */
exports.isScalar = function (x) {
  return !((x && x.isMatrix) || Array.isArray(x));
};

},{}],365:[function(require,module,exports){
/**
 * @license Complex.js v2.0.1 11/02/2016
 *
 * Copyright (c) 2016, Robert Eisele (robert@xarg.org)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 **/

/**
 *
 * This class allows the manipilation of complex numbers.
 * You can pass a complex number in different formats. Either as object, double, string or two integer parameters.
 *
 * Object form
 * { re: <real>, im: <imaginary> }
 * { arg: <angle>, abs: <radius> }
 * { phi: <angle>, r: <radius> }
 *
 * Double form
 * 99.3 - Single double value
 *
 * String form
 * "23.1337" - Simple real number
 * "15+3i" - a simple complex number
 * "3-i" - a simple complex number
 *
 * Example:
 *
 * var c = new Complex("99.3+8i");
 * c.mul({r: 3, i: 9}).div(4.9).sub(3, 2);
 *
 */

(function(root) {

  "use strict";

  var P = {'re': 0, 'im': 0};

  Math.cosh = Math.cosh || function(x) {
    return (Math.exp(x) + Math.exp(-x)) * 0.5;
  };

  Math.sinh = Math.sinh || function(x) {
    return (Math.exp(x) - Math.exp(-x)) * 0.5;
  };

  var parser_exit = function() {
    throw SyntaxError("Invalid Param");
  };

  /**
   * Calculates log(sqrt(a^2+b^2)) in a way to avoid overflows
   *
   * @param {number} a
   * @param {number} b
   * @returns {number}
   */
  function logHypot(a, b) {

    var _a = Math.abs(a);
    var _b = Math.abs(b);

    if (a === 0) {
      return Math.log(_b);
    }

    if (b === 0) {
      return Math.log(_a);
    }

    if (_a < 3000 && _b < 3000) {
      return Math.log(a * a + b * b) * 0.5;
    }

    /* I got 4 ideas to compute this property without overflow:
     *
     * Testing 1000000 times with random samples for a,b ∈ [1, 1000000000] against a big decimal library to get an error estimate
     *
     * 1. Only eliminate the square root: (OVERALL ERROR: 3.9122483030951116e-11)

     Math.log(a * a + b * b) / 2

     *
     *
     * 2. Try to use the non-overflowing pythagoras: (OVERALL ERROR: 8.889760039210159e-10)

     var fn = function(a, b) {
     a = Math.abs(a);
     b = Math.abs(b);
     var t = Math.min(a, b);
     a = Math.max(a, b);
     t = t / a;

     return Math.log(a) + Math.log(1 + t * t) / 2;
     };

     * 3. Abuse the identity cos(atan(y/x) = x / sqrt(x^2+y^2): (OVERALL ERROR: 3.4780178737037204e-10)

     Math.log(a / Math.cos(Math.atan2(b, a)))

     * 4. Use 3. and apply log rules: (OVERALL ERROR: 1.2014087502620896e-9)

     Math.log(a) - Math.log(Math.cos(Math.atan2(b, a)))

     */

    return Math.log(a / Math.cos(Math.atan2(b, a)));
  }

  var parse = function(a, b) {

    if (a === undefined || a === null) {
      P["re"] =
      P["im"] = 0;
    } else if (b !== undefined) {
      P["re"] = a;
      P["im"] = b;
    } else switch (typeof a) {

      case "object":

        if ("im" in a && "re" in a) {
          P["re"] = a["re"];
          P["im"] = a["im"];
        } else if ("abs" in a && "arg" in a) {
          P["re"] = a["abs"] * Math.cos(a["arg"]);
          P["im"] = a["abs"] * Math.sin(a["arg"]);
        } else if ("r" in a && "phi" in a) {
          P["re"] = a["r"] * Math.cos(a["phi"]);
          P["im"] = a["r"] * Math.sin(a["phi"]);
        } else {
          parser_exit();
        }
        break;

      case "string":

        P["im"] = /* void */
        P["re"] = 0;

        var tokens = a.match(/\d+\.?\d*e[+-]?\d+|\d+\.?\d*|\.\d+|./g);
        var plus = 1;
        var minus = 0;

        if (tokens === null) {
          parser_exit();
        }

        for (var i = 0; i < tokens.length; i++) {

          var c = tokens[i];

          if (c === ' ' || c === '\t' || c === '\n') {
            /* void */
          } else if (c === '+') {
            plus++;
          } else if (c === '-') {
            minus++;
          } else if (c === 'i' || c === 'I') {

            if (plus + minus === 0) {
              parser_exit();
            }

            if (tokens[i + 1] !== ' ' && !isNaN(tokens[i + 1])) {
              P["im"]+= parseFloat((minus % 2 ? "-" : "") + tokens[i + 1]);
              i++;
            } else {
              P["im"]+= parseFloat((minus % 2 ? "-" : "") + "1");
            }
            plus = minus = 0;

          } else {

            if (plus + minus === 0 || isNaN(c)) {
              parser_exit();
            }

            if (tokens[i + 1] === 'i' || tokens[i + 1] === 'I') {
              P["im"]+= parseFloat((minus % 2 ? "-" : "") + c);
              i++;
            } else {
              P["re"]+= parseFloat((minus % 2 ? "-" : "") + c);
            }
            plus = minus = 0;
          }
        }

        // Still something on the stack
        if (plus + minus > 0) {
          parser_exit();
        }
        break;

      case "number":
        P["im"] = 0;
        P["re"] = a;
        break;

      default:
        parser_exit();
    }

    if (isNaN(P["re"]) || isNaN(P["im"])) {
      // If a calculation is NaN, we treat it as NaN and don't throw
      //parser_exit();
    }
  };

  /**
   * @constructor
   * @returns {Complex}
   */
  function Complex(a, b) {

    if (!(this instanceof Complex)) {
      return new Complex(a, b);
    }

    parse(a, b); // mutates P

    this["re"] = P["re"];
    this["im"] = P["im"];
  }

  Complex.prototype = {

    "re": 0,
    "im": 0,

    /**
     * Calculates the sign of a complex number
     *
     * @returns {Complex}
     */
    "sign": function() {

      var abs = this["abs"]();

      return new Complex(
              this["re"] / abs,
              this["im"] / abs);
    },

    /**
     * Adds two complex numbers
     *
     * @returns {Complex}
     */
    "add": function(a, b) {

      parse(a, b); // mutates P

      return new Complex(
              this["re"] + P["re"],
              this["im"] + P["im"]);
    },

    /**
     * Subtracts two complex numbers
     *
     * @returns {Complex}
     */
    "sub": function(a, b) {

      parse(a, b); // mutates P

      return new Complex(
              this["re"] - P["re"],
              this["im"] - P["im"]);
    },

    /**
     * Multiplies two complex numbers
     *
     * @returns {Complex}
     */
    "mul": function(a, b) {

      parse(a, b); // mutates P

      // Besides the addition/subtraction, this helps having a solution for rational Infinity
      if (P['im'] === 0 && this['im'] === 0) {
        return new Complex(this['re'] * P['re'], 0);
      }

      return new Complex(
              this["re"] * P["re"] - this["im"] * P["im"],
              this["re"] * P["im"] + this["im"] * P["re"]);
    },

    /**
     * Divides two complex numbers
     *
     * @returns {Complex}
     */
    "div": function(a, b) {

      parse(a, b); // mutates P

      a = this["re"];
      b = this["im"];

      var c = P["re"];
      var d = P["im"];
      var t, x;

      // Divisor is zero
      if (0 === c && 0 === d) {
        return new Complex(
                (a !== 0) ? (a / 0) : 0,
                (b !== 0) ? (b / 0) : 0);
      }

      // Divisor is rational
      if (0 === d) {
        return new Complex(a / c, b / c);
      }

      if (Math.abs(c) < Math.abs(d)) {

        x = c / d;
        t = c * x + d;

        return new Complex(
                (a * x + b) / t,
                (b * x - a) / t);

      } else {

        x = d / c;
        t = d * x + c;

        return new Complex(
                (a + b * x) / t,
                (b - a * x) / t);
      }
    },

    /**
     * Calculate the power of two complex numbers
     *
     * @returns {Complex}
     */
    "pow": function(a, b) {

      parse(a, b); // mutates P

      a = this["re"];
      b = this["im"];

      if (a === 0 && b === 0) {
        return new Complex(0, 0);
      }

      var arg = Math.atan2(b, a);
      var loh = logHypot(a, b);

      if (P["im"] === 0) {

        if (b === 0 && a >= 0) {

          return new Complex(Math.pow(a, P["re"]), 0);

        } else if (a === 0) {

          switch (P["re"] % 4) {
            case 0:
              return new Complex(Math.pow(b, P["re"]), 0);
            case 1:
              return new Complex(0, Math.pow(b, P["re"]));
            case 2:
              return new Complex(-Math.pow(b, P["re"]), 0);
            case 3:
              return new Complex(0, -Math.pow(b, P["re"]));
          }
        }
      }

      /* I couldn"t find a good formula, so here is a derivation and optimization
       *
       * z_1^z_2 = (a + bi)^(c + di)
       *         = exp((c + di) * log(a + bi)
       *         = pow(a^2 + b^2, (c + di) / 2) * exp(i(c + di)atan2(b, a))
       * =>...
       * Re = (pow(a^2 + b^2, c / 2) * exp(-d * atan2(b, a))) * cos(d * log(a^2 + b^2) / 2 + c * atan2(b, a))
       * Im = (pow(a^2 + b^2, c / 2) * exp(-d * atan2(b, a))) * sin(d * log(a^2 + b^2) / 2 + c * atan2(b, a))
       *
       * =>...
       * Re = exp(c * log(sqrt(a^2 + b^2)) - d * atan2(b, a)) * cos(d * log(sqrt(a^2 + b^2)) + c * atan2(b, a))
       * Im = exp(c * log(sqrt(a^2 + b^2)) - d * atan2(b, a)) * sin(d * log(sqrt(a^2 + b^2)) + c * atan2(b, a))
       *
       * =>
       * Re = exp(c * logsq2 - d * arg(z_1)) * cos(d * logsq2 + c * arg(z_1))
       * Im = exp(c * logsq2 - d * arg(z_1)) * sin(d * logsq2 + c * arg(z_1))
       *
       */

      a = Math.exp(P["re"] * loh - P["im"] * arg);
      b = P["im"] * loh + P["re"] * arg;
      return new Complex(
              a * Math.cos(b),
              a * Math.sin(b));
    },

    /**
     * Calculate the complex square root
     *
     * @returns {Complex}
     */
    "sqrt": function() {

      var a = this["re"];
      var b = this["im"];
      var r = this["abs"]();

      var re, im;

      if (a >= 0 && b === 0) {
        return new Complex(Math.sqrt(a), 0);
      }

      if (a >= 0) {
        re = 0.5 * Math.sqrt(2.0 * (r + a));
      } else {
        re = Math.abs(b) / Math.sqrt(2 * (r - a));
      }

      if (a <= 0) {
        im = 0.5 * Math.sqrt(2.0 * (r - a));
      } else {
        im = Math.abs(b) / Math.sqrt(2 * (r + a));
      }

      return new Complex(re, b >= 0 ? im : -im);
    },

    /**
     * Calculate the complex exponent
     *
     * @returns {Complex}
     */
    "exp": function() {

      var tmp = Math.exp(this["re"]);

      if (this["im"] === 0) {
        //return new Complex(tmp, 0);
      }
      return new Complex(
              tmp * Math.cos(this["im"]),
              tmp * Math.sin(this["im"]));
    },

    /**
     * Calculate the natural log
     *
     * @returns {Complex}
     */
    "log": function() {

      var a = this["re"];
      var b = this["im"];
      
      if (b === 0 && a > 0) {
        //return new Complex(Math.log(a), 0);
      }

      return new Complex(
              logHypot(a, b),
              Math.atan2(b, a));
    },

    /**
     * Calculate the magniture of the complex number
     *
     * @returns {number}
     */
    "abs": function() {

      var a = Math.abs(this["re"]);
      var b = Math.abs(this["im"]);

      if (a < 3000 && b < 3000) {
        return Math.sqrt(a * a + b * b);
      }

      if (a < b) {
        a = b;
        b = this["re"] / this["im"];
      } else {
        b = this["im"] / this["re"];
      }
      return a * Math.sqrt(1 + b * b);
    },

    /**
     * Calculate the angle of the complex number
     *
     * @returns {number}
     */
    "arg": function() {

      return Math.atan2(this["im"], this["re"]);
    },

    /**
     * Calculate the sine of the complex number
     *
     * @returns {Complex}
     */
    "sin": function() {

      var a = this["re"];
      var b = this["im"];

      return new Complex(
              Math.sin(a) * Math.cosh(b),
              Math.cos(a) * Math.sinh(b));
    },

    /**
     * Calculate the cosine
     *
     * @returns {Complex}
     */
    "cos": function() {

      var a = this["re"];
      var b = this["im"];

      return new Complex(
              Math.cos(a) * Math.cosh(b),
             -Math.sin(a) * Math.sinh(b));
    },

    /**
     * Calculate the tangent
     *
     * @returns {Complex}
     */
    "tan": function() {

      var a = 2 * this["re"];
      var b = 2 * this["im"];
      var d = Math.cos(a) + Math.cosh(b);

      return new Complex(
              Math.sin(a) / d,
              Math.sinh(b) / d);
    },

    /**
     * Calculate the cotangent
     *
     * @returns {Complex}
     */
    "cot": function() {

      var a = 2 * this["re"];
      var b = 2 * this["im"];
      var d = Math.cos(a) - Math.cosh(b);

      return new Complex(
             -Math.sin(a) / d,
              Math.sinh(b) / d);
    },

    /**
     * Calculate the secant
     *
     * @returns {Complex}
     */
    "sec": function() {

      var a = this["re"];
      var b = this["im"];
      var d = 0.5 * Math.cosh(2 * b) + 0.5 * Math.cos(2 * a);

      return new Complex(
              Math.cos(a) * Math.cosh(b) / d,
              Math.sin(a) * Math.sinh(b) / d);
    },

    /**
     * Calculate the cosecans
     *
     * @returns {Complex}
     */
    "csc": function() {

      var a = this["re"];
      var b = this["im"];
      var d = 0.5 * Math.cosh(2 * b) - 0.5 * Math.cos(2 * a);

      return new Complex(
              Math.sin(a) * Math.cosh(b) / d,
             -Math.cos(a) * Math.sinh(b) / d);
    },

    /**
     * Calculate the complex arcus sinus
     *
     * @returns {Complex}
     */
    "asin": function() {

      var a = this["re"];
      var b = this["im"];

      var t1 = new Complex(
               b * b - a * a + 1,
              -2 * a * b)['sqrt']();

      var t2 = new Complex(
              t1['re'] - b,
              t1['im'] + a)['log']();

      return new Complex(t2['im'], -t2['re']);
    },

    /**
     * Calculate the complex arcus cosinus
     *
     * @returns {Complex}
     */
    "acos": function() {

      var a = this["re"];
      var b = this["im"];

      var t1 = new Complex(
               b * b - a * a + 1,
              -2 * a * b)['sqrt']();

      var t2 = new Complex(
              t1["re"] - b,
              t1["im"] + a)['log']();

      return new Complex(Math.PI / 2 - t2["im"], t2["re"]);
    },

    /**
     * Calculate the complex arcus tangent
     *
     * @returns {Complex}
     */
    "atan": function() {

      var a = this["re"];
      var b = this["im"];

      if (a === 0) {

        if (b === 1) {
          return new Complex(0, Infinity);
        }

        if (b === -1) {
          return new Complex(0, -Infinity);
        }
      }

      var d = a * a + (1.0 - b) * (1.0 - b);

      var t1 = new Complex(
              (1 - b * b - a * a) / d,
              -2 * a / d).log();

      return new Complex(-0.5 * t1["im"], 0.5 * t1["re"]);
    },

    /**
     * Calculate the complex arcus cotangent
     *
     * @returns {Complex}
     */
    "acot": function() {

      var a = this["re"];
      var b = this["im"];

      if (b === 0) {
        return new Complex(Math.atan2(1, a), 0);
      }

      var d = a * a + b * b;
      return (d !== 0)
              ? new Complex(
                      a / d,
                     -b / d).atan()
              : new Complex(
                      (a !== 0) ? a / 0 : 0,
                      (b !== 0) ?-b / 0 : 0).atan();
    },

    /**
     * Calculate the complex arcus secant
     *
     * @returns {Complex}
     */
    "asec": function() {

      var a = this["re"];
      var b = this["im"];

      if (a === 0 && b === 0) {
        return new Complex(0, Infinity);
      }

      var d = a * a + b * b;
      return (d !== 0)
              ? new Complex(
                      a / d,
                      -b / d).acos()
              : new Complex(
                      (a !== 0) ? a / 0 : 0,
                      (b !== 0) ?-b / 0 : 0).acos();
    },

    /**
     * Calculate the complex arcus cosecans
     *
     * @returns {Complex}
     */
    "acsc": function() {

      var a = this["re"];
      var b = this["im"];

      if (a === 0 && b === 0) {
        return new Complex(Math.PI / 2, Infinity);
      }

      var d = a * a + b * b;
      return (d !== 0)
              ? new Complex(
                      a / d,
                     -b / d).asin()
              : new Complex(
                      (a !== 0) ? a / 0 : 0,
                      (b !== 0) ?-b / 0 : 0).asin();
    },

    /**
     * Calculate the complex sinh
     *
     * @returns {Complex}
     */
    "sinh": function() {

      var a = this["re"];
      var b = this["im"];

      return new Complex(
              Math.sinh(a) * Math.cos(b),
              Math.cosh(a) * Math.sin(b));
    },

    /**
     * Calculate the complex cosh
     *
     * @returns {Complex}
     */
    "cosh": function() {

      var a = this["re"];
      var b = this["im"];

      return new Complex(
              Math.cosh(a) * Math.cos(b),
              Math.sinh(a) * Math.sin(b));
    },

    /**
     * Calculate the complex tanh
     *
     * @returns {Complex}
     */
    "tanh": function() {

      var a = 2 * this["re"];
      var b = 2 * this["im"];
      var d = Math.cosh(a) + Math.cos(b);

      return new Complex(
              Math.sinh(a) / d,
              Math.sin(b) / d);
    },

    /**
     * Calculate the complex coth
     *
     * @returns {Complex}
     */
    "coth": function() {

      var a = 2 * this["re"];
      var b = 2 * this["im"];
      var d = Math.cosh(a) - Math.cos(b);

      return new Complex(
              Math.sinh(a) / d,
             -Math.sin(b) / d);
    },

    /**
     * Calculate the complex coth
     *
     * @returns {Complex}
     */
    "csch": function() {

      var a = this["re"];
      var b = this["im"];
      var d = Math.cos(2 * b) - Math.cosh(2 * a);

      return new Complex(
           -2 * Math.sinh(a) * Math.cos(b) / d, 
            2 * Math.cosh(a) * Math.sin(b) / d);
    },

    /**
     * Calculate the complex sech
     *
     * @returns {Complex}
     */
    "sech": function() {

      var a = this["re"];
      var b = this["im"];
      var d = Math.cos(2 * b) + Math.cosh(2 * a);

      return new Complex(
              2 * Math.cosh(a) * Math.cos(b) / d, 
             -2 * Math.sinh(a) * Math.sin(b) / d);
    },

    /**
     * Calculate the complex asinh
     *
     * @returns {Complex}
     */
    "asinh": function() {

      var tmp = this["im"];
      this["im"] = -this["re"];
      this["re"] = tmp;
      var res = this["asin"]();

      this["re"] = -this["im"];
      this["im"] = tmp;
      tmp = res["re"];

      res["re"] = -res["im"];
      res["im"] = tmp;
      return res;
    },

    /**
     * Calculate the complex asinh
     *
     * @returns {Complex}
     */
    "acosh": function() {

      var tmp;
      var res = this["acos"]();
      if (res["im"] <= 0) {
        tmp = res["re"];
        res["re"] = -res["im"];
        res["im"] = tmp;
      } else {
        tmp = res["im"];
        res["im"] = -res["re"];
        res["re"] = tmp;
      }
      return res;
    },

    /**
     * Calculate the complex atanh
     *
     * @returns {Complex}
     */
    "atanh": function() {

      var a = this["re"];
      var b = this["im"];

      var noIM = a > 1 && b === 0;
      var oneMinus = 1 - a;
      var onePlus = 1 + a;
      var d = oneMinus * oneMinus + b * b;

      var x = (d !== 0)
              ? new Complex(
                      (onePlus * oneMinus - b * b) / d,
                      (b * oneMinus + onePlus * b) / d)
              : new Complex(
                      (a !== -1) ? (a / 0) : 0,
                      (b !== 0) ? (b / 0) : 0);

      var temp = x["re"];
      x["re"] = logHypot(x["re"], x["im"]) / 2;
      x["im"] = Math.atan2(x["im"], temp) / 2;
      if (noIM) {
        x["im"] = -x["im"];
      }
      return x;
    },

    /**
     * Calculate the complex acoth
     *
     * @returns {Complex}
     */
    "acoth": function() {

      var a = this["re"];
      var b = this["im"];

      if (a === 0 && b === 0) {

        return new Complex(0, Math.PI / 2);
      }

      var d = a * a + b * b;
      return (d !== 0)
              ? new Complex(
                      a / d,
                     -b / d).atanh()
              : new Complex(
                      (a !== 0) ? a / 0 : 0,
                      (b !== 0) ?-b / 0 : 0).atanh();
    },

    /**
     * Calculate the complex acsch
     *
     * @returns {Complex}
     */
    "acsch": function() {

      var a = this["re"];
      var b = this["im"];

      if (b === 0) {

        return new Complex(
                (a !== 0)
                ? Math.log(a + Math.sqrt(a * a + 1))
                : Infinity, 0);
      }

      var d = a * a + b * b;
      return (d !== 0)
              ? new Complex(
                      a / d,
                      -b / d).asinh()
              : new Complex(
                      (a !== 0) ? a / 0 : 0,
                      (b !== 0) ?-b / 0 : 0).asinh();
    },

    /**
     * Calculate the complex asech
     *
     * @returns {Complex}
     */
    "asech": function() {

      var a = this["re"];
      var b = this["im"];

      if (a === 0 && b === 0) {
        return new Complex(Infinity, 0);
      }

      var d = a * a + b * b;
      return (d !== 0)
              ? new Complex(
                      a / d,
                     -b / d).acosh()
              : new Complex(
                      (a !== 0) ? a / 0 : 0,
                      (b !== 0) ?-b / 0 : 0).acosh();
    },

    /**
     * Calculate the complex inverse 1/z
     *
     * @returns {Complex}
     */
    "inverse": function() {

      var a = this["re"];
      var b = this["im"];

      var d = a * a + b * b;

      return new Complex(
              a !== 0 ? a / d : 0,
              b !== 0 ?-b / d : 0);
    },

    /**
     * Returns the complex conjugate
     *
     * @returns {Complex}
     */
    "conjugate": function() {

      return new Complex(this["re"], -this["im"]);
    },

    /**
     * Gets the negated complex number
     *
     * @returns {Complex}
     */
    "neg": function() {

      return new Complex(-this["re"], -this["im"]);
    },

    /**
     * Ceils the actual complex number
     *
     * @returns {Complex}
     */
    "ceil": function(places) {

      places = Math.pow(10, places || 0);

      return new Complex(
              Math.ceil(this["re"] * places) / places,
              Math.ceil(this["im"] * places) / places);
    },

    /**
     * Floors the actual complex number
     *
     * @returns {Complex}
     */
    "floor": function(places) {

      places = Math.pow(10, places || 0);

      return new Complex(
              Math.floor(this["re"] * places) / places,
              Math.floor(this["im"] * places) / places);
    },

    /**
     * Ceils the actual complex number
     *
     * @returns {Complex}
     */
    "round": function(places) {

      places = Math.pow(10, places || 0);

      return new Complex(
              Math.round(this["re"] * places) / places,
              Math.round(this["im"] * places) / places);
    },

    /**
     * Compares two complex numbers
     *
     * @returns {boolean}
     */
    "equals": function(a, b) {

      parse(a, b); // mutates P

      return Math.abs(P["re"] - this["re"]) <= Complex["EPSILON"] &&
             Math.abs(P["im"] - this["im"]) <= Complex["EPSILON"];
    },

    /**
     * Clones the actual object
     *
     * @returns {Complex}
     */
    "clone": function() {

      return new Complex(this["re"], this["im"]);
    },

    /**
     * Gets a string of the actual complex number
     *
     * @returns {string}
     */
    "toString": function() {

      var a = this["re"];
      var b = this["im"];
      var ret = "";

      if (isNaN(a) || isNaN(b)) {
        return "NaN";
      }

      if (a !== 0) {
        ret+= a;
      }

      if (b !== 0) {

        if (a !== 0) {
          ret+= b < 0 ? " - " : " + ";
        } else if (b < 0) {
          ret+= "-";
        }

        b = Math.abs(b);

        if (1 !== b) {
          ret+= b;
        }
        ret+= "i";
      }

      if (!ret)
        return "0";

      return ret;
    },

    /**
     * Returns the actual number as a vector
     *
     * @returns {Array}
     */
    "toVector": function() {

      return [this["re"], this["im"]];
    },

    /**
     * Returns the actual real value of the current object
     *
     * @returns {number|null}
     */
    "valueOf": function() {

      if (this["im"] === 0) {
        return this["re"];
      }
      return null;
    },

    /**
     * Checks if the given complex number is not a number
     *
     * @returns {boolean}
     */
    isNaN: function() {
      return isNaN(this['re']) || isNaN(this['im']);
    }
  };

  Complex["ZERO"] = new Complex(0, 0);
  Complex["ONE"] = new Complex(1, 0);
  Complex["I"] = new Complex(0, 1);
  Complex["PI"] = new Complex(Math.PI, 0);
  Complex["E"] = new Complex(Math.E, 0);
  Complex['EPSILON'] = 1e-16;

  if (typeof define === "function" && define["amd"]) {
    define([], function() {
      return Complex;
    });
  } else if (typeof exports === "object") {
    module["exports"] = Complex;
  } else {
    root["Complex"] = Complex;
  }
  
})(this);

},{}],366:[function(require,module,exports){
function E () {
	// Keep this empty so it's easier to inherit from
  // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
}

E.prototype = {
	on: function (name, callback, ctx) {
    var e = this.e || (this.e = {});

    (e[name] || (e[name] = [])).push({
      fn: callback,
      ctx: ctx
    });

    return this;
  },

  once: function (name, callback, ctx) {
    var self = this;
    function listener () {
      self.off(name, listener);
      callback.apply(ctx, arguments);
    };

    listener._ = callback
    return this.on(name, listener, ctx);
  },

  emit: function (name) {
    var data = [].slice.call(arguments, 1);
    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
    var i = 0;
    var len = evtArr.length;

    for (i; i < len; i++) {
      evtArr[i].fn.apply(evtArr[i].ctx, data);
    }

    return this;
  },

  off: function (name, callback) {
    var e = this.e || (this.e = {});
    var evts = e[name];
    var liveEvents = [];

    if (evts && callback) {
      for (var i = 0, len = evts.length; i < len; i++) {
        if (evts[i].fn !== callback && evts[i].fn._ !== callback)
          liveEvents.push(evts[i]);
      }
    }

    // Remove event from queue to prevent memory leak
    // Suggested by https://github.com/lazd
    // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910

    (liveEvents.length)
      ? e[name] = liveEvents
      : delete e[name];

    return this;
  }
};

module.exports = E;

},{}],367:[function(require,module,exports){
/**
 * typed-function
 *
 * Type checking for JavaScript functions
 *
 * https://github.com/josdejong/typed-function
 */
'use strict';

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof exports === 'object') {
    // OldNode. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like OldNode.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.typed = factory();
  }
}(this, function () {
  // factory function to create a new instance of typed-function
  // TODO: allow passing configuration, types, tests via the factory function
  function create() {
    /**
     * Get a type test function for a specific data type
     * @param {string} name                   Name of a data type like 'number' or 'string'
     * @returns {Function(obj: *) : boolean}  Returns a type testing function.
     *                                        Throws an error for an unknown type.
     */
    function getTypeTest(name) {
      var test;
      for (var i = 0; i < typed.types.length; i++) {
        var entry = typed.types[i];
        if (entry.name === name) {
          test = entry.test;
          break;
        }
      }

      if (!test) {
        var hint;
        for (i = 0; i < typed.types.length; i++) {
          entry = typed.types[i];
          if (entry.name.toLowerCase() == name.toLowerCase()) {
            hint = entry.name;
            break;
          }
        }

        throw new Error('Unknown type "' + name + '"' +
            (hint ? ('. Did you mean "' + hint + '"?') : ''));
      }
      return test;
    }

    /**
     * Retrieve the function name from a set of functions, and check
     * whether the name of all functions match (if given)
     * @param {Array.<function>} fns
     */
    function getName (fns) {
      var name = '';

      for (var i = 0; i < fns.length; i++) {
        var fn = fns[i];

        // merge function name when this is a typed function
        if (fn.signatures && fn.name != '') {
          if (name == '') {
            name = fn.name;
          }
          else if (name != fn.name) {
            var err = new Error('Function names do not match (expected: ' + name + ', actual: ' + fn.name + ')');
            err.data = {
              actual: fn.name,
              expected: name
            };
            throw err;
          }
        }
      }

      return name;
    }

    /**
     * Create an ArgumentsError. Creates messages like:
     *
     *   Unexpected type of argument (expected: ..., actual: ..., index: ...)
     *   Too few arguments (expected: ..., index: ...)
     *   Too many arguments (expected: ..., actual: ...)
     *
     * @param {String} fn         Function name
     * @param {number} argCount   Number of arguments
     * @param {Number} index      Current argument index
     * @param {*} actual          Current argument
     * @param {string} [expected] An optional, comma separated string with
     *                            expected types on given index
     * @extends Error
     */
    function createError(fn, argCount, index, actual, expected) {
      var actualType = getTypeOf(actual);
      var _expected = expected ? expected.split(',') : null;
      var _fn = (fn || 'unnamed');
      var anyType = _expected && contains(_expected, 'any');
      var message;
      var data = {
        fn: fn,
        index: index,
        actual: actual,
        expected: _expected
      };

      if (_expected) {
        if (argCount > index && !anyType) {
          // unexpected type
          message = 'Unexpected type of argument in function ' + _fn +
              ' (expected: ' + _expected.join(' or ') + ', actual: ' + actualType + ', index: ' + index + ')';
        }
        else {
          // too few arguments
          message = 'Too few arguments in function ' + _fn +
              ' (expected: ' + _expected.join(' or ') + ', index: ' + index + ')';
        }
      }
      else {
        // too many arguments
        message = 'Too many arguments in function ' + _fn +
            ' (expected: ' + index + ', actual: ' + argCount + ')'
      }

      var err = new TypeError(message);
      err.data = data;
      return err;
    }

    /**
     * Collection with function references (local shortcuts to functions)
     * @constructor
     * @param {string} [name='refs']  Optional name for the refs, used to generate
     *                                JavaScript code
     */
    function Refs(name) {
      this.name = name || 'refs';
      this.categories = {};
    }

    /**
     * Add a function reference.
     * @param {Function} fn
     * @param {string} [category='fn']    A function category, like 'fn' or 'signature'
     * @returns {string} Returns the function name, for example 'fn0' or 'signature2'
     */
    Refs.prototype.add = function (fn, category) {
      var cat = category || 'fn';
      if (!this.categories[cat]) this.categories[cat] = [];

      var index = this.categories[cat].indexOf(fn);
      if (index == -1) {
        index = this.categories[cat].length;
        this.categories[cat].push(fn);
      }

      return cat + index;
    };

    /**
     * Create code lines for all function references
     * @returns {string} Returns the code containing all function references
     */
    Refs.prototype.toCode = function () {
      var code = [];
      var path = this.name + '.categories';
      var categories = this.categories;

      for (var cat in categories) {
        if (categories.hasOwnProperty(cat)) {
          var category = categories[cat];

          for (var i = 0; i < category.length; i++) {
            code.push('var ' + cat + i + ' = ' + path + '[\'' + cat + '\'][' + i + '];');
          }
        }
      }

      return code.join('\n');
    };

    /**
     * A function parameter
     * @param {string | string[] | Param} types    A parameter type like 'string',
     *                                             'number | boolean'
     * @param {boolean} [varArgs=false]            Variable arguments if true
     * @constructor
     */
    function Param(types, varArgs) {
      // parse the types, can be a string with types separated by pipe characters |
      if (typeof types === 'string') {
        // parse variable arguments operator (ellipses '...number')
        var _types = types.trim();
        var _varArgs = _types.substr(0, 3) === '...';
        if (_varArgs) {
          _types = _types.substr(3);
        }
        if (_types === '') {
          this.types = ['any'];
        }
        else {
          this.types = _types.split('|');
          for (var i = 0; i < this.types.length; i++) {
            this.types[i] = this.types[i].trim();
          }
        }
      }
      else if (Array.isArray(types)) {
        this.types = types;
      }
      else if (types instanceof Param) {
        return types.clone();
      }
      else {
        throw new Error('String or Array expected');
      }

      // can hold a type to which to convert when handling this parameter
      this.conversions = [];
      // TODO: implement better API for conversions, be able to add conversions via constructor (support a new type Object?)

      // variable arguments
      this.varArgs = _varArgs || varArgs || false;

      // check for any type arguments
      this.anyType = this.types.indexOf('any') !== -1;
    }

    /**
     * Order Params
     * any type ('any') will be ordered last, and object as second last (as other
     * types may be an object as well, like Array).
     *
     * @param {Param} a
     * @param {Param} b
     * @returns {number} Returns 1 if a > b, -1 if a < b, and else 0.
     */
    Param.compare = function (a, b) {
      // TODO: simplify parameter comparison, it's a mess
      if (a.anyType) return 1;
      if (b.anyType) return -1;

      if (contains(a.types, 'Object')) return 1;
      if (contains(b.types, 'Object')) return -1;

      if (a.hasConversions()) {
        if (b.hasConversions()) {
          var i, ac, bc;

          for (i = 0; i < a.conversions.length; i++) {
            if (a.conversions[i] !== undefined) {
              ac = a.conversions[i];
              break;
            }
          }

          for (i = 0; i < b.conversions.length; i++) {
            if (b.conversions[i] !== undefined) {
              bc = b.conversions[i];
              break;
            }
          }

          return typed.conversions.indexOf(ac) - typed.conversions.indexOf(bc);
        }
        else {
          return 1;
        }
      }
      else {
        if (b.hasConversions()) {
          return -1;
        }
        else {
          // both params have no conversions
          var ai, bi;

          for (i = 0; i < typed.types.length; i++) {
            if (typed.types[i].name === a.types[0]) {
              ai = i;
              break;
            }
          }

          for (i = 0; i < typed.types.length; i++) {
            if (typed.types[i].name === b.types[0]) {
              bi = i;
              break;
            }
          }

          return ai - bi;
        }
      }
    };

    /**
     * Test whether this parameters types overlap an other parameters types.
     * Will not match ['any'] with ['number']
     * @param {Param} other
     * @return {boolean} Returns true when there are overlapping types
     */
    Param.prototype.overlapping = function (other) {
      for (var i = 0; i < this.types.length; i++) {
        if (contains(other.types, this.types[i])) {
          return true;
        }
      }
      return false;
    };

    /**
     * Test whether this parameters types matches an other parameters types.
     * When any of the two parameters contains `any`, true is returned
     * @param {Param} other
     * @return {boolean} Returns true when there are matching types
     */
    Param.prototype.matches = function (other) {
      return this.anyType || other.anyType || this.overlapping(other);
    };

    /**
     * Create a clone of this param
     * @returns {Param} Returns a cloned version of this param
     */
    Param.prototype.clone = function () {
      var param = new Param(this.types.slice(), this.varArgs);
      param.conversions = this.conversions.slice();
      return param;
    };

    /**
     * Test whether this parameter contains conversions
     * @returns {boolean} Returns true if the parameter contains one or
     *                    multiple conversions.
     */
    Param.prototype.hasConversions = function () {
      return this.conversions.length > 0;
    };

    /**
     * Tests whether this parameters contains any of the provided types
     * @param {Object} types  A Map with types, like {'number': true}
     * @returns {boolean}     Returns true when the parameter contains any
     *                        of the provided types
     */
    Param.prototype.contains = function (types) {
      for (var i = 0; i < this.types.length; i++) {
        if (types[this.types[i]]) {
          return true;
        }
      }
      return false;
    };

    /**
     * Return a string representation of this params types, like 'string' or
     * 'number | boolean' or '...number'
     * @param {boolean} [toConversion]   If true, the returned types string
     *                                   contains the types where the parameter
     *                                   will convert to. If false (default)
     *                                   the "from" types are returned
     * @returns {string}
     */
    Param.prototype.toString = function (toConversion) {
      var types = [];
      var keys = {};

      for (var i = 0; i < this.types.length; i++) {
        var conversion = this.conversions[i];
        var type = toConversion && conversion ? conversion.to : this.types[i];
        if (!(type in keys)) {
          keys[type] = true;
          types.push(type);
        }
      }

      return (this.varArgs ? '...' : '') + types.join('|');
    };

    /**
     * A function signature
     * @param {string | string[] | Param[]} params
     *                         Array with the type(s) of each parameter,
     *                         or a comma separated string with types
     * @param {Function} fn    The actual function
     * @constructor
     */
    function Signature(params, fn) {
      var _params;
      if (typeof params === 'string') {
        _params = (params !== '') ? params.split(',') : [];
      }
      else if (Array.isArray(params)) {
        _params = params;
      }
      else {
        throw new Error('string or Array expected');
      }

      this.params = new Array(_params.length);
      this.anyType = false;
      this.varArgs = false;
      for (var i = 0; i < _params.length; i++) {
        var param = new Param(_params[i]);
        this.params[i] = param;
        if (param.anyType) {
          this.anyType = true;
        }
        if (i === _params.length - 1) {
          // the last argument
          this.varArgs = param.varArgs;
        }
        else {
          // non-last argument
          if (param.varArgs) {
            throw new SyntaxError('Unexpected variable arguments operator "..."');
          }
        }
      }

      this.fn = fn;
    }

    /**
     * Create a clone of this signature
     * @returns {Signature} Returns a cloned version of this signature
     */
    Signature.prototype.clone = function () {
      return new Signature(this.params.slice(), this.fn);
    };

    /**
     * Expand a signature: split params with union types in separate signatures
     * For example split a Signature "string | number" into two signatures.
     * @return {Signature[]} Returns an array with signatures (at least one)
     */
    Signature.prototype.expand = function () {
      var signatures = [];

      function recurse(signature, path) {
        if (path.length < signature.params.length) {
          var i, newParam, conversion;

          var param = signature.params[path.length];
          if (param.varArgs) {
            // a variable argument. do not split the types in the parameter
            newParam = param.clone();

            // add conversions to the parameter
            // recurse for all conversions
            for (i = 0; i < typed.conversions.length; i++) {
              conversion = typed.conversions[i];
              if (!contains(param.types, conversion.from) && contains(param.types, conversion.to)) {
                var j = newParam.types.length;
                newParam.types[j] = conversion.from;
                newParam.conversions[j] = conversion;
              }
            }

            recurse(signature, path.concat(newParam));
          }
          else {
            // split each type in the parameter
            for (i = 0; i < param.types.length; i++) {
              recurse(signature, path.concat(new Param(param.types[i])));
            }

            // recurse for all conversions
            for (i = 0; i < typed.conversions.length; i++) {
              conversion = typed.conversions[i];
              if (!contains(param.types, conversion.from) && contains(param.types, conversion.to)) {
                newParam = new Param(conversion.from);
                newParam.conversions[0] = conversion;
                recurse(signature, path.concat(newParam));
              }
            }
          }
        }
        else {
          signatures.push(new Signature(path, signature.fn));
        }
      }

      recurse(this, []);

      return signatures;
    };

    /**
     * Compare two signatures.
     *
     * When two params are equal and contain conversions, they will be sorted
     * by lowest index of the first conversions.
     *
     * @param {Signature} a
     * @param {Signature} b
     * @returns {number} Returns 1 if a > b, -1 if a < b, and else 0.
     */
    Signature.compare = function (a, b) {
      if (a.params.length > b.params.length) return 1;
      if (a.params.length < b.params.length) return -1;

      // count the number of conversions
      var i;
      var len = a.params.length; // a and b have equal amount of params
      var ac = 0;
      var bc = 0;
      for (i = 0; i < len; i++) {
        if (a.params[i].hasConversions()) ac++;
        if (b.params[i].hasConversions()) bc++;
      }

      if (ac > bc) return 1;
      if (ac < bc) return -1;

      // compare the order per parameter
      for (i = 0; i < a.params.length; i++) {
        var cmp = Param.compare(a.params[i], b.params[i]);
        if (cmp !== 0) {
          return cmp;
        }
      }

      return 0;
    };

    /**
     * Test whether any of the signatures parameters has conversions
     * @return {boolean} Returns true when any of the parameters contains
     *                   conversions.
     */
    Signature.prototype.hasConversions = function () {
      for (var i = 0; i < this.params.length; i++) {
        if (this.params[i].hasConversions()) {
          return true;
        }
      }
      return false;
    };

    /**
     * Test whether this signature should be ignored.
     * Checks whether any of the parameters contains a type listed in
     * typed.ignore
     * @return {boolean} Returns true when the signature should be ignored
     */
    Signature.prototype.ignore = function () {
      // create a map with ignored types
      var types = {};
      for (var i = 0; i < typed.ignore.length; i++) {
        types[typed.ignore[i]] = true;
      }

      // test whether any of the parameters contains this type
      for (i = 0; i < this.params.length; i++) {
        if (this.params[i].contains(types)) {
          return true;
        }
      }

      return false;
    };

    /**
     * Test whether the path of this signature matches a given path.
     * @param {Param[]} params
     */
    Signature.prototype.paramsStartWith = function (params) {
      if (params.length === 0) {
        return true;
      }

      var aLast = last(this.params);
      var bLast = last(params);

      for (var i = 0; i < params.length; i++) {
        var a = this.params[i] || (aLast.varArgs ? aLast: null);
        var b = params[i]      || (bLast.varArgs ? bLast: null);

        if (!a ||  !b || !a.matches(b)) {
          return false;
        }
      }

      return true;
    };

    /**
     * Generate the code to invoke this signature
     * @param {Refs} refs
     * @param {string} prefix
     * @returns {string} Returns code
     */
    Signature.prototype.toCode = function (refs, prefix) {
      var code = [];

      var args = new Array(this.params.length);
      for (var i = 0; i < this.params.length; i++) {
        var param = this.params[i];
        var conversion = param.conversions[0];
        if (param.varArgs) {
          args[i] = 'varArgs';
        }
        else if (conversion) {
          args[i] = refs.add(conversion.convert, 'convert') + '(arg' + i + ')';
        }
        else {
          args[i] = 'arg' + i;
        }
      }

      var ref = this.fn ? refs.add(this.fn, 'signature') : undefined;
      if (ref) {
        return prefix + 'return ' + ref + '(' + args.join(', ') + '); // signature: ' + this.params.join(', ');
      }

      return code.join('\n');
    };

    /**
     * Return a string representation of the signature
     * @returns {string}
     */
    Signature.prototype.toString = function () {
      return this.params.join(', ');
    };

    /**
     * A group of signatures with the same parameter on given index
     * @param {Param[]} path
     * @param {Signature} [signature]
     * @param {Node[]} childs
     * @param {boolean} [fallThrough=false]
     * @constructor
     */
    function Node(path, signature, childs, fallThrough) {
      this.path = path || [];
      this.param = path[path.length - 1] || null;
      this.signature = signature || null;
      this.childs = childs || [];
      this.fallThrough = fallThrough || false;
    }

    /**
     * Generate code for this group of signatures
     * @param {Refs} refs
     * @param {string} prefix
     * @returns {string} Returns the code as string
     */
    Node.prototype.toCode = function (refs, prefix) {
      // TODO: split this function in multiple functions, it's too large
      var code = [];

      if (this.param) {
        var index = this.path.length - 1;
        var conversion = this.param.conversions[0];
        var comment = '// type: ' + (conversion ?
                (conversion.from + ' (convert to ' + conversion.to + ')') :
                this.param);

        // non-root node (path is non-empty)
        if (this.param.varArgs) {
          if (this.param.anyType) {
            // variable arguments with any type
            code.push(prefix + 'if (arguments.length > ' + index + ') {');
            code.push(prefix + '  var varArgs = [];');
            code.push(prefix + '  for (var i = ' + index + '; i < arguments.length; i++) {');
            code.push(prefix + '    varArgs.push(arguments[i]);');
            code.push(prefix + '  }');
            code.push(this.signature.toCode(refs, prefix + '  '));
            code.push(prefix + '}');
          }
          else {
            // variable arguments with a fixed type
            var getTests = function (types, arg) {
              var tests = [];
              for (var i = 0; i < types.length; i++) {
                tests[i] = refs.add(getTypeTest(types[i]), 'test') + '(' + arg + ')';
              }
              return tests.join(' || ');
            }.bind(this);

            var allTypes = this.param.types;
            var exactTypes = [];
            for (var i = 0; i < allTypes.length; i++) {
              if (this.param.conversions[i] === undefined) {
                exactTypes.push(allTypes[i]);
              }
            }

            code.push(prefix + 'if (' + getTests(allTypes, 'arg' + index) + ') { ' + comment);
            code.push(prefix + '  var varArgs = [arg' + index + '];');
            code.push(prefix + '  for (var i = ' + (index + 1) + '; i < arguments.length; i++) {');
            code.push(prefix + '    if (' + getTests(exactTypes, 'arguments[i]') + ') {');
            code.push(prefix + '      varArgs.push(arguments[i]);');

            for (var i = 0; i < allTypes.length; i++) {
              var conversion_i = this.param.conversions[i];
              if (conversion_i) {
                var test = refs.add(getTypeTest(allTypes[i]), 'test');
                var convert = refs.add(conversion_i.convert, 'convert');
                code.push(prefix + '    }');
                code.push(prefix + '    else if (' + test + '(arguments[i])) {');
                code.push(prefix + '      varArgs.push(' + convert + '(arguments[i]));');
              }
            }
            code.push(prefix + '    } else {');
            code.push(prefix + '      throw createError(name, arguments.length, i, arguments[i], \'' + exactTypes.join(',') + '\');');
            code.push(prefix + '    }');
            code.push(prefix + '  }');
            code.push(this.signature.toCode(refs, prefix + '  '));
            code.push(prefix + '}');
          }
        }
        else {
          if (this.param.anyType) {
            // any type
            code.push(prefix + '// type: any');
            code.push(this._innerCode(refs, prefix));
          }
          else {
            // regular type
            var type = this.param.types[0];
            var test = type !== 'any' ? refs.add(getTypeTest(type), 'test') : null;

            code.push(prefix + 'if (' + test + '(arg' + index + ')) { ' + comment);
            code.push(this._innerCode(refs, prefix + '  '));
            code.push(prefix + '}');
          }
        }
      }
      else {
        // root node (path is empty)
        code.push(this._innerCode(refs, prefix));
      }

      return code.join('\n');
    };

    /**
     * Generate inner code for this group of signatures.
     * This is a helper function of Node.prototype.toCode
     * @param {Refs} refs
     * @param {string} prefix
     * @returns {string} Returns the inner code as string
     * @private
     */
    Node.prototype._innerCode = function (refs, prefix) {
      var code = [];
      var i;

      if (this.signature) {
        code.push(prefix + 'if (arguments.length === ' + this.path.length + ') {');
        code.push(this.signature.toCode(refs, prefix + '  '));
        code.push(prefix + '}');
      }

      for (i = 0; i < this.childs.length; i++) {
        code.push(this.childs[i].toCode(refs, prefix));
      }

      // TODO: shouldn't the this.param.anyType check be redundant
      if (!this.fallThrough || (this.param && this.param.anyType)) {
        var exceptions = this._exceptions(refs, prefix);
        if (exceptions) {
          code.push(exceptions);
        }
      }

      return code.join('\n');
    };


    /**
     * Generate code to throw exceptions
     * @param {Refs} refs
     * @param {string} prefix
     * @returns {string} Returns the inner code as string
     * @private
     */
    Node.prototype._exceptions = function (refs, prefix) {
      var index = this.path.length;

      if (this.childs.length === 0) {
        // TODO: can this condition be simplified? (we have a fall-through here)
        return [
          prefix + 'if (arguments.length > ' + index + ') {',
          prefix + '  throw createError(name, arguments.length, ' + index + ', arguments[' + index + ']);',
          prefix + '}'
        ].join('\n');
      }
      else {
        var keys = {};
        var types = [];

        for (var i = 0; i < this.childs.length; i++) {
          var node = this.childs[i];
          if (node.param) {
            for (var j = 0; j < node.param.types.length; j++) {
              var type = node.param.types[j];
              if (!(type in keys) && !node.param.conversions[j]) {
                keys[type] = true;
                types.push(type);
              }
            }
          }
        }

        return prefix + 'throw createError(name, arguments.length, ' + index + ', arguments[' + index + '], \'' + types.join(',') + '\');';
      }
    };

    /**
     * Split all raw signatures into an array with expanded Signatures
     * @param {Object.<string, Function>} rawSignatures
     * @return {Signature[]} Returns an array with expanded signatures
     */
    function parseSignatures(rawSignatures) {
      // FIXME: need to have deterministic ordering of signatures, do not create via object
      var signature;
      var keys = {};
      var signatures = [];
      var i;

      for (var types in rawSignatures) {
        if (rawSignatures.hasOwnProperty(types)) {
          var fn = rawSignatures[types];
          signature = new Signature(types, fn);

          if (signature.ignore()) {
            continue;
          }

          var expanded = signature.expand();

          for (i = 0; i < expanded.length; i++) {
            var signature_i = expanded[i];
            var key = signature_i.toString();
            var existing = keys[key];
            if (!existing) {
              keys[key] = signature_i;
            }
            else {
              var cmp = Signature.compare(signature_i, existing);
              if (cmp < 0) {
                // override if sorted first
                keys[key] = signature_i;
              }
              else if (cmp === 0) {
                throw new Error('Signature "' + key + '" is defined twice');
              }
              // else: just ignore
            }
          }
        }
      }

      // convert from map to array
      for (key in keys) {
        if (keys.hasOwnProperty(key)) {
          signatures.push(keys[key]);
        }
      }

      // order the signatures
      signatures.sort(function (a, b) {
        return Signature.compare(a, b);
      });

      // filter redundant conversions from signatures with varArgs
      // TODO: simplify this loop or move it to a separate function
      for (i = 0; i < signatures.length; i++) {
        signature = signatures[i];

        if (signature.varArgs) {
          var index = signature.params.length - 1;
          var param = signature.params[index];

          var t = 0;
          while (t < param.types.length) {
            if (param.conversions[t]) {
              var type = param.types[t];

              for (var j = 0; j < signatures.length; j++) {
                var other = signatures[j];
                var p = other.params[index];

                if (other !== signature &&
                    p &&
                    contains(p.types, type) && !p.conversions[index]) {
                  // this (conversion) type already exists, remove it
                  param.types.splice(t, 1);
                  param.conversions.splice(t, 1);
                  t--;
                  break;
                }
              }
            }
            t++;
          }
        }
      }

      return signatures;
    }

    /**
     * Filter all any type signatures
     * @param {Signature[]} signatures
     * @return {Signature[]} Returns only any type signatures
     */
    function filterAnyTypeSignatures (signatures) {
      var filtered = [];

      for (var i = 0; i < signatures.length; i++) {
        if (signatures[i].anyType) {
          filtered.push(signatures[i]);
        }
      }

      return filtered;
    }

    /**
     * create a map with normalized signatures as key and the function as value
     * @param {Signature[]} signatures   An array with split signatures
     * @return {Object.<string, Function>} Returns a map with normalized
     *                                     signatures as key, and the function
     *                                     as value.
     */
    function mapSignatures(signatures) {
      var normalized = {};

      for (var i = 0; i < signatures.length; i++) {
        var signature = signatures[i];
        if (signature.fn && !signature.hasConversions()) {
          var params = signature.params.join(',');
          normalized[params] = signature.fn;
        }
      }

      return normalized;
    }

    /**
     * Parse signatures recursively in a node tree.
     * @param {Signature[]} signatures  Array with expanded signatures
     * @param {Param[]} path            Traversed path of parameter types
     * @param {Signature[]} anys
     * @return {Node}                   Returns a node tree
     */
    function parseTree(signatures, path, anys) {
      var i, signature;
      var index = path.length;
      var nodeSignature;

      var filtered = [];
      for (i = 0; i < signatures.length; i++) {
        signature = signatures[i];

        // filter the first signature with the correct number of params
        if (signature.params.length === index && !nodeSignature) {
          nodeSignature = signature;
        }

        if (signature.params[index] != undefined) {
          filtered.push(signature);
        }
      }

      // sort the filtered signatures by param
      filtered.sort(function (a, b) {
        return Param.compare(a.params[index], b.params[index]);
      });

      // recurse over the signatures
      var entries = [];
      for (i = 0; i < filtered.length; i++) {
        signature = filtered[i];
        // group signatures with the same param at current index
        var param = signature.params[index];

        // TODO: replace the next filter loop
        var existing = entries.filter(function (entry) {
          return entry.param.overlapping(param);
        })[0];

        //var existing;
        //for (var j = 0; j < entries.length; j++) {
        //  if (entries[j].param.overlapping(param)) {
        //    existing = entries[j];
        //    break;
        //  }
        //}

        if (existing) {
          if (existing.param.varArgs) {
            throw new Error('Conflicting types "' + existing.param + '" and "' + param + '"');
          }
          existing.signatures.push(signature);
        }
        else {
          entries.push({
            param: param,
            signatures: [signature]
          });
        }
      }

      // find all any type signature that can still match our current path
      var matchingAnys = [];
      for (i = 0; i < anys.length; i++) {
        if (anys[i].paramsStartWith(path)) {
          matchingAnys.push(anys[i]);
        }
      }

      // see if there are any type signatures that don't match any of the
      // signatures that we have in our tree, i.e. we have alternative
      // matching signature(s) outside of our current tree and we should
      // fall through to them instead of throwing an exception
      var fallThrough = false;
      for (i = 0; i < matchingAnys.length; i++) {
        if (!contains(signatures, matchingAnys[i])) {
          fallThrough = true;
          break;
        }
      }

      // parse the childs
      var childs = new Array(entries.length);
      for (i = 0; i < entries.length; i++) {
        var entry = entries[i];
        childs[i] = parseTree(entry.signatures, path.concat(entry.param), matchingAnys)
      }

      return new Node(path, nodeSignature, childs, fallThrough);
    }

    /**
     * Generate an array like ['arg0', 'arg1', 'arg2']
     * @param {number} count Number of arguments to generate
     * @returns {Array} Returns an array with argument names
     */
    function getArgs(count) {
      // create an array with all argument names
      var args = [];
      for (var i = 0; i < count; i++) {
        args[i] = 'arg' + i;
      }

      return args;
    }

    /**
     * Compose a function from sub-functions each handling a single type signature.
     * Signatures:
     *   typed(signature: string, fn: function)
     *   typed(name: string, signature: string, fn: function)
     *   typed(signatures: Object.<string, function>)
     *   typed(name: string, signatures: Object.<string, function>)
     *
     * @param {string | null} name
     * @param {Object.<string, Function>} signatures
     * @return {Function} Returns the typed function
     * @private
     */
    function _typed(name, signatures) {
      var refs = new Refs();

      // parse signatures, expand them
      var _signatures = parseSignatures(signatures);
      if (_signatures.length == 0) {
        throw new Error('No signatures provided');
      }

      // filter all any type signatures
      var anys = filterAnyTypeSignatures(_signatures);

      // parse signatures into a node tree
      var node = parseTree(_signatures, [], anys);

      //var util = require('util');
      //console.log('ROOT');
      //console.log(util.inspect(node, { depth: null }));

      // generate code for the typed function
      var code = [];
      var _name = name || '';
      var _args = getArgs(maxParams(_signatures));
      code.push('function ' + _name + '(' + _args.join(', ') + ') {');
      code.push('  "use strict";');
      code.push('  var name = \'' + _name + '\';');
      code.push(node.toCode(refs, '  ', false));
      code.push('}');

      // generate body for the factory function
      var body = [
        refs.toCode(),
        'return ' + code.join('\n')
      ].join('\n');

      // evaluate the JavaScript code and attach function references
      var factory = (new Function(refs.name, 'createError', body));
      var fn = factory(refs, createError);

      //console.log('FN\n' + fn.toString()); // TODO: cleanup

      // attach the signatures with sub-functions to the constructed function
      fn.signatures = mapSignatures(_signatures);

      return fn;
    }

    /**
     * Calculate the maximum number of parameters in givens signatures
     * @param {Signature[]} signatures
     * @returns {number} The maximum number of parameters
     */
    function maxParams(signatures) {
      var max = 0;

      for (var i = 0; i < signatures.length; i++) {
        var len = signatures[i].params.length;
        if (len > max) {
          max = len;
        }
      }

      return max;
    }

    /**
     * Get the type of a value
     * @param {*} x
     * @returns {string} Returns a string with the type of value
     */
    function getTypeOf(x) {
      var obj;

      for (var i = 0; i < typed.types.length; i++) {
        var entry = typed.types[i];

        if (entry.name === 'Object') {
          // Array and Date are also Object, so test for Object afterwards
          obj = entry;
        }
        else {
          if (entry.test(x)) return entry.name;
        }
      }

      // at last, test whether an object
      if (obj && obj.test(x)) return obj.name;

      return 'unknown';
    }

    /**
     * Test whether an array contains some item
     * @param {Array} array
     * @param {*} item
     * @return {boolean} Returns true if array contains item, false if not.
     */
    function contains(array, item) {
      return array.indexOf(item) !== -1;
    }

    /**
     * Returns the last item in the array
     * @param {Array} array
     * @return {*} item
     */
    function last (array) {
      return array[array.length - 1];
    }

    // data type tests
    var types = [
      { name: 'number',    test: function (x) { return typeof x === 'number' } },
      { name: 'string',    test: function (x) { return typeof x === 'string' } },
      { name: 'boolean',   test: function (x) { return typeof x === 'boolean' } },
      { name: 'Function',  test: function (x) { return typeof x === 'function'} },
      { name: 'Array',     test: Array.isArray },
      { name: 'Date',      test: function (x) { return x instanceof Date } },
      { name: 'RegExp',    test: function (x) { return x instanceof RegExp } },
      { name: 'Object',    test: function (x) { return typeof x === 'object' } },
      { name: 'null',      test: function (x) { return x === null } },
      { name: 'undefined', test: function (x) { return x === undefined } }
    ];

    // configuration
    var config = {};

    // type conversions. Order is important
    var conversions = [];

    // types to be ignored
    var ignore = [];

    // temporary object for holding types and conversions, for constructing
    // the `typed` function itself
    // TODO: find a more elegant solution for this
    var typed = {
      config: config,
      types: types,
      conversions: conversions,
      ignore: ignore
    };

    /**
     * Construct the typed function itself with various signatures
     *
     * Signatures:
     *
     *   typed(signatures: Object.<string, function>)
     *   typed(name: string, signatures: Object.<string, function>)
     */
    typed = _typed('typed', {
      'Object': function (signatures) {
        var fns = [];
        for (var signature in signatures) {
          if (signatures.hasOwnProperty(signature)) {
            fns.push(signatures[signature]);
          }
        }
        var name = getName(fns);

        return _typed(name, signatures);
      },
      'string, Object': _typed,
      // TODO: add a signature 'Array.<function>'
      '...Function': function (fns) {
        var err;
        var name = getName(fns);
        var signatures = {};

        for (var i = 0; i < fns.length; i++) {
          var fn = fns[i];

          // test whether this is a typed-function
          if (!(typeof fn.signatures === 'object')) {
            err = new TypeError('Function is no typed-function (index: ' + i + ')');
            err.data = {index: i};
            throw err;
          }

          // merge the signatures
          for (var signature in fn.signatures) {
            if (fn.signatures.hasOwnProperty(signature)) {
              if (signatures.hasOwnProperty(signature)) {
                if (fn.signatures[signature] !== signatures[signature]) {
                  err = new Error('Signature "' + signature + '" is defined twice');
                  err.data = {signature: signature};
                  throw err;
                }
                // else: both signatures point to the same function, that's fine
              }
              else {
                signatures[signature] = fn.signatures[signature];
              }
            }
          }
        }

        return _typed(name, signatures);
      }
    });

    /**
     * Find a specific signature from a (composed) typed function, for
     * example:
     *
     *   typed.find(fn, ['number', 'string'])
     *   typed.find(fn, 'number, string')
     *
     * Function find only only works for exact matches.
     *
     * @param {Function} fn                   A typed-function
     * @param {string | string[]} signature   Signature to be found, can be
     *                                        an array or a comma separated string.
     * @return {Function}                     Returns the matching signature, or
     *                                        throws an errror when no signature
     *                                        is found.
     */
    function find (fn, signature) {
      if (!fn.signatures) {
        throw new TypeError('Function is no typed-function');
      }

      // normalize input
      var arr;
      if (typeof signature === 'string') {
        arr = signature.split(',');
        for (var i = 0; i < arr.length; i++) {
          arr[i] = arr[i].trim();
        }
      }
      else if (Array.isArray(signature)) {
        arr = signature;
      }
      else {
        throw new TypeError('String array or a comma separated string expected');
      }

      var str = arr.join(',');

      // find an exact match
      var match = fn.signatures[str];
      if (match) {
        return match;
      }

      // TODO: extend find to match non-exact signatures

      throw new TypeError('Signature not found (signature: ' + (fn.name || 'unnamed') + '(' + arr.join(', ') + '))');
    }

    /**
     * Convert a given value to another data type.
     * @param {*} value
     * @param {string} type
     */
    function convert (value, type) {
      var from = getTypeOf(value);

      // check conversion is needed
      if (type === from) {
        return value;
      }

      for (var i = 0; i < typed.conversions.length; i++) {
        var conversion = typed.conversions[i];
        if (conversion.from === from && conversion.to === type) {
          return conversion.convert(value);
        }
      }

      throw new Error('Cannot convert from ' + from + ' to ' + type);
    }

    // attach types and conversions to the final `typed` function
    typed.config = config;
    typed.types = types;
    typed.conversions = conversions;
    typed.ignore = ignore;
    typed.create = create;
    typed.find = find;
    typed.convert = convert;

    // add a type
    typed.addType = function (type) {
      if (!type || typeof type.name !== 'string' || typeof type.test !== 'function') {
        throw new TypeError('Object with properties {name: string, test: function} expected');
      }

      typed.types.push(type);
    };

    // add a conversion
    typed.addConversion = function (conversion) {
      if (!conversion
          || typeof conversion.from !== 'string'
          || typeof conversion.to !== 'string'
          || typeof conversion.convert !== 'function') {
        throw new TypeError('Object with properties {from: string, to: string, convert: function} expected');
      }

      typed.conversions.push(conversion);
    };

    return typed;
  }

  return create();
}));

},{}]},{},[6])