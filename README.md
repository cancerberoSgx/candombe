
##Candombe: 

###tool for extracting annotations from files, in a very generic way.


(WIP)

#About

Candombe is a command line tool to extract text patterns from files - we cal these patterns annotations which commonly have the syntax ```@name some text``` . Are commonly used in programming languages to express meta information in comments. 

Candombe is very generic and configurable and comes with plugins for extracting annotations from JavaScript/Java/php/etc source code comments, excel spreadsheets, xml/html, pdf, etc. The annotation pattern is configurable and also the output. 

It's designed ot be *very simple and generic*: extract patterns /annotations from a list files. At this core level, an annotation consists simply in a name and a text. The default extraction implementation is very dumb: the text of each annotation goes from the annotation begginign to the next annotation, almost unusable. 

But then, candombe was also designed to be extendable, BTW the cools things we can do with it are currently implemented as plugins that uses this core and enhances its output/input. For example, annotation extraction from javascript source comments, or xml spreadsheets text is implemented as plugins. Also cool fieatures like annotation parentship.

##History

This project comes after developing short-jsdoc. The annotation parsing and syntax requirements in candombe are mostly based on that 'project conclusions' and the idea for the future is that short-jsdoc is based on this project.


#Usage in the command line

Extract all the annotations and files information to stdout

    node src/cli/main.js --input "./test/sampleFolder/**/*.js

IMPORTANT: remember to use comillas "" for writing globs, if not your shell will perform the unglob (badly)

#Node API

    var candombe = require('candombe');
    // var candombe = require('../../src/cli/index');
    var ast = candombe.main({
        input: '../sampleFolder/**/*.js'
    // ,    output: 'output.json'
    }); 
    console.log(ast) 

#Example

Imagine the file ./src/something.js contains the following code:

    // @module fruits @version 1.0 @class Banana @version 3.1

candombe will extract the following annotations from it. We call this object an annotation AST (AAST) : 

    [
        {name: module, text: 'fruits'}
    ,   {name: version, text: '1.0'}
        {name: class, text: 'Banana'}
    ,   {name: version, text: '3.1'}
    ]

#annotation parentship

candombe can be configured to support annotation hierarchies, this is, some annotations will contain others. Keeping with the example, now we want to express something like "modules containing classes; version can be children of any classes or modules":

    parser.setParentship({
        class: 'module'
    ,   version: ['module', 'class'] 
    }); 

then the output will be:

    [
        {name: module, text: 'fruits', $children: [
            {name: version, text: '1.0'}
        ,   {name: class, text: 'Banana'}
        ]}
    ,   {name: version, text: '1.0'}
        {name: class, text: 'Banana'}
    ,   {name: version, text: '3.1'}
    ]

This feature is needed for example, to implement problems like javadoc/jsdoc in which we need to structure annotations like "modules containing classes that contains methods and properties. And method contain parameters, etc"

#Parentship configuration

    var parser = require('sap');
    parser.setParentship({
        'class': 'module'
    ,   'version': ['module', 'class'] 
    }); 
    var files = parser.readFiles('/home/sg/project1/**')
    var aast = parser.parse(files);

#Usage in the browser

If for any reason you need to use candombe on the browser it is possible thanks to browserify. Just install gulp and execute ```gulp javascript```, this will generate file ```dist/js/candombe.js``` and we can execute the tool in a html file like the following: 

    <html>
    <head>
    <script src="../../dist/js/candombe.js"></script>
    </head>
    <body>
    <script>
    var candombe = require('candombe')
    ,   _ = require('underscore'); 
    var files = [
        {name: 'foo/bar.js', content: '@name1 text text text \n\n\t@name2 kjsdhf kjshfdk'}
    ,   {name: 'pepe/gugu.js', content: '@pepe text text text \n\n\t@gugu kjsdhf kjshfdk'}
    ]; 
    var ast = {}; 
    _(files).each(function(file)
    {
        candombe.parseFile(ast, file.name, file.content); 
    }); 
    console.log(ast)
    </script>
    </body>
    </html>




#Requirements / Roadmap / TODO

 * agnostic to input format (js,xml,txt,html) . i.e js source parsing is a feature implemented in as a feature/plugin.
 * agnostic to output format. The base is files that contains annotations. Other things like parentship are implemented as a feature/plugin.
 * agnostic to custom regexp for matching annotations in files.
 * other output structures
 * annotation parentship is a plugin
 * not limited to .js files. js comment parsing is a plugin
 * re-use short-jsdoc  parsing parts like the comment preprocessing (fixes for detecting line comments blocks, preserving text spaces, etc.). Resuse also from the part of nodejs app.
 * idea: build a the ast syntax output for performance: ast.$module.fruits.$class.Banana.$methods.setColor.$params.color instead of having to call forEach for finding.
 * runs in the browser

inputPlugins, outputPlugin
