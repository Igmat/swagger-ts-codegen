/// <reference path="../Scripts/typings/swagger/swagger.d.ts" />
/// <reference path="../typings/tsd.d.ts" />
import fs = require('fs'); 

module SwaggerCodeGen {
    var modelTemplatePath: string = __dirname + '/../templates/model.mustache';
    var enumTemplatePath: string = __dirname + '/../templates/enum.mustache';
    var serviceTemplatePath: string = __dirname + '/../templates/service.mustache';
    
    export var modelTemplate: string = fs.readFileSync(modelTemplatePath, 'UTF-8');
    export var enumTemplate: string = fs.readFileSync(enumTemplatePath, 'UTF-8');
    export var serviceTemplate: string = fs.readFileSync(serviceTemplatePath, 'UTF-8');
}
export = SwaggerCodeGen;
