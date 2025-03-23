import { Point } from '../entities/Point';
import { Rectangle } from '../entities/Rectangle';
import { RectangleValidator } from '../validators/RectangleValidator';

export class RectangleService {
    static calculateArea(rectangle: Rectangle): number {
        const [p1, p2, p3] = rectangle.points;
        const length = this.distance(p1, p2);
        const width = this.distance(p2, p3);
        return length * width;
    }

    static calculatePerimeter(rectangle: Rectangle): number {
        const [p1, p2, p3] = rectangle.points;
        const length = this.distance(p1, p2);
        const width = this.distance(p2, p3);
        return 2 * (length + width);
    }

    static isValid(rectangle: Rectangle): boolean {
        return RectangleValidator.isRectangle(rectangle.points);
    }

    static isSquare(rectangle: Rectangle): boolean {
        return RectangleValidator.isSquare(rectangle.points);
    }

    static isRhombus(rectangle: Rectangle): boolean {
        return RectangleValidator.isRhombus(rectangle.points);
    }

    static isTrapezoid(rectangle: Rectangle): boolean {
        return RectangleValidator.isTrapezoid(rectangle.points);
    }

    private static distance(p1: Point, p2: Point): number {
        return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
    }
}