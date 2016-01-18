module SwaggerCodeGen.Renderers.Mocks {
    var Mustache: MustacheStatic = require('mustache');

    function IsStreet(name: string): boolean {
        let nameInLower = name.toLowerCase().replace(/_/g, "");
        return (
            (nameInLower.indexOf("st.") != -1) ||
            (nameInLower.indexOf("str.") != -1) ||
            (nameInLower.indexOf("street") != -1));
    }

    function IsAdress(name: string): boolean {
        let nameInLower = name.toLowerCase().replace(/_/g, "");
        return (
            (nameInLower.indexOf("adres") != -1) || //for common mistake in this word
            (nameInLower.indexOf("addr") != -1) ||
            (nameInLower.indexOf("location") != -1) ||
            (nameInLower.indexOf("house") != -1));
    }

    function IsCity(name: string): boolean {
        let nameInLower = name.toLowerCase().replace(/_/g, "");
        return (
            (nameInLower.indexOf("city") != -1) ||
            (nameInLower.indexOf("town") != -1));
    }

    function IsState(name: string): boolean {
        let nameInLower = name.toLowerCase().replace(/_/g, "");
        return (
            (nameInLower.indexOf("state") != -1));
    }

    function IsCountry(name: string): boolean {
        let nameInLower = name.toLowerCase().replace(/_/g, "");
        return (
            (nameInLower.indexOf("country") != -1));
    }

    function IsZip(name: string): boolean {
        let nameInLower = name.toLowerCase().replace(/_/g, "");
        return (
            (nameInLower.indexOf("zip") != -1));
    }

    function IsPhone(name: string): boolean {
        let nameInLower = name.toLowerCase().replace(/_/g, "");
        return (
            (nameInLower.indexOf("phone") != -1)); //for now don't know any other common situations to use this
    }

    function IsEmail(name: string): boolean {
        let nameInLower = name.toLowerCase().replace(/_/g, "");
        return (
            (nameInLower.indexOf("mail") != -1)); //for now don't know any other common situations to use this
    }

    function IsFirstName(name: string): boolean {
        let nameInLower = name.toLowerCase().replace(/_/g, "");
        return (
            (nameInLower.indexOf("name") != -1));
    }

    function IsSurname(name: string): boolean {
        let nameInLower = name.toLowerCase().replace(/_/g, "");
        return (
            (nameInLower.indexOf("lastname") != -1) ||
            (nameInLower.indexOf("surname") != -1));
    }

    function IsFullName(name: string): boolean {
        let nameInLower = name.toLowerCase().replace(/_/g, "");
        return (
            (nameInLower.indexOf("fullname") != -1));
    }

    function IsWord(name: string): boolean {
        let nameInLower = name.toLowerCase().replace(/_/g, "");
        return (
            (nameInLower.indexOf("group") != -1) ||
            (nameInLower.indexOf("company") != -1) ||
            (nameInLower.indexOf("organization") != -1));
    }

    function IsSentence(name: string): boolean {
        let nameInLower = name.toLowerCase().replace(/_/g, "");
        return (
            (nameInLower.indexOf("title") != -1) ||
            (nameInLower.indexOf("about") != -1) ||
            (nameInLower.indexOf("desc") != -1));
    }

    function IsParagraph(name: string): boolean {
        let nameInLower = name.toLowerCase().replace(/_/g, "");
        return (
            (nameInLower.indexOf("content") != -1) ||
            (nameInLower.indexOf("article") != -1) ||
            (nameInLower.indexOf("comment") != -1) ||
            (nameInLower.indexOf("note") != -1));
    }

    function IsLatitude(name: string): boolean {
        let nameInLower = name.toLowerCase().replace(/_/g, "");
        return (
            (nameInLower.indexOf("latitude") != -1));
    }

    function IsLongitude(name: string): boolean {
        let nameInLower = name.toLowerCase().replace(/_/g, "");
        return (
            (nameInLower.indexOf("longitude") != -1));
    }

    function IsUrl(name: string): boolean {
        let nameInLower = name.toLowerCase().replace(/_/g, "");
        return (
            (nameInLower.indexOf("url") != -1) ||
            (nameInLower.indexOf("link") != -1) ||
            (nameInLower.indexOf("site") != -1) ||
            (nameInLower.indexOf("web") != -1));
    }

    function IsBirthday(name: string): boolean {
        let nameInLower = name.toLowerCase().replace(/_/g, "");
        return (
            (nameInLower.indexOf("birth") != -1));
    }

    function IsDate(name: string): boolean {
        let nameInLower = name.toLowerCase().replace(/_/g, "");
        return (
            (nameInLower.indexOf("date") != -1));
    }

    function IsIdentifier(name: string): boolean {
        return (
            (name.indexOf("id") == 0) ||
            (name.indexOf("_id") != -1) ||
            (name.indexOf("Id") != -1) ||
            (name.indexOf("alias") == 0) ||
            (name.indexOf("_alias") != -1) ||
            (name.indexOf("Alias") != -1));
    }

    //internal class for mustache template
    class EnumEntityWrapper {
        constructor(public name: string) {
        }
    }

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

    class SuffixFuncWrapper {
        constructor(
            public content: string) {
        }

    }

    //internal class for mustache template
    class PropertyViewWrapper {
        public name: string;
        public type: string;
        public isArray: boolean;
        public suffixFunc: SuffixFuncWrapper;

        constructor(property: Generators.Models.PropertyView) {
            this.name = property.name;
            this.isArray = property.isArray;
            switch (property.type) {
                case 'string':
                    this.type = "string";
                    if (IsFirstName(property.name)) this.type = "first";
                    if (IsSurname(property.name)) this.type = "last";
                    if (IsFullName(property.name)) this.type = "name";

                    if (IsWord(property.name)) this.type = "word";
                    if (IsSentence(property.name)) this.type = "sentence";
                    if (IsParagraph(property.name)) this.type = "paragraph";

                    if (IsStreet(property.name)) this.type = "street";
                    if (IsAdress(property.name)) this.type = "address";
                    if (IsCity(property.name)) this.type = "city";
                    if (IsState(property.name)) this.type = "state";
                    if (IsCountry(property.name)) this.type = "country";
                    if (IsZip(property.name)) this.type = "zip";
                    if (IsLatitude(property.name)) this.type = "latitude";
                    if (IsLongitude(property.name)) this.type = "longitude";

                    if (IsPhone(property.name)) this.type = "phone";
                    if (IsEmail(property.name)) this.type = "email";

                    if (IsUrl(property.name)) this.type = "url";

                    if (IsBirthday(property.name)) {
                        this.type = "birthday";
                        if (this.isArray) {
                            this.suffixFunc = new SuffixFuncWrapper("map(function (value, index, array) { return value.toUTCString(); })");
                        } else {
                            this.suffixFunc = new SuffixFuncWrapper("toUTCString()");
                        }
                    }
                    if (IsDate(property.name)) {
                        this.type = "date"
                        if (this.isArray) {
                            this.suffixFunc = new SuffixFuncWrapper("map(function (value, index, array) { return value.toUTCString(); })");
                        } else {
                            this.suffixFunc = new SuffixFuncWrapper("toUTCString()");
                        }
                    }

                    if (IsIdentifier(property.name)) this.type = "string";
                    break;
                case 'boolean':
                    this.type = "bool"
                    break;
                case 'number':
                    this.type = "integer";
                    break;
                default:
                    this.type = property.type;
                    break;
            }
        }
    }

    //internal class for mustache template
    class ModelViewWrapper {
        public name: string;
        public properties: PropertyViewWrapper[];

        constructor(model: Generators.Models.ModelView) {
            this.name = model.name;
            this.properties = [];
            for (let property of model.properties) {
                this.properties.push(new PropertyViewWrapper(property));
            }
        }
    }

    //internal class for mustache template
    class ChanceViewWrapper {
        public models: ModelViewWrapper[];
        public enums: EnumViewWrapper[];

        constructor(models: Generators.Models.ModelViewCollection, enums?: Generators.Enums.EnumViewCollection) {
            this.models = [];
            for (let modelIndex in models) {
                this.models.push(new ModelViewWrapper(models[modelIndex]));
            }
            if (enums) {
                this.enums = [];
                for (let enumIndex in enums) {
                    this.enums.push(new EnumViewWrapper(enums[enumIndex]));
                }
            }
        }
    }

    //internal class for mustache template
    class ParameterViewWrapper {
        public name: string;
        public type: string;
        public optional: boolean;
        public description: string;
        public isNumber: boolean;

        constructor(parameter: Generators.Services.ParameterView) {
            this.name = parameter.name;
            this.type = parameter.type;
            this.optional = parameter.optional;
            this.description = parameter.description;
            this.isNumber = (this.type == "number");
        }
    }

    //internal class for mustache template
    class ResponseWrapper {
        constructor(public content: string) {
        }
    }

    //internal class for mustache template
    class MethodViewWrapper {
        public operationId: string;
        public link: string;
        public httpVerb: string;
        public description: string;
        public pathParameters: ParameterViewWrapper[];
        public queryParameters: ParameterViewWrapper[];
        public bodyParameter: ParameterViewWrapper;
        public response: ResponseWrapper;

        constructor(method: Generators.Services.MethodView) {
            this.operationId = method.operationId;
            this.link = method.link;
            this.httpVerb = method.httpVerb;
            this.description = method.description;
            switch (method.response) {
                case 'string':
                    this.response = new ResponseWrapper("string");
                    break;
                case 'boolean':
                    this.response = new ResponseWrapper("bool");
                    break;
                case 'number':
                    this.response = new ResponseWrapper("integer");
                    break;
                case 'any':
                    this.response = undefined;
                    break;
                default:
                    this.response = new ResponseWrapper(method.response);
                    break;
            }
            if (method.bodyParameter) {
                this.bodyParameter = new ParameterViewWrapper(method.bodyParameter);
            }
            this.pathParameters = [];
            for (let pathParameter in method.pathParameters) {
                this.pathParameters.push(new ParameterViewWrapper(pathParameter));
            }
            this.queryParameters = [];
            for (let queryParameter in method.queryParameters) {
                this.queryParameters.push(new ParameterViewWrapper(queryParameter));
            }
        }
    }

    //internal class for mustache template
    class ServiceViewWrapper {
        public name: string;
        public methods: MethodViewWrapper[];

        constructor(service: Generators.Services.ServiceView) {
            this.name = service.name;
            this.methods = [];
            for (let method of service.methods) {
                this.methods.push(new MethodViewWrapper(method));
            }
        }
    }

    export class RenderedMock {
        constructor(
            public content: string,
            public contentOverride: string,
            public chanceHelper: string,
            public chanceOverride: string) {
        }
    }

    export class MockTemplates {
        constructor(
            public mockTemplate: string,
            public mockOverrideTemplate: string,
            public chanceTemplate: string,
            public chanceOverrideTemplate: string) {
        }
    }

    export class MockRenderer {
        private mockTemplate: string;
        private mockOverrideTemplate: string;
        private chanceTemplate: string;
        private chanceOverrideTemplate: string;

        constructor(templates: MockTemplates) {
            this.mockTemplate = templates.mockTemplate;
            this.mockOverrideTemplate = templates.mockOverrideTemplate;
            this.chanceTemplate = templates.chanceTemplate;
            this.chanceOverrideTemplate = templates.chanceOverrideTemplate;
        }

        public RenderChanceHelper(models: Generators.Models.ModelViewCollection, enums: Generators.Enums.EnumViewCollection): string {
            return Mustache.render(this.chanceTemplate, new ChanceViewWrapper(models, enums));
        }

        public RenderChanceHelperOverride(models: Generators.Models.ModelViewCollection): string {
            return Mustache.render(this.chanceOverrideTemplate, new ChanceViewWrapper(models));
        }

        public RenderMockContent(serviceView: Generators.Services.ServiceView): string {
            return Mustache.render(this.mockTemplate, new ServiceViewWrapper(serviceView));
        }

        public RenderMockContentOverride(serviceView: Generators.Services.ServiceView): string {
            return Mustache.render(this.mockOverrideTemplate, new ServiceViewWrapper(serviceView));
        }

        public RenderMock(component: Generators.Services.Component): RenderedMock {
            return new RenderedMock(
                this.RenderMockContent(component.service),
                this.RenderMockContentOverride(component.service),
                this.RenderChanceHelper(component.models, component.enums),
                this.RenderChanceHelperOverride(component.models));
        }

        public RenderMocks(components: Generators.Services.Component[]): RenderedMock[] {
            var result: RenderedMock[] = [];
            for (var component of components) {
                result.push(this.RenderMock(component));
            }
            return result;
        }
    }
}
