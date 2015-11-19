import swaggerTsCodegen = require("./dist/app");
import fs = require('fs'); 

var filePath: string = 'swagger/swagger.json';
var swaggerFile: string = fs.readFileSync(filePath, 'UTF-8');
var swagger: Swagger.Spec = JSON.parse(swaggerFile);

var generator = new swaggerTsCodegen.Generators.Services.ServiceGenerator();
var renderer = new swaggerTsCodegen.Renderers.Component.ComponentRenderer(
    swaggerTsCodegen.enumTemplate,
    swaggerTsCodegen.modelTemplate,
    swaggerTsCodegen.serviceTemplate);
var components = generator.GenerateComponents(swagger);
var rendered = renderer.RenderComponents(components);

console.log("worked");