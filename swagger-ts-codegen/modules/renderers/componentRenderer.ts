import Mustache = require('mustache');
import Enums = require("./enumRenderer");
import Models = require("./modelRenderer");
import Services = require("./serviceRenderer");
import Generators = require("./../generators");

export class RenderedComponent {
    public name: string;
    public enums: Enums.RenderedEnum[];
    public models: Models.RenderedModel[];
    public service: Services.RenderedService;

    constructor() {
        this.enums = [];
        this.models = [];
    }
}

export class ComponentRenderer {
    private enumRenderer: Enums.EnumRenderer;
    private modelRenderer: Models.ModelRenderer
    private serviceRenderer: Services.ServiceRenderer

    constructor(
        enumRendererDefiner: Enums.EnumRenderer | string,
        modelRendererDefiner: Models.ModelRenderer | string,
        serviceRendererDefiner: Services.ServiceRenderer | string) {
        if (typeof enumRendererDefiner === "string") {
            this.enumRenderer = new Enums.EnumRenderer(enumRendererDefiner);
        } else {
            this.enumRenderer = enumRendererDefiner;
        }

        if (typeof modelRendererDefiner === "string") {
            this.modelRenderer = new Models.ModelRenderer(modelRendererDefiner);
        } else {
            this.modelRenderer = modelRendererDefiner;
        }

        if (typeof serviceRendererDefiner === "string") {
            this.serviceRenderer = new Services.ServiceRenderer(serviceRendererDefiner);
        } else {
            this.serviceRenderer = serviceRendererDefiner;
        }
    }

    public RenderComponent(componentView: Generators.Services.Component): RenderedComponent {
        var result = new RenderedComponent();
        result.name = componentView.name;
        result.service = this.serviceRenderer.RenderService(componentView.service);
        result.models = this.modelRenderer.RenderModelCollection(componentView.models);
        result.enums = this.enumRenderer.RenderEnumCollection(componentView.enums);

        return result;
    }

    public RenderComponents(componentViews: Generators.Services.Component[]): RenderedComponent[] {
        var result: RenderedComponent[] = [];
        for (let i = 0; i < componentViews.length; i++) {
            result.push(this.RenderComponent(componentViews[i]));
        }
        return result;
    }
}