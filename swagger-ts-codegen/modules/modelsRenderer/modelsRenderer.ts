import Mustache = require('mustache');
import enumRenderer = require("./../enumRenderer/enumRenderer");

export import Generator = require("./modelViewGenerator");

export function RenderModels(definitions: { [definitionsName: string]: Swagger.Schema }, modelTemplate: string, enumTemplate: string): string[]{
    var models: string[] = [];
    for (var name in definitions) {
        models.push(RenderModel(name, definitions[name], modelTemplate, enumTemplate))
    }
    return models;
}

export function RenderModel(name: string, definition: Swagger.Schema, modelTemplate: string, enumTemplate: string): string {
    var modelView = Generator.GenerateModelView(name, definition);
    var result = Mustache.render(modelTemplate, modelView);
    for (var singleEnum in modelView.enums) {
        result += enumRenderer.RenderEnumFromView(modelView.enums[singleEnum], enumTemplate);
    }

    return result;
}