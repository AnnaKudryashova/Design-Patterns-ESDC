import { Point } from '../../entity/point';

export abstract class BaseGeometryService {

  protected distance(p1: Point, p2: Point): number {
    return Math.sqrt(
      Math.pow(p2.x - p1.x, 2) +
      Math.pow(p2.y - p1.y, 2) +
      Math.pow(p2.z - p1.z, 2)
    );
  }

  protected areEqual(a: number, b: number, tolerance = 0.0001): boolean {
    return Math.abs(a - b) < tolerance;
  }

  protected distanceFromOrigin(point: Point): number {
    return this.distance(new Point(0, 0, 0), point);
  }

  protected isRightAngle(a: {x: number, y: number}, b: {x: number, y: number}, c: {x: number, y: number}): boolean {
    const abx = b.x - a.x;
    const aby = b.y - a.y;
    const cbx = b.x - c.x;
    const cby = b.y - c.y;
    const dotProduct = abx * cbx + aby * cby;
    return this.areEqual(dotProduct, 0);
  }

  protected areAllNumbers(coords: string[]): boolean {
    return coords.every(c => !isNaN(Number(c)));
  }

  protected slope(p1: Point, p2: Point): number {
    if (p2.x - p1.x === 0) return Number.POSITIVE_INFINITY;
    return (p2.y - p1.y) / (p2.x - p1.x);
  }

  protected slopesEqual(m1: number, m2: number): boolean {
    if (!isFinite(m1) && !isFinite(m2)) return true;
    return Math.abs(m1 - m2) < 1e-10;
  }
}