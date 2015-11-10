import Mustache = require('mustache');

export import Generator = require("./enumViewGenerator");

export function RenderEnum(name: string, content: [string | boolean | number | Object], enumTemplate: string, enumGenerator: Generator.EnumGenerator, prefix: string): string {
    var enumView = enumGenerator.GenerateEnumView(name, content, prefix);
    var result = RenderEnumFromView(enumView, enumTemplate);

    return result;
}

export function RenderEnumFromView(enumView: Generator.EnumView, enumTemplate: string): string {
    var result = Mustache.render(enumTemplate, new EnumViewWrapper(enumView));

    return result;
}

class EnumViewWrapper {
    public name: string;
    public entities: EnumEntityWrapper[];

    constructor(enumView: Generator.EnumView) {
        this.name = enumView.name;
        this.entities = [];
        for (var entity in enumView.entities) {
            this.entities.push(new EnumEntityWrapper(enumView.entities[entity]));
        }
    }
}

class EnumEntityWrapper {
    public name: string;

    constructor(name: string) {
        this.name = name;
    }
}