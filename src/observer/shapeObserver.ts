import { Shape } from "../entity/shape";
import { Warehouse } from "../warehouse/warehouse";
import { ShapeMetrics } from "../warehouse/shapeMetrics";
import { GeometryService } from "../service/geometry/geometryService";

export interface Observer {
    update(shape: Shape): void;
}

export class ShapeObserver implements Observer {
    private geometryService: GeometryService;

    constructor(geometryService: GeometryService = new GeometryService()) {
        this.geometryService = geometryService;
    }

    update(shape: Shape): void {
        const warehouse = Warehouse.getInstance();
        const metrics: ShapeMetrics = {
            area: this.geometryService.calculateArea(shape),
            perimeter: shape.type === 'rectangle'
                ? this.geometryService.calculatePerimeter(shape)
                : undefined,
            volume: shape.type === 'sphere'
                ? this.geometryService.calculateVolume(shape)
                : undefined
        };
        warehouse.update(shape.id, metrics);
    }
}