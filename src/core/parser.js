var _ = require('underscore')
,	PluginContainer = require('./plugin-container');

// @module candombe @class tool

var tool = require('./tool');
_(tool).extend({

	// @property {PluginContainer} fileContentPlugins plugins registered here have the responsibility of extracting the annotation text from a
	// certain type of file. For example, one plugin could be responsible of extracting comments from javascript files, other the text from excel files, etc.
	fileContentPlugins: new PluginContainer()

	// @method parseFile Public parsing main method that must be called for each file you want to parse. In the first call juist pass an empty
	// object as the ast and it will be poblated. Note: This public signature tries to uncouple from fs, i.e. be able to do it also using memory buffers.
,	parseFile: function(ast, filePath_, fileContent_)
	{
		ast.files = ast.files || {}; 
		var filePath, fileContent; 
		if(arguments.length===2 && _(filePath_).isObject())
		{
			filePath = filePath_.path;
			fileContent = filePath_.content;
		}
		else
		{
			filePath = filePath_;
			fileContent = fileContent_;			
		}

		// console.log(filePath, fileContent)
		var fileNode = ast.files[filePath] = ast.files[filePath] || {}
		,	fileDesc = {
				name: filePath
				, content: fileContent
		}; 

		fileDesc = this.fileContentPlugins.execute(fileDesc); 

		var annotations = this.parseAnnotations(ast, fileDesc); 

		fileNode.annotations = annotations; 
		//TODO: consider the case when the annotation already exists ? 
		// _(annotations).each(function(name, a)		{			// file[name]		})
	}

	//@property {Regexp} annotationRegexp
,	annotationRegexp: /@([^@\s]+)\s+([^@]+)/gmi

	//@method parseAnnotations @param {Object} ast @param file
,	parseAnnotations: function(ast, file)
	{
		//TODO: define a pluigin container for this stage : parseAnnotationPlugins
		// what it is now is a first default test implementation
		//default annotation regex
		var content = file.content
		,	result
		,	output = [];
		do 
		{
			result = this.annotationRegexp.exec(content); 
			if(result)
			{
				var node = {name: result[1], text: result[2]}; 
				output.push(node); 
			}
		}
		while(result);

		return output; 
	}
}); 

module.exports = tool; 
