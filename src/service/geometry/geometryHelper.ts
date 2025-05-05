export class GeometryHelper {
    static distance(a: {x: number, y: number}, b: {x: number, y: number}): number {
      return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
    }

    static areEqual(a: number, b: number, tolerance = 0.0001): boolean {
      return Math.abs(a - b) < tolerance;
    }

    static arePointsEqual(a: {x: number, y: number}, b: {x: number, y: number}): boolean {
      return this.areEqual(a.x, b.x) && this.areEqual(a.y, b.y);
    }

    static isRightAngle(a: {x: number, y: number}, b: {x: number, y: number}, c: {x: number, y: number}): boolean {
      const abx = b.x - a.x;
      const aby = b.y - a.y;
      const cbx = b.x - c.x;
      const cby = b.y - c.y;

      const dotProduct = abx * cbx + aby * cby;
      return this.areEqual(dotProduct, 0);
    }

    static areAllNumbers(coords: string[]): boolean {
      return coords.every(c => !isNaN(Number(c)));
    }

    static areCollinear(a: {x: number, y: number}, b: {x: number, y: number}, c: {x: number, y: number}): boolean {
        const area =
          a.x * (b.y - c.y) +
          b.x * (c.y - a.y) +
          c.x * (a.y - b.y);
        return Math.abs(area) < Number.EPSILON;
      }
  }