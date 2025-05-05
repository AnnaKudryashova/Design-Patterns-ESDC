import { GeometryHelper } from "../service/geometry/geometryHelper";

export class RectangleValidator {
  validate(coords: string[]): boolean {
    if (coords.length !== 8) return false;

    if (!GeometryHelper.areAllNumbers(coords)) return false;

    const nums = coords.map(Number);

    const points = [
      { x: nums[0], y: nums[1] },
      { x: nums[2], y: nums[3] },
      { x: nums[4], y: nums[5] },
      { x: nums[6], y: nums[7] }
    ];

    if (this.hasDuplicatePoints(points)) return false;

    return this.isValidRectangle(points);
  }

  private hasDuplicatePoints(points: {x: number, y: number}[]): boolean {
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        if (GeometryHelper.arePointsEqual(points[i], points[j])) {
          return true;
        }
      }
    }
    return false;
  }

  private isValidRectangle(points: {x: number, y: number}[]): boolean {
    const [p1, p2, p3, p4] = points;

    // Calculate all side lengths
    const d12 = GeometryHelper.distance(p1, p2);
    const d23 = GeometryHelper.distance(p2, p3);
    const d34 = GeometryHelper.distance(p3, p4);
    const d41 = GeometryHelper.distance(p4, p1);

    // Calculate diagonal lengths
    const d13 = GeometryHelper.distance(p1, p3);
    const d24 = GeometryHelper.distance(p2, p4);

    // Check opposite sides are equal
    if (!GeometryHelper.areEqual(d12, d34)) return false;
    if (!GeometryHelper.areEqual(d23, d41)) return false;

    // Check diagonals are equal
    if (!GeometryHelper.areEqual(d13, d24)) return false;

    if (GeometryHelper.areCollinear(p1, p2, p3)) return false;

    // Check angles are 90 degrees
    return GeometryHelper.isRightAngle(p1, p2, p3) &&
           GeometryHelper.isRightAngle(p2, p3, p4) &&
           GeometryHelper.isRightAngle(p3, p4, p1) &&
           GeometryHelper.isRightAngle(p4, p1, p2);
  }
}