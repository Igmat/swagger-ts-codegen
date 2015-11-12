import Mustache = require('mustache');
import Enums = require("./enumRenderer");
import Generators = require("./../generators");

export class RenderedModel {
    public name: string;
    public content: string;
    public enums: Enums.RenderedEnum[];

    constructor() {
        this.enums = [];
    }
}

export class ModelRenderer {
    private isRenderingEnums: boolean;
    private enumRenderer: Enums.EnumRenderer;

    constructor(
        private modelTemplate: string,
        enumRendererDefiner: Enums.EnumRenderer | string = null) {
        if (typeof enumRendererDefiner === "string") {
            this.enumRenderer = new Enums.EnumRenderer(enumRendererDefiner);
        } else {
            this.enumRenderer = enumRendererDefiner;
        }
        this.isRenderingEnums = (this.enumRenderer != null);
    }

    public RenderModel(modelView: Generators.Models.ModelView): RenderedModel {
        var result = new RenderedModel();
        result.name = modelView.name;
        result.content = Mustache.render(this.modelTemplate, modelView);
        if (this.isRenderingEnums) {
            result.enums = this.enumRenderer.RenderEnumCollection(modelView.enums);
        }

        return result;
    }

    public RenderModels(modelViews: Generators.Models.ModelView[]): RenderedModel[] {
        var result: RenderedModel[] = [];
        for (let i = 0; i < modelViews.length; i++) {
            result.push(this.RenderModel(modelViews[i]));
        }
        return result;
    }

    public RenderModelCollection(modelViews: Generators.Models.ModelViewCollection): RenderedModel[] {
        var result: RenderedModel[] = [];
        for (var modelName in modelViews) {
            result.push(this.RenderModel(modelViews[modelName]));
        }
        return result;
    }
}