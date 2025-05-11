import { Shape } from "../entity/shape";
import { ShapeRepository } from "../repository/shapeRepository";
import { SpecificationFactory } from "../specification/specification";
import { logger } from "../util/logger";
import { DataReader } from "./dataReader";
import { GeometryService } from "./geometry/geometryService";
import { ShapeLogger } from "./shapeLogger";
import { ShapeProcessor } from "./shapeProcessor";
import fs from 'fs';
import path from 'path';

export class ShapeManager {
  private readonly processor: ShapeProcessor;
  private readonly loggerService: ShapeLogger;
  private readonly repository: ShapeRepository;
  private readonly geometryService: GeometryService;

  constructor(
    processor = new ShapeProcessor(),
    loggerService = new ShapeLogger(),
    repository = ShapeRepository.getInstance(),
    geometryService = new GeometryService()
  ) {
    this.processor = processor;
    this.loggerService = loggerService;
    this.repository = repository;
    this.geometryService = geometryService;
  }

  async processFile(filePath: string): Promise<{ success: number; errors: number }> {
    const abs = this.validateAndResolvePath(filePath);
    logger.info(`Processing file: ${abs}`);

    const results = { success: 0, errors: 0 };
    try {
      const shapesData = await DataReader.read(abs);
      for (const data of shapesData) {
        try {
          const { shape, basic, extended } = this.processor.process(data);
          this.loggerService.log(shape, basic, extended, data.lineNumber);
          results.success++;
        } catch (error) {
          results.errors++;
          this.logError(data.lineNumber, error);
        }
      }

      logger.info(`Processing complete. Success: ${results.success}, Errors: ${results.errors}`);
      return results;
    } catch (error) {
      this.logError('File processing', error);
      throw error;
    }
  }

  private validateAndResolvePath(filePath: string): string {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    return path.resolve(filePath);
  }

  private logError(context: string | number, error: unknown): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`${context} failed: ${errorMessage}`);
  }

  findInFirstQuadrant(): Shape[] {
    return this.repository.findBySpecification(
      SpecificationFactory.byFirstQuadrant(this.geometryService)
    );
  }

  findShapesInAreaRange(min: number, max: number): Shape[] {
    return this.repository.findBySpecification(
      SpecificationFactory.byAreaRange(min, max, this.geometryService)
    );
  }

  findShapesNearOrigin(maxDistance: number): Shape[] {
    return this.repository.findBySpecification(
      SpecificationFactory.byDistanceFromOrigin(maxDistance, this.geometryService)
    );
  }

  sortByX(): Shape[] {
    return this.repository.sortBySpecification(
      SpecificationFactory.sortByX(this.geometryService)
    );
  }

  sortByY(): Shape[] {
    return this.repository.sortBySpecification(
      SpecificationFactory.sortByY(this.geometryService)
    );
  }
}