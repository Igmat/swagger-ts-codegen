/// <reference path="../Scripts/typings/swagger/swagger.d.ts" />
/// <reference path="../typings/tsd.d.ts" />
module SwaggerCodeGen {
    var fs = require('fs'); 

    //var filePath: string = 'swagger/swagger.json';
    var modelTemplatePath: string = __dirname + '/../templates/model.mustache';
    var enumTemplatePath: string = __dirname + '/../templates/enum.mustache';
    var serviceTemplatePath: string = __dirname + '/../templates/service.mustache';
    //var swaggerFile: string = fs.readFileSync(filePath, 'UTF-8');
    export var modelTemplate: string = fs.readFileSync(modelTemplatePath, 'UTF-8');
    export var enumTemplate: string = fs.readFileSync(enumTemplatePath, 'UTF-8');
    export var serviceTemplate: string = fs.readFileSync(serviceTemplatePath, 'UTF-8');
}
declare module 'swagger-ts-codegen' {
    export = SwaggerCodeGen;
}