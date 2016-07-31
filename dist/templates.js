"use strict";
var fs = require('fs');
var Templates;
(function (Templates) {
    var modelTemplatePath = __dirname + '/../templates/model.mustache';
    var enumTemplatePath = __dirname + '/../templates/enum.mustache';
    var serviceTemplatePath = __dirname + '/../templates/service.mustache';
    var mockTemplatePath = __dirname + '/../templates/mock.mustache';
    var mockOverrideTemplatePath = __dirname + '/../templates/mockOverride.mustache';
    var chanceTemplatePath = __dirname + '/../templates/chance.mustache';
    var chanceOverrideTemplatePath = __dirname + '/../templates/chanceOverride.mustache';
    var mockHelpersTemplatePath = __dirname + '/../templates/mockHelpers.mustache';
    Templates.modelTemplate = fs.readFileSync(modelTemplatePath, 'UTF-8');
    Templates.enumTemplate = fs.readFileSync(enumTemplatePath, 'UTF-8');
    Templates.serviceTemplate = fs.readFileSync(serviceTemplatePath, 'UTF-8');
    Templates.mockTemplates = {
        mockTemplate: fs.readFileSync(mockTemplatePath, 'UTF-8'),
        mockOverrideTemplate: fs.readFileSync(mockOverrideTemplatePath, 'UTF-8'),
        chanceTemplate: fs.readFileSync(chanceTemplatePath, 'UTF-8'),
        chanceOverrideTemplate: fs.readFileSync(chanceOverrideTemplatePath, 'UTF-8'),
    };
    Templates.mockHelpersTemplate = fs.readFileSync(mockHelpersTemplatePath, 'UTF-8');
})(Templates = exports.Templates || (exports.Templates = {}));
//# sourceMappingURL=templates.js.map