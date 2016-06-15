/// <reference path="../Scripts/typings/swagger/swagger.d.ts" />
/// <reference path="../typings/tsd.d.ts" />
var fs = require('fs');
var SwaggerCodeGen;
(function (SwaggerCodeGen) {
    var modelTemplatePath = __dirname + '/../templates/model.mustache';
    var enumTemplatePath = __dirname + '/../templates/enum.mustache';
    var serviceTemplatePath = __dirname + '/../templates/service.mustache';
    var mockTemplatePath = __dirname + '/../templates/mock.mustache';
    var mockOverrideTemplatePath = __dirname + '/../templates/mockOverride.mustache';
    var chanceTemplatePath = __dirname + '/../templates/chance.mustache';
    var chanceOverrideTemplatePath = __dirname + '/../templates/chanceOverride.mustache';
    var mockHelpersTemplatePath = __dirname + '/../templates/mockHelpers.mustache';
    SwaggerCodeGen.modelTemplate = fs.readFileSync(modelTemplatePath, 'UTF-8');
    SwaggerCodeGen.enumTemplate = fs.readFileSync(enumTemplatePath, 'UTF-8');
    SwaggerCodeGen.serviceTemplate = fs.readFileSync(serviceTemplatePath, 'UTF-8');
    SwaggerCodeGen.mockTemplates = {
        mockTemplate: fs.readFileSync(mockTemplatePath, 'UTF-8'),
        mockOverrideTemplate: fs.readFileSync(mockOverrideTemplatePath, 'UTF-8'),
        chanceTemplate: fs.readFileSync(chanceTemplatePath, 'UTF-8'),
        chanceOverrideTemplate: fs.readFileSync(chanceOverrideTemplatePath, 'UTF-8'),
    };
    SwaggerCodeGen.mockHelpersTemplate = fs.readFileSync(mockHelpersTemplatePath, 'UTF-8');
})(SwaggerCodeGen || (SwaggerCodeGen = {}));
var SwaggerCodeGen;
(function (SwaggerCodeGen) {
    var Generators;
    (function (Generators) {
        var Enums;
        (function (Enums) {
            var EnumView = (function () {
                function EnumView() {
                    this.length = 0;
                    this.entities = {};
                }
                EnumView.prototype.Equals = function (another) {
                    var result = this.length == another.length;
                    if (result) {
                        for (var entity in this.entities) {
                            result = result && (this.entities[entity] == another.entities[entity]);
                        }
                    }
                    return result;
                };
                return EnumView;
            })();
            Enums.EnumView = EnumView;
            var EnumViewCollection = (function () {
                function EnumViewCollection() {
                }
                return EnumViewCollection;
            })();
            Enums.EnumViewCollection = EnumViewCollection;
            var EnumGenerator = (function () {
                function EnumGenerator() {
                    this.enums = new EnumViewCollection();
                }
                EnumGenerator.prototype.GenerateEnum = function (name, content, optionalPrefix) {
                    var enumView = new EnumView();
                    enumView.name = name + "Enum";
                    for (var en in content) {
                        var enumEntity = content[en].toString();
                        enumView.length++;
                        enumView.entities[enumEntity] = enumEntity;
                    }
                    if (this.enums[enumView.name]) {
                        if (enumView.Equals(this.enums[enumView.name])) {
                            enumView = this.enums[enumView.name];
                            return enumView;
                        }
                        else {
                            enumView.name = optionalPrefix + enumView.name;
                            if (this.enums[enumView.name]) {
                                if (enumView.Equals(this.enums[enumView.name])) {
                                    enumView = this.enums[enumView.name];
                                    return enumView;
                                }
                                else {
                                    throw new Error("Unable to add enum because of already existed names");
                                }
                            }
                        }
                    }
                    for (var enumName in this.enums) {
                        if (enumView.Equals(this.enums[enumName])) {
                            enumView = this.enums[enumName];
                            return enumView;
                        }
                    }
                    this.enums[enumView.name] = enumView;
                    return enumView;
                };
                return EnumGenerator;
            })();
            Enums.EnumGenerator = EnumGenerator;
        })(Enums = Generators.Enums || (Generators.Enums = {}));
    })(Generators = SwaggerCodeGen.Generators || (SwaggerCodeGen.Generators = {}));
})(SwaggerCodeGen || (SwaggerCodeGen = {}));
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
            })();
            Models.ModelView = ModelView;
            var ModelViewCollection = (function () {
                function ModelViewCollection() {
                }
                return ModelViewCollection;
            })();
            Models.ModelViewCollection = ModelViewCollection;
            var PropertyView = (function () {
                function PropertyView() {
                    this.isArray = false;
                    this.isRequired = false;
                }
                return PropertyView;
            })();
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
            })();
            Models.ModelGenerator = ModelGenerator;
        })(Models = Generators.Models || (Generators.Models = {}));
    })(Generators = SwaggerCodeGen.Generators || (SwaggerCodeGen.Generators = {}));
})(SwaggerCodeGen || (SwaggerCodeGen = {}));
var SwaggerCodeGen;
(function (SwaggerCodeGen) {
    var Generators;
    (function (Generators) {
        var Services;
        (function (Services) {
            var ParameterView = (function () {
                function ParameterView() {
                }
                return ParameterView;
            })();
            Services.ParameterView = ParameterView;
            var MethodView = (function () {
                function MethodView() {
                    this.pathParameters = [];
                    this.queryParameters = [];
                }
                return MethodView;
            })();
            Services.MethodView = MethodView;
            var ServiceView = (function () {
                function ServiceView() {
                    this.methods = [];
                    this.enums = new Generators.Enums.EnumViewCollection;
                }
                return ServiceView;
            })();
            Services.ServiceView = ServiceView;
            var ServiceViewCollection = (function () {
                function ServiceViewCollection() {
                }
                return ServiceViewCollection;
            })();
            Services.ServiceViewCollection = ServiceViewCollection;
            var Component = (function () {
                function Component() {
                    this.models = new Generators.Models.ModelViewCollection();
                    this.enums = new Generators.Enums.EnumViewCollection;
                }
                return Component;
            })();
            Services.Component = Component;
            var MethodAndEnums = (function () {
                function MethodAndEnums() {
                    this.enums = new Generators.Enums.EnumViewCollection;
                }
                return MethodAndEnums;
            })();
            var ServiceGenerator = (function () {
                function ServiceGenerator(enumGenerator, modelGenerator) {
                    if (enumGenerator === void 0) { enumGenerator = new Generators.Enums.EnumGenerator(); }
                    if (modelGenerator === void 0) { modelGenerator = new Generators.Models.ModelGenerator(enumGenerator); }
                    this.enumGenerator = enumGenerator;
                    this.modelGenerator = modelGenerator;
                }
                ServiceGenerator.prototype.GenerateComponents = function (swagger) {
                    var models = this.modelGenerator.GenerateModelCollection(swagger.definitions);
                    var services = this.GenerateServiceViews(swagger.paths);
                    var result = [];
                    for (var serviceName in services) {
                        var service = services[serviceName];
                        var component = new Component();
                        component.name = service.name;
                        component.service = service;
                        var modelCount = 0;
                        for (var enumName in service.enums) {
                            component.enums[enumName] = service.enums[enumName];
                        }
                        for (var i = 0; i < service.methods.length; i++) {
                            var method = service.methods[i];
                            if (method.response != "string" &&
                                method.response != "number" &&
                                method.response != "boolean" &&
                                method.response != "any") {
                                var model = models[method.response];
                                var singleEnum = this.enumGenerator.enums[method.response];
                                if (!model && !singleEnum)
                                    throw new Error("There is no Enum or Model with name " + method.response + " for method: " + component.name + "." + method.operationId);
                                if (model) {
                                    component.models[model.name] = model;
                                    modelCount++;
                                    for (var enumName in model.enums) {
                                        component.enums[enumName] = model.enums[enumName];
                                    }
                                }
                                if (singleEnum) {
                                    component.enums[method.response] = singleEnum;
                                }
                            }
                            if (method.bodyParameter) {
                                if (method.bodyParameter.type != "string" &&
                                    method.bodyParameter.type != "number" &&
                                    method.bodyParameter.type != "boolean" &&
                                    method.bodyParameter.type != "any") {
                                    var model = models[method.bodyParameter.type];
                                    var singleEnum = this.enumGenerator.enums[method.bodyParameter.type];
                                    if (!model && !singleEnum)
                                        throw new Error("There is no Enum or Model with name " + method.bodyParameter.type + " for method: " + component.name + "." + method.operationId);
                                    if (model) {
                                        component.models[model.name] = model;
                                        for (var enumName in model.enums) {
                                            component.enums[enumName] = model.enums[enumName];
                                        }
                                    }
                                    if (singleEnum) {
                                        component.enums[method.bodyParameter.type] = singleEnum;
                                    }
                                }
                            }
                            for (var j = 0; j < method.pathParameters.length; j++) {
                                var parameter = method.pathParameters[j];
                                if (parameter.type != "string" &&
                                    parameter.type != "number" &&
                                    parameter.type != "boolean" &&
                                    parameter.type != "any") {
                                    var model = models[parameter.type];
                                    var singleEnum = this.enumGenerator.enums[parameter.type];
                                    if (!model && !singleEnum)
                                        throw new Error("There is no Enum or Model with name " + parameter.type + " for method: " + component.name + "." + method.operationId);
                                    if (model) {
                                        modelCount++;
                                        component.models[model.name] = model;
                                        for (var enumName in model.enums) {
                                            component.enums[enumName] = model.enums[enumName];
                                        }
                                    }
                                    if (singleEnum) {
                                        component.enums[parameter.type] = singleEnum;
                                    }
                                }
                            }
                            for (var j = 0; j < method.queryParameters.length; j++) {
                                var parameter = method.queryParameters[j];
                                if (parameter.type != "string" &&
                                    parameter.type != "number" &&
                                    parameter.type != "boolean" &&
                                    parameter.type != "any") {
                                    var model = models[parameter.type];
                                    var singleEnum = this.enumGenerator.enums[parameter.type];
                                    if (!model && !singleEnum)
                                        throw new Error("There is no Enum or Model with name" + parameter.type + " for method: " + component.name + "." + method.operationId);
                                    if (model) {
                                        modelCount++;
                                        component.models[model.name] = model;
                                        for (var enumName in model.enums) {
                                            component.enums[enumName] = model.enums[enumName];
                                        }
                                    }
                                    if (singleEnum) {
                                        component.enums[parameter.type] = singleEnum;
                                    }
                                }
                            }
                        }
                        var isNewLinkedModelExists = true;
                        while (isNewLinkedModelExists) {
                            var modelAndLinkedModelCount = modelCount;
                            for (var modelName in component.models) {
                                var model = component.models[modelName];
                                for (var i = 0; i < model.linkedModels.length; i++) {
                                    var linkedModelName = model.linkedModels[i];
                                    if (!component.models[linkedModelName]) {
                                        modelAndLinkedModelCount++;
                                        var model_1 = models[linkedModelName];
                                        component.models[linkedModelName] = model_1;
                                        for (var enumName in model_1.enums) {
                                            component.enums[enumName] = model_1.enums[enumName];
                                        }
                                    }
                                }
                            }
                            isNewLinkedModelExists = modelAndLinkedModelCount > modelCount;
                        }
                        result.push(component);
                    }
                    return result;
                };
                ServiceGenerator.prototype.GenerateServiceViews = function (paths) {
                    var serviceViews = new ServiceViewCollection();
                    for (var pathName in paths) {
                        var path = paths[pathName];
                        for (var key in path) {
                            if (key != "$ref" && key != "parameters") {
                                var httpVerb = key;
                                var operation = path[key];
                                var serviceName = operation.tags[0];
                                if (!serviceViews[serviceName]) {
                                    serviceViews[serviceName] = new ServiceView();
                                    serviceViews[serviceName].name = serviceName;
                                }
                                var methodAndEnums = this.generateMethod(httpVerb, pathName, operation);
                                serviceViews[serviceName].methods.push(methodAndEnums.method);
                                for (var enumName in methodAndEnums.enums) {
                                    serviceViews[serviceName].enums[enumName] = methodAndEnums[enumName];
                                }
                            }
                        }
                    }
                    return serviceViews;
                };
                ServiceGenerator.prototype.generateMethod = function (httpVerb, link, operation) {
                    var result = new MethodAndEnums();
                    var methodView = new MethodView();
                    methodView.httpVerb = httpVerb.toUpperCase();
                    methodView.link = link;
                    methodView.operationId = operation.operationId.slice(operation.operationId.lastIndexOf('.') + 1);
                    methodView.description = operation.summary;
                    methodView.returns = operation.description;
                    if (operation.parameters) {
                        for (var i = 0; i < operation.parameters.length; i++) {
                            var parameter = operation.parameters[i];
                            var parameterView = new ParameterView();
                            parameterView.name = parameter.name;
                            if (parameter.description) {
                                parameterView.description = parameter.description;
                            }
                            switch (parameter.in) {
                                case 'body':
                                    if (parameter.schema.$ref) {
                                        parameterView.type = parameter.schema.$ref.slice("#/definitions/".length);
                                    }
                                    else {
                                        if (parameter.schema.enum) {
                                            var enumView = this.enumGenerator.GenerateEnum(parameter.name, parameter.schema.enum, methodView.operationId);
                                            parameterView.type = enumView.name;
                                            result.enums[enumView.name] = enumView;
                                        }
                                        else {
                                            switch (parameter.schema.type) {
                                                case "boolean":
                                                    parameterView.type = "boolean";
                                                    break;
                                                case "string":
                                                    parameterView.type = "string";
                                                    break;
                                                case "number":
                                                    parameterView.type = "number";
                                                    break;
                                                case "integer":
                                                    parameterView.type = "number";
                                                    break;
                                                default:
                                                    throw new Error("Unsupported type of body parameter");
                                            }
                                        }
                                    }
                                    parameterView.optional = !parameter.required;
                                    methodView.bodyParameter = parameterView;
                                    break;
                                case 'path':
                                    if (parameter.enum) {
                                        var enumView = this.enumGenerator.GenerateEnum(parameter.name, parameter.enum, methodView.operationId);
                                        parameterView.type = enumView.name;
                                        result.enums[enumView.name] = enumView;
                                    }
                                    else {
                                        switch (parameter.type) {
                                            case "boolean":
                                                parameterView.type = "boolean";
                                                break;
                                            case "string":
                                                parameterView.type = "string";
                                                break;
                                            case "number":
                                                parameterView.type = "number";
                                                break;
                                            case "integer":
                                                parameterView.type = "number";
                                                break;
                                            default:
                                                throw new Error("Unsupported type of path parameter");
                                        }
                                    }
                                    parameterView.optional = false;
                                    methodView.pathParameters.push(parameterView);
                                    break;
                                case 'query':
                                    if (parameter.schema && parameter.schema.$ref) {
                                        parameterView.type = parameter.schema.$ref.slice("#/definitions/".length);
                                    }
                                    else {
                                        if (parameter.enum) {
                                            var enumView = this.enumGenerator.GenerateEnum(parameter.name, parameter.enum, methodView.operationId);
                                            parameterView.type = enumView.name;
                                            result.enums[enumView.name] = enumView;
                                        }
                                        else {
                                            switch (parameter.type) {
                                                case "boolean":
                                                    parameterView.type = "boolean";
                                                    break;
                                                case "string":
                                                    parameterView.type = "string";
                                                    break;
                                                case "number":
                                                    parameterView.type = "number";
                                                    break;
                                                case "integer":
                                                    parameterView.type = "number";
                                                    break;
                                                default:
                                                    throw new Error("Unsupported type of query parameter");
                                            }
                                        }
                                    }
                                    parameterView.optional = !parameter.required;
                                    methodView.queryParameters.push(parameterView);
                                    break;
                                default:
                                    throw new Error("Unsupported parameter appearance");
                            }
                        }
                    }
                    if (operation.responses) {
                        for (var responseName in operation.responses) {
                            var response = operation.responses[responseName];
                            if (response.schema) {
                                if (response.schema.$ref) {
                                    methodView.response = response.schema.$ref.slice("#/definitions/".length);
                                }
                                else {
                                    switch (response.schema.type) {
                                        case "boolean":
                                            methodView.response = "boolean";
                                            break;
                                        case "string":
                                            methodView.response = "string";
                                            break;
                                        case "number":
                                            methodView.response = "number";
                                            break;
                                        case "integer":
                                            methodView.response = "number";
                                            break;
                                        default:
                                            throw new Error("Unsupported type of response");
                                    }
                                }
                            }
                            else {
                                methodView.response = "any";
                            }
                        }
                    }
                    result.method = methodView;
                    return result;
                };
                return ServiceGenerator;
            })();
            Services.ServiceGenerator = ServiceGenerator;
        })(Services = Generators.Services || (Generators.Services = {}));
    })(Generators = SwaggerCodeGen.Generators || (SwaggerCodeGen.Generators = {}));
})(SwaggerCodeGen || (SwaggerCodeGen = {}));
var SwaggerCodeGen;
(function (SwaggerCodeGen) {
    var Renderers;
    (function (Renderers) {
        var Component;
        (function (Component) {
            var Mustache = require('mustache');
            var RenderedComponent = (function () {
                function RenderedComponent() {
                    this.enums = [];
                    this.models = [];
                }
                return RenderedComponent;
            })();
            Component.RenderedComponent = RenderedComponent;
            var RenderedComponents = (function () {
                function RenderedComponents() {
                    this.Components = [];
                }
                return RenderedComponents;
            })();
            Component.RenderedComponents = RenderedComponents;
            var ComponentRenderer = (function () {
                function ComponentRenderer(enumRendererDefiner, modelRendererDefiner, serviceRendererDefiner, mockRendererDefiner, mockHelpersTemplate) {
                    if (typeof enumRendererDefiner === "string") {
                        this.enumRenderer = new Renderers.Enums.EnumRenderer(enumRendererDefiner);
                    }
                    else {
                        this.enumRenderer = enumRendererDefiner;
                    }
                    if (typeof modelRendererDefiner === "string") {
                        this.modelRenderer = new Renderers.Models.ModelRenderer(modelRendererDefiner);
                    }
                    else {
                        this.modelRenderer = modelRendererDefiner;
                    }
                    if (typeof serviceRendererDefiner === "string") {
                        this.serviceRenderer = new Renderers.Services.ServiceRenderer(serviceRendererDefiner);
                    }
                    else {
                        this.serviceRenderer = serviceRendererDefiner;
                    }
                    if (mockRendererDefiner instanceof Renderers.Mocks.MockRenderer) {
                        this.mockRenderer = mockRendererDefiner;
                    }
                    else {
                        this.mockRenderer = new Renderers.Mocks.MockRenderer(mockRendererDefiner);
                    }
                    this.mockHelpersTemplate = mockHelpersTemplate;
                }
                ComponentRenderer.prototype.RenderComponent = function (componentView) {
                    var result = new RenderedComponent();
                    result.name = componentView.name;
                    result.service = this.serviceRenderer.RenderService(componentView.service);
                    result.mocks = this.mockRenderer.RenderMock(componentView);
                    result.models = this.modelRenderer.RenderModelCollection(componentView.models);
                    result.enums = this.enumRenderer.RenderEnumCollection(componentView.enums);
                    return result;
                };
                ComponentRenderer.prototype.RenderComponents = function (componentViews) {
                    var result = new RenderedComponents();
                    result.MockHelpers = Mustache.render(this.mockHelpersTemplate, {});
                    for (var i = 0; i < componentViews.length; i++) {
                        result.Components.push(this.RenderComponent(componentViews[i]));
                    }
                    return result;
                };
                return ComponentRenderer;
            })();
            Component.ComponentRenderer = ComponentRenderer;
        })(Component = Renderers.Component || (Renderers.Component = {}));
    })(Renderers = SwaggerCodeGen.Renderers || (SwaggerCodeGen.Renderers = {}));
})(SwaggerCodeGen || (SwaggerCodeGen = {}));
var SwaggerCodeGen;
(function (SwaggerCodeGen) {
    var Renderers;
    (function (Renderers) {
        var Enums;
        (function (Enums) {
            var Mustache = require('mustache');
            var EnumViewWrapper = (function () {
                function EnumViewWrapper(enumView) {
                    this.name = enumView.name;
                    this.entities = [];
                    for (var entity in enumView.entities) {
                        this.entities.push(new EnumEntityWrapper(enumView.entities[entity]));
                    }
                }
                return EnumViewWrapper;
            })();
            var EnumEntityWrapper = (function () {
                function EnumEntityWrapper(name) {
                    this.name = name;
                }
                return EnumEntityWrapper;
            })();
            var RenderedEnum = (function () {
                function RenderedEnum() {
                }
                return RenderedEnum;
            })();
            Enums.RenderedEnum = RenderedEnum;
            var EnumRenderer = (function () {
                function EnumRenderer(enumTemplate) {
                    this.enumTemplate = enumTemplate;
                }
                EnumRenderer.prototype.RenderEnum = function (enumView) {
                    var result = new RenderedEnum();
                    result.name = enumView.name;
                    result.content = Mustache.render(this.enumTemplate, new EnumViewWrapper(enumView));
                    return result;
                };
                EnumRenderer.prototype.RenderEnums = function (enumViews) {
                    var result = [];
                    for (var i = 0; i < enumViews.length; i++) {
                        result.push(this.RenderEnum(enumViews[i]));
                    }
                    return result;
                };
                EnumRenderer.prototype.RenderEnumCollection = function (enumViews) {
                    var result = [];
                    for (var enumName in enumViews) {
                        result.push(this.RenderEnum(enumViews[enumName]));
                    }
                    return result;
                };
                return EnumRenderer;
            })();
            Enums.EnumRenderer = EnumRenderer;
        })(Enums = Renderers.Enums || (Renderers.Enums = {}));
    })(Renderers = SwaggerCodeGen.Renderers || (SwaggerCodeGen.Renderers = {}));
})(SwaggerCodeGen || (SwaggerCodeGen = {}));
var SwaggerCodeGen;
(function (SwaggerCodeGen) {
    var Renderers;
    (function (Renderers) {
        var Mocks;
        (function (Mocks) {
            var Mustache = require('mustache');
            function IsStreet(name) {
                var nameInLower = name.toLowerCase().replace(/_/g, "");
                return ((nameInLower.indexOf("st.") != -1) ||
                    (nameInLower.indexOf("str.") != -1) ||
                    (nameInLower.indexOf("street") != -1));
            }
            function IsAdress(name) {
                var nameInLower = name.toLowerCase().replace(/_/g, "");
                return ((nameInLower.indexOf("adres") != -1) ||
                    (nameInLower.indexOf("addr") != -1) ||
                    (nameInLower.indexOf("location") != -1) ||
                    (nameInLower.indexOf("house") != -1));
            }
            function IsCity(name) {
                var nameInLower = name.toLowerCase().replace(/_/g, "");
                return ((nameInLower.indexOf("city") != -1) ||
                    (nameInLower.indexOf("town") != -1));
            }
            function IsState(name) {
                var nameInLower = name.toLowerCase().replace(/_/g, "");
                return ((nameInLower.indexOf("state") != -1));
            }
            function IsCountry(name) {
                var nameInLower = name.toLowerCase().replace(/_/g, "");
                return ((nameInLower.indexOf("country") != -1));
            }
            function IsZip(name) {
                var nameInLower = name.toLowerCase().replace(/_/g, "");
                return ((nameInLower.indexOf("zip") != -1));
            }
            function IsPhone(name) {
                var nameInLower = name.toLowerCase().replace(/_/g, "");
                return ((nameInLower.indexOf("phone") != -1));
            }
            function IsEmail(name) {
                var nameInLower = name.toLowerCase().replace(/_/g, "");
                return ((nameInLower.indexOf("mail") != -1));
            }
            function IsFirstName(name) {
                var nameInLower = name.toLowerCase().replace(/_/g, "");
                return ((nameInLower.indexOf("name") != -1));
            }
            function IsSurname(name) {
                var nameInLower = name.toLowerCase().replace(/_/g, "");
                return ((nameInLower.indexOf("lastname") != -1) ||
                    (nameInLower.indexOf("surname") != -1));
            }
            function IsFullName(name) {
                var nameInLower = name.toLowerCase().replace(/_/g, "");
                return ((nameInLower.indexOf("fullname") != -1));
            }
            function IsWord(name) {
                var nameInLower = name.toLowerCase().replace(/_/g, "");
                return ((nameInLower.indexOf("group") != -1) ||
                    (nameInLower.indexOf("company") != -1) ||
                    (nameInLower.indexOf("organization") != -1));
            }
            function IsSentence(name) {
                var nameInLower = name.toLowerCase().replace(/_/g, "");
                return ((nameInLower.indexOf("title") != -1) ||
                    (nameInLower.indexOf("about") != -1) ||
                    (nameInLower.indexOf("desc") != -1));
            }
            function IsParagraph(name) {
                var nameInLower = name.toLowerCase().replace(/_/g, "");
                return ((nameInLower.indexOf("content") != -1) ||
                    (nameInLower.indexOf("article") != -1) ||
                    (nameInLower.indexOf("comment") != -1) ||
                    (nameInLower.indexOf("note") != -1));
            }
            function IsLatitude(name) {
                var nameInLower = name.toLowerCase().replace(/_/g, "");
                return ((nameInLower.indexOf("latitude") != -1));
            }
            function IsLongitude(name) {
                var nameInLower = name.toLowerCase().replace(/_/g, "");
                return ((nameInLower.indexOf("longitude") != -1));
            }
            function IsUrl(name) {
                var nameInLower = name.toLowerCase().replace(/_/g, "");
                return ((nameInLower.indexOf("url") != -1) ||
                    (nameInLower.indexOf("link") != -1) ||
                    (nameInLower.indexOf("site") != -1) ||
                    (nameInLower.indexOf("web") != -1));
            }
            function IsBirthday(name) {
                var nameInLower = name.toLowerCase().replace(/_/g, "");
                return ((nameInLower.indexOf("birth") != -1));
            }
            function IsDate(name) {
                var nameInLower = name.toLowerCase().replace(/_/g, "");
                return ((nameInLower.indexOf("date") != -1));
            }
            function IsIdentifier(name) {
                return ((name.indexOf("id") == 0) ||
                    (name.indexOf("_id") != -1) ||
                    (name.indexOf("Id") != -1) ||
                    (name.indexOf("alias") == 0) ||
                    (name.indexOf("_alias") != -1) ||
                    (name.indexOf("Alias") != -1));
            }
            var EnumEntityWrapper = (function () {
                function EnumEntityWrapper(name) {
                    this.name = name;
                }
                return EnumEntityWrapper;
            })();
            var EnumViewWrapper = (function () {
                function EnumViewWrapper(enumView) {
                    this.name = enumView.name;
                    this.entities = [];
                    for (var entity in enumView.entities) {
                        this.entities.push(new EnumEntityWrapper(enumView.entities[entity]));
                    }
                }
                return EnumViewWrapper;
            })();
            var SuffixFuncWrapper = (function () {
                function SuffixFuncWrapper(content) {
                    this.content = content;
                }
                return SuffixFuncWrapper;
            })();
            var PropertyViewWrapper = (function () {
                function PropertyViewWrapper(property) {
                    this.name = property.name;
                    this.isArray = property.isArray;
                    switch (property.type) {
                        case 'string':
                            this.type = "string";
                            if (IsFirstName(property.name))
                                this.type = "first";
                            if (IsSurname(property.name))
                                this.type = "last";
                            if (IsFullName(property.name))
                                this.type = "name";
                            if (IsWord(property.name))
                                this.type = "word";
                            if (IsSentence(property.name))
                                this.type = "sentence";
                            if (IsParagraph(property.name))
                                this.type = "paragraph";
                            if (IsStreet(property.name))
                                this.type = "street";
                            if (IsAdress(property.name))
                                this.type = "address";
                            if (IsCity(property.name))
                                this.type = "city";
                            if (IsState(property.name))
                                this.type = "state";
                            if (IsCountry(property.name))
                                this.type = "country";
                            if (IsZip(property.name))
                                this.type = "zip";
                            if (IsLatitude(property.name))
                                this.type = "latitude";
                            if (IsLongitude(property.name))
                                this.type = "longitude";
                            if (IsPhone(property.name))
                                this.type = "phone";
                            if (IsEmail(property.name))
                                this.type = "email";
                            if (IsUrl(property.name))
                                this.type = "url";
                            if (IsBirthday(property.name)) {
                                this.type = "birthday";
                                if (this.isArray) {
                                    this.suffixFunc = new SuffixFuncWrapper("map(function (value, index, array) { return value.toUTCString(); })");
                                }
                                else {
                                    this.suffixFunc = new SuffixFuncWrapper("toUTCString()");
                                }
                            }
                            if (IsDate(property.name)) {
                                this.type = "date";
                                if (this.isArray) {
                                    this.suffixFunc = new SuffixFuncWrapper("map(function (value, index, array) { return value.toUTCString(); })");
                                }
                                else {
                                    this.suffixFunc = new SuffixFuncWrapper("toUTCString()");
                                }
                            }
                            if (IsIdentifier(property.name))
                                this.type = "string";
                            break;
                        case 'boolean':
                            this.type = "bool";
                            break;
                        case 'number':
                            this.type = "integer";
                            break;
                        default:
                            this.type = property.type;
                            break;
                    }
                }
                return PropertyViewWrapper;
            })();
            var ModelViewWrapper = (function () {
                function ModelViewWrapper(model) {
                    this.name = model.name;
                    this.properties = [];
                    for (var _i = 0, _a = model.properties; _i < _a.length; _i++) {
                        var property = _a[_i];
                        this.properties.push(new PropertyViewWrapper(property));
                    }
                }
                return ModelViewWrapper;
            })();
            var ChanceViewWrapper = (function () {
                function ChanceViewWrapper(models, enums) {
                    this.models = [];
                    for (var modelIndex in models) {
                        this.models.push(new ModelViewWrapper(models[modelIndex]));
                    }
                    if (enums) {
                        this.enums = [];
                        for (var enumIndex in enums) {
                            this.enums.push(new EnumViewWrapper(enums[enumIndex]));
                        }
                    }
                }
                return ChanceViewWrapper;
            })();
            var ParameterViewWrapper = (function () {
                function ParameterViewWrapper(parameter) {
                    this.name = parameter.name;
                    this.type = parameter.type;
                    this.optional = parameter.optional;
                    this.description = parameter.description;
                    this.isNumber = (this.type == "number");
                }
                return ParameterViewWrapper;
            })();
            var ResponseWrapper = (function () {
                function ResponseWrapper(content) {
                    this.content = content;
                }
                return ResponseWrapper;
            })();
            var MethodViewWrapper = (function () {
                function MethodViewWrapper(method) {
                    this.operationId = method.operationId;
                    this.link = method.link;
                    this.httpVerb = method.httpVerb;
                    this.description = method.description;
                    switch (method.response) {
                        case 'string':
                            this.response = new ResponseWrapper("string");
                            break;
                        case 'boolean':
                            this.response = new ResponseWrapper("bool");
                            break;
                        case 'number':
                            this.response = new ResponseWrapper("integer");
                            break;
                        case 'any':
                            this.response = undefined;
                            break;
                        default:
                            this.response = new ResponseWrapper(method.response);
                            break;
                    }
                    if (method.bodyParameter) {
                        this.bodyParameter = new ParameterViewWrapper(method.bodyParameter);
                    }
                    this.pathParameters = [];
                    for (var _i = 0, _a = method.pathParameters; _i < _a.length; _i++) {
                        var pathParameter = _a[_i];
                        this.pathParameters.push(new ParameterViewWrapper(pathParameter));
                    }
                    this.queryParameters = [];
                    for (var _b = 0, _c = method.queryParameters; _b < _c.length; _b++) {
                        var queryParameter = _c[_b];
                        this.queryParameters.push(new ParameterViewWrapper(queryParameter));
                    }
                }
                return MethodViewWrapper;
            })();
            var ServiceViewWrapper = (function () {
                function ServiceViewWrapper(service) {
                    this.name = service.name;
                    this.methods = [];
                    for (var _i = 0, _a = service.methods; _i < _a.length; _i++) {
                        var method = _a[_i];
                        this.methods.push(new MethodViewWrapper(method));
                    }
                }
                return ServiceViewWrapper;
            })();
            var RenderedMock = (function () {
                function RenderedMock(content, contentOverride, chanceHelper, chanceOverride) {
                    this.content = content;
                    this.contentOverride = contentOverride;
                    this.chanceHelper = chanceHelper;
                    this.chanceOverride = chanceOverride;
                }
                return RenderedMock;
            })();
            Mocks.RenderedMock = RenderedMock;
            var MockTemplates = (function () {
                function MockTemplates(mockTemplate, mockOverrideTemplate, chanceTemplate, chanceOverrideTemplate) {
                    this.mockTemplate = mockTemplate;
                    this.mockOverrideTemplate = mockOverrideTemplate;
                    this.chanceTemplate = chanceTemplate;
                    this.chanceOverrideTemplate = chanceOverrideTemplate;
                }
                return MockTemplates;
            })();
            Mocks.MockTemplates = MockTemplates;
            var MockRenderer = (function () {
                function MockRenderer(templates) {
                    this.mockTemplate = templates.mockTemplate;
                    this.mockOverrideTemplate = templates.mockOverrideTemplate;
                    this.chanceTemplate = templates.chanceTemplate;
                    this.chanceOverrideTemplate = templates.chanceOverrideTemplate;
                }
                MockRenderer.prototype.RenderChanceHelper = function (models, enums) {
                    return Mustache.render(this.chanceTemplate, new ChanceViewWrapper(models, enums));
                };
                MockRenderer.prototype.RenderChanceHelperOverride = function (models) {
                    return Mustache.render(this.chanceOverrideTemplate, new ChanceViewWrapper(models));
                };
                MockRenderer.prototype.RenderMockContent = function (serviceView) {
                    return Mustache.render(this.mockTemplate, new ServiceViewWrapper(serviceView));
                };
                MockRenderer.prototype.RenderMockContentOverride = function (serviceView) {
                    return Mustache.render(this.mockOverrideTemplate, new ServiceViewWrapper(serviceView));
                };
                MockRenderer.prototype.RenderMock = function (component) {
                    return new RenderedMock(this.RenderMockContent(component.service), this.RenderMockContentOverride(component.service), this.RenderChanceHelper(component.models, component.enums), this.RenderChanceHelperOverride(component.models));
                };
                MockRenderer.prototype.RenderMocks = function (components) {
                    var result = [];
                    for (var _i = 0; _i < components.length; _i++) {
                        var component = components[_i];
                        result.push(this.RenderMock(component));
                    }
                    return result;
                };
                return MockRenderer;
            })();
            Mocks.MockRenderer = MockRenderer;
        })(Mocks = Renderers.Mocks || (Renderers.Mocks = {}));
    })(Renderers = SwaggerCodeGen.Renderers || (SwaggerCodeGen.Renderers = {}));
})(SwaggerCodeGen || (SwaggerCodeGen = {}));
var SwaggerCodeGen;
(function (SwaggerCodeGen) {
    var Renderers;
    (function (Renderers) {
        var Models;
        (function (Models) {
            var Mustache = require('mustache');
            var RenderedModel = (function () {
                function RenderedModel() {
                    this.enums = [];
                }
                return RenderedModel;
            })();
            Models.RenderedModel = RenderedModel;
            var ModelRenderer = (function () {
                function ModelRenderer(modelTemplate, enumRendererDefiner) {
                    if (enumRendererDefiner === void 0) { enumRendererDefiner = null; }
                    this.modelTemplate = modelTemplate;
                    if (typeof enumRendererDefiner === "string") {
                        this.enumRenderer = new Renderers.Enums.EnumRenderer(enumRendererDefiner);
                    }
                    else {
                        this.enumRenderer = enumRendererDefiner;
                    }
                    this.isRenderingEnums = (this.enumRenderer != null);
                }
                ModelRenderer.prototype.RenderModel = function (modelView) {
                    var result = new RenderedModel();
                    result.name = modelView.name;
                    result.content = Mustache.render(this.modelTemplate, modelView);
                    if (this.isRenderingEnums) {
                        result.enums = this.enumRenderer.RenderEnumCollection(modelView.enums);
                    }
                    return result;
                };
                ModelRenderer.prototype.RenderModels = function (modelViews) {
                    var result = [];
                    for (var i = 0; i < modelViews.length; i++) {
                        result.push(this.RenderModel(modelViews[i]));
                    }
                    return result;
                };
                ModelRenderer.prototype.RenderModelCollection = function (modelViews) {
                    var result = [];
                    for (var modelName in modelViews) {
                        result.push(this.RenderModel(modelViews[modelName]));
                    }
                    return result;
                };
                return ModelRenderer;
            })();
            Models.ModelRenderer = ModelRenderer;
        })(Models = Renderers.Models || (Renderers.Models = {}));
    })(Renderers = SwaggerCodeGen.Renderers || (SwaggerCodeGen.Renderers = {}));
})(SwaggerCodeGen || (SwaggerCodeGen = {}));
var SwaggerCodeGen;
(function (SwaggerCodeGen) {
    var Renderers;
    (function (Renderers) {
        var Services;
        (function (Services) {
            var Mustache = require('mustache');
            var RenderedService = (function () {
                function RenderedService() {
                    this.enums = [];
                }
                return RenderedService;
            })();
            Services.RenderedService = RenderedService;
            var ServiceRenderer = (function () {
                function ServiceRenderer(serviceTemplate, enumRendererDefiner) {
                    if (enumRendererDefiner === void 0) { enumRendererDefiner = null; }
                    this.serviceTemplate = serviceTemplate;
                    if (typeof enumRendererDefiner === "string") {
                        this.enumRenderer = new Renderers.Enums.EnumRenderer(enumRendererDefiner);
                    }
                    else {
                        this.enumRenderer = enumRendererDefiner;
                    }
                    this.isRenderingEnums = (this.enumRenderer != null);
                }
                ServiceRenderer.prototype.RenderService = function (serviceView) {
                    var result = new RenderedService();
                    result.name = serviceView.name;
                    result.content = Mustache.render(this.serviceTemplate, serviceView);
                    if (this.isRenderingEnums) {
                        result.enums = this.enumRenderer.RenderEnumCollection(serviceView.enums);
                    }
                    return result;
                };
                ServiceRenderer.prototype.RenderServices = function (serviceViews) {
                    var result = [];
                    for (var i = 0; i < serviceViews.length; i++) {
                        result.push(this.RenderService(serviceViews[i]));
                    }
                    return result;
                };
                ServiceRenderer.prototype.RenderServiceCollection = function (serviceViews) {
                    var result = [];
                    for (var serviceName in serviceViews) {
                        result.push(this.RenderService(serviceViews[serviceName]));
                    }
                    return result;
                };
                return ServiceRenderer;
            })();
            Services.ServiceRenderer = ServiceRenderer;
        })(Services = Renderers.Services || (Renderers.Services = {}));
    })(Renderers = SwaggerCodeGen.Renderers || (SwaggerCodeGen.Renderers = {}));
})(SwaggerCodeGen || (SwaggerCodeGen = {}));
module.exports = SwaggerCodeGen;
