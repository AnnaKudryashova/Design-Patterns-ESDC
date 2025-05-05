import { Shape } from '../../entity/shape';
import { Rectangle } from '../../entity/rectangle';
import { Sphere } from '../../entity/sphere';
import { BaseGeometryService } from './baseGeometryService';
import { RectangleGeometryService } from './rectangleGeometryService';
import { SphereGeometryService } from './sphereGeometryService';

export class GeometryService extends BaseGeometryService {
  private rectangleService = new RectangleGeometryService();
  private sphereService = new SphereGeometryService();


  calculateArea(shape: Shape): number {
    switch (shape.type) {
      case 'rectangle':
        return this.rectangleService.calculateArea(shape as Rectangle);
      case 'sphere':
        return this.sphereService.calculateSurfaceArea(shape as Sphere);
      default:
        throw new Error(`Unsupported shape type: ${shape.type}`);
    }
  }

  calculatePerimeter(shape: Shape): number {
    if (shape.type !== 'rectangle') return 0;
    return this.rectangleService.calculatePerimeter(shape as Rectangle);
  }

  calculateVolume(shape: Shape): number {
    if (shape.type !== 'sphere') return 0;
    return this.sphereService.calculateVolume(shape as Sphere);
  }


  calculateDistanceFromOrigin(shape: Shape): number {
    switch (shape.type) {
      case 'rectangle':
        const centroid = this.rectangleService.calculateCentroid(shape as Rectangle);
        return this.distanceFromOrigin(centroid);
      case 'sphere':
        return this.sphereService.calculateCenterDistanceFromOrigin(shape as Sphere);
      default:
        return 0;
    }
  }

  isInFirstQuadrant(shape: Shape): boolean {
    if (shape.type === 'rectangle') {
      const rect = shape as Rectangle;
      return (
        rect.p1.x > 0 && rect.p1.y > 0 &&
        rect.p2.x > 0 && rect.p2.y > 0 &&
        rect.p3.x > 0 && rect.p3.y > 0 &&
        rect.p4.x > 0 && rect.p4.y > 0
      );
    } else if (shape.type === 'sphere') {
      const sphere = shape as Sphere;
      return (
        sphere.center.x > 0 &&
        sphere.center.y > 0 &&
        sphere.center.z > 0
      );
    }
    return false;
  }

  getFirstPointX(shape: Shape): number {
    if (shape.type === 'rectangle') {
      return (shape as Rectangle).p1.x;
    } else if (shape.type === 'sphere') {
      return (shape as Sphere).center.x;
    }
    return 0;
  }

  getFirstPointY(shape: Shape): number {
    if (shape.type === 'rectangle') {
      return (shape as Rectangle).p1.y;
    } else if (shape.type === 'sphere') {
      return (shape as Sphere).center.y;
    }
    return 0;
  }

  isSquare(shape: Shape): boolean {
    if (shape.type !== 'rectangle') return false;
    return this.rectangleService.isSquare(shape as Rectangle);
  }

  isRhombus(shape: Shape): boolean {
    if (shape.type !== 'rectangle') return false;
    return this.rectangleService.isRhombus(shape as Rectangle);
  }

  isTrapezoid(shape: Shape): boolean {
    if (shape.type !== 'rectangle') return false;
    return this.rectangleService.isTrapezoid(shape as Rectangle);
  }

  touchesCoordinatePlane(shape: Shape): boolean {
    if (shape.type !== 'sphere') return false;
    return this.sphereService.touchesCoordinatePlane(shape as Sphere);
  }

  getPlaneSplitVolumeRatio(shape: Shape, plane: 'xy' | 'xz' | 'yz'): number {
    if (shape.type !== 'sphere') return 0;
    return this.sphereService.getPlaneSplitVolumeRatio(shape as Sphere, plane);
  }
}