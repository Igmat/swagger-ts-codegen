"use strict";
var Mustache = require('mustache');
var enumRenderer_1 = require('./enumRenderer');
var Models;
(function (Models) {
    var RenderedModel = (function () {
        function RenderedModel() {
            this.enums = [];
        }
        return RenderedModel;
    }());
    Models.RenderedModel = RenderedModel;
    var ModelRenderer = (function () {
        function ModelRenderer(modelTemplate, enumRendererDefiner) {
            if (enumRendererDefiner === void 0) { enumRendererDefiner = null; }
            this.modelTemplate = modelTemplate;
            if (typeof enumRendererDefiner === "string") {
                this.enumRenderer = new enumRenderer_1.Enums.EnumRenderer(enumRendererDefiner);
            }
            else {
                this.enumRenderer = enumRendererDefiner;
            }
            this.isRenderingEnums = (this.enumRenderer != null);
        }
        ModelRenderer.prototype.RenderModel = function (modelView) {
            var result = new RenderedModel();
            result.name = modelView.name;
            result.content = Mustache.render(this.modelTemplate, modelView);
            if (this.isRenderingEnums) {
                result.enums = this.enumRenderer.RenderEnumCollection(modelView.enums);
            }
            return result;
        };
        ModelRenderer.prototype.RenderModels = function (modelViews) {
            var result = [];
            for (var i = 0; i < modelViews.length; i++) {
                result.push(this.RenderModel(modelViews[i]));
            }
            return result;
        };
        ModelRenderer.prototype.RenderModelCollection = function (modelViews) {
            var result = [];
            for (var modelName in modelViews) {
                result.push(this.RenderModel(modelViews[modelName]));
            }
            return result;
        };
        return ModelRenderer;
    }());
    Models.ModelRenderer = ModelRenderer;
})(Models = exports.Models || (exports.Models = {}));
//# sourceMappingURL=modelRenderer.js.map