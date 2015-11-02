/// <reference path="../app.ts" />

class ModelViewModel {
    public name: string;
    public properties: PropertyViewModel[];
    public enums: EnumViewModel[];

    constructor() {
        this.properties = [];
        this.enums = [];
    }
}

class PropertyViewModel {
    public name: string;
    public description: string;
    public type: string;

    constructor() { }
}

class EnumViewModel {
    public name: string;
    public entities: EnumEntity[];

    constructor() {
        this.entities = [];
    }
}

class EnumEntity {
    public name: string;

    constructor() { }
}

function generateModel(name: string, definition: Swagger.Schema): ModelViewModel {

    var modelView: ModelViewModel = new ModelViewModel();
    modelView.name = name;

    for (var property in definition.properties) {
        var propertyView: PropertyViewModel = new PropertyViewModel();
        propertyView.name = property;
        propertyView.type = propertyDesc.type;

        var propertyDesc = definition.properties[property];
        var propertyItems: Swagger.Schema = propertyDesc.items;
        
        if (propertyDesc.enum) {
            var enumView: EnumViewModel = new EnumViewModel();
            enumView.name = property + "Enum";

            for (var en in propertyDesc.enum) {
                var enumEntity: EnumEntity = new EnumEntity();
                enumEntity.name = propertyDesc.enum[en].toString();
                enumView.entities.push(enumEntity);
            }
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
                var enumView: EnumViewModel = new EnumViewModel();
                enumView.name = property + "Enum";

                for (var en in propertyItems.enum) {
                    var enumEntity: EnumEntity = new EnumEntity();
                    enumEntity.name = propertyItems.enum[en].toString();
                    enumView.entities.push(enumEntity);
                }
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