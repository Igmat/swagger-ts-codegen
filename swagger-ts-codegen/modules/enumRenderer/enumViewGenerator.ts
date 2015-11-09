export class EnumView {
    public name: string;
    public entities: EnumEntity[];

    constructor() {
        this.entities = [];
    }
}

export class EnumEntity {
    public name: string;

    constructor() { }
}

export function GenerateEnumView(name: string, content: [string | boolean | number | Object]): EnumView {
    var enumView: EnumView = new EnumView();
    enumView.name = name;

    for (var en in content) {
        var enumEntity: EnumEntity = new EnumEntity();
        enumEntity.name = content[en].toString();
        enumView.entities.push(enumEntity);
    }

    return enumView;
}