import { Point } from "../entity/point";
import { Shape } from "../entity/shape";
import { logger } from "../util/logger";
import { ShapeManager } from "../service/shapeManager";
import { CONFIG } from "../constants";
import path from 'path';
import { GeometryService } from "../service/geometry/geometryService";
import { SpecificationFactory } from "../specification/specification";
import { ShapeRepository } from "../repository/shapeRepository";
import { Sphere } from "../entity/sphere";
import { Warehouse } from "../warehouse/warehouse";

export class ShapeDemo {
    private shapeManager: ShapeManager;
    private geometryService: GeometryService;
    private repository: ShapeRepository;
    private warehouse: Warehouse;
    private stats = {
        rectangles: 0,
        spheres: 0,
        invalidLines: 0,
        totalShapes: 0
    };

    constructor() {
        this.shapeManager = new ShapeManager();
        this.geometryService = new GeometryService();
        this.repository = ShapeRepository.getInstance();
        this.warehouse = Warehouse.getInstance();
    }

    public async run(): Promise<void> {
        try {
            logger.info("=== Starting Shape Demo ===");

            // Process shapes from file
            await this.processShapesFile();

            this.displayInitialStats();
            this.displayShapeDetails();
            this.showSearchOperations();
            this.showSortingOperations();
            await this.showShapeModifications();
            this.showRepositoryOperations();

            logger.info("=== Shape Demo Complete ===");
        } catch (error) {
            logger.error('Demo error:', error instanceof Error ? error : String(error));
            if (error instanceof Error) {
                logger.error('Error stack:', error.stack);
            }
            throw error;
        }
    }

    private async processShapesFile(): Promise<void> {
        const dataFilePath = path.join(__dirname, CONFIG.shapes.defaultPath);
        const result = await this.shapeManager.processFile(dataFilePath);
        this.stats.invalidLines = result.errors;
        this.stats.totalShapes = result.success;
    }

    private displayInitialStats(): void {
        logger.info("\n=== Initial Statistics ===");
        const allShapes = this.repository.findAll();
        this.stats.rectangles = allShapes.filter((s: Shape) => s.type === 'rectangle').length;
        this.stats.spheres = allShapes.filter((s: Shape) => s.type === 'sphere').length;

        logger.info(`Total shapes created: ${this.stats.totalShapes}`);
        logger.info(`Rectangles: ${this.stats.rectangles}`);
        logger.info(`Spheres: ${this.stats.spheres}`);
        logger.info(`Invalid lines in file: ${this.stats.invalidLines}`);
    }

    private displayShapeDetails(): void {
        logger.info("\n=== Shape Details ===");
        const allShapes = this.repository.findAll();

        allShapes.forEach((shape: Shape) => {
            logger.info(`\nShape ID: ${shape.id}`);
            logger.info(`Type: ${shape.type}`);

            if (shape.type === 'sphere') {
                const sphere = shape as Sphere;
                logger.info(`Center: (${sphere.center.x}, ${sphere.center.y}, ${sphere.center.z})`);
                logger.info(`Radius: ${sphere.radius}`);
            } else {
                logger.info(`Coordinates: ${shape.points.map((p: Point) => `(${p.x}, ${p.y}, ${p.z})`).join(', ')}`);
            }

            // Check if shape touches coordinate plane
            const touchesPlane = this.geometryService.touchesCoordinatePlane(shape);
            logger.info(`Touches coordinate plane: ${touchesPlane}`);

            if (shape.type === 'rectangle') {
                let rectangleType = 'rectangle';
                if (this.geometryService.isSquare(shape)) rectangleType = 'square';
                else if (this.geometryService.isRhombus(shape)) rectangleType = 'rhombus';
                else if (this.geometryService.isTrapezoid(shape)) rectangleType = 'trapezoid';
                logger.info(`Rectangle type: ${rectangleType}`);
            } else if (shape.type === 'sphere') {
                const volumeRatios = {
                    xy: this.geometryService.getPlaneSplitVolumeRatio(shape, 'xy').toFixed(2),
                    xz: this.geometryService.getPlaneSplitVolumeRatio(shape, 'xz').toFixed(2),
                    yz: this.geometryService.getPlaneSplitVolumeRatio(shape, 'yz').toFixed(2)
                };
                logger.info(`Sphere-plane intersection volume ratios: ${JSON.stringify(volumeRatios)}`);
            }

            // Display metrics
            const metrics = this.shapeManager.getShapeMetrics(shape.id);
            logger.info('Metrics:');
            logger.info(`- Area: ${metrics.area.toFixed(2)}`);
            if (metrics.perimeter) logger.info(`- Perimeter: ${metrics.perimeter.toFixed(2)}`);
            if (metrics.volume) logger.info(`- Volume: ${metrics.volume.toFixed(2)}`);
        });
    }

    private showSearchOperations(): void {
        logger.info("\n=== Search Operations ===");

        // Search by ID
        const allShapes = this.repository.findAll();
        if (allShapes.length > 0) {
            const searchId = allShapes[0].id;
            const foundById = this.repository.get(searchId);
            logger.info(`Search by ID ${searchId}: ${foundById ? 'Found' : 'Not found'}`);
        }

        // Search in first quadrant
        const firstQuadrantShapes = this.shapeManager.findInFirstQuadrant();
        logger.info(`\nShapes in first quadrant: ${firstQuadrantShapes.length}`);
        firstQuadrantShapes.forEach((shape: Shape) =>
            logger.info(`- ${shape.type} (ID: ${shape.id})`)
        );

        // Search by area range
        const areaRangeShapes = this.shapeManager.findShapesInAreaRange(0, 100);
        logger.info(`\nShapes with area between 0-100: ${areaRangeShapes.length}`);
        areaRangeShapes.forEach((shape: Shape) =>
            logger.info(`- ${shape.type} (ID: ${shape.id}, Area: ${this.geometryService.calculateArea(shape).toFixed(2)})`)
        );

        // Search by distance from origin
        const distanceShapes = this.shapeManager.findShapesNearOrigin(10);
        logger.info(`\nShapes within 10 units of origin: ${distanceShapes.length}`);
        distanceShapes.forEach((shape: Shape) =>
            logger.info(`- ${shape.type} (ID: ${shape.id}, Distance: ${this.geometryService.calculateDistanceFromOrigin(shape).toFixed(2)})`)
        );
    }

    private showSortingOperations(): void {
        logger.info("\n=== Sorting Operations ===");

        // Sort by X coordinate
        const sortedByX = this.shapeManager.sortByX();
        logger.info('Shapes sorted by X coordinate:');
        sortedByX.forEach((shape: Shape) =>
            logger.info(`- ${shape.type} (ID: ${shape.id}, X: ${this.geometryService.getFirstPointX(shape)})`)
        );

        // Sort by Y coordinate
        const sortedByY = this.shapeManager.sortByY();
        logger.info('\nShapes sorted by Y coordinate:');
        sortedByY.forEach((shape: Shape) =>
            logger.info(`- ${shape.type} (ID: ${shape.id}, Y: ${this.geometryService.getFirstPointY(shape)})`)
        );
    }

    private async showShapeModifications(): Promise<void> {
        logger.info("\n=== Shape Modifications ===");
        const allShapes = this.repository.findAll();

        // Find one rectangle and one sphere
        const rectangle = allShapes.find((s: Shape) => s.type === 'rectangle');
        const sphere = allShapes.find((s: Shape) => s.type === 'sphere');

        if (rectangle) {
            logger.info('\nRectangle modifications:');
            const originalMetrics = this.warehouse.get(rectangle.id);
            logger.info('Original metrics:');
            if (originalMetrics) {
                logger.info(`- Area: ${originalMetrics.area.toFixed(2)}`);
                if (originalMetrics.perimeter) logger.info(`- Perimeter: ${originalMetrics.perimeter.toFixed(2)}`);
                if (originalMetrics.volume) logger.info(`- Volume: ${originalMetrics.volume.toFixed(2)}`);
            }

            // Modify rectangle by changing only X coordinates of points 2 and 3
            const newPoints = rectangle.points.map((p: Point, index: number) => {
                if (index === 1 || index === 2) { // Points 2 and 3 (0-based index)
                    return new Point(p.x + 5, p.y, p.z);
                }
                return new Point(p.x, p.y, p.z);
            });

            this.shapeManager.updateShape(rectangle.id, newPoints);

            const updatedMetrics = this.warehouse.get(rectangle.id);
            logger.info('Updated metrics:');
            if (updatedMetrics) {
                logger.info(`- Area: ${updatedMetrics.area.toFixed(2)}`);
                if (updatedMetrics.perimeter) logger.info(`- Perimeter: ${updatedMetrics.perimeter.toFixed(2)}`);
                if (updatedMetrics.volume) logger.info(`- Volume: ${updatedMetrics.volume.toFixed(2)}`);
            }

            // Revert changes
            this.shapeManager.updateShape(rectangle.id, rectangle.points);
        }

        if (sphere) {
            logger.info('\nSphere modifications:');
            const originalMetrics = this.warehouse.get(sphere.id);
            logger.info('Original metrics:');
            if (originalMetrics) {
                logger.info(`- Area: ${originalMetrics.area.toFixed(2)}`);
                if (originalMetrics.perimeter) logger.info(`- Perimeter: ${originalMetrics.perimeter.toFixed(2)}`);
                if (originalMetrics.volume) logger.info(`- Volume: ${originalMetrics.volume.toFixed(2)}`);
            }

            // Modify sphere by moving its center and increasing radius
            const sphereShape = sphere as Sphere;
            const newCenter = new Point(
                sphereShape.center.x + 5,
                sphereShape.center.y + 5,
                sphereShape.center.z + 5
            );

            // Create new points array with the new center
            const newPoints = [newCenter];
            this.shapeManager.updateShape(sphere.id, newPoints);

            const updatedMetrics = this.warehouse.get(sphere.id);
            logger.info('Updated metrics:');
            if (updatedMetrics) {
                logger.info(`- Area: ${updatedMetrics.area.toFixed(2)}`);
                if (updatedMetrics.perimeter) logger.info(`- Perimeter: ${updatedMetrics.perimeter.toFixed(2)}`);
                if (updatedMetrics.volume) logger.info(`- Volume: ${updatedMetrics.volume.toFixed(2)}`);
            }

            // Revert changes
            this.shapeManager.updateShape(sphere.id, [sphereShape.center]);
        }
    }

    private showRepositoryOperations(): void {
        logger.info("\n=== Repository Operations ===");

        // Remove some shapes
        const allShapes = this.repository.findAll();
        if (allShapes.length >= 2) {
            const shapeToRemove = allShapes[1];
            logger.info(`Removing shape ${shapeToRemove.id}`);
            this.repository.remove(shapeToRemove.id);
        }

        // Display final repository state
        const remainingShapes = this.repository.findAll();
        logger.info('\nRemaining shapes in repository:');
        remainingShapes.forEach((shape: Shape) =>
            logger.info(`- ${shape.type} (ID: ${shape.id})`)
        );
    }
}