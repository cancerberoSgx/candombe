var tool = require('../core/parser')
,	_ = require('underscore')
,	path = require('path')


// initial requirements
// candombe.setParentship({
//     'class': 'module'
// ,   'version': ['module', 'class'] 
// }); 
// var files = parser.readFiles('/home/sg/project1/**')
// var aast = parser.parse(files);


// notes about implementation: 
// we iterate each annotation and if we find a child we move it to the corresponding 
// last$Parent recording. If no last parent is found we throw error. 

var plugin = {

	_counter: 0

,	lastParent: {}

,	execute: function(file, context)
	{
		var candombe = context.instance, i = 0; 
		candombe.parentshipConfig = candombe.parentshipConfig || {}; 

		this._counter = 0;
		while(i < file.annotations.length)
		{
			var ann = file.annotations[i]
			, parents = candombe.parentshipConfig[ann.name]; 
			this.lastParent[ann.name] = {node: ann, _counter: this._counter}; 
			this._counter++;
			if(parents)
			{
				var parent = this.getLastParentOf(ann, parents); 
				// console.log(ann, parents, parent)
				if(parent)
				{
					parent.node.children = parent.node.children || [];
					// console.log('pushing', ann.name+' to '+parent.node.name) 
					parent.node.children.push(ann); 
					file.annotations.splice(i,1)
				}
				else
				{
					if(parents && parents.length)
					{
						console.log('ERROR, children '+ann.name+' found before any parent in file '+file.path+'. Ignoring it');
					}

					i++; 
				}
			}
			else
			{
				i++; 
			}
		}
		// console.log('this.lastParent', JSON.stringify(this.lastParent,null,2))
		return file;
	}

,	getLastParentOf: function(ann, parents)
	{
		var max = {_counter: -1}
		, self = this; 
		_(parents).each(function(p)
		{
			if(self.lastParent[p])
			{
				if(max._counter<self.lastParent[p]._counter)
				{
					max = self.lastParent[p];
				} 
			}
		}); 
		return max._counter===-1 ? null : max;  
	}

}; 

tool.setParentshipConfig = function(parentshipConfig)
{
	this.parentshipConfig = parentshipConfig; 
}

tool.filePostProcessingPlugins.add(plugin);