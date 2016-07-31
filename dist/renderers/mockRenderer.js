"use strict";
var Mustache = require('mustache');
var Mocks;
(function (Mocks) {
    function IsStreet(name) {
        var nameInLower = name.toLowerCase().replace(/_/g, '');
        return ((nameInLower.indexOf('st.') != -1) ||
            (nameInLower.indexOf('str.') != -1) ||
            (nameInLower.indexOf('street') != -1));
    }
    function IsAdress(name) {
        var nameInLower = name.toLowerCase().replace(/_/g, '');
        return ((nameInLower.indexOf('adres') != -1) ||
            (nameInLower.indexOf('addr') != -1) ||
            (nameInLower.indexOf('location') != -1) ||
            (nameInLower.indexOf('house') != -1));
    }
    function IsCity(name) {
        var nameInLower = name.toLowerCase().replace(/_/g, '');
        return ((nameInLower.indexOf('city') != -1) ||
            (nameInLower.indexOf('town') != -1));
    }
    function IsState(name) {
        var nameInLower = name.toLowerCase().replace(/_/g, '');
        return ((nameInLower.indexOf('state') != -1));
    }
    function IsCountry(name) {
        var nameInLower = name.toLowerCase().replace(/_/g, '');
        return ((nameInLower.indexOf('country') != -1));
    }
    function IsZip(name) {
        var nameInLower = name.toLowerCase().replace(/_/g, '');
        return ((nameInLower.indexOf('zip') != -1));
    }
    function IsPhone(name) {
        var nameInLower = name.toLowerCase().replace(/_/g, '');
        return ((nameInLower.indexOf('phone') != -1));
    }
    function IsEmail(name) {
        var nameInLower = name.toLowerCase().replace(/_/g, '');
        return ((nameInLower.indexOf('mail') != -1));
    }
    function IsFirstName(name) {
        var nameInLower = name.toLowerCase().replace(/_/g, '');
        return ((nameInLower.indexOf('name') != -1));
    }
    function IsSurname(name) {
        var nameInLower = name.toLowerCase().replace(/_/g, '');
        return ((nameInLower.indexOf('lastname') != -1) ||
            (nameInLower.indexOf('surname') != -1));
    }
    function IsFullName(name) {
        var nameInLower = name.toLowerCase().replace(/_/g, '');
        return ((nameInLower.indexOf('fullname') != -1));
    }
    function IsWord(name) {
        var nameInLower = name.toLowerCase().replace(/_/g, '');
        return ((nameInLower.indexOf('group') != -1) ||
            (nameInLower.indexOf('company') != -1) ||
            (nameInLower.indexOf('organization') != -1));
    }
    function IsSentence(name) {
        var nameInLower = name.toLowerCase().replace(/_/g, '');
        return ((nameInLower.indexOf('title') != -1) ||
            (nameInLower.indexOf('about') != -1) ||
            (nameInLower.indexOf('desc') != -1));
    }
    function IsParagraph(name) {
        var nameInLower = name.toLowerCase().replace(/_/g, '');
        return ((nameInLower.indexOf('content') != -1) ||
            (nameInLower.indexOf('article') != -1) ||
            (nameInLower.indexOf('comment') != -1) ||
            (nameInLower.indexOf('note') != -1));
    }
    function IsLatitude(name) {
        var nameInLower = name.toLowerCase().replace(/_/g, '');
        return ((nameInLower.indexOf('latitude') != -1));
    }
    function IsLongitude(name) {
        var nameInLower = name.toLowerCase().replace(/_/g, '');
        return ((nameInLower.indexOf('longitude') != -1));
    }
    function IsUrl(name) {
        var nameInLower = name.toLowerCase().replace(/_/g, '');
        return ((nameInLower.indexOf('url') != -1) ||
            (nameInLower.indexOf('link') != -1) ||
            (nameInLower.indexOf('site') != -1) ||
            (nameInLower.indexOf('web') != -1));
    }
    function IsBirthday(name) {
        var nameInLower = name.toLowerCase().replace(/_/g, '');
        return ((nameInLower.indexOf('birth') != -1));
    }
    function IsDate(name) {
        var nameInLower = name.toLowerCase().replace(/_/g, '');
        return ((nameInLower.indexOf('date') != -1));
    }
    function IsIdentifier(name) {
        return ((name.indexOf('id') == 0) ||
            (name.indexOf('_id') != -1) ||
            (name.indexOf('Id') != -1) ||
            (name.indexOf('alias') == 0) ||
            (name.indexOf('_alias') != -1) ||
            (name.indexOf('Alias') != -1));
    }
    var EnumEntityWrapper = (function () {
        function EnumEntityWrapper(name) {
            this.name = name;
        }
        return EnumEntityWrapper;
    }());
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
    var SuffixFuncWrapper = (function () {
        function SuffixFuncWrapper(content) {
            this.content = content;
        }
        return SuffixFuncWrapper;
    }());
    var PropertyViewWrapper = (function () {
        function PropertyViewWrapper(property) {
            this.name = property.name;
            this.isArray = property.isArray;
            switch (property.type) {
                case 'string':
                    this.type = 'string';
                    if (IsFirstName(property.name))
                        this.type = 'first';
                    if (IsSurname(property.name))
                        this.type = 'last';
                    if (IsFullName(property.name))
                        this.type = 'name';
                    if (IsWord(property.name))
                        this.type = 'word';
                    if (IsSentence(property.name))
                        this.type = 'sentence';
                    if (IsParagraph(property.name))
                        this.type = 'paragraph';
                    if (IsStreet(property.name))
                        this.type = 'street';
                    if (IsAdress(property.name))
                        this.type = 'address';
                    if (IsCity(property.name))
                        this.type = 'city';
                    if (IsState(property.name))
                        this.type = 'state';
                    if (IsCountry(property.name))
                        this.type = 'country';
                    if (IsZip(property.name))
                        this.type = 'zip';
                    if (IsLatitude(property.name))
                        this.type = 'latitude';
                    if (IsLongitude(property.name))
                        this.type = 'longitude';
                    if (IsPhone(property.name))
                        this.type = 'phone';
                    if (IsEmail(property.name))
                        this.type = 'email';
                    if (IsUrl(property.name))
                        this.type = 'url';
                    if (IsBirthday(property.name)) {
                        this.type = 'birthday';
                        if (this.isArray) {
                            this.suffixFunc = new SuffixFuncWrapper('map(function (value, index, array) { return value.toUTCString(); })');
                        }
                        else {
                            this.suffixFunc = new SuffixFuncWrapper('toUTCString()');
                        }
                    }
                    if (IsDate(property.name)) {
                        this.type = 'date';
                        if (this.isArray) {
                            this.suffixFunc = new SuffixFuncWrapper('map(function (value, index, array) { return value.toUTCString(); })');
                        }
                        else {
                            this.suffixFunc = new SuffixFuncWrapper('toUTCString()');
                        }
                    }
                    if (IsIdentifier(property.name))
                        this.type = 'string';
                    break;
                case 'boolean':
                    this.type = 'bool';
                    break;
                case 'number':
                    this.type = 'integer';
                    break;
                default:
                    this.type = property.type;
                    break;
            }
        }
        return PropertyViewWrapper;
    }());
    var ModelViewWrapper = (function () {
        function ModelViewWrapper(model) {
            this.name = model.name;
            this.properties = [];
            for (var _i = 0, _a = model.properties; _i < _a.length; _i++) {
                var property = _a[_i];
                this.properties.push(new PropertyViewWrapper(property));
            }
        }
        return ModelViewWrapper;
    }());
    var ChanceViewWrapper = (function () {
        function ChanceViewWrapper(models, enums) {
            this.models = [];
            for (var modelIndex in models) {
                this.models.push(new ModelViewWrapper(models[modelIndex]));
            }
            if (enums) {
                this.enums = [];
                for (var enumIndex in enums) {
                    this.enums.push(new EnumViewWrapper(enums[enumIndex]));
                }
            }
        }
        return ChanceViewWrapper;
    }());
    var ParameterViewWrapper = (function () {
        function ParameterViewWrapper(parameter) {
            this.name = parameter.name;
            this.type = parameter.type;
            this.optional = parameter.optional;
            this.description = parameter.description;
            this.isNumber = (this.type == 'number');
        }
        return ParameterViewWrapper;
    }());
    var ResponseWrapper = (function () {
        function ResponseWrapper(content) {
            this.content = content;
        }
        return ResponseWrapper;
    }());
    var MethodViewWrapper = (function () {
        function MethodViewWrapper(method) {
            this.operationId = method.operationId;
            this.link = method.link;
            this.httpVerb = method.httpVerb;
            this.description = method.description;
            switch (method.response) {
                case 'string':
                    this.response = new ResponseWrapper('string');
                    break;
                case 'boolean':
                    this.response = new ResponseWrapper('bool');
                    break;
                case 'number':
                    this.response = new ResponseWrapper('integer');
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
            for (var _i = 0, _a = method.pathParameters; _i < _a.length; _i++) {
                var pathParameter = _a[_i];
                this.pathParameters.push(new ParameterViewWrapper(pathParameter));
            }
            this.queryParameters = [];
            for (var _b = 0, _c = method.queryParameters; _b < _c.length; _b++) {
                var queryParameter = _c[_b];
                this.queryParameters.push(new ParameterViewWrapper(queryParameter));
            }
        }
        return MethodViewWrapper;
    }());
    var ServiceViewWrapper = (function () {
        function ServiceViewWrapper(service) {
            this.name = service.name;
            this.methods = [];
            for (var _i = 0, _a = service.methods; _i < _a.length; _i++) {
                var method = _a[_i];
                this.methods.push(new MethodViewWrapper(method));
            }
        }
        return ServiceViewWrapper;
    }());
    var RenderedMock = (function () {
        function RenderedMock(content, contentOverride, chanceHelper, chanceOverride) {
            this.content = content;
            this.contentOverride = contentOverride;
            this.chanceHelper = chanceHelper;
            this.chanceOverride = chanceOverride;
        }
        return RenderedMock;
    }());
    Mocks.RenderedMock = RenderedMock;
    var MockTemplates = (function () {
        function MockTemplates(mockTemplate, mockOverrideTemplate, chanceTemplate, chanceOverrideTemplate) {
            this.mockTemplate = mockTemplate;
            this.mockOverrideTemplate = mockOverrideTemplate;
            this.chanceTemplate = chanceTemplate;
            this.chanceOverrideTemplate = chanceOverrideTemplate;
        }
        return MockTemplates;
    }());
    Mocks.MockTemplates = MockTemplates;
    var MockRenderer = (function () {
        function MockRenderer(templates) {
            this.mockTemplate = templates.mockTemplate;
            this.mockOverrideTemplate = templates.mockOverrideTemplate;
            this.chanceTemplate = templates.chanceTemplate;
            this.chanceOverrideTemplate = templates.chanceOverrideTemplate;
        }
        MockRenderer.prototype.RenderChanceHelper = function (models, enums) {
            return Mustache.render(this.chanceTemplate, new ChanceViewWrapper(models, enums));
        };
        MockRenderer.prototype.RenderChanceHelperOverride = function (models) {
            return Mustache.render(this.chanceOverrideTemplate, new ChanceViewWrapper(models));
        };
        MockRenderer.prototype.RenderMockContent = function (serviceView) {
            return Mustache.render(this.mockTemplate, new ServiceViewWrapper(serviceView));
        };
        MockRenderer.prototype.RenderMockContentOverride = function (serviceView) {
            return Mustache.render(this.mockOverrideTemplate, new ServiceViewWrapper(serviceView));
        };
        MockRenderer.prototype.RenderMock = function (component) {
            return new RenderedMock(this.RenderMockContent(component.service), this.RenderMockContentOverride(component.service), this.RenderChanceHelper(component.models, component.enums), this.RenderChanceHelperOverride(component.models));
        };
        MockRenderer.prototype.RenderMocks = function (components) {
            var result = [];
            for (var _i = 0, components_1 = components; _i < components_1.length; _i++) {
                var component = components_1[_i];
                result.push(this.RenderMock(component));
            }
            return result;
        };
        return MockRenderer;
    }());
    Mocks.MockRenderer = MockRenderer;
})(Mocks = exports.Mocks || (exports.Mocks = {}));
//# sourceMappingURL=mockRenderer.js.map