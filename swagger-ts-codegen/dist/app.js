/// <reference path="../Scripts/typings/swagger/swagger.d.ts" />
/// <reference path="../typings/tsd.d.ts" />
var SwaggerCodeGen;
(function (SwaggerCodeGen) {
    var fs = require('fs');
    var modelTemplatePath = __dirname + '/../templates/model.mustache';
    var enumTemplatePath = __dirname + '/../templates/enum.mustache';
    var serviceTemplatePath = __dirname + '/../templates/service.mustache';
    SwaggerCodeGen.modelTemplate = fs.readFileSync(modelTemplatePath, 'UTF-8');
    SwaggerCodeGen.enumTemplate = fs.readFileSync(enumTemplatePath, 'UTF-8');
    SwaggerCodeGen.serviceTemplate = fs.readFileSync(serviceTemplatePath, 'UTF-8');
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
                        propertyView.type = propertyDesc.type;
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
                                    throw new Error("There is no Enum or Model with name" + method.response);
                                if (model) {
                                    component.models[model.name] = model;
                                    for (var enumName in model.enums) {
                                        component.enums[enumName] = model.enums[enumName];
                                    }
                                }
                                if (singleEnum) {
                                    component.enums[method.response] = singleEnum;
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
                                        throw new Error("There is no Enum or Model with name" + parameter.type);
                                    if (model) {
                                        component.models[model.name] = model;
                                        for (var enumName in model.enums) {
                                            component.enums[enumName] = model.enums[enumName];
                                        }
                                    }
                                    if (singleEnum) {
                                        component.enums[method.response] = singleEnum;
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
                                        throw new Error("There is no Enum or Model with name" + parameter.type);
                                    if (model) {
                                        component.models[model.name] = model;
                                        for (var enumName in model.enums) {
                                            component.enums[enumName] = model.enums[enumName];
                                        }
                                    }
                                    if (singleEnum) {
                                        component.enums[method.response] = singleEnum;
                                    }
                                }
                            }
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
                    methodView.operationId = operation.operationId.replace(/\./g, '');
                    methodView.description = operation.description;
                    if (operation.parameters) {
                        for (var i = 0; i < operation.parameters.length; i++) {
                            var parameter = operation.parameters[i];
                            var parameterView = new ParameterView();
                            parameterView.name = parameter.name;
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
                                            throw new Error("Unsupported type of body parameter");
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
                                    if (parameter.enum) {
                                        var enumView = this.enumGenerator.GenerateEnum(parameter.name, parameter.enum, methodView.operationId);
                                        parameterView.type = enumView.name;
                                        result.enums[enumView.name] = enumView;
                                    }
                                    else {
                                        switch (parameter.type) {
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
                                    parameterView.optional = !parameter.required;
                                    methodView.queryParameters.push(parameterView);
                                    break;
                                default:
                                    throw new Error("Unsupported parameter appearance");
                            }
                        }
                    }
                    if (operation.responses) {
                        for (var shema in operation.responses) {
                            var typeRef = operation.responses[shema];
                            if (typeRef.schema) {
                                if (typeRef.schema.$ref) {
                                    methodView.response = typeRef.schema.$ref.slice("#/definitions/".length);
                                }
                                else {
                                    methodView.response = "any";
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
            var RenderedComponent = (function () {
                function RenderedComponent() {
                    this.enums = [];
                    this.models = [];
                }
                return RenderedComponent;
            })();
            Component.RenderedComponent = RenderedComponent;
            var ComponentRenderer = (function () {
                function ComponentRenderer(enumRendererDefiner, modelRendererDefiner, serviceRendererDefiner) {
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
                }
                ComponentRenderer.prototype.RenderComponent = function (componentView) {
                    var result = new RenderedComponent();
                    result.name = componentView.name;
                    result.service = this.serviceRenderer.RenderService(componentView.service);
                    result.models = this.modelRenderer.RenderModelCollection(componentView.models);
                    result.enums = this.enumRenderer.RenderEnumCollection(componentView.enums);
                    return result;
                };
                ComponentRenderer.prototype.RenderComponents = function (componentViews) {
                    var result = [];
                    for (var i = 0; i < componentViews.length; i++) {
                        result.push(this.RenderComponent(componentViews[i]));
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
