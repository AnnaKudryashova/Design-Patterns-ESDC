import { ShapeMetrics } from "../types";
import { logger } from "../util/logger";


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

  private formatMetrics(metrics: ShapeMetrics): ShapeMetrics {
    return {
      area: Number(metrics.area.toFixed(2)),
      perimeter: metrics.perimeter ? Number(metrics.perimeter.toFixed(2)) : undefined,
      volume: metrics.volume ? Number(metrics.volume.toFixed(2)) : undefined
    };
  }

  private areMetricsEqual(existing: ShapeMetrics, newMetrics: ShapeMetrics): boolean {
    const epsilon = 0.001; // Small value for floating-point comparison

    // Compare area
    const areaEqual = Math.abs(existing.area - newMetrics.area) < epsilon;

    // Compare perimeter
    const perimeterEqual =
      (existing.perimeter === undefined && newMetrics.perimeter === undefined) ||
      (existing.perimeter !== undefined && newMetrics.perimeter !== undefined &&
       Math.abs(existing.perimeter - newMetrics.perimeter) < epsilon);

    // Compare volume
    const volumeEqual =
      (existing.volume === undefined && newMetrics.volume === undefined) ||
      (existing.volume !== undefined && newMetrics.volume !== undefined &&
       Math.abs(existing.volume - newMetrics.volume) < epsilon);

    return areaEqual && perimeterEqual && volumeEqual;
  }

  update(id: string, metrics: ShapeMetrics): void {
    const formattedMetrics = this.formatMetrics(metrics);
    const existing = this.metrics.get(id);
    if (existing && this.areMetricsEqual(existing, formattedMetrics)) {
      logger.info(`Warehouse: No changes detected for shape ${id}, skipping update.`);
      return;
    }

    const action = existing ? 'Updated' : 'Added';
    this.metrics.set(id, formattedMetrics);
    logger.info(`Warehouse: ${action} metrics for shape ${id}: ${JSON.stringify(formattedMetrics)}`);
  }

  get(id: string): ShapeMetrics | undefined {
    const data = this.metrics.get(id);
    if (data) {
      logger.info(`Warehouse: Retrieved metrics for shape ${id}: ${JSON.stringify(data)}`);
    }
    return data;
  }

  remove(id: string): void {
    this.metrics.delete(id);
    logger.info(`Warehouse: Removed metrics for shape ${id}`);
  }
}