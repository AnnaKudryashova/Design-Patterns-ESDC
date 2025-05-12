import { Rectangle } from '../../entity/rectangle';
import { Point } from '../../entity/point';
import { BaseGeometryService } from './baseGeometryService';

export class RectangleGeometryService extends BaseGeometryService {

  calculateArea(rectangle: Rectangle): number {
    const points = rectangle.points;
    let area = 0;
    const n = points.length;

    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      area += points[i].x * points[j].y;
      area -= points[j].x * points[i].y;
    }

    return Math.abs(area) / 2;
  }

  calculatePerimeter(rectangle: Rectangle): number {
    const points = rectangle.points;
    let perimeter = 0;
    const n = points.length;

    for (let i = 0; i < n; i++) {
      perimeter += this.distance(points[i], points[(i + 1) % n]);
    }

    return perimeter;
  }

  private areSidesEqual(points: Point[]): boolean {
    const [p1, p2, p3, p4] = points;
    const side1 = this.distance(p1, p2);
    const side2 = this.distance(p2, p3);
    const side3 = this.distance(p3, p4);
    const side4 = this.distance(p4, p1);

    return (
      Math.abs(side1 - side2) < Number.EPSILON &&
      Math.abs(side2 - side3) < Number.EPSILON &&
      Math.abs(side3 - side4) < Number.EPSILON
    );
  }

  private areOppositeSidesParallel(points: Point[]): boolean {
    const [p1, p2, p3, p4] = points;
    const slope1 = this.slope(p1, p2);
    const slope2 = this.slope(p3, p4);
    const slope3 = this.slope(p2, p3);
    const slope4 = this.slope(p4, p1);

    return (
      this.slopesEqual(slope1, slope2) &&
      this.slopesEqual(slope3, slope4)
    );
  }

  private areAdjacentSidesPerpendicular(points: Point[]): boolean {
    const [p1, p2, p3, p4] = points;
    const slope1 = this.slope(p1, p2);
    const slope2 = this.slope(p2, p3);
    const slope3 = this.slope(p3, p4);
    const slope4 = this.slope(p4, p1);

    // Two lines are perpendicular if the product of their slopes is -1
    return (
      Math.abs(slope1 * slope2 + 1) < Number.EPSILON &&
      Math.abs(slope2 * slope3 + 1) < Number.EPSILON &&
      Math.abs(slope3 * slope4 + 1) < Number.EPSILON &&
      Math.abs(slope4 * slope1 + 1) < Number.EPSILON
    );
  }

  isSquare(rectangle: Rectangle): boolean {
    if (rectangle.points.length !== 4) return false;

    // A square must have:
    // 1. All sides equal
    // 2. All angles 90 degrees (adjacent sides perpendicular)
    // 3. Opposite sides parallel
    return (
      this.areSidesEqual(rectangle.points) &&
      this.areAdjacentSidesPerpendicular(rectangle.points) &&
      this.areOppositeSidesParallel(rectangle.points)
    );
  }

  isRhombus(rectangle: Rectangle): boolean {
    if (rectangle.points.length !== 4) return false;

    // A rhombus must have:
    // 1. All sides equal
    // 2. Opposite sides parallel
    // 3. Adjacent sides NOT perpendicular (to distinguish from square)
    return (
      this.areSidesEqual(rectangle.points) &&
      this.areOppositeSidesParallel(rectangle.points) &&
      !this.areAdjacentSidesPerpendicular(rectangle.points)
    );
  }

  isTrapezoid(rectangle: Rectangle): boolean {
    if (rectangle.points.length !== 4) return false;

    const [p1, p2, p3, p4] = rectangle.points;
    const slope1 = this.slope(p1, p2);
    const slope2 = this.slope(p3, p4);
    const slope3 = this.slope(p2, p3);
    const slope4 = this.slope(p4, p1);

    // A trapezoid must have:
    // 1. Exactly one pair of parallel sides
    // 2. Non-parallel sides must not be equal in length
    const hasParallelSides = this.slopesEqual(slope1, slope2) || this.slopesEqual(slope3, slope4);
    const nonParallelSidesEqual = 
      (this.slopesEqual(slope1, slope2) && Math.abs(this.distance(p2, p3) - this.distance(p4, p1)) < Number.EPSILON) ||
      (this.slopesEqual(slope3, slope4) && Math.abs(this.distance(p1, p2) - this.distance(p3, p4)) < Number.EPSILON);

    return hasParallelSides && !nonParallelSidesEqual;
  }

  areCollinear(p1: Point, p2: Point, p3: Point): boolean {
    const area =
      p1.x * (p2.y - p3.y) +
      p2.x * (p3.y - p1.y) +
      p3.x * (p1.y - p2.y);
    return Math.abs(area) < Number.EPSILON;
  }

  calculateCentroid(rectangle: Rectangle): Point {
    const avgX = rectangle.points.reduce((sum, p) => sum + p.x, 0) / 4;
    const avgY = rectangle.points.reduce((sum, p) => sum + p.y, 0) / 4;
    return new Point(avgX, avgY, 0);
  }
}