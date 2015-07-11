describe('javascriptPlugin', function()
{
	it('javascript simple', function()
	{
		var candombe = require('../src/index');

		var file1 = {
			path: 'file1.js'
		,	content: 
				'//@class Animal @class Dog ' + '\n' +
				'//a dog is the best humans friend' + '\n' +
				'//@extends Animal' + '\n' +
				''
		}

		var ast = {};
		candombe.parseFile(ast, file1); 

		var ann = ast.files['file1.js'].annotations;
		expect(ann[0].name).toBe('class'); 
		expect(ann[0].text).toContain('Animal'); 
		expect(ann[1].name).toBe('class'); 
		expect(ann[1].text).toContain('Dog'); 
		expect(ann[1].text).toContain('a dog is the best humans friend'); 
		expect(ann[2].name).toBe('extends'); 
		expect(ann[2].text).toContain('Animal'); 

	})
})