import { RectangleValidator } from '../src/validators/RectangleValidator';
import { Point } from '../src/entities/Point';

describe('RectangleValidator', () => {
    const validRectangle = [
        new Point(0, 0),
        new Point(4, 0),
        new Point(4, 3),
        new Point(0, 3),
    ];
    const invalidRectangle = [
        new Point(0, 0),
        new Point(4, 0),
        new Point(4, 0),
        new Point(0, 3),
    ];

    test('isRectangle', () => {
        expect(RectangleValidator.isRectangle(validRectangle)).toBe(true);
        expect(RectangleValidator.isRectangle(invalidRectangle)).toBe(false);
    });

    test('isSquare', () => {
        expect(RectangleValidator.isSquare(validRectangle)).toBe(false);
    });

    test('isRhombus', () => {
        expect(RectangleValidator.isRhombus(validRectangle)).toBe(false);
    });

    test('isTrapezoid', () => {
        expect(RectangleValidator.isTrapezoid(validRectangle)).toBe(true);
    });
});