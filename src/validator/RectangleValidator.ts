import { Point } from '../entity/Point';

export class RectangleValidator {
    static isRectangle(points: Point[]): boolean {
        if (points.length !== 4) return false;

        const [p1, p2, p3, p4] = points;

        // Check if opposite sides are equal and parallel
        const diagonal1 = this.distance(p1, p3);
        const diagonal2 = this.distance(p2, p4);
        return diagonal1 === diagonal2;
    }

    static isSquare(points: Point[]): boolean {
        if (!this.isRectangle(points)) return false;

        const [p1, p2, p3] = points;
        const side1 = this.distance(p1, p2);
        const side2 = this.distance(p2, p3);
        return side1 === side2;
    }

    static isRhombus(points: Point[]): boolean {
        if (!this.isRectangle(points)) return false;

        const [p1, p2, p3] = points;
        const side1 = this.distance(p1, p2);
        const side2 = this.distance(p2, p3);
        return side1 === side2;
    }

    static isTrapezoid(points: Point[]): boolean {
        if (points.length !== 4) return false;

        const [p1, p2, p3, p4] = points;
        const slope1 = this.slope(p1, p2);
        const slope2 = this.slope(p3, p4);
        const slope3 = this.slope(p2, p3);
        const slope4 = this.slope(p4, p1);

        return slope1 === slope2 || slope3 === slope4;
    }

    private static distance(p1: Point, p2: Point): number {
        return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
    }

    private static slope(p1: Point, p2: Point): number {
        return (p2.y - p1.y) / (p2.x - p1.x);
    }
}