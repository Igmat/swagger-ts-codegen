/// <reference path="Scripts/typings/swagger/swagger.d.ts" />
/// <reference path="typings/tsd.d.ts" />
/// <reference path="modules/modelsRender.ts" />
/// <reference path="modules/modelGenerator.ts" />

var fs = require('fs');
var Mustache: MustacheStatic = require('mustache');

var filePath: string = 'swagger/swagger.json';
var modelTemplatePath: string = 'templates/model.mustache';
var enumTemplatePath: string = 'templates/enum.mustache';
var swaggerFile: string = fs.readFileSync(filePath, 'UTF-8');
var modelTemplate: string = fs.readFileSync(modelTemplatePath, 'UTF-8');
var enumTemplate: string = fs.readFileSync(enumTemplatePath, 'UTF-8');


var swagger: Swagger.Spec = JSON.parse(swaggerFile);

var models = renderModels(swagger, modelTemplate, enumTemplate);
models.forEach((value: string): void => {
    console.log(value);
});

console.log(" ");