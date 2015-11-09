import enumRenderer = require("./../enumRenderer/enumRenderer");

export class ModelView {
    public name: string;
    public properties: PropertyView[];
    public enums: enumRenderer.Generator.EnumView[];

    constructor() {
        this.properties = [];
        this.enums = [];
    }
}

export class PropertyView {
    public name: string;
    public description: string;
    public type: string;

    constructor() { }
}

export function GenerateModelView(name: string, definition: Swagger.Schema): ModelView {

    var modelView: ModelView = new ModelView();
    modelView.name = name;

    for (var property in definition.properties) {
        var propertyView: PropertyView = new PropertyView();
        propertyView.name = property;
        var propertyDesc = definition.properties[property];
        propertyView.type = propertyDesc.type;

        var propertyItems: Swagger.Schema = propertyDesc.items;
        
        if (propertyDesc.enum) {
            var enumView = enumRenderer.Generator.GenerateEnumView(property + "Enum", propertyDesc.enum);

            propertyView.type = enumView.name;
            modelView.enums.push(enumView);
        }

        if (propertyView.type === "array") {
            var propertyItems: Swagger.Schema = propertyDesc.items;
            var arrayType: string;
            if (propertyItems.$ref) {
                arrayType = propertyItems.$ref.slice("#/definitions/".length);
            }
            if (propertyItems.type) {
                arrayType = propertyItems.type;
            }
            if (propertyItems.enum) {
                var enumView = enumRenderer.Generator.GenerateEnumView(property + "Enum", propertyItems.enum);

                arrayType = enumView.name;
                modelView.enums.push(enumView);
            }

            propertyView.type = arrayType + "[]";
        }
        propertyView.description = propertyDesc.description;
        modelView.properties.push(propertyView);
    }

    return modelView;
}