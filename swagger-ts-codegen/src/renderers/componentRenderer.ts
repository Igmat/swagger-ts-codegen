module SwaggerCodeGen.Renderers.Component {

    export class RenderedComponent {
        public name: string;
        public enums: Enums.RenderedEnum[];
        public models: Models.RenderedModel[];
        public service: Services.RenderedService;
        public mocks: Mocks.RenderedMock;

        constructor() {
            this.enums = [];
            this.models = [];
        }
    }

    export class ComponentRenderer {
        private enumRenderer: Enums.EnumRenderer;
        private modelRenderer: Models.ModelRenderer;
        private serviceRenderer: Services.ServiceRenderer;
        private mockRenderer: Mocks.MockRenderer;

        constructor(
            enumRendererDefiner: Enums.EnumRenderer | string,
            modelRendererDefiner: Models.ModelRenderer | string,
            serviceRendererDefiner: Services.ServiceRenderer | string,
            mockRendererDefiner: Mocks.MockRenderer | Mocks.MockTemplates) {
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

            if (mockRendererDefiner instanceof Mocks.MockRenderer) {
                this.mockRenderer = mockRendererDefiner;
            } else {
                this.mockRenderer = new Mocks.MockRenderer(<Mocks.MockTemplates>mockRendererDefiner);
            }
        }

        public RenderComponent(componentView: Generators.Services.Component): RenderedComponent {
            var result = new RenderedComponent();
            result.name = componentView.name;
            result.service = this.serviceRenderer.RenderService(componentView.service);
            result.mocks = this.mockRenderer.RenderMock(componentView);
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
}
