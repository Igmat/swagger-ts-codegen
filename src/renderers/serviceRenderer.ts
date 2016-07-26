import * as Mustache from 'mustache';
import * as Generators from '../generators';
import {Enums} from './enumRenderer'

export namespace Services {

    export class RenderedService {
        public name: string;
        public content: string;
        public enums: Enums.RenderedEnum[];

        constructor() {
            this.enums = [];
        }
    }

    export class ServiceRenderer {
        private isRenderingEnums: boolean;
        private enumRenderer: Enums.EnumRenderer;

        constructor(
            private serviceTemplate: string,
            enumRendererDefiner: Enums.EnumRenderer | string = null) {
            if (typeof enumRendererDefiner === "string") {
                this.enumRenderer = new Enums.EnumRenderer(enumRendererDefiner);
            } else {
                this.enumRenderer = enumRendererDefiner;
            }
            this.isRenderingEnums = (this.enumRenderer != null);
        }

        public RenderService(serviceView: Generators.ServiceGeneration.ServiceView): RenderedService {
            var result = new RenderedService();
            result.name = serviceView.name;
            result.content = Mustache.render(this.serviceTemplate, serviceView);
            if (this.isRenderingEnums) {
                result.enums = this.enumRenderer.RenderEnumCollection(serviceView.enums);
            }

            return result;
        }

        public RenderServices(serviceViews: Generators.ServiceGeneration.ServiceView[]): RenderedService[] {
            var result: RenderedService[] = [];
            for (let i = 0; i < serviceViews.length; i++) {
                result.push(this.RenderService(serviceViews[i]));
            }
            return result;
        }

        public RenderServiceCollection(serviceViews: Generators.ServiceGeneration.ServiceViewCollection): RenderedService[] {
            var result: RenderedService[] = [];
            for (var serviceName in serviceViews) {
                result.push(this.RenderService(serviceViews[serviceName]));
            }
            return result;
        }
    }
}
