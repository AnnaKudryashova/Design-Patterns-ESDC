import { logger } from "../util/logger";
import { ShapeMetrics } from "./shapeMetrics";

export class Warehouse {
  private static instance: Warehouse;
  private metrics = new Map<string, ShapeMetrics>();

  private constructor() {
    logger.info("Warehouse instance created.");
  }

  static getInstance(): Warehouse {
    if (!Warehouse.instance) {
      Warehouse.instance = new Warehouse();
    }
    return Warehouse.instance;
  }

  update(id: string, metrics: ShapeMetrics): void {
    const existing = this.metrics.get(id);
    if (existing && JSON.stringify(existing) === JSON.stringify(metrics)) {
      logger.info(`Warehouse: No changes detected for shape ${id}, skipping update.`);
      return;
    }

    const action = existing ? 'Updated' : 'Added';
    this.metrics.set(id, metrics);
    logger.info(`Warehouse: ${action} metrics for shape ${id}: ${JSON.stringify(metrics)}`);
  }

  get(id: string): ShapeMetrics | undefined {
    const data = this.metrics.get(id);
    logger.info(`Warehouse: Retrieved metrics for shape ${id}: ${JSON.stringify(data)}`);
    return data;
  }

  remove(id: string): void {
    this.metrics.delete(id);
    logger.info(`Warehouse: Removed metrics for shape ${id}`);
  }
}