import enumRenderer = require("./../enumRenderer/enumRenderer");

export class ServiceViewCollection {
    [serviceName: string]: ServiceView;
    constructor() {
    }
}

export class ServiceView {
    public name: string;
    public methods: MethodView[];
    constructor() {
        this.methods = [];
    }
}

export class MethodView {
    public operationId: string;
    public link: string;
    public httpVerb: string;
    public description: string;
    public parameters: ParameterView[];
    public deprecated: boolean;
    public responses: string;
    public in: string;
    constructor() {
        this.parameters = [];
    }
}
export class ParameterView {
    public name: string;
    public type: string;
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
    if (serviceViews[serviceName]) {
        serviceViews[serviceName].methods.push(makeMethod(httpVerb, link, operation));
    } else {
        serviceViews[serviceName] = new ServiceView();
        serviceViews[serviceName].name = serviceName;
        serviceViews[serviceName].methods.push(makeMethod(httpVerb, link, operation));
    }
}
function makeMethod(httpVerb: string, link: string, operation: Swagger.Operation): MethodView {
    console.log('lol ' + httpVerb + ' ' + link + ' ' + operation.operationId);
    var methodView: MethodView = new MethodView();
    methodView.httpVerb = httpVerb;
    methodView.link = link;
    methodView.operationId = operation.operationId.replace(/\./g, '');  
    methodView.description = operation.description;
    methodView.deprecated = operation.deprecated;
    
    if (operation.parameters) {
        for (var i = 0; i < operation.parameters.length; i++) { // ходим  по всем параметрам  в методе 
            var parameter = operation.parameters[i];
            var parameterView = new ParameterView();
            parameterView.name = parameter.name;

            // ≈сли у нас переменна€ типа body
            
            if (parameter.in == 'body') {
                if (parameter.schema.$ref) { // проверка есть  лы у шема реф
                    parameterView.type = parameter.schema.$ref.slice("#/definitions/".length).replace(/\./g, '');
                } else {
                    if (parameter.schema.enum) {   // енами   в шема
                        var enumView = enumRenderer.Generator.GenerateEnumView(parameter.name + "Enum   ", parameter.schema.enum);
                        parameterView.type = enumView.name;
                        parameterView.enums.push(enumView);
                       } else { }
                }
                if (parameter.required == true) { // required  true
                    parameterView.name = parameter.name;
                } else {                          // required false
                    parameterView.name = parameter.name + '?';
                }

               // ≈сли  body то  мы  тут  должны  провер€ть 

            } else {
                if (parameter.enum) { // если у параметра  есть  енам 
                    var enumView = enumRenderer.Generator.GenerateEnumView(parameter.name + "Enum  ", parameter.enum);

                    parameterView.type = enumView.name;
                    parameterView.enums.push(enumView);
                } else { // просто й тип параметра
                    parameterView.type = parameter.type;
                }
                if (parameter.required == true) {
                    parameterView.name = parameter.name;
                } else {
                    parameterView.name = parameter.name + '?';
                }
            }
            // ≈сли у нас переменна€ типа PATH
            if (parameter.in == 'path') {

            }
            // ≈сли у нас переменна€ типа query
            if (parameter.in == 'query') {

            }
       
            methodView.parameters.push(parameterView);
        }

      // RESPONSES

      if (operation.responses) {
          for (var shema in operation.responses) {
              var typeRef = operation.responses[shema];
              if (typeRef.schema) {
                  if (typeRef.schema.$ref) {
                      methodView.responses = ': ng.IHttpPromise<' + typeRef.schema.$ref.slice("#/definitions/".length) + '>';
                  } else {
                      console.log("REFA NETy");
                  }
              }
          }
        } else {
            console.log('NO RESPONSE');
        }

    } else {
        console.log('≈сли нету параметров')
    }


   // parametersView = operation.parameters;
    return methodView;
}