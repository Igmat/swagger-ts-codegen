import * as SwaggerCodeGen from '../src/app';
import * as fs from 'fs'; 

var filePath: string = 'swagger/swagger.json';
var swaggerFile: string = fs.readFileSync(filePath, 'UTF-8');
var swagger: Swagger.Spec = JSON.parse(swaggerFile);

var generator = new SwaggerCodeGen.Generators.Services.ServiceGenerator();
var renderer = new SwaggerCodeGen.Renderers.Component.ComponentRenderer(
    SwaggerCodeGen.Templates.enumTemplate,
    SwaggerCodeGen.Templates.modelTemplate,
    SwaggerCodeGen.Templates.serviceTemplate,
    SwaggerCodeGen.Templates.mockTemplates,
    SwaggerCodeGen.Templates.mockHelpersTemplate);
var components = generator.GenerateComponents(swagger);
var rendered = renderer.RenderComponents(components);

console.log('worked');