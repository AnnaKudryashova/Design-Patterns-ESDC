import { Point } from "../entity/point";
import { Shape } from "../entity/shape";
import { ShapeFactoryProvider } from "../factory/shapeFactoryProvider";
import { ShapeRepository } from "../repository/shapeRepository";
import { ValidatorProvider } from "../validator/validatorProvider";
import { ExtendedMetrics } from "../warehouse/extendedMetrics";
import { ShapeMetrics } from "../warehouse/shapeMetrics";
import { GeometryService } from "./geometry/geometryService";
import { v4 as uuidv4 } from 'uuid';

export class ShapeProcessor {
    constructor(
      private factoryProvider = ShapeFactoryProvider.getInstance(),
      private validatorProvider = new ValidatorProvider(),
      private geometryService = new GeometryService(),
      private repository = ShapeRepository.getInstance()
    ) {}

    process(data: any): { shape: Shape; basic: ShapeMetrics; extended: ExtendedMetrics } {
      if (!data || typeof data !== 'object' || !data.type || !Array.isArray(data.rawCoordinates)) {
        throw new Error('Invalid data format');
      }

      const validator = this.validatorProvider.getValidator(data.type);
      if (!validator.validate(data.rawCoordinates)) {
        throw new Error(`Invalid ${data.type} data format`);
      }

      const shape = this.createShape(data.type, data.rawCoordinates);
      const basic = this.calculateBasicMetrics(shape);
      const extended = this.calculateExtendedMetrics(shape);

      this.repository.add(shape);

      return { shape, basic, extended };
    }

    private createShape(type: string, coords: any): Shape {
      const factory = this.factoryProvider.getFactory(type);
      const id = uuidv4();

      if (type === 'rectangle') {
        const flat = coords.map(Number);
        const points: Point[] = [];

        for (let i = 0; i < flat.length;) {
          const x = flat[i++];
          const y = flat[i++];
          let z = 0;
          if (i < flat.length && (flat.length / 4) > 2) z = flat[i++];
          points.push(new Point(x, y, z));
        }

        if (points.length !== 4) {
          throw new Error(`Rectangle requires exactly 4 points, got ${points.length}`);
        }

        return factory.create(id, points);
      }

      return factory.create(id, coords);
    }

    private calculateBasicMetrics(shape: Shape): ShapeMetrics {
      return {
        area: this.geometryService.calculateArea(shape),
        perimeter: shape.type === 'rectangle' ? this.geometryService.calculatePerimeter(shape) : undefined,
        volume: shape.type === 'sphere' ? this.geometryService.calculateVolume(shape) : undefined,
      };
    }

    private calculateExtendedMetrics(shape: Shape): ExtendedMetrics {
      const base = {
        distance: this.geometryService.calculateDistanceFromOrigin(shape)
      };

      return shape.type === 'rectangle'
        ? {
            ...base,
            isSquare: this.geometryService.isSquare(shape),
            isRhombus: this.geometryService.isRhombus(shape),
            isTrapezoid: this.geometryService.isTrapezoid(shape)
          }
        : {
            ...base,
            touchesPlane: this.geometryService.touchesCoordinatePlane(shape),
            planeSplitRatio: this.geometryService.getPlaneSplitVolumeRatio(shape, 'xy')
          };
    }
  }
