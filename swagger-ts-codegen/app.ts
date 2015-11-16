/// <reference path="../Scripts/typings/swagger/swagger.d.ts" />
/// <reference path="../typings/tsd.d.ts" />
module SwaggerCodeGen {
    var fs = require('fs'); 

    //var filePath: string = 'swagger/swagger.json';
    var modelTemplatePath: string = 'templates/model.mustache';
    var enumTemplatePath: string = 'templates/enum.mustache';
    var serviceTemplatePath: string = 'templates/service.mustache';
    //var swaggerFile: string = fs.readFileSync(filePath, 'UTF-8');
    export var modelTemplate: string = fs.readFileSync(modelTemplatePath, 'UTF-8');
    export var enumTemplate: string = fs.readFileSync(enumTemplatePath, 'UTF-8');
    export var serviceTemplate: string = fs.readFileSync(serviceTemplatePath, 'UTF-8');


    ////var swagger: Swagger.Spec = JSON.parse(swaggerFile);
    //var serviceGenerator = new Generators.Services.ServiceGenerator();
    //var componentRenderer = new Renderers.Components.ComponentRenderer(enumTemplate, modelTemplate, serviceTemplate);
    ////var components = serviceGenerator.GenerateComponents(swagger);
    ////var renderedComponents = componentRenderer.RenderComponents(components);
    //var swaggerCodegen = {
    //    serviceGenerator: serviceGenerator,
    //    componentRenderer: componentRenderer
    //}
    //export = swaggerCodegen;
    //var enumGenerator = new EnumRenderer.Generator.EnumGenerator();

    //var models = ModelsRenderer.RenderModels(swagger.definitions, modelTemplate, enumTemplate, enumGenerator);
    //models.forEach((value: string): void => {
    //    console.log(value);
    //});

    //var services = ServicesRenderer.RenderServices(swagger.paths, serviceTemplate, enumTemplate);
    //services.forEach((value: string): void => {
    //    console.log(value);
    //})

    //var services = ServicesRenderer.Generator.GenerateServiceViews(swagger.paths, enumGenerator);
    //var models = ModelsRenderer.Generator.GenerateModelViewCollection(swagger.definitions, enumGenerator);
    //var components = ServicesRenderer.Generator.GenerateComponents(models, services, enumGenerator);

}