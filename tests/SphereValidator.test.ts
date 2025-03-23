import { SphereValidator } from '../src/validators/SphereValidator';
import { Sphere } from '../src/entities/Sphere';
import { Point } from '../src/entities/Point';

describe('SphereValidator', () => {
    const validSphere = new Sphere('Sphere1', [new Point(0, 0, 0)], 5);
    const invalidSphere = new Sphere('Sphere2', [new Point(0, 0, 0)], -5);

    test('isSphere', () => {
        expect(SphereValidator.isSphere(validSphere)).toBe(true);
        expect(SphereValidator.isSphere(invalidSphere)).toBe(false);
    });

    test('touchesCoordinatePlane', () => {
        expect(SphereValidator.touchesCoordinatePlane(validSphere)).toBe(false);
    });
});