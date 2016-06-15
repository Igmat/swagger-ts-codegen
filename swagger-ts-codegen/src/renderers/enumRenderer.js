var SwaggerCodeGen;
(function (SwaggerCodeGen) {
    var Renderers;
    (function (Renderers) {
        var Enums;
        (function (Enums) {
            var Mustache = require('mustache');
            //internal class for mustache template
            var EnumViewWrapper = (function () {
                function EnumViewWrapper(enumView) {
                    this.name = enumView.name;
                    this.entities = [];
                    for (var entity in enumView.entities) {
                        this.entities.push(new EnumEntityWrapper(enumView.entities[entity]));
                    }
                }
                return EnumViewWrapper;
            }());
            //internal class for mustache template
            var EnumEntityWrapper = (function () {
                function EnumEntityWrapper(name) {
                    this.name = name;
                }
                return EnumEntityWrapper;
            }());
            var RenderedEnum = (function () {
                function RenderedEnum() {
                }
                return RenderedEnum;
            }());
            Enums.RenderedEnum = RenderedEnum;
            var EnumRenderer = (function () {
                function EnumRenderer(enumTemplate) {
                    this.enumTemplate = enumTemplate;
                }
                EnumRenderer.prototype.RenderEnum = function (enumView) {
                    var result = new RenderedEnum();
                    result.name = enumView.name;
                    result.content = Mustache.render(this.enumTemplate, new EnumViewWrapper(enumView));
                    return result;
                };
                EnumRenderer.prototype.RenderEnums = function (enumViews) {
                    var result = [];
                    for (var i = 0; i < enumViews.length; i++) {
                        result.push(this.RenderEnum(enumViews[i]));
                    }
                    return result;
                };
                EnumRenderer.prototype.RenderEnumCollection = function (enumViews) {
                    var result = [];
                    for (var enumName in enumViews) {
                        result.push(this.RenderEnum(enumViews[enumName]));
                    }
                    return result;
                };
                return EnumRenderer;
            }());
            Enums.EnumRenderer = EnumRenderer;
        })(Enums = Renderers.Enums || (Renderers.Enums = {}));
    })(Renderers = SwaggerCodeGen.Renderers || (SwaggerCodeGen.Renderers = {}));
})(SwaggerCodeGen || (SwaggerCodeGen = {}));
//# sourceMappingURL=enumRenderer.js.map