describe('javascriptPlugin', function()
{
	it('javascript simple', function()
	{
		var candombe = require('../src/index');

		var file1 = {
			path: 'file1.js'
		,	content: 
				'//@module foo @class Animal @class Dog ' + '\n' +
				'//a dog is the best humans friend' + '\n' +
				'//@extends Animal' + '\n' +
				'/*because it has no annotations this block comment should be ignored*/' + '\n' +

				''
		}

		candombe.setParentshipConfig({
			'extends': ['class']
		,	'class': ['module']
		})
		var ast = {};
		candombe.parseFile(ast, file1); 

		expect(ast.files['file1.js'].annotations[0].name).toBe('module')
		expect(ast.files['file1.js'].annotations.length).toBe(1)
		expect(ast.files['file1.js'].annotations[0].children.length).toBe(2)
		expect(ast.files['file1.js'].annotations[0].children[0].name).toBe('class')
		expect(ast.files['file1.js'].annotations[0].children[0].text).toContain('Animal')

		expect(ast.files['file1.js'].annotations[0].children[1].name).toBe('class')
		expect(ast.files['file1.js'].annotations[0].children[1].text).toContain('Dog')
		
		expect(ast.files['file1.js'].annotations[0].children[0].children).not.toBeDefined()
		expect(ast.files['file1.js'].annotations[0].children[1].children.length).toBe(1)
		expect(ast.files['file1.js'].annotations[0].children[1].children[0].name).toBe('extends')
		expect(ast.files['file1.js'].annotations[0].children[1].children[0].text).toContain('Animal')

	})
})