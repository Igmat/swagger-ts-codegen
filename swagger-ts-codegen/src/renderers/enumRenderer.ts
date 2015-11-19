module SwaggerCodeGen.Renderers.Enums {
    var Mustache: MustacheStatic = require('mustache');

    //internal class for mustache template
    class EnumViewWrapper {
        public name: string;
        public entities: EnumEntityWrapper[];

        constructor(enumView: Generators.Enums.EnumView) {
            this.name = enumView.name;
            this.entities = [];
            for (var entity in enumView.entities) {
                this.entities.push(new EnumEntityWrapper(enumView.entities[entity]));
            }
        }
    }

    //internal class for mustache template
    class EnumEntityWrapper {
        public name: string;

        constructor(name: string) {
            this.name = name;
        }
    }

    export class RenderedEnum {
        public name: string;
        public content: string;
        constructor() { }
    }

    export class EnumRenderer {

        constructor(private enumTemplate: string) {
         }

        public RenderEnum(enumView: Generators.Enums.EnumView): RenderedEnum {
            var result = new RenderedEnum();
            result.name = enumView.name;
            result.content = Mustache.render(this.enumTemplate, new EnumViewWrapper(enumView));

            return result;
        }

        public RenderEnums(enumViews: Generators.Enums.EnumView[]): RenderedEnum[] {
            var result: RenderedEnum[] = [];
            for (let i = 0; i < enumViews.length; i++) {
                result.push(this.RenderEnum(enumViews[i]));
            }
            return result;
        }

        public RenderEnumCollection(enumViews: Generators.Enums.EnumViewCollection): RenderedEnum[] {
            var result: RenderedEnum[] = [];
            for (var enumName in enumViews) {
                result.push(this.RenderEnum(enumViews[enumName]));
            }
            return result;
        }
    }
}
