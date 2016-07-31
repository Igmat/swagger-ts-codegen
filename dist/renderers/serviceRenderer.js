"use strict";
var Mustache = require('mustache');
var enumRenderer_1 = require('./enumRenderer');
var Services;
(function (Services) {
    var RenderedService = (function () {
        function RenderedService() {
            this.enums = [];
        }
        return RenderedService;
    }());
    Services.RenderedService = RenderedService;
    var ServiceRenderer = (function () {
        function ServiceRenderer(serviceTemplate, enumRendererDefiner) {
            if (enumRendererDefiner === void 0) { enumRendererDefiner = null; }
            this.serviceTemplate = serviceTemplate;
            if (typeof enumRendererDefiner === "string") {
                this.enumRenderer = new enumRenderer_1.Enums.EnumRenderer(enumRendererDefiner);
            }
            else {
                this.enumRenderer = enumRendererDefiner;
            }
            this.isRenderingEnums = (this.enumRenderer != null);
        }
        ServiceRenderer.prototype.RenderService = function (serviceView) {
            var result = new RenderedService();
            result.name = serviceView.name;
            result.content = Mustache.render(this.serviceTemplate, serviceView);
            if (this.isRenderingEnums) {
                result.enums = this.enumRenderer.RenderEnumCollection(serviceView.enums);
            }
            return result;
        };
        ServiceRenderer.prototype.RenderServices = function (serviceViews) {
            var result = [];
            for (var i = 0; i < serviceViews.length; i++) {
                result.push(this.RenderService(serviceViews[i]));
            }
            return result;
        };
        ServiceRenderer.prototype.RenderServiceCollection = function (serviceViews) {
            var result = [];
            for (var serviceName in serviceViews) {
                result.push(this.RenderService(serviceViews[serviceName]));
            }
            return result;
        };
        return ServiceRenderer;
    }());
    Services.ServiceRenderer = ServiceRenderer;
})(Services = exports.Services || (exports.Services = {}));
//# sourceMappingURL=serviceRenderer.js.map