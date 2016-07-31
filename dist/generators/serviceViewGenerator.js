"use strict";
var enumViewGenerator_1 = require('./enumViewGenerator');
var modelViewGenerator_1 = require('./modelViewGenerator');
var ServiceGeneration;
(function (ServiceGeneration) {
    var ParameterView = (function () {
        function ParameterView() {
        }
        return ParameterView;
    }());
    ServiceGeneration.ParameterView = ParameterView;
    var MethodView = (function () {
        function MethodView() {
            this.pathParameters = [];
            this.queryParameters = [];
        }
        return MethodView;
    }());
    ServiceGeneration.MethodView = MethodView;
    var ServiceView = (function () {
        function ServiceView() {
            this.methods = [];
            this.enums = new enumViewGenerator_1.EnumGeneration.EnumViewCollection;
        }
        return ServiceView;
    }());
    ServiceGeneration.ServiceView = ServiceView;
    var ServiceViewCollection = (function () {
        function ServiceViewCollection() {
        }
        return ServiceViewCollection;
    }());
    ServiceGeneration.ServiceViewCollection = ServiceViewCollection;
    var Component = (function () {
        function Component() {
            this.models = new modelViewGenerator_1.ModelGeneration.ModelViewCollection();
            this.enums = new enumViewGenerator_1.EnumGeneration.EnumViewCollection;
        }
        return Component;
    }());
    ServiceGeneration.Component = Component;
    var MethodAndEnums = (function () {
        function MethodAndEnums() {
            this.enums = new enumViewGenerator_1.EnumGeneration.EnumViewCollection;
        }
        return MethodAndEnums;
    }());
    var ServiceGenerator = (function () {
        function ServiceGenerator(enumGenerator, modelGenerator) {
            if (enumGenerator === void 0) { enumGenerator = new enumViewGenerator_1.EnumGeneration.EnumGenerator(); }
            if (modelGenerator === void 0) { modelGenerator = new modelViewGenerator_1.ModelGeneration.ModelGenerator(enumGenerator); }
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
                    if (method.response != 'string' &&
                        method.response != 'number' &&
                        method.response != 'boolean' &&
                        method.response != 'any') {
                        var model = models[method.response];
                        var singleEnum = this.enumGenerator.enums[method.response];
                        if (!model && !singleEnum)
                            throw new Error('There is no Enum or Model with name ' + method.response + ' for method: ' + component.name + '.' + method.operationId);
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
                        if (method.bodyParameter.type != 'string' &&
                            method.bodyParameter.type != 'number' &&
                            method.bodyParameter.type != 'boolean' &&
                            method.bodyParameter.type != 'any') {
                            var model = models[method.bodyParameter.type];
                            var singleEnum = this.enumGenerator.enums[method.bodyParameter.type];
                            if (!model && !singleEnum)
                                throw new Error('There is no Enum or Model with name ' + method.bodyParameter.type + ' for method: ' + component.name + '.' + method.operationId);
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
                        if (parameter.type != 'string' &&
                            parameter.type != 'number' &&
                            parameter.type != 'boolean' &&
                            parameter.type != 'any') {
                            var model = models[parameter.type];
                            var singleEnum = this.enumGenerator.enums[parameter.type];
                            if (!model && !singleEnum)
                                throw new Error('There is no Enum or Model with name ' + parameter.type + ' for method: ' + component.name + '.' + method.operationId);
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
                        if (parameter.type != 'string' &&
                            parameter.type != 'number' &&
                            parameter.type != 'boolean' &&
                            parameter.type != 'any') {
                            var model = models[parameter.type];
                            var singleEnum = this.enumGenerator.enums[parameter.type];
                            if (!model && !singleEnum)
                                throw new Error('There is no Enum or Model with name' + parameter.type + ' for method: ' + component.name + '.' + method.operationId);
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
                    if (key != '$ref' && key != 'parameters') {
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
                                parameterView.type = parameter.schema.$ref.slice('#/definitions/'.length);
                            }
                            else {
                                if (parameter.schema.enum) {
                                    var enumView = this.enumGenerator.GenerateEnum(parameter.name, parameter.schema.enum, methodView.operationId);
                                    parameterView.type = enumView.name;
                                    result.enums[enumView.name] = enumView;
                                }
                                else {
                                    switch (parameter.schema.type) {
                                        case 'boolean':
                                            parameterView.type = 'boolean';
                                            break;
                                        case 'string':
                                            parameterView.type = 'string';
                                            break;
                                        case 'number':
                                            parameterView.type = 'number';
                                            break;
                                        case 'integer':
                                            parameterView.type = 'number';
                                            break;
                                        default:
                                            throw new Error('Unsupported type of body parameter');
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
                                    case 'boolean':
                                        parameterView.type = 'boolean';
                                        break;
                                    case 'string':
                                        parameterView.type = 'string';
                                        break;
                                    case 'number':
                                        parameterView.type = 'number';
                                        break;
                                    case 'integer':
                                        parameterView.type = 'number';
                                        break;
                                    default:
                                        throw new Error('Unsupported type of path parameter');
                                }
                            }
                            parameterView.optional = false;
                            methodView.pathParameters.push(parameterView);
                            break;
                        case 'query':
                            if (parameter.schema && parameter.schema.$ref) {
                                parameterView.type = parameter.schema.$ref.slice('#/definitions/'.length);
                            }
                            else {
                                if (parameter.enum) {
                                    var enumView = this.enumGenerator.GenerateEnum(parameter.name, parameter.enum, methodView.operationId);
                                    parameterView.type = enumView.name;
                                    result.enums[enumView.name] = enumView;
                                }
                                else {
                                    switch (parameter.type) {
                                        case 'boolean':
                                            parameterView.type = 'boolean';
                                            break;
                                        case 'string':
                                            parameterView.type = 'string';
                                            break;
                                        case 'number':
                                            parameterView.type = 'number';
                                            break;
                                        case 'integer':
                                            parameterView.type = 'number';
                                            break;
                                        default:
                                            throw new Error('Unsupported type of query parameter');
                                    }
                                }
                            }
                            parameterView.optional = !parameter.required;
                            methodView.queryParameters.push(parameterView);
                            break;
                        default:
                            throw new Error('Unsupported parameter appearance');
                    }
                }
            }
            if (operation.responses) {
                for (var responseName in operation.responses) {
                    var response = operation.responses[responseName];
                    if (response.schema) {
                        if (response.schema.$ref) {
                            methodView.response = response.schema.$ref.slice('#/definitions/'.length);
                        }
                        else {
                            switch (response.schema.type) {
                                case 'boolean':
                                    methodView.response = 'boolean';
                                    break;
                                case 'string':
                                    methodView.response = 'string';
                                    break;
                                case 'number':
                                    methodView.response = 'number';
                                    break;
                                case 'integer':
                                    methodView.response = 'number';
                                    break;
                                default:
                                    throw new Error('Unsupported type of response');
                            }
                        }
                    }
                    else {
                        methodView.response = 'any';
                    }
                }
            }
            result.method = methodView;
            return result;
        };
        return ServiceGenerator;
    }());
    ServiceGeneration.ServiceGenerator = ServiceGenerator;
})(ServiceGeneration = exports.ServiceGeneration || (exports.ServiceGeneration = {}));
//# sourceMappingURL=serviceViewGenerator.js.map