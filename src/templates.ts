import * as fs from 'fs';

export namespace Templates {
    var modelTemplatePath: string = __dirname + '/../templates/model.mustache';
    var enumTemplatePath: string = __dirname + '/../templates/enum.mustache';
    var serviceTemplatePath: string = __dirname + '/../templates/service.mustache';
    var mockTemplatePath: string = __dirname + '/../templates/mock.mustache';
    var mockOverrideTemplatePath: string = __dirname + '/../templates/mockOverride.mustache';
    var chanceTemplatePath: string = __dirname + '/../templates/chance.mustache';
    var chanceOverrideTemplatePath: string = __dirname + '/../templates/chanceOverride.mustache';
    var mockHelpersTemplatePath: string = __dirname + '/../templates/mockHelpers.mustache';
    
    export var modelTemplate: string = fs.readFileSync(modelTemplatePath, 'UTF-8');
    export var enumTemplate: string = fs.readFileSync(enumTemplatePath, 'UTF-8');
    export var serviceTemplate: string = fs.readFileSync(serviceTemplatePath, 'UTF-8');
    export var mockTemplates = {
        mockTemplate: fs.readFileSync(mockTemplatePath, 'UTF-8'),
        mockOverrideTemplate: fs.readFileSync(mockOverrideTemplatePath, 'UTF-8'),
        chanceTemplate: fs.readFileSync(chanceTemplatePath, 'UTF-8'),
        chanceOverrideTemplate: fs.readFileSync(chanceOverrideTemplatePath, 'UTF-8'),
    }
    export var mockHelpersTemplate: string = fs.readFileSync(mockHelpersTemplatePath, 'UTF-8');
}