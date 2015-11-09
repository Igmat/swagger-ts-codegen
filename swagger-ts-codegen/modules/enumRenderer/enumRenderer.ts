import Mustache = require('mustache');

export import Generator = require("./enumViewGenerator");

export function RenderEnum(name: string, content: [string | boolean | number | Object], enumTemplate: string): string {
    var enumView = Generator.GenerateEnumView(name, content);
    var result = RenderEnumFromView(enumView, enumTemplate);

    return result;
}

export function RenderEnumFromView(enumView: Generator.EnumView, enumTemplate: string): string {
    var result = Mustache.render(enumTemplate, enumView);

    return result;
}