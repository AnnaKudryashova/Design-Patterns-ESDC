import { ShapeValidator } from '../src/validators/ShapeValidator';

describe('ShapeValidator', () => {
    test('validateShapeData with valid data', () => {
        const data = [1, 2, 3, 4];
        expect(ShapeValidator.validateShapeData(data, 4)).toBe(true);
    });

    test('validateShapeData with invalid data', () => {
        const data = [1, 2, NaN, 4];
        expect(ShapeValidator.validateShapeData(data, 4)).toBe(false);
    });

    test('validateShapeData with incorrect length', () => {
        const data = [1, 2, 3];
        expect(ShapeValidator.validateShapeData(data, 4)).toBe(false);
    });
});