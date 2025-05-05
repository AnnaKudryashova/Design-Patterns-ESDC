import { Shape } from "../entity/shape";
import { ShapeRepository } from "../repository/shapeRepository";
import { logger } from "../util/logger";
import { DataReader } from "./dataReader";
import { GeometryService } from "./geometry/geometryService";
import { ShapeLogger } from "./shapeLogger";
import { ShapeProcessor } from "./shapeProcessor";
import fs from 'fs';
import path from 'path';

export class ShapeManager {
  private processor = new ShapeProcessor();
  private loggerService = new ShapeLogger();
  private repository = ShapeRepository.getInstance();
  private geometryService = new GeometryService();

  async processFile(filePath: string): Promise<{ success: number; errors: number }> {
    if (!fs.existsSync(filePath)) throw new Error(`File not found: ${filePath}`);
    const abs = path.resolve(filePath);
    logger.info(`Processing file: ${abs}`);

    const results = { success: 0, errors: 0 };
    try {
      const shapesData = await DataReader.read(abs);
      for (const data of shapesData) {
        try {
          const { shape, basic, extended } = this.processor.process(data);
          this.loggerService.log(shape, basic, extended, data.lineNumber);
          results.success++;
        } catch (e) {
          results.errors++;
          logger.error(`Line ${data.lineNumber}: ${e instanceof Error ? e.message : String(e)}`);
        }
      }

      logger.info(`Processing complete. Success: ${results.success}, Errors: ${results.errors}`);
      return results;
    } catch (e) {
      logger.error(`File processing failed: ${e instanceof Error ? e.message : String(e)}`);
      throw e;
    }
  }

  findInFirstQuadrant(): Shape[] {
    return this.repository.findByCriteria(
      shape => this.geometryService.isInFirstQuadrant(shape)
    );
  }

  sortByX(): Shape[] {
    return this.repository.sort(
      (a, b) => this.geometryService.getFirstPointX(a) - this.geometryService.getFirstPointX(b)
    );
  }
}