var SwaggerCodeGen;
(function (SwaggerCodeGen) {
    var Generators;
    (function (Generators) {
        var Models;
        (function (Models) {
            var ModelView = (function () {
                function ModelView() {
                    this.properties = [];
                    this.linkedModels = [];
                    this.enums = new Generators.Enums.EnumViewCollection;
                }
                return ModelView;
            }());
            Models.ModelView = ModelView;
            var ModelViewCollection = (function () {
                function ModelViewCollection() {
                }
                return ModelViewCollection;
            }());
            Models.ModelViewCollection = ModelViewCollection;
            var PropertyView = (function () {
                function PropertyView() {
                    this.isArray = false;
                    this.isRequired = false;
                }
                return PropertyView;
            }());
            Models.PropertyView = PropertyView;
            var ModelGenerator = (function () {
                function ModelGenerator(enumGenerator) {
                    if (enumGenerator === void 0) { enumGenerator = new Generators.Enums.EnumGenerator; }
                    this.enumGenerator = enumGenerator;
                }
                ModelGenerator.prototype.GenerateModel = function (name, definition) {
                    var modelView = new ModelView();
                    modelView.name = name;
                    for (var property in definition.properties) {
                        var propertyView = new PropertyView();
                        propertyView.name = property;
                        var propertyDesc = definition.properties[property];
                        switch (propertyDesc.type) {
                            case "boolean":
                                propertyView.type = "boolean";
                                break;
                            case "string":
                                propertyView.type = "string";
                                propertyDesc.format;
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
                        if (propertyDesc.$ref) {
                            propertyView.type = propertyDesc.$ref.slice("#/definitions/".length);
                            modelView.linkedModels.push(propertyView.type);
                        }
                        var propertyItems = propertyDesc.items;
                        if (propertyDesc.enum) {
                            var enumView = this.enumGenerator.GenerateEnum(property, propertyDesc.enum, modelView.name);
                            propertyView.type = enumView.name;
                            modelView.enums[enumView.name] = enumView;
                        }
                        if (propertyView.type === "array") {
                            var propertyItems = propertyDesc.items;
                            propertyView.isArray = true;
                            if (propertyItems.$ref) {
                                propertyView.type = propertyItems.$ref.slice("#/definitions/".length);
                                modelView.linkedModels.push(propertyView.type);
                            }
                            if (propertyItems.type) {
                                switch (propertyItems.type) {
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
                        propertyView.isRequired = (definition.required && definition.required.indexOf(property) != -1);
                        modelView.properties.push(propertyView);
                    }
                    return modelView;
                };
                ModelGenerator.prototype.GenerateModelCollection = function (definitions) {
                    var result = new ModelViewCollection();
                    for (var modelName in definitions) {
                        result[modelName] = this.GenerateModel(modelName, definitions[modelName]);
                    }
                    return result;
                };
                return ModelGenerator;
            }());
            Models.ModelGenerator = ModelGenerator;
        })(Models = Generators.Models || (Generators.Models = {}));
    })(Generators = SwaggerCodeGen.Generators || (SwaggerCodeGen.Generators = {}));
})(SwaggerCodeGen || (SwaggerCodeGen = {}));
//# sourceMappingURL=modelViewGenerator.js.map