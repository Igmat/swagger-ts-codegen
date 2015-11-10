import Mustache = require('mustache');
import enumRenderer = require("./../enumRenderer/enumRenderer");

export import Generator = require("./servicesViewGenerator");

export function RenderServices(paths: { [pathName: string]: Swagger.Path }, serviceTemplate: string, enumTemplate: string, enumGenerator: enumRenderer.Generator.EnumGenerator): string[] {
    var services: string[] = [];
    var ServiceView = Generator.GenerateServiceViews(paths, enumGenerator);

    for (var name in ServiceView) {
        var result = Mustache.render(serviceTemplate, ServiceView[name]);
        ServiceView[name].enums.forEach((value: enumRenderer.Generator.EnumView) => {
            result += enumRenderer.RenderEnumFromView(value, enumTemplate);
        });
        services.push(result)
    }
    return services;
}
/*
export function RenderService(name: string, path: Swagger.Path, serviceTemplate: string): string {
    
    var ServiceView = Generator.GenerateServiceView(name, path);
    var result = Mustache.render(serviceTemplate, ServiceView);

    return result;
}*/