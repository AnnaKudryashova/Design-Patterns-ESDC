import { GeometryService } from '../service/geometry/geometryService';
import { ShapeProcessor } from '../service/shapeProcessor';
import { ShapeLogger } from '../service/shapeLogger';
import { ShapeManager } from '../service/shapeManager';
import { ShapeRepository } from '../repository/shapeRepository';
import { Warehouse } from '../warehouse/warehouse';

export class ServiceFactory {
    private static geometryService: GeometryService;
    private static shapeProcessor: ShapeProcessor;
    private static shapeLogger: ShapeLogger;
    private static warehouse: Warehouse;
    private static repository: ShapeRepository;
    private static shapeManager: ShapeManager;

    static createGeometryService(): GeometryService {
        if (!this.geometryService) {
            this.geometryService = new GeometryService();
        }
        return this.geometryService;
    }

    static createShapeProcessor(): ShapeProcessor {
        if (!this.shapeProcessor) {
            this.shapeProcessor = new ShapeProcessor();
        }
        return this.shapeProcessor;
    }

    static createShapeLogger(): ShapeLogger {
        if (!this.shapeLogger) {
            this.shapeLogger = new ShapeLogger();
        }
        return this.shapeLogger;
    }

    static createWarehouse(): Warehouse {
        if (!this.warehouse) {
            this.warehouse = Warehouse.getInstance();
        }
        return this.warehouse;
    }

    static createRepository(): ShapeRepository {
        if (!this.repository) {
            this.repository = ShapeRepository.getInstance();
        }
        return this.repository;
    }

    static createShapeManager(): ShapeManager {
        if (!this.shapeManager) {
            this.shapeManager = new ShapeManager(
                this.createShapeProcessor(),
                this.createShapeLogger(),
                this.createRepository(),
                this.createGeometryService()
            );
        }
        return this.shapeManager;
    }
}