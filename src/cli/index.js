var glob = require('glob').sync
,	args = require('yargs').argv
,	fs = require('fs')
,	_ = require('underscore');

// @module candombe @class tool

var tool = require('../index'); 
_(tool).extend({

	// @method mainCmd
	mainCmd: function()
	{
		this.checkUsage(); 
		var config = {input: args.input, output: args.output};
		var output = JSON.stringify(this.main(config), null, 2);
		if(args.output)
		{
			//TODO
		}
		else
		{
			console.log(output)
		}
	}

	// @method Public method of node API. Do the job if reading the content from fs/glob. Uses add() internally. 
	// Usage example with file glob: : ```candombe.main({input: './src/js/**/*.js'})```. 
	// Usage example with file array: ```candombe.main({input: ['file1.js', '/home/p/file2.xml','foo/bar.txt']})```
,	main: function(config)
	{
		var self = this
		,	input = config.input, files;
		if(_(input).isString())
		{
			files = glob(input)
		}
		//so now files is an array
		var	ast = {}; 
		_(files).each(function(file)
		{
			var content = fs.readFileSync(file).toString();
			self.parseFile(ast, file, content); 
		}); 
		return ast;
	}

	// @method checkUsage
,	checkUsage: function()
	{
		var error = false;
		if(!args.input)
		{
			error = '--input argument is required'; 
		}
		if(error)
		{
			console.log('Command error, Usage example: \n\tnode index.js --input some/folder/**/*.js'); 
			process.exit(1);
		}
	}
}); 

tool.mainCmd();

module.exports = tool; 
