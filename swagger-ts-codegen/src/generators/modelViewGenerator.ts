﻿module SwaggerCodeGen.Generators.Models {

    export class ModelView {
        public name: string;
        public properties: PropertyView[];
        public enums: Enums.EnumViewCollection;

        constructor() {
            this.properties = [];
            this.enums = new Enums.EnumViewCollection;
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

    export class ModelGenerator {
        constructor(private enumGenerator: Enums.EnumGenerator = new Enums.EnumGenerator) {
        }

        public GenerateModel(name: string, definition: Swagger.Schema): ModelView {

            var modelView: ModelView = new ModelView();
            modelView.name = name;

            for (var property in definition.properties) {
                var propertyView: PropertyView = new PropertyView();
                propertyView.name = property;
                var propertyDesc = definition.properties[property];
                switch (propertyDesc.type) {//for primitives
                    case "boolean":
                        propertyView.type = "boolean";
                        break;
                    case "string":
                        propertyView.type = "string";
                        break;
                    case "number":
                        propertyView.type = "number";
                        break;
                    case "integer":
                        propertyView.type = "number";
                        break;
                    default:
                        propertyView.type = propertyDesc.type;
                        break;
                }                

                var propertyItems: Swagger.Schema = propertyDesc.items;

                if (propertyDesc.enum) {
                    var enumView = this.enumGenerator.GenerateEnum(property, propertyDesc.enum, modelView.name);

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
                        switch (propertyItems.type) {//for primitives
                            case "boolean":
                                propertyView.type = "boolean";
                                break;
                            case "string":
                                propertyView.type = "string";
                                break;
                            case "number":
                                propertyView.type = "number";
                                break;
                            case "integer":
                                propertyView.type = "number";
                                break;
                            default:
                                throw new Error("Unsupported type of property");
                        }
                    }
                    if (propertyItems.enum) {
                        var enumView = this.enumGenerator.GenerateEnum(property, propertyItems.enum, modelView.name);

                        propertyView.type = enumView.name;
                        modelView.enums[enumView.name] = enumView;
                    }
                }
                propertyView.description = propertyDesc.description;
                modelView.properties.push(propertyView);
            }

            return modelView;
        }

        public GenerateModelCollection(definitions: { [definitionsName: string]: Swagger.Schema }): ModelViewCollection {
            var result = new ModelViewCollection();
            for (var modelName in definitions) {
                result[modelName] = this.GenerateModel(modelName, definitions[modelName]);
            }
            return result;
        }
    }
}
