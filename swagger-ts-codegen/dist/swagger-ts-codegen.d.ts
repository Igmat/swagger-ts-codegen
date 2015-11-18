declare module 'swagger-ts-codegen/app' {

 module SwaggerCodeGen {

    var modelTemplate: string;

    var enumTemplate: string;

    var serviceTemplate: string;

}

export = SwaggerCodeGen; module SwaggerCodeGen.Generators.Enums {

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

} module SwaggerCodeGen.Generators.Models {

    class ModelView {

        name: string;

        properties: PropertyView[];

        enums: Enums.EnumViewCollection;

        linkedModels: string[];

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

} module SwaggerCodeGen.Generators.Services {

    class ParameterView {

        name: string;

        type: string;

        optional: boolean;

        description: string;

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

} module SwaggerCodeGen.Renderers.Component {

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

} module SwaggerCodeGen.Renderers.Enums {

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

} module SwaggerCodeGen.Renderers.Models {

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

} module SwaggerCodeGen.Renderers.Services {

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

}
declare module 'swagger-ts-codegen' {

import main = require('swagger-ts-codegen/app');

export = main;
}
