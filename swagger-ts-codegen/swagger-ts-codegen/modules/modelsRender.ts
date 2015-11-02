/// <reference path="../app.ts" />

import modelGenerator = require("./modelGenerator");
import Mustache = require('mustache');

export function renderModels(swagger: Swagger.Spec, modelTemplate: string, enumTemplate: string): string[]{
    var models: string[] = [];
    for (var definition in swagger.definitions) {
        var modelView = modelGenerator.generateModel(definition, swagger.definitions[definition]);
        models.push(Mustache.render(modelTemplate, modelView));
    }
    return models;
}