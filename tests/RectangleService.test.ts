// import { RectangleService } from '../src/services/RectangleService';
// import { Rectangle } from '../src/entities/Rectangle';
// import { Point } from '../src/entities/Point';

// describe('RectangleService', () => {
//     const validRectangle = new Rectangle('Rect1', [
//         new Point(0, 0),
//         new Point(4, 0),
//         new Point(4, 3),
//     ]);

//     test('calculateArea', () => {
//         expect(RectangleService.calculateArea(validRectangle)).toBe(12);
//     });

//     test('calculatePerimeter', () => {
//         expect(RectangleService.calculatePerimeter(validRectangle)).toBe(14);
//     });

//     test('isValid', () => {
//         expect(RectangleService.isValid(validRectangle)).toBe(true);
//     });

//     test('isSquare', () => {
//         expect(RectangleService.isSquare(validRectangle)).toBe(false);
//     });

//     test('isRhombus', () => {
//         expect(RectangleService.isRhombus(validRectangle)).toBe(false);
//     });

//     test('isTrapezoid', () => {
//         expect(RectangleService.isTrapezoid(validRectangle)).toBe(true);
//     });
// });

import { RectangleService } from '../src/services/RectangleService';
import { Rectangle } from '../src/entities/Rectangle';
import { Point } from '../src/entities/Point';

describe('RectangleService', () => {
    // Define a valid rectangle with 4 points
    const validRectangle = new Rectangle('Rect1', [
        new Point(0, 0),
        new Point(4, 0),
        new Point(4, 3),
        new Point(0, 3),
    ]);

    test('calculateArea', () => {
        expect(RectangleService.calculateArea(validRectangle)).toBe(12);
    });

    test('calculatePerimeter', () => {
        expect(RectangleService.calculatePerimeter(validRectangle)).toBe(14);
    });

    test('isValid', () => {
        expect(RectangleService.isValid(validRectangle)).toBe(true);
    });

    test('isSquare', () => {
        expect(RectangleService.isSquare(validRectangle)).toBe(false);
    });

    test('isRhombus', () => {
        expect(RectangleService.isRhombus(validRectangle)).toBe(false);
    });

    test('isTrapezoid', () => {
        expect(RectangleService.isTrapezoid(validRectangle)).toBe(true);
    });
});