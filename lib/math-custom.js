var core = require('../node_modules/mathjs/core.js');

var math = core.create();

math.import(require('../node_modules/mathjs/lib/type/number.js'));
math.import(require('../node_modules/mathjs/lib/function/arithmetic'));
math.import(require('../node_modules/mathjs/lib/function/trigonometry'));
math.import(require('../node_modules/mathjs/lib/expression'));

module.exports = math;