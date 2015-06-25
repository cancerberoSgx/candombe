var _ = require('underscore');

// @module candombe @class tool

var tool = require('./tool');
_(tool).extend({

	// @method parseFile Public parsing main method that must be called for each file you want to parse. In the first call juist pass an empty
	// object as the ast and it will be poblated. Note: This public signature tries to deacoplate from fs, i.e. be able to do it also using memory buffers.
	parseFile: function(ast, filePath, fileContent)
	{
		ast.files = ast.files || {}; 
		var file = ast.files[filePath] = ast.files[filePath] || {}; 

		var annotations = this.parseAnnotations(ast, {name: filePath, content: fileContent}); 

		file.annotations = annotations; 
		//TODO: consider the case when the annotation already exists ? 
		// _(annotations).each(function(name, a)		{			// file[name]		})
	}

,	parseAnnotations: function(ast, file)
	{
		//TODO: define a pluigin container for this stage : parseAnnotationPlugins
		// what it is now is a first default test implementation
		//default annotation regex
		var content = file.content
		,	annotationRegexp = /@([^@\s]+)\s+([^@]+)/gmi
		,	result
		,	output = [];
		do 
		{
			result = annotationRegexp.exec(content); 
			if(result)
			{
				var node = {name: result[1], text: result[2]}; 
				output.push(node); 
			}
			// console.log('log1', file.name, content, result); 
		}
		while(result);
		// return [1,2,3];//[{name:'foo',text:'sometext1'},{name:'foo2',text:'sometext2'},{name:'foo3',text:'sometext3'}];
		return output; 
	}
}); 

module.exports = tool; 
