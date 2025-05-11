import { Point } from "../entity/point";
import { Shape } from "../entity/shape";
import { ShapeRepository } from "../repository/shapeRepository";
import { logger } from "../util/logger";
import { Warehouse } from "../warehouse/warehouse";
import { ShapeManager } from "./shapeManager";
import path from 'path';

export class ShapeDemo {
  private shapeManager: ShapeManager;
  private repository: ShapeRepository;
  private warehouse: Warehouse;

  constructor() {
    this.shapeManager = new ShapeManager();
    this.repository = ShapeRepository.getInstance();
    this.warehouse = Warehouse.getInstance();
  }

  private async processShapesFile(): Promise<void> {
    const dataFilePath = path.join(__dirname, '../../data/shapes.txt');
    await this.shapeManager.processFile(dataFilePath);
  }

  private demonstrateSpecificationMethods(): void {
    const firstQuadrantShapes = this.shapeManager.findInFirstQuadrant();
    logger.info(`Found ${firstQuadrantShapes.length} shapes in first quadrant`);

    const mediumShapes = this.shapeManager.findShapesInAreaRange(10, 100);
    logger.info(`Found ${mediumShapes.length} shapes with area between 10-100`);

    const nearbyShapes = this.shapeManager.findShapesNearOrigin(15);
    logger.info(`Found ${nearbyShapes.length} shapes within 15 units of origin`);

    this.logShapesSortedByX();
  }

  private logShapesSortedByX(): void {
    const shapesSortedByX = this.shapeManager.sortByX();
    logger.info('Shapes sorted by X coordinate:');
    shapesSortedByX.forEach(shape => {
      const x = shape.type === 'rectangle'
        ? shape.points[0].x
        : (shape as any).center.x;
      logger.info(`- ${shape.type} (x: ${x})`);
    });
  }

  private demonstrateRepositoryOperations(): void {
    const rectangles = this.repository.findByType('rectangle');
    logger.info(`Found ${rectangles.length} rectangles`);

    const spheres = this.repository.findByType('sphere');
    logger.info(`Found ${spheres.length} spheres`);

    if (rectangles.length > 0) {
      this.demonstrateShapeCalculations(rectangles[0]);
      this.demonstrateShapeUpdate(rectangles[0]);
    }
  }

  private demonstrateShapeCalculations(shape: Shape): void {
    const calc = this.warehouse.get(shape.id);
    logger.info(`Shape calculations:`, calc);
  }

  private demonstrateShapeUpdate(target: Shape): void {
    const originalPoints = [...target.points];

    logger.info(`--- Simulating shape update ---`);
    const modifiedPoints = originalPoints.map((p, i) =>
      i === 0 ? new Point(p.x + 1, p.y, p.z) : p
    );

    this.repository.updateShape(target.id, modifiedPoints);

    logger.info(`--- Reverting shape update to original ---`);
    this.repository.updateShape(target.id, originalPoints);
  }

  public async run(): Promise<void> {
    try {
      await this.processShapesFile();
      this.demonstrateSpecificationMethods();
      this.demonstrateRepositoryOperations();
    } catch (error) {
      logger.error('Application error:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  }
}