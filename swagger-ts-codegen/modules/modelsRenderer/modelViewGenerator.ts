import enumRenderer = require("./../enumRenderer/enumRenderer");

export class ModelView {
    public name: string;
    public properties: PropertyView[];
    public enums: { [enumName: string]: enumRenderer.Generator.EnumView };

    constructor() {
        this.properties = [];
        this.enums = {};
    }
}

export class ModelViewCollection {
    [ModelName: string]: ModelView;
    constructor() {
    }
}

export class PropertyView {
    public name: string;
    public description: string;
    public type: string;
    public isArray: boolean;

    constructor() {
        this.isArray = false;
    }
}

export function GenerateModelView(name: string, definition: Swagger.Schema, enumGenerator: enumRenderer.Generator.EnumGenerator): ModelView {

    var modelView: ModelView = new ModelView();
    modelView.name = name;

    for (var property in definition.properties) {
        var propertyView: PropertyView = new PropertyView();
        propertyView.name = property;
        var propertyDesc = definition.properties[property];
        propertyView.type = propertyDesc.type;

        var propertyItems: Swagger.Schema = propertyDesc.items;
        
        if (propertyDesc.enum) {
            var enumView = enumGenerator.GenerateEnumView(property, propertyDesc.enum, modelView.name);

            propertyView.type = enumView.name;
            modelView.enums[enumView.name] = enumView;
        }

        if (propertyView.type === "array") {
            var propertyItems: Swagger.Schema = propertyDesc.items;
            propertyView.isArray = true;
            if (propertyItems.$ref) {
                propertyView.type = propertyItems.$ref.slice("#/definitions/".length);
            }
            if (propertyItems.type) {
                propertyView.type = propertyItems.type;
            }
            if (propertyItems.enum) {
                var enumView = enumGenerator.GenerateEnumView(property, propertyItems.enum, modelView.name);

                propertyView.type = enumView.name;
                modelView.enums[enumView.name] = enumView;
            }
        }
        propertyView.description = propertyDesc.description;
        modelView.properties.push(propertyView);
    }

    return modelView;
}

export function GenerateModelViewCollection(definitions: { [definitionsName: string]: Swagger.Schema }, enumGenerator: enumRenderer.Generator.EnumGenerator): ModelViewCollection {
    var result = new ModelViewCollection();
    for (var modelName in definitions) {
        result[modelName] = GenerateModelView(modelName, definitions[modelName], enumGenerator);
    }
    return result;
}