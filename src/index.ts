import path from 'path';
import { ShapeManager } from './service/shapeManager';
import { ShapeRepository } from './repository/shapeRepository';
import { logger } from './util/logger';
import { Warehouse } from './warehouse/warehouse';
import { Point } from './entity/point';

async function main() {
  const shapeManager = new ShapeManager();

  try {
    const dataFilePath = path.join(__dirname, '../data/shapes.txt');
    await shapeManager.processFile(dataFilePath);

    const repository = ShapeRepository.getInstance();
    const warehouse = Warehouse.getInstance();

    const rectangles = repository.findByType('rectangle');
    logger.info(`Found ${rectangles.length} rectangles`);

    const spheres = repository.findByType('sphere');
    logger.info(`Found ${spheres.length} spheres`);

    if (rectangles.length > 0) {
      const calc = warehouse.get(rectangles[0].id);
      logger.info(`First rectangle calculations:`, calc);
    }

    if (rectangles.length > 0) {
      const target = rectangles[0];
      const originalPoints = [...target.points];

      logger.info(`--- Simulating shape update ---`);

      const modifiedPoints = originalPoints.map((p, i) =>
        i === 0 ? new Point(p.x + 1, p.y, p.z) : p
      );

      repository.updateShape(target.id, modifiedPoints);

      // Optionally: update back to original to see no changes triggered
      logger.info(`--- Reverting shape update to original ---`);
      repository.updateShape(target.id, originalPoints);
    }

  } catch (error) {
    logger.error('Application error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }

}

main();