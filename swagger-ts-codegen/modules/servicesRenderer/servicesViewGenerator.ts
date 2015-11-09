import enumRenderer = require("./../enumRenderer/enumRenderer");

export class ServiceViewCollection {
    [serviceName: string]: ServiceView;
    constructor() {
    }
}

export class ServiceView {
    public name: string;
    public methods: MethodView[];
    public enums: enumRenderer.Generator.EnumView[];

    constructor() {
        this.methods = [];
        this.enums = [];
    }
}

export class MethodView {
    public operationId: string;
    public link: string;
    public httpVerb: string;
    public description: string;
    public pathParameters: ParameterView[];
    public queryParameters: ParameterView[];
    public bodyParameter: ParameterView;
    public response: string;

    constructor() {
        this.pathParameters = [];
        this.queryParameters = [];
    }
}

export class ParameterView {
    public name: string;
    public type: string;
    public optional: boolean;

    constructor() {
    }
}

//internal class for working with inlined enums TODO: remove code smell
class MethodAndEnums {
    public method: MethodView;
    public enums: enumRenderer.Generator.EnumView[];

    constructor() {
        this.enums = [];
    }
}

export function GenerateServiceViews(paths: { [pathName: string]: Swagger.Path }): ServiceViewCollection {
    var serviceViews: ServiceViewCollection = new ServiceViewCollection();
    for (var pathName in paths) {
        var path = paths[pathName];
        if (path.get) {
            checkService(serviceViews, path.get, pathName, "get");
        }
        if (path.post) {
            checkService(serviceViews, path.post, pathName, "post");
        }
        if (path.put) {
            checkService(serviceViews, path.put, pathName, "put");
        }
        if (path.delete) {
            checkService(serviceViews, path.delete, pathName, "delete");
        }
    }
    return serviceViews;
}

function checkService(serviceViews: ServiceViewCollection, operation: Swagger.Operation, link: string, httpVerb: string): void {
    var serviceName = operation.tags[0];
    //we are using first tag of operation to group operations from different paths into one service
    if (serviceViews[serviceName]) {
        //process operation
        var methodAndEnums = makeMethod(httpVerb, link, operation);
        //Adding a method
        serviceViews[serviceName].methods.push(methodAndEnums.method);
        //Adding all founded enums to servcie TODO: check for duplicates
        methodAndEnums.enums.forEach((value: enumRenderer.Generator.EnumView) => {
            serviceViews[serviceName].enums.push(value);
        });
    } else {
        //Adding new service
        serviceViews[serviceName] = new ServiceView();
        serviceViews[serviceName].name = serviceName;
        //process operation
        var methodAndEnums = makeMethod(httpVerb, link, operation);
        //Adding a method
        serviceViews[serviceName].methods.push(methodAndEnums.method);
        //Adding all founded enums to servcie TODO: check for duplicates
        methodAndEnums.enums.forEach((value: enumRenderer.Generator.EnumView) => {
            serviceViews[serviceName].enums.push(value);
        });
    }
}

function makeMethod(httpVerb: string, link: string, operation: Swagger.Operation): MethodAndEnums {
    var result = new MethodAndEnums();
    var methodView = new MethodView();
    methodView.httpVerb = httpVerb.toUpperCase();
    methodView.link = link;
    methodView.operationId = operation.operationId.replace(/\./g, '');//workaround for ids with dot, but it could be wrong swagger generation or may need more work
    methodView.description = operation.description;
    
    if (operation.parameters) {
        for (var i = 0; i < operation.parameters.length; i++) {//checking all parameters
            var parameter = operation.parameters[i];
            var parameterView = new ParameterView();
            parameterView.name = parameter.name;

            switch (parameter.in) {

                case 'body':
                    if (parameter.schema.$ref) {//for reference types
                        parameterView.type = parameter.schema.$ref.slice("#/definitions/".length);
                    } else {
                        if (parameter.schema.enum) {//for inline enum
                            var enumView = enumRenderer.Generator.GenerateEnumView(parameter.name + "Enum", parameter.schema.enum);
                            parameterView.type = enumView.name;
                            result.enums.push(enumView);
                        } else {//TODO: add support for primitives if needed
                            throw new Error("Unsupported type of body parameter");
                        }
                    }
                    parameterView.optional = !parameter.required;
                    methodView.bodyParameter = parameterView;
                    break;

                case 'path':
                    if (parameter.enum) {//for inline enum
                        var enumView = enumRenderer.Generator.GenerateEnumView(parameter.name + "Enum", parameter.enum);
                        parameterView.type = enumView.name;
                        result.enums.push(enumView);
                    } else {
                        //TODO: may be reference type are needed (for example: defined enums(but they could have string type))
                        switch (parameter.type) {//for primitives
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
                    parameterView.optional = false;//path parametrs always are required
                    methodView.pathParameters.push(parameterView);
                    break;

                case 'query':
                    if (parameter.enum) {//for inline enum
                        var enumView = enumRenderer.Generator.GenerateEnumView(parameter.name + "Enum", parameter.enum);
                        parameterView.type = enumView.name;
                        result.enums.push(enumView);
                    } else {
                        //TODO: may be reference type are needed (for example: defined enums(but they could have string type))
                        switch (parameter.type) {//for primitives
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
                    parameterView.optional = !parameter.required;//I am not sure that our logic is affected if query parameter is required TODO: check it
                    methodView.queryParameters.push(parameterView);
                    break;
                default://TODO: add support for formData
                    throw new Error("Unsupported parameter appearance");
            }
        }
    }

    //RESPONSES
    if (operation.responses) {
        for (var shema in operation.responses) {
            var typeRef = operation.responses[shema];
            if (typeRef.schema) {
                if (typeRef.schema.$ref) {
                    methodView.response = typeRef.schema.$ref.slice("#/definitions/".length);
                } else {
                    console.log("REFA NETy");
                }
            }
        }
    }
    result.method = methodView;

    return result;
}