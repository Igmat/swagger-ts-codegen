"use strict";
var Mustache = require('mustache');
var enumRenderer_1 = require('./enumRenderer');
var modelRenderer_1 = require('./modelRenderer');
var serviceRenderer_1 = require('./serviceRenderer');
var mockRenderer_1 = require('./mockRenderer');
var Component;
(function (Component) {
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
                this.enumRenderer = new enumRenderer_1.Enums.EnumRenderer(enumRendererDefiner);
            }
            else {
                this.enumRenderer = enumRendererDefiner;
            }
            if (typeof modelRendererDefiner === "string") {
                this.modelRenderer = new modelRenderer_1.Models.ModelRenderer(modelRendererDefiner);
            }
            else {
                this.modelRenderer = modelRendererDefiner;
            }
            if (typeof serviceRendererDefiner === "string") {
                this.serviceRenderer = new serviceRenderer_1.Services.ServiceRenderer(serviceRendererDefiner);
            }
            else {
                this.serviceRenderer = serviceRendererDefiner;
            }
            if (mockRendererDefiner instanceof mockRenderer_1.Mocks.MockRenderer) {
                this.mockRenderer = mockRendererDefiner;
            }
            else {
                this.mockRenderer = new mockRenderer_1.Mocks.MockRenderer(mockRendererDefiner);
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
})(Component = exports.Component || (exports.Component = {}));
//# sourceMappingURL=componentRenderer.js.map