
module SwaggerCodeGen.Generators.Models {

    export class ModelView {
        public name: string;
        public properties: PropertyView[];
        public enums: Enums.EnumViewCollection;
        public linkedModels: string[];

        constructor() {
            this.properties = [];
            this.linkedModels = [];
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
                propertyView.type = propertyDesc.type;
                if (propertyDesc.$ref) {
                    propertyView.type = propertyDesc.$ref.slice("#/definitions/".length);
                    modelView.linkedModels.push(propertyView.type);
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
                        modelView.linkedModels.push(propertyView.type);
                    }
                    if (propertyItems.type) {
                        propertyView.type = propertyItems.type;
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