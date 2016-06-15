var SwaggerCodeGen;
(function (SwaggerCodeGen) {
    var Generators;
    (function (Generators) {
        var Enums;
        (function (Enums) {
            var EnumView = (function () {
                function EnumView() {
                    this.length = 0;
                    this.entities = {};
                }
                EnumView.prototype.Equals = function (another) {
                    var result = this.length == another.length;
                    if (result) {
                        for (var entity in this.entities) {
                            result = result && (this.entities[entity] == another.entities[entity]);
                        }
                    }
                    return result;
                };
                return EnumView;
            }());
            Enums.EnumView = EnumView;
            var EnumViewCollection = (function () {
                function EnumViewCollection() {
                }
                return EnumViewCollection;
            }());
            Enums.EnumViewCollection = EnumViewCollection;
            var EnumGenerator = (function () {
                function EnumGenerator() {
                    this.enums = new EnumViewCollection();
                }
                EnumGenerator.prototype.GenerateEnum = function (name, content, optionalPrefix) {
                    var enumView = new EnumView();
                    enumView.name = name + "Enum";
                    for (var en in content) {
                        var enumEntity = content[en].toString();
                        enumView.length++;
                        enumView.entities[enumEntity] = enumEntity;
                    }
                    //check for already existed name
                    if (this.enums[enumView.name]) {
                        if (enumView.Equals(this.enums[enumView.name])) {
                            enumView = this.enums[enumView.name];
                            return enumView;
                        }
                        else {
                            enumView.name = optionalPrefix + enumView.name;
                            if (this.enums[enumView.name]) {
                                if (enumView.Equals(this.enums[enumView.name])) {
                                    enumView = this.enums[enumView.name];
                                    return enumView;
                                }
                                else {
                                    throw new Error("Unable to add enum because of already existed names");
                                }
                            }
                        }
                    }
                    //check for already existed content
                    for (var enumName in this.enums) {
                        if (enumView.Equals(this.enums[enumName])) {
                            enumView = this.enums[enumName];
                            return enumView;
                        }
                    }
                    this.enums[enumView.name] = enumView;
                    return enumView;
                };
                return EnumGenerator;
            }());
            Enums.EnumGenerator = EnumGenerator;
        })(Enums = Generators.Enums || (Generators.Enums = {}));
    })(Generators = SwaggerCodeGen.Generators || (SwaggerCodeGen.Generators = {}));
})(SwaggerCodeGen || (SwaggerCodeGen = {}));
//# sourceMappingURL=enumViewGenerator.js.map