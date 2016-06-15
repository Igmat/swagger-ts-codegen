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
            }());
            Component.RenderedComponent = RenderedComponent;
            var RenderedComponents = (function () {
                function RenderedComponents() {
                    this.Components = [];
                }
                return RenderedComponents;
            }());
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
            }());
            Component.ComponentRenderer = ComponentRenderer;
        })(Component = Renderers.Component || (Renderers.Component = {}));
    })(Renderers = SwaggerCodeGen.Renderers || (SwaggerCodeGen.Renderers = {}));
})(SwaggerCodeGen || (SwaggerCodeGen = {}));
//# sourceMappingURL=componentRenderer.js.map