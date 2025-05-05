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

  isSquare(rectangle: Rectangle): boolean {
    if (rectangle.points.length !== 4) return false;

    const [p1, p2, p3] = rectangle.points;
    const side1 = this.distance(p1, p2);
    const side2 = this.distance(p2, p3);

    return Math.abs(side1 - side2) < Number.EPSILON;
  }

  isRhombus(rectangle: Rectangle): boolean {
    if (rectangle.points.length !== 4) return false;

    const [p1, p2, p3, p4] = rectangle.points;
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

  isTrapezoid(rectangle: Rectangle): boolean {
    if (rectangle.points.length !== 4) return false;

    const [p1, p2, p3, p4] = rectangle.points;
    const slope1 = this.slope(p1, p2);
    const slope2 = this.slope(p3, p4);
    const slope3 = this.slope(p2, p3);
    const slope4 = this.slope(p4, p1);

    return (
      Math.abs(slope1 - slope2) < Number.EPSILON ||
      Math.abs(slope3 - slope4) < Number.EPSILON
    );
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