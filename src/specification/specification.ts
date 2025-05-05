import { Shape } from "../entity/shape";
import { GeometryService } from "../service/geometry/geometryService";

export class Specification {
    static byFirstQuadrant(geometryService: GeometryService): (shape: Shape) => boolean {
      return shape => {
        return geometryService.isInFirstQuadrant(shape);
      };
    }

    static byAreaRange(min: number, max: number, geometryService: GeometryService): (shape: Shape) => boolean {
      return shape => {
        const area = geometryService.calculateArea(shape);
        return area >= min && area <= max;
      };
    }

    static byDistanceFromOrigin(maxDistance: number, geometryService: GeometryService): (shape: Shape) => boolean {
      return shape => {
        const distance = geometryService.calculateDistanceFromOrigin(shape);
        return distance <= maxDistance;
      };
    }

    static sortByX(geometryService: GeometryService): (a: Shape, b: Shape) => number {
      return (a, b) => geometryService.getFirstPointX(a) - geometryService.getFirstPointX(b);
    }

    static sortByY(geometryService: GeometryService): (a: Shape, b: Shape) => number {
      return (a, b) => geometryService.getFirstPointY(a) - geometryService.getFirstPointY(b);
    }
  }