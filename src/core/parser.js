var _ = require('underscore');

// @module candombe @class tool

var tool = require('./tool');
_(tool).extend({

	// @method parseFile Public parsing main method that must be called for each file you want to parse. In the first call juist pass an empty
	// object as the ast and it will be poblated. Note: This public signature tries to deacoplate from fs, i.e. be able to do it also using memory buffers.
	parseFile: function(ast, filePath, fileContent)
	{
		var annotations = this.parseAnnotations(fileContent); 
		ast.files = ast.files || {}; 
		var file = ast.files[filePath] = ast.files[filePath] || {}; 
		//TODO: consider the case when the annotation already exists ? 
		_(annotations).each(function(name, a)
		{
			file[name]
		})
	}

,	parseAnnotations: function(content)
	{
		//
		regexp = /\s*@(\w+)\s*(\{[\w<>\|, #:\(\)\.]+\}){0,1}\s*([\w\._\$]+){0,1}([.\s\w\W]*)/gmi;
		return [{name:'foo',text:'sometext1'},{name:'foo2',text:'sometext2'},{name:'foo3',text:'sometext3'}];
	}
}); 

module.exports = tool; 
