"use strict";
var swaggerTsCodegen = require("./dist/app");
var fs = require('fs');
var filePath = 'swagger/swagger.json';
var swaggerFile = fs.readFileSync(filePath, 'UTF-8');
var swagger = JSON.parse(swaggerFile);
var generator = new swaggerTsCodegen.Generators.Services.ServiceGenerator();
var renderer = new swaggerTsCodegen.Renderers.Component.ComponentRenderer(swaggerTsCodegen.enumTemplate, swaggerTsCodegen.modelTemplate, swaggerTsCodegen.serviceTemplate, swaggerTsCodegen.mockTemplates, swaggerTsCodegen.mockHelpersTemplate);
var components = generator.GenerateComponents(swagger);
var rendered = renderer.RenderComponents(components);
console.log("worked");
//# sourceMappingURL=test.js.map