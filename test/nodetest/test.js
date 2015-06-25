var candombe = require('candombe');
// var candombe = require('../../src/cli/index');
var ast = candombe.main({
	input: '../sampleFolder/**/*.js'
// ,	output: 'output.json'
}); 

console.log(ast)