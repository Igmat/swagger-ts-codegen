/// <reference path="../app.ts" />

function renderModels(swagger: Swagger.Spec, modelTemplate: string, enumTemplate: string): string[]{
    var models: string[] = [];
    for (var definition in swagger.definitions) {
        var modelView = generateModel(definition, swagger[definition]);
        models.push(Mustache.render(modelTemplate, modelView));
    }
    return models;
}