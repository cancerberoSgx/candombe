var tool = require('../../core/parser')
,	_ = require('underscore')
,	path = require('path')
,	esprima = require('esprima');

var plugin = {

	execute: function(file)
	{		
		if(path.extname(file.name) !== '.js')
		{
			return file;
		}
		var ast;
		try 
		{
			var esprimaConfig = {
				raw: true
			,	range: true
			,	comment: true		
			}; 
			ast = esprima.parse(file.content, esprimaConfig); 
			this.normalizeComments(file, ast); 
			file.content = this.dumpComments(ast); 
		}  
		catch(ex)
		{
			console.log('Error parsing JavaScript, file: ', file.name + ', error: ', ex); 
			console.log(ex.stack)
			return file;
		}
		return file;
	}

	//@method _stringFullTrim @param {String} s @static
,	_stringFullTrim: function(s)
	{
		return (s||'').replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' ');
	}

,	dumpComments: function(ast)
	{
		var a = [];
		_(ast.comments).each(function(c)
		{
			a.push(c.value); 
		})
		return a.join('\n')
	}
,	normalizeComments: function(file, ast)
	{
		var i = 0
		,	comments = ast.comments
		;
	
		var lineCommentSeparator = '\n';

		while(i < comments.length - 1)
		{
			var c = comments[i]
			,	next = comments[i+1]; 

			if(c.type==='Block')
			{
				//just remove block comments that don't contain annotations from the ast
				if(!this.annotationRegexp.test(c.value.test()))
				{
					console.log('block comment dont contain any annotation removing it: '+c.value); 
				}
				i++;
			}
			else
			{
				//resolve the problem of consecutive line comments unification
				var somethingInBetween = this._stringFullTrim(file.content.substring(c.range[1], next.range[0])); 
				if (next.type==='Line' && !somethingInBetween)
				{
					c.value += ' ' + lineCommentSeparator + ' ' + next.value; 
					c.range[1] = next.range[1]; 
					comments.splice(i+1, 1); 
				}
				else
				{
					i++;
				}
			}			
		}
	}

}; 

tool.fileContentPlugins.add(plugin);