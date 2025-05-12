import { Shape } from "../entity/shape";
import { Point } from "../entity/point";
import { ShapeRepository } from "../repository/shapeRepository";
import { SpecificationFactory } from "../specification/specification";
import { logger } from "../util/logger";
import { DataReader } from "./dataReader";
import { GeometryService } from "./geometry/geometryService";
import { ShapeLogger } from "./shapeLogger";
import { ShapeProcessor } from "./shapeProcessor";
import { ERROR_MESSAGES, SHAPE_TYPES } from "../constants";
import { ProcessingResult, IShapeManager, IShapeProcessor, IShapeLogger, ShapeMetrics } from "../types";
import { ShapeNotFoundError, InvalidShapeTypeError } from "../exception/shapeExceptions";
import { CustomException } from "../exception/customException";

export class ShapeManager implements IShapeManager {
  constructor(
    private readonly processor: IShapeProcessor = new ShapeProcessor(),
    private readonly loggerService: IShapeLogger = new ShapeLogger(),
    private readonly repository: ShapeRepository = ShapeRepository.getInstance(),
    private readonly geometryService: GeometryService = new GeometryService()
  ) {}

  async processFile(filePath: string): Promise<ProcessingResult> {
    logger.info(`Processing file: ${filePath}`);

    const results: ProcessingResult = { success: 0, errors: 0 };
    try {
      const dataReader = new DataReader(filePath);
      const shapesData = await dataReader.read();

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
      throw new CustomException(ERROR_MESSAGES.PROCESSING_ERROR, error instanceof Error ? error : undefined);
    }
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
    if (min > max) {
      throw new CustomException('Minimum area cannot be greater than maximum area');
    }
    return this.repository.findBySpecification(
      SpecificationFactory.byAreaRange(min, max, this.geometryService)
    );
  }

  findShapesNearOrigin(maxDistance: number): Shape[] {
    if (maxDistance < 0) {
      throw new CustomException('Maximum distance cannot be negative');
    }
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

  findByType(type: string): Shape[] {
    if (!Object.values(SHAPE_TYPES).includes(type as any)) {
      throw new InvalidShapeTypeError(type);
    }
    return this.repository.findByType(type);
  }

  updateShape(id: string, points: Point[]): void {
    const shape = this.repository.get(id);
    if (!shape) {
      throw new ShapeNotFoundError(id);
    }

    if (shape.type === 'sphere') {
      const newCenter = points[0];
      this.repository.updateShape(id, [newCenter]);
    } else {
      this.repository.updateShape(id, points);
    }
  }

  getShapeMetrics(id: string): ShapeMetrics {
    const shape = this.repository.get(id);
    if (!shape) {
      throw new ShapeNotFoundError(id);
    }
    return {
      area: this.geometryService.calculateArea(shape),
      perimeter: shape.type === 'rectangle' ? this.geometryService.calculatePerimeter(shape) : undefined,
      volume: shape.type === 'sphere' ? this.geometryService.calculateVolume(shape) : undefined
    };
  }
}