import { Sphere } from '../../entity/sphere';
import { BaseGeometryService } from './baseGeometryService';

export class SphereGeometryService extends BaseGeometryService {

  calculateSurfaceArea(sphere: Sphere): number {
    return 4 * Math.PI * Math.pow(sphere.radius, 2);
  }

  calculateVolume(sphere: Sphere): number {
    return (4/3) * Math.PI * Math.pow(sphere.radius, 3);
  }

  touchesCoordinatePlane(sphere: Sphere): boolean {
    const { x, y, z } = sphere.center;
    const r = sphere.radius;
    return (
      Math.abs(x) === r ||
      Math.abs(y) === r ||
      Math.abs(z) === r
    );
  }

  getPlaneSplitVolumeRatio(sphere: Sphere, plane: 'xy' | 'xz' | 'yz'): number {
    const d = Math.abs(
      plane === 'xy' ? sphere.center.z :
      plane === 'xz' ? sphere.center.y :
      sphere.center.x
    );

    if (d >= sphere.radius) return 0;

    const h = sphere.radius - d;
    const volumeSmall = (Math.PI * h * h * (3 * sphere.radius - h)) / 3;
    const volumeTotal = this.calculateVolume(sphere);

    return volumeSmall / (volumeTotal - volumeSmall);
  }

  calculateCenterDistanceFromOrigin(sphere: Sphere): number {
    return this.distanceFromOrigin(sphere.center);
  }
}