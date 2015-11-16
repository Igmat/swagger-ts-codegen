/// <reference path="../Scripts/typings/swagger/swagger.d.ts" />
/// <reference path="../typings/tsd.d.ts" />
declare module SwaggerCodeGen {
    var modelTemplate: string;
    var enumTemplate: string;
    var serviceTemplate: string;
}
declare module SwaggerCodeGen.Generators.Enums {
    class EnumView {
        name: string;
        length: number;
        entities: {
            [entityName: string]: string;
        };
        Equals(another: EnumView): boolean;
        constructor();
    }
    class EnumViewCollection {
        [enumName: string]: EnumView;
        constructor();
    }
    class EnumGenerator {
        enums: EnumViewCollection;
        constructor();
        GenerateEnum(name: string, content: [string | boolean | number | Object], optionalPrefix: string): EnumView;
    }
}
declare module SwaggerCodeGen.Generators.Models {
    class ModelView {
        name: string;
        properties: PropertyView[];
        enums: Enums.EnumViewCollection;
        constructor();
    }
    class ModelViewCollection {
        [ModelName: string]: ModelView;
        constructor();
    }
    class PropertyView {
        name: string;
        description: string;
        type: string;
        isArray: boolean;
        constructor();
    }
    class ModelGenerator {
        private enumGenerator;
        constructor(enumGenerator?: Enums.EnumGenerator);
        GenerateModel(name: string, definition: Swagger.Schema): ModelView;
        GenerateModelCollection(definitions: {
            [definitionsName: string]: Swagger.Schema;
        }): ModelViewCollection;
    }
}
declare module SwaggerCodeGen.Generators.Services {
    class ParameterView {
        name: string;
        type: string;
        optional: boolean;
        constructor();
    }
    class MethodView {
        operationId: string;
        link: string;
        httpVerb: string;
        description: string;
        pathParameters: ParameterView[];
        queryParameters: ParameterView[];
        bodyParameter: ParameterView;
        response: string;
        constructor();
    }
    class ServiceView {
        name: string;
        methods: MethodView[];
        enums: Enums.EnumViewCollection;
        constructor();
    }
    class ServiceViewCollection {
        [serviceName: string]: ServiceView;
        constructor();
    }
    class Component {
        name: string;
        service: ServiceView;
        models: Models.ModelViewCollection;
        enums: Enums.EnumViewCollection;
        constructor();
    }
    class ServiceGenerator {
        private enumGenerator;
        private modelGenerator;
        constructor(enumGenerator?: Enums.EnumGenerator, modelGenerator?: Models.ModelGenerator);
        GenerateComponents(swagger: Swagger.Spec): Component[];
        GenerateServiceViews(paths: {
            [pathName: string]: Swagger.Path;
        }): ServiceViewCollection;
        private generateMethod(httpVerb, link, operation);
    }
}
declare module SwaggerCodeGen.Renderers.Component {
    class RenderedComponent {
        name: string;
        enums: Enums.RenderedEnum[];
        models: Models.RenderedModel[];
        service: Services.RenderedService;
        constructor();
    }
    class ComponentRenderer {
        private enumRenderer;
        private modelRenderer;
        private serviceRenderer;
        constructor(enumRendererDefiner: Enums.EnumRenderer | string, modelRendererDefiner: Models.ModelRenderer | string, serviceRendererDefiner: Services.ServiceRenderer | string);
        RenderComponent(componentView: Generators.Services.Component): RenderedComponent;
        RenderComponents(componentViews: Generators.Services.Component[]): RenderedComponent[];
    }
}
declare module SwaggerCodeGen.Renderers.Enums {
    class RenderedEnum {
        name: string;
        content: string;
        constructor();
    }
    class EnumRenderer {
        private enumTemplate;
        constructor(enumTemplate: string);
        RenderEnum(enumView: Generators.Enums.EnumView): RenderedEnum;
        RenderEnums(enumViews: Generators.Enums.EnumView[]): RenderedEnum[];
        RenderEnumCollection(enumViews: Generators.Enums.EnumViewCollection): RenderedEnum[];
    }
}
declare module SwaggerCodeGen.Renderers.Models {
    class RenderedModel {
        name: string;
        content: string;
        enums: Enums.RenderedEnum[];
        constructor();
    }
    class ModelRenderer {
        private modelTemplate;
        private isRenderingEnums;
        private enumRenderer;
        constructor(modelTemplate: string, enumRendererDefiner?: Enums.EnumRenderer | string);
        RenderModel(modelView: Generators.Models.ModelView): RenderedModel;
        RenderModels(modelViews: Generators.Models.ModelView[]): RenderedModel[];
        RenderModelCollection(modelViews: Generators.Models.ModelViewCollection): RenderedModel[];
    }
}
declare module SwaggerCodeGen.Renderers.Services {
    class RenderedService {
        name: string;
        content: string;
        enums: Enums.RenderedEnum[];
        constructor();
    }
    class ServiceRenderer {
        private serviceTemplate;
        private isRenderingEnums;
        private enumRenderer;
        constructor(serviceTemplate: string, enumRendererDefiner?: Enums.EnumRenderer | string);
        RenderService(serviceView: Generators.Services.ServiceView): RenderedService;
        RenderServices(serviceViews: Generators.Services.ServiceView[]): RenderedService[];
        RenderServiceCollection(serviceViews: Generators.Services.ServiceViewCollection): RenderedService[];
    }
}
