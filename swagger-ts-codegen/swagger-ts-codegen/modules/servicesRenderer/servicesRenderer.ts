import Mustache = require('mustache');

export import Generator = require("./servicesViewGenerator");

export function RenderServices(paths: { [pathName: string]: Swagger.Path }, serviceTemplate: string): string[] {
    var services: string[] = [];
    var ServiceView = Generator.GenerateServiceViews(paths);

    for (var name in ServiceView) {

        services.push(Mustache.render(serviceTemplate, ServiceView[name]))
    }
    return services;
}
/*
export function RenderService(name: string, path: Swagger.Path, serviceTemplate: string): string {
    
    var ServiceView = Generator.GenerateServiceView(name, path);
    var result = Mustache.render(serviceTemplate, ServiceView);

    return result;
}*/