/// <reference path="Scripts/typings/swagger/swagger.d.ts" />
/// <reference path="typings/tsd.d.ts" />

var fs = require('fs');
var Mustache: MustacheStatic = require('mustache');

var filePath: string = 'swagger/swagger.json';
var modelTemplatePath: string = 'templates/model.mustache';
var swaggerFile: string = fs.readFileSync(filePath, 'UTF-8');
var modelTemplate: string = fs.readFileSync(modelTemplatePath, 'UTF-8');

var swagger: Swagger.Spec = JSON.parse(swaggerFile);
for (var definition in swagger.definitions){
    var modelString: string;
    var modelView: any = {};
    modelView.className = definition;
    modelView.properties = [];

    var description = swagger.definitions[definition];
    for (var property in description.properties) {
        var propertyDesc = description.properties[property];
        var propertyObj: any = {};
        propertyObj.name = property;
        propertyObj.type = propertyDesc.type;
        modelView.properties.push(propertyObj);
    }

    modelString = Mustache.render(modelTemplate, modelView);
    console.log(modelString);
}
console.log("");